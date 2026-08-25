# PawGuard Public Web Requirements

## 1. Source
- **Source Document**: `_PROJECTREPORT_11.docx`
- **Document Reference**: `PRR-PAWGUARD-2026-V1`
- **Issuing Entity**: PawGuard Rescue & Adoption Operations Committee
- **Date of Issuance**: July 27, 2026

---

## 2. Public Web Scope
The PawGuard Public Web platform serves as the public service interface and community engagement portal for the PawGuard Rescue & Adoption network. It bridges citizen incident intake, adoption applications, volunteerism, foster care registration, and monetary contributions with the backend operational system while isolating internal operations (shelter capacity management, veterinary surgical logs, field agent dispatching, and administrative governance).

---

## 3. Public Web Modules
The official source specification (`_PROJECTREPORT_11.docx`, Section 3.1) explicitly defines the following 13 public-facing service modules:

1. **Landing Page**: Dynamic hero section displaying real-time metrics (Total Rescued, Active Care Count, Successful Adoptions) and urgent alert banners for critical emergency rescues requiring community assistance.
2. **About & Mission**: Organizational history, operational shelter locations, ethical standards, and leadership team overview.
3. **Emergency Rescue Portal**: Multi-step incident reporting wizard for street-level animal emergencies with automated geolocation tagging and photo/video attachments.
4. **Public Adoption Directory**: Searchable catalog of adoptable dogs featuring rich media profiles, multi-parameter filters (age, size, temperament, location), and direct "Apply to Adopt" actions.
5. **Lost & Found Portal**: Dual-purpose directory allowing citizens to report lost personal pets or found roaming animals, supported by visual matching indicators.
6. **Volunteer & Foster Registration**: Self-service registration workflows capturing applicant capabilities, background details, home environments, and availability schedules.
7. **Transparent Donation Gateway**: Dedicated gateway supporting one-time and recurring monetary gifts, dog-specific sponsorships, emergency campaigns, and automated tax-receipt downloads.
8. **Rescue Success Stories**: Interactive gallery showcasing transformation journeys from initial street rescue to rehabilitation and final adoption.
9. **Educational & Awareness Campaigns**: Educational article portal containing pet ownership guidelines, vaccination drive schedules, and humane education materials.
10. **Veterinary Network Directory**: Interactive directory and locator listing affiliated emergency veterinary hospitals, clinical partners, and mobile health units.
11. **Operational Transparency & FAQ**: Structured knowledge base addressing common adoption procedures, rescue criteria, surrender policies, and financial utilization statistics.
12. **Contact & Emergency Hotline**: Direct contact directory with shelter telephone numbers, operating hours, emergency hotline numbers, and physical shelter addresses.
13. **Legal Framework**: Official access to Privacy Policies, Terms of Service, Adoption Agreements, and Data Usage Disclosures.

---

## 4. Public User Roles
The official source specification defines the following public-facing user roles and their operational boundaries (`_PROJECTREPORT_11.docx`, Section 2.1):

- **General Public User**: Emergency incident reporting, adoption application submission, lost/found postings, general inquiries, and personal user dashboard access.
- **Donor**: One-time and recurring monetary contributions, dog-specific sponsorships, receipt downloads, and self-service contribution history portal.
- **Volunteer**: Registration vetting, duty acceptance, shift check-in/out, activity logging, and self-service view of assigned shifts and service certificates.
- **Foster Family**: Foster application, daily progress reporting, medical symptom uploads, supply requests, and self-service access to assigned foster dog profiles.
- **Adoption Applicant**: Dog browsing, application submission, screening document upload, and application status tracking via personal dashboard.
- **Lost & Found Reporter**: Submission of lost pet alerts or found animal sightings, and match claim tracking.
- **Emergency Reporter**: Anonymous or authenticated submission of emergency street-rescue incidents and ticket status lookup.

---

## 5. Module-by-Module Functional Requirements

### 5.1 Landing Page (`/`)
- Dynamic hero metrics: Total Rescued, Active Care Count, Successful Adoptions.
- Urgent alert banner for high-priority emergency rescue situations.
- Quick navigation pathways to Emergency Rescue, Adoptable Dogs, Volunteer, Foster, and Donate.

### 5.2 About & Mission (`/about`)
- Overview of PawGuard organizational vision, history, and multi-regional rescue scope.
- Shelter locations directory and leadership team information.
- Operational transparency metrics and humane education CTAs.

### 5.3 Emergency Rescue Portal (`/emergency`)
- **Intake Form**: Captures Reporter Name, Phone Number, Alternate Contact, Email, and Anonymous Flag option.
- **Geolocation**: Captures Street Address, Landmark, and GPS Coordinates (auto-detected or manually set).
- **Animal Condition**: Categorized condition flags: *Critical/Life Threatening*, *Fractured/Injured*, *Contagious Disease/Sick*, *Malnourished*, *Abandoned/Stray*, plus aggressiveness indicators.
- **Media Evidence**: File upload interface supporting up to 5 photos/videos (max 50MB combined).
- **Tracking**: Generates unique tracking key (e.g., `RES-20260727-889`) for public status lookup.

