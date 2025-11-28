## Aperçu du projet

* Monorepo avec `backend` (Express + MongoDB via Mongoose) et `frontend` (Vite + React)

* Le frontend (port `5173`) proxie `/api` vers le backend (port `3000`)

## Prérequis

* Node.js ≥ 18 et npm installés

* MongoDB en local (ou une URL MongoDB hébergée)

## Préparer les variables d’environnement

* Créer `backend/.env` avec:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/financeflow
JWT_SECRET=change_me_secure
```

* `frontend/.env` est optionnel (le proxy est déjà configuré dans `vite.config.js`).

## Installer les dépendances

* Dans `backend`:

```
npm install
```

* Dans `frontend`:

```
npm install
```

## Démarrer en développement

* Lancer le backend (port 3000):

```
npm run dev
```

* Lancer le frontend (port 5173):

```
npm run dev
```

## Accès

* Frontend: `http://localhost:5173/`

* API santé: `http://localhost:3000/api` (doit répondre avec un JSON statut)

## Validation rapide

* Créer un utilisateur via le frontend (pages Auth), vérifier l’obtention d’un token

* Lister/ajouter des transactions (pages Transactions), voir les données s’afficher

## Remarques Git

* Votre branche `dev` sur GitHub est à jour; pour travailler depuis ce repo, assurez-vous que la racine n’a plus de fichier lock `.git/index.lock`.

* En cas d’erreur de lock, supprimez `c:\Users\User\Documents\FinanceFlow\.git\index.lock` puis recommencez `git add/commit/push`.

Souhaitez‑vous que je lance les deux serveurs maintenant et vous ouvre un aperçu du frontend dans le navigateur ?
