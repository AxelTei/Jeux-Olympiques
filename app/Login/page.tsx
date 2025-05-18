'use client';

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from '../services/authService';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';

// Interface pour notre formulaire
interface LoginFormInputs {
  username: string;
  password: string;
}

// Composant qui utilise useSearchParams
function LoginContent() {
    const [notification, setNotification] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState<number | null>(null);

    // Utilisation de react-hook-form pour validation du formulaire
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset
    } = useForm<LoginFormInputs>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        const success = searchParams.get('success');
        const message = searchParams.get('message');

        if (success === 'true' && message) {
            // Sanitize le message avant de l'afficher
            setNotification(DOMPurify.sanitize(message));

            // Nettoyer l'URL après quelques secondes
            const timer = setTimeout(() => {
                window.history.replaceState({}, '', '/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    // Effet pour gérer le verrouillage du formulaire après trop de tentatives
    useEffect(() => {
        if (loginAttempts >= 5 && !isLocked) {
            setIsLocked(true);
            const timer = window.setTimeout(() => {
                setIsLocked(false);
                setLoginAttempts(0);
            }, 15 * 60 * 1000); // 15 minutes
            setLockTimer(timer);
            return () => {
                if (lockTimer) clearTimeout(lockTimer);
            };
        }
    }, [loginAttempts, isLocked, lockTimer]);

    // Fonction pour valider et sanitizer l'email
    const validateEmail = (email: string): boolean => {
        // Regex pour validation d'email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Fonction pour sanitizer les inputs
    const sanitizeInput = (input: string): string => {
        return DOMPurify.sanitize(input.trim());
    };

    const onSubmit = async (data: LoginFormInputs) => {
        if (isLocked) {
            setError("Trop de tentatives échouées. Veuillez réessayer dans 5 minutes.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Sanitize les inputs avant envoi
            const sanitizedUsername = sanitizeInput(data.username);
            const sanitizedPassword = data.password; // On ne sanitize pas le mot de passe pour ne pas modifier sa valeur

            // Validation supplémentaire côté client
            if (!validateEmail(sanitizedUsername)) {
                setError("Format d'email invalide");
                setIsSubmitting(false);
                return;
            }

            // Envoi de la requête avec des paramètres sanitizés
            const result = await loginUser(sanitizedUsername, sanitizedPassword);

            if (result.success) {
                // Reset des tentatives de connexion
                setLoginAttempts(0);
                reset();
                window.location.reload();
                router.push('/?success=true&message=Vous%20%C3%AAtes%20maintenant%20connect%C3%A9');
            } else {
                // Incrémenter le compteur de tentatives échouées
                setLoginAttempts(prev => prev + 1);
                setError(result.message);
            }
        } catch (err) {
            setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
            console.error("Login error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {notification && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex justify-between items-center">
                        <span>{notification}</span>
                        <button 
                            onClick={() => setNotification(null)}
                            className="text-green-700 hover:text-green-900"
                            aria-label="Fermer"
                        >
                            x
                        </button>
                    </div>
                )}
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Connectez-vous
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link href="/CreationDeCompte" className="font-medium text-indigo-600 hover:text-indigo-500">
                        créer un nouveau compte
                    </Link>
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">Vous pouvez quitter le site sans vous déconnecter, le site vous reconnaitra à votre retour.</p>
                <p className="mt-2 text-center text-sm text-gray-600">Cependant, si vous revenez une journée après votre déconnexion, veuillez-vous déconnecter/reconnecter car votre session sera expirée.</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {isLocked ? (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h2 className="text-sm font-medium text-red-800">
                                        Compte temporairement verrouillé. Veuillez réessayer dans 15 minutes.
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="username"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email"
                                        aria-invalid={errors.username ? "true" : "false"}
                                        {...register("username", {
                                            required: "L'email est requis",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Format d'email invalide"
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "L'email ne peut pas dépasser 100 caractères"
                                            }
                                        })}
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            errors.username ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <div>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Mot de passe"
                                        aria-invalid={errors.password ? "true" : "false"}
                                        {...register("password", {
                                            required: "Le mot de passe est requis",
                                            minLength: {
                                                value: 8,
                                                message: "Le mot de passe doit contenir au moins 8 caractères"
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Le mot de passe ne peut pas dépasser 100 caractères"
                                            }
                                        })}
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h2 className="text-sm font-medium text-red-800">{error}</h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                >
                                    {isSubmitting ? 'Connexion en cours...' : 'Connexion'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
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
            <LoginContent />
        </Suspense>
    );
}