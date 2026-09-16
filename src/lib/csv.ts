import { stringify } from "csv-stringify/sync";

export interface CommentRecord {
  video_id: string;
  video_title: string;
  channel_name: string;
  comment_id: string;
  parent_comment_id: string;
  comment_type: "TOP_LEVEL" | "REPLY";
  author_display_name: string;
  author_channel_id: string;
  comment_text: string;
  cleaned_comment: string;
  comment_like_count: number;
  published_at: string;
  updated_at: string;
}

export function generateCsv(records: CommentRecord[]): string {
  // Use csv-stringify for safe handling of commas, newlines, emojis
  const csvString = stringify(records, {
    header: true,
    columns: [
      "video_id",
      "video_title",
      "channel_name",
      "comment_id",
      "parent_comment_id",
      "comment_type",
      "author_display_name",
      "author_channel_id",
      "comment_text",
      "cleaned_comment",
      "comment_like_count",
      "published_at",
      "updated_at",
    ],
    cast: {
      string: function (value) {
        return value;
      },
    },
  });

  // Prepend UTF-8 BOM for Excel compatibility
  return "\uFEFF" + csvString;
}
