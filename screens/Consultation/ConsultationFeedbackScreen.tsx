import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import StarRating from "@/components/partials/StarRating";
import TextAreaField from "@/components/partials/TextAreaField";
import { fontHauoraSemiBold } from "@/constant/constant";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const ConsultationFeedbackScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute();
  const { rateExpert } = useExpertStore();

  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [comment, setComment] = useState("");

  const expertId = (route.params as Record<string, any>)?.expertId;
  const caseId = (route.params as Record<string, any>)?.caseId;

  const handleSubmit = async () => {
    try {
      setActionLoading(true);

      await rateExpert({
        id: expertId,
        caseId,
        rating: feedback,
        comment,
      });

      navigation.navigate("CasesListScreen");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout title="Feedback">
      <Div pt={40} flex={1}>
        <Text fontSize={"4xl"} mb={20}>
          How was your experience?
        </Text>

        <StarRating
          onChange={(e) => {
            setFeedback(e);
          }}
        />

        <Text mt={40} mb={12} fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
          Please share your experience
        </Text>

        <TextAreaField
          disabled={actionLoading}
          onChangeText={(e) => setComment(e)}
          value={comment}
        />
      </Div>

      <ButtonPrimary
        onPress={handleSubmit}
        disabled={feedback === 0 || actionLoading}
        loading={actionLoading}
      >
        Submit feedback
      </ButtonPrimary>
    </Layout>
  );
};

export default ConsultationFeedbackScreen;
