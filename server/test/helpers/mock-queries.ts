export type MockQuery<T> = Promise<T> & {
  select: jest.Mock;
  lean: jest.Mock;
  populate: jest.Mock;
  sort: jest.Mock;
  limit: jest.Mock;
  skip: jest.Mock;
  clone: jest.Mock;
};

export const createMockQuery = <T>(value: T): MockQuery<T> => {
  const promise = Promise.resolve(value) as MockQuery<T>;

  promise.select = jest.fn().mockReturnValue(promise);
  promise.lean = jest.fn().mockResolvedValue(value);
  promise.populate = jest.fn().mockReturnValue(promise);
  promise.sort = jest.fn().mockReturnValue(promise);
  promise.limit = jest.fn().mockReturnValue(promise);
  promise.skip = jest.fn().mockReturnValue(promise);
  promise.clone = jest.fn().mockReturnValue(Promise.resolve(value));

  return promise;
};
