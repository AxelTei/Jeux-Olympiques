'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const [notification, setNotification] = useState(null);
    const searchParams = useSearchParams();

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

    return (
        <div>
            {notification && (
                <div className="notification success">
                    {notification}
                    <button onClick={() => setNotification(null)}>x</button>
                </div>
            )}
            <h1>Bienvenue en page Login</h1>
        </div>
    );
}