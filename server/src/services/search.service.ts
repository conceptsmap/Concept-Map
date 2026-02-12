import ScriptModel from "../repository/model/script.model";
import { CrudRepository } from "../repository/query/crud.repository";
import { IScript } from "../types/model";

export class SearchService {
  private readonly crudRepository: CrudRepository<IScript>;

  constructor() {
    this.crudRepository = new CrudRepository(ScriptModel);
  }

  async searchScript(searchFilter: any) {
    const {
      skip = "0",
      take = 10,
      type = "",
      filter = "",
      textSearch,
      priceRange = "0",
      country,
      state,
    } = searchFilter;

    const filterQuery = {
      ...(type && { type: { $in: type.split(",") } }),
      ...(filter &&
        filter.length > 0 && {
          $or: [
            { genre: { $in: filter.split(",") } },
            { industry_category: { $in: filter.split(",") } },
          ],
        }),
      ...(state &&
        state.length > 0 && {
          state: { $in: state.split(",") },
        }),
      ...(country &&
        country.length > 0 && {
          country: { $in: country.split(",") },
        }),
      ...(textSearch && {
        $or: [
          { main_title: { $regex: textSearch, $options: "i" } },
          { description: { $regex: textSearch, $options: "i" } },
          {
            "script.content.scenes.description": {
              $regex: textSearch,
              $options: "i",
            },
          },
          {
            "script.content.scenes.name": {
              $regex: textSearch,
              $options: "i",
            },
          },
          { "synopsis.content": { $regex: textSearch, $options: "i" } },
        ],
      }),
      ...(parseInt(priceRange) !== 0 && {
        $or: [
          {
            "script.price": {
              $gte: parseInt(priceRange.split(",")[0]),
              $lte: parseInt(priceRange.split(",")[1]),
            },
          },
          {
            "story_board.price": {
              $gte: parseInt(priceRange.split(",")[0]),
              $lte: parseInt(priceRange.split(",")[1]),
            },
          },
          {
            "synopsis.price": {
              $gte: parseInt(priceRange.split(",")[0]),
              $lte: parseInt(priceRange.split(",")[1]),
            },
          },
        ],
      }),
    };

    const count = await this.crudRepository.fetchDocumentCount(filterQuery);
    const scripts = await this.crudRepository.fetchAllDocuments(
      filterQuery,
      parseInt(skip),
      parseInt(take as string),
      "userId"
    );

    // Map scripts to include author info and default likes/comments
    const mappedScripts = scripts.map((script: any) => {
      let author = { name: "Unknown", role: "", avatar: "" };
      if (script.userId && typeof script.userId === "object") {
        author = {
          name: script.userId.username || "Unknown",
          role: script.userId.role || "",
          avatar: script.userId.profile_url || "",
        };
      }

      // Compose title and content for Post
      let title = script.main_title || script.title || "Untitled";
      let description = script.description || "";
      let type = Array.isArray(script.type) && script.type.length > 0 ? script.type[0].toLowerCase() : "script";
      let scriptContent = undefined;
      if (script.script && Array.isArray(script.script.content)) {
        scriptContent = script.script;
      }
      let synopsis = script.synopsis && script.synopsis.content ? script.synopsis.content : undefined;
      let storyboard = script.story_borad && Array.isArray(script.story_borad.content) && script.story_borad.content.length > 0
        ? { image: script.story_borad.content[0].cloud_url }
        : undefined;

      return {
        id: script._id?.toString?.() || script.id,
        author,
        title,
        type,
        likes: typeof script.likes === "number" ? script.likes : 0,
        comments: typeof script.comments === "number" ? script.comments : 0,
        rightsLabel: script.rightsLabel || "Basic / Exclusive Rights",
        synopsis,
        script: scriptContent,
        storyboard,
        genres: script.genre ? [script.genre] : undefined,
        description,
      };
    });

    return {
      scripts: mappedScripts,
      count,
    };
  }
}
