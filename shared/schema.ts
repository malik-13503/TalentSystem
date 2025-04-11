import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Promoter schema
export const promoters = pgTable("promoters", {
  id: serial("id").primaryKey(),
  uniqueId: text("unique_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  nationality: text("nationality").notNull(),
  area: text("area").notNull(),
  talentType: text("talent_type"),
  yearsExperience: integer("years_experience"),
  height: integer("height"),
  tShirtSize: text("t_shirt_size"),
  shirtSize: text("shirt_size"),
  artistPerformerDetails: text("artist_performer_details"),
  previousExperience: text("previous_experience"),
  brandsWorkedFor: text("brands_worked_for"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertPromoterSchema = createInsertSchema(promoters).omit({
  id: true,
  createdAt: true,
});

export type InsertPromoter = z.infer<typeof insertPromoterSchema>;
export type Promoter = typeof promoters.$inferSelect;

// Document schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  promoterId: integer("promoter_id").notNull(),
  type: text("type").notNull(), // passport, visa, emiratesId, photo, video
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(), // Base64 encoded file data
  mimeType: text("mime_type").notNull(),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Relations
export const promotersRelations = relations(promoters, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  promoter: one(promoters, {
    fields: [documents.promoterId],
    references: [promoters.id],
  }),
}));

// Registration form schema with validation
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  mobileNumber: z.string().min(5, "Mobile number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  area: z.string().min(1, "Area is required"),
  height: z.number().min(120, "Height must be at least 120cm"),
  tShirtSize: z.string().min(1, "T-shirt size is required"),
  shirtSize: z.string().min(1, "Shirt size is required"),
});

export const professionalDetailsSchema = z.object({
  yearsExperience: z.number().min(0, "Years of experience must be 0 or more"),
  talentType: z.string().min(1, "Talent type is required"),
  artistPerformerDetails: z.string().optional(),
  previousExperience: z.string().optional(),
  brandsWorkedFor: z.string().optional(),
});

export const documentSchema = z.object({
  type: z.string().min(1, "Document type is required"),
  fileName: z.string().min(1, "File name is required"),
  fileData: z.string().min(1, "File data is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  expiryDate: z.string().optional(),
});

export const registrationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalDetails: professionalDetailsSchema,
  documents: z.array(documentSchema),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ProfessionalDetails = z.infer<typeof professionalDetailsSchema>;
export type DocumentUpload = z.infer<typeof documentSchema>;
export type RegistrationForm = z.infer<typeof registrationFormSchema>;
