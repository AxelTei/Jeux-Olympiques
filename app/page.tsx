'use client';
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HomeArticleSection from "./ui/HomeArticleSection";
import HomeImageSection from "./ui/HomeImageSection";
import ParisOlympicsSection from "./ui/ParisOlympicsSection";

// Composant qui utilise useSearchParams
function HomeContent() {
  const [notification, setNotification] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const message: string | null = searchParams.get('message');
    if (success === 'true' && message) {
      setNotification(message);
      //Nettoyer l'URL après quelques secondes
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/');
      }, 5000);
      //Masquer la notification après 5 secondes
      const hideTimer = setTimeout(() => {
        setNotification(null)
      }, 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [searchParams]);

  return (
    <div>
      {/* Notification de succès */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-100 border-l-4 border-green-500 p-4 shadow-md rounded-md animate-fade-in-down">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{notification}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button onClick={() => setNotification(null)} className="inline-flex bg-green-100 rounded-md p-1.5 text-green-500 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400" >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <HomeArticleSection />
      <HomeImageSection />
      <ParisOlympicsSection />
    </div>
  );
}

// Composant principal avec Suspense
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}