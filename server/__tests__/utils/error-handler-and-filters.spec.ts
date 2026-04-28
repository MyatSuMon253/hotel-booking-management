import mongoose from "mongoose";
import APIFilters from "../../utils/apiFilters";
import errorHandler from "../../middlewares/errorHandler";

describe("errorHandler", () => {
  test("maps cast errors", async () => {
    const wrapped = errorHandler(async () => {
      const error = { name: "CastError", path: "_id", value: "bad-id" };
      throw error;
    });

    await expect(wrapped()).resolves.toEqual(
      new Error("Resource not found. Invalid: _id: bad-id"),
    );
  });

  test("maps validation errors", async () => {
    const wrapped = errorHandler(async () => {
      throw {
        name: "ValidationError",
        errors: {
          email: { message: "Invalid email" },
          password: { message: "Invalid password" },
        },
      };
    });

    await expect(wrapped()).resolves.toEqual(
      new Error("Invalid email, Invalid password"),
    );
  });
});

describe("APIFilters", () => {
  test("builds search, filters, and pagination chain", () => {
    const chained = {
      find: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
    };
    jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);

    const apiFilters = new APIFilters(chained);
    const result = apiFilters
      .search("suite")
      .filters({ pricePerNight: { gte: 100 } })
      .pagination(2, 5)
      .populate("reviews")
      .sort({ createdAt: -1 });

    expect(chained.find).toHaveBeenNthCalledWith(1, {
      title: { $regex: "suite", $options: "i" },
    });
    expect(chained.find).toHaveBeenNthCalledWith(2, {
      pricePerNight: { $gte: 100 },
    });
    expect(chained.limit).toHaveBeenCalledWith(5);
    expect(chained.skip).toHaveBeenCalledWith(5);
    expect(chained.populate).toHaveBeenCalledWith("reviews");
    expect(chained.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toBe(apiFilters);
  });
});
