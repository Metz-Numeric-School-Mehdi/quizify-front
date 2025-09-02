# Quiz### Architecture technique

### Stack principal
- **Framework**: Nuxt.js 3 (Vue.js 3 + SSR/SSG)
- **Langage**: TypeScript
- **Gestionnaire de paquets**: Bun
- **Styling**: Tailwind CSS + Composants UI (shadcn/ui)
- **Gestion d'état**: Pinia avec persistance
- **Validation**: Vee-Validate + Zod
- **Animations**: Tailwind CSS Animate + FormKit Auto-animate
- **Icons**: Lucide Vue Next + Iconify

## Architecture des fichiers du projet

```
quizify-front/
├── 📁 .nuxt/                        # Fichiers générés par Nuxt (auto-générés)
│   ├── components.d.ts               # Types des composants auto-importés
│   ├── imports.d.ts                  # Types des imports auto-importés
│   ├── nuxt.d.ts                     # Types principaux de Nuxt
│   ├── tsconfig.json                 # Configuration TypeScript pour Nuxt
│   └── types/                        # Types générés automatiquement
│
├── 📁 assets/                        # Ressources statiques (images, CSS, animations)
│   ├── 📁 animation/
│   │   └── checkIconAnimate.vue      # Animation d'icône de validation
│   ├── 📁 css/
│   │   └── tailwind.css             # Styles Tailwind CSS personnalisés
│   └── 📁 img/                      # Images du projet
│       ├── card_wallp.jpeg          # Image de fond pour les cartes
│       ├── icon.png                 # Icône de l'application
│       └── support_img.png          # Image de support
│
├── 📁 components/                    # Composants Vue réutilisables
│   ├── 📁 auth/                     # Composants d'authentification
│   │   ├── LoginForm.vue            # Formulaire de connexion
│   │   ├── SignIn.vue               # Interface de connexion
│   │   └── SignUp.vue               # Interface d'inscription
│   │
│   ├── 📁 common/                   # Composants communs/utilitaires
│   │   ├── DragAndDropImage.vue     # Composant de drag & drop d'images
│   │   ├── Loading.vue              # Indicateur de chargement
│   │   ├── NumberFieldTimer.vue     # Champ numérique avec timer
│   │   └── 📁 interaction/          # Composants d'interaction
│   │       ├── SelectComponent.vue   # Composant de sélection personnalisé
│   │       └── SwitchComponent.vue   # Composant de switch personnalisé
│   │
│   ├── 📁 home/                     # Composants de la page d'accueil
│   │   └── Home.vue                 # Composant principal de la page d'accueil
│   │
│   ├── 📁 icons/                    # Icônes personnalisées
│   │   ├── Google.vue               # Icône Google (OAuth)
│   │   └── index.ts                 # Exports des icônes
│   │
│   ├── 📁 interaction/buttons/      # Boutons d'interaction
│   │   └── DefaultButton.vue        # Bouton par défaut personnalisé
│   │
│   ├── 📁 leaderboard/              # Composants du classement
│   │   └── LeaderboardDisplay.vue   # Affichage du tableau des scores
│   │
│   ├── 📁 modals/quiz/              # Modales relatives aux quiz
│   │   └── CreateQuizModal.vue      # Modale de création de quiz
│   │
│   ├── 📁 play/                     # Composants de jeu de quiz
│   │   ├── QuizCorrection.vue       # Affichage des corrections
│   │   ├── QuizHeader.vue           # En-tête pendant le jeu
│   │   ├── QuizQuestions.vue        # Interface des questions
│   │   └── QuizResults.vue          # Résultats finaux du quiz
│   │
│   ├── 📁 quiz/                     # Composants de gestion des quiz
│   │   ├── QuizAnswersEditor.vue    # Éditeur de réponses
│   │   ├── QuizInfoEditor.vue       # Éditeur d'informations de quiz
│   │   ├── QuizInfoFields.vue       # Champs d'information
│   │   ├── QuizQuestionsEditor.vue  # Éditeur de questions
│   │   └── 📁 search/               # Composants de recherche
│   │       ├── SimpleFilters.vue    # Filtres de recherche simples
│   │       └── SimpleSearch.vue     # Barre de recherche simple
│   │
│   ├── 📁 ui/                       # Composants UI basés sur shadcn/ui
│   │   ├── 📁 alert-dialog/         # Composants de dialogue d'alerte
│   │   ├── 📁 avatar/               # Composants d'avatar
│   │   ├── 📁 button/               # Composants de bouton
│   │   ├── 📁 card/                 # Composants de carte
│   │   ├── 📁 carousel/             # Composants de carrousel
│   │   ├── 📁 checkbox/             # Composants de case à cocher
│   │   ├── 📁 dropdown-menu/        # Composants de menu déroulant
│   │   ├── 📁 form/                 # Composants de formulaire
│   │   ├── 📁 input/                # Composants d'entrée
│   │   ├── 📁 label/                # Composants d'étiquette
│   │   ├── 📁 number-field/         # Composants de champ numérique
│   │   ├── 📁 select/               # Composants de sélection
│   │   ├── 📁 separator/            # Composants de séparateur
│   │   ├── 📁 sheet/                # Composants de feuille/panneau
│   │   ├── 📁 sidebar/              # Composants de barre latérale
│   │   ├── 📁 skeleton/             # Composants de squelette (loading)
│   │   ├── 📁 switch/               # Composants d'interrupteur
│   │   ├── 📁 tabs/                 # Composants d'onglets
│   │   ├── 📁 textarea/             # Composants de zone de texte
│   │   ├── 📁 toast/                # Composants de notification toast
│   │   └── 📁 tooltip/              # Composants d'info-bulle
│   │
│   ├── Icon.vue                     # Composant d'icône générique
│   ├── QuizCard.vue                 # Carte d'affichage de quiz
│   ├── QuizModal.vue                # Modale générique pour quiz
│   └── ThemeToggle.vue              # Basculeur de thème clair/sombre
│
├── 📁 composables/                  # Fonctions composables Vue
│   └── useQuizzesSearch.ts          # Logique de recherche de quiz
│
├── 📁 constants/                    # Constantes de l'application
│   ├── Auth.ts                      # Constantes d'authentification
│   ├── Navigation.ts               # Constantes de navigation
│   └── quizConfig.ts               # Configuration des quiz
│
├── 📁 layouts/                      # Layouts de page
│   └── default.vue                  # Layout par défaut de l'application
│
├── 📁 lib/                         # Bibliothèques utilitaires
│   └── utils.ts                    # Fonctions utilitaires partagées
│
├── 📁 nginx/                       # Configuration Nginx
│   └── default.conf                # Configuration du serveur Nginx
│
├── 📁 pages/                       # Pages de l'application (routing automatique)
│   ├── index.vue                   # Page d'accueil (/)
│   ├── 📁 leaderboard/
│   │   └── index.vue               # Page de classement (/leaderboard)
│   ├── 📁 login/
│   │   └── index.vue               # Page de connexion (/login)
│   ├── 📁 quiz/
│   │   ├── 📁 edit/
│   │   │   └── [id].vue            # Page d'édition de quiz (/quiz/edit/:id)
│   │   ├── 📁 my-quizzes/
│   │   │   └── index.vue           # Page mes quiz (/quiz/my-quizzes)
│   │   └── 📁 play/
│   │       └── [id].vue            # Page de jeu (/quiz/play/:id)
│   └── 📁 subscription/
│       ├── cancel.vue              # Page d'annulation d'abonnement
│       └── success.vue             # Page de succès d'abonnement
│
├── 📁 plugins/                     # Plugins Nuxt
│   └── auth.ts                     # Plugin d'authentification
│
├── 📁 public/                      # Fichiers publics statiques
│   ├── favicon.ico                 # Favicon du site
│   ├── quizifyIcon.png            # Icône de l'application
│   └── robots.txt                 # Fichier robots pour SEO
│
├── 📁 server/                      # Configuration serveur Nuxt
│   └── tsconfig.json              # Configuration TypeScript serveur
│
├── 📁 stores/                      # Stores Pinia pour la gestion d'état
│   ├── answerStore.ts             # Store des réponses
│   ├── authStore.ts               # Store d'authentification
│   ├── badgesStore.ts             # Store des badges/récompenses
│   ├── leaderboardStore.ts        # Store du classement
│   ├── organizationsStore.ts      # Store des organisations
│   ├── questionResponseStore.ts   # Store des réponses aux questions
│   ├── questionStore.ts           # Store des questions
│   ├── questionTypeStore.ts       # Store des types de questions
│   ├── quizStore.ts               # Store principal des quiz
│   ├── scoresStore.ts             # Store des scores
│   ├── teamsStore.ts              # Store des équipes
│   └── userStore.ts               # Store des utilisateurs
│
├── 📁 types/                      # Définitions de types TypeScript
│   ├── 📁 answer/
│   │   └── Answer.d.ts            # Types pour les réponses
│   ├── 📁 auth/
│   │   └── Auth.d.ts              # Types d'authentification
│   ├── 📁 badge/
│   │   └── Badge.d.ts             # Types pour les badges
│   ├── 📁 category/
│   │   └── QuizCategory.d.ts      # Types pour les catégories
│   ├── 📁 components/icon/
│   │   └── IconProps.d.ts         # Types pour les props d'icônes
│   ├── 📁 config/
│   │   └── QuizConfigType.d.ts    # Types de configuration des quiz
│   ├── 📁 error/
│   │   └── ApiError.d.ts          # Types d'erreurs API
│   ├── 📁 leaderboard/
│   │   ├── LeaderboardEntry.ts    # Types d'entrées de classement
│   │   ├── LeaderboardPagination.ts # Types de pagination
│   │   └── LeaderboardResponse.ts # Types de réponse API
│   ├── 📁 level/
│   │   └── QuizLevel.d.ts         # Types pour les niveaux
│   ├── 📁 organization/
│   │   └── Organization.d.ts      # Types pour les organisations
│   ├── 📁 question/
│   │   └── Question.d.ts          # Types pour les questions
│   ├── 📁 questionResponse/
│   │   └── QuestionResponse.d.ts  # Types pour les réponses aux questions
│   ├── 📁 questionType/
│   │   └── QuestionType.d.ts      # Types pour les types de questions
│   ├── 📁 quiz/
│   │   ├── Category.d.ts          # Types de catégories de quiz
│   │   ├── CreateQuizModal.d.ts   # Types pour la modale de création
│   │   ├── Level.d.ts             # Types de niveaux de quiz
│   │   ├── Quiz.d.ts              # Types principaux des quiz
│   │   └── QuizSubmitResult.d.ts  # Types de résultats de soumission
│   ├── 📁 score/
│   │   └── Score.d.ts             # Types pour les scores
│   ├── 📁 subscription/
│   │   └── Subscription.d.ts      # Types d'abonnements
│   ├── 📁 tag/
│   │   └── Tag.d.ts               # Types pour les tags
│   ├── 📁 team/
│   │   └── Team.d.ts              # Types pour les équipes
│   ├── 📁 user/
│   │   └── User.d.ts              # Types pour les utilisateurs
│   └── 📁 utils/
│       ├── FormData.d.ts          # Types pour les données de formulaire
│       └── RequestError.d.ts      # Types d'erreurs de requête
│
├── 📁 utils/                      # Fonctions utilitaires
│   ├── client.ts                  # Utilitaires côté client
│   └── 📁 request/
│       └── fetch.ts               # Client HTTP personnalisé
│
├── 📁 validation/                 # Schémas de validation
│   └── quizFormSchema.ts          # Schéma de validation des formulaires de quiz
│
├── 📄 app.vue                     # Composant racine de l'application
├── 📄 bun.lock                    # Fichier de verrouillage des dépendances Bun
├── 📄 components.json             # Configuration des composants shadcn/ui
├── 📄 docker-compose.yml          # Configuration Docker Compose
├── 📄 Dockerfile                  # Configuration Docker
├── 📄 healthcheck.sh              # Script de vérification de santé
├── 📄 install_7.0_en.sh          # Script d'installation
├── 📄 LLMS.md                     # Documentation pour LLMs (ce fichier)
├── 📄 Makefile                    # Commandes Make pour le développement
├── 📄 nuxt.config.ts              # Configuration principale de Nuxt
├── 📄 package.json                # Dépendances et scripts du projet
├── 📄 README.md                   # Documentation du projet
├── 📄 tailwind.config.js          # Configuration Tailwind CSS
└── 📄 tsconfig.json               # Configuration TypeScript principale
``` Contexte pour LLMs

