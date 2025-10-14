import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import ClientLayout from './ClientLayout'; // 👈 new client-side wrapper

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
  const isLoggedIn = !!token; // true/false

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ClientLayout initialIsLoggedIn={isLoggedIn}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
