'use client';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children, initialIsLoggedIn }) {
  return (
    <AuthProvider initialIsLoggedIn={initialIsLoggedIn}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  );
}
