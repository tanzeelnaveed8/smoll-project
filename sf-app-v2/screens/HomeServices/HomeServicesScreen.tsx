import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import {
  IconChevronLeft,
  IconCirclePlus,
  IconShieldCheck,
} from "@tabler/icons-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Div, Text } from "react-native-magnus";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 40 - 40 - CARD_GAP) / 2; // padding 20 each side, gap between cards

const SERVICES = [
  {
    id: "1",
    title: "Grooming",
    duration: "45-60 min",
    price: "From AED 40",
    iconBg: "#FDF2F8",
    iconColor: "#EC4899",
  },
  {
    id: "2",
    title: "Vaccination",
    duration: "15-20 min",
    price: "From AED 25",
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    id: "3",
    title: "Health Checkup",
    duration: "30-45 min",
    price: "From AED 50",
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    id: "4",
    title: "Dental Care",
    duration: "30-40 min",
    price: "From AED 45",
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
  },
  {
    id: "5",
    title: "Deworming",
    duration: "10-15 min",
    price: "From AED 20",
    iconBg: "#ECFDF5",
    iconColor: "#22C55E",
  },
  {
    id: "6",
    title: "Nail Trimming",
    duration: "15-20 min",
    price: "From AED 15",
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
  },
];

const PRODUCTS = [
  { id: "1", title: "Premium Kibble", price: "AED 34.99", tag: "Good for Bella", description: "Grain-free, all breeds", subtitle: "High-protein grain-free formula ideal for active Golden Retrievers" },
  { id: "2", title: "Vitamins", price: "AED 19.99", tag: "Good for Bella & Max", description: "Daily multivitamin chews", subtitle: "Daily multivitamins support immune health for dogs and cats" },
  { id: "3", title: "Flea & Tick Meds", price: "AED 28.99", tag: "Good for Bella", description: "Monthly topical treatment", subtitle: "Monthly topical treatment for flea and tick prevention" },
  { id: "4", title: "Joint Support", price: "AED 24.99", tag: "Good for Bella", description: "Glucosamine formula", subtitle: "Glucosamine supports hip and joint health in large breeds" },
  { id: "5", title: "Probiotics", price: "AED 16.99", tag: "Good for Max", description: "Digestive health support", subtitle: "Gentle digestive support perfect for sensitive Persian cats" },
  { id: "6", title: "Calming Treats", price: "AED 14.99", tag: "Good for Max", description: "Anxiety relief chews", subtitle: "Helps reduce anxiety and stress in indoor cats" },
];

type TabType = "services" | "nutritions";
type NutritionsSubTab = "all" | "ai";

const HomeServicesScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [nutritionsSubTab, setNutritionsSubTab] =
    useState<NutritionsSubTab>("all");

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
            <Text
              fontSize={"sm"}
              fontFamily={fontHauoraSemiBold}
              color={activeTab === "services" ? colorPrimary : "#9CA3AF"}
            >
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "nutritions" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("nutritions")}
          >
            <Text
              fontSize={"sm"}
              fontFamily={fontHauoraSemiBold}
              color={activeTab === "nutritions" ? colorPrimary : "#9CA3AF"}
            >
              Nutritions
            </Text>
          </TouchableOpacity>
        </Div>

        {activeTab === "services" && (
          <>
            {/* Row 1: Grooming, Vaccination */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mt={6} mb={6}>
              {SERVICES.slice(0, 2).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                >
                  <Div
                    w={40}
                    h={40}
                    bg={s.iconBg}
                    rounded={12}
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                  >
                    <Text fontSize={20}>🩺</Text>
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>
                    {s.title}
                  </Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>
                    {s.duration}
                  </Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>
                    {s.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </Div>

            {/* Sponsored banner 1 – after first row */}
            <Div
              h={128}
              rounded={16}
              overflow="hidden"
              mb={6}
              position="relative"
              bg="#FFF7ED"
            >
              <Div position="absolute" inset={0} bg="rgba(0,0,0,0.3)" p={16} justifyContent="center">
                <Text fontSize={10} fontFamily={fontHauoraBold} color="white" style={{ textTransform: "uppercase", letterSpacing: 1 }} mb={4}>
                  Sponsored
                </Text>
                <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="white" mb={8}>
                  20% OFF First Grooming
                </Text>
                <Div bg="white" alignSelf="flex-start" py={6} px={16} rounded={8}>
                  <Text fontSize={10} fontFamily={fontHauoraBold} color="#222">Shop Now</Text>
                </Div>
              </Div>
            </Div>

            {/* Row 2: Health Checkup, Dental Care */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
              {SERVICES.slice(2, 4).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                >
                  <Div w={40} h={40} bg={s.iconBg} rounded={12} justifyContent="center" alignItems="center" mb={4}>
                    <Text fontSize={20}>🩺</Text>
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>{s.title}</Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>{s.duration}</Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>{s.price}</Text>
                </TouchableOpacity>
              ))}
            </Div>

            {/* Sponsored banner 2 – after second row */}
            <Div h={128} rounded={16} overflow="hidden" mb={6} position="relative" bg="#E5E7EB">
              <Div position="absolute" inset={0} style={{ backgroundColor: "rgba(55,65,81,0.6)" }} p={16} justifyContent="center">
                <Text fontSize={10} fontFamily={fontHauoraBold} color="white" style={{ textTransform: "uppercase", letterSpacing: 1 }} mb={4}>
                  Sponsored
                </Text>
                <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="white" mb={8}>
                  Free Delivery on Meds
                </Text>
                <Div bg="white" alignSelf="flex-start" py={6} px={16} rounded={8}>
                  <Text fontSize={10} fontFamily={fontHauoraBold} color="#222">Shop Now</Text>
                </Div>
              </Div>
            </Div>

            {/* Row 3: Deworming, Nail Trimming */}
            <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
              {SERVICES.slice(4, 6).map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceCard, { width: CARD_WIDTH }]}
                  activeOpacity={0.8}
                >
                  <Div w={40} h={40} bg={s.iconBg} rounded={12} justifyContent="center" alignItems="center" mb={4}>
                    <Text fontSize={20}>🩺</Text>
                  </Div>
                  <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={2}>{s.title}</Text>
                  <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={2}>{s.duration}</Text>
                  <Text fontSize={"xs"} fontFamily={fontHauoraBold} color={colorPrimary}>{s.price}</Text>
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
                  {PRODUCTS.slice(0, 2).map((p) => (
                    <TouchableOpacity key={p.id} style={[styles.productCard, { width: CARD_WIDTH }]} activeOpacity={0.8}>
                      <Div w="100%" aspectRatio={1} bg="#f3f4f6" rounded={12} mb={12} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.price}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>

                {/* Sponsored banner 1 */}
                <Div h={144} rounded={16} overflow="hidden" mb={6} position="relative" bg="#FFF7ED">
                  <Div position="absolute" inset={0} bg="rgba(0,0,0,0.3)" p={16} justifyContent="center">
                    <Text fontSize={10} fontFamily={fontHauoraBold} color="white" style={{ textTransform: "uppercase", letterSpacing: 1 }} mb={4}>SPONSORED</Text>
                    <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="white" mb={12}>20% OFF First Grooming</Text>
                    <Div bg="white" alignSelf="flex-start" py={8} px={16} rounded={8}>
                      <Text fontSize={"xs"} fontFamily={fontHauoraBold} color="#222">Shop Now</Text>
                    </Div>
                  </Div>
                </Div>

                {/* Row 2: Flea & Tick, Joint Support */}
                <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
                  {PRODUCTS.slice(2, 4).map((p) => (
                    <TouchableOpacity key={p.id} style={[styles.productCard, { width: CARD_WIDTH }]} activeOpacity={0.8}>
                      <Div w="100%" aspectRatio={1} bg="#f3f4f6" rounded={12} mb={12} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.price}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>

                {/* Sponsored banner 2 */}
                <Div h={144} rounded={16} overflow="hidden" mb={6} position="relative" bg="#E5E7EB">
                  <Div position="absolute" inset={0} style={{ backgroundColor: "rgba(55,65,81,0.6)" }} p={16} justifyContent="center">
                    <Text fontSize={10} fontFamily={fontHauoraBold} color="white" style={{ textTransform: "uppercase", letterSpacing: 1 }} mb={4}>SPONSORED</Text>
                    <Text fontSize={"xl"} fontFamily={fontHauoraBold} color="white" mb={12}>Free Delivery on Meds</Text>
                    <Div bg="white" alignSelf="flex-start" py={8} px={16} rounded={8}>
                      <Text fontSize={"xs"} fontFamily={fontHauoraBold} color="#222">Shop Now</Text>
                    </Div>
                  </Div>
                </Div>

                {/* Row 3: Probiotics, Calming Treats */}
                <Div flexDir="row" flexWrap="wrap" style={{ marginHorizontal: -CARD_GAP / 2 }} mb={6}>
                  {PRODUCTS.slice(4, 6).map((p) => (
                    <TouchableOpacity key={p.id} style={[styles.productCard, { width: CARD_WIDTH }]} activeOpacity={0.8}>
                      <Div w="100%" aspectRatio={1} bg="#f3f4f6" rounded={12} mb={12} />
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color="#222" mb={4}>{p.title}</Text>
                      <Text fontSize={10} color="#9CA3AF" fontFamily={fontHauora} mb={8}>{p.description}</Text>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary}>{p.price}</Text>
                    </TouchableOpacity>
                  ))}
                </Div>
              </>
            ) : (
              /* AI Picks: list layout */
              <Div style={{ gap: 16 }} mb={8}>
                {PRODUCTS.map((p) => (
                  <Div key={p.id} bg="white" rounded={16} p={12} flexDir="row" style={{ gap: 16 }} borderWidth={1} borderColor="#f9fafb">
                    <Div w={96} h={96} bg="#f3f4f6" rounded={12} overflow="hidden" />
                    <Div flex={1}>
                      <Div flexDir="row" justifyContent="space-between" alignItems="flex-start">
                        <Text fontSize={"md"} fontFamily={fontHauoraBold} color="#222">{p.title}</Text>
                        <TouchableOpacity style={styles.addBtn}>
                          <IconCirclePlus size={16} color={colorPrimary} strokeWidth={2} />
                        </TouchableOpacity>
                      </Div>
                      <Text fontSize={"sm"} fontFamily={fontHauoraBold} color={colorPrimary} mt={4}>{p.price}</Text>
                      <Div flexDir="row" alignItems="center" mt={4} style={{ gap: 4 }}>
                        <IconShieldCheck size={12} color={colorPrimary} />
                        <Text fontSize={10} fontFamily={fontHauoraBold} color={colorPrimary} style={{ textTransform: "uppercase" }}>{p.tag}</Text>
                      </Div>
                      <Text fontSize={11} fontFamily={fontHauora} color="#9CA3AF" mt={8} fontStyle="italic" lineHeight={16}>{p.subtitle}</Text>
                    </Div>
                  </Div>
                ))}
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
    paddingVertical: 16,
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
    borderRadius: 16,
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
    padding: 16,
    borderRadius: 16,
    marginBottom: CARD_GAP,
    marginHorizontal: CARD_GAP / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f9fafb",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
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
