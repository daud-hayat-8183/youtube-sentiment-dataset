import sys
from dotenv import load_dotenv
load_dotenv()
sys.path.append('d:/database/youtube_collector')
from src.parser import extract_video_id
from src.youtube_api import YouTubeAPI
from src.collector import YouTubeDataCollector
from src.processor import process_comments
from src.exporter import DataExporter

def collect(url):
    api = YouTubeAPI()
    collector = YouTubeDataCollector(api)
    exporter = DataExporter(base_dir="d:/database/youtube_collector/data")
    
    video_id = extract_video_id(url)
    print(f"Extracted ID: {video_id}")
    video_info = collector.collect_video_info(video_id)
    print(f"Title: {video_info['title']}")
    
    raw_comments = collector.collect_all_comments(video_id)
    df_raw, df_processed = process_comments(raw_comments)
    out_dir = exporter.export_video_data(video_id, video_info, df_raw, df_processed)
    print(f"DONE. Saved to {out_dir}")

if __name__ == "__main__":
    collect("https://youtu.be/ih1zwUpVd7k?si=4PaaA-NoQYKx9xV7")
