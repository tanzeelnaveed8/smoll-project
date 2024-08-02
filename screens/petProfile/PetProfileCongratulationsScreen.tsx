import { Div, Text } from "react-native-magnus";
import { IconHeartFilled } from "@tabler/icons-react-native";
import Container from "@/components/partials/Container";
import { fontHauoraMedium } from "@/constant/constant";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ConfettiCannon from "react-native-confetti-cannon";
import Layout from "@/components/app/Layout";
import { useRoute } from "@react-navigation/native";
import { NavigationType } from "@/store/types";

const PetProfileCongratulationsScreen = ({
  navigation,
}: {
  navigation: NavigationType;
}) => {
  const route = useRoute();

  const petName = (route.params as Record<string, string>)?.petName;
  const petBg = (route.params as Record<string, string>)?.petBg;
  const navigateTo = (route.params as Record<string, string>)?.navigateTo;
  const petId = (route.params as Record<string, string>)?.petId;
  const expertId = (route.params as Record<string, string>)?.expertId;

  return (
    <Layout>
      <Div flex={1}>
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fadeOut
          autoStart
          autoStartDelay={0}
        />
        <Div mt={57} alignItems="center">
          <Div
            mx="auto"
            w={200}
            h={200}
            rounded={64}
            bgImg={{
              uri: petBg,
            }}
            position="relative"
          >
            <IconHeartFilled
              size={64}
              fill="#E31F7D"
              style={{ position: "absolute", right: -8, top: -1 }}
            />
          </Div>
          <Text
            w="90%"
            fontSize={32}
            lineHeight={40}
            color="#222222"
            textAlign="center"
            mt={20}
          >
            Congratulations! {petName}'s profile has been added.
          </Text>
          <Text
            w={314}
            fontFamily={fontHauoraMedium}
            fontSize="lg"
            lineHeight={24}
            color="#494949"
            textAlign="center"
            mt={4}
          >
            You can add more pets in the settings section afterward.
          </Text>
        </Div>

        <Div mt="auto">
          <ButtonPrimary
            onPress={() => {
              navigation.navigate(navigateTo, {
                petId: petId,
                petName: petName,
                expertId: expertId,
              });
            }}
          >
            Let's Go
          </ButtonPrimary>
        </Div>
      </Div>
    </Layout>
  );
};

export default PetProfileCongratulationsScreen;
