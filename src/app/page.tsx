import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Import dynamique des composants pour éviter les erreurs de SSR avec useState
const Chatbot = dynamic(() => import('@/features/chatbot/components/Chatbot'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'StoaViva',
  description: 'Votre partenaire pour une vie plus durable',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue sur StoaViva
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <h2 className="text-2xl">
          Votre partenaire pour une vie plus durable
        </h2>
      </div>

      <Chatbot />
    </main>
  );
}
