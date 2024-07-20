import Layout from "@/components/app/Layout";
import ChatInboxItem from "@/components/app/chat/ChatInboxItem";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { useEffect, useState } from "react";
import { Div } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const ExpertsInboxScreen: React.FC<Props> = (props) => {
  const { experts, fetchExperts } = useExpertStore();

  const [loading, setLoading] = useState(false);

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

  return (
    <Layout
      showBack
      backBtnText=""
      title="Inbox"
      loading={loading}
      onBackPress={() => props.navigation.navigate("HomeScreen")}
    >
      <Div flex={1}>
        {experts?.map((expert) => (
          <ChatInboxItem
            key={expert.id}
            onPress={() => {
              props.navigation.navigate("ExpertsChatScreen", {
                expertId: expert.id,
                expertName: expert.name,
              });
            }}
            title={expert.name}
            subtitle={expert.designation}
            image={expert.profileImg?.url ?? "https://via.placeholder.com/150"}
          />
        ))}
      </Div>
    </Layout>
  );
};

export default ExpertsInboxScreen;
