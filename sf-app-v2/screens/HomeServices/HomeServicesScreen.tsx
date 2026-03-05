import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useAIPicks } from "@/hooks/useAIPicks";
import { MOCK_SERVICES, MOCK_PRODUCTS } from "@/mocks/homeServices";
import { NavigationType } from "@/store/types";
import {
  IconChevronLeft,
  IconCirclePlus,
  IconPill,
  IconShieldCheck,
  IconStethoscope,
} from "@tabler/icons-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Div, Text } from "react-native-magnus";

const { width } = Dimensions.get("window");
const CARD_GAP = 16; // horizontal gap between cards
// Two cards per row with 20px horizontal padding on each side and CARD_GAP between them
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

type TabType = "services" | "nutritions";
type NutritionsSubTab = "all" | "ai";

const HomeServicesScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [nutritionsSubTab, setNutritionsSubTab] =
    useState<NutritionsSubTab>("all");
  const { products: aiPicksProducts, loading: aiPicksLoading, error: aiPicksError } = useAIPicks();

  return (
    <Layout disableHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Div pt={8} pb={4} mb={2}>
          <Div mb={6}>
            <BackButton onPress={() => navigation.goBack()} />
          </Div>
          <Text fontSize={"2xl"} fontFamily={fontHauoraBold} color="#1A1A1A">
            Home Services
          </Text>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraMedium}
            color="#6B7280"
            mt={4}
          >
            Professional vet care at your doorstep
          </Text>
        </Div>

        {/* Top Tabs: Services | Nutritions */}
        <Div
          flexDir="row"
          borderBottomWidth={1}
          borderColor="#f3f4f6"
          mb={0}
        >
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "services" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("services")}
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 6 }}>
              <IconStethoscope
                size={18}
                color={activeTab === "services" ? colorPrimary : "#9CA3AF"}
                strokeWidth={1.8}
              />
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraSemiBold}
                color={activeTab === "services" ? colorPrimary : "#9CA3AF"}
              >
                Services
              </Text>
            </Div>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "nutritions" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("nutritions")}
          >
            <Div flexDir="row" alignItems="center" style={{ gap: 6 }}>
              <IconPill
                size={18}
                color={activeTab === "nutritions" ? colorPrimary : "#9CA3AF"}
                strokeWidth={1.8}
              />
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraSemiBold}
                color={activeTab === "nutritions" ? colorPrimary : "#9CA3AF"}
              >
                Food & Supplies
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>

        {activeTab === "services" && (
          <>
            {/* Row 1: Grooming, Vaccination */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mt={6} mb={6}>
              {MOCK_SERVICES.slice(0, 2).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("ServiceDetailsScreen", { serviceId: s.id })
                  }
                >
                  <Div
                    w={40}
                    h={40}
                    bg={s.iconBg}
                    rounded={12}
                    justifyContent="center"
                    alignItems="center"
                    mb={12}
                  >
                    <IconStethoscope size={20} color={s.iconColor} strokeWidth={2} />
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>
                    {s.title}
                  </Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>
                    {s.durationLabel}
                  </Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>
                    {s.priceLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </Div>

            {/* Sponsored banner 1 – after first row */}
            <Div
              rounded={24}
              mb={10}
              px={20}
              py={16}
              bg="#D1C6B8"
            >
              <Text
                fontSize={10}
                fontFamily={fontHauoraBold}
                color="#F9FAFB"
                style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
                mb={6}
              >
                Sponsored
              </Text>
              <Text
                fontSize={"lg"}
                fontFamily={fontHauoraBold}
                color="#FFFFFF"
                mb={10}
              >
                20% OFF First Grooming
              </Text>
              <TouchableOpacity activeOpacity={0.85}>
                <Div
                  bg="#FFFFFF"
                  px={18}
                  py={10}
                  rounded={16}
                  alignSelf="flex-start"
                >
                  <Text
                    fontSize={11}
                    fontFamily={fontHauoraBold}
                    color="#111827"
                  >
                    Shop Now
                  </Text>
                </Div>
              </TouchableOpacity>
            </Div>

            {/* Row 2: Health Checkup, Dental Care */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
              {MOCK_SERVICES.slice(2, 4).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("ServiceDetailsScreen", { serviceId: s.id })
                  }
                >
                  <Div
                    w={40}
                    h={40}
                    bg={s.iconBg}
                    rounded={12}
                    justifyContent="center"
                    alignItems="center"
                    mb={12}
                  >
                    <IconStethoscope size={20} color={s.iconColor} strokeWidth={2} />
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>{s.title}</Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>{s.durationLabel}</Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>{s.priceLabel}</Text>
                </TouchableOpacity>
              ))}
            </Div>

            {/* Sponsored banner 2 – after second row */}
            <Div
              rounded={24}
              mb={10}
              px={20}
              py={16}
              bg="#E0E3EB"
            >
              <Text
                fontSize={10}
                fontFamily={fontHauoraBold}
                color="#111827"
                style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
                mb={6}
              >
                Sponsored
              </Text>
              <Text
                fontSize={"lg"}
                fontFamily={fontHauoraBold}
                color="#111827"
                mb={10}
              >
                Free Delivery on Meds
              </Text>
              <TouchableOpacity activeOpacity={0.85}>
                <Div
                  bg="#111827"
                  px={18}
                  py={10}
                  rounded={16}
                  alignSelf="flex-start"
                >
                  <Text
                    fontSize={11}
                    fontFamily={fontHauoraBold}
                    color="#FFFFFF"
                  >
                    Shop Now
                  </Text>
                </Div>
              </TouchableOpacity>
            </Div>

            {/* Row 3: Deworming, Nail Trimming */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
              {MOCK_SERVICES.slice(4, 6).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("ServiceDetailsScreen", { serviceId: s.id })
                  }
                >
                  <Div
                    w={40}
                    h={40}
                    bg={s.iconBg}
                    rounded={12}
                    justifyContent="center"
                    alignItems="center"
                    mb={12}
                  >
                    <IconStethoscope size={20} color={s.iconColor} strokeWidth={2} />
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>{s.title}</Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>{s.durationLabel}</Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>{s.priceLabel}</Text>
                </TouchableOpacity>
              ))}
            </Div>

            {/* Info box */}
            <Div flexDir="row" alignItems="center" bg="#EFF6FF" borderWidth={1} borderColor="#BFDBFE" rounded={12} p={16} style={{ gap: 12 }} mb={8}>
              <IconShieldCheck size={20} color={colorPrimary} />
              <Text fontSize={10} fontFamily={fontHauora} color="#1E40AF" lineHeight={16} flex={1}>
                All services are performed by licensed veterinarians and certified pet care specialists.
              </Text>
            </Div>
          </>
        )}

        {activeTab === "nutritions" && (
          <>
            {/* Sub tabs: All Products | AI Picks */}
            <Div flexDir="row" style={{ gap: 12 }} mt={6} mb={6}>
              <TouchableOpacity
                style={[styles.subTab, nutritionsSubTab === "all" && styles.subTabActive]}
                onPress={() => setNutritionsSubTab("all")}
              >
                <Text fontSize={"sm"} fontFamily={fontHauoraSemiBold} color={nutritionsSubTab === "all" ? "white" : "#6B7280"}>
                  All Products
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, nutritionsSubTab === "ai" && styles.subTabActive]}
                onPress={() => setNutritionsSubTab("ai")}
              >
                <Text fontSize={"sm"} fontFamily={fontHauoraSemiBold} color={nutritionsSubTab === "ai" ? "white" : "#6B7280"}>
                  ✨ AI Picks
                </Text>
              </TouchableOpacity>
            </Div>

            {/* Product grid + ad banners (design: row1 → banner1 → row2 → banner2 → row3) */}
            {nutritionsSubTab === "all" ? (
              <>
                {/* Row 1: Premium Kibble, Vitamins */}
                <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
                  {MOCK_PRODUCTS.slice(0, 2).map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.productCard, { width: CARD_WIDTH }]}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("ProductDetailsScreen", {
                          productId: p.id,
                        })
                      }
                    >
                      <Div w="100%" bg="#f3f4f6" rounded={12} mb={12} style={{ aspectRatio: 1 }} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.priceLabel}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>

                {/* Sponsored banner 1 */}
                <Div
                  rounded={24}
                  mb={10}
                  px={20}
                  py={16}
                  bg="#D1C6B8"
                >
                  <Text
                    fontSize={10}
                    fontFamily={fontHauoraBold}
                    color="#F9FAFB"
                    style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
                    mb={6}
                  >
                    Sponsored
                  </Text>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraBold}
                    color="#FFFFFF"
                    mb={10}
                  >
                    20% OFF First Grooming
                  </Text>
                  <TouchableOpacity activeOpacity={0.85}>
                    <Div
                      bg="#FFFFFF"
                      px={18}
                      py={10}
                      rounded={16}
                      alignSelf="flex-start"
                    >
                      <Text
                        fontSize={11}
                        fontFamily={fontHauoraBold}
                        color="#111827"
                      >
                        Shop Now
                      </Text>
                    </Div>
                  </TouchableOpacity>
                </Div>

                {/* Row 2: Flea & Tick, Joint Support */}
                <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
                  {MOCK_PRODUCTS.slice(2, 4).map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.productCard, { width: CARD_WIDTH }]}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("ProductDetailsScreen", {
                          productId: p.id,
                        })
                      }
                    >
                      <Div w="100%" bg="#f3f4f6" rounded={12} mb={12} style={{ aspectRatio: 1 }} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.priceLabel}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>

                {/* Sponsored banner 2 */}
                <Div
                  rounded={24}
                  mb={10}
                  px={20}
                  py={16}
                  bg="#E0E3EB"
                >
                  <Text
                    fontSize={10}
                    fontFamily={fontHauoraBold}
                    color="#111827"
                    style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
                    mb={6}
                  >
                    Sponsored
                  </Text>
                  <Text
                    fontSize={"lg"}
                    fontFamily={fontHauoraBold}
                    color="#111827"
                    mb={10}
                  >
                    Free Delivery on Meds
                  </Text>
                  <TouchableOpacity activeOpacity={0.85}>
                    <Div
                      bg="#111827"
                      px={18}
                      py={10}
                      rounded={16}
                      alignSelf="flex-start"
                    >
                      <Text
                        fontSize={11}
                        fontFamily={fontHauoraBold}
                        color="#FFFFFF"
                      >
                        Shop Now
                      </Text>
                    </Div>
                  </TouchableOpacity>
                </Div>

                {/* Row 3: Probiotics, Calming Treats */}
                <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
                  {MOCK_PRODUCTS.slice(4, 6).map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.productCard, { width: CARD_WIDTH }]}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("ProductDetailsScreen", {
                          productId: p.id,
                        })
                      }
                    >
                      <Div w="100%" bg="#f3f4f6" rounded={12} mb={12} style={{ aspectRatio: 1 }} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.priceLabel}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>
              </>
            ) : (
              /* AI Picks: list layout – data from API when endpoint is set, else fallback */
              <Div style={{ gap: 16 }} mb={8}>
                {aiPicksLoading ? (
                  <Div py={24} alignItems="center">
                    <ActivityIndicator size="small" color={colorPrimary} />
                    <Text fontSize="sm" fontFamily={fontHauora} color="#6B7280" mt={8}>
                      Loading recommendations…
                    </Text>
                  </Div>
                ) : null}
                {aiPicksError ? (
                  <Div py={12} px={16} mb={8} bg="#FEF2F2" rounded={16} borderWidth={1} borderColor="#FECACA">
                    <Text fontSize="sm" fontFamily={fontHauora} color="#991B1B">
                      {aiPicksError}
                    </Text>
                  </Div>
                ) : null}
                {!aiPicksLoading
                  ? aiPicksProducts.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("ProductDetailsScreen", {
                        productId: p.id,
                      })
                    }
                  >
                    <Div
                      bg="white"
                      rounded={16}
                      p={12}
                      flexDir="row"
                      style={{ gap: 16 }}
                      borderWidth={1}
                      borderColor="#f9fafb"
                    >
                      <Div
                        w={96}
                        h={96}
                        bg="#f3f4f6"
                        rounded={12}
                        overflow="hidden"
                      />
                      <Div flex={1}>
                        <Div
                          flexDir="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Text
                            fontSize={"md"}
                            fontFamily={fontHauoraBold}
                            color="#222"
                          >
                            {p.title}
                          </Text>
                          <TouchableOpacity style={styles.addBtn}>
                            <IconCirclePlus
                              size={16}
                              color={colorPrimary}
                              strokeWidth={2}
                            />
                          </TouchableOpacity>
                        </Div>
                        <Text
                          fontSize={"sm"}
                          fontFamily={fontHauoraBold}
                          color={colorPrimary}
                          mt={4}
                        >
                          {p.priceLabel}
                        </Text>
                        <Div
                          flexDir="row"
                          alignItems="center"
                          mt={4}
                          style={{ gap: 4 }}
                        >
                          <IconShieldCheck size={12} color={colorPrimary} />
                          <Text
                            fontSize={10}
                            fontFamily={fontHauoraBold}
                            color={colorPrimary}
                            style={{ textTransform: "uppercase" }}
                          >
                            {p.tag}
                          </Text>
                        </Div>
                        <Text
                          fontSize={11}
                          fontFamily={fontHauora}
                          color="#9CA3AF"
                          mt={8}
                          fontStyle="italic"
                          lineHeight={16}
                        >
                          {p.subtitle}
                        </Text>
                      </Div>
                    </Div>
                  </TouchableOpacity>
                  ))
                  : null}
              </Div>
            )}

            {/* Info banner */}
            <Div flexDir="row" alignItems="center" bg="#EFF6FF" borderWidth={1} borderColor="#BFDBFE" rounded={12} p={16} style={{ gap: 12 }} mb={24}>
              <IconShieldCheck size={20} color={colorPrimary} />
              <Text fontSize={11} fontFamily={fontHauora} color="#1E40AF" lineHeight={16} flex={1}>
                All products are vet-approved and sourced from trusted suppliers.
              </Text>
            </Div>
          </>
        )}
      </ScrollView>
    </Layout>
  );
};

export default HomeServicesScreen;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  topTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  topTabActive: {
    borderBottomColor: colorPrimary,
  },
  subTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  subTabActive: {
    backgroundColor: colorPrimary,
    borderColor: colorPrimary,
  },
  serviceCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    marginBottom: CARD_GAP,
    marginHorizontal: CARD_GAP / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 18,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 20,
    marginBottom: CARD_GAP,
    marginHorizontal: CARD_GAP / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f9fafb",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
});
