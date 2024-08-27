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
      {true && (
        <ScrollDiv showsVerticalScrollIndicator={false} pt={16}>
          <Div>
            <Text fontSize={"lg"} fontFamily={fontHauoraBold} mb={24}>
              Recent
            </Text>

            <NotificationTestScreen navigation={navigation} />
          </Div>
        </ScrollDiv>
      )}
      {!true && (
        <Div h={"85%"} justifyContent="center" alignItems="center">
          <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
            No Notification found
          </Text>
        </Div>
      )}
    </Layout>
  );
};

export default NotificationScreen;
