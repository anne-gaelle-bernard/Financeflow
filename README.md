FinanceFlow

Monorepo skeleton for the FinanceFlow project. Contains a minimal backend (Express) and frontend (Vite + React) scaffolding.

Structure

financeflow/
│
├── backend/              ← Node.js (Express + database)
│   ├── src/
│   │   ├── routes/       ← All your API routes (transactions, users, etc.)
│   │   ├── controllers/  ← Business logic for each route
│   │   ├── models/       ← Database models (for users, transactions, budgets)
│   │   ├── config/       ← Database connection (MariaDB / MySQL)
│   │   ├── middleware/   ← Auth, validation, etc.
│   │   └── app.js        ← Express app entry point
│   ├── package.json
│   └── server.js         ← Starts the server (import app.js)
│
├── frontend/             ← React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/     ← Axios calls to your backend API
│   │   └── App.jsx
│   ├── package.json
	└── vite.config.js
│
└── README.md

See `backend/README.md` and `frontend/README.md` for getting started instructions.

Présentation du projet

FinanceFlow est une application web développée avec React pour le frontend et un backend PHP + MariaDB/SQL.

Pour rendre la gestion financière plus visuelle, FinanceFlow intègre des graphiques interactifs à l’aide de bibliothèques reconnues telles que Chart.js et D3.js.

Fonctionnalités principales :

- Avoir la possibilité d’ajouter une nouvelle transaction
- Qualifier une transaction (date, lieu, titre, description facultative…)
- Chaque transaction doit avoir une catégorie et une sous-catégorie associée à cette catégorie
- Afficher la liste des transactions
- Afficher le solde restant
- Trier et filtrer les transactions (par catégorie, sous catégories, date, montant…)
- Ajoutez la possibilité de définir des budgets pour chacune des catégories et des sous catégories
- Afficher les limites sur les graphiques
- Permettre de partager une transaction entre plusieurs utilisateurs

Design et accessibilité

L’application est entièrement responsive et conçue selon une approche mobile first, garantissant une expérience utilisateur optimale sur tous les types d’écrans : ordinateurs, tablettes et smartphones.
