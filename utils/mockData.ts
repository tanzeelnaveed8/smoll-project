/**
 * Demo/mock API responses so the app works fully in dev without backend or network.
 * Used when USE_MOCK_API is true (__DEV__). No real requests are sent.
 */

import type { User } from "@/store/types/user";

const emptyFile = { filename: "", filesize: 0, mimetype: "", url: "" };

export const USE_MOCK_API = typeof __DEV__ !== "undefined" && __DEV__;

export const DEV_MOCK_USER: User = {
  id: "dev-mock-user",
  name: "Dev User",
  phone: "+971500000000",
  email: "dev@example.com",
  isEmailVerified: true,
  address: null,
  villa: null,
  city: null,
  country: null,
  postalCode: null,
  timeZone: null,
  petCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  profileImg: emptyFile,
  stripeCustomerId: "",
  playerId: "",
  navNotif: { newQuotation: 0 },
  popups: { emergency: null, quotation: null },
};

function matchUrl(url: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") return url.includes(pattern);
  return pattern.test(url);
}

/**
 * Returns mock response data for the given request, or null if no mock (then real request runs).
 */
export function getMockResponse(
  method: string,
  url: string,
  _data?: unknown,
  _params?: unknown
): unknown {
  const u = url.split("?")[0];

  // User / auth
  if (matchUrl(u, "/members/me") && method === "get") return DEV_MOCK_USER;
  if (matchUrl(u, "/members/me") && (method === "patch" || method === "put")) return DEV_MOCK_USER;
  if (matchUrl(u, "/envs") && method === "get")
    return {
      ONESIGNAL_APP_ID: "demo",
      STRIPE_PUBLISHABLE_KEY: "pk_test_demo",
      ZEGO_APP_ID: "0",
      ZEGO_APP_SIGN: "demo",
      ZEGO_SERVER_SECRET: "demo",
    };
  if (matchUrl(u, "/members/send-email-verification") && method === "post") return undefined;
  if (matchUrl(u, "/members/verify-email") && method === "post") return undefined;
  if (matchUrl(u, "/members/me/clear-popups") && method === "post") return undefined;
  if (matchUrl(u, "/member/auth/login") && method === "post") return undefined;
  if (matchUrl(u, "/member/auth/register") && method === "post") return undefined;
  if (matchUrl(u, "/member/auth/verify-otp") && method === "post")
    return {
      accessToken: "demo-token",
      zegoToken: "demo-zego",
      envs: {
        ONESIGNAL_APP_ID: "demo",
        STRIPE_PUBLISHABLE_KEY: "pk_test_demo",
        ZEGO_APP_ID: "0",
        ZEGO_APP_SIGN: "demo",
        ZEGO_SERVER_SECRET: "demo",
      },
    };
  if (matchUrl(u, "/members/me/deactivate") && method === "post") return undefined;

  // Stripe
  if (matchUrl(u, "/member/stripe/create-payment-session") && method === "post")
    return {
      paymentIntent: "demo",
      paymentIntentClientSecret: "demo",
      ephemeralKey: "demo",
      customer: "demo",
    };

  // Cases
  if (matchUrl(u, "/member/cases") && method === "get")
    return { data: [], meta: { total: 0, page: 1, limit: 1000 } };
  if (matchUrl(u, "/member/cases") && method === "post") return { id: "demo-case-id" };
  if (matchUrl(u, "/member/cases/") && method === "delete") return undefined;
  if (matchUrl(u, "/member/cases/") && method === "get" && u.match(/\/member\/cases\/[^/]+$/))
    return {
      id: "demo-case-id",
      status: "open",
      petId: "demo-pet",
      vetId: "demo-vet",
      description: "",
      quotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  if (matchUrl(u, "/quotes") && !matchUrl(u, "/read"))
    return [{ partner: { id: "demo", name: "Demo Clinic", address: "" }, services: [] }];

  // Breeds (used by cases and pets) - keyed by species for PetProfileBreedScreen
  if (matchUrl(u, "/member/pets/breeds") && method === "get") return { dog: [], cat: [] };

  // Appointments
  if (matchUrl(u, "/members/appointments") && method === "get")
    return { data: [], meta: { total: 0 } };
  if (matchUrl(u, "/members/appointments/") && method === "get")
    return {
      id: "demo-apt",
      scheduledAt: new Date().toISOString(),
      type: "video",
      partner: { id: "", name: "", email: "", phone: "", clinicImg: emptyFile, address: "", city: "", country: "" },
      vet: { id: "", name: "", designation: "", profileImg: emptyFile },
      pet: { name: "" },
      services: [],
      allServices: [],
    };
  if (matchUrl(u, "/member/partners/appointments/") && method === "delete") return undefined;
  if (matchUrl(u, "/member/vets/consultations/") && method === "delete") return undefined;
  if (matchUrl(u, "/reschedule") && method === "post") return undefined;

  // Notifications
  if (matchUrl(u, "/notifications") && method === "get")
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  if (matchUrl(u, "/notifications/read-all") && method === "post") return undefined;

  // Experts / vets
  if (matchUrl(u, "/member/vets") && method === "get" && !u.includes("findByFilter") && !u.includes("consultations") && !u.includes("availabilities") && !u.includes("/member/vets/"))
    return [];
  if (matchUrl(u, "/member/vets/findByFilter") && method === "get") return [];
  if (matchUrl(u, "/specialities") && method === "get") return [];
  if (matchUrl(u, "/member/vets/") && method === "get" && u.match(/\/member\/vets\/[a-f0-9-]+$/))
    return {
      id: "demo-vet",
      name: "Demo Vet",
      phone: "",
      designation: "Vet",
      address: "",
      country: "",
      isOnline: false,
      byAppointmentOnly: true,
      profileImg: emptyFile,
      timezone: "UTC",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  if (matchUrl(u, "/availabilities") && method === "get")
    return [{ id: "1", dayOfWeek: "mon", date: new Date().toISOString().slice(0, 10), intervals: [] }];
  if (matchUrl(u, "/member/vets/consultations/") && method === "get")
    return { id: "demo-consult", status: "initiated" };
  if (matchUrl(u, "/consultations/request") && method === "post") return { id: "demo-consult-id" };
  if (matchUrl(u, "/consultations/schedule") && method === "post") return { id: "demo-consult-id" };
  if (matchUrl(u, "/member/vets/consultations/") && method === "patch") return { id: "demo-consult-id" };
  if (matchUrl(u, "/feedbacks") && method === "post") return { id: "demo-feedback" };

  // Partners
  if (matchUrl(u, "/member/partners/") && method === "get" && u.match(/\/member\/partners\/[^/]+\/vets$/))
    return [];
  if (matchUrl(u, "/member/partners/") && method === "get" && u.match(/\/vets\/[^/]+$/))
    return { id: "demo-vet", name: "Demo Vet", profileImg: emptyFile };
  if (matchUrl(u, "/availabilities") && method === "get")
    return [{ id: "1", dayOfWeek: "mon", date: new Date().toISOString().slice(0, 10), intervals: [] }];
  if (matchUrl(u, "/book") && method === "post") return { id: "demo-booking-id" };
  if (matchUrl(u, "/emergency-book") && method === "post") return { id: "demo-booking-id" };
  if (matchUrl(u, "/member/partners") && method === "get" && !u.match(/\/member\/partners\/[a-f0-9-]+$/))
    return { data: [], meta: { total: 0 } };
  if (matchUrl(u, "/member/partners/") && method === "get" && u.match(/\/member\/partners\/[a-f0-9-]+$/))
    return {
      id: "demo-partner",
      name: "Demo Clinic",
      address: "",
      city: "",
      country: "",
      profileImg: emptyFile,
      clinicImg: emptyFile,
      openingHours: JSON.stringify({ from: "09:00", to: "18:00" }),
      specialities: [],
      vets: [],
    };

  // Pets
  if (matchUrl(u, "/member/pets") && method === "get" && !u.match(/\/member\/pets\/[a-f0-9-]+$/))
    return [];
  if (matchUrl(u, "/member/pets/breeds") && method === "get") return [];
  if (matchUrl(u, "/member/pets") && method === "post")
    return {
      id: "demo-pet-id",
      name: "Demo Pet",
      species: "dog",
      breed: "",
      gender: "male",
      dob: new Date().toISOString(),
      chipNumber: "",
      photos: [],
      healthHistory: [],
      preExistingConditions: "",
      age: 0,
      spayedOrNeutered: false,
    };
  if (matchUrl(u, "/member/pets/") && method === "get")
    return {
      id: "demo-pet-id",
      name: "Demo Pet",
      species: "dog",
      breed: "",
      gender: "male",
      dob: new Date().toISOString(),
      chipNumber: "",
      photos: [],
      healthHistory: [],
      preExistingConditions: "",
      age: 0,
      spayedOrNeutered: false,
    };
  if (matchUrl(u, "/member/pets/") && method === "patch")
    return {
      id: "demo-pet-id",
      name: "Demo Pet",
      species: "dog",
      breed: "",
      gender: "male",
      dob: new Date().toISOString(),
      chipNumber: "",
      photos: [],
      healthHistory: [],
      preExistingConditions: "",
      age: 0,
      spayedOrNeutered: false,
    };
  if (matchUrl(u, "/health-history") && method === "post")
    return { id: "demo-health-id", note: "", createdAt: new Date().toISOString() };
  if (matchUrl(u, "/health-history/") && (method === "patch" || method === "delete")) return undefined;
  if (matchUrl(u, "/member/pets/") && method === "delete") return undefined;
  if (matchUrl(u, "smollcare/benefits") && method === "get")
    return { benefits: [], subscriptionDetails: null, price: 0 };
  if (matchUrl(u, "smollcare/subscribe") && method === "post") return {};
  if (matchUrl(u, "smollcare/activate") && method === "post") return undefined;
  if (matchUrl(u, "smollcare/cancel") && method === "delete") return undefined;
  if (matchUrl(u, "smollcare/coupon/verify") && method === "post") return { valid: true };

  // Counsellors (sessions is array directly)
  if (matchUrl(u, "/member/counsellors/sessions") && method === "get") return [];
  if (matchUrl(u, "/member/counsellors/request-session") && method === "post") return { id: "demo-session" };

  // Case quotes read
  if (matchUrl(u, "/quotes/") && matchUrl(u, "/read") && method === "patch") return undefined;

  // Files
  if (matchUrl(u, "/files") && method === "post")
    return { id: "demo-file", url: "", filename: "", filesize: 0, mimetype: "" };

  return null;
}