## Vue d'ensemble du projet

**Quizify** est une application web frontend développée avec **Nuxt.js 3** pour créer, gérer et jouer à des quiz interactifs. L'application offre une interface moderne et responsive permettant aux utilisateurs de créer des quiz, les partager et suivre leurs performances via un système de classement.

## Architecture technique

### Stack principal
- **Framework**: Nuxt.js 3 (Vue.js 3 + SSR/SSG)
- **Langage**: TypeScript
- **Gestionnaire de paquets**: Bun
- **Styling**: Tailwind CSS + Composants UI (shadcn/ui)
- **Gestion d'état**: Pinia avec persistance
- **Validation**: Vee-Validate + Zod
- **Animations**: Tailwind CSS Animate + FormKit Auto-animate
- **Icons**: Lucide Vue Next + Iconify

### Configuration Nuxt
```typescript
// Modules principaux utilisés
modules: [
  "@nuxtjs/tailwindcss",     // Styles utilitaires
  "@nuxtjs/color-mode",      // Mode sombre/clair
  "shadcn-nuxt",            // Composants UI
  "@pinia/nuxt",            // Gestion d'état
  "pinia-plugin-persistedstate", // Persistance du store
  "@nuxt/fonts",            // Optimisation des polices
]
```

### Structure de l'application

