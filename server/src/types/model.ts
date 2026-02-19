import mongoose, { Document, Types } from "mongoose";

//UserSchema model type
export interface IUser extends Document {
  email: string;
  password: string;
  is_verified: boolean;
  username: string;
  profile_url: string;
  role: Role;
}

//OtpSchema model type
export interface IOtp extends Document {
  code: number;
  retry_count: number;
  userId: Types.ObjectId;
  action_type: VerificationAction;
}

//ScriptSchema model type
export interface IScript extends Document {
  main_title: string;
  description: string;
  category: ScriptCategory;
  genre: TVCOTTSeriesGenre | ShortsGenre;
  industry_category: IndustryCategory;
  type: ScriptType[];
  userId: Types.ObjectId;
  script?: {
    price?: number;
    currency?: string;
    content?: Array<{
      name: string;
      scenes: Array<{
        name: string;
        description: string;
      }>;
    }>;
  };
  story_borad?: {
    price?: number;
    currency?: string;
    content?: Array<{
      name: string;
      cloud_url: string;
    }>;
  };
  synopsis?: {
    price?: number;
    currency?: string;
    content?: string;
  };
}

// Data interface for creation (does NOT extend Document)
export interface IScriptCreate {
  main_title: string;
  description: string;
  category: ScriptCategory;
  genre: TVCOTTSeriesGenre | ShortsGenre;
  industry_category: IndustryCategory;
  type: ScriptType[];
  userId: Types.ObjectId;
  country: string[];
  state: string[];
  script?: {
    price?: number;
    currency?: string;
    content?: Array<{
      name: string;
      scenes: Array<{
        name: string;
        description: string;
      }>;
    }>;
  };
  story_borad?: {
    price?: number;
    currency?: string;
    content?: Array<{
      name: string;
      cloud_url: string;
    }>;
  };
  synopsis?: {
    price?: number;
    currency?: string;
    content?: string;
  };
}

export interface IPurschase extends Document {
  user_id: Types.ObjectId;
  script_id: Types.ObjectId;
  price: number;
  payment_method: PaymentMethod;
  payment_status: string;
  reason: string;
  transaction_id: string;
}

//actions in which we do otp verification
export enum VerificationAction {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
}

//different roles avaiable in the system
export enum Role {
  ADMIN = "ADMIN",
  CREATOR = "CREATOR",
  BUYER = "BUYER",
}

//various categories avaiable for a script
export enum ScriptCategory {
  TVC = "TVC",
  OTT_SERIES = "OTT_SERIES",
  SHORT_FORM_VIDEO = "SHORT_FORM_VIDEO",
}

//sub categories avaiable, if he choose TVC or OTT series
export enum TVCOTTSeriesGenre {
  ROMANCE = "ROMANCE",
  CRIME = "CRIME",
  HORROR = "HORROR",
  ACTION = "ACTION",
  COMEDY = "COMEDY",
  DRAMA = "DRAMA",
  SCIFI = "SCI-FI",
  FANTASY = "FANTASY",
  HISTORICAL = "HISTORICAL",
  DOCUMENTARY = "DOCUMENTARY",
  THRILLER = "THRILLER",
  OTHERS = "OTHERS",
}

//sub categories avaiable, if he choose Short form vedio
export enum ShortsGenre {
  COMEDY_HUMOR = "COMEDY_AND_HUMOR",
  PEOPLE = "PEOPLE",
  BEAUTY = "BEAUTY",
  SPORTS = "SPORTS",
  FASHION_AND_LIFESTYLE = "FASHION_AND_LIFESTYLE",
  GAMING = "GAMING",
  FOOD_AND_DRINK = "FOOD_AND_DRINK",
  TRAVEL_AND_HOLIDAYS = "TRAVEL_AND_HOLIDAYS",
  AUTOMOBILE = "AUTOMOBILE",
  SCIENCE_AND_TECHNOLOGY = "SCIENCE_AND_TECHNOLOGY",
  HEALTH_AND_FITNESS = "HEALTH_AND_FITNESS",
  ANIMALS_AND_PETS = "ANIMALS_AND_PETS",
  FAMILY_AND_PARENTING = "FAMILY_AND_PARENTING",
  HOME_AND_DIY = "HOME_AND_DIY",
  SELF_HELP_AND_MOTIVATIONAL = "SELF_HELP_AND_MOTIVATIONAL",
  BUSINESS_AND_FINANCE = "BUSINESS_AND_FINANCE",
  MOVIES_AND_ENTERTAINMENT = "MOVIES_AND_ENTERTAINMENT",
  OTHERS = "OTHERS",
}

//various industry categories avaiable for a script
export enum IndustryCategory {
  GROCERY = "GROCERY",
  CPG = "CPG",
  ECOMMERCE = "ECOMMERCE",
  BEAUTY_AND_PERSONAL_CARE = "BEAUTY & PERSONAL CARE",
  HEALTH_AND_WELLNESS = "HEALTH & WELLNESS",
  FINTECH = "FINTECH",
  TELECOM = "TELECOM",
  AUTO = "AUTO",
  TRAVEL_AND_HOSPITALITY = "TRAVEL & HOSPITALITY",
  FB = "F&B",
  CONSUMER_ELECTRONICS = "CONSUMER ELECTRONICS",
  BFSI = "BFSI",
  APPAREL = "APPAREL",
  TECHNOLOGY = "TECHNOLOGY",
  REAL_ESTATE = "REAL ESTATE",
  UTILITIES = "UTILITIES",
  JEWELLERY = "JEWELLERY",
  MEDIA_AND_ENTERTAINMENT = "MEDIA & ENTERTAINMENT",
  OTHERS = "OTHERS",
}

//various types of scripts avaiable
export enum ScriptType {
  SCRIPT = "SCRIPT",
  STORY_BOARD = "STORY_BOARD",
  SYNOPSIS = "SYNOPSIS",
}

export enum PaymentMethod {
  NETBANKING = "NETBANKING",
  UPI = "UPI",
  DEBIT_CARD = "DEBIT_CARD",
}
