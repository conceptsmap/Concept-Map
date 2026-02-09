import ScriptModel from "../repository/model/script.model";
import { CrudRepository } from "../repository/query/crud.repository";
import { IScript } from "../types/model";
import { IScriptCreate } from "../types/model";
import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../utils/customError";

export class ScriptService {
  private readonly crudRepository: CrudRepository<IScript>;

  constructor() {
    this.crudRepository = new CrudRepository(ScriptModel);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async createScript(data: IScriptCreate) {
    return await this.crudRepository.createDocument(data);
  }

  async getScriptDetails(id: string) {
    return await this.crudRepository.fetchDocumentById(id, "", "userId");
  }

  async uploadStoryBoard(files: any) {
    if (!files)
      throw new CustomError(400, "INVALID_INPUT", {
        message: "File does not exist",
      });

    const uploadPromises = files.map(async (file: any) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "scripts",
        use_filename: true,
        invalidate: true,
        resource_type: "auto",
      });
      return result.secure_url;
    });

    return await Promise.all(uploadPromises);
  }

  async getAllOtherScripts(userId: string, scriptId: string) {
    console.log(userId, scriptId);
    const scripts = await this.crudRepository.fetchAllDocuments(
      {
        userId: userId,
        // _id: { $ne: scriptId },
      },
      0,
      10
    );

    return scripts;
  }
}
