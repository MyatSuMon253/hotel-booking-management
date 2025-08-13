export default (controllerFunction: Function) =>
  (...args: unknown[]) => {
    return Promise.resolve(controllerFunction(...args)).catch((err) => {
      console.log(err.name);

      if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}: ${err.value}`;
        return new Error(message);
      }

      if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((val: any) => val.message)
          .join(", ");
        return new Error(message);
      }

      if (err.name === "MongoServerError") {
        const message = "Email is already exists";
        throw message;
      }

      throw err;
    });
  };
