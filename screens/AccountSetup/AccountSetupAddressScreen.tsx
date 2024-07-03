import CountryDropdown from "@/components/app/CountryDropdown";
import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { getAxiosErrMsg } from "@/utils/helpers";
import { AxiosError } from "axios";
import React, { createRef, useState } from "react";
import { Div, Text } from "react-native-magnus";
import { useToast } from "react-native-toast-notifications";

interface Props {
  navigation: NavigationType;
}

const AccountSetupAddressScreen: React.FC<Props> = (props) => {
  const toast = useToast();
  const { updateUser } = useUserStore();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    villa: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const disableConfirm =
    !address.street ||
    !address.city ||
    !address.country ||
    !address.postalCode ||
    !address.villa;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await updateUser({
        address: address.street,
        city: address.city,
        country: address.country,
        timeZone: "Asia/Kolkata", // TODO: Need to update this.
        villa: address.villa,
      });

      props.navigation.navigate("HomeScreen", {
        showSetupModal: "true",
      });
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
      onBackPress={() =>
        props.navigation.navigate("HomeScreen", {
          showSetupModal: "true",
        })
      }
    >
      <Div flex={1} justifyContent="space-between">
        <Div>
          <Text fontSize={"6xl"} mb={4}>
            What’s your address?
          </Text>
          <Text fontSize={"xl"} mb={20}>
            We need your address to suggest the nearest vet clinic for in-clinic
            visits
          </Text>

          <Div style={{ gap: 16 }}>
            <InputField
              placeholder="Flat/Villa No"
              value={address.villa}
              onChangeText={(text) =>
                setAddress((s) => ({ ...s, villa: text }))
              }
              inputStyle={{
                borderRadius: 12,
              }}
              autoFocus
              maxLength={40}
              returnKeyType="next"
              disabled={loading}
            />
            <InputField
              placeholder="Street address"
              value={address.street}
              onChangeText={(text) =>
                setAddress((s) => ({ ...s, street: text }))
              }
              inputStyle={{
                borderRadius: 12,
              }}
              maxLength={40}
              returnKeyType="next"
              disabled={loading}
            />

            <InputField
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress((s) => ({ ...s, city: text }))}
              inputStyle={{
                borderRadius: 12,
              }}
              maxLength={40}
              returnKeyType="next"
              disabled={loading}
            />

            <CountryDropdown
              onChange={(value) =>
                setAddress((s) => ({ ...s, country: value.label }))
              }
              isDisabled={loading}
            />

            <InputField
              placeholder="Postal code"
              value={address.postalCode}
              onChangeText={(text) =>
                setAddress((s) => ({ ...s, postalCode: text }))
              }
              inputStyle={{
                borderRadius: 12,
              }}
              maxLength={10}
              keyboardType="numeric"
              returnKeyType="done"
              disabled={loading}
            />
          </Div>
        </Div>
        <ButtonPrimary
          bgColor="primary"
          onPress={handleConfirm}
          disabled={disableConfirm || loading}
          loading={loading}
        >
          Confirm
        </ButtonPrimary>
      </Div>
    </Layout>
  );
};

export default AccountSetupAddressScreen;
