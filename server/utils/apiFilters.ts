import mongoose from "mongoose";

class APIFilters {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  search(query: string) {
    const searchById = {
      _id: query,
    };

    const searchByKeyword = {
      title: {
        $regex: query,
        $options: "i",
      },
    };

    const searchQuery = query
      ? mongoose.isValidObjectId(query)
        ? searchById
        : searchByKeyword
      : {};

    this.model = this.model.find({ ...searchQuery });
    return this;
  }

  filters(filters: any) {
    const copiedFilters = { ...filters };
    let filterToString = JSON.stringify(copiedFilters);
    filterToString = filterToString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    this.model = this.model.find(JSON.parse(filterToString));
    return this;
  }

  pagination(page: string | number, perPage: number) {
    const currentPage = Number(page) || 1;
    const skipCount = perPage * (currentPage - 1);

    this.model = this.model.limit(perPage).skip(skipCount);
    return this;
  }

  populate(field: string) {
    this.model = this.model.populate(field);
    return this;
  }

  sort(option: any) {
    this.model = this.model.sort({ createdAt: -1 });
    return this;
  }
}

export default APIFilters;
