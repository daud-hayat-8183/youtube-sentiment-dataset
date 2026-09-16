import { NextRequest } from "next/server";
import { extractVideoId, getVideoInfo, getTopLevelComments, getReplies, YouTubeComment } from "@/lib/youtube";
import { cleanText } from "@/lib/cleaning";
import { CommentRecord, generateCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";
export const maxDuration = 300; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server API key is not configured" }), { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // 1. Fetching Video Info
          sendEvent("progress", { stage: "Fetching video information", count: 0 });
          const videoInfo = await getVideoInfo(videoId, apiKey);

          // 2. Collecting comments
          sendEvent("progress", { stage: "Collecting comments", count: 0 });
          let comments: YouTubeComment[] = [];
          let pageToken: string | null = null;
          let pages = 0;
          const MAX_PAGES = 30; // Limit to avoid timeouts
          
          do {
            const result = await getTopLevelComments(videoId, apiKey, pageToken);
            comments.push(...result.comments);
            pageToken = result.nextPageToken;
            pages++;
            sendEvent("progress", { stage: "Collecting comments", count: comments.length, subStage: `Processed ${pages} page(s)` });
          } while (pageToken && pages < MAX_PAGES);

          // 3. Collecting replies
          let repliesCount = 0;
          let currentCommentIndex = 0;
          const allCommentsAndReplies: YouTubeComment[] = [...comments];
          
          for (const comment of comments) {
             currentCommentIndex++;
             if (currentCommentIndex % 20 === 0) {
               sendEvent("progress", { stage: "Collecting replies", count: comments.length + repliesCount, subStage: `Checking comment ${currentCommentIndex} of ${comments.length}` });
             }
             
             if (comment.replyCount && comment.replyCount > 0) {
                let replyPageToken: string | null = null;
                let replyPages = 0;
                do {
                  const replyResult = await getReplies(comment.id, apiKey, replyPageToken);
                  allCommentsAndReplies.push(...replyResult.comments);
                  repliesCount += replyResult.comments.length;
                  replyPageToken = replyResult.nextPageToken;
                  replyPages++;
                } while (replyPageToken && replyPages < 5); // Limit reply pagination per thread
             }
          }

          // 4. Organizing data & CSV formatting
          sendEvent("progress", { stage: "Organizing data", count: allCommentsAndReplies.length });
          
          const uniqueMap = new Map<string, YouTubeComment>();
          for (const c of allCommentsAndReplies) {
             uniqueMap.set(c.id, c);
          }
          const uniqueComments = Array.from(uniqueMap.values());
          
          const records: CommentRecord[] = uniqueComments.map(c => ({
             video_id: videoId,
             video_title: videoInfo.title,
             channel_name: videoInfo.channelName,
             comment_id: c.id,
             parent_comment_id: c.parentId || "",
             comment_type: c.type,
             author_display_name: c.authorDisplayName,
             author_channel_id: c.authorChannelId,
             comment_text: c.textOriginal,
             cleaned_comment: cleanText(c.textOriginal),
             comment_like_count: c.likeCount,
             published_at: c.publishedAt,
             updated_at: c.updatedAt
          }));

          sendEvent("progress", { stage: "Generating CSV", count: records.length });
          const csvData = generateCsv(records);

          // 5. Done
          sendEvent("done", {
            videoInfo,
            totalRecords: records.length,
            topLevelCount: uniqueComments.filter(c => c.type === "TOP_LEVEL").length,
            repliesCount: uniqueComments.filter(c => c.type === "REPLY").length,
            csvData
          });
          controller.close();
        } catch (error: any) {
          sendEvent("error", { message: error.message || "An unknown error occurred" });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
