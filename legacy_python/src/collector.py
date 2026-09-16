import logging
from typing import Dict, Any, List, Optional
from src.youtube_api import YouTubeAPI, YouTubeAPIError

logger = logging.getLogger(__name__)

class YouTubeDataCollector:
    def __init__(self, api_client: YouTubeAPI):
        self.api = api_client

    def collect_video_info(self, video_id: str) -> Dict[str, Any]:
        """Collects and formats video metadata and statistics."""
        raw_info = self.api.get_video_info(video_id)
        
        snippet = raw_info.get("snippet", {})
        stats = raw_info.get("statistics", {})
        
        # Dislike count is generally not available publicly via API anymore
        # We explicitly track its availability
        dislike_count = stats.get("dislikeCount")
        dislike_available = dislike_count is not None
        
        return {
            "video_id": video_id,
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "channel_id": snippet.get("channelId", ""),
            "channel_name": snippet.get("channelTitle", ""),
            "published_at": snippet.get("publishedAt", ""),
            "category_id": snippet.get("categoryId", ""),
            "duration": raw_info.get("contentDetails", {}).get("duration", ""),
            "view_count": stats.get("viewCount", 0),
            "like_count": stats.get("likeCount", 0),
            "comment_count": stats.get("commentCount", 0),
            "dislike_count": dislike_count if dislike_available else "",
            "dislike_count_available": dislike_available,
            "tags": ",".join(snippet.get("tags", [])) if snippet.get("tags") else "",
            "default_language": snippet.get("defaultLanguage", ""),
            "default_audio_language": snippet.get("defaultAudioLanguage", "")
        }

    def collect_all_comments(self, video_id: str, max_top_level_comments: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Collects all available top-level comments and their replies.
        If comments are disabled, returns an empty list.
        """
        all_comments = []
        page_token = None
        top_level_collected = 0
        
        print("\nDownloading comments...")
        
        try:
            page_count = 0
            while True:
                response = self.api.get_comment_threads(video_id, page_token=page_token, max_results=100)
                
                # Check if comments are disabled
                if response.get("commentsDisabled"):
                    print("Comments are disabled or unavailable for this video.")
                    return []
                    
                items = response.get("items", [])
                if not items:
                    break
                    
                page_count += 1
                print(f"  Page {page_count}... ({len(items)} threads)")

                for item in items:
                    # Parse top-level comment
                    snippet = item["snippet"]["topLevelComment"]["snippet"]
                    comment_id = item["snippet"]["topLevelComment"]["id"]
                    
                    top_level_comment = {
                        "video_id": video_id,
                        "comment_id": comment_id,
                        "parent_comment_id": "",
                        "comment_type": "TOP_LEVEL",
                        "author_display_name": snippet.get("authorDisplayName", ""),
                        "author_channel_id": snippet.get("authorChannelId", {}).get("value", ""),
                        "comment_text": snippet.get("textDisplay", ""),
                        "comment_like_count": snippet.get("likeCount", 0),
                        "reply_count": item["snippet"].get("totalReplyCount", 0),
                        "published_at": snippet.get("publishedAt", ""),
                        "updated_at": snippet.get("updatedAt", "")
                    }
                    all_comments.append(top_level_comment)
                    top_level_collected += 1
                    
                    # If this comment has replies, fetch them using pagination
                    if top_level_comment["reply_count"] > 0:
                        replies = self._collect_replies(comment_id, video_id)
                        all_comments.extend(replies)
                        
                    if max_top_level_comments and top_level_collected >= max_top_level_comments:
                        print(f"\nReached requested limit of {max_top_level_comments} top-level comments.")
                        return all_comments

                page_token = response.get("nextPageToken")
                if not page_token:
                    break
                    
                if top_level_collected % 500 == 0:
                    print(f"  {top_level_collected} top-level comments processed...")
                    
        except YouTubeAPIError as e:
            logger.error(f"Error collecting comments: {e}")
            print(f"\nWarning: Collection interrupted due to API error: {e}")
            print("Preserving data collected so far...")
            
        return all_comments

    def _collect_replies(self, parent_id: str, video_id: str) -> List[Dict[str, Any]]:
        """Collects all replies for a given top-level comment."""
        replies = []
        page_token = None
        
        try:
            while True:
                response = self.api.get_replies(parent_id, page_token=page_token, max_results=100)
                items = response.get("items", [])
                
                if not items:
                    break
                    
                for item in items:
                    snippet = item["snippet"]
                    reply = {
                        "video_id": video_id,
                        "comment_id": item["id"],
                        "parent_comment_id": parent_id,
                        "comment_type": "REPLY",
                        "author_display_name": snippet.get("authorDisplayName", ""),
                        "author_channel_id": snippet.get("authorChannelId", {}).get("value", ""),
                        "comment_text": snippet.get("textDisplay", ""),
                        "comment_like_count": snippet.get("likeCount", 0),
                        "reply_count": 0, # Replies don't have replies
                        "published_at": snippet.get("publishedAt", ""),
                        "updated_at": snippet.get("updatedAt", "")
                    }
                    replies.append(reply)
                    
                page_token = response.get("nextPageToken")
                if not page_token:
                    break
                    
        except YouTubeAPIError as e:
            logger.warning(f"Failed to collect replies for parent {parent_id}: {e}")
            
        return replies
