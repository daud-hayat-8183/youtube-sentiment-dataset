import pandas as pd
import re
from typing import List, Dict, Any, Tuple

def process_comments(comments_data: List[Dict[str, Any]]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Takes raw comment dictionaries and returns two DataFrames:
    1. Raw comments DataFrame
    2. Processed comments DataFrame with basic NLP cleaning and sentiment placeholders.
    """
    if not comments_data:
        # Return empty dataframes with correct columns if no data
        columns = [
            "video_id", "comment_id", "parent_comment_id", "comment_type",
            "author_display_name", "author_channel_id", "comment_text",
            "comment_like_count", "reply_count", "published_at", "updated_at"
        ]
        df_raw = pd.DataFrame(columns=columns)
        
        processed_columns = [
            "video_id", "comment_id", "parent_comment_id", "comment_type",
            "comment_text", "cleaned_comment", "comment_like_count", 
            "published_at", "sentiment", "sentiment_score"
        ]
        df_processed = pd.DataFrame(columns=processed_columns)
        
        return df_raw, df_processed

    # Create raw dataframe
    df_raw = pd.DataFrame(comments_data)
    
    # Deduplicate based on comment_id
    initial_len = len(df_raw)
    df_raw = df_raw.drop_duplicates(subset=["comment_id"], keep="first")
    dedup_count = initial_len - len(df_raw)
    if dedup_count > 0:
        print(f"  Removed {dedup_count} duplicate comments.")

    # Create processed dataframe
    df_processed = df_raw[[
        "video_id", "comment_id", "parent_comment_id", "comment_type",
        "comment_text", "comment_like_count", "published_at"
    ]].copy()

    # Apply conservative cleaning
    df_processed["cleaned_comment"] = df_processed["comment_text"].apply(conservative_clean)
    
    # Add empty sentiment columns for future ML project
    df_processed["sentiment"] = ""
    df_processed["sentiment_score"] = ""
    
    return df_raw, df_processed

def conservative_clean(text: str) -> str:
    """
    Cleans text conservatively for NLP without destroying sentiment markers 
    like emojis or meaningful punctuation.
    """
    if not isinstance(text, str):
        return ""
        
    # Replace newlines and carriage returns with a single space
    text = re.sub(r'[\r\n]+', ' ', text)
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Optional: We do NOT remove emojis, exclamation marks, or question marks
    # because they are highly predictive for sentiment analysis.
    
    return text.strip()
