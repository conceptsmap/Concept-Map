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
          $or: filter.split(",").map((item: string) => {
            return {
              $or: [
                { genre: { $in: item.split(",") } },
                { industry_category: { $in: item.split(",") } },
              ],
            };
          }),
        }),
      ...(country &&
        state &&
        country.length > 0 &&
        state.length > 0 && {
          $and: [
            { country: { $in: country.split(",") } },
            { state: { $in: state.split(",") } },
          ],
        }),
      ...(textSearch && {
        $or: [
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
    return {
      scripts,
      count,
    };
  }
}
