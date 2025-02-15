import Link from 'next/link';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4">
          {recipe.ingredients.length} ingredients
        </p>
        
        <div className="mb-4">
          <h4 className="font-medium mb-1">Ingredients:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-700">{ingredient}</li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-sm text-gray-500">
                +{recipe.ingredients.length - 3} more...
              </li>
            )}
          </ul>
        </div>
        
        <Link
          href={`/recipes/${recipe.id}`}
          className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          View Full Recipe
        </Link>
      </div>
    </div>
  );
}