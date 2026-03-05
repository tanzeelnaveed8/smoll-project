import { useCallback, useEffect, useState } from "react";
import { MOCK_PRODUCTS } from "@/mocks/homeServices";
import type { ProductSummary } from "@/mocks/homeServices";
import { usePetStore } from "@/store/modules/pet";
import {
  fetchNutritionRecommendations,
  resolveProductIdsToSummaries,
} from "@/utils/aiRecommendations";

export interface UseAIPicksResult {
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches AI-based nutrition picks for the user's pet(s).
 * Uses first available pet's details (species, age, weight, preExistingConditions).
 * When backend endpoint is implemented (e.g. with OpenAI), returns real recommendations;
 * otherwise falls back to mock list.
 */
export function useAIPicks(): UseAIPicksResult {
  const pets = usePetStore((s) => s.pets);
  const petsDetailMap = usePetStore((s) => s.petsDetailMap);
  const fetchPets = usePetStore((s) => s.fetchPets);
  const fetchPetDetails = usePetStore((s) => s.fetchPetDetails);

  const [products, setProducts] = useState<ProductSummary[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let petDetails = null;
      if (pets?.length) {
        const firstPet = pets[0];
        petDetails = petsDetailMap.get(firstPet.id) ?? null;
        if (!petDetails && firstPet.id) {
          try {
            petDetails = await fetchPetDetails(firstPet.id);
          } catch {
            // ignore
          }
        }
      } else {
        try {
          const list = await fetchPets();
          if (list?.length && list[0].id) {
            petDetails = await fetchPetDetails(list[0].id);
          }
        } catch {
          // no pets, use fallback
        }
      }

      const payload = petDetails
        ? {
            species: petDetails.species,
            age: petDetails.age,
            weight: petDetails.weight,
            preExistingConditions: petDetails.preExistingConditions || undefined,
            petId: petDetails.id,
          }
        : {};

      const productIds = await fetchNutritionRecommendations(payload);
      const resolved = resolveProductIdsToSummaries(
        productIds ?? [],
        MOCK_PRODUCTS
      );
      setProducts(resolved);
    } catch (e) {
      setError("Could not load recommendations");
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [pets, petsDetailMap, fetchPets, fetchPetDetails]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refetch: load };
}
