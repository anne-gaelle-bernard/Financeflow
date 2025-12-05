# FinanceFlow Frontend

Interface utilisateur moderne et réactive pour la gestion des finances personnelles.

## 🎯 Fonctionnalités

### Pages Implémentées

1. **Authentication**
   - Login / Signup avec JWT
   - Validation des formulaires
   - Stockage des tokens sécurisé

2. **Dashboard (Home)**
   - Vue d'ensemble des finances
   - Statistiques mensuelles (revenus, dépenses, solde)
   - Aperçu des transactions récentes
   - Actions rapides vers les autres sections

3. **Transactions**
   - CRUD complet pour les transactions
   - Filtrage par catégorie et type (revenue/expense)
   - Affichage détaillé des transactions
   - Modal pour créer/modifier

4. **Catégories**
   - Gestion des catégories
   - Assignation de couleurs aux catégories
   - Descriptions personnalisées

5. **Budgets**
   - Création et gestion des budgets mensuels
   - Suivi par catégorie
   - Limitation des dépenses

6. **Rapports**
   - Visualisation des rapports mensuels
   - Statistiques d'income/expense
   - Calcul automatique du solde

7. **Settings**
   - Mise à jour du profil utilisateur
   - Changement de mot de passe
   - Suppression de compte
   - Déconnexion

## 📁 Structure du Projet

```
Frontend/
├── src/
│   ├── components/
│   │   └── Header.jsx          # Barre de navigation principale
│   ├── pages/
│   │   ├── Home.jsx            # Dashboard principal
│   │   ├── Login.jsx           # Formulaire de connexion
│   │   ├── Signup.jsx          # Formulaire d'inscription
│   │   ├── Transactions.jsx    # Gestion des transactions
│   │   ├── Categories.jsx      # Gestion des catégories
│   │   ├── Budgets.jsx         # Gestion des budgets
│   │   ├── Reports.jsx         # Affichage des rapports
│   │   └── Settings.jsx        # Paramètres utilisateur
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Protection des routes
│   ├── services/
│   │   └── api.js              # Appels API avec axios
│   ├── styles/
│   │   ├── main.css            # Styles principaux
│   │   └── Auth.css            # Styles des pages d'auth
│   ├── App.jsx                 # Routage principal
│   └── main.jsx                # Point d'entrée
├── package.json
├── vite.config.js
└── index.html
```

## 🔧 Installation & Configuration

### Dépendances

```bash
npm install
```

### Variables d'Environnement

Créer un fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

### Démarrage du Serveur de Développement

```bash
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

## 🎨 Design System

### Couleurs
- **Accent Principal**: `#22d3ee` (Cyan)
- **Succès**: `#86efac` (Vert)
- **Danger**: `#fecaca` (Rouge)
- **Texte Principal**: `#e8fff6` (Blanc cassé)
- **Texte Secondaire**: `#a7f3d0` (Vert pâle)
- **Background**: `#06231f` (Vert très foncé)

### Composants
- **Modal**: Superposition modale avec formulaires
- **Table**: Tableaux pour l'affichage de données
- **Button**: Boutons avec états hover
- **Form**: Formulaires avec validation

## 📡 API Integration

### Service API (`services/api.js`)

Endpoints disponibles:

**Users**
- `registerUser(payload)` - POST /users/register
- `loginUser(payload)` - POST /users/login
- `getAllUsers()` - GET /users
- `getUserById(id)` - GET /users/:id
- `updateUser(id, payload)` - PUT /users/:id
- `deleteUser(id)` - DELETE /users/:id

**Transactions**
- `fetchTransactions()` - GET /transactions
- `getTransactionsByUser(userId)` - GET /transactions/user/:userId
- `getTransactionById(id)` - GET /transactions/:id
- `createTransaction(payload)` - POST /transactions
- `updateTransaction(id, payload)` - PUT /transactions/:id
- `deleteTransaction(id)` - DELETE /transactions/:id

**Categories**
- `getAllCategories()` - GET /categories
- `getCategoriesByUser(userId)` - GET /categories/user/:userId
- `getCategoryById(id)` - GET /categories/:id
- `createCategory(payload)` - POST /categories
- `updateCategory(id, payload)` - PUT /categories/:id
- `deleteCategory(id)` - DELETE /categories/:id

**Budgets**
- `getAllBudgets()` - GET /budgets
- `getBudgetsByUser(userId)` - GET /budgets/user/:userId
- `getBudgetById(id)` - GET /budgets/:id
- `createBudget(payload)` - POST /budgets
- `updateBudget(id, payload)` - PUT /budgets/:id
- `deleteBudget(id)` - DELETE /budgets/:id

**Reports**
- `getAllReports()` - GET /reports
- `getReportsByUser(userId)` - GET /reports/user/:userId
- `getReportById(id)` - GET /reports/:id
- `createReport(payload)` - POST /reports
- `updateReport(id, payload)` - PUT /reports/:id
- `deleteReport(id)` - DELETE /reports/:id

## 🔐 Authentification

### Tokens JWT
- Tokens stockés dans `localStorage` avec la clé `ff_token`
- Tokens ajoutés automatiquement aux headers: `Authorization: Bearer <token>`
- Durée de vie: 7 jours

### Routes Protégées
- Les routes doivent être enveloppées dans `<ProtectedRoute />`
- Les utilisateurs non authentifiés sont redirigés vers `/login`

## 🚀 Déploiement

### Build pour Production

```bash
npm run build
```

### Preview Local

```bash
npm run preview
```

## 📦 Technologies Utilisées

- **React 18.3** - Framework UI
- **React Router 6.23** - Routage
- **Axios 1.7** - Requêtes HTTP
- **Vite 5** - Build tool
- **CSS3** - Styling

## 📝 Notes

- Les données utilisateur sont stockées dans `localStorage` (clé: `ff_user`)
- Les modales utilisent une approche contrôlée avec état React
- Les formulaires utilisent la validation HTML5
- Le design est responsive et mobile-friendly

## 🤝 Support

Pour toute question ou problème, consultez la documentation du backend ou contactez l'équipe de développement.
