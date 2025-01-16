export const mockEcologicalImpact = [
  {
    id: '1',
    metric_name: 'Réduction des emballages',
    value: 30,
    unit: 'pourcentage',
    date: '2024-01-15',
    category: 'Emballage',
    description: 'Réduction des emballages plastiques',
    improvement_actions: 'Passage aux emballages biodégradables'
  },
  {
    id: '2',
    metric_name: 'Énergie Renouvelable',
    value: 75,
    unit: 'pourcentage',
    date: '2024-01-15',
    category: 'Énergie',
    description: 'Utilisation d\'énergies renouvelables',
    improvement_actions: 'Installation de panneaux solaires supplémentaires'
  }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Huile Essentielle de Lavande',
    category: 'Aromathérapie',
    price: 15.99,
    stock: 50,
    description: 'Huile essentielle 100% naturelle',
    ecological_impact: 'Emballage recyclable',
    benefits: 'Relaxation et bien-être',
    usage_instructions: 'Diluer avant utilisation',
    ingredients: ['Lavande Bio'],
    certifications: ['Bio', 'Écocert']
  },
  {
    id: '2',
    name: 'Kit Méditation',
    category: 'Bien-être',
    price: 45.99,
    stock: 20,
    description: 'Kit complet pour la méditation',
    ecological_impact: 'Matériaux durables',
    benefits: 'Aide à la méditation',
    usage_instructions: 'Suivre le guide inclus',
    ingredients: [],
    certifications: ['Commerce équitable']
  }
];

export const mockPersons = [
  {
    id: '1',
    name: 'Alice Martin',
    age: 35,
    interests: ['Yoga', 'Méditation'],
    email: 'alice@example.com',
    phone: '0123456789',
    status: 'Actif',
    last_contact: '2024-01-10',
    notes: 'Intéressée par les ateliers de groupe'
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    age: 42,
    interests: ['Aromathérapie', 'Bien-être'],
    email: 'thomas@example.com',
    phone: '0987654321',
    status: 'Actif',
    last_contact: '2024-01-12',
    notes: 'Préfère les séances individuelles'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Séance de Yoga',
    type: 'Bien-être',
    duration: 60,
    capacity: 10,
    location: 'Salle Zen',
    description: 'Séance de yoga pour tous niveaux',
    benefits: 'Amélioration de la souplesse et réduction du stress',
    price: 25,
    instructor: 'Marie Durand',
    schedule: 'Lundi et Mercredi 18h',
    prerequisites: ['Tapis de yoga', 'Tenue confortable'],
    availability: [
      {
        day: 'Lundi',
        time: '18h',
        available: true
      },
      {
        day: 'Mercredi',
        time: '18h',
        available: true
      },
      {
        day: 'Samedi',
        time: '10h',
        available: true
      }
    ]
  },
  {
    id: '2',
    name: 'Coaching Personnel',
    type: 'Coaching',
    duration: 45,
    capacity: 1,
    location: 'Bureau privé',
    description: 'Accompagnement personnalisé',
    benefits: 'Atteinte des objectifs personnels',
    price: 60,
    instructor: 'Pierre Martin',
    schedule: 'Sur rendez-vous',
    prerequisites: ['Premier entretien gratuit'],
    availability: [
      {
        day: 'Vendredi',
        time: '14h',
        available: true
      },
      {
        day: 'Samedi',
        time: '11h',
        available: true
      },
      {
        day: 'Samedi',
        time: '15h',
        available: true
      }
    ]
  }
];
