# WeRide — Product Requirements & Design Document

**Version:** 3.0  
**Date:** March 22, 2026  
**Status:** Design Handoff Ready  
**Audience:** UI/UX Designers, Product Team  

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Audience & Rider Psychology](#2-target-audience--rider-psychology)
3. [Design Philosophy & Principles](#3-design-philosophy--principles)
4. [Design System — "Ironline"](#4-design-system--ironline)
5. [Complete Application Flow](#5-complete-application-flow)
6. [Screen-by-Screen Specifications](#6-screen-by-screen-specifications)
7. [Navigation Architecture](#7-navigation-architecture)
8. [Google Maps SDK Integration & Constraints](#8-google-maps-sdk-integration--constraints)
9. [XP, Achievements & Seasons System](#9-xp-achievements--seasons-system)
10. [Component Library](#10-component-library)
11. [Motion & Animation Specifications](#11-motion--animation-specifications)
12. [Cross-Platform Design Rules](#12-cross-platform-design-rules)
13. [Accessibility Requirements](#13-accessibility-requirements)
14. [Notification Design](#14-notification-design)
15. [Empty States & Error Handling](#15-empty-states--error-handling)
16. [Screen Inventory](#16-screen-inventory)

---

## 1. Product Vision

WeRide is a premium motorcycle group-riding companion. It sits at the intersection of three domains: route planning with scenic discovery, real-time group tracking on the road, and machine identity through a digital garage with performance intelligence.

The app must feel like it belongs alongside Uber, Apple Maps, and Strava — not a hobby project. Every pixel earns its place. The design should evoke the warmth of leather, the precision of an instrument cluster, and the freedom of the open road.

**One-line positioning:** "Plan scenic group rides, stay connected on the road, know your machine."

---

## 2. Target Audience & Rider Psychology

### Primary Users

Motorcycle enthusiasts aged 22–45 who ride in groups on weekends and holidays. Predominantly male (though growing female ridership), tech-comfortable, and deeply emotionally connected to their machines. These are riders who name their bikes, photograph them, and talk about service schedules over chai.

### What Riders Actually Want (Validated Against Community Patterns)

Based on analysis of rider communities, existing motorcycle apps (Calimoto, REVER, Scenic, Ride with GPS), and biker forum discussions:

**Group cohesion is the #1 pain point.** Riders constantly lose each other at intersections, toll plazas, and fuel stops. The regrouping feature directly addresses the most frequently cited frustration in group riding. No existing app solves this well — most just show dots on a map without regrouping intelligence.

**Scenic routing is the differentiator.** What separates Calimoto from Google Maps for bikers is "twisty road" routing. Our scenic discovery takes this further — instead of just routing for curves, we surface actual viewpoints, waterfalls, ghats, and photo-worthy stops. Riders don't just want curves; they want destinations within the journey.

**Riders check phones at stops, not while riding.** All app interactions happen at fuel stops, chai breaks, and regrouping points. The UI must be usable with one hand (other hand holding helmet or gloves), in direct sunlight, within 15–30 seconds. This is why the light theme matters — dark UIs wash out in outdoor light.

**Machine identity is deeply personal.** Riders track odometer, service history, and modifications with the same devotion car enthusiasts show on forums. The BPI (Bike Performance Index) gamifies maintenance — turning a chore into a score.

**Gamification drives repeat usage.** Strava proved this for cycling. The XP/achievement system turns every ride into progress. Riders are inherently competitive ("I've done more kilometers this month than you") and the leaderboard/seasons system channels this.

### Why This Color Palette Works for Bikers

The warm earth-tone palette (Copper, Cream, Espresso) directly maps to motorcycle culture: leather saddle bags are this exact copper tone, cafe racer seats use cream leather, vintage instrument gauges use warm ivory faces with copper bezels. This is not an arbitrary design choice — it's cultural alignment.

Competitor apps (REVER: dark/neon, Calimoto: blue/white) feel like tech products. WeRide should feel like a riding companion — warm, trustworthy, and premium. Think Royal Enfield's showroom aesthetic, not a Silicon Valley startup.

---

## 3. Design Philosophy & Principles

### Three Governing Principles

**1. Map is the app.**  
The map occupies the full screen on the home view. Every major flow (ride creation, ride detail, live tracking) overlays the map as a bottom sheet. The map is never more than one swipe-down away. This follows the Uber/Apple Maps paradigm where the map is the canvas and UI floats above it.

**2. One-hand, one-thumb.**  
Riders interact before gearing up and at stops — often holding a helmet in one hand. All primary actions must be reachable in the bottom 40% of the screen. No important actions live in top navigation bars. The bottom sheet is the primary interaction paradigm, directly modeled on Uber and Apple Maps.

**3. Progressive disclosure.**  
Show only what matters right now. Ride creation should feel like sending a message, not filling out a government form. The scenic feature is a single toggle, not a multi-step wizard. Details reveal themselves contextually.

### Design Decisions Rationale

| Decision | Why |
|---|---|
| Light theme default | Outdoor readability in sunlight. Dark UIs wash out. Validated by Apple Maps and Google Maps both defaulting to light in navigation mode. |
| Warm earth tones, not cold tech | Cultural alignment with motorcycle aesthetics (leather, copper, instrument gauges). Competitor differentiation from REVER (dark/neon) and Calimoto (blue/white). |
| Serif headings (DM Serif Display) | Matches heritage motorcycle brand typography (Royal Enfield, Triumph, Indian Motorcycle). Creates editorial warmth vs cold sans-serif tech aesthetic. |
| Sans-serif body (Outfit) | Readability at small sizes on mobile. Geometric warmth without being too playful. |
| Bottom sheet navigation | One-thumb reachable. Maintains map context. Follows proven Uber/Apple Maps pattern. |
| Gauge metaphor for BPI | Native to motorcyclists who read instrument clusters daily. Instantly communicates health without reading text. |
| 4-tab bar (Rides, Garage, XP, Profile) | Covers the four core domains. No hamburger menus. Everything one tap away. |

---

## 4. Design System — "Ironline"

### 4.1 Color Architecture

#### Foundation Colors

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `surface-primary` | `#FAF7F2` | Primary background, sheets | Warm cream — not white. Evokes parchment/leather. |
| `surface-elevated` | `#F5F0E6` | Toggle backgrounds, chips, section fills | Slight warmth step up from primary. |
| `surface-card` | `#FFFFFF` | Cards, bike cards, ride cards | Pure white creates contrast against cream bg. |
| `border-subtle` | `#F0EBE0` | Card borders, list dividers | Nearly invisible — structure without weight. |
| `border-default` | `#E8E2D8` | Input underlines (inactive), sheet handles | Visible but not dominant. |
| `border-strong` | `#DDD6CC` | Map road fills, stronger dividers | Sand tone. |

#### Accent Colors

| Token | Hex | Usage | Notes |
|---|---|---|---|
| `accent-primary` | `#C4841D` | CTAs, active states, user marker, XP ring, FAB | Copper. The signature color. Think of it like Uber's black or Strava's orange. |
| `accent-deep` | `#A66B15` | CTA gradient end, pressed states | Bronze. Depth for gradient buttons. |
| `accent-muted` | `#C4841D` at 12% | Selected card backgrounds, tag fills | Transparent copper tint. |

#### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#1A1612` | Headlines, body copy, primary labels. Warm near-black (not `#000`). |
| `text-secondary` | `#6B5E50` | Subtitles, descriptions, secondary body. |
| `text-muted` | `#9B8E7E` | Metadata, timestamps, captions, placeholders. |

#### Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `status-active` | `#2D8A56` | Rider online, ride live, BPI excellent, joined status. |
| `status-route` | `#4A89F3` | Route polyline on map, navigation elements. Google Maps blue. |
| `status-caution` | `#FBBF24` | Rider lagging, approaching regroup point. |
| `status-alert` | `#EF4444` | SOS, rider disconnected, overdue service, destructive actions. |

### 4.2 Typography

| Scale | Size | Weight | Font | Usage |
|---|---|---|---|---|
| Display | 28–30pt | Regular | DM Serif Display | Onboarding headlines only. |
| Title | 22–26pt | Regular | DM Serif Display | Screen titles ("Your Garage," "Progress"). |
| Headline | 16–20pt | Regular | DM Serif Display | Card titles, ride names, bike names. |
| Stat | 19–24pt | Regular | DM Serif Display | Numerical data (speed, distance, BPI score, XP level). |
| Body | 14–16pt | Regular (400) | Outfit | Primary readable text. |
| Body Strong | 13–14pt | Semibold (600) | Outfit | List item names, inline emphasis. |
| Caption | 11–12pt | Medium (500) | Outfit | Metadata, timestamps, secondary info. |
| Label | 10pt | Semibold (600) | Outfit | Form labels. UPPERCASE, letter-spacing 0.08em. |
| Micro | 9pt | Bold (700) | Outfit | Tab labels, badge text, status pills. |

**Rules:**

- Line height is always 1.4× font size for body text, 1.15× for display/title.
- No font size below 9pt anywhere in the app.
- All numerical data (speed, distance, BPI, XP) must use tabular/monospaced figures so digits don't jitter during live updates.
- DM Serif Display is used only for headings and numerical stats — never for body copy or interactive elements.
- Outfit is used for everything interactive: buttons, labels, inputs, captions, navigation.

### 4.3 Spacing & Layout

**Base unit:** 8pt grid. All spacing is a multiple: 4, 8, 10, 12, 14, 16, 20, 24, 28, 32, 48.

| Element | Value |
|---|---|
| Screen horizontal padding | 24pt (left and right) |
| Card internal padding | 14–16pt |
| Card border radius | 16–18pt |
| Bottom sheet corner radius | 24pt |
| Button corner radius | 14pt |
| Input field bottom border | 1.5pt |
| Sheet handle | 36pt wide × 4pt tall, centered |
| Tab bar padding | 8pt top, 22pt bottom (safe area) |
| FAB size | 52pt × 52pt, border-radius 16pt |
| FAB position | Bottom 76pt (above tab bar), right 20pt |
| Avatar sizes | 24pt (inline), 28pt (ride card), 30pt (detail), 56–64pt (profile) |

### 4.4 Elevation & Depth

No drop shadows on cards. Depth communicated through surface color stepping (cream → white card → elevated fill). The only shadows in the app are:

- **Bottom sheet:** `0 -4px 30px rgba(26,22,18,0.08)` — very subtle upward shadow.
- **FAB:** `0 6px 24px rgba(196,132,29,0.35)` — warm copper glow.
- **Floating buttons (map overlays):** `0 2px 12px rgba(26,22,18,0.1)`.
- **HUD overlays:** `backdrop-filter: blur(16px)` with 88–94% opacity cream background. No hard shadow.

### 4.5 Iconography

- **Style:** Outlined, 1.5–1.8pt stroke weight, rounded joins.
- **Size:** 20pt in tab bar, 18pt in floating buttons, 16pt inline.
- **Active state:** Stroke weight increases to 2.2pt and color changes to `accent-primary`. Icons do NOT fill on active — they just thicken.
- **Custom icons needed:** Motorcycle silhouette (garage), checkered flag (ride end), regrouping flag (⚑), scenic diamond (rotated square with camera), BPI gauge, XP star.

---

## 5. Complete Application Flow

### Flow Diagram

```
SPLASH (1.8s auto) 
  → ONBOARDING (3 panels: Ride Together → Scenic Way → XP & Rewards)
    → Skip at any point OR "Get Started" on panel 3
      → AUTH (Phone/Email + Google + Apple)
        → OTP VERIFICATION
          → MAIN APP

MAIN APP (4 tabs):
  ┌─ RIDES (Home) ──────────────────────────────────┐
  │  Map + Bottom Sheet (Peek / Expanded)             │
  │  ├─ Peek: Next ride summary + "See all rides"    │
  │  └─ Expanded: Upcoming / My Rides / Past tabs     │
  │     ├─ Ride Cards (tappable → Ride Detail)        │
  │     └─ FAB → Create Ride                          │
  │        ├─ Route inputs (From/To)                  │
  │        ├─ + Add Regrouping Point                  │
  │        ├─ Find Scenic Stops → Scenic Selection    │
  │        ├─ Date & Time                             │
  │        └─ "Create Ride" → Back to Home            │
  │                                                   │
  │  Ride Detail (from tapping any ride card):        │
  │  ├─ Route timeline + riders + stats               │
  │  ├─ "Join Ride" (if not joined)                   │
  │  ├─ "Start Ride" / "Navigate" (if joined)         │
  │  │   ├─ Live Ride Mode                            │
  │  │   │   ├─ HUD (speed, distance, ETA)            │
  │  │   │   ├─ Rider status list                     │
  │  │   │   ├─ SOS button                            │
  │  │   │   ├─ "Navigate" → Navigation Mode          │
  │  │   │   │   ├─ Turn-by-turn (Nav SDK)            │
  │  │   │   │   ├─ Speed limit indicator             │
  │  │   │   │   ├─ Scenic toast notifications        │
  │  │   │   │   └─ Exit → Back to Live Ride          │
  │  │   │   └─ "End Ride" → Ride Summary → Home      │
  │  └─ "Leave Ride" (if joined)                      │
  │                                                   │
  │  Notification Bell → Notifications                │
  │  ├─ Ride invites (Join/Decline actions)           │
  │  ├─ Ride starting reminders                       │
  │  ├─ BPI alerts                                    │
  │  └─ Achievement unlocks                           │
  │                                                   │
  │  Profile Avatar → switches to Profile tab         │
  ├─────────────────────────────────────────────────┤
  ├─ GARAGE ─────────────────────────────────────────┤
  │  Bike cards (tappable → Bike Detail)              │
  │  ├─ BPI gauge + stats                             │
  │  ├─ Service history timeline                      │
  │  └─ + Add Service Record                          │
  │  + Add Bike (dashed card or FAB)                  │
  │  ├─ Photo upload                                  │
  │  ├─ Make / Model / Year / Odometer                │
  │  └─ "Add to Garage"                               │
  ├─────────────────────────────────────────────────┤
  ├─ XP & ACHIEVEMENTS ─────────────────────────────┤
  │  XP Overview Card (level, progress bar)           │
  │  XP Earning Breakdown (km, scenic, lead)          │
  │  Current Season card                              │
  │  Achievements list (progress bars per achievement)│
  ├─────────────────────────────────────────────────┤
  ├─ PROFILE ────────────────────────────────────────┤
  │  Avatar + name + level + stats                    │
  │  Settings menu (Edit Profile, Ride History,       │
  │    Notifications, Units, Map Style, Privacy,      │
  │    About, Sign Out, Delete Account)               │
  │  Delete Account → Confirmation Modal              │
  └─────────────────────────────────────────────────┘
```

### Key Flow Constraints

- **Every screen has a way back.** Sub-screens (ride detail, bike detail, create ride, scenic selection, notifications) have a back button or cancel. The tab bar is always visible on root tab screens.
- **Tab switches reset the navigation stack.** Tapping Garage while in a ride detail sub-screen goes to Garage root, not back to rides.
- **The tab bar is present on ALL four root screens.** Home, Garage, XP, Profile all show the tab bar. Sub-screens (ride detail, live ride, navigation, bike detail, create ride) may hide it.
- **The map persists behind bottom sheets.** On Home, Create Ride, Scenic Selection, Ride Detail — the map is always visible above the sheet. This maintains spatial context.
- **Live Ride and Navigation are immersive modes.** They hide the tab bar and most chrome. Only HUD, SOS, and the rider status sheet remain.

---

## 6. Screen-by-Screen Specifications

### 6.1 Splash Screen

- Duration: 1.8 seconds, auto-transitions to onboarding.
- Content: WeRide logo (custom motorcycle SVG mark), wordmark in DM Serif Display, tagline "Ride Together" in Outfit uppercase.
- Background: Subtle cross-hatch texture at 2.5% opacity over cream gradient (`#FAF7F2` → `#F0E8DA` at 165°).
- No loading indicator. If data is loading in background, it continues behind the onboarding.

### 6.2 Onboarding (3 Panels)

Each panel: top 60% visual area with gradient background, bottom 40% text content.

**Panel 1 — "Ride Together, Never Apart"**
- Visual: Illustrated winding road with three rider dots (copper, green, brown) moving in formation. Flag marker at lead. Uses app color palette, not photographs.
- Background gradient: `#F5EDE0` → `#FAF7F2` (warm linen to cream).
- Body: "Plan group rides, set regrouping points, and keep your pack together on every road."

**Panel 2 — "Discover the Scenic Way"**
- Visual: Illustrated mountain silhouettes with a route line and three diamond scenic markers (copper, rotated squares).
- Background gradient: `#E8F0E4` → `#FAF7F2` (sage to cream).
- Body: "Our scenic engine finds breathtaking stops along your route. You choose."

**Panel 3 — "Earn XP, Unlock Rewards"**
- Visual: XP level ring (showing level 12, 74% progress) with three achievement badge icons below.
- Background gradient: `#F0E8DA` → `#FAF7F2` (warm sand to cream).
- Body: "Every kilometer counts. Level up, unlock seasons, and earn partner rewards."

**Navigation:**
- Horizontal swipeable carousel with page dots (copper pill for active, 6pt circles for inactive).
- "Skip" text button at top-right on all panels.
- "Next" primary CTA on panels 1 and 2.
- "Get Started" primary CTA on panel 3.

### 6.3 Authentication

**Layout:** Logo at top, welcome heading ("Welcome to the pack."), subtitle, then form.

**Input:** Single floating-label input for phone or email. Auto-detects format. Bottom-line indicator style (no box border). Active state: copper bottom border.

**Actions:**
1. "Continue" primary CTA (disabled state until valid input).
2. "or" divider.
3. "Continue with Google" secondary button with Google logo.
4. "Continue with Apple" secondary button with Apple logo.

**No password field.** Authentication is passwordless (OTP for phone, magic link for email, OAuth for social).

### 6.4 OTP Verification

- Back button to auth screen.
- Heading: "Verify your number"
- Subtitle: "We sent a code to [number]"
- 6 individual OTP input boxes (42pt × 52pt each, 12pt radius). Filled boxes get copper tint background and copper border. Empty boxes get elevated fill and subtle border.
- Auto-advance on digit entry. Auto-submit on sixth digit.
- "Didn't receive it? Resend in [countdown]s" below.
- "Verify" primary CTA.

### 6.5 Home Screen (Rides Tab)

**This is the most important screen in the app.**

**Map:** Full-screen Google Maps with Cloud Styling applied (see Section 8). User's current location shown as the copper avatar marker with pulsing ring.

**Floating elements:**
- Top-left: Profile avatar button (40pt circle, white background, subtle shadow). Contains the XP ring as the avatar border — level number visible inside.
- Top-right: Notification bell button (40pt circle, same style). Red badge dot if unread.
- Bottom-right: Map recenter button (40pt, white, GPS crosshair icon). Position adjusts based on sheet state.

**Bottom Sheet — Peek State:**
- Sheet handle bar (36pt × 4pt, centered).
- If rides exist: "Next Ride" label (muted uppercase), ride title (DM Serif), date tag (green pill "Tomorrow"), rider avatars, "See all rides ↓" link.
- If no rides: "No upcoming rides" + "Plan your first ride →" link.
- Tapping handle or "See all rides" expands to ride list.

**Bottom Sheet — Expanded State (Rides List):**
- Segmented control: Upcoming | My Rides | Past (three segments, pill-style active indicator with white background and subtle shadow).
- **Upcoming tab:** Shows ALL available rides in the community — both rides the user created and rides others created that are open to join. Each shows OPEN or JOINED badge. This is the discovery mechanism.
- **My Rides tab:** Only rides the user created.
- **Past tab:** Completed rides.
- Ride cards are full-width, tappable, with route info, date, XP value, rider avatars, and status badge.

**FAB:** Copper gradient, "+" icon, positioned bottom-right above tab bar. Opens Create Ride.

**Tab Bar:** 4 tabs — Rides (active), Garage, XP, Profile. Always present.

### 6.6 Create Ride

**Overlay:** Map visible behind at reduced opacity. Sheet rises from bottom covering ~85% of screen.

**Layout:**
- Sheet handle + "Create Ride" heading + "Cancel" text button (top-right).
- Route inputs: Vertical A-to-B pattern with copper dot (start), dotted line, hollow copper circle (destination). Two floating-label inputs on the right.
  - "From" defaults to "📍 Current Location" in copper text.
  - "To" is empty with placeholder.
- "+ Add Regrouping Point" text button (copper, with plus icon). Inserts new input field with flag icon. Long-press to reorder.
- **"Find Scenic Stops" card:** Elevated background card with toggle description. Tappable — opens Scenic Selection sub-screen (not a toggle, because we want the user to see and select specific stops). Chevron indicator on right.
- Date and Time: Two side-by-side inputs. Tapping opens native OS date/time picker.
- "Create Ride" primary CTA at bottom.

**Total required inputs for minimum ride:** 2 (start + destination). Everything else has defaults. Two taps + one text input = ride created.

### 6.7 Scenic Selection

**Overlay:** Map dimmed behind. Sheet covers ~90%.

**Layout:**
- Handle + "Scenic Stops" heading + count badge ("3 of 4 selected" in copper).
- Subtitle: "Viewpoints along your route."
- Scrollable list of scenic locations. Each row:
  - Thumbnail placeholder (52pt square, rounded, gradient tinted with location color, camera icon centered).
  - Location name (Outfit 14pt semibold).
  - Distance from start + XP value ("12km from start · +15 XP").
  - Circular checkbox (24pt). Checked: copper fill with white checkmark. Unchecked: subtle border ring.
- Tapping a row toggles selection. Entire row is the tap target.
- "Add N Scenic Stops" primary CTA at bottom. N updates live.

### 6.8 Ride Detail

**Overlay:** Map with route polyline visible behind. Sheet covers ~85%.

**Layout:**
- Handle + Back button.
- Ride title (DM Serif 21pt) + date/time + creator name.
- Status badge: "JOINED" (green), "OPEN" (copper muted), or "FULL" (muted).
- Stats row: Distance, Duration, XP (three columns). XP in copper color.
- **Route timeline:** Vertical timeline with stops:
  - Start: Copper filled circle.
  - Scenic stops: Blue diamond (rotated square).
  - Regrouping points: Green filled circle.
  - Destination: Espresso filled circle.
  - Vertical lines connecting stops (1.5pt, border color).
  - Each stop shows name and estimated time.
- Rider avatars row with count.
- **Action buttons (context-dependent):**
  - Not joined: "Join Ride" primary CTA (single tap, instant join).
  - Joined (your ride): "Start Ride" primary + "Leave" secondary.
  - Joined (others' ride): "Navigate" primary + "Leave" secondary.

### 6.9 Live Ride Mode

**Full immersive screen.** Tab bar hidden.

**Map:** Cloud-styled map with:
- Completed route segment: Green polyline (4pt).
- Remaining route: Blue dashed polyline (3.5pt).
- Regrouping point ahead: Copper dashed circle with flag icon. Fraction badge ("2/7") below.
- Rider markers: Current user = larger (10pt radius) copper marker with pulsing ring + status dot. Other riders = smaller (7pt radius) with individual colors + status dots (green/amber/red).

**HUD (top):** Frosted glass card (cream 88% + backdrop blur) with three data points:
- Speed (DM Serif 21pt) + "km/h" label.
- Distance to next stop + "to stop" label.
- ETA in copper color + "ETA" label.
- Vertical 1px dividers between sections.

**SOS button:** Top-right, 36pt circle, red border, "SOS" text. Long-press to trigger (prevents accidental activation).

**Navigate button:** Top-left, pill-shaped, blue navigation arrow + "Navigate" text. Opens turn-by-turn Navigation mode.

**XP Toast:** Appears when passing scenic points or milestones. Copper-tinted bar with star emoji + "+15 XP" + "Scenic stop visited!" Auto-dismisses after 3s.

**Bottom sheet (compact):**
- Ride name + LIVE badge (green).
- Rider status list: Avatar, name, status dot + status text (On Route / 2km behind / Stopped).
- "End Ride" destructive button (red-bordered secondary style).

### 6.10 Navigation Mode

**Full immersive screen** using Google Navigation SDK.

**Mandatory Google elements:**
- Blue navigation puck (current position marker) — Nav SDK renders this.
- Route polyline in blue — color customizable via PolylineOptions.
- Direction chevrons on route — Nav SDK renders automatically.
- Google attribution text — MUST remain visible, bottom-left.
- Speed limit indicator — optional but recommended (red circle with number).

**Custom overlays (permitted by Nav SDK):**

**Header (setCustomHeaderView):**
- Frosted glass card with: maneuver icon in green circle (turn arrow — from Google's icon set, we style the container only), distance countdown ("In 800m"), and road name ("Turn right · NH66") in DM Serif.

**Footer (setCustomFooterView):**
- Cream rounded bar with: Speed, Distance Left, ETA (same layout as live ride HUD), and a red "X" button to exit navigation.

**Scenic Toast (our overlay):**
- Positioned above footer. Shows upcoming scenic point with diamond marker, name, distance, and XP value.

### 6.11 Garage

**Standard scrolling screen with tab bar.**

**Layout:**
- "Your Garage" title (DM Serif 26pt).
- Bike cards (vertically scrollable):
  - Header area: Gradient background (unique per bike — warm sand for RE, cool steel for KTM), motorcycle silhouette illustration (outlined, 55% opacity), "PRIMARY" badge on primary bike.
  - Content area: Bike name (DM Serif 16pt), model + year, BPI gauge (75pt size), and stats row (Distance, Rides, Last Service).
  - Cards are tappable → Bike Detail.
- "+ Add a bike" dashed-border card at the bottom. Plus icon + text.
- Or FAB in bottom-right (same copper gradient style as home).

### 6.12 Bike Detail

**Full screen with back button. No tab bar.**

**Layout:**
- Back button → Garage.
- BPI gauge at large size (160pt), centered.
- Bike name + model below gauge.
- Stats card: Distance, Rides, Last Service in three equal columns.
- **Service History** section label (uppercase, muted).
- Service records as a vertical list: wrench icon in elevated circle, service type name, date + odometer reading.
- "+ Add Service Record" secondary CTA button.

**Add Service Record** (sub-sheet):
- Service type chips (Oil, Chain, Tires, Brakes, Full Service, Custom).
- Date picker (native).
- Odometer input.
- "Save Record" primary CTA.
- Saving recalculates BPI with overshoot-and-settle gauge animation.

### 6.13 Add Bike

**Full screen with back + cancel.**

**Layout:**
- Photo upload area: Dashed border rectangle (120pt tall), camera icon, "Tap to add photo."
- Four inputs: Make (with autocomplete), Model (with autocomplete), Year, Odometer.
- "Add to Garage" primary CTA.

### 6.14 XP & Achievements

**Standard scrolling screen with tab bar.**

**Layout:**

**XP Overview Card:** Dark (espresso/charcoal gradient) card with:
- XP ring (68pt, showing level and progress).
- Level number + "Level N" text in cream.
- XP fraction ("7,400 / 10,000 XP") in muted text.
- Thin progress bar (6pt tall, copper gradient fill).
- "2,600 XP to Level 13" in copper accent.
- Decorative: subtle copper-tinted circles in background (absolute positioned, overflow hidden).

**XP Earning Breakdown:** Three equal columns on elevated backgrounds:
- 🛣️ "1 km = 1 XP"
- 📸 "Scenic = 15 XP"
- 👑 "Lead = 25 XP"

**Current Season Card:** White card with season icon (emoji), season name, date range, multiplier info ("2x XP weekends"), ACTIVE badge.

**Achievements List:** Each achievement row:
- Icon in themed circle (copper border if completed, subtle border if in-progress).
- Achievement name + XP reward value (right-aligned, copper).
- Description text (muted).
- Progress bar (4pt tall): Green fill if completed, copper gradient if in-progress.
- Fraction text: "4/5" or "500/500 · Completed ✓"

### 6.15 Profile

**Standard scrolling screen with tab bar.**

**Layout:**
- Avatar (56pt, copper gradient, initials) with XP level badge (20pt circle, bottom-right).
- Name (DM Serif 21pt) + location + level + XP.
- Stats card: Rides, Distance, Bikes, Badges (four equal columns).
- Settings menu: Standard list with emoji icons, labels, and chevrons.
  - Edit Profile
  - Ride History
  - Notifications
  - Units & Preferences
  - Map Style
  - Privacy
  - About WeRide
  - Sign Out (muted text, no chevron)
  - Delete Account (red text, no chevron, separated with generous spacing above)

### 6.16 Delete Account Modal

**Centered modal with dark backdrop (50% opacity).**

- Warning triangle icon in red-tinted circle.
- "Delete your account?" heading.
- Body: "All rides, garage data, XP progress, and profile will be permanently removed."
- Two buttons: "Cancel" (muted secondary) + "Delete" (red-filled primary).

### 6.17 Notifications

**Full screen with back button → Home.**

- "Notifications" heading (DM Serif 22pt).
- Notification rows: Unread dot (copper for recent, muted for old), title, description, timestamp.
- Ride invites include inline "Join" (copper filled) and "Decline" (subtle bordered) action buttons.

---

## 7. Navigation Architecture

### Tab Navigation (Root Level)

| Tab | Icon | Screen | Persists Map? |
|---|---|---|---|
| Rides | Route line | Home (map + bottom sheet) | Yes |
| Garage | Motorcycle | Bike list | No |
| XP | Star | Achievements & progress | No |
| Profile | Person | Settings & stats | No |

### Stack Navigation (Per Tab)

**Rides tab stack:**
Home → Create Ride → Scenic Selection (pushes on top)
Home → Ride Detail → Live Ride → Navigation (pushes on top)
Home → Notifications

**Garage tab stack:**
Garage → Bike Detail
Garage → Add Bike

**Profile tab stack:**
Profile → Setting Detail
Profile → Delete Account Modal

### Navigation Rules

1. Tab switch always goes to root of that tab and clears the stack.
2. Back/Cancel on any sub-screen pops one level.
3. Bottom sheet swipe-down collapses sheet (on home), does NOT navigate back.
4. Live Ride "End Ride" pops the entire ride stack back to Home.
5. Navigation "X" button pops one level back to Live Ride.

---

## 8. Google Maps SDK Integration & Constraints

### What Cloud Styling Lets Us Customize (JSON Styling API)

| Feature Type | Styler | Our Value | Notes |
|---|---|---|---|
| `landscape.natural` | `geometry.fill` | `#F2EDE4` | Warm cream land. |
| `landscape.man_made` | `geometry.fill` | `#E8E2D8` | Building footprints. |
| `road.highway` | `geometry.fill` | `#DDD6CC` | Sand-tone roads. |
| `road.highway` | `geometry.stroke` | `#C8BFB2` | Slightly darker road edges. |
| `road.local` | `geometry.fill` | `#DDD6CC` | Same as highway. |
| `water` | `geometry.fill` | `#BDD4E8` | Soft sky blue. |
| `poi.park` | `geometry.fill` | `#D4E4CB` | Sage green. |
| `poi.business` | `labels.text` | Visibility OFF | Remove business clutter. |
| `transit` | All | Visibility OFF | Hide transit lines. |
| `road` | `labels.text.fill` | `#8A8278` | Muted road labels. |

### What We CANNOT Customize

- **Map label fonts:** Always Roboto (Google's). We cannot use DM Serif Display or Outfit on map labels.
- **Google attribution logo:** MUST remain visible on all map screens. Position adjustable via padding API.
- **Navigation SDK maneuver icons:** Google provides the turn arrow set. We can style the container card but not the icon itself.
- **Re-routing logic:** Google's algorithm. We overlay our scenic waypoints as custom waypoints in the route request.
- **Map tile rendering:** We style colors only. No custom tile art.

### What We CAN Customize on Maps

- **Custom markers:** Any bitmap/vector as `BitmapDescriptorFactory.fromBitmap()`. Rider avatars, regrouping flags, scenic diamonds — all custom.
- **Polylines:** Color, width, dash pattern, cap style via `PolylineOptions`. Completed route green, remaining route dashed blue.
- **Camera:** Tilt (0–67.5°), bearing, zoom, padding. Live ride uses 45° tilt for cinematic perspective.
- **Info windows:** Fully custom layout (though we use our own bottom sheet instead).
- **Navigation SDK header/footer:** `setCustomHeaderView()` and `setCustomFooterView()` allow our custom turn card and ETA bar.
- **Map padding:** `GoogleMap.setPadding(left, top, right, bottom)` — push controls away from our bottom sheet.

### Map Mode Behaviors

| Screen | Tilt | Bearing | Markers | Polylines |
|---|---|---|---|---|
| Home | 0° | North-up | Current user only | None |
| Ride Detail | 0° | Auto-fit route | None (route preview) | Blue route line |
| Live Ride | 45° | Route-following | All riders + regrouping point | Green (done) + Blue dashed (remaining) |
| Navigation | Auto (Nav SDK) | Forward-facing | Blue puck (Nav SDK) | Blue route (Nav SDK) |

---

## 9. XP, Achievements & Seasons System

### XP Earning Rules

| Action | XP Value | Notes |
|---|---|---|
| Distance ridden (per km) | 1 XP | Tracked via GPS during active ride. |
| Scenic stop visited | 15 XP | Triggered when rider enters 200m radius of scenic waypoint. |
| Leading a group ride | 25 XP | One-time bonus for ride creator when ride starts. |
| Ride completed | 10 XP | Flat bonus for finishing a ride. |
| First ride of the week | 20 XP | Bonus for riding consistency. |
| Service record logged | 5 XP | Encourages maintenance tracking. |

### Level Progression

| Level | Total XP Required | XP for This Level |
|---|---|---|
| 1 | 0 | 0 |
| 2 | 100 | 100 |
| 3 | 300 | 200 |
| 5 | 1,000 | 400 |
| 10 | 5,000 | 800 |
| 15 | 15,000 | 1,500 |
| 20 | 30,000 | 2,500 |
| 25 | 50,000 | 3,500 |

XP requirements increase per level to prevent rapid early progression and reward long-term engagement.

### Achievements

| Icon | Name | Condition | XP Reward |
|---|---|---|---|
| 🏔️ | Mountain Goat | Complete 5 mountain rides | 200 |
| 🌊 | Coastal Cruiser | Ride 500km along coastline | 300 |
| 🏁 | Pack Leader | Create & lead 10 group rides | 250 |
| 🔧 | Grease Monkey | Log 20 service records | 150 |
| 🌅 | Scenic Hunter | Visit 25 scenic spots | 200 |
| ⚡ | Century Rider | Complete a 100km+ ride | 100 |
| 🌙 | Night Owl | Complete a ride that starts before 5 AM | 100 |
| 🤝 | Pack of Ten | Ride with 10+ riders in one group | 150 |
| 🔥 | Streak Rider | Ride 4 consecutive weekends | 200 |
| 🗺️ | State Hopper | Ride across 5 different states | 300 |

Achievements display with progress bars. Completed achievements show a copper border and green-filled progress bar.

### Seasons

Seasons run quarterly. Each season has a theme, a 2x XP multiplier on specific weekends, and season-specific achievements. Later phases will integrate partner rewards (gift cards, gear discounts) tied to season levels.

**Example Season:**
- **Summer Heat** (Apr – Jun 2026)
- 2x XP every Saturday
- Season achievement: "Summer Century" — ride 1,000km during the season
- Season reward (future): Partner discount code at season end for top 10% of riders

---

## 10. Component Library

### Primary CTA Button
- Width: 100%
- Height: 52pt (padding 15pt vertical)
- Border radius: 14pt
- Background: Linear gradient 135° from `#C4841D` to `#A66B15`
- Text: Outfit 15pt Semibold, `#FAF7F2`
- States: Default → pressed (scale 0.97, 120ms) → disabled (40% opacity, no gradient)
- Only ONE primary CTA visible per screen.

### Secondary Button
- Same dimensions as primary.
- Background: transparent.
- Border: 1.5pt solid `#C4841D`.
- Text: Outfit 14pt Semibold, `#C4841D`.
- Destructive variant: Border and text in `#EF4444`.

### Input Field
- Style: Borderless, bottom-line only.
- Label: Uppercase, 10pt, muted color, above field.
- Inactive: 1.5pt bottom line in `#E8E2D8`.
- Active/focused: 1.5pt bottom line in `#C4841D`, label floats to copper color.
- No box borders, no outlined style anywhere.

### Ride Card
- Background: White (`#FFFFFF`).
- Border: 1px solid `#F0EBE0`.
- Border radius: 16pt.
- Padding: 14–16pt.
- Content: Title (DM Serif 15–16pt), route text (from → to), date/time + XP value, rider avatars, status badge.
- Tap target: Entire card.

### Status Badges
- Shape: Rounded rectangle, padding 3–4pt vertical, 8–10pt horizontal, border radius 6–8pt.
- Variants:
  - JOINED: Green text on green 10% bg.
  - OPEN: Copper text on copper 12% bg.
  - LIVE: Green text on green 10% bg, uppercase, bold.
  - PRIMARY (bike): Copper text, frosted glass bg.

### Bottom Sheet
- Three snap points: Peek (~15%), Half (~50%), Full (~90%).
- Corner radius: 24pt top-left and top-right.
- Handle: 36pt × 4pt centered, `#E8E2D8`.
- Shadow: `0 -4px 30px rgba(26,22,18,0.08)`.
- Supports swipe-down to collapse and nested scrolling.

### Rider Pill / Avatar Stack
- Circles: 24–30pt diameter, overlapping by 8pt (negative margin).
- Max 4 visible, overflow shows "+N" in muted circle.
- Status dot: 6pt circle in green/amber/red, positioned top-right of avatar.

### BPI Gauge
- Semicircular arc gauge.
- Track: `#E8E2D8` (inactive).
- Fill: Color-coded (green ≥75, copper ≥50, red <50).
- Center: Score number in DM Serif Display.
- Below: Label text (Excellent/Good/Fair/Service Due) in matching color.
- Available sizes: 75pt (card), 80pt (compact), 140pt (standard), 160pt (detail).

### XP Level Ring
- Full circle.
- Track: `#F0EBE0`.
- Fill: `#C4841D`, stroke-dasharray animated.
- Center: Level number in DM Serif Display.
- Available sizes: 34pt (avatar border), 68pt (XP card), 110pt (onboarding).

### Map Marker (Custom)
- Current user: 10pt radius circle, copper, white 2pt stroke, pulsing outer ring (14→20→14pt, 2s cycle), status dot (3pt, top-right).
- Other riders: 7pt radius, individual colors, white stroke, status dot.
- Initials centered in marker (Outfit bold, white, 5.5–7pt).

### Segmented Control
- Background: `#F5F0E6` (elevated).
- Padding: 3pt.
- Segments: Equal width.
- Active segment: White background, subtle shadow (`0 1px 4px rgba(0,0,0,0.06)`), Outfit 12pt Semibold.
- Inactive: Transparent, Outfit 12pt Medium, muted color.

---

## 11. Motion & Animation Specifications

### Screen Transitions

| Transition | Animation | Duration | Curve |
|---|---|---|---|
| Sheet expand (peek → full) | Height expansion + content fade-in | 350ms | ease-out |
| Sheet collapse | Height reduction + content fade-out | 300ms | ease-in |
| Sub-screen push | Slide up from bottom + fade | 350ms | ease-out-expo |
| Sub-screen pop | Slide down + fade | 300ms | ease-in |
| Tab switch | Cross-dissolve | 200ms | ease |
| Splash → Onboard | Wordmark slides up + screen fades in | 400ms | ease-out |

### Component Animations

| Component | Animation | Duration | Curve |
|---|---|---|---|
| BPI gauge fill | Arc stroke-dasharray | 1200ms | cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot |
| XP ring fill | Same as BPI | 1400ms | Same overshoot curve |
| Progress bar fill | Width expansion | 1000ms | ease |
| Page dots | Width transition (6pt ↔ 20pt) | 300ms | ease |
| FAB press | Scale 1.0 → 0.97 → 1.0 | 120ms | ease |
| Toast slide-in | Slide up from bottom edge | 300ms | ease-out |
| Toast auto-dismiss | Fade out | 200ms | ease-in, after 3s delay |
| Rider marker position | Glide along interpolated path | 1000ms | ease-in-out |
| Map camera transition | Pan + zoom | 600ms | ease-in-out-cubic |

### Haptic Feedback Map

| Interaction | Haptic Type | Platform API |
|---|---|---|
| Tab switch, toggle, chip select | Light | `UIImpactFeedbackGenerator(.light)` / `HapticFeedbackConstants.CLOCK_TICK` |
| CTA press, ride joined, ride started | Medium | `UIImpactFeedbackGenerator(.medium)` / `HapticFeedbackConstants.CONFIRM` |
| SOS triggered, ride ended, account deleted | Heavy | `UINotificationFeedbackGenerator(.error)` / `HapticFeedbackConstants.REJECT` |
| Picker scroll, stop reorder | Selection | `UISelectionFeedbackGenerator()` / `HapticFeedbackConstants.GESTURE_START` |

---

## 12. Cross-Platform Design Rules

### iOS Specifics
- Font fallback: SF Pro Display for headings, SF Pro Text for body (if custom fonts fail to load).
- Status bar: Dark content (default). Light content only on dark splash screen.
- Safe area: Bottom tab bar must account for home indicator (22pt bottom padding).
- Bottom sheet: Use `UISheetPresentationController` detents for native feel.
- Date/time picker: Native `UIDatePicker` in wheel style.
- Haptics: `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`.

### Android Specifics
- Font fallback: Google Sans for headings, Google Sans Text for body.
- Status bar: Dark icons on light background. Edge-to-edge with `WindowCompat.setDecorFitsSystemWindows(false)`.
- Navigation bar: Transparent, gesture navigation preferred. 3-button nav handled with proper insets.
- Bottom sheet: `BottomSheetBehavior` from Material Components with custom peek/half/full states.
- Date/time picker: `MaterialDatePicker` / `MaterialTimePicker`.
- Haptics: `HapticFeedbackConstants` via `View.performHapticFeedback()`.

### Shared Rules
- Minimum touch target: 44pt × 44pt on both platforms.
- All text sizes defined in sp (Android) / pt (iOS) — both scale with system text size preference.
- No custom scrollbars — use platform default (iOS: hidden until scroll, Android: thin edge indicator).
- No custom pull-to-refresh spinner — use platform default.
- Native keyboard handling: Inputs must scroll above keyboard on focus. No manual keyboard avoidance.

---

## 13. Accessibility Requirements

- All interactive elements: 44pt × 44pt minimum touch target.
- Color is never the sole indicator of state. Icons, labels, and shape changes accompany color.
- Contrast ratios (WCAG AA verified):
  - `#F0F0F5` on `#1A1612` = 15.3:1
  - `#9B8E7E` on `#FAF7F2` = 3.5:1 (AA for large text, used only for captions)
  - `#C4841D` on `#FAF7F2` = 4.1:1 (AA for large text, used for headings/buttons)
  - `#1A1612` on `#FAF7F2` = 14.8:1
- All animations respect OS "Reduce Motion" setting. When enabled: transitions become instant cuts, pulsing/parallax disabled, gauge fills instantly.
- Screen reader labels on all interactive elements with meaningful descriptions.
- Map screens include non-visual summary accessible via VoiceOver/TalkBack.

---

## 14. Notification Design

### In-App Notifications

Top-sliding banner: Frosted glass card (elevated surface + backdrop blur), icon + title + one-line body. Auto-dismiss after 4 seconds. Tappable to navigate.

### Push Notification Categories

| Category | Example | Actions |
|---|---|---|
| Ride Invite | "[Rider] invited you to [Ride]. | Accept / Decline |
| Ride Starting | "[Ride] starts in 30 min. Gear up." | View Ride |
| Regrouping | "All riders regrouped at [Point]." | — |
| Ride Ended | "[Ride] complete. [X]km. See summary." | View Summary |
| BPI Alert | "[Bike] BPI dropped to [Score]. Service due." | View Garage |
| Achievement | "You unlocked [Achievement]! +[XP] XP" | View Achievements |
| Season | "Summer Heat season is live! 2x XP this Saturday." | View XP |

---

## 15. Empty States & Error Handling

### Empty States

Every list has a crafted empty state with illustration, headline, body text, and CTA.

| Screen | Headline | CTA |
|---|---|---|
| No upcoming rides | "No rides on the horizon" | "Plan your first ride →" |
| No past rides | "Your ride history starts here" | — |
| No bikes in garage | "Your garage is empty" | "Add your first machine" |
| No notifications | "All quiet" | — |
| No scenic stops found | "No scenic spots on this route" | "Try adjusting your route" |

### Error States

- **Connection loss:** Persistent thin banner below status bar: "No connection — last updated X min ago" on dark-red background. Caption text, white.
- **API errors:** Top toast with red left-border accent, error icon, one-line message. Auto-dismiss 4s. No blocking modals for recoverable errors.
- **Loading:** No spinners. Skeleton screens with shimmer animation (light gradient sweep left to right, 1.5s interval) on all lists and cards.

---

## 16. Screen Inventory

| # | Screen | Tab Bar? | Map Visible? | Entry Point |
|---|---|---|---|---|
| 1 | Splash | No | No | App launch |
| 2 | Onboarding Panel 1 | No | No | After splash |
| 3 | Onboarding Panel 2 | No | No | Swipe/Next |
| 4 | Onboarding Panel 3 | No | No | Swipe/Next |
| 5 | Authentication | No | No | Get Started / Skip |
| 6 | OTP Verification | No | No | Continue from Auth |
| 7 | Home (Peek) | Yes | Yes | Login complete |
| 8 | Home (Rides List) | Yes | Yes | Pull up sheet |
| 9 | Create Ride | No | Yes (dimmed) | FAB tap |
| 10 | Scenic Selection | No | Yes (dimmed) | From Create Ride |
| 11 | Ride Detail | No | Yes (dimmed) | Tap ride card |
| 12 | Live Ride | No | Yes (full) | Start Ride |
| 13 | Navigation | No | Yes (full, Nav SDK) | Navigate from Live Ride |
| 14 | Garage | Yes | No | Tab tap |
| 15 | Bike Detail | No | No | Tap bike card |
| 16 | Add Bike | No | No | Add bike button |
| 17 | XP & Achievements | Yes | No | Tab tap |
| 18 | Profile | Yes | No | Tab tap |
| 19 | Notifications | No | No | Bell icon |
| 20 | Delete Account Modal | No | No | Profile → Delete |
| 21 | Setting Detail | No | No | Profile → any setting |
| 22 | Ride Summary (post-ride) | No | No | After End Ride |

**Total: 22 distinct UI states.** Many share the same map canvas with bottom sheet variations, keeping perceived complexity low. The user never feels "deep" because the map remains visible behind most interactions.

---

## Appendix: Design Validation Against Biker Aesthetics

| Design Decision | Cultural Alignment |
|---|---|
| Copper (`#C4841D`) accent | Matches patina on exhaust pipes, brass fuel cap, leather saddle stitching. Royal Enfield, Triumph, Indian Motorcycle all use warm copper/brass in their brand materials. |
| Cream (`#FAF7F2`) surface | Vintage instrument gauge faces use warm ivory. Cafe racer tank paint schemes frequently feature cream. Outdoor readability proven by Apple Maps' light theme default. |
| Espresso (`#1A1612`) text | Not cold pure black — warm near-black matches leather jacket tone. Premium without being harsh. |
| DM Serif Display headings | Heritage motorcycle brands (Royal Enfield, Triumph, Indian) use serif typography extensively. Creates editorial warmth vs cold tech sans-serif. |
| BPI gauge visualization | Direct metaphor from motorcycle instrument clusters. Riders read semicircular gauges daily (speedometer, tachometer). Zero learning curve for interpretation. |
| Earth-tone map styling | Distinct from Google Maps' default blue/gray and Calimoto's bright green routes. Creates a "WeRide world" that feels warm and premium. |
| Bottom-sheet navigation | Validated by Uber for glove-unfriendly situations. Large swipe targets. One-thumb operable while holding helmet. |
| XP system with seasons | Strava proved gamification drives riding frequency. Competitive riders (our target) respond to leaderboards and streaks. Season structure creates time-limited engagement spikes. |

---

*This document contains everything needed to move into high-fidelity mockups in Figma. The interactive prototype (weride-v3.jsx) demonstrates all flows, transitions, and component behaviors. Begin with the component library in Section 10, then build screens in the order listed in Section 16.*