#### Pages principales
- **/** : Page d'accueil avec liste des quiz
- **/login** : Authentification utilisateur
- **/quiz/create** : Création de nouveaux quiz
- **/quiz/edit/[id]** : Édition de quiz existants
- **/quiz/play/[id]** : Interface de jeu
- **/quiz/search** : Recherche et filtrage des quiz
- **/quiz/my-quizzes** : Gestion des quiz personnels
- **/leaderboard** : Classements et scores
- **/profile** : Profil utilisateur
- **/subscription** : Gestion des abonnements

#### Composants clés

##### Authentification (`components/auth/`)
- `LoginForm.vue` : Formulaire de connexion
- `SignIn.vue` : Interface de connexion
- `SignUp.vue` : Interface d'inscription

##### Quiz (`components/quiz/`)
- `QuizAnswersEditor.vue` : Éditeur de réponses
- `QuizInfoEditor.vue` : Éditeur d'informations de quiz
- `QuizInfoFields.vue` : Champs d'information
- `QuizQuestionsEditor.vue` : Éditeur de questions

##### Jeu (`components/play/`)
- `QuizCorrection.vue` : Affichage des corrections
- `QuizHeader.vue` : En-tête pendant le jeu
- `QuizQuestions.vue` : Interface des questions
- `QuizResults.vue` : Résultats finaux

