'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Type pour les erreurs de formulaire
type FormErrors = {
  username?: string;
  alias?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export default function Page() {
    const [form, setForm] = useState({ username: '', alias: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    // Vérifier la force du mot de passe
    useEffect(() => {
        if (form.password) {
            let strength = 0;
            if (form.password.length >= 8) strength += 1;
            if (/[A-Z]/.test(form.password)) strength += 1;
            if (/[a-z]/.test(form.password)) strength += 1;
            if (/[0-9]/.test(form.password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(form.password)) strength += 1;
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [form.password]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Validation email
        if (!form.username) {
            newErrors.username = "L'email est requis";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) {
            newErrors.username = "Format d'email invalide";
            isValid = false;
        }

        // Validation nom et prénom
        if (!form.alias) {
            newErrors.alias = "Le nom est requis";
            isValid = false;
        } else if (form.alias.length < 3) {
            newErrors.alias = "Le nom doit contenir au moins 3 caractères";
            isValid = false;
        }

        // Validation mot de passe
        if (!form.password) {
            newErrors.password = "Le mot de passe est requis";
            isValid = false;
        } else {
            if (form.password.length < 8) {
                newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
                isValid = false;
            } else if (!/[A-Z]/.test(form.password)) {
                newErrors.password = "Le mot de passe doit contenir au moins une majuscule";
                isValid = false;
            } else if (!/[a-z]/.test(form.password)) {
                newErrors.password = "Le mot de passe doit contenir au moins une minuscule";
                isValid = false;
            } else if (!/[0-9]/.test(form.password)) {
                newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
                isValid = false;
            } else if (!/[^A-Za-z0-9]/.test(form.password)) {
                newErrors.password = "Le mot de passe doit contenir au moins un caractère spécial";
                isValid = false;
            }
        }

        // Vérifier que les mots de passe correspondent
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Effacer les erreurs lorsque l'utilisateur tape
        if (errors[e.target.name as keyof FormErrors]) {
            setErrors({...errors, [e.target.name]: undefined});
        }
    }

    const sanitizeInput = (input: string): string => {
        // Échapper les caractères spéciaux pour éviter les attaques XSS
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Valider le formulaire
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Sanitiser les entrées
            const sanitizedForm = {
                username: sanitizeInput(form.username.trim()),
                alias: sanitizeInput(form.alias.trim()),
                password: form.password, // Ne pas sanitiser le mot de passe
                confirmPassword: form.confirmPassword
            };

            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: sanitizedForm.username,
                    alias: sanitizedForm.alias,
                    password: sanitizedForm.password,
                })
            });
    
            if (res.ok) {
                setForm({ username: '', password: '', alias: '', confirmPassword:''});
                router.push('/Login?success=true&message=Votre%20compte%20a%20%C3%A9t%C3%A9%20cr%C3%A9%C3%A9%20avec%20succ%C3%A8s');
            } else {
                const error = await res.text();
                setMessage(`Erreur: ${error}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Fonction d'admin simplifiée - sera supprimée en production
    const handleSubmitAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            // Utiliser l'URL d'origine
            const res = await fetch('http://localhost:8080/auth/signupAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (res.ok) {
                router.push('/Login?success=true&message=Votre%20compte%20a%20%C3%A9t%C3%A9%20cr%C3%A9%C3%A9%20avec%20succ%C3%A8s');
            } else {
                const error = await res.text();
                setMessage(`Erreur: ${error}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Créer un compte
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link href="/Login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        connectez-vous à votre compte existant
                    </Link>
                </p>
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
                                    autoComplete="email"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="alias" className="block text-sm font-medium text-gray-700">
                                Nom et Prénom
                            </label>
                            <div className="mt-1">
                                <input
                                    id="alias"
                                    name="alias"
                                    placeholder="Nom et Prénom"
                                    autoComplete="name"
                                    value={form.alias}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.alias ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {errors.alias && (
                                    <p className="mt-1 text-sm text-red-600">{errors.alias}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    type="password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                            {/* Indicateur de force de mot de passe */}
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                passwordStrength === 0 ? 'bg-gray-200' :
                                                passwordStrength < 3 ? 'bg-red-500' :
                                                passwordStrength < 5 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${passwordStrength * 20}%` }}
                                        />
                                    </div>
                                    <span className="ml-2 text-xs">
                                        {passwordStrength === 0 ? '' :
                                         passwordStrength < 3 ? 'Faible' :
                                         passwordStrength < 5 ? 'Moyen' : 'Fort'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmer le Mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirmer le Mot de passe"
                                    type="password"
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                        
                        {message && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-sm font-medium text-red-800">{message}</h2>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            >
                                {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                            </button>
                        </div>
                    </form>
                    
                    {/* Bouton admin - SERA SUPPRIMÉ EN PRODUCTION */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Administration</h3>
                        <button
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100"
                            onClick={handleSubmitAdmin}
                        >
                            {isSubmitting ? 'Traitement...' : 'Enregistrer Admin'}
                        </button>
                        <p className="mt-1 text-xs text-gray-500 italic">Ce bouton sera supprimé en production</p>
                    </div>
                </div>
            </div>
        </div>
    );
}