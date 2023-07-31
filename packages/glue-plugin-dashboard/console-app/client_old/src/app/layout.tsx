'use client';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <script src="/socket.io/socket.io.js"></script>
      <body className={(inter.className, 'flex items-start')}></body>
    </html>
  );
}
