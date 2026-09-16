import os
import time
import requests
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class YouTubeAPIError(Exception):
    """Custom exception for YouTube API errors."""
    pass

class YouTubeAPI:
    def __init__(self):
        """Initializes the YouTube API client by loading the API key from the environment."""
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        if not self.api_key or self.api_key == "YOUR_API_KEY_HERE":
            raise ValueError(
                "YouTube API key was not found or is invalid.\n"
                "Please add a valid YOUTUBE_API_KEY to your .env file."
            )
        
        self.base_url = "https://www.googleapis.com/youtube/v3"
        self.session = requests.Session()

    def _make_request(self, endpoint: str, params: Dict[str, Any], max_retries: int = 3) -> Dict[str, Any]:
        """
        Makes a GET request to the YouTube API with exponential backoff for transient errors.
        """
        params['key'] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, params=params, timeout=15)
                
                if response.status_code == 200:
                    return response.json()
                
                # Handle quota exceeded or forbidden
                if response.status_code in [403, 429]:
                    error_data = response.json()
                    reason = error_data.get("error", {}).get("errors", [{}])[0].get("reason", "")
                    if reason in ["quotaExceeded", "rateLimitExceeded"]:
                        raise YouTubeAPIError("YouTube API Quota exceeded or rate limited. Please try again later.")
                    if reason == "commentsDisabled":
                        return {"commentsDisabled": True}
                    
                # Handle Not Found
                if response.status_code == 404:
                    raise YouTubeAPIError("The requested resource was not found (404).")

                # Handle server errors (5xx) with retry
                if 500 <= response.status_code < 600:
                    logger.warning(f"Server error {response.status_code}. Retrying ({attempt + 1}/{max_retries})...")
                    time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
                    continue

                # Unhandled client error
                response.raise_for_status()

            except requests.exceptions.RequestException as e:
                logger.warning(f"Network error: {e}. Retrying ({attempt + 1}/{max_retries})...")
                time.sleep(2 ** attempt)
                
        raise YouTubeAPIError(f"Failed to fetch data from {endpoint} after {max_retries} attempts.")

    def get_video_info(self, video_id: str) -> Dict[str, Any]:
        """Retrieves video metadata and statistics."""
        params = {
            "part": "snippet,statistics",
            "id": video_id
        }
        data = self._make_request("videos", params)
        if not data.get("items"):
            raise YouTubeAPIError(f"Video {video_id} not found or is private.")
        return data["items"][0]

    def get_comment_threads(self, video_id: str, page_token: Optional[str] = None, max_results: int = 100) -> Dict[str, Any]:
        """Retrieves top-level comments for a video."""
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": max_results,
            "textFormat": "plainText"
        }
        if page_token:
            params["pageToken"] = page_token
            
        return self._make_request("commentThreads", params)

    def get_replies(self, parent_id: str, page_token: Optional[str] = None, max_results: int = 100) -> Dict[str, Any]:
        """Retrieves replies for a specific top-level comment."""
        params = {
            "part": "snippet",
            "parentId": parent_id,
            "maxResults": max_results,
            "textFormat": "plainText"
        }
        if page_token:
            params["pageToken"] = page_token
            
        return self._make_request("comments", params)
