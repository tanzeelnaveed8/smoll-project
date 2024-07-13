import { Div, Text } from "react-native-magnus";
import { IconHeartFilled } from "@tabler/icons-react-native";
import Container from "@/components/partials/Container";
import { fontHauoraMedium } from "@/constant/constant";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ConfettiCannon from "react-native-confetti-cannon";
import Layout from "@/components/app/Layout";

const PetCongratulationsScreen = () => {
  return (
    <Layout>
      <Div pt={20} pb={10} flex={1}>
        <Container flex={1}>
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
                uri: "https://img.freepik.com/premium-photo/front-view-beautiful-dog-with-copy-space_994641-1631.jpg",
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
              Congratulations! Lucy's profile has been added.
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
              Thank you for adding a pet. You can add more pets in the settings
              section afterward.
            </Text>
          </Div>

          <Div mt="auto">
            <ButtonPrimary>Let's Go</ButtonPrimary>
          </Div>
        </Container>
      </Div>
    </Layout>
  );
};

export default PetCongratulationsScreen;
