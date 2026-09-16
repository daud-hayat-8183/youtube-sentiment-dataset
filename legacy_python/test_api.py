import os
from dotenv import load_dotenv
from src.youtube_api import YouTubeAPI, YouTubeAPIError

def test_api():
    print("Testing YouTube API Configuration...")
    
    # 1. Test .env loading
    load_dotenv()
    api_key = os.getenv("YOUTUBE_API_KEY")
    
    if not api_key:
        print("\n[FAILED] YOUTUBE_API_KEY is missing from your .env file.")
        return
    if api_key == "YOUR_API_KEY_HERE":
        print("\n[FAILED] YOUTUBE_API_KEY is still set to the default placeholder 'YOUR_API_KEY_HERE'.")
        return
        
    print(f"[SUCCESS] API Key loaded (starts with '{api_key[:5]}...' and is {len(api_key)} chars long).")
    
    # 2. Test API Connection (by fetching a known video)
    try:
        api = YouTubeAPI()
        # Using a highly-available YouTube video (Never Gonna Give You Up)
        test_video_id = "dQw4w9WgXcQ"
        
        print(f"\nTesting connection by fetching metadata for video: {test_video_id}...")
        video_data = api.get_video_info(test_video_id)
        
        title = video_data.get("snippet", {}).get("title")
        print(f"[SUCCESS] Connected to YouTube Data API.")
        print(f"[SUCCESS] Successfully retrieved video: '{title}'")
        
        print("\nYour API configuration is perfectly set up. You can now run 'python main.py'.")
        
    except YouTubeAPIError as e:
        print(f"\n[FAILED] API request failed. Error: {e}")
        print("Please check if your API key is valid and has the 'YouTube Data API v3' enabled in Google Cloud Console.")
    except Exception as e:
        print(f"\n[FAILED] An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_api()
