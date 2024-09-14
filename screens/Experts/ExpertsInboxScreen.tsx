import Layout from "@/components/app/Layout";
import ChatInboxItem from "@/components/app/chat/ChatInboxItem";
import { fontHauoraSemiBold } from "@/constant/constant";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { useEffect, useState } from "react";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const ExpertsInboxScreen: React.FC<Props> = (props) => {
  const { experts, expertDetailMap, fetchExperts, fetchExpertDetail } =
    useExpertStore();

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllExperts();
  }, []);

  const fetchAllExperts = async () => {
    try {
      setLoading(true);
      await fetchExperts();
    } finally {
      setLoading(false);
    }
  };

  const handleInboxItemPress = async (expertId: string, expertName: string) => {
    try {
      const expertDetail = expertDetailMap.get(expertId);

      if (!expertDetail) {
        setActionLoading(true);
        await fetchExpertDetail(expertId);
      }

      props.navigation.navigate("ExpertsChatScreen", {
        expertId: expertId,
        expertName: expertName,
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="Inbox"
      loading={loading}
      onBackPress={() => props.navigation.navigate("Home")}
    >
      <Div mb={24}>
        <Text fontSize={"xl"} fontWeight="bold" fontFamily={fontHauoraSemiBold}>
          All Experts
        </Text>
      </Div>
      <Div flex={1}>
        {experts?.map((expert) => (
          <ChatInboxItem
            key={expert.id}
            onPress={() => handleInboxItemPress(expert.id, expert.name)}
            title={expert.name}
            subtitle={expert.designation}
            loading={actionLoading}
            image={expert.profileImg?.url ?? "https://via.placeholder.com/150"}
          />
        ))}
      </Div>
    </Layout>
  );
};

export default ExpertsInboxScreen;
