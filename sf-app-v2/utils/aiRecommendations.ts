/**
 * AI nutrition recommendations API layer.
 *
 * When your backend implements this endpoint and wires it to OpenAI (or another model),
 * AI Picks will show model-based recommendations. Until then, the app falls back to
 * mock recommendations.
 *
 * Backend contract (attach your model here):
 *   POST /member/ai/nutrition-recommendations
 *   Body: {
 *     species?: string;   // e.g. "dog" | "cat"
 *     age?: number;       // years
 *     weight?: number;    // kg
 *     preExistingConditions?: string;
 *     petId?: string;     // optional, for future use
 *   }
 *   Response: { productIds: string[] }  // IDs from your product catalog (e.g. "vitamins", "probiotics")
 *
 * The app resolves productIds against the product catalog and shows those in the AI Picks list.
 */
import api from "@/utils/api";
import type { ProductId } from "@/mocks/homeServices";
import { MOCK_PRODUCTS } from "@/mocks/homeServices";

export interface AIRecommendationsRequest {
  species?: string;
  age?: number;
  weight?: number;
  preExistingConditions?: string;
  petId?: string;
}

export interface AIRecommendationsResponse {
  productIds: string[];
}

const ENDPOINT = "/member/ai/nutrition-recommendations";

/**
 * Fetches AI-based nutrition recommendations for the given pet context.
 * On success returns product IDs from the backend (your model output).
 * On 404/error/offline returns null; caller should use fallback list.
 */
export async function fetchNutritionRecommendations(
  payload: AIRecommendationsRequest
): Promise<string[] | null> {
  try {
    const { data } = await api.post<AIRecommendationsResponse>(ENDPOINT, payload);
    if (data?.productIds && Array.isArray(data.productIds)) {
      return data.productIds;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves product IDs to full product summaries from the catalog.
 * Unknown IDs are skipped. If no IDs or all unknown, returns fallback list.
 */
export function resolveProductIdsToSummaries(
  productIds: string[],
  fallback: typeof MOCK_PRODUCTS = MOCK_PRODUCTS
): typeof MOCK_PRODUCTS {
  if (!productIds?.length) return fallback;
  const byId = new Map(fallback.map((p) => [p.id, p]));
  const resolved = productIds
    .map((id) => byId.get(id as ProductId))
    .filter((p): p is (typeof fallback)[number] => p != null);
  return resolved.length > 0 ? resolved : fallback;
}
