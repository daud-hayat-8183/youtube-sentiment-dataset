import os
import json
import pandas as pd
from datetime import datetime
from typing import Dict, Any, Tuple
from pathlib import Path

class DataExporter:
    def __init__(self, base_dir: str = "data"):
        self.base_dir = Path(base_dir)
        self.raw_dir = self.base_dir / "raw"
        self.combined_dir = self.base_dir / "combined"
        
        # Ensure directories exist
        self.raw_dir.mkdir(parents=True, exist_ok=True)
        self.combined_dir.mkdir(parents=True, exist_ok=True)

    def export_video_data(
        self, 
        video_id: str, 
        video_info: Dict[str, Any], 
        df_raw: pd.DataFrame, 
        df_processed: pd.DataFrame
    ) -> str:
        """
        Exports all collected data for a single video to its dedicated folder.
        Returns the path to the output directory.
        """
        # Create a dedicated directory for this video
        # We sanitize the video ID just in case, though it should be alphanumeric
        safe_video_id = "".join([c for c in video_id if c.isalnum() or c in "_-"])
        out_dir = self.raw_dir / safe_video_id
        out_dir.mkdir(exist_ok=True)

        # 1. Export Video Info
        df_video = pd.DataFrame([video_info])
        df_video.to_csv(out_dir / "video_info.csv", index=False, encoding="utf-8-sig")

        # 2. Export Raw Comments
        df_raw.to_csv(out_dir / "comments_raw.csv", index=False, encoding="utf-8-sig")

        # 3. Export Processed Comments
        df_processed.to_csv(out_dir / "comments_processed.csv", index=False, encoding="utf-8-sig")

        # 4. Generate Summary Report
        summary = self._generate_summary(video_info, df_raw)
        
        # Save summary as JSON
        with open(out_dir / "summary_report.json", "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=4)
            
        # Save summary as TXT
        self._write_txt_summary(summary, out_dir / "summary_report.txt")

        # 5. Export Excel Workbook
        self._export_excel(out_dir / "youtube_dataset.xlsx", df_video, df_processed, summary)

        return str(out_dir)

    def _generate_summary(self, video_info: Dict[str, Any], df_raw: pd.DataFrame) -> Dict[str, Any]:
        """Generates a summary dictionary with collection stats and data quality checks."""
        top_level_count = 0
        reply_count = 0
        total_rows = len(df_raw)
        
        avg_likes = 0.0
        max_likes = 0
        
        if total_rows > 0:
            top_level_count = len(df_raw[df_raw["comment_type"] == "TOP_LEVEL"])
            reply_count = len(df_raw[df_raw["comment_type"] == "REPLY"])
            avg_likes = float(df_raw["comment_like_count"].mean())
            max_likes = int(df_raw["comment_like_count"].max())

        # Data Quality Checks
        empty_comments = 0
        missing_parents = 0
        if total_rows > 0:
            empty_comments = len(df_raw[df_raw["comment_text"].isna() | (df_raw["comment_text"] == "")])
            
            replies = df_raw[df_raw["comment_type"] == "REPLY"]
            top_level_ids = set(df_raw[df_raw["comment_type"] == "TOP_LEVEL"]["comment_id"])
            missing_parents = len(replies[~replies["parent_comment_id"].isin(top_level_ids)])

        return {
            "collection_timestamp": datetime.now().isoformat(),
            "video_metadata": {
                "title": video_info.get("title"),
                "channel_name": video_info.get("channel_name"),
                "published_at": video_info.get("published_at")
            },
            "youtube_reported_stats": {
                "total_views": video_info.get("view_count"),
                "total_likes": video_info.get("like_count"),
                "total_comments": video_info.get("comment_count"),
                "dislike_count_available": video_info.get("dislike_count_available")
            },
            "actual_collection_stats": {
                "total_rows_collected": total_rows,
                "top_level_comments_collected": top_level_count,
                "replies_collected": reply_count,
                "average_comment_likes": round(avg_likes, 2),
                "maximum_comment_likes": max_likes
            },
            "data_quality_issues": {
                "empty_comments": empty_comments,
                "replies_with_missing_parents_in_dataset": missing_parents,
                "note": "Differences between 'youtube_reported_stats' and 'actual_collection_stats' are normal due to YouTube API pagination limits, deleted comments, or moderation."
            }
        }

    def _write_txt_summary(self, summary: Dict[str, Any], filepath: Path):
        """Writes the summary dictionary to a readable text file."""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("="*50 + "\n")
            f.write("YOUTUBE DATA COLLECTION SUMMARY\n")
            f.write("="*50 + "\n\n")
            
            f.write(f"Collection Timestamp: {summary['collection_timestamp']}\n\n")
            
            f.write("--- VIDEO INFO ---\n")
            for k, v in summary["video_metadata"].items():
                f.write(f"{k}: {v}\n")
                
            f.write("\n--- YOUTUBE REPORTED STATS ---\n")
            for k, v in summary["youtube_reported_stats"].items():
                f.write(f"{k}: {v}\n")
                
            f.write("\n--- ACTUAL COLLECTION STATS ---\n")
            for k, v in summary["actual_collection_stats"].items():
                f.write(f"{k}: {v}\n")
                
            f.write("\n--- DATA QUALITY CHECKS ---\n")
            for k, v in summary["data_quality_issues"].items():
                f.write(f"{k}: {v}\n")
                
            f.write("\n" + "="*50 + "\n")

    def _export_excel(self, filepath: Path, df_video: pd.DataFrame, df_processed: pd.DataFrame, summary: Dict[str, Any]):
        """Creates a multi-sheet formatted Excel workbook."""
        try:
            with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
                # Sheet 1: Comments
                df_processed.to_excel(writer, sheet_name='Comments', index=False)
                
                # Sheet 2: Video Info
                df_video.to_excel(writer, sheet_name='Video Info', index=False)
                
                # Sheet 3: Top Comments
                if not df_processed.empty:
                    top_comments = df_processed.sort_values(by="comment_like_count", ascending=False).head(50)
                    top_comments.to_excel(writer, sheet_name='Top Comments', index=False)
                    
                # Format sheets (freeze headers)
                for sheet_name in writer.sheets:
                    worksheet = writer.sheets[sheet_name]
                    worksheet.freeze_panes = 'A2' # Freeze top row
        except Exception as e:
            print(f"Warning: Failed to save Excel file: {e}")

    def combine_datasets(self):
        """Combines all processed datasets in raw_dir into a single master dataset."""
        print("\nScanning for existing datasets...")
        all_dfs = []
        
        if not self.raw_dir.exists():
            print("No raw data directory found.")
            return

        for video_dir in self.raw_dir.iterdir():
            if video_dir.is_dir():
                csv_path = video_dir / "comments_processed.csv"
                if csv_path.exists():
                    try:
                        df = pd.read_csv(csv_path, encoding="utf-8-sig")
                        all_dfs.append(df)
                        print(f"  Loaded: {video_dir.name} ({len(df)} rows)")
                    except Exception as e:
                        print(f"  Error loading {csv_path}: {e}")

        if not all_dfs:
            print("No datasets found to combine.")
            return

        master_df = pd.concat(all_dfs, ignore_index=True)
        out_csv = self.combined_dir / "youtube_master_dataset.csv"
        out_xlsx = self.combined_dir / "youtube_master_dataset.xlsx"

        master_df.to_csv(out_csv, index=False, encoding="utf-8-sig")
        print(f"\nMaster CSV saved to: {out_csv}")
        
        try:
            master_df.to_excel(out_xlsx, sheet_name='Master Comments', index=False)
            print(f"Master Excel saved to: {out_xlsx}")
        except Exception as e:
            print(f"Warning: Failed to save Master Excel: {e}")
