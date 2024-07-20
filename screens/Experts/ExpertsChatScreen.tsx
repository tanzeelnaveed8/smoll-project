import Layout from "@/components/app/Layout";
import Chat from "@/components/app/chat/Chat";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";

interface Props {
  navigation: NavigationType;
}

const ExpertsChatScreen: React.FC<Props> = (props) => {
  const route = useRoute();
  const expertId = (route.params as Record<string, string>).expertId;
  const expertName = (route.params as Record<string, string>).expertName;

  return (
    <Layout
      showBack
      backBtnText=""
      onBackPress={() => props.navigation.goBack()}
      title={expertName}
    >
      <Chat initialMessages={[]} recipientId={expertId} chatFor="experts" />
    </Layout>
  );
};

export default ExpertsChatScreen;
