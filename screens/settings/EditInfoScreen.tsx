import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { UpdateUserPayloadDto } from "@/store/types/user";
import { getAxiosErrMsg } from "@/utils/helpers";
import { useRoute } from "@react-navigation/native";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";
import { useToast } from "react-native-toast-notifications";

type DataType = {
  heading: string;
  placeholder: string;
  fieldKey: keyof UpdateUserPayloadDto;
  value: string;
};

const EditInfoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { updateUser, user } = useUserStore();
  const { heading, placeholder, fieldKey, value } = useRoute()
    .params as DataType;
  const [form, setForm] = useState(value);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConfirm = async () => {
    if (!fieldKey) {
      toast.show("Field Key is not provided in the params", {
        type: "danger",
      });
      return;
    }
    try {
      setLoading(true);

      const obj: Partial<Record<typeof fieldKey, string>> = {};
      obj[fieldKey] = form;
      await updateUser(obj);

      navigation.goBack();
    } catch (err) {
      const errMsg = getAxiosErrMsg(err as AxiosError);

      toast.show(errMsg, {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title="Edit Information"
      style={{ justifyContent: "flex-start" }}
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div pt={20} flex={1}>
        <Text fontSize={"4xl"} mb={20}>
          {heading || "No Heading Provided"}
        </Text>
        <InputField
          placeholder={placeholder || ""}
          marginBottom={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          value={form}
          onChangeText={(name) => {
            setForm(name);
          }}
        />
      </Div>

      <ButtonPrimary loading={loading} onPress={handleConfirm}>
        Confirm
      </ButtonPrimary>
    </Layout>
  );
};

export default EditInfoScreen;
