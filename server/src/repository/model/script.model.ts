import mongoose, { Schema } from "mongoose";
import {
  TVCOTTSeriesGenre,
  ShortsGenre,
  IndustryCategory,
  ScriptCategory,
  ScriptType,
  IScript,
  SaleType,
} from "../../types/model";

const ScriptSchema: Schema = new Schema(
  {
    main_title: {
      type: String,
      required: function (this: IScript) {
        return !this.is_draft;
      },
    },
    description: {
      type: String,
      required: function (this: IScript) {
        return !this.is_draft;
      },
    },
    category: {
      type: String,
      enum: Object.values(ScriptCategory),
      required: function (this: IScript) {
        return !this.is_draft;
      },
    },
    genre: {
      type: String,
      enum: [
        ...Object.values(TVCOTTSeriesGenre),
        ...Object.values(ShortsGenre),
      ],
      required: function (this: IScript) {
        return !this.is_draft;
      },
    },
    industry_category: {
      type: String,
      enum: Object.values(IndustryCategory),
      required: function (this: IScript) {
        return !this.is_draft;
      },
    },
    type: {
      type: [String],
      enum: Object.values(ScriptType),
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_draft: {
      type: Boolean,
      default: false,
    },
    script: {
      price: {
        type: Number,
      },
      sale_type: {
        type: String,
        enum: Object.values(SaleType),
        default: SaleType.FIXED,
      },
      minimum_bid: {
        type: Number,
      },
      currency: {
        type: String,
      },
      content: Array<{
        name: {
          type: String;
        };
        scenes: [
          {
            name: {
              type: String;
            };
            description: {
              type: String;
            };
          },
        ];
      }>,
    },
    story_borad: {
      price: {
        type: Number,
      },
      sale_type: {
        type: String,
        enum: Object.values(SaleType),
        default: SaleType.FIXED,
      },
      minimum_bid: {
        type: Number,
      },
      currency: {
        type: String,
      },
      content: Array<{
        name: {
          type: String;
        };
        cloud_url: {
          type: String;
        };
      }>,
    },
    synopsis: {
      price: {
        type: Number,
      },
      sale_type: {
        type: String,
        enum: Object.values(SaleType),
        default: SaleType.FIXED,
      },
      minimum_bid: {
        type: Number,
      },
      currency: {
        type: String,
      },
      content: {
        type: String,
      },
    },
    country: Array<{
      type: String;
    }>,
    state: Array<{
      type: String;
    }>,
  },
  {
    timestamps: true,
  },
);

const ScriptModel = mongoose.model<IScript>("Script", ScriptSchema);

export default ScriptModel;
