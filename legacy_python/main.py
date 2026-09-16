import os
import sys
import logging
from datetime import datetime
from dotenv import load_dotenv

# Ensure dotenv is loaded before anything else
load_dotenv()

from src.parser import extract_video_id
from src.youtube_api import YouTubeAPI, YouTubeAPIError
from src.collector import YouTubeDataCollector
from src.processor import process_comments
from src.exporter import DataExporter

def setup_logging():
    if not os.path.exists("logs"):
        os.makedirs("logs")
    log_file = f"logs/collection_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file, encoding='utf-8')
        ]
    )
    return log_file

def display_header():
    print("="*42)
    print("        YOUTUBE DATASET GENERATOR        ")
    print("="*42)

def collect_new_video():
    try:
        api = YouTubeAPI()
        collector = YouTubeDataCollector(api)
        exporter = DataExporter()
    except ValueError as e:
        print(f"\nERROR: {e}")
        return

    url = input("\nPaste YouTube video URL: ").strip()
    video_id = extract_video_id(url)
    
    if not video_id:
        print("\nERROR: Invalid YouTube URL. Could not extract video ID.")
        return

    print(f"\nExtracted Video ID: {video_id}")
    print("Retrieving video metadata...")
    
    try:
        video_info = collector.collect_video_info(video_id)
        
        print(f"\nVideo: {video_info['title']}")
        print(f"Channel: {video_info['channel_name']}")
        print(f"Views: {video_info['view_count']}")
        print(f"Likes: {video_info['like_count']}")
        print(f"YouTube Comment Count: {video_info['comment_count']}")
        
        collect_all = input("\nCollect all available comments? [Y/n]: ").strip().lower()
        max_comments = None
        
        if collect_all == 'n':
            try:
                max_comments = int(input("Maximum top-level comments to collect: ").strip())
            except ValueError:
                print("Invalid number. Proceeding to collect all.")
                
        # 1. Collect
        raw_comments = collector.collect_all_comments(video_id, max_top_level_comments=max_comments)
        
        # 2. Process
        print("\nProcessing data...")
        df_raw, df_processed = process_comments(raw_comments)
        
        # 3. Export
        print("Saving datasets...")
        out_dir = exporter.export_video_data(video_id, video_info, df_raw, df_processed)
        
        print("\n" + "="*42)
        print("COLLECTION COMPLETE")
        print(f"Top-level comments collected: {len(df_raw[df_raw['comment_type'] == 'TOP_LEVEL']) if not df_raw.empty else 0}")
        print(f"Replies collected: {len(df_raw[df_raw['comment_type'] == 'REPLY']) if not df_raw.empty else 0}")
        print(f"Total rows: {len(df_raw)}")
        print(f"Files saved to: {out_dir}")
        print("="*42 + "\n")
        
    except YouTubeAPIError as e:
        print(f"\nAPI ERROR: {e}")
    except Exception as e:
        print(f"\nUNEXPECTED ERROR: {e}")
        logging.error("Unexpected error", exc_info=True)

def combine_datasets():
    exporter = DataExporter()
    exporter.combine_datasets()

def main():
    log_file = setup_logging()
    logging.info("Application started")
    
    while True:
        display_header()
        print("1. Collect a new video")
        print("2. Combine existing video datasets")
        print("3. Exit")
        
        choice = input("\nSelect an option (1-3): ").strip()
        
        if choice == '1':
            collect_new_video()
        elif choice == '2':
            combine_datasets()
        elif choice == '3':
            print("\nExiting program...")
            break
        else:
            print("\nInvalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
