import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';

export const metadata = {
  title: 'LifeBites',
  description: 'Generate recipes from your available ingredients',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}