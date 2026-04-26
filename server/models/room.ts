import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter room title."],
    },
    description: {
      type: String,
      required: [true, "Please enter room description."],
    },
    roomNumber: {
      type: String,
      required: [true, "Please enter room number."],
    },
    type: {
      type: String,
      required: [true, "Please enter room type."],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Please enter price per night."],
    },
    location: {
      type: String,
      required: [true, "Please enter location."],
    },
    capacity: {
      type: Number,
      required: [true, "Please enter room capacity."],
    },
    isAvailable: {
      type: Boolean,
      required: [true, "Please enter room availability."],
      default: true,
    },
    images: {
      type: [
        {
          url: String,
          public_id: String,
        },
      ],
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  },
);

roomSchema.virtual("ratings").get(function () {
  const reviewsWithRatings = this.reviews.filter((review: any) =>
    Number.isFinite(review?.rating),
  );
  const numOfReviews = reviewsWithRatings.length;

  if (numOfReviews === 0) {
    return {
      value: 5,
      count: 0,
    };
  }

  const totalRatings = reviewsWithRatings.reduce(
    (sum: number, review: any) => sum + review.rating,
    0,
  );

  const value = totalRatings / numOfReviews;

  return {
    value: Number.isFinite(value) ? value : 5,
    count: numOfReviews,
  };
});

roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;
