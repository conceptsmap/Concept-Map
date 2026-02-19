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
      take = "10",
      type = "",
      genre = "",
      textSearch,
      maxPrice = "50000",
      minPrice = "0",
      location = "",
      category,
    } = searchFilter;

    const parsedMinPrice = parseInt(minPrice);
    const parsedMaxPrice = parseInt(maxPrice);

    const filterQuery: any = {
      $and: [],
    };

    /* ========================
     TYPE FILTER
  ========================= */
    if (type) {
      filterQuery.$and.push({
        type: { $in: type.split(",") },
      });
    }

    /* ========================
     GENRE / INDUSTRY FILTER
  ========================= */
    if (genre) {
      const genreArray = genre.split(",");

      filterQuery.$and.push({
        $or: [
          { genre: { $in: genreArray } },
          { industry_category: { $in: genreArray } },
        ],
      });
    }

    /* ========================
     LOCATION FILTER
  ========================= */
    if (location) {
      const locArray = location.split(",");

      filterQuery.$and = filterQuery.$and || [];
      filterQuery.$and.push({
        $or: locArray.flatMap((loc: string) => [
          { state: { $regex: `^${loc.trim()}$`, $options: "i" } },
          { country: { $regex: `^${loc.trim()}$`, $options: "i" } },
        ]),
      });
    }
    if (category) {
      filterQuery.$and.push({
        category: { $in: category.split(",") },
      });
    }

    /* ========================
     TEXT SEARCH
  ========================= */
    if (textSearch) {
      filterQuery.$and.push({
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
      });
    }

    /* ========================
     PRICE FILTER
  ========================= */
    if (!isNaN(parsedMinPrice) && !isNaN(parsedMaxPrice)) {
      filterQuery.$and.push({
        $or: [
          {
            "script.price": {
              $gte: parsedMinPrice,
              $lte: parsedMaxPrice,
            },
          },
          {
            "story_borad.price": {
              $gte: parsedMinPrice,
              $lte: parsedMaxPrice,
            },
          },
          {
            "synopsis.price": {
              $gte: parsedMinPrice,
              $lte: parsedMaxPrice,
            },
          },
        ],
      });
    }

    // If no filters applied, remove $and
    if (filterQuery.$and.length === 0) {
      delete filterQuery.$and;
    }

    /* ========================
     DATABASE CALL
  ========================= */
    const count = await this.crudRepository.fetchDocumentCount(filterQuery);

    const scripts = await this.crudRepository.fetchAllDocuments(
      filterQuery,
      parseInt(skip),
      parseInt(take),
      "userId",
    );

    /* ========================
     MAP RESULT FOR FRONTEND
  ========================= */
    const mappedScripts = scripts.map((script: any) => {
      let author = {
        name: "Unknown",
        jobRole: "",
        avatar: "",
        profile: "",
      };

      if (script.userId && typeof script.userId === "object") {
        author = {
          name: script.userId.username || "Unknown",
          jobRole: script.userId.jobRole || "",
          avatar: script.userId.profile_url || "",
          profile: script.userId.profile_url || "",
        };
      }

      let title = script.main_title || script.title || "Untitled";
      let description = script.description || "";

      let type =
        Array.isArray(script.type) && script.type.length > 0
          ? script.type[0].toLowerCase()
          : "script";

      let scriptContent =
        script.script && Array.isArray(script.script.content)
          ? script.script
          : undefined;

      let synopsis = script.synopsis?.content || undefined;

      let storyboard =
        script.story_borad?.content?.length > 0
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
        genres: script.genre ? [script.genre] : [],
        description,
      };
    });

    return {
      scripts: mappedScripts,
      count,
    };
  }
}