### 5.4 Public Adoption Directory (`/adopt` & `/adopt/[slug]`)
- Searchable catalog of adoptable dogs cleared by veterinary clearance.
- Filters: Breed, age category, gender, temperament rating, shelter location.
- Dog Profile Card: Microchip ID, weight, estimated age, coat color, temperament matrix (*Friendly, Timid, Aggressive, High Energy, Pack Compatible, Cat/Child Safe*), and photo gallery.
- "Apply to Adopt" action launching auth-gated adoption application modal.

### 5.5 Adoption Applications Tracker (`/applications`)
- Self-service tracking dashboard for authenticated applicants.
- Status stages: Application Submitted → Document Verification → Interview → Home Inspection → Contract Signed → Handover.
- Exclusivity lock notification when application enters final approval.

### 5.6 Lost & Found Portal (`/lost-found`, `/lost-found/[id]`, `/lost-found/report`)
- Dual posting workflow for Lost Pet reports and Found Animal reports.
- Data capture: Location, date lost/found, breed attributes, primary color, collar/tag details, photos, microchip number.
- Visual matching indicators and automated match confidence scoring display.
- Public sighting submission and ownership claim initiation interface.

### 5.7 Volunteer Program & Dashboard (`/volunteer`, `/volunteer/dashboard`)
- Registration form capturing emergency contacts, background checks, medical conditions, handling experience, and skill tags (*Grooming, Transport, Photography, Training*).
- Authenticated Volunteer Dashboard: Displays status (*NOT_APPLIED, PENDING, ACTIVE, REJECTED, INACTIVE*), shift calendar, self-registration for open shifts, attendance check-in/out, and service summary.

### 5.8 Foster Care Program & Dashboard (`/foster`, `/foster/dashboard`)
- Registration form capturing preferences (*Pups, Medical Recovery, Behavior Modification, Senior Dogs*), maximum capacity (`max_capacity`), and background notes.
- Authenticated Foster Dashboard: Displays status (*APPLIED, APPROVED, REJECTED, INACTIVE*), maximum capacity, active placement count (`active_count`), and notes.
- Active Placements Portal (`GET /fosters/me/placements`): View assigned foster dog details, submit daily care progress logs (`POST /fosters/placements/{id}/progress`), submit supply requisition requests (`POST /fosters/placements/{id}/supplies/request`), and trigger Foster-to-Adopt conversion (`POST /fosters/placements/{id}/convert-to-adopt`).

### 5.9 Transparent Donation Gateway (`/donate`)
- Supports general one-time monetary gifts, recurring monthly memberships, emergency campaign contributions, and dog-specific sponsorships.
- Integrated payment gateway (Razorpay Checkout.js) with verification callback.
- Automated tax-deductible receipt generation and download.
- Self-service contribution history and active sponsorship tracking.

### 5.10 Educational & Awareness Campaigns (`/education`, `/education/[slug]`)
- Catalog of responsible pet care guides, vaccination drive schedules, and humane education articles.

### 5.11 Rescue Success Stories (`/stories`)
- Interactive gallery showcasing transformation journeys from street rescue to full rehabilitation and adoption.

### 5.12 Veterinary Network Directory (`/veterinary`)
- Directory listing affiliated emergency veterinary hospitals, clinical partners, and mobile health units with appointment booking links.

### 5.13 Contact, FAQ & Legal (`/contact`, `/privacy`, `/terms`, `/data-usage`)
- Contact directory with operating hours, location addresses, inquiry submission form, and grievance feedback form.
- Operational transparency knowledge base and legal document disclosures.

---

## 6. Public User Journeys
1. **Emergency Rescue Journey**: Citizen discovers injured dog → Opens `/emergency` → Captures GPS location & photo → Submits report → Receives ticket number `RES-XXXXXXXX` → Tracks progress (`REPORTED → VERIFIED → DISPATCHED → RESCUED`).
2. **Adoption Journey**: Visitor browses `/adopt` → Filters by breed/age → Selects dog → Clicks "Apply to Adopt" → Authenticates → Fills screening form → Monitors application on `/applications`.
3. **Lost & Found Journey**: Citizen loses pet or finds stray → Posts report on `/lost-found/report` → System scans matching engine → Owner views high-confidence match on `/lost-found/[id]` → Initiates claim verification.
4. **Volunteer Journey**: User registers on `/volunteer` → Application reviewed → Status set to `ACTIVE` on `/volunteer/dashboard` → Selects available shift → Performs check-in/out.
5. **Foster Journey**: User registers on `/foster` → Application reviewed → Status set to `APPROVED` → Assigned dog appears on `/foster/dashboard` → Submits daily progress logs & supply requests.
6. **Donor Journey**: Citizen visits `/donate` → Selects gift tier or dog sponsorship → Completes Checkout → Receives confirmation → Downloads official tax receipt.

