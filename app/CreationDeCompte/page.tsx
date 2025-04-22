'use client';
import { useState } from "react";

export default function Page() {
    const [form, setForm] = useState({ username: '', alias: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setMessage('Compte créé avec succès !');
            setForm({ username: '', password: '', alias: ''});
        } else {
            const error = await res.text();
            setMessage(`Erreur: ${error}`)
        }
    }

    return (
        <div>
            <h1>Création de Compte</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Email"
                    type="email"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    name="alias"
                    placeholder="Nom et Prénom"
                    value={form.alias}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    placeholder="Mot de passe"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button>S&apos;inscrire</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
