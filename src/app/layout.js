// layout.js (Server Component – no 'use client')
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { cookies } from 'next/headers';
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

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const isLoggedIn = !!token;
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar initialIsLoggedIn={isLoggedIn} />
        <main className='flex-grow'>{children}</main>
        <Footer /> {/* Let Footer handle its own logic */}
      </body>
    </html>
  );
}