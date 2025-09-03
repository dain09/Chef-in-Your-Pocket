import { useState, useEffect } from 'react';
import { dataUrlToBlobUrl } from '../utils/imageUtils';

/**
 * A custom React hook that converts a base64 data URL into a temporary,
 * performant blob URL and manages its lifecycle to prevent memory leaks.
 * @param dataUrl The base64 data URL to convert.
 * @returns A browser-managed blob URL for efficient rendering, or the original URL if conversion is not needed/possible.
 */
export const useBlobUrl = (dataUrl: string | undefined): string | undefined => {
    const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        // If the URL is not a data URL or is the error flag, use it directly.
        if (!dataUrl || !dataUrl.startsWith('data:image')) {
            setBlobUrl(dataUrl);
            return;
        }

        let objectUrl: string | undefined;
        try {
            // Convert the data URL to a blob URL.
            objectUrl = dataUrlToBlobUrl(dataUrl);
            setBlobUrl(objectUrl);
        } catch (e) {
            console.error("Failed to convert data URL to blob URL", e);
            setBlobUrl(dataUrl); // Fallback to the original data URL on error.
        }

        // Cleanup function: Revoke the object URL when the component unmounts
        // or the dataUrl changes, to free up browser memory.
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [dataUrl]);

    return blobUrl;
};