---

## 7. API / Data Requirements Explicitly Stated by Source

### Emergency Intake Payload
- `reporter_name`: string
- `reporter_phone`: string
- `alternate_contact`: string (optional)
- `reporter_email`: string
- `is_anonymous`: boolean
- `address`: string
- `landmark`: string
- `gps_latitude`: number
- `gps_longitude`: number
- `dog_count`: number
- `physical_condition`: string (`critical`, `injured`, `sick`, `malnourished`, `stray`)
- `media_urls`: string[] (up to 5 files, max 50MB)

### Foster Application Payload
- `preferences`: string (optional)
- `max_capacity`: integer (>= 1)
- `notes`: string (optional)

### Foster Active Placements & Operations Payload
- `GET /fosters/me/placements` → Array of `FosterPlacementResponse` with joined `DogProfile`
- `POST /fosters/placements/{id}/progress` → `{ weight_kg, mood_rating, exercise_minutes, feeding_notes, medication_notes, behavior_notes, notes }`
- `POST /fosters/placements/{id}/supplies/request` → `{ item_type, quantity, description }`
- `POST /fosters/placements/{id}/convert-to-adopt` → `{}`

---

## 8. Responsive / Accessibility Requirements
- **Responsive Breakpoints**: Full layout fluidity across Mobile (320px - 414px), Tablet (768px - 1024px), and Desktop (1280px - 1440px+).
- **Touch-Friendly Controls**: Minimum 44px touch targets on mobile form controls, buttons, and tab bars.
- **High Contrast Styling**: WCAG compliant text contrast, distinct status badges, zebra-striped data tables, and explicit focus rings.
- **State Handling**: Explicit loading skeletons, empty state cards, and user-friendly error banners on every interactive module.

---

## 9. Security & Privacy Requirements
- **Role-Based Access Control (RBAC)**: Strict server-side permission checks enforcing public role boundaries.
- **PII Masking**: Public views mask reporter and donor phone numbers/addresses. Unmasked data is restricted to authorized coordinators.
- **Document Upload Safety**: Validated file mime-types (JPEG, PNG, PDF, MP4) and 50MB file size caps.
- **Session Governance**: Token-based authentication, automatic session invalidation on logout, and secure token storage.

---

## 10. Public Web vs Internal Operations Hub Boundary

| Functional Domain | Public Web Portal | Internal Operations Hub (Backend/Staff) |
|---|---|---|
| **Rescue Incidents** | Public intake form, location capture, ticket status tracking | Verification, severity triage, field agent dispatching, vehicle GPS routing |
| **Dog Master File** | Adoptable dog search catalog, photo gallery, basic stats | Full 360-degree master file, medical history, intake logs, shelter kennel allocation |
| **Adoptions** | Application submission, screening questionnaire, status tracking | Applicant vetting, interview scoring, home inspection audit, contract execution |
| **Foster Care** | Application submission, status dashboard, daily care logs, supply requests | Foster parent onboarding, background audits, placement assignment, supply dispatch approval |
| **Volunteer Care** | Registration form, shift browsing, self-check-in/out, status view | Shift posting, attendance verification, hours approval, service certificate issuance |
| **Veterinary Suite** | Partner clinic directory, appointment booking | Clinical intake exams, surgical logging, prescriptions, vaccination renewals, health clearances |
| **Shelter Management** | None (Public view of shelter locations only) | Multi-facility kennel allocation, section capacity tracking, sanitation logs, inter-facility transfers |
| **Inventory & Fleet** | None | Warehouse stock auditing, drug expiry alerts, purchase orders, vehicle fleet maintenance |

---

## 11. Acceptance Criteria Relevant to Public Web
1. **Page Load Performance**: Page load times under 2.0 seconds across standard web and mobile connections.
2. **Zero Exclusivity Violation**: Prevent secondary adoption application progression once a dog enters approved contract status.
3. **Public Ticket Search**: Incident reporters can look up real-time rescue status via tracking keys without exposing private internal logs.
4. **Mobile Usability**: 100% single-handed touch usability for public forms and user dashboards.

---

## 12. Source Limitations & Requirements Not Explicitly Defined
- **Email Change Endpoint**: The source specification does not define a self-service email address change API (email is read-only / system-assigned).
- **Direct Placement Creation**: Creation of dog placements is strictly an internal staff operation; the public web only reads assigned placements via `GET /fosters/me/placements`.
