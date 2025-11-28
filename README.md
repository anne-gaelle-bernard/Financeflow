FinanceFlow

Monorepo avec backend (Express + MongoDB via Mongoose) et frontend (Vite + React).

Structure

financeflow/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── config/
│   │   ├── middleware/
│   │   └── app.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md

Voir `backend/README.md` et `frontend/README.md` pour démarrer.
Présentation du projet

FinanceFlow est une application web développée avec React pour le frontend et un backend Node.js + MongoDB.

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
