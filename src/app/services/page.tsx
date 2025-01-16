import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - StoaViva',
  description: 'Découvrez nos services de bien-être et coaching personnalisé',
};

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-8" role="main" aria-labelledby="main-heading">
      <h1 id="main-heading" className="text-3xl font-bold text-green-900 mb-8">
        Nos Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Liste des services">
        {/* Service Card: Coaching Bien-être */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="coaching-heading">
          <h2 id="coaching-heading" className="text-xl font-semibold text-green-800 mb-4">
            Coaching Bien-être
          </h2>
          <p className="text-gray-600 mb-4">
            Accompagnement personnalisé pour atteindre vos objectifs de bien-être
            et développer une vie plus équilibrée.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Caractéristiques du coaching bien-être">
            <li role="listitem">Séances individuelles</li>
            <li role="listitem">Suivi personnalisé</li>
            <li role="listitem">Objectifs adaptés</li>
          </ul>
        </div>

        {/* Service Card: Ateliers Collectifs */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="ateliers-heading">
          <h2 id="ateliers-heading" className="text-xl font-semibold text-green-800 mb-4">
            Ateliers Collectifs
          </h2>
          <p className="text-gray-600 mb-4">
            Participez à nos ateliers en groupe pour partager et apprendre dans une
            ambiance conviviale.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Types d'ateliers collectifs">
            <li role="listitem">Méditation guidée</li>
            <li role="listitem">Yoga en pleine nature</li>
            <li role="listitem">Ateliers thématiques</li>
          </ul>
        </div>

        {/* Service Card: Consultation Holistique */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="consultation-heading">
          <h2 id="consultation-heading" className="text-xl font-semibold text-green-800 mb-4">
            Consultation Holistique
          </h2>
          <p className="text-gray-600 mb-4">
            Approche globale de votre bien-être intégrant différentes pratiques
            naturelles.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Services de consultation holistique">
            <li role="listitem">Aromathérapie</li>
            <li role="listitem">Conseils nutritionnels</li>
            <li role="listitem">Gestion du stress</li>
          </ul>
        </div>

        {/* Service Card: Retraites Bien-être */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="retraites-heading">
          <h2 id="retraites-heading" className="text-xl font-semibold text-green-800 mb-4">
            Retraites Bien-être
          </h2>
          <p className="text-gray-600 mb-4">
            Immersion complète dans un environnement naturel pour une reconnexion
            profonde.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Activités des retraites bien-être">
            <li role="listitem">Week-ends ressourçants</li>
            <li role="listitem">Activités en pleine nature</li>
            <li role="listitem">Hébergement écologique</li>
          </ul>
        </div>

        {/* Service Card: Programmes Entreprise */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="entreprise-heading">
          <h2 id="entreprise-heading" className="text-xl font-semibold text-green-800 mb-4">
            Programmes Entreprise
          </h2>
          <p className="text-gray-600 mb-4">
            Solutions sur mesure pour le bien-être au travail et la cohésion
            d'équipe.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Services pour entreprises">
            <li role="listitem">Ateliers team-building</li>
            <li role="listitem">Gestion du stress professionnel</li>
            <li role="listitem">Séances collectives</li>
          </ul>
        </div>

        {/* Service Card: Accompagnement Digital */}
        <div className="bg-white rounded-lg shadow-md p-6" role="listitem" aria-labelledby="digital-heading">
          <h2 id="digital-heading" className="text-xl font-semibold text-green-800 mb-4">
            Accompagnement Digital
          </h2>
          <p className="text-gray-600 mb-4">
            Suivez nos programmes à distance pour progresser à votre rythme.
          </p>
          <ul className="space-y-2 text-gray-700" role="list" aria-label="Services d'accompagnement digital">
            <li role="listitem">Consultations en ligne</li>
            <li role="listitem">Ressources numériques</li>
            <li role="listitem">Suivi personnalisé à distance</li>
          </ul>
        </div>
      </div>

      {/* Section Contact */}
      <div className="mt-12 bg-green-50 rounded-lg p-8 text-center" role="complementary" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-2xl font-semibold text-green-900 mb-4">
          Intéressé par nos services ?
        </h2>
        <p className="text-gray-700 mb-6">
          Contactez-nous pour en savoir plus ou réserver une consultation.
        </p>
        <button 
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          aria-label="Ouvrir le formulaire de contact"
        >
          Nous contacter
        </button>
      </div>
    </main>
  );
}