##### Interface utilisateur (`components/ui/`)
Composants réutilisables basés sur shadcn/ui :
- `button/`, `card/`, `form/`, `input/`, `select/`
- `alert-dialog/`, `dropdown-menu/`, `sheet/`, `sidebar/`
- `avatar/`, `carousel/`, `tabs/`, `tooltip/`

### Gestion d'état (Pinia Stores)

#### Stores principaux
- **authStore** : Authentification et gestion utilisateur
- **quizStore** : CRUD des quiz
- **questionStore** : Gestion des questions
- **answerStore** : Gestion des réponses
- **scoresStore** : Scores et statistiques
- **leaderboardStore** : Classements
- **userStore** : Données utilisateur
- **organizationsStore** : Gestion des organisations
- **teamsStore** : Gestion des équipes
- **badgesStore** : Système de badges

#### Structure type d'un store
```typescript
export const authStore = defineStore("auth", () => {
  const state = ref<{
    user: User | null;
    token: string;
    isAuthenticated: boolean;
    ready: boolean;
    // ...
  }>({
    // État initial
  });
  
  // Actions et getters
});
```

### Types TypeScript

#### Types principaux (`types/`)
- **Quiz** : Structure des quiz avec métadonnées
- **Question** : Questions avec types et réponses
- **User** : Utilisateurs et profils
- **Auth** : Authentification (SignIn, SignUp)
- **Score** : Système de notation
- **Badge** : Système de récompenses
- **Team** : Travail en équipe
- **Organization** : Gestion organisationnelle

#### Exemple de type Quiz
```typescript
export interface Quiz {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_public: number;
  duration: number;
  pass_score: number;
  level_id: number;
  category_id: number;
  // ...
}
```

### Validation et schémas

#### Validation des formulaires (Zod + Vee-Validate)
```typescript
export const quizFormSchema = z.object({
  title: z.string().min(2, "Le titre est requis").max(100, "Titre trop long"),
  description: z.string().min(5, "Description requise"),
  duration: z.preprocess((val) => Number(val), z.number().min(1)),
  pass_score: z.preprocess((val) => Number(val), z.number().min(0).max(100)),
  level_id: z.preprocess((val) => Number(val), z.number().min(1)),
  category_id: z.preprocess((val) => Number(val), z.number().min(1)),
  is_public: z.enum(["true", "false"]),
  status: z.enum(["draft", "published", "archived"]),
  // ...
});
```

### Configuration et utilitaires

#### API et requêtes
- **Base URL** : `http://localhost:8000/api`
- **Client HTTP** : Fonction `fetchAPI` personnalisée
- **Gestion d'erreurs** : Types `RequestError` standardisés
- **Authentification** : Token-based via headers

