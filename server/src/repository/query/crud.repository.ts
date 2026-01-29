import { Model } from "mongoose";

export class CrudRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  //   model: mongoose.Model<T> - The Mongoose model
  //   where: Record<string, any> - Query conditions
  //   skip: number - The number of documents to skip (for pagination)
  //   take: string | number = "all" - The number of documents to take, or 'all' for no limit
  //   populateField - The fields which need to expanded

  // Fetch all documents with optional pagination and population
  async fetchAllDocuments(
    where: Record<string, any>,
    skip: number,
    take: string | number = "all",
    populateField: string[] | string = [],
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<T[]> {
    const limit = take === "all" ? 0 : Number(take);
    const query = this.model
      .find(where)
      .populate(populateField)
      .sort({ createdAt: sortOrder === "asc" ? 1 : -1 });

    return await query.skip(skip).limit(limit || 0);
  }

  // Get the count of documents based on conditions
  async fetchDocumentCount(where: Record<string, any>): Promise<number> {
    return await this.model.find(where).countDocuments();
  }

  // Fetch a document by its ID
  async fetchDocumentById(
    id: string,
    nonRequiredFields?: string,
    populateField: string[] | string = []
  ): Promise<any> {
    return await this.model
      .findById(id)
      .select(nonRequiredFields ?? "")
      .populate(populateField)
      .lean();
  }

  // Fetch a single document based on conditions
  async fetchOneDocument(
    where: Record<string, any>,
    populateField: string[] | string = []
  ): Promise<any> {
    return await this.model.findOne(where).populate(populateField).lean();
  }

  // Create a new document
  async createDocument(data: Record<string, any>): Promise<T> {
    return await this.model.create(data);
  }

  async updateDocumenById(
    id: string,
    updateData: Record<string, any>
  ): Promise<any> {
    return await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean();
  }

  async deleteDocumenById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
