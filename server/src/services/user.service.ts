import UserModel from "../repository/model/user.model";
import { CrudRepository } from "../repository/query/crud.repository";
import { IUser } from "../types/model";

export class UserService {
  private readonly crudRepository: CrudRepository<IUser>;

  constructor() {
    this.crudRepository = new CrudRepository(UserModel);
  }

  async getUserData(userId: string) {
    return await this.crudRepository.fetchDocumentById(userId, "-password");
  }

  async getUserDataUsingEmail(email: string, role: string) {
    return await this.crudRepository.fetchOneDocument({
      email: email,
      role: role,
    });
  }
}
