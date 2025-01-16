import { useState, useEffect } from 'react';
import { personService } from '@/services/personService';
import type { Person } from '@/services/personService';

export default function PersonsList() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [analyzingPerson, setAnalyzingPerson] = useState(false);

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      setLoading(true);
      const loadedPersons = searchQuery
        ? await personService.searchPersons(searchQuery)
        : await personService.getPersons();
      
      setPersons(loadedPersons);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPersons();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePersonSelect = async (person: Person) => {
    try {
      setSelectedPerson(person);
      setAnalyzingPerson(true);
      setAnalysis(null);
      setSuggestions(null);

      const [interestAnalysis, nextActions] = await Promise.all([
        personService.analyzePersonInterests(person),
        personService.suggestNextActions(person)
      ]);

      setAnalysis(interestAnalysis);
      setSuggestions(nextActions);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError('Erreur lors de l\'analyse des données');
    } finally {
      setAnalyzingPerson(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          Liste des Personnes
        </h2>
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des personnes */}
        <div className="space-y-4">
          {persons.map((person) => (
            <div
              key={person.id}
              className={`bg-green-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                selectedPerson?.id === person.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handlePersonSelect(person)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-900">
                  {person.name}
                </h3>
                <span className="text-sm px-2 py-1 bg-green-200 text-green-800 rounded-full">
                  {person.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-green-800">
                {person.age > 0 && (
                  <p>Âge : {person.age} ans</p>
                )}
                
                {person.email && (
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {person.email}
                  </p>
                )}
                
                {person.phone && (
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {person.phone}
                  </p>
                )}

                {person.interests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-green-700 font-medium mb-1">Intérêts :</p>
                    <div className="flex flex-wrap gap-2">
                      {person.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {person.last_contact && (
                  <p className="mt-3 text-xs text-green-600">
                    Dernier contact : {new Date(person.last_contact).toLocaleDateString()}
                  </p>
                )}

                {person.notes && (
                  <div className="mt-3 p-2 bg-green-100 rounded">
                    <p className="text-xs italic text-green-700">{person.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {persons.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Aucune personne trouvée
            </div>
          )}
        </div>

        {/* Panneau d'analyse */}
        <div className="bg-green-50 p-6 rounded-lg">
          {selectedPerson ? (
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-4">
                Analyse pour {selectedPerson.name}
              </h3>

              {analyzingPerson ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {analysis && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Analyse des intérêts</h4>
                      <div className="bg-white p-4 rounded-lg text-sm whitespace-pre-line">
                        {analysis}
                      </div>
                    </div>
                  )}

                  {suggestions && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Actions recommandées</h4>
                      <div className="bg-white p-4 rounded-lg text-sm whitespace-pre-line">
                        {suggestions}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Sélectionnez une personne pour voir l'analyse
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
