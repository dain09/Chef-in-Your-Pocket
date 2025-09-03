
declare module '*.mp3' {
  // FIX: Renamed 'src' to 'mp3Url' to avoid a "Duplicate identifier" error, which can occur
  // if another type definition (e.g., from vite/client) also defines a module for assets.
  const mp3Url: string;
  export default mp3Url;
}