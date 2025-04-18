'use client';
import { FormEvent, useState } from "react";

export default function Page() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null) // Clear previous errors when a new request starts

        try {
            const formData = new FormData(event.currentTarget)
            const response = await fetch('http://localhost:8081/auth/signup', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error("Failed to submit the data. Please try again.")
            }

            //Handle response if necessary
            //const data = await response.json()
            // ...
        } catch (error) {
            //Capture the error message to display to the user
            setError(error.message)
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h1>Création de Compte</h1>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <form onSubmit={onSubmit}>
                <label htmlFor="alias">
                    Nom et Prénom :
                    <input id="alias" type="text" name="alias"/>
                </label>
                <label htmlFor="username">
                    Email :
                    <input id="username" type="email" name="username"/>
                </label>
                <label htmlFor="password">
                    Mot de passe :
                    <input id="password" type="password" name="password"/>
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}