#### Utilitaires (`utils/`)
- `client.ts` : Vérification de disponibilité localStorage
- `request/fetch.ts` : Client API personnalisé

### Configuration des quiz

#### Configuration dynamique (`constants/quizConfig.ts`)
```typescript
export const quizModalConfig: QuizConfigType = {
  title: 'Créer un quiz',
  description: 'Remplissez le formulaire ci-dessous...',
  form: [
    {
      title: 'Titre',
      vModel: 'title',
      type: 'text',
      placeholder: 'Entrez le titre du quiz',
      required: true,
    },
    // Autres champs configurables
  ]
};
```

### Fonctionnalités principales

#### 1. Gestion des quiz
- **Création** : Interface drag-and-drop pour images, éditeur riche
- **Édition** : Modification en temps réel avec sauvegarde automatique
- **Publication** : Système de statuts (draft, published, archived)
- **Partage** : Quiz publics/privés avec liens de partage

#### 2. Système de jeu
- **Minuteur** : Gestion du temps par question/quiz complet
- **Types de questions** : Multiple choice, vrai/faux, texte libre
- **Corrections** : Feedback immédiat ou différé
- **Progression** : Barre de progression visuelle

#### 3. Classements et statistiques
- **Leaderboard** : Classements globaux et par catégorie
- **Badges** : Système de récompenses et achievements
- **Analyses** : Statistiques détaillées de performance

#### 4. Authentification et profils
- **Connexion** : Email/mot de passe + OAuth (Google)
- **Profils** : Gestion des informations personnelles
- **Organisations** : Support multi-tenant
- **Équipes** : Collaboration et défis d'équipe

### Interface utilisateur

#### Design System
- **Couleurs** : Thème clair/sombre adaptatif
- **Composants** : Bibliothèque cohérente basée sur shadcn/ui
- **Responsive** : Mobile-first design
- **Animations** : Transitions fluides et micro-interactions

#### Accessibilité
- **Navigation clavier** : Support complet
- **Screen readers** : Labels et descriptions appropriés
- **Contraste** : Respect des standards WCAG

### Déploiement et infrastructure

#### Docker
- **Dockerfile** : Configuration de conteneur Node.js
- **docker-compose.yml** : Orchestration avec services
- **healthcheck.sh** : Vérification de santé de l'application

#### Nginx
- **Configuration** : Proxy reverse et serveur statique
- **Optimisations** : Compression et cache

### Scripts et automatisation

#### Scripts package.json
- `dev` : Serveur de développement
- `build` : Build de production
- `generate` : Génération statique
- `preview` : Prévisualisation du build

#### Makefile
- Commandes Docker simplifiées
- Scripts de déploiement
- Utilitaires de développement

### Variables d'environnement

#### Configuration runtime
```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE, // URL de l'API backend
  },
}
```

### Conventions de développement

#### Structure des fichiers
- **PascalCase** : Composants Vue (.vue)
- **camelCase** : Fichiers TypeScript (.ts)
- **kebab-case** : Dossiers et routes

#### Nommage des composants
- **Pages** : Représentent des routes (`pages/`)
- **Layouts** : Structures de page (`layouts/`)
- **Components** : Réutilisables (`components/`)
- **Composables** : Logique réutilisable (`composables/`)

### État actuel et branche

#### Branche courante
- **Nom** : `feat/#29-order-answers`
- **Objectif** : Implémentation de l'ordonnancement des réponses
- **Branche par défaut** : `main`

#### Statut du développement
- Application fonctionnelle avec fonctionnalités de base
- Interface utilisateur moderne et responsive
- Système d'authentification opérationnel
- CRUD complet pour les quiz
- Système de jeu interactif
- Intégration backend via API REST

### Points d'attention pour les LLMs

1. **TypeScript strict** : Le projet utilise TypeScript avec des types stricts
2. **Composants shadcn/ui** : Utiliser les composants existants pour la cohérence
3. **Pinia stores** : Respecter la structure des stores existants
4. **Validation Zod** : Utiliser les schémas existants ou créer des nouveaux cohérents
5. **API calls** : Utiliser la fonction `fetchAPI` personnalisée
6. **Responsive design** : Toujours considérer mobile-first
7. **Accessibilité** : Maintenir les standards d'accessibilité
8. **Performance** : Optimiser les images et le code pour le web

Cette documentation fournit une vue d'ensemble complète du projet Quizify Frontend pour faciliter la compréhension et le développement par les LLMs.
