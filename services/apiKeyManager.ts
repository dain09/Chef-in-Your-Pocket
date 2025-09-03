// Manages a pool of API keys and rotates them on failure.

let keys: string[] = [];
let currentIndex = 0;
// Tracks how many keys have been tried in a single sequence of failures.
let rotationCount = 0;

export const apiKeyManager = {
  /**
   * Initializes the manager with a list of API keys.
   * @param apiKeys - An array of API key strings.
   */
  initializeKeys: (apiKeys: string[]) => {
    keys = apiKeys.filter(k => k); // Filter out empty strings from the array
    currentIndex = 0;
    rotationCount = 0;
  },

  /**
   * Gets the currently active API key.
   * @returns The current API key string or undefined if none are available.
   */
  getCurrentKey: (): string | undefined => {
    if (keys.length === 0) return undefined;
    return keys[currentIndex];
  },

  /**
   * Rotates to the next available API key.
   * @returns The next API key if rotation was successful and there are more keys to try, otherwise undefined.
   */
  rotateKey: (): string | undefined => {
    // No need to rotate if there's only one key (or none)
    if (keys.length <= 1) return undefined; 
    
    // Check if we've already tried all available keys in this sequence
    if (rotationCount >= keys.length - 1) {
        // Reset for the next operation that might need to rotate keys
        rotationCount = 0;
        // Signal that all keys have been tried and failed
        return undefined; 
    }
    
    rotationCount++;
    currentIndex = (currentIndex + 1) % keys.length;
    
    return keys[currentIndex];
  },

  /**
   * Checks if more than one key is available for rotation.
   * @returns True if there are multiple keys.
   */
  hasMultipleKeys: (): boolean => keys.length > 1,

  /**
   * Resets the rotation counter. This should be called before starting a new sequence of API calls.
   */
  resetRotationCount: () => {
      rotationCount = 0;
  }
};
