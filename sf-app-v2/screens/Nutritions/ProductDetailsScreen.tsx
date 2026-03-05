import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
} from "@/constant/constant";
import { MOCK_PRODUCTS, type ProductId } from "@/mocks/homeServices";
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
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
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
  const productId = (route.params as { productId?: ProductId })?.productId;
  const product = useMemo(
    () => (productId ? MOCK_PRODUCTS.find((p) => p.id === productId) : null),
    [productId]
  );

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
    navigation.goBack();
  };

  const increment = () => setCount((n) => Math.min(10, n + 1));
  const decrement = () => setCount((n) => Math.max(1, n - 1));

  if (!product) {
    return (
      <Layout disableHeader>
        <Div p={20}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text fontSize="lg" fontFamily={fontHauora} color="#6B7280" mt={12}>
            Product not found.
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
        <Div pt={8} px={0} pb={0}>
          <BackButton onPress={() => navigation.goBack()} />
        </Div>

        {/* Image area */}
        <Div mt={16} mb={20}>
          <Div
            h={240}
            rounded={24}
            bg="#F3F4F6"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Text
              fontSize={"sm"}
              fontFamily={fontHauoraMedium}
              color="#9CA3AF"
            >
              Product image
            </Text>

            {/* Carousel dots */}
            <Div position="absolute" bottom={16} flexDir="row" style={{ gap: 8 }}>
              <Div w={8} h={8} rounded={999} bg={colorPrimary} />
              <Div w={8} h={8} rounded={999} bg="#E5E7EB" />
            </Div>
          </Div>
        </Div>

        {/* Header / description */}
        <Div mb={20}>
          <Text
            fontSize={"2xl"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={6}
          >
            {product.title}
          </Text>
          <Div flexDir="row" alignItems="center" mb={8}>
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
            lineHeight={20}
          >
            {product.description}
          </Text>
        </Div>

        {/* Quantity options */}
        <Div mb={20}>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={8}
          >
            Quantity
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

        {/* Count stepper */}
        <Div mb={20}>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={8}
          >
            Quantity
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
            py={12}
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
        <Div mb={16} style={{ gap: 12 }}>
          <Div
            flexDir="row"
            alignItems="center"
            bg="#FFFFFF"
            rounded={16}
            borderWidth={1}
            borderColor="#E5E7EB"
            px={16}
            py={12}
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
            rounded={16}
            borderWidth={1}
            borderColor="#E5E7EB"
            px={16}
            py={12}
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
        <Div mb={160}>
          <Div flexDir="row" alignItems="center" mb={8}>
            <IconInfoCircle size={18} color={colorPrimary} />
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
        pt={12}
        pb={24}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
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
              fontFamily={fontHauoraBold}
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
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  quantityOption: {
    flexGrow: 1,
    minWidth: "28%",
    paddingVertical: 12,
    paddingHorizontal: 12,
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
    borderRadius: 20,
    backgroundColor: colorPrimary,
    flexDirection: "row",
    alignItems: "center",
  },
});

