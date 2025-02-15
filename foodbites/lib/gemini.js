export async function generateRecipe(ingredients) {
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }
  }