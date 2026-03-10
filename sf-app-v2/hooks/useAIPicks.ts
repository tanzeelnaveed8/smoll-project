import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductSummary } from "@/mocks/homeServices";
import { usePetStore } from "@/store/modules/pet";
import {
  fetchNutritionRecommendations,
  resolveProductIdsToSummaries,
} from "@/utils/aiRecommendations";
import { fetchProductsFromApi } from "@/utils/homeServicesApi";

export interface UseAIPicksResult {
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches AI-based nutrition picks from backend. Uses first pet's details for context.
 * Product catalog comes from API; no mock fallback.
 */
export function useAIPicks(): UseAIPicksResult {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catalog = await fetchProductsFromApi();

      const { pets, petsDetailMap, fetchPets, fetchPetDetails } =
        usePetStore.getState();

      let petDetails = null;
      const petsList = pets?.length ? pets : await fetchPets().catch(() => []);

      if (petsList?.length) {
        const firstPet = petsList[0];
        petDetails = petsDetailMap.get(firstPet.id) ?? null;
        if (!petDetails && firstPet.id) {
          try {
            petDetails = await fetchPetDetails(firstPet.id);
          } catch {
            // ignore - will send empty payload
          }
        }
      }

      const healthRecords = petDetails?.healthHistory?.length
        ? petDetails.healthHistory.map((h) => ({
            name: h.name,
            description: h.description,
            date: h.date,
          }))
        : undefined;

      const payload = petDetails
        ? {
            species: petDetails.species,
            breed: petDetails.breed,
            age: petDetails.age,
            weight: petDetails.weight,
            preExistingConditions: petDetails.preExistingConditions || undefined,
            petId: petDetails.id,
            healthRecords,
          }
        : {};

      const productIds = await fetchNutritionRecommendations(payload);
      const resolved = resolveProductIdsToSummaries(productIds ?? [], catalog);
      setProducts(resolved);
    } catch (e) {
      console.error("[useAIPicks] Error:", e);
      setError("Could not load recommendations");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    load();
  }, [load]);

  return { products, loading, error, refetch: load };
}
