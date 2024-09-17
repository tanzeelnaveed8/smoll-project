import Layout from "@/components/app/Layout";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import NotificationTestScreen from "./NotificationTestScreen";

const NotificationScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout
      title="Notification"
      showBack
      backBtnText=""
      style={{ justifyContent: "flex-start" }}
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <ScrollDiv showsVerticalScrollIndicator={false} pt={16}>
        <Div>
          <Text fontSize={"lg"} fontFamily={fontHauoraBold} mb={24}>
            Recent
          </Text>

          <NotificationTestScreen navigation={navigation} />
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

export default NotificationScreen;
