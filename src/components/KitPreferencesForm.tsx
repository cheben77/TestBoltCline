import { useState } from 'react';
import { ClientPreferences } from '@/lib/integration';

interface KitPreferencesFormProps {
  onSubmit: (preferences: ClientPreferences) => Promise<void>;
  loading: boolean;
}

export default function KitPreferencesForm({ onSubmit, loading }: KitPreferencesFormProps) {
  const [preferences, setPreferences] = useState<ClientPreferences>({
    interests: [],
    ecologicalPriority: 5,
    wellnessGoals: [],
    budget: 100,
    type: 'débutant',
    experience_level: 'débutant',
    restrictions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const handleInterestChange = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGoalChange = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      wellnessGoals: prev.wellnessGoals.includes(goal)
        ? prev.wellnessGoals.filter(g => g !== goal)
        : [...prev.wellnessGoals, goal]
    }));
  };

  const handleBudgetChange = (value: number) => {
    setPreferences(prev => ({
      ...prev,
      budget: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleExperienceChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      experience_level: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Centres d'intérêt</h3>
        <div className="mt-2 space-x-2">
          {['Relaxation', 'Méditation', 'Yoga', 'Aromathérapie'].map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestChange(interest)}
              className={`px-4 py-2 rounded-full ${
                preferences.interests.includes(interest)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Objectifs de bien-être</h3>
        <div className="mt-2 space-x-2">
          {['Stress', 'Sommeil', 'Énergie', 'Détente'].map(goal => (
            <button
              key={goal}
              type="button"
              onClick={() => handleGoalChange(goal)}
              className={`px-4 py-2 rounded-full ${
                preferences.wellnessGoals.includes(goal)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Budget</h3>
        <input
          type="range"
          min="0"
          max="500"
          step="50"
          value={preferences.budget}
          onChange={(e) => handleBudgetChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600">{preferences.budget}€</div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Niveau d'expérience</h3>
        <select
          value={preferences.experience_level}
          onChange={(e) => handleExperienceChange(e.target.value)}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="débutant">Débutant</option>
          <option value="intermédiaire">Intermédiaire</option>
          <option value="avancé">Avancé</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Analyse en cours...' : 'Analyser mes préférences'}
        </button>
      </div>
    </form>
  );
}
