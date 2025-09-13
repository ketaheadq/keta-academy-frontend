import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StrapiBlock } from "./strapi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeTurkish = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/I/g, "i")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c");
};

export const extractTextFromBlocks = (blocks: StrapiBlock[]): string => {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => block.children?.map((child) => child.text).join("") || "")
    .join("\n\n");
};

export function extractYouTubeVideoId(url: string): string | null {
  // Handle different YouTube URL formats
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    // youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([^&\n?#]+)/,
    // youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([^&\n?#]+)/,
    // youtu.be/VIDEO_ID
    /youtu\.be\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const videoId = match[1];
      console.log("✅ Extracted video ID:", videoId);
      return videoId;
    }
  }

  console.log("❌ Could not extract video ID from URL:", url);
  return null;
}

export function parseCSVLine(line: string): string[] | null {
  const matches = line.match(/("(?:[^"]|\\.)*"|[^,]*)(?=,|$)/g);

  if (!matches) return null;

  // Clean up the matches by removing surrounding quotes and trimming
  return matches.map((match) => {
    // Remove surrounding quotes and handle escaped quotes if needed
    if (match.startsWith('"') && match.endsWith('"')) {
      return match.slice(1, -1).replace(/""/g, '"').trim();
    }
    return match.trim();
  });
}
