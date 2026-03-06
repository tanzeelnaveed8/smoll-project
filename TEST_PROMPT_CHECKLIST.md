# prompt.md – Implementation Test Checklist

Yeh checklist prompt.md ke hisaab se implement kiya gaya verify karne ke liye hai.

---

## 1. Vet Dashboard (sf-vetsuite)

| Feature (prompt.md) | Implemented | Kaise test karein |
|---------------------|-------------|-------------------|
| **Finance Tab** – Stats of earning, number of visits | ✅ | `npm run dev` → login as vet → side nav mein **Finance** click → Total Visits, Completed Visits, Total Earnings (AED) dikhne chahiye. |
| **Rejected visits** – Unaccepted = rejected by vet | ✅ (chip: "Rejected") | Inbox mein agar koi consultation status `rejected` ho to us par **Rejected** (red) chip dikhega. |
| Dashboard, Visit details, checklist, notes, photos, Customer not reachable, Log out | ✅ (pehle se) | Existing flows use karke verify karein. |

**Backend:** `GET /vets/finance` (vet auth) → `{ totalVisits, completedVisits, totalEarnings }`

---

## 2. Home Services / Customer App (sf-app-v2)

| Feature (prompt.md) | Implemented | Kaise test karein |
|---------------------|-------------|-------------------|
| **Two tabs** – Services \| Nutritions (Food & Supplies) | ✅ | Home Services screen → **Services** / **Food & Supplies** tabs. |
| **Services listing** – time, starting price | ✅ | Services tab → cards par duration + price. Data API se (auth) ya mock fallback. |
| **Inside Services** – options, add-ons, special notes | ✅ (pehle se) | Service card → Service Details → packages/add-ons → Continue. |
| **All Products** | ✅ | Nutritions tab → **All Products** sub-tab → product grid. Data API se ya mock. |
| **Inside Products** – options, add-ons, notes | ✅ (pehle se) | Product card → Product Details → options → Add to cart. |
| **AI Pick** | ✅ (UI + API stub) | Nutritions tab → **AI Picks** sub-tab. Backend `POST /member/ai/nutrition-recommendations` (ab stub, productIds: []). |
| Promotions/ads between rows | ✅ (pehle se) | Banners between product rows. |

**Backend:**  
- `GET /member/services`, `GET /member/services/:id` (member auth)  
- `GET /member/products`, `GET /member/products/:id` (member auth)  
- `POST /member/ai/nutrition-recommendations` (member auth, stub)

---

## 3. Admin (sf-admin)

| Feature (prompt.md) | Implemented | Kaise test karein |
|---------------------|-------------|-------------------|
| Dashboard, Services tab, Products tab, Visits (list, add note, cancel, invoice, add visit), Customers, Veterinarian, Finance | ✅ (pehle se) | Admin login → har tab open karke flows check karein. |
| Vet login credentials | ✅ (pehle se) | Add vet → temp password email; Reset password for existing vet. |

*(Yeh prompt.md ke scope mein jo humne naya add kiya tha usmein admin changes nahi the.)*

---

## Quick API test (backend running + auth cookie/token)

```bash
# Vet Finance (vet token required)
curl -X GET http://localhost:3000/vets/finance -H "Cookie: sfAccessToken=YOUR_VET_TOKEN"

# Member Services (member token required)
curl -X GET http://localhost:3000/member/services -H "Authorization: Bearer MEMBER_TOKEN"

# Member Products
curl -X GET http://localhost:3000/member/products -H "Authorization: Bearer MEMBER_TOKEN"

# AI recommendations (stub)
curl -X POST http://localhost:3000/member/ai/nutrition-recommendations \
  -H "Authorization: Bearer MEMBER_TOKEN" -H "Content-Type: application/json" \
  -d "{\"species\":\"dog\",\"age\":3}"
# Expected: {"productIds":[]}
```

---

## Run order (manual test ke liye)

1. **Backend:** `cd sf-server-v2` → `npm install` → `.env` set → `npm run start:dev`
2. **Vet app:** `cd sf-vetsuite` → `npm install` → `.env` (VITE_API_URL) → `npm run dev` → browser → vet login → Finance tab
3. **Customer app:** `cd sf-app-v2` → `npm install` → `.env` (API_URL) → `npx expo start` → member login → Home Services → Services / Nutritions + AI Picks
4. **Admin:** `cd sf-admin` → `npm install` → `.env` → `npm run dev`

---

## Verified in code (automated)

- ✅ `GET /vets/finance` in vet.controller.ts + findFinanceStats in vet.service.ts  
- ✅ `GET /member/services` & `/member/services/:id` in service.member.controller.ts  
- ✅ `GET /member/products` & `/member/products/:id` in product.member.controller.ts  
- ✅ `POST /member/ai/nutrition-recommendations` in member.ai.controller.ts  
- ✅ sf-vetsuite: FinanceView, route `/finance`, SideNav "Finance", finance store calling `/vets/finance`  
- ✅ sf-vetsuite: helpers.ts mein REJECTED case, consultation.d.ts mein REJECTED enum  
- ✅ sf-app-v2: useHomeServices, fetchServicesFromApi, fetchProductsFromApi, HomeServicesScreen uses hook, ProductDetailsScreen & ServiceDetailsScreen fetch by id  
