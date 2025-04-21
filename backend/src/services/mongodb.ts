import mongoose, { Connection } from "mongoose";

class MongoDBService {
  private connection: Connection | null = null;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      const MONGODB_URI =
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/landing-page-generator";

      await mongoose.connect(MONGODB_URI);
      this.connection = mongoose.connection;

      this.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
      });

      this.connection.once("open", () => {
        console.log("Connected to MongoDB successfully");
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
    }
  }

  public getConnection(): Connection | null {
    return this.connection;
  }
}

export const mongodbService = new MongoDBService();
