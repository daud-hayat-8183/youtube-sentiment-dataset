import re
from urllib.parse import urlparse, parse_qs
from typing import Optional

def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts the 11-character YouTube video ID from various YouTube URL formats.
    
    Supported formats:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - Raw 11-character ID (VIDEO_ID)
    
    Returns:
        The extracted video ID as a string, or None if invalid.
    """
    url = url.strip()
    
    # If it's exactly 11 characters and looks like an ID
    if len(url) == 11 and re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url
        
    parsed_url = urlparse(url)
    
    # Handle youtu.be/VIDEO_ID
    if parsed_url.hostname in ('youtu.be', 'www.youtu.be'):
        video_id = parsed_url.path.lstrip('/')
        if '?' in video_id:
            video_id = video_id.split('?')[0]
        if is_valid_video_id(video_id):
            return video_id
            
    # Handle youtube.com/watch?v=VIDEO_ID
    if parsed_url.hostname in ('youtube.com', 'www.youtube.com', 'm.youtube.com'):
        if parsed_url.path == '/watch':
            query_params = parse_qs(parsed_url.query)
            video_id = query_params.get('v', [None])[0]
            if video_id and is_valid_video_id(video_id):
                return video_id
                
        # Handle youtube.com/shorts/VIDEO_ID or youtube.com/embed/VIDEO_ID
        if parsed_url.path.startswith('/shorts/') or parsed_url.path.startswith('/embed/'):
            video_id = parsed_url.path.split('/')[2]
            if is_valid_video_id(video_id):
                return video_id

    # Fallback to general regex search across the whole string
    match = re.search(r'(?:v=|/)([0-9A-Za-z_-]{11}).*', url)
    if match:
        video_id = match.group(1)
        if is_valid_video_id(video_id):
            return video_id

    return None

def is_valid_video_id(video_id: str) -> bool:
    """Validates if a string matches the 11-character YouTube ID format."""
    return bool(re.match(r'^[a-zA-Z0-9_-]{11}$', video_id))

