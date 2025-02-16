'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { signin, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signin(email, password);
      router.push('/recipes');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/recipes');
    } catch (error) {
      setError('Failed to sign in with Google.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 p-8">
      {/* Left Column */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          No Recipe? No Problem.
        </h1>
        <h2 className="text-4xl font-bold mb-6">
          <span className="text-green-500">LifeBites</span> has your back!
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Eating well is easy with LifeBites! Enter your ingredients,
          and our AI creates healthy, delicious meals tailored to your
          diet. Waste less, eat better!
        </p>
        {/* <div className="relative h-48">
          <img
            src="/vegetables.png" 
            alt="Fresh vegetables"
            fill
            className="object-cover rounded-lg"
          />
        </div> */}
        <div className="relative">
          <img
            src="/vegetables.png"
            alt="Fresh vegetables"
            //style={{ width: "100%", height: "100px", borderRadius: "8px" }}
          />
        </div>

        

        


      </div>

      {/* Right Column - Sign In Form */}
      <div className="bg-green-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Welcome</h2>
        <p className="mb-6 text-gray-600">
          Welcome to LifeBites!
          Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Remember for 30 days</span>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-green-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-700 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}