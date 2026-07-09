import { z } from "zod";

export const basicInfoSchema = z.object({
  title_bn: z.string().min(5, "Bangla title must be at least 5 characters"),
  title_en: z.string().min(5, "English title must be at least 5 characters"),
  type: z.enum([
    "apartment",
    "house",
    "land",
    "commercial",
    "office",
    "shop",
    "warehouse",
  ]),
  purpose: z.enum(["sale", "rent"]),
  description_bn: z
    .string()
    .min(20, "Bangla description must be at least 20 characters"),
  description_en: z
    .string()
    .min(20, "English description must be at least 20 characters"),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  floor_number: z.coerce.number().min(0).max(100).optional().nullable(),
  total_floors: z.coerce.number().min(0).max(100).optional().nullable(),
  facing_direction: z
    .enum(["south", "north", "east", "west"])
    .optional()
    .nullable(),
  amenities: z.array(z.string()).default([]),
});

export const locationSchema = z.object({
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  area_name: z.string().min(1, "Area is required"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const pricingSchema = z.object({
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  area: z.coerce.number().min(1, "Area must be greater than 0"),
  area_unit: z.enum(["sqft", "katha", "bigha", "decimal"]),
});

export const listingFormSchema = basicInfoSchema
  .merge(locationSchema)
  .merge(pricingSchema);

export type ListingFormData = z.infer<typeof listingFormSchema>;
