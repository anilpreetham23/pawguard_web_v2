# PawGuard Wireframe — Emergency Page

## Design Agent Step 7 — Structural Layout

---

## Grid Architecture

```
┌──────────────────────────────┐ ─── Top: 80px (header)
│        HEADER (Global)       │
└──────────────────────────────┘
┌──────────────────────────────┐ ─── Banner: 56px
│  HOTLINE BANNER (Crimson)    │
│  "Call 1-800-PAW-GUARD"      │
└──────────────────────────────┘
┌────────────────┬─────────────┐ ─── Main: 12-col grid
│                │             │
│   FORM PANEL   │  SIDEBAR    │
│   8 cols       │  4 cols     │
│                │             │
│  ┌──────────┐  │  ┌───────┐  │
│  │ Severity │  │  │ What  │  │
│  │ Toggle   │  │  │ Hap-  │  │
│  │ [Critical│  │  │ pens  │  │
│  │ /Non-    │  │  │ Next  │  │
│  │ Critical]│  │  │ ├─Step1│  │
│  └──────────┘  │  │ ├─Step2│  │
│  ┌──────────┐  │  │ ├─Step3│  │
│  │ Location │  │  │ ├─Step4│  │
│  │ ┌──────┐ │  │  │ └───┘  │  │
│  │ │Input │ │  │  └───────┘  │
│  │ └──────┘ │  │  ┌───────┐  │
│  └──────────┘  │  │Safety │  │
│  ┌──────────┐  │  │Tips   │  │
│  │ Animal   │  │  │ ┌───┐  │  │
│  │ ┌──────┐ │  │  │ │Do│  │  │
│  │ │Input │ │  │  │ │Do│  │  │
│  │ └──────┘ │  │  │ │No│  │  │
│  └──────────┘  │  │ └───┘  │  │
│  ┌──────────┐  │  └───────┘  │
│  │ Photo    │  │             │
│  │ Upload   │  │             │
│  └──────────┘  │             │
│  ┌──────────┐  │             │
│  │ Phone    │  │             │
│  └──────────┘  │             │
│                    │             │
│  ┌────────────────┐│             │
│  │ SEND RESCUE    ││             │
│  │ REQUEST (Btn)  ││             │
│  └────────────────┘│             │
│                    │             │
└────────────────┴─────────────┘
┌──────────────────────────────┐ ─── Footer
│        FOOTER (Global)       │
└──────────────────────────────┘
```

---

## Layout Stack (Mobile: 4-col)

```
┌──────────────────────┐
│ HEADER               │
├──────────────────────┤
│ HOTLINE BANNER       │
├──────────────────────┤
│ SEVERITY TOGGLE      │
├──────────────────────┤
│ LOCATION INPUT       │
├──────────────────────┤
│ ANIMAL INPUT         │
├──────────────────────┤
│ PHOTO UPLOAD         │
├──────────────────────┤
│ PHONE INPUT          │
├──────────────────────┤
│ SEND RESCUE REQUEST  │
├──────────────────────┤
│ WHAT HAPPENS NEXT    │
├──────────────────────┤
│ SAFETY TIPS          │
├──────────────────────┤
│ FOOTER               │
└──────────────────────┘
```

---

## Section Details

### 1. Header (Global)
| Property | Value |
|----------|-------|
| Height | 80px (desktop), 64px (mobile) |
| Grid | Full-width, max-content 1280px |
| Content | Logo left, nav right, Emergency CTA rightmost |

### 2. Hotline Banner
| Property | Value |
|----------|-------|
| Height | 56px |
| Background | Crimson (`#DC2626`) |
| Text | White, `text-sm`, bold |
| Content | "24/7 Emergency Hotline: 1-800-PAW-GUARD" + phone icon |
| Behavior | Sticky top (below header), visible on all emergency pages |
| Mobile | Collapsible to single line, icon-only phone on scroll |

### 3. Main Content — Desktop (12-col grid)
| Zone | Columns | Content |
|------|---------|---------|
| Form Panel | 8 cols | Severity toggle, 4 inputs, submit button |
| Sidebar | 4 cols | "What happens next" steps, Safety tips card |

### 4. Form Panel Components (vertical stack, gap-6)

#### a. Severity Toggle
| Property | Value |
|----------|-------|
| Type | Segmented control (2 options) |
| Options | "Critical — Life in Danger" (crimson), "Non-Critical — Needs Help" (amber) |
| Default | Critical |
| Behavior | Changing severity adjusts urgency tone in sidebar text |

#### b. Location Input
| Property | Value |
|----------|-------|
| Label | "Where is the animal?" |
| Input | Text input with GPS auto-detect button |
| Prefill | GPS coordinates (if permitted) |
| Secondary | "Describe the location" textarea (shown if GPS denied) |
| Validation | Required on submit (either GPS or address) |
| Helper | "Drag the map pin or type the address" — shown only if GPS available |

