import Layout from "@/components/app/Layout";
import Chat from "@/components/app/chat/Chat";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

interface Props {
  navigation: NavigationType;
}

const ExpertsChatScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const { expertDetailMap, fetchExpertDetail } = useExpertStore();

  const [loading, setLoading] = useState(false);

  const expertId = (route.params as Record<string, string>).expertId;
  const expertName = (route.params as Record<string, string>).expertName;

  useEffect(() => {
    try {
      setLoading(true);
      const expertDetail = expertDetailMap.get(expertId);
      if (!expertDetail) {
        fetchExpertDetail(expertId);
      }
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  return (
    <Layout
      showBack
      onBackPress={() => props.navigation.goBack()}
      title={expertName}
      loading={loading}
    >
      <Chat
        initialMessages={[]}
        recipientId={expertId}
        chatFor="experts"
        chatWithName={expertName}
      />
    </Layout>
  );
};

export default ExpertsChatScreen;
