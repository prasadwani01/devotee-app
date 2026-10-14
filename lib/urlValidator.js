/**
 * 1. Automatically converts share links (Google Drive, Dropbox)
 *    into raw, direct streamable/viewable URLs.
 */
export function sanitizeMediaUrl(rawUrl) {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // Convert Google Drive share link -> direct download/stream link
  // Matches: drive.google.com/file/d/FILE_ID/...
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (url.includes("drive.google.com") && driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }

  // Convert Dropbox preview link -> direct raw byte stream link
  // Matches: dropbox.com/.../song.mp3?dl=0 -> ?raw=1
  if (url.includes("dropbox.com")) {
    return url.replace("?dl=0", "?raw=1");
  }

  return url;
}

/**
 * 2. Real-time validation that warns admins immediately
 *    if they paste an incompatible webpage link.
 */
export function validateMediaUrl(url, type = "audio") {
  if (!url || !url.trim()) return null;
  const clean = url.trim().toLowerCase();

  if (type === "audio") {
    if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
      return "⚠️ YouTube links cannot play in the background audio player. Please use a direct MP3 link or a Google Drive MP3 link.";
    }
    if (clean.includes("spotify.com") || clean.includes("music.apple.com")) {
      return "⚠️ Streaming service links are DRM-protected. Please provide a direct audio URL.";
    }
  }

  if (type === "image") {
    if (clean.includes("pinterest.com")) {
      return "⚠️ Pinterest page link detected. Right-click the image directly and choose 'Copy image address'.";
    }
    if (clean.includes("google.com/search") || clean.includes("google.com/imgres")) {
      return "⚠️ Google search link detected. Open the full image first, right-click it, and select 'Copy image address'.";
    }
  }

  if (type === "pdf") {
    if (clean.includes("books.google.com") || clean.includes("scribd.com")) {
      return "⚠️ External preview links cannot be downloaded. Please provide a direct .pdf link or Google Drive PDF share link.";
    }
  }

  return null;
}