'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          LifeBites
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="hover:text-blue-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/signin" className="hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-blue-600 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}