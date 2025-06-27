// layout.js (Server Component – no 'use client')
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { cookies } from 'next/headers';
import { Toaster } from "react-hot-toast"
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'NEXTRADE',
  description: 'Crypto trading platform',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  const isLoggedIn = !!token;
  console.log("JWT token:", token); // Make sure this shows a real value on logged-in pages
console.log("🧠 layout.js – isLoggedIn:", isLoggedIn);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar initialIsLoggedIn={isLoggedIn} />
        <main className='flex-grow'>{children}</main>
        <Footer /> {/* Let Footer handle its own logic */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}