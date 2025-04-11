import { 
  users, promoters, documents,
  Promoter, 
  InsertPromoter, 
  Document, 
  InsertDocument, 
  User, 
  InsertUser,
  RegistrationForm
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Promoter operations
  getPromoter(id: number): Promise<Promoter | undefined>;
  getPromoterByUniqueId(uniqueId: string): Promise<Promoter | undefined>;
  getAllPromoters(): Promise<Promoter[]>;
  createPromoter(promoter: InsertPromoter): Promise<Promoter>;
  updatePromoter(id: number, promoter: Partial<InsertPromoter>): Promise<Promoter | undefined>;
  deletePromoter(id: number): Promise<boolean>;
  searchPromoters(query: string): Promise<Promoter[]>;
  filterPromoters(filters: Partial<Promoter>): Promise<Promoter[]>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByPromoterId(promoterId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Registration operations
  registerPromoter(data: RegistrationForm): Promise<Promoter>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPromoter(id: number): Promise<Promoter | undefined> {
    const [promoter] = await db.select().from(promoters).where(eq(promoters.id, id));
    return promoter || undefined;
  }

  async getPromoterByUniqueId(uniqueId: string): Promise<Promoter | undefined> {
    const [promoter] = await db.select().from(promoters).where(eq(promoters.uniqueId, uniqueId));
    return promoter || undefined;
  }

  async getAllPromoters(): Promise<Promoter[]> {
    return await db.select().from(promoters).orderBy(desc(promoters.createdAt));
  }

  async createPromoter(insertPromoter: InsertPromoter): Promise<Promoter> {
    const [promoter] = await db
      .insert(promoters)
      .values(insertPromoter)
      .returning();
    return promoter;
  }

  async updatePromoter(id: number, promoterUpdate: Partial<InsertPromoter>): Promise<Promoter | undefined> {
    const [updatedPromoter] = await db
      .update(promoters)
      .set(promoterUpdate)
      .where(eq(promoters.id, id))
      .returning();
    return updatedPromoter || undefined;
  }

  async searchPromoters(query: string): Promise<Promoter[]> {
    return await db
      .select()
      .from(promoters)
      .where(
        or(
          like(promoters.firstName, `%${query}%`),
          like(promoters.lastName, `%${query}%`),
          like(promoters.uniqueId, `%${query}%`),
          like(promoters.nationality, `%${query}%`),
          like(promoters.area, `%${query}%`)
        )
      );
  }

  async filterPromoters(filters: Partial<Promoter>): Promise<Promoter[]> {
    const conditions = [];
    
    if (filters.nationality) {
      conditions.push(eq(promoters.nationality, filters.nationality));
    }
    
    if (filters.area) {
      conditions.push(eq(promoters.area, filters.area));
    }
    
    if (filters.gender) {
      conditions.push(eq(promoters.gender, filters.gender));
    }

    if (conditions.length === 0) {
      return this.getAllPromoters();
    }

    return await db
      .select()
      .from(promoters)
      .where(and(...conditions));
  }
  
  async deletePromoter(id: number): Promise<boolean> {
    try {
      // First delete all related documents
      await db
        .delete(documents)
        .where(eq(documents.promoterId, id));
      
      // Then delete the promoter
      const result = await db
        .delete(promoters)
        .where(eq(promoters.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting promoter:', error);
      return false;
    }
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async getDocumentsByPromoterId(promoterId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.promoterId, promoterId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async registerPromoter(data: RegistrationForm): Promise<Promoter> {
    // Generate a unique ID for the promoter
    const year = new Date().getFullYear();
    const uniqueId = `PRO-${year}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create the promoter
    const promoterData: InsertPromoter = {
      uniqueId,
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      email: data.personalInfo.email,
      dateOfBirth: data.personalInfo.dateOfBirth,
      gender: data.personalInfo.gender,
      mobileNumber: data.personalInfo.mobileNumber,
      nationality: data.personalInfo.nationality,
      area: data.personalInfo.area,
      yearsExperience: data.professionalDetails.yearsExperience,
      height: data.professionalDetails.height,
      tShirtSize: data.professionalDetails.tShirtSize,
      shirtSize: data.professionalDetails.shirtSize,
      previousExperience: data.professionalDetails.previousExperience || "",
      brandsWorkedFor: data.professionalDetails.brandsWorkedFor || "",
      status: "pending"
    };
    
    const promoter = await this.createPromoter(promoterData);
    
    // Create documents for the promoter
    for (const doc of data.documents) {
      const documentData: InsertDocument = {
        promoterId: promoter.id,
        type: doc.type,
        fileName: doc.fileName,
        fileData: doc.fileData,
        mimeType: doc.mimeType,
        expiryDate: doc.expiryDate || null
      };
      
      await this.createDocument(documentData);
    }
    
    return promoter;
  }
}

// Create default admin user during startup
(async () => {
  try {
    const storage = new DatabaseStorage();
    const adminExists = await storage.getUserByUsername("admin");
    if (!adminExists) {
      await storage.createUser({
        username: "admin",
        password: "admin123",
        role: "admin"
      });
      console.log("Created default admin user");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
})();

export const storage = new DatabaseStorage();
