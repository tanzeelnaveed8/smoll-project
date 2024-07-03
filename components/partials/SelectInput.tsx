import { colorTextPrimary } from "@/constant/constant";
import { IconChevronDown, IconSearch } from "@tabler/icons-react-native";
import React, { useState } from "react";
import BottomSheet from "./BottomSheet";
import InputField from "./InputField";
import RadioButton from "./RadioButton";
import { ScrollView } from "react-native";
import { Div, ScrollDiv } from "react-native-magnus";

interface Props {
  options: { label: string; value: string }[];
  label?: string;
  marginBottom?: number;
  loading?: boolean;
  selectedValue?: string;
  onSelect?: (value: { label: string; value: string }) => void;
}

const SelectInput: React.FC<Props> = ({
  options,
  label,
  loading,
  selectedValue,
  onSelect,
}) => {
  const [selectValue, setSelectedValue] = useState<string>(selectedValue ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <InputField
        placeholder={label ?? "Select"}
        onTouchEnd={() => setShowMenu(true)}
        suffix={<IconChevronDown color={colorTextPrimary} />}
        readOnly
        loading={loading}
        disabled={loading}
        value={selectValue}
      />
      <BottomSheet
        isVisible={showMenu}
        showCloseIcon
        onCloseIconClick={() => setShowMenu(false)}
        title={label}
        roundedTop={24}
      >
        <InputField
          placeholder="Search"
          bg="#EFEFEF"
          borderRadius={35}
          borderColor="#EFEFEF"
          prefix={<IconSearch color={colorTextPrimary} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollDiv>
          {filteredOptions.map((option) => (
            <Div key={option.value}>
              <RadioButton
                styles={{
                  borderColor: "transparent",
                }}
                onTap={() => {
                  setSelectedValue(option.value);

                  if (onSelect) onSelect(option);

                  setShowMenu(false);
                }}
                label={option.label}
                value={option.value}
                selectedValue={selectValue}
              />
            </Div>
          ))}
        </ScrollDiv>
      </BottomSheet>
    </>
  );
};

export default SelectInput;
