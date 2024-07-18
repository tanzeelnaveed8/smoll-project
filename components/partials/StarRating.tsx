import { IconStar } from "@tabler/icons-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div } from "react-native-magnus";

const arr = [1, 2, 3, 4, 5];

const StarRating: React.FC<{ onChange: (e: number) => void }> = ({
  onChange,
}) => {
  const [rating, setRating] = useState(0);

  return (
    <Div flexDir="row" style={{ gap: 16 }} mt={3}>
      {arr.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => {
            setRating(item);
            onChange(item);
          }}
        >
          <IconStar
            width={32}
            height={32}
            color={"#427594"}
            fill={rating && rating >= item ? "#427594" : "#fff"}
          />
        </TouchableOpacity>
      ))}
    </Div>
  );
};

export default StarRating;
