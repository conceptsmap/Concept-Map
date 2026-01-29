import mongoose, { Schema } from "mongoose";
import {
  TVCOTTSeriesGenre,
  ShortsGenre,
  IndustryCategory,
  ScriptCategory,
  ScriptType,
  IScript,
} from "../../types/model";

const ScriptSchema: Schema = new Schema(
  {
    main_title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(ScriptCategory),
      required: true,
    },
    genre: {
      type: String,
      enum: [
        ...Object.values(TVCOTTSeriesGenre),
        ...Object.values(ShortsGenre),
      ],
      required: true,
    },
    industry_category: {
      type: String,
      enum: Object.values(IndustryCategory),
      required: true,
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
    script: {
      price: {
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
  }
);

const ScriptModel = mongoose.model<IScript>("Script", ScriptSchema);

export default ScriptModel;
