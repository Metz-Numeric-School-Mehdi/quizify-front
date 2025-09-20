import * as z from "zod";

export const quizFormSchema = z.object({
  title: z.string({
    required_error: "Le titre est requis",
  }).min(2, "Le titre est requis").max(100, "Titre trop long"),
  description: z.string({
    required_error: "La description est requise",
  }).min(5, "La description est requise et doit contenir au moins 5 caractères"),
  duration: z
    .preprocess((val) => Number(val), z.number({
      required_error: "Durée requise",
    }).min(1, "Durée minimale : 1 seconde"))
    .or(z.string({
      required_error: "Durée requise",
    }).min(1, "Durée requise")),
  pass_score: z
    .preprocess((val) => Number(val), z.number().min(0, "Score minimum requis").max(100, "Score maximum : 100")),
  level_id: z.preprocess((val) => Number(val), z.number({ required_error: "Le niveau est requis" }).min(1, "Le niveau est requis")),
  category_id: z.preprocess((val) => Number(val), z.number({ required_error: "La catégorie est requise" }).min(1, "La catégorie est requise")),
  is_public: z.enum(["true", "false"], { required_error: "Confidentialité requise" }),
  status: z.enum(["draft", "published", "archived"], { required_error: "Statut requis" }),
  max_attempts: z.preprocess((val) => Number(val), z.number().min(1, "Tentatives minimales : 1")).optional(),
  thumbnail: z.any().nullable().optional(),
});