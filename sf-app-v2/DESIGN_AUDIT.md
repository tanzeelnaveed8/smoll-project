# Smoll App – Design & Frontend Audit

Designer-oriented overview of the current UI so you can integrate new HTML designs while keeping the same vibe and brand identity.

---

## 1. Brand & visual identity

**Vibe:** Calm, trustworthy, pet-care. Soft background, clear hierarchy, rounded shapes. Not flashy; friendly and professional.

**Primary palette:**
- **Primary blue:** `#679FF0` (CTAs, links, active states, loading)
- **Primary light:** `#518cb0` (theme)
- **Banner blue:** `#6e99f0` (Smoll Care banner on Home – slightly different from primary)
- **Background:** `#FAF8F5` (warm off-white; used for app background and tab bar)
- **Text primary / dark:** `#222` or `#222222` (headings, primary text, active tab, borders)
- **Text secondary / grey:** `#494949` (body, labels, inactive)
- **Muted grey:** `#7B7B7B` (chevrons, secondary UI)
- **Borders / dividers:** `#DEDEDE`, `#E0E0E0`, `#ccc`, `#D0D7DC`
- **Success:** `#2F6E20`, green online dot `#00ff28` / `#17d34a`
- **Error / danger:** `#E02A2A`
- **Disabled:** bg `#FAF8F5`, border `#BDBDBD`, text `#00000059`
- **Input focus border:** `#427594`
- **Card / section bg (e.g. tab active):** `#f1ebe2`

**Typography:**
- **Body / UI:** Hauora (Regular, Medium, SemiBold, Bold) – main app font
- **Headings:** Cooper (Regular, Medium, Bold) – hero headings (e.g. “Hi, {name}”)
- **Scale (responsive):** `scaleFontSize()` from `App.tsx`; base scale by screen width (e.g. 0.72–1). Theme sizes: xs 11 → 8xl 54 (scaled).
- **Weights:** 400 default, 600 for titles, SemiBold/Bold for emphasis.

**Iconography:**
- **Library:** Tabler Icons (`@tabler/icons-react-native`) – outline, 24–32px typical.
- **Stroke:** Often 1.5–2.7 for emphasis.
- **Color:** Usually `#222222` or `#494949`; primary for active/CTAs.

---

## 2. Layout & spacing

**Screen shell:**
- **Layout:** `Layout` wraps content; `paddingHorizontal: 20`, `paddingBottom: 20`, `backgroundColor: "#FAF8F5"`.
- **Header:** Optional back/close + centred title. Title: `fontSize "xl"`, `fontHauoraSemiBold`, `lineHeight 28`. `marginBottom: 20` under header.
- **Container:** Reusable `Container` uses `px={20}`.

**Spacing rhythm:**
- **8 / 12 / 16 / 20 / 24** used heavily (e.g. `mb={8}`, `mb={16}`, `mb={20}`, `gap: 12`, `py={15}`).
- **Sections:** Often `mb={16}`, `mb={20}`, `mb={24}`, `mb={40}`.
- **Inline gaps:** `style={{ gap: 8 }}`, `style={{ gap: 12 }}`, `style={{ gap: 24 }}`.

**Border radius:**
- **Pills / buttons:** `rounded="circle"` or `rounded={25}` / `rounded={30}` (e.g. “Get Started”, tags).
- **Cards / inputs:** `rounded={12}`, `borderRadius: 12`.
- **Modals / banner:** `roundedTop={12}`, `borderRadius: 20`.
- **Chips / tags:** `rounded={32}`, `rounded={40}`.
- **Dots / small UI:** `rounded={4}`, `rounded={8}`.

**Borders:**
- **Default:** `borderWidth={1}`, `borderWidth={1.2}`, `borderWidth={1.5}`; color often `#222` or `#DEDEDE` / `#ccc`.

---

## 3. Core components

**Buttons:**
- **Primary (ButtonPrimary):** Full-width, `py={16}`, `rounded="circle"`. Variants: dark `#222222`, primary (theme blue), danger `#E02A2A`. Text white, `fontSize "xl"`, `fontHauoraMedium`. Optional icon + “Append” icon. Ripple on press.
- **Secondary / outline:** Transparent bg, border `#222`, e.g. “Get Started” on onboarding.
- **Option cards (Home):** Transparent, `borderWidth={1.2}`, `borderColor="#222"`, `rounded={25}`, `h={83}`, row with icon, text, chevron. `underlayColor="#f3f3f3"`.

**Inputs (InputField):**
- **Height:** 56 (single line).
- **Border:** `#222222` default; focus `#427594`; disabled `#BDBDBD`.
- **Radius:** 12.
- **Placeholder / text:** `#494949`, `fontHauora`.
- **Floating label:** 12px when focused/filled, 18px when empty; animation 200–300ms.
- **Padding:** `pl={12}`; with flag `pl={45}`.

**Cards & list items:**
- **DoctorCard:** Row, avatar 100px (or 72 in list), rounded circle; name SemiBold xl `#222`, designation/experience Medium md `#494949`. Optional “I’m Online!” green tag, Verified icon.
- **ChatInboxItem:** Row, avatar 72, gap 24; title, subtitle, chevron; optional unread badge.
- **Home option rows:** Icon ~60–70px, title + description, `IconChevronRight` 24px.

**Modals & sheets:**
- **BottomSheet:** Modal, `h="80%"` or custom, `roundedTop={12}`, `bg="bgColor"` (#FAF8F5). Top bar: `w={44} h={4} rounded={4} bg="#DEDEDE"`. Content `px={20}`. Optional title bar with `borderBottomColor="#DEDEDE"`.
- **ConfirmationModal / popups:** Centred modal; same bg and padding habits.

**Tabs / segmented control:**
- **Inbox:** Two segments in a row, `borderWidth={1} borderColor="#ccc" rounded={12}`; active bg `#f1ebe2`, inactive `#FAF8F5`; text active `#222`, inactive `#ccc`.
- **Experts filter:** Horizontal scroll of pills/chips, `gap: 12`.

---

## 4. Navigation & tab bar

**Bottom tabs (2):** Home, Inbox.
- **Bar:** `height: 62`, `backgroundColor: "#FAF8F5"`, `paddingHorizontal: 48`, `paddingBottom: 8`, `paddingTop: 2`.
- **Label:** `fontSize: 14`, `fontHauoraSemiBold`; active `#222`, inactive `#494949`.
- **Icon:** Tabler (e.g. IconWindow, IconMessage) 28×28; active black, inactive `#494949`.
- **Tab indicator:** Small bar under icon, `h={4}`, `bg="#000"` when focused, `w={60}`, `borderBottomRightRadius: 4`, `borderBottomLeftRadius: 4`. Optional red badge for Inbox.

**Stack screens:** Header hidden by default; back uses BackButton (arrow or X, `#222222`).

---

## 5. Screen-level patterns

**Home:**
- Logo top-left; optional bell (notifications).
- Greeting: Cooper “Hi, {name}” + subtext “How can we help you today?”.
- Smoll Care banner: blue `#6e99f0`, `borderRadius: 20`, “Access your plan” + arrow.
- Section “Other services you can do” with icon + title; list of option cards (Chat, Network, Appointments).

**Lists (experts, appointments, clinics, pets):**
- Layout with title; horizontal filter chips then vertical list (FlatList).
- Cards with avatar/thumbnail, title, subtitle, optional badge/status; tappable row.

**Forms (signup, account setup, add pet):**
- Layout; sections with label + InputField or SelectInput; primary button at bottom. Country/phone with country picker.

**Detail screens (expert, clinic, case, appointment):**
- Layout with back; hero (e.g. DoctorCard or clinic image); sections with headings; lists (e.g. services, time slots); primary CTA.

**Onboarding:**
- Logo + “Get Started” button top.
- Large heading (Cooper/Hauora), then image carousel; dots indicator (active filled `#222`, inactive outline). “Get Started” outline button.

---

## 6. Imagery & assets

**Logo:** `assets/logo.png` (e.g. 100×27, 90×30 in headers).
**Fonts:** Hauora (Regular, Medium, SemiBold, Bold), Cooper (Regular, Medium, Bold) from `assets/fonts/`.
**Images:** Onboarding slides in `assets/images/onboarding-screen/new/`; home icons (e.g. homepage-boy-img, home-clinic, home-start-icon-dark); no-image placeholder; UAE icon.
**Icons:** Mix of Tabler (React Native) and custom SVG (e.g. Smoll Care logo in banner, onboarding icons).

**Placeholders:** Avatar/photo fallback `#eeeeee`; IconUser when no image.

---

## 7. Motion & interaction

- **Ripple:** On primary buttons.
- **Opacity:** `activeOpacity={0.6}` or `0.8` on touchables.
- **Underlay:** `underlayColor="#f3f3f3"` on option cards.
- **Input:** Floating label animation 200–300ms.
- **Modals:** Swipe down to close; backdrop press to close.

---

## 8. Design tokens summary (for integration)

Keep these when mapping HTML → React Native so the app feels consistent:

| Role            | Value        | Usage                    |
|-----------------|-------------|---------------------------|
| Primary         | #679FF0     | CTAs, links, active       |
| Background      | #FAF8F5     | Screen, tab bar           |
| Text primary    | #222 / #222222 | Headings, main text   |
| Text secondary  | #494949     | Body, labels              |
| Border default  | #222 / #DEDEDE / #ccc | Inputs, cards, dividers |
| Success / online| #2F6E20, #00ff28 | Success, online dot   |
| Error           | #E02A2A     | Errors, danger            |
| Font body       | Hauora      | All UI text               |
| Font heading    | Cooper      | Hero headings             |
| Radius small    | 4–8         | Dots, small elements      |
| Radius medium   | 12          | Inputs, modals, cards     |
| Radius large    | 20–40       | Banner, pills, chips      |
| Radius pill     | circle / 25–30 | Buttons, tags          |
| Spacing unit    | 8, 12, 16, 20, 24 | Margins, padding, gaps |
| Horizontal pad  | 20          | Layout, Container          |

---

## 9. Checklist when integrating HTML designs

- Preserve **#FAF8F5** background and **#222** / **#494949** text hierarchy.
- Use **Hauora** for body/UI and **Cooper** for big headings where it fits.
- Keep **#679FF0** for primary actions and **#222** for secondary/outline buttons where appropriate.
- Reuse **rounded 12** for cards/inputs and **circle / 25–30** for pills and main CTAs.
- Keep **horizontal padding 20** and the same spacing rhythm (8–24).
- Match **tab bar** and **Layout** header (back + title) to current look.
- Use **Tabler** icons in the same weights/colors; replace custom SVG only where the new design explicitly changes the icon.
- Keep **BottomSheet** bar and **ButtonPrimary** proportions so new screens don’t feel off.

Once you have the HTML files, we can map each section to these tokens and components and adjust only where you want a deliberate design change.
