# 🏅 Application Web Jeux Olympiques Paris 2024

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Status-Développement%20Terminé-green" alt="Status"/>
</div>

## 📋 À propos du projet

Cette application front-end basée sur Next.js et TypeScript permet aux utilisateurs de consulter les événements, réserver des billets et gérer leur participation aux Jeux Olympiques de Paris 2024. (Projet Fictif - Étudiant) L'interface utilisateur moderne et réactive offre une expérience utilisateur optimale sur tous les appareils.

## 🛠️ Technologies utilisées

<table>
  <tr>
    <td><strong>Framework</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Next.js-15.2.4-black" alt="Next.js"/><br/>
      <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React"/><br/>
      <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript"/>
    </td>
  </tr>
  <tr>
    <td><strong>Styles</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4" alt="Tailwind CSS"/>
    </td>
  </tr>
  <tr>
    <td><strong>Paiement (Mock)</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Stripe-7.3.0-6772E5" alt="Stripe"/>
    </td>
  </tr>
  <tr>
    <td><strong>Tests</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Vitest-3.1.1-6E9F18" alt="Vitest"/><br/>
      <img src="https://img.shields.io/badge/Cypress-14.3.0-17202C" alt="Cypress"/><br/>
      <img src="https://img.shields.io/badge/Testing%20Library-16.3.0-E33332" alt="Testing Library"/>
    </td>
  </tr>
</table>

## ⚙️ Prérequis

- Node.js 20.x ou supérieur
- npm 10.x ou supérieur
- Connexion à l'API de billetterie des JO 

## 🚀 Installation et démarrage

### Cloner le dépôt
```bash
git clone https://github.com/votre-organisation/jeux-olympiques.git
cd jeux-olympiques
```

### Installer les dépendances
```bash
npm install
```

### Variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# API
NEXT_PUBLIC_API_URL=votre_url_api_backend

# Stripe
Pas besoin c'est un mock
```

### Lancer le serveur de développement
```bash
pnpm run dev
```

L'application sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000)

## 🧪 Tests

### Tests unitaires
```bash
npm test
```

### Tests e2e
```bash
npm run cypress:open
```

## 📱 Fonctionnalités principales

- **🎫 Gestion des billets**
  - Achat et réservation de billets
  - Génération de QR code pour l'accès aux événements

- **💳 Paiement sécurisé**
  - Intégration avec Stripe pour les paiements

- **👤 Gestion du profil**
  - Authentification utilisateur

- **📱 Support mobile**
  - Interface responsive
  - Scan de QR code via l'appareil photo

## 🔒 Sécurité

L'application implémente plusieurs mesures de sécurité :

- Sanitisation des entrées utilisateur avec DOMPurify
- Authentification sécurisée avec rate limiter
- Paiements protégés via Mock Stripe
- Protection contre les attaques XSS et CSRF

## 🚀 Déploiement

### Construction pour la production
```bash
npm run build
```

### Lancement en production
```bash
npm run start
```

### Avec Docker
```bash
# Construction de l'image
docker build -t jo-frontend:latest .

# Exécution du conteneur
docker run -d -p 3000:3000 --name jo-frontend jo-frontend:latest
```

## 👨‍💻 Auteurs

<div align="center">
  <strong>Développé avec ❤️ par</strong>
  <br>
  Axel Teisseire
</div>

---

<div align="center">
  <br>
  <img src="https://img.shields.io/badge/Made%20with-Next.js-black" alt="Made with Next.js"/>
</div>