#### c. Animal Description
| Property | Value |
|----------|-------|
| Label | "What do you see?" |
| Input | Textarea, 3 rows, resize-none |
| Placeholder | "Describe the animal and the situation. E.g., 'Medium-sized brown dog, limping, lying on sidewalk near the bus stop.'" |
| Validation | 10-2000 chars |

#### d. Photo Upload
| Property | Value |
|----------|-------|
| Label | "Add a photo (optional)" |
| Type | Drag-and-drop zone + click to upload |
| Preview | Thumbnail after selection, removable |
| Limits | Max 3 photos, max 10MB each, JPEG/PNG/WebP |
| States | Empty, selected (with thumbnail), uploading (progress), error (size/format), too many |

#### e. Contact Number
| Property | Value |
|----------|-------|
| Label | "Your phone number (optional)" |
| Input | Tel input with country code prefix |
| Helper | "We may call for more information. Your number is kept private." |

#### f. Submit Button
| Property | Value |
|----------|-------|
| Style | Destructive variant (crimson) |
| Size | lg (56px) |
| Width | Full-width in form panel |
| Label | "Send Rescue Request" |
| Loading | "Contacting Nearest Unit..." + spinner |
| Success | "✓ Rescue Team Dispatched" |
| Disabled | During submission |

### 5. Sidebar

#### a. "What Happens Next" Card
| Property | Value |
|----------|-------|
| Style | Card (bg-card, rounded-card) |
| Heading | "After You Submit" |
| Steps | 4-step numbered list with icons |
| 1 | "We receive your report" |
| 2 | "Nearest team is dispatched" |
| 3 | "Team arrives on scene" |
| 4 | "Animal is transported to care" |
| Tone | Calm, confident. "You've done the right thing." |

#### b. Safety Tips Card
| Property | Value |
|----------|-------|
| Heading | "While You Wait" |
| Content | Bulleted list of Do / Don't |
| Do | "Keep a safe distance", "Note the animal's location", "Keep the animal in sight if safe" |
| Don't | "Do not approach if the animal is aggressive", "Do not put yourself in danger" |
| Tone | Authoritative but kind |

---

## States Mapped

| State | Behavior |
|-------|----------|
| **Loading** | Skeleton form (4 input skeletons + button skeleton). Sidebar skeleton (2 card skeletons) |
| **GPS Prompt** | Browser geolocation permission dialog. On deny: empty location field + "Enter the address or describe the area" helper |
| **Typing** | Real-time character count on textarea. No inline validation (urgency mode) |
| **Validation Error** | On submit: all errors shown simultaneously. First error focused. Errors: crimson text below field |
| **Submitting** | Button disabled → "Contacting Nearest Unit..." + spinner. Form fields disabled. Sidebar unchanged |
| **Network Failure** | Toast: "No internet connection. Your report is saved and will be sent when connected." Button shows "Saved Locally — Retrying..." |
| **Success** | Full-page confirmation. Form replaced with: checkmark icon, "✓ Rescue Team Dispatched", report ID, ETA, "What happens next" (expanded), "Submit Another Report" button |
| **Server Error** | Toast: "We couldn't send your report. Don't worry — it's saved. We'll keep trying." Button: "Retry Now" |
| **Timeout (30s)** | Toast: "This is taking longer than usual. Your report is saved." Button: "Retry Now" |

---

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| ≥ 1024px | 2-column (8+4), sidebar visible |
| 768-1023 | 2-column but sidebar width reduces, form takes more space |
| < 768px | Single column. Sidebar moves below form. All full-width |
| Phone | All inputs full-width. Severity toggle as radio buttons (stacked) |

---

## Accessibility Notes

| Requirement | Implementation |
|-------------|----------------|
| Skip link | "Skip to Emergency Form" as first focusable |
| Focus order | Hotline → Form fields → Submit → Sidebar → Footer |
| Error announcement | `aria-live="polite"` region for validation errors |
| Loading announcement | `aria-live="assertive"` for submission status |
| Success announcement | Focus moves to confirmation heading |
| Keyboard | All form fields, toggle, and upload reachable via Tab |
| Touch targets | All interactive elements ≥ 48px height |
| Reduced motion | Disable pulsing on hotline banner, no skeleton animation |

---

## Performance Spec

| Metric | Target |
|--------|--------|
| Page weight | < 200 KB (HTML + CSS + JS) |
| Images | 0 (all iconography inline or SVG sprite) |
| API calls | 1 (POST /emergency/reports) |
| Time to Interactive | < 2s |
| Geolocation API | Called on page load, no blocking |
