import { IUser } from "./model";

export interface IRegister extends Omit<IUser, "profile_url" | "is_verified"> {}
