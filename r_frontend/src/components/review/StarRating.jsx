import React from "react";
import { Star } from "lucide-react";

export default function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  showValue = false,
  interactive = false,
  onChange,
}) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const getStarColor = (index) => {
    const value = hoverRating || rating;
    if (index <= value) {
      return "text-amber-400 fill-amber-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform"
                  : "cursor-default"
              }`}
            >
              <Star size={size} className={getStarColor(starValue)} />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// import React, { useState } from "react";
// import { Star } from "lucide-react";

// const StarRating = ({
//   rating = 0,
//   onChange,
//   size = 24,
//   readonly = false,
//   showLabel = false,
// }) => {
//   const [hover, setHover] = useState(0);

//   const handleClick = (value) => {
//     if (!readonly && onChange) {
//       onChange(value);
//     }
//   };

//   const labels = {
//     1: "Poor",
//     2: "Fair",
//     3: "Good",
//     4: "Very Good",
//     5: "Excellent",
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => handleClick(star)}
//             onMouseEnter={() => !readonly && setHover(star)}
//             onMouseLeave={() => !readonly && setHover(0)}
//             disabled={readonly}
//             className={`transition-all ${
//               readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
//             }`}
//           >
//             <Star
//               size={size}
//               className={`${
//                 star <= (hover || rating)
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "text-gray-300 dark:text-gray-600"
//               } transition-colors`}
//             />
//           </button>
//         ))}
//       </div>

//       {showLabel && (hover || rating) > 0 && (
//         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           {labels[hover || rating]}
//         </span>
//       )}
//     </div>
//   );
// };

// export default StarRating;
