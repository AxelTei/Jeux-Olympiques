// components/ParisOlympicsSection.tsx
import React, { useState } from 'react';

// Types pour nos données
type Sport = {
  id: string;
  nom: string;
  description: string;
  lieu: string;
  dates: string;
  image: string;
};

// Données des sports olympiques de Paris 2024
const sportsOlympiques: Sport[] = [
  {
    id: 'athletisme',
    nom: 'Athlétisme',
    description: 'L\'athlétisme est composé d\'épreuves variées de course, saut et lancer. Discipline historique des Jeux Olympiques, elle attire toujours les plus grands talents mondiaux.',
    lieu: 'Stade de France, Saint-Denis',
    dates: '1-11 août 2024',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/13/23/action-1834465_1280.jpg',
  },
  {
    id: 'natation',
    nom: 'Natation',
    description: 'La natation regroupe plusieurs disciplines aquatiques, dont la nage libre, le papillon, la brasse et le dos. Les courses varient de 50m à 1500m, individuelles ou en relais.',
    lieu: 'Paris La Défense Arena',
    dates: '27 juillet - 4 août 2024',
    image: 'https://cdn.pixabay.com/photo/2013/02/09/04/23/swimmers-79592_1280.jpg',
  },
  {
    id: 'gymnastique',
    nom: 'Gymnastique',
    description: 'La gymnastique artistique comprend des épreuves au sol, aux agrès et au saut. Les athlètes sont jugés sur leur technique, leur exécution et la difficulté de leurs mouvements.',
    lieu: 'Bercy Arena',
    dates: '27 juillet - 5 août 2024',
    image: 'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg',
  },
  {
    id: 'cyclisme',
    nom: 'Cyclisme',
    description: 'Le cyclisme aux JO inclut des épreuves sur route, sur piste, le VTT et le BMX. Ces compétitions testent l\'endurance, la vitesse et la technique des coureurs.',
    lieu: 'Vélodrome National et parcours urbains',
    dates: '27 juillet - 11 août 2024',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/12/49/bicycle-road-1834265_1280.jpg',
  },
  {
    id: 'escrime',
    nom: 'Escrime',
    description: 'L\'escrime se divise en trois armes : l\'épée, le fleuret et le sabre. Les escrimeurs s\'affrontent en duel dans des matchs d\'une grande technicité et vivacité.',
    lieu: 'Grand Palais',
    dates: '27 juillet - 4 août 2024',
    image: '/pexels-cottonbro-6831794.jpg',
  },
  {
    id: 'judo',
    nom: 'Judo',
    description: 'Le judo est un art martial japonais devenu discipline olympique. Les judokas s\'affrontent dans différentes catégories de poids, cherchant à marquer des points par des projections ou immobilisations.',
    lieu: 'Champ-de-Mars Arena',
    dates: '27 juillet - 3 août 2024',
    image: '/pexels-rdne-8611418.jpg',
  },
];

const ParisOlympicsSection: React.FC = () => {
  const [sportActif, setSportActif] = useState<string | null>(null);

  // Filtrer le sport actif
  const sportDetails = sportActif
    ? sportsOlympiques.find((sport) => sport.id === sportActif)
    : null;

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Paris 2024 - Jeux Olympiques
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez les principales épreuves des Jeux Olympiques de Paris 2024, un événement sportif mondial se déroulant du 26 juillet au 11 août.
          </p>
        </div>

        {/* Grille de sports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sportsOlympiques.map((sport) => (
            <div
              key={sport.id}
              className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                sportActif === sport.id ? 'ring-4 ring-blue-500 scale-105' : ''
              }`}
              onClick={() => setSportActif(sport.id === sportActif ? null : sport.id)}
            >
              <div className="relative h-56 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-full bg-gray-300"
                    style={{
                      backgroundImage: `url(${sport.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>
                <div className="absolute bottom-0 left-0 z-20 p-4 w-full">
                  <h3 className="text-xl font-bold text-white mb-1">{sport.nom}</h3>
                  <p className="text-sm text-gray-200">{sport.lieu}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section détaillée du sport sélectionné */}
        {sportDetails && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative h-72 md:h-full w-full">
                  <div 
                    className="w-full h-full bg-gray-300"
                    style={{
                      backgroundImage: `url(${sportDetails.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </div>
              </div>
              <div className="p-8 md:w-1/2">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold mb-1">
                  Épreuve olympique
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{sportDetails.nom}</h2>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{sportDetails.lieu}</span>
                </div>
                <div className="flex items-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{sportDetails.dates}</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-8">{sportDetails.description}</p>
                <button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setSportActif(null)}
                >
                  Retour aux épreuves
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParisOlympicsSection;