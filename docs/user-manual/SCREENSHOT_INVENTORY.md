# PawGuard Public Web User Manual — Visual Asset Inventory

| Figure | Filename | Feature | Captured? | Source | Notes |
|---|---|---|:---:|---|---|
| **FIG-1-1** | `docs/user-manual/images/01-getting-started/fig-1-1-homepage.png` | Homepage & Navigation Header | **Yes** | `http://localhost:3000/` | Full desktop hero view with SOS CTA & navigation bar |
| **FIG-1-2** | `docs/user-manual/images/01-getting-started/fig-1-2-navigation.png` | Main Navigation & Footer Options | **Yes** | `http://localhost:3000/` | Detailed navigation breakdown and footer links |
| **FIG-2-1** | `docs/user-manual/images/02-authentication/fig-2-1-login-modal.png` | User Authentication Interface | **Yes** | `AuthDialog.tsx` (Sign In) | Email/password input & Google OAuth 1-click sign-in |
| **FIG-2-2** | `docs/user-manual/images/02-authentication/fig-2-2-registration.png` | New User Registration Form | **Yes** | `AuthDialog.tsx` (Sign Up) | Name, email, phone & password registration form |
| **FIG-2-3** | `docs/user-manual/images/02-authentication/fig-2-3-password-reset.png` | Password Recovery Interface | **Yes** | `AuthDialog.tsx` (Reset) | Email reset link dispatch form |
| **FIG-3-1** | `docs/user-manual/images/03-adoption/fig-3-1-gallery.png` | Pet Adoption Search & Filter | **Yes** | `http://localhost:3000/adopt` | Gallery grid with species, age, gender & size filters |
| **FIG-3-2** | `docs/user-manual/images/03-adoption/fig-3-2-pet-profile.png` | Companion Pet Profile View | **Yes** | `http://localhost:3000/adopt/[slug]` | Pet photo gallery, bio traits, medical status & CTAs |
| **FIG-3-3** | `docs/user-manual/images/03-adoption/fig-3-3-application-form.png` | Adoption Application Form | **Yes** | Adoption Modal | Multi-question housing & lifestyle questionnaire |
| **FIG-4-1** | `docs/user-manual/images/04-lost-found/fig-4-1-public-feed.png` | Lost & Found Feed & Map View | **Yes** | `http://localhost:3000/lost-found` | Public report list with interactive location map toggle |
| **FIG-4-2** | `docs/user-manual/images/04-lost-found/fig-4-2-report-form.png` | Report Lost or Found Pet Form | **Yes** | `http://localhost:3000/lost-found/report` | Photo upload, last-seen date/time & GPS location pin |
| **FIG-4-3** | `docs/user-manual/images/04-lost-found/fig-4-3-sighting-modal.png` | Community Sighting Report | **Yes** | Sighting Modal | Community spotter form with coordinate/photo attachment |
| **FIG-5-1** | `docs/user-manual/images/05-emergency/fig-5-1-emergency-sos.png` | Emergency Rescue Request | **Yes** | `http://localhost:3000/emergency` | High-priority SOS dispatch, urgency selector & location |
| **FIG-5-2** | `docs/user-manual/images/05-emergency/fig-5-2-status-tracking.png` | Emergency Request Status | **No** | N/A (Not Implemented) | **Unavailable**: Emergency dispatch uses inline toast/alerts; no dedicated tracking page exists in current source. |
| **FIG-6-1** | `docs/user-manual/images/06-safety-tags/fig-6-1-public-scan.png` | Public QR Tag Finder View | **Yes** | `http://localhost:3000/scan` | Scanned pet medical alerts & direct owner contact CTA |
| **FIG-6-2** | `docs/user-manual/images/06-safety-tags/fig-6-2-tag-registration.png` | Registering a QR Safety Tag | **Yes** | `http://localhost:3000/account` | Tag serial linking to registered companion pet |
| **FIG-7-1** | `docs/user-manual/images/07-companion-pets/fig-7-1-pet-list.png` | Managing Companion Pets | **Yes** | `http://localhost:3000/account` | Owner companion pet roster & edit buttons |
| **FIG-7-2** | `docs/user-manual/images/07-companion-pets/fig-7-2-medical-records.png` | Pet Health & Medical Records | **Yes** | `http://localhost:3000/reminders` | Vaccination schedules, medical history & reminder toggles |
| **FIG-8-1** | `docs/user-manual/images/08-veterinary/fig-8-1-clinic-directory.png` | Veterinary Clinic Directory | **Yes** | `http://localhost:3000/veterinary` | Clinic search, emergency filter & service tags |
| **FIG-8-2** | `docs/user-manual/images/08-veterinary/fig-8-2-booking-form.png` | Veterinary Appointment Booking | **Yes** | `http://localhost:3000/appointments/book` | Date/slot selection, clinic picker & reason input |
| **FIG-9-1** | `docs/user-manual/images/09-volunteers/fig-9-1-application.png` | Volunteer Application Form | **Yes** | `http://localhost:3000/volunteer` | Role preferences, availability & motivation form |
| **FIG-9-2** | `docs/user-manual/images/09-volunteers/fig-9-2-dashboard.png` | Volunteer Portal Dashboard | **Yes** | `http://localhost:3000/volunteer/dashboard` | Assigned volunteer shifts, event schedule & logged hours |
| **FIG-10-1** | `docs/user-manual/images/10-foster/fig-10-1-application.png` | Foster Family Application | **Yes** | `http://localhost:3000/foster` | Home environment details & foster preference submission |
| **FIG-10-2** | `docs/user-manual/images/10-foster/fig-10-2-dashboard.png` | Foster Care Dashboard | **Yes** | `http://localhost:3000/foster/dashboard` | Active foster pet profile, care logs & supply requests |
| **FIG-11-1** | `docs/user-manual/images/11-donations/fig-11-1-donation-tiers.png` | Monetary Donation Options | **Yes** | `http://localhost:3000/donate` | Tier selection, custom amount & Razorpay checkout CTA |
| **FIG-11-2** | `docs/user-manual/images/11-donations/fig-11-2-supplies-wishlist.png` | Supplies Wishlist & Campaign | **Yes** | `http://localhost:3000/donate` | Shelter physical supply wishlist & donation progress bar |
| **FIG-12-1** | `docs/user-manual/images/12-education-support/fig-12-1-education.png` | Pet Care Education & Guides | **Yes** | `http://localhost:3000/education` | Article category filters & educational guide cards |
| **FIG-12-2** | `docs/user-manual/images/12-education-support/fig-12-2-support-ticket.png` | Support & Grievance Form | **Yes** | `http://localhost:3000/contact` | Ticket subject, category selector & message form |
| **FIG-12-3** | `docs/user-manual/images/12-education-support/fig-12-3-success-stories.png` | Rescue & Adoption Stories | **Yes** | `http://localhost:3000/stories` | Adoption success story cards & before/after photos |
| **FIG-13-1** | `docs/user-manual/images/13-account/fig-13-1-profile.png` | User Profile & Settings | **Yes** | `http://localhost:3000/account` | Editable contact details & password update form |
| **FIG-13-2** | `docs/user-manual/images/13-account/fig-13-2-applications.png` | Application Status Tracking | **Yes** | `http://localhost:3000/applications` | Active adoption, foster & volunteer application tracker |
| **FIG-14-1** | `docs/user-manual/images/14-troubleshooting/fig-14-1-common-error-state.png` | User-Facing Empty/Error State | **Yes** | `http://localhost:3000/adopt?search=XYZ` | "No Pets Found" clear filter CTA & validation help |
