import type { QuizConfigType } from "~/types/config/QuizConfigType";

export const quizModalConfig: QuizConfigType = {
  title: 'Créer un quiz',
  description: 'Remplissez le formulaire ci-dessous pour créer un nouveau quiz.',
  form: [
    {
      title: 'Titre',
      vModel: 'title',
      type: 'text',
      placeholder: 'Entrez le titre du quiz',
      required: true,
    },
    {
      title: 'Description',
      vModel: 'description',
      type: 'textarea',
      placeholder: 'Entrez une description',
      required: true,
    },
    {
      title: 'Durée',
      vModel: 'duration',
      type: 'number',
      placeholder: 'Durée en minutes',
      required: true,
    },
    {
      title: 'Score de réussite',
      vModel: 'pass_score',
      type: 'number',
      placeholder: 'Entrez le score minimum pour réussir',
      required: true,
    },
    {
      title: 'Niveau',
      vModel: 'level_id',
      options: 'levels',
      fetch: 'fetchLevels',
      type: 'select',
      placeholder: 'Sélectionnez un niveau',
      required: true,
    },
    {
      title: 'Catégorie',
      vModel: 'category_id',
      options: 'categories',
      fetch: 'fetchCategories',
      type: 'select',
      placeholder: 'Sélectionnez une catégorie',
      required: true,
    },
    {
      title: 'Confidentialité',
      vModel: 'is_public',
      type: 'select',
      placeholder: 'Confidentialité',
      required: true,
      options: [
        { id: 'true', name: 'Public' },
        { id: 'false', name: 'Privé' }
      ]
    },
    {
      title: 'Statut',
      vModel: 'status',
      type: 'select',
      placeholder: 'Renseigner le statut',
      required: true,
      options: [
        { id: 'draft', name: 'Brouillon' },
        { id: 'published', name: 'Publié' },
        { id: 'archived', name: 'Archivé' }
      ]
    },
  ]
}