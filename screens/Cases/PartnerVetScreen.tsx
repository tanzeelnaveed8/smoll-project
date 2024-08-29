import Layout from "@/components/app/Layout";
import DoctorListCard from "@/components/partials/DoctorListCard";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, RefreshControl } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";

const PartnerVetScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { partnerVets, fetchPartnerVets } = usePartnerStore();

  const caseId = (route.params as Record<string, string>)?.caseId;
  const partnerId = (route.params as Record<string, string>)?.partnerId;
  const partnerName = (route.params as Record<string, string>)?.partnerName;
  const selectedServices = (
    route.params as {
      selectedServices: { id: string; label: string; price: number }[];
    }
  )?.selectedServices;

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const vets = useMemo(
    () => partnerVets.get(partnerId),
    [partnerVets, partnerId]
  );

  // const vets = [
  //   {
  //     id: 1,
  //     name: "Gustaf",
  //     designation: "Stenners",
  //     yearsOfExperience: "5",
  //     profileImg:
  //       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHXSURBVDjLzZNNi9pQFIbzA+YXDP0zLV3Nb3E9a3d1JQh+g7oQLaKCimL8QGKiMdF0OjUTjB+N0fi9Ghim7aa8vScwglBKabvohZfccM95zntObjgA3N+I+2cARVGuJEnydNjief5LpVLpFAoFTyaTufotgCiKtw8POizrMzaOjfnMhCz3kUgkbn8JkGX5utvtelut1telNYf+ScPHDzL0+yEW8wnC4fCT3+/3+Hy+nzrhBEHwTiYTvCRrQwma2sVIFXCnDaAqA7TbbdRqtcdSqZTIZrOvLwCNRsNY2RbGrKI2FN1kddCB3OtAFAU4joPT6YTj8cjas5DP58epVOrtGcCGZVD1+zuFJYusYh/9noQe03a7xW63w3q9drXf77FYLPCerTOA7b00LMMYYzRS3YDD4eCKksmBbdtYLpfuk5zkcrnvyWSyFAwG33DMzjUblJcNymDtfKMAqkbBlEwu6J0AJNoT3DRNRKPR6sVE2RUwCUCJq9XKDd5sNmfAixOaBbUTj8efLwD1ev3dbDZzDymR9tQSuSAgfa3pdOqe6boO1gJ/AWA371W1Wg00m801gznlcpkvFoutdDp9CoVCx1gsJjFpkUjkORAI8KztG+7/+Zn+VD8AV2IaSQGFiWoAAAAASUVORK5CYII=",
  //   },
  //   {
  //     id: 2,
  //     name: "Zacharia",
  //     designation: "Dunton",
  //     yearsOfExperience: "3",
  //     profileImg:
  //       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKOSURBVDjLhZNPTBNBFMa/3e0/ty1tiZUChkZAESnGA54k4WRATQxJL2piYpR4UBNvnrwZPXjwiiHRBCVBUMJJ0UrlYtJEjI2JBCkEbLGhWGxh2+5u6W7XmY1LCkJ8ybcz+2bm9968mWE0TUM4HLaS9jzRxXK5fJS0h4lIt/yNtAukfUIU7u3tVbHDmMnJyWNk0rDX6z3u8/lgt9vB8zwoeGNjA7lcDolEAul0+iPxXQgGg8lthFAoNBWPx2k4bS8rlUpaNBrVRkZGBim4Uiz5tNXU1OB/Vl9fDxLkzE6/iTh10urqKmw2G6xWK8xms+4TRRGZTAbJZBJNTU0UgD0BJpMJ2WwWsizr/4qiQBAEFItFfYz6dgOwxl44jtMzcDgc8Hg8cLvdejEtFgtYlkVZVdFQnLInXnVPz/cHrm0BjAxoRFIsXSqZTGX4aL+0MI62didf13Ovw9kcePjlwZGebVswFlDRbPRFf4Gu/DQc3nm4Wk6jEJ+A2dlS7W4ojk3cbuzbAlRGNwBGBryyBFf7OajiDGz7D0JWf6K26wSvFLL9OoDKiG4AKzMT1SqUsj/Acmtg2AIsVWuALCK/UuRMdAI9KnITkUqlIEnSVoUt8jICmMK+WlJEJUMKtk6q5oRW2sT3F3PyzJxwnWZwJRKJjLa2ttr9fr9+DxiGgbj4Frz0Hgc6OqFthsCoOcy8FiRTbkXgyHhsUbh5eXhpjKFpDg0NHSKgu0RBcmQuenxt2jgaO7uxudZP7oELsx/y0udI6pZfll7a7By6BhM5/TFRQKUNDAw4SS2az/rePKvrPBVQ1iOYffc7/zX668bVp/PP/3mNOwGGfXp08r6j2tMnZgpSLJa+c+lxbHS3eX8A58zTPyvL4X4AAAAASUVORK5CYII=",
  //   },
  // ];

  useEffect(() => {
    handleFetchRequests();
  }, [partnerId]);

  const handleFetchRequests = async (isRefreshing?: boolean) => {
    try {
      if (isRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      if (!vets || isRefreshing) {
        await fetchPartnerVets(partnerId);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  return (
    <Layout
      showBack
      title={partnerName}
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <FlatList
        data={vets ?? []}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={colorPrimary}
            onRefresh={() => handleFetchRequests(true)}
          />
        }
        ListHeaderComponent={
          <Text
            fontSize="xl"
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={16}
          >
            Find your Doctor
          </Text>
        }
        renderItem={({ item, index }) => (
          <DoctorListCard
            mb={index + 1 === vets?.length ? 0 : 20}
            name={item.name}
            speciality={item.designation}
            experience={item.yearsOfExperience ?? 0}
            image={item.profileImg?.url}
            verified
            nextAvailable=""
            onCheckAvailability={() => {
              navigation.navigate("PartnerVetDetailScreen", {
                vetId: item.id,
                partnerId: partnerId,
                caseId,
                selectedServices,
              });
            }}
          />
        )}
        keyExtractor={(item, i) => `${i}`}
      />
    </Layout>
  );
};

export default PartnerVetScreen;
