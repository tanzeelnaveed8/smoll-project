import { fontHauoraSemiBold } from "@/constant/constant";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import {
  IconBuildingHospital,
  IconMessage,
  IconWindow,
} from "@tabler/icons-react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Button, Div, Text } from "react-native-magnus";

const tabList = [
  {
    name: "Home",
    link: "HomeScreen",
    icon: (active?: boolean) => (
      <IconWindow
        width={28}
        height={28}
        color={active ? "#427594" : "#494949"}
      />
    ),
  },
  {
    name: "Chats",
    link: "CounsellingRequestScreen",

    icon: (active?: boolean) => (
      <IconMessage
        width={28}
        height={28}
        color={active ? "#427594" : "#494949"}
      />
    ),
  },
  {
    name: "Partner",
    link: "CasesListScreen",
    icon: (active?: boolean) => (
      <IconBuildingHospital
        width={28}
        height={28}
        color={active ? "#427594" : "#494949"}
      />
    ),
  },
];

const TabNaivationBar: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();

  return (
    <Div borderTopWidth={2} borderColor="#dcdcdc14">
      <Div
        flexDir="row"
        justifyContent="space-between"
        bg="#fff"
        px={25}
        pb={10}
      >
        {tabList.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate(item.link);
            }}
          >
            <Div
              h={4}
              bg={route.name === item.link ? "#427594" : "transparent"}
              w={60}
              style={{ borderBottomRightRadius: 4, borderBottomLeftRadius: 4 }}
            />
            <Div>{item.icon(route.name === item.link)}</Div>
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraSemiBold}
              color={route.name === item.link ? "primary" : "#494949"}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </Div>
    </Div>
  );
};

export default TabNaivationBar;
