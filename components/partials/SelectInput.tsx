import { colorTextPrimary } from "@/constant/constant";
import { IconChevronDown, IconSearch } from "@tabler/icons-react-native";
import React, { ReactElement, useEffect, useState } from "react";
import { StyleProp, TextStyle, TouchableOpacity, FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";
import BottomSheet from "./BottomSheet";
import InputField from "./InputField";
import RadioButton from "./RadioButton";
import { Nullable } from "@/store/types";

interface Option {
  label: string;
  value: string;
}

interface OptionDto extends Option {
  [key: string]: string;
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
  renderLabel?: (option: OptionDto, index: number) => ReactElement;
  mainInputStyle?: StyleProp<TextStyle>;
}

const SelectInput: React.FC<Props> = (props) => {
  const { renderLabel, mainInputStyle } = props;
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

  return (
    <>
      <TouchableOpacity
        onPress={() => {
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
          inputStyle={mainInputStyle}
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

        <FlatList
          data={filteredOptions}
          // to make sure key should be unique
          keyExtractor={(item) => item.label + item.value}
          renderItem={({ item, index }) =>
            renderLabel ? (
              renderLabel(item as OptionDto, index)
            ) : (
              <RadioButton
                key={item.value}
                styles={{
                  borderColor: "transparent",
                }}
                onTap={() => {
                  setSelectedValue(item);

                  if (props.onSelect) props.onSelect(item);

                  setShowMenu(false);
                }}
                label={item.label}
                value={item.value}
                selectedValue={selectedValue?.value ?? ""}
              />
            )
          }
          ListEmptyComponent={() =>
            props.renderNoOptions ? (
              props.renderNoOptions()
            ) : (
              <Div pl={10} pt={10}>
                <Text>No options found</Text>
              </Div>
            )
          }
        />
      </BottomSheet>
    </>
  );
};

export default SelectInput;
