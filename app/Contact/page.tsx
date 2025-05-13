// pages/contact.tsx
import React from 'react';
import Head from 'next/head';
import { FiMail, FiPhone } from 'react-icons/fi';

const ContactPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact | Notre Site</title>
        <meta name="description" content="Contactez-nous par email ou téléphone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Bannière supérieure */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-32 w-full relative">
            <div className="absolute -bottom-10 inset-x-0 flex justify-center">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full p-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    className="w-8 h-8 text-white"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="pt-16 pb-12 px-6 sm:px-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Contactez-nous</h1>
            <p className="text-center text-gray-600 mb-12">
              Nous sommes à votre écoute pour toute question ou demande d&apos;information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <FiMail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Email</h2>
                <p className="text-gray-600 mb-4 text-center">
                  Envoyez-nous un message, nous vous répondrons dans les plus brefs délais (fictif)
                </p>
                <a 
                  href="mailto:contact@example.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-300"
                >
                  contact@ParisJO.com
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <FiPhone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Téléphone</h2>
                <p className="text-gray-600 mb-4 text-center">
                  Appelez-nous du lundi au vendredi de 9h à 18h (fictif)
                </p>
                <a 
                  href="tel:+33123456789" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-300"
                >
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>

            {/* Decoration dots */}
            <div className="flex justify-center mt-12 space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;