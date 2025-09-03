export const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    
    try {
        const urlObj = new URL(url);
        // Standard `https://www.youtube.com/watch?v=...`
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            if (urlObj.pathname === '/watch') {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.pathname.startsWith('/embed/')) {
                // It's already an embed link, just add our params
                const existingVideoId = urlObj.pathname.split('/')[2];
                return `https://www.youtube.com/embed/${existingVideoId}?autoplay=1&rel=0`;
            } else if (urlObj.pathname.startsWith('/live/')) {
                // `https://www.youtube.com/live/...`
                videoId = urlObj.pathname.split('/')[2];
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                // `https://www.youtube.com/shorts/...`
                videoId = urlObj.pathname.split('/')[2];
            }
        } 
        // Shortened `https://youtu.be/...`
        else if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.substring(1);
        }
    } catch (e) {
        console.error("Invalid URL for YouTube parsing", e);
        // Fallback for non-URL strings that might just be an ID
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|live\/|shorts\/)?([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if (match) {
            videoId = match[1];
        } else {
            return null;
        }
    }

    if (videoId) {
        const cleanVideoId = videoId.split('?')[0]; // Remove any query params from ID itself
        return `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&rel=0`;
    }

    return null;
};
