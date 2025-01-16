import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/features/chatbot/components/Chatbot'), { ssr: false });

export const metadata: Metadata = {
  title: 'StoaViva',
  description: 'Votre partenaire pour une vie plus durable',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
