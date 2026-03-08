import Layout from "@/components/app/Layout";
import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauora,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { type ServiceId, type ServiceSummary } from "@/mocks/homeServices";
import { fetchServiceDetailFromApi } from "@/utils/homeServicesApi";
import { useCartStore } from "@/store/modules/cart";
import { NavigationType } from "@/store/types";
import {
  IconCheck,
  IconClock,
  IconInfoCircle,
  IconShieldCheck,
  IconStar,
  IconUsers,
} from "@tabler/icons-react-native";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";

interface Props {
  navigation: NavigationType;
}

const ServiceDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute();
  const serviceId = (route.params as { serviceId?: ServiceId | string })?.serviceId;
  const [service, setService] = useState<ServiceSummary | null>(null);
  const [loading, setLoading] = useState(!!serviceId);

  const [packages, setPackages] = useState<Array<{ id: string; name: string; priceLabel: string; price: number; perks: string[]; highlighted?: boolean }>>([]);
  const [addons, setAddons] = useState<Array<{ id: string; name: string; priceLabel: string; price: number }>>([]);

  useEffect(() => {
    if (!serviceId) {
      setService(null);
      setPackages([]);
      setAddons([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchServiceDetailFromApi(String(serviceId)).then(({ service: s, packages: p, addons: a }) => {
      if (!cancelled) {
        setService(s ?? null);
        setPackages(p);
        setAddons(a);
        if (p.length) setSelectedPackageId((prev) => (p.some((pk) => pk.id === prev) ? prev : p[0].id));
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setService(null);
        setPackages([]);
        setAddons([]);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const [numPets, setNumPets] = useState(1);
  const defaultPkgId = packages[0]?.id ?? "basic";
  const [selectedPackageId, setSelectedPackageId] = useState<string>(defaultPkgId);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [specialNotes, setSpecialNotes] = useState("");

  const addOrUpdateItem = useCartStore((s) => s.addOrUpdateItem);

  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === selectedPackageId),
    [packages, selectedPackageId]
  );

  const estimatedTotal = useMemo(() => {
    const pkgPrice = selectedPkg?.price ?? 0;
    const addonTotal = addons
      .filter((a) => selectedAddons.has(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    return (pkgPrice + addonTotal) * numPets;
  }, [selectedPkg, addons, selectedAddons, numPets]);

  const handleContinue = () => {
    if (!service || !selectedPkg) return;
    const cartAddons = addons
      .filter((a) => selectedAddons.has(a.id))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
    addOrUpdateItem({
      id: service.id,
      type: "service",
      title: service.title,
      subtitle: service.durationLabel,
      unitPrice: selectedPkg.price,
      quantity: numPets,
      packageId: selectedPkg.id,
      packageLabel: selectedPkg.name,
      addons: cartAddons,
      notes: specialNotes.trim() || undefined,
    });
    navigation.navigate("SelectDateTimeScreen");
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const incrementPets = () => setNumPets((n) => Math.min(5, n + 1));
  const decrementPets = () => setNumPets((n) => Math.max(1, n - 1));

  if (loading || !service) {
    return (
      <Layout disableHeader>
        <Div p={20}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text fontSize="lg" fontFamily={fontHauora} color="#6B7280" mt={12}>
            {loading ? "Loading…" : "Service not found."}
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
        {/* Back + header */}
        <Div pt={8} pb={4}>
          <Div mb={4}>
            <BackButton onPress={() => navigation.goBack()} />
          </Div>

          <Div alignItems="center" mb={16}>
            <Div
              w={96}
              h={96}
              rounded={24}
              bg={service.iconBg}
              justifyContent="center"
              alignItems="center"
              mb={12}
            >
              <IconStar size={40} color={service.iconColor} strokeWidth={1.6} />
            </Div>
            <Text fontSize={"2xl"} fontFamily={fontHauoraBold} color="#111827" mb={8}>
              {service.title}
            </Text>
            <Div flexDir="row" style={{ gap: 8 }}>
              <Div
                flexDir="row"
                alignItems="center"
                bg="#F3F4F6"
                px={12}
                py={6}
                rounded={999}
              >
                <IconClock size={16} color="#6B7280" />
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraMedium}
                  color="#6B7280"
                  ml={6}
                >
                  {service.durationLabel}
                </Text>
              </Div>
              <Div
                flexDir="row"
                alignItems="center"
                bg="#FEF3C7"
                px={12}
                py={6}
                rounded={999}
              >
                <IconStar size={16} color="#F59E0B" fill="#F59E0B" />
                <Text
                  fontSize={"sm"}
                  fontFamily={fontHauoraMedium}
                  color="#92400E"
                  ml={6}
                >
                  4.9 (120+)
                </Text>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Number of pets */}
        <Div
          bg="#FFFFFF"
          rounded={20}
          borderWidth={1}
          borderColor="#E5E7EB"
          px={16}
          py={14}
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          mb={20}
        >
          <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
            <IconUsers size={20} color={colorPrimary} />
            <Text fontSize={"md"} fontFamily={fontHauoraBold} color="#111827">
              Number of pets
            </Text>
          </Div>
          <Div flexDir="row" alignItems="center" style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={decrementPets}
              disabled={numPets <= 1}
              style={styles.circleBtn}
            >
              <Text fontSize={"lg"} color={numPets <= 1 ? "#D1D5DB" : "#4B5563"}>
                -
              </Text>
            </TouchableOpacity>
            <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="#111827">
              {numPets}
            </Text>
            <TouchableOpacity onPress={incrementPets} style={styles.circleBtn}>
              <Text fontSize={"lg"} color="#111827">
                +
              </Text>
            </TouchableOpacity>
          </Div>
        </Div>

        {/* Packages */}
        <Div mb={12}>
          <Div flexDir="row" alignItems="center" mb={10}>
            <IconShieldCheck size={18} color={colorPrimary} />
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraBold}
              color="#111827"
              ml={8}
            >
              Select Package
            </Text>
          </Div>

          <Div style={{ gap: 12 }}>
            {packages.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              return (
                <TouchableOpacity
                  key={pkg.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPackageId(pkg.id)}
                  style={[
                    styles.packageCard,
                    isSelected && styles.packageCardSelected,
                  ]}
                >
                  {isSelected && (
                    <Div
                      position="absolute"
                      top={0}
                      right={0}
                      bg={colorPrimary}
                      px={10}
                      py={4}
                      roundedBottomLeft={12}
                      roundedTopRight={12}
                    >
                      <Text
                        fontSize={10}
                        fontFamily={fontHauoraBold}
                        color="#fff"
                        style={{ textTransform: "uppercase", letterSpacing: 1 }}
                      >
                        Selected
                      </Text>
                    </Div>
                  )}

                  <Div
                    flexDir="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    mb={8}
                  >
                    <Text
                      fontSize={"lg"}
                      fontFamily={fontHauoraBold}
                      color="#111827"
                    >
                      {pkg.name}
                    </Text>
                    <Text
                      fontSize={"lg"}
                      fontFamily={fontHauoraBold}
                      color={isSelected ? colorPrimary : "#111827"}
                    >
                      {pkg.priceLabel}
                    </Text>
                  </Div>

                  <Div style={{ gap: 6 }}>
                    {pkg.perks.map((perk) => (
                      <Div
                        key={perk}
                        flexDir="row"
                        alignItems="center"
                        style={{ gap: 6 }}
                      >
                        <IconCheck
                          size={16}
                          color={isSelected ? colorPrimary : "#9CA3AF"}
                          strokeWidth={2}
                        />
                        <Text
                          fontSize={"sm"}
                          fontFamily={fontHauora}
                          color="#6B7280"
                        >
                          {perk}
                        </Text>
                      </Div>
                    ))}
                  </Div>
                </TouchableOpacity>
              );
            })}
          </Div>
        </Div>

        {/* Add-ons */}
        <Div mt={12} mb={28}>
          <Div flexDir="row" alignItems="center" mb={10}>
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraBold}
              color="#111827"
            >
              Add-ons & Extras
            </Text>
          </Div>
          <Div style={{ gap: 10 }}>
            {addons.map((addon) => {
              const isSelected = selectedAddons.has(addon.id);
              return (
                <TouchableOpacity
                  key={addon.id}
                  activeOpacity={0.8}
                  style={styles.addonRow}
                  onPress={() => toggleAddon(addon.id)}
                >
                  <Div flex={1}>
                    <Text
                      fontSize={"sm"}
                      fontFamily={fontHauoraBold}
                      color="#111827"
                      mb={4}
                    >
                      {addon.name}
                    </Text>
                    <Text
                      fontSize={11}
                      fontFamily={fontHauoraMedium}
                      color={colorPrimary}
                    >
                      {addon.priceLabel}
                    </Text>
                  </Div>
                  <Div
                    w={24}
                    h={24}
                    rounded={999}
                    borderWidth={2}
                    borderColor={isSelected ? colorPrimary : "#E5E7EB"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {isSelected && (
                      <Div w={12} h={12} rounded={999} bg={colorPrimary} />
                    )}
                  </Div>
                </TouchableOpacity>
              );
            })}
          </Div>
        </Div>

        {/* Special instructions */}
        <Div mb={28}>
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
            placeholder="Any specific instructions for this service?"
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

      {/* Bottom CTA bar */}
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
        style={{ shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 8 }}
      >
        <Div flexDir="row" alignItems="center" justifyContent="space-between">
          <Div>
            <Text
              fontSize={11}
              fontFamily={fontHauoraMedium}
              color="#6B7280"
              mb={2}
            >
              Estimated total
            </Text>
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraBold}
              color={colorPrimary}
            >
              AED {estimatedTotal.toFixed(0)}
            </Text>
          </Div>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleContinue}
            disabled={!selectedPkg}
          >
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraSemiBold}
              color="#FFFFFF"
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
    </Layout>
  );
};

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
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
  packageCard: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  packageCardSelected: {
    borderColor: colorPrimary,
    backgroundColor: "#EFF6FF",
  },
  addonRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
});

