import StarRatings from "react-star-ratings";

interface Props {
  value: number;
  count: number;
}

function Rating({ value, count }: Props) {
  return (
    <div className="flex items-end gap-1">
      <StarRatings
        rating={value}
        starRatedColor="orange"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="1px"
      />
      <span className="text-xs font-medium text-gray-500">
        ({count} reviews)
      </span>
    </div>
  );
}

export default Rating;
