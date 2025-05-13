'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from '../services/authService';

export default function Page() {
    const [notification, setNotification] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | undefined>('');
    const router = useRouter();

    useEffect(() => {
        const success = searchParams.get('success');
        const message = searchParams.get('message');

        if (success === 'true' && message) {
            setNotification(message);

            // Nettoyer l'URL après quelques secondes
            const timer = setTimeout(() => {
                window.history.replaceState({}, '', '/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await loginUser(username, password);

        if (result.success) {
            window.location.reload();
            router.push('/?success=true&message=Vous%20%C3%AAtes%20maintenant%20connect%C3%A9')
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {notification && (
                    <div className="notification success">
                        {notification}
                        <button onClick={() => setNotification(null)}>x</button>
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
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    placeholder="Email"
                                    type="email"
                                    // value={form.username}
                                    // onChange={handleChange}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div>
                                <input
                                    id="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    type="password"
                                    // value={form.password}
                                    // onChange={handleChange}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
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
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Connexion
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}