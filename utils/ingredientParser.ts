// A simple ingredient parser to extract quantity and unit
// This can be expanded with more complex logic (e.g., handling fractions, ranges)

export const parseIngredient = (amount: string): { quantity: number; unit: string } | null => {
    // Trim and handle potential whitespace issues
    const trimmedAmount = amount.trim();
  
    // Regex to find the first number (integer or decimal) and the rest of the string
    const match = trimmedAmount.match(/^(\d*\.?\d+)\s*(.*)/);
  
    if (match && match.length === 3) {
      const quantity = parseFloat(match[1]);
      const unit = match[2].trim();
      
      if (!isNaN(quantity)) {
        return { quantity, unit };
      }
    }
    
    // If no number is found at the beginning, we can't scale it
    return null;
  };
  