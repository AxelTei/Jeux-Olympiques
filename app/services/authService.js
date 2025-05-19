/**
 * Authentifie un utilisateur avec les identifiants fournis
 * @param {string} username - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<{success: boolean, token?: string, user?: object, message?: string}>}
 */
export const loginUser = async (username, password) => {
    try {
        const response = await fetch('https://jo-api-9bdf561a2bea.herokuapp.com/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('authToken', (data.token));
            if (data.id) {
                localStorage.setItem('userId', JSON.stringify(data.id))
                localStorage.setItem('userData', JSON.stringify(data.username))
                localStorage.setItem('userRole', JSON.stringify(data.roles))
                localStorage.setItem('userKey', JSON.stringify(data.userKey))
                localStorage.setItem('userAlias', JSON.stringify(data.alias))
            }

            return { success: true, token: data.token, user: data.user };
        } else {
            return { success: false, message: data.message || 'Échec de connexion' };
        }
    } catch (error) {
        console.error('Erreur lors de la connexion: ', error);
        return { success: false, message: 'Erreur de connexion au serveur'};
    }
};

/**
 * Récupère le token d'authentification du localStorage
 * @returns {string|null} Le token d'authentification ou null s'il n'existe pas
 */
export const getAuthToken = () => {
    //Vérification si window existe (important pour Next.js qui fait du SSR)
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

/**
 * Récupère le surnom de l'utilisateur connecté
 * @returns {string|null} Le surnom de l'utilisateur ou null s'il n'existe pas
 */
export const getAlias = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userAlias');
    }
    return null;
};

/**
 * Récupère le role de l'utilisateur connecté
 * @returns {string|null} Le role de l'utilisateur ou null s'il n'existe pas
 */
export const getRole = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userRole');
    }
    return null;
};

/**
 * Vérifie si l'utilisateur est actuellement connecté
 * @returns {boolean} True si l'utilisateur est connecté, false sinon
 */
export const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token; // Convertit en booléen (true si token existe, false sinon)
};

/**
 * Récupère les données de l'utilisateur stockées dans le localStorage
 * @returns {string|null} l'email de l'utilisateur ou null si non disponible
 */
export const getUserData = () => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
    return null;
};

/**
 * Récupère la clef de l'utilisateur stockée dans le locastorage
 * @returns {string|null} la clef utilisateur ou null si non disponible
 */
export const getUserKey = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userKey');
    }
    return null;
}

/**
 * Déconnecte l'utilisateur en supprimant les données d'authentification
 * et en faisant un appel vers Spring Boot pour la déconnexion côté back-end
*/
export const logoutUser = async () => {
    if (typeof window !== 'undefined') {
        try {
            const response = await fetch('https://jo-api-9bdf561a2bea.herokuapp.com/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userKey');
                localStorage.removeItem('userAlias');
                localStorage.removeItem('paymentInfo');
            } else {
                return { success: false, message: data.message || 'Échec de déconnexion' };
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion: ', error);
            return { success: false, message: 'La déconnexion au serveur a échoué'};
        }
    }
};