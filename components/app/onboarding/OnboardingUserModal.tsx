import BackButton from "@/components/partials/BackButton";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import InputField from "@/components/partials/InputField";
import { useUserStore } from "@/store/modules/user";
import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  isVisible: boolean;
  onSuccess: (isNewUser: boolean) => void;
}

const OnboardingUserModal: React.FC<Props> = (props) => {
  const { updateUser } = useUserStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await updateUser({
        name: `${firstName} ${lastName}`,
      });

      props.onSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      showCloseIcon={false}
      isVisible={props.isVisible}
      h="95%"
      barMb={28}
    >
      <Div>
        <Text fontSize={"4xl"} mb={20}>
          What should we call you?
        </Text>

        <InputField
          placeholder="First Name"
          marginBottom={16}
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          onChangeText={setFirstName}
          value={firstName}
          disabled={loading}
          maxLength={12}
        />

        <InputField
          placeholder="Last Name (Optional)"
          floatingPlaceholder
          inputStyle={{ borderRadius: 12 }}
          marginBottom={32}
          onChangeText={setLastName}
          value={lastName}
          disabled={loading}
          maxLength={12}
        />

        <ButtonPrimary
          bgColor="primary"
          onPress={handleConfirm}
          loading={loading}
          disabled={loading || !firstName}
        >
          Continue
        </ButtonPrimary>
      </Div>
    </BottomSheet>
  );
};

export default OnboardingUserModal;
