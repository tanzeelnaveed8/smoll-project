import Layout from "@/components/app/Layout";
import React from "react";
import { Div, Image } from "react-native-magnus";

const PartnerVetSuccessfullScreen = () => {
  return (
    <Layout showBack backBtnText="" onBackPress={() => {}}>
      <Div>
        <Image
          source={require("../../assets/images/congratulation-screen-tick.png")}
          w={86.25}
          h={86.25}
        />
      </Div>
    </Layout>
  );
};

export default PartnerVetSuccessfullScreen;
