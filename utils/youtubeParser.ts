export const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    let videoId: string | null = null;
    const trimmedUrl = url.trim();

    // Return early if the URL is empty after trimming
    if (!trimmedUrl) {
        return null;
    }

    // A comprehensive regex to capture the 11-character video ID from various YouTube URL formats.
    // This is more resilient than the strict `new URL()` constructor.
    const videoIdRegex = /(?:v=|\/v\/|youtu\.be\/|embed\/|\/v\/|\/e\/|watch\?v=|&v=|(?:\/shorts\/))([a-zA-Z0-9_-]{11})/;
    const match = trimmedUrl.match(videoIdRegex);

    if (match && match[1]) {
        videoId = match[1];
    }
    
    // If no ID was found via the regex, check if the string itself is a valid 11-character video ID.
    // This handles cases where the API returns just the ID.
    if (!videoId && /^[a-zA-Z0-9_-]{11}$/.test(trimmedUrl)) {
        videoId = trimmedUrl;
    }

    if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    }
    
    // If we couldn't extract an ID, return null to prevent rendering a broken iframe.
    return null;
};
