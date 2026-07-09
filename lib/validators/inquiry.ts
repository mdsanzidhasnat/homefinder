import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(
    /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
    "Invalid Bangladeshi phone number"
  ),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
