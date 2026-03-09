import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { type ProductId, type ProductSummary } from "@/mocks/homeServices";
import { fetchProductByIdFromApi } from "@/utils/homeServicesApi";
import { useCartStore } from "@/store/modules/cart";
import { NavigationType } from "@/store/types";
import {
  IconClock,
  IconInfoCircle,
  IconShoppingCart,
  IconStar,
  IconTruck,
} from "@tabler/icons-react-native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Div, Text } from "react-native-magnus";

/** Quantity/size options with price delta (e.g. 30 / 60 / 90 chews). */
const QUANTITY_OPTIONS = [
  { id: "30", label: "30 chews", badge: "" as string, priceDelta: 0 },
  { id: "60", label: "60 chews", badge: "+AED 25", priceDelta: 25 },
  { id: "90", label: "90 chews", badge: "+AED 45", priceDelta: 45 },
];

interface Props {
  navigation: NavigationType;
}

const ProductDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute();
  const productId = (route.params as { productId?: ProductId | string })?.productId;
  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [loading, setLoading] = useState(!!productId);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchProductByIdFromApi(String(productId)).then((p) => {
      if (!cancelled) {
        setProduct(p);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const [selectedQuantityOption, setSelectedQuantityOption] = useState<string>("30");
  const [count, setCount] = useState(1);
  const [specialNotes, setSpecialNotes] = useState("");

  const addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);

  const selectedOption = useMemo(
    () => QUANTITY_OPTIONS.find((o) => o.id === selectedQuantityOption),
    [selectedQuantityOption]
  );

  const unitPrice = useMemo(() => {
    if (!product || !selectedOption) return 0;
    return product.basePrice + selectedOption.priceDelta;
  }, [product, selectedOption]);

  const totalPrice = unitPrice * count;

  const handleAddToCart = () => {
    if (!product || !selectedOption) return;
    addOrUpdateItem({
      id: product.id,
      type: "product",
      title: product.title,
      subtitle: product.description,
      unitPrice,
      quantity: count,
      packageId: selectedOption.id,
      packageLabel: selectedOption.label,
      notes: specialNotes.trim() || undefined,
    });
    navigation.navigate("YourCartScreen");
  };

  const increment = () => setCount((n) => Math.min(10, n + 1));
  const decrement = () => setCount((n) => Math.max(1, n - 1));

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(id);
  }, []);

  if (showIntro) {
    return (
      <Layout disableHeader>
        <Div
          style={{
            flex: 1,
            backgroundColor: "#FAF8F5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color={colorPrimary} />
        </Div>
      </Layout>
    );
  }

  if (loading || !product) {
    return (
      <Layout disableHeader>
        <Div p={20}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text
            fontSize="lg"
            fontFamily={fontHauora}
            color="#6B7280"
            mt={12}
          >
            {loading ? "Loading…" : "Product not found."}
          </Text>
        </Div>
      </Layout>
    );
  }

  return (
    <Layout disableHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <Div pt={8} pb={4}>
          <Div mb={8}>
            <BackButton onPress={() => navigation.goBack()} />
          </Div>
        </Div>

        {/* Image area */}
        <Div mb={24}>
          <Div
            h={240}
            rounded={24}
            bg="#F3F4F6"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
          >
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={{ width: 180, height: 180, borderRadius: 20, alignSelf: "center" }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("@/assets/images/no-image.png")}
                style={{ width: 140, height: 140, borderRadius: 20, alignSelf: "center" }}
                resizeMode="contain"
              />
            )}
          </Div>
        </Div>

        {/* Header / description */}
        <Div mb={24}>
          <Text
            fontSize={"2xl"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={8}
          >
            {product.title}
          </Text>
          <Div flexDir="row" alignItems="center" mb={10}>
            <Div
              flexDir="row"
              alignItems="center"
              bg="#F3F4F6"
              px={10}
              py={6}
              rounded={999}
            >
              <IconStar size={16} color="#F59E0B" fill="#F59E0B" />
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraBold}
                color="#4B5563"
                ml={6}
              >
                4.8 (85)
              </Text>
            </Div>
          </Div>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauora}
            color="#6B7280"
            lineHeight={22}
          >
            {product.description}
          </Text>
        </Div>

        {/* Size / pack options */}
        <Div mb={24}>
          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={12}
          >
            Pack size
          </Text>
          <Div flexDir="row" flexWrap="wrap" style={{ gap: 12 }}>
            {QUANTITY_OPTIONS.map((opt) => {
              const isActive = opt.id === selectedQuantityOption;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedQuantityOption(opt.id)}
                  style={[
                    styles.quantityOption,
                    isActive && styles.quantityOptionActive,
                  ]}
                >
                  <Text
                    fontSize={"sm"}
                    fontFamily={fontHauoraMedium}
                    color={isActive ? colorPrimary : "#4B5563"}
                  >
                    {opt.label}
                  </Text>
                  {opt.badge ? (
                    <Text
                      fontSize={11}
                      fontFamily={fontHauoraMedium}
                      color="#6B7280"
                    >
                      {opt.badge}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </Div>
        </Div>

        {/* Number of items */}
        <Div mb={24}>
          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={12}
          >
            Number of items
          </Text>
          <Div
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            bg="#FFFFFF"
            rounded={20}
            borderWidth={1}
            borderColor="#E5E7EB"
            px={16}
            py={14}
          >
            <TouchableOpacity
              onPress={decrement}
              disabled={count <= 1}
              style={styles.circleBtn}
            >
              <Text fontSize={"lg"} color={count <= 1 ? "#D1D5DB" : "#4B5563"}>
                -
              </Text>
            </TouchableOpacity>
            <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="#111827">
              {count}
            </Text>
            <TouchableOpacity onPress={increment} style={styles.circleBtn}>
              <Text fontSize={"lg"} color="#111827">
                +
              </Text>
            </TouchableOpacity>
          </Div>
        </Div>

        {/* Delivery info */}
        <Div mb={24} style={{ gap: 12 }}>
          <Div
            flexDir="row"
            alignItems="center"
            bg="#FFFFFF"
            rounded={20}
            borderWidth={1}
            borderColor="#E5E7EB"
            px={16}
            py={14}
            style={{ gap: 12 }}
          >
            <IconTruck size={20} color={colorPrimary} />
            <Text
              fontSize={"sm"}
              fontFamily={fontHauoraMedium}
              color="#4B5563"
              flex={1}
            >
              Free delivery on orders over AED 100
            </Text>
          </Div>
          <Div
            flexDir="row"
            alignItems="center"
            bg="#FFFFFF"
            rounded={20}
            borderWidth={1}
            borderColor="#E5E7EB"
            px={16}
            py={14}
            style={{ gap: 12 }}
          >
            <IconClock size={20} color={colorPrimary} />
            <Text
              fontSize={"sm"}
              fontFamily={fontHauoraMedium}
              color="#4B5563"
              flex={1}
            >
              Vet-approved & sourced from trusted suppliers
            </Text>
          </Div>
        </Div>

        {/* Special instructions */}
        <Div mb={24}>
          <Div flexDir="row" alignItems="center" mb={12}>
            <IconInfoCircle size={20} color={colorPrimary} />
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraBold}
              color="#111827"
              ml={8}
            >
              Special Instructions
            </Text>
          </Div>
          <TextInput
            multiline
            numberOfLines={3}
            maxLength={500}
            placeholder="Any specific delivery instructions?"
            placeholderTextColor="#9CA3AF"
            style={styles.textArea}
            value={specialNotes}
            onChangeText={setSpecialNotes}
          />
          <Text fontSize={10} fontFamily={fontHauora} color="#9CA3AF" mt={4}>
            {specialNotes.length}/500
          </Text>
        </Div>
      </ScrollView>

      {/* Bottom bar */}
      <Div
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        bg="#FFFFFF"
        borderTopWidth={1}
        borderTopColor="#E5E7EB"
        px={20}
        pt={14}
        pb={28}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Div flexDir="row" alignItems="center" justifyContent="space-between">
          <Div>
            <Text
              fontSize={11}
              fontFamily={fontHauoraMedium}
              color="#6B7280"
              mb={2}
            >
              Total price
            </Text>
            <Text
              fontSize={"2xl"}
              fontFamily={fontHauoraBold}
              color={colorPrimary}
            >
              AED {totalPrice.toFixed(2)}
            </Text>
          </Div>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleAddToCart}
          >
            <IconShoppingCart size={18} color="#FFFFFF" />
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraSemiBold}
              color="#FFFFFF"
              ml={8}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
    </Layout>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  quantityOption: {
    flexGrow: 1,
    minWidth: "28%",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityOptionActive: {
    borderColor: colorPrimary,
    backgroundColor: "#EEF2FF",
  },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    fontFamily: fontHauora,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
  },
});

