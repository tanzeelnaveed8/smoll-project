import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
} from "@/constant/constant";
import { useCartStore } from "@/store/modules/cart";
import type { CartItem } from "@/store/types/cart";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import {
  IconClock,
  IconCreditCard,
  IconMapPin,
  IconShieldCheck,
  IconTruck,
} from "@tabler/icons-react-native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";

function itemLineTotal(item: CartItem): number {
  const base = item.unitPrice * item.quantity;
  const addonsTotal =
    item.addons?.reduce((sum, a) => sum + a.price * item.quantity, 0) ?? 0;
  return base + addonsTotal;
}

/** Mock travel fee for services (local-only). */
const TRAVEL_FEE = 0;

interface Props {
  navigation: NavigationType;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const schedule = useCartStore((s) => s.schedule);
  const user = useUserStore((s) => s.user);

  const subtotal = getTotal();
  const total = subtotal + TRAVEL_FEE;

  // Redirect back if cart is empty (e.g. user navigated directly or after refresh)
  useEffect(() => {
    if (items.length === 0) {
      navigation.goBack();
    }
  }, [items.length, navigation]);

  return (
    <Layout disableHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Div pt={8} pb={4}>
          <Div mb={6}>
            <BackButton onPress={() => navigation.goBack()} />
          </Div>
          <Text
            fontSize={"2xl"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={4}
          >
            Checkout
          </Text>
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraMedium}
            color="#6B7280"
          >
            Review your order details
          </Text>
        </Div>

        {/* Order summary card */}
        <Div
          bg="#FFFFFF"
          rounded={24}
          p={20}
          mb={16}
          shadow="sm"
          borderWidth={1}
          borderColor="#F3F4F6"
        >
          <Text
            fontSize={"sm"}
            fontFamily={fontHauoraBold}
            color="#111827"
            mb={16}
          >
            Order Summary
          </Text>
          <Div style={{ gap: 12 }}>
            {items.map((item) => (
              <Div
                key={`${item.type}-${item.id}-${item.packageId ?? ""}`}
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraMedium}
                  color="#4B5563"
                  flex={1}
                  numberOfLines={1}
                >
                  {item.quantity}× {item.title}
                  {item.packageLabel ? ` (${item.packageLabel})` : ""}
                </Text>
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraBold}
                  color="#111827"
                >
                  AED {itemLineTotal(item).toFixed(2)}
                </Text>
              </Div>
            ))}
            {TRAVEL_FEE > 0 && (
              <Div flexDir="row" justifyContent="space-between" alignItems="center">
                <Div flexDir="row" alignItems="center" style={{ gap: 6 }}>
                  <IconTruck size={16} color="#9CA3AF" />
                  <Text
                    fontSize={"sm"}
                    fontFamily={fontHauoraMedium}
                    color="#4B5563"
                  >
                    Travel fee
                  </Text>
                </Div>
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraBold}
                  color="#111827"
                >
                  AED {TRAVEL_FEE.toFixed(2)}
                </Text>
              </Div>
            )}
            <Div
              mt={8}
              pt={12}
              borderTopWidth={1}
              borderTopColor="#F3F4F6"
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraMedium}
                color="#9CA3AF"
              >
                Subtotal
              </Text>
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraBold}
                color="#111827"
              >
                AED {subtotal.toFixed(2)}
              </Text>
            </Div>
            <Div flexDir="row" justifyContent="space-between" alignItems="center">
              <Text
                fontSize={"md"}
                fontFamily={fontHauoraBold}
                color="#111827"
              >
                Total
              </Text>
              <Text
                fontSize={"xl"}
                fontFamily={fontHauoraBold}
                color={colorPrimary}
              >
                AED {total.toFixed(2)}
              </Text>
            </Div>
          </Div>
        </Div>

        {/* Details card */}
        <Div
          bg="#FFFFFF"
          rounded={24}
          p={20}
          shadow="sm"
          borderWidth={1}
          borderColor="#F3F4F6"
        >
          {/* Location */}
          <Div flexDir="row" alignItems="flex-start" mb={16} style={{ gap: 12 }}>
            <Div
              w={40}
              h={40}
              rounded={999}
              bg="#FEF3C7"
              justifyContent="center"
              alignItems="center"
            >
              <IconMapPin size={18} color="#F97316" />
            </Div>
            <Div flex={1}>
              <Text
                fontSize={10}
                fontFamily={fontHauoraBold}
                color="#D1D5DB"
                style={{ textTransform: "uppercase", letterSpacing: 1 }}
                mb={2}
              >
                Location
              </Text>
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraBold}
                color="#111827"
              >
                {user?.address ?? "No address set"}
              </Text>
              <Text
                fontSize={11}
                fontFamily={fontHauora}
                color="#9CA3AF"
                mt={4}
              >
                {user?.city && user?.country
                  ? `${user.city}, ${user.country}`
                  : "Add address in profile to book"}
              </Text>
            </Div>
          </Div>

          {/* Appointment */}
          <Div flexDir="row" alignItems="flex-start" mb={16} style={{ gap: 12 }}>
            <Div
              w={40}
              h={40}
              rounded={999}
              bg="#DBEAFE"
              justifyContent="center"
              alignItems="center"
            >
              <IconClock size={18} color="#3B82F6" />
            </Div>
            <Div flex={1}>
              <Text
                fontSize={10}
                fontFamily={fontHauoraBold}
                color="#D1D5DB"
                style={{ textTransform: "uppercase", letterSpacing: 1 }}
                mb={2}
              >
                Appointment
              </Text>
              <Text
                fontSize={"sm"}
                fontFamily={fontHauoraBold}
                color="#111827"
              >
                {schedule
                  ? `${schedule.labelTop} ${schedule.labelBottom} at ${schedule.time}`
                  : "No date selected"}
              </Text>
            </Div>
          </Div>

          {/* Payment method */}
          <Div flexDir="row" alignItems="flex-start" style={{ gap: 12 }}>
            <Div
              w={40}
              h={40}
              rounded={999}
              bg="#DBEAFE"
              justifyContent="center"
              alignItems="center"
            >
              <IconCreditCard size={18} color="#3B82F6" />
            </Div>
            <Div flex={1}>
              <Div flexDir="row" justifyContent="space-between" alignItems="flex-start">
                <Div>
                  <Text
                    fontSize={10}
                    fontFamily={fontHauoraBold}
                    color="#D1D5DB"
                    style={{ textTransform: "uppercase", letterSpacing: 1 }}
                    mb={2}
                  >
                    Payment Method
                  </Text>
                  <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraBold}
                      color="#111827"
                    >
                      •••• 4242
                    </Text>
                    <Text
                      fontSize={10}
                      fontFamily={fontHauoraBold}
                      color="#6B7280"
                      bg="#F3F4F6"
                      px={6}
                      py={2}
                      rounded={6}
                    >
                      VISA
                    </Text>
                  </Div>
                </Div>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text
                    fontSize={11}
                    fontFamily={fontHauoraBold}
                    color={colorPrimary}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Secure footer text */}
        <Div
          mt={24}
          mb={120}
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          style={{ gap: 6 }}
        >
          <IconShieldCheck size={16} color="#9CA3AF" />
          <Text
            fontSize={11}
            fontFamily={fontHauoraMedium}
            color="#9CA3AF"
          >
            Secure SSL payment
          </Text>
        </Div>
      </ScrollView>

      {/* Bottom pay button */}
      <Div
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        bg="#FFFFFF"
        px={20}
        pt={12}
        pb={24}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.06,
          shadowRadius: 18,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.payButton}
          disabled={items.length === 0}
          onPress={() => {
            // TODO: Integrate payment (e.g. createPaymentIntent / Stripe). On success: call booking API, clearCart(), setSchedule(null), navigate to confirmation.
          }}
        >
          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="#FFFFFF"
          >
            Pay AED {total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </Div>
    </Layout>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  payButton: {
    height: 56,
    borderRadius: 20,
    backgroundColor: colorPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
});

