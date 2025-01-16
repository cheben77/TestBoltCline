import type { Metadata } from 'next';
import './globals.css';
import ClientNavigation from '@/components/ClientNavigation';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });

export const metadata: Metadata = {
  title: 'StoaViva',
  description: 'Votre partenaire bien-être et écologie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 font-sans">
        <ClientNavigation />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
