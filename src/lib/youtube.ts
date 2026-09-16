import { cleanText } from "./cleaning";

export interface VideoInfo {
  videoId: string;
  title: string;
  channelName: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface YouTubeComment {
  id: string;
  parentId: string | null;
  type: "TOP_LEVEL" | "REPLY";
  authorDisplayName: string;
  authorChannelId: string;
  textOriginal: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  replyCount?: number;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

const API_BASE = "https://www.googleapis.com/youtube/v3";

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let attempt = 0;
  while (attempt < retries) {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status === 403 || res.status === 429) {
      throw new Error("Quota exceeded or rate limited.");
    }
    if (res.status >= 500) {
      attempt++;
      await new Promise(r => setTimeout(r, 1000 * attempt));
      continue;
    }
    throw new Error(`API error: ${res.statusText}`);
  }
  throw new Error("Max retries reached.");
}

export async function getVideoInfo(videoId: string, apiKey: string): Promise<VideoInfo> {
  const url = `${API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  const res = await fetchWithRetry(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found or is private.");
  }

  const item = data.items[0];
  const snippet = item.snippet;
  const stats = item.statistics;

  return {
    videoId,
    title: snippet.title,
    channelName: snippet.channelTitle,
    viewCount: stats.viewCount || "0",
    likeCount: stats.likeCount || "0",
    commentCount: stats.commentCount || "0",
  };
}

export async function getTopLevelComments(
  videoId: string,
  apiKey: string,
  pageToken: string | null = null
): Promise<{ comments: YouTubeComment[]; nextPageToken: string | null }> {
  let url = `${API_BASE}/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${apiKey}&textFormat=plainText`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  const res = await fetchWithRetry(url);
  const data = await res.json();

  const comments: YouTubeComment[] = [];
  if (data.items) {
    for (const item of data.items) {
      const topLevel = item.snippet.topLevelComment.snippet;
      comments.push({
        id: item.snippet.topLevelComment.id,
        parentId: null,
        type: "TOP_LEVEL",
        authorDisplayName: topLevel.authorDisplayName,
        authorChannelId: topLevel.authorChannelId?.value || "",
        textOriginal: topLevel.textOriginal,
        likeCount: topLevel.likeCount || 0,
        publishedAt: topLevel.publishedAt,
        updatedAt: topLevel.updatedAt,
        replyCount: item.snippet.totalReplyCount || 0,
      });
    }
  }

  return {
    comments,
    nextPageToken: data.nextPageToken || null,
  };
}

export async function getReplies(
  parentId: string,
  apiKey: string,
  pageToken: string | null = null
): Promise<{ comments: YouTubeComment[]; nextPageToken: string | null }> {
  let url = `${API_BASE}/comments?part=snippet&parentId=${parentId}&maxResults=100&key=${apiKey}&textFormat=plainText`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  const res = await fetchWithRetry(url);
  const data = await res.json();

  const comments: YouTubeComment[] = [];
  if (data.items) {
    for (const item of data.items) {
      const snippet = item.snippet;
      comments.push({
        id: item.id,
        parentId: parentId,
        type: "REPLY",
        authorDisplayName: snippet.authorDisplayName,
        authorChannelId: snippet.authorChannelId?.value || "",
        textOriginal: snippet.textOriginal,
        likeCount: snippet.likeCount || 0,
        publishedAt: snippet.publishedAt,
        updatedAt: snippet.updatedAt,
      });
    }
  }

  return {
    comments,
    nextPageToken: data.nextPageToken || null,
  };
}
