

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to LifeBites</h1>
      <p className="text-lg mb-8">
        Turn your available ingredients into delicious recipes with the help of AI.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Sign up for an account to save your favorite recipes</li>
            <li>Enter the ingredients you have available</li>
            <li>Our AI will generate custom recipes for you</li>
            <li>Save and organize your favorite recipes</li>
          </ol>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>AI-powered recipe generation</li>
            <li>Save your favorite recipes</li>
            <li>Personalized recipe recommendations</li>
            <li>Nutrition information for all recipes</li>
            <li>Mobile-friendly design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}