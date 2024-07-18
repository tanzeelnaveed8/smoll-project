import { colorTextPrimary } from "@/constant/constant";
import { IconChevronDown, IconSearch } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import BottomSheet from "./BottomSheet";
import InputField from "./InputField";
import RadioButton from "./RadioButton";
import { Nullable } from "@/store/types";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  showModal?: boolean;
  label?: string;
  marginBottom?: number;
  loading?: boolean;
  selectedValue?: Nullable<Option>;
  onSelect?: (selected: Option) => void;
  onClose?: () => void;
  onOpen?: () => void;
  renderNoOptions?: () => React.ReactNode;
}

const SelectInput: React.FC<Props> = (props) => {
  const [selectedValue, setSelectedValue] = useState<Nullable<Option>>(
    props.selectedValue ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const filteredOptions = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (typeof props.showModal !== "undefined") {
      setShowMenu(props.showModal);
    }
  }, [props.showModal]);

  useEffect(() => {
    console.log("selecte", selectedValue);
  }, [selectedValue]);

  return (
    <>
      <TouchableOpacity
        onPress={(e) => {
          setShowMenu(true);
          props.onOpen?.();
        }}
      >
        <InputField
          placeholder={props.label ?? "Select"}
          suffix={<IconChevronDown color={colorTextPrimary} />}
          loading={props.loading}
          disabled={props.loading}
          readOnly
          pointerEvents="none"
          value={selectedValue?.label}
        />
      </TouchableOpacity>

      <BottomSheet
        isVisible={showMenu}
        showCloseIcon
        onCloseIconClick={() => {
          setShowMenu(false);
          props.onClose?.();
        }}
        title={props.label}
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
          {filteredOptions.length === 0 ? (
            props.renderNoOptions ? (
              props.renderNoOptions()
            ) : (
              <Div pl={10} pt={10}>
                <Text>No options found</Text>
              </Div>
            )
          ) : (
            <>
              {filteredOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  styles={{
                    borderColor: "transparent",
                  }}
                  onTap={() => {
                    setSelectedValue(option);

                    if (props.onSelect) props.onSelect(option);

                    setShowMenu(false);
                  }}
                  label={option.label}
                  value={option.value}
                  selectedValue={selectedValue?.value ?? ""}
                />
              ))}
            </>
          )}
        </ScrollDiv>
      </BottomSheet>
    </>
  );
};

export default SelectInput;
