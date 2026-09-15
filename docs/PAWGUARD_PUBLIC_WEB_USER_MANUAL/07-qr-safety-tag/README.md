# 07. QR Safety Tag Guide

The PawGuard QR Safety Tag is a digital protection tool that links a physical collar tag to your pet's PawGuard profile.

---

## 1. What is a QR Safety Tag?

A QR Safety Tag is a scannable QR code worn on a pet's collar. If your pet strays or gets lost, anyone who finds your pet can scan the tag with any smartphone camera to instantly access vital safety instructions and contact PawGuard to report a sighting.

---

## 2. Generating & Assigning a QR Tag (Owner Guide)

1. Go to **My Pets** (`/account/pets`) and select your pet.
2. Click **Generate QR Safety Tag**.
3. A unique QR Safety Tag code is generated and linked to your pet.
4. You can download the digital QR code image or order a physical scannable collar tag.

---

## 3. What Happens When Someone Scans the Tag? (Finder Guide)

When a finder scans the QR tag on a found pet:
1. Their smartphone camera opens the public scan page (`/scan` or `/api/v1/dogs/{id}/public-scan`).
2. **What Information Is Displayed (Public Care Information):**
   * Pet Name & Photo
   * Species & Breed
   * Lost Status Indicator (e.g., "REPORTED LOST")
   * **Emergency Care Notes:** Medical conditions, allergies, dietary needs, or handling instructions provided by the owner.
3. **What Information Is NOT Displayed (Strict Privacy Boundary):**
   * **Owner's Phone Number:** Kept strictly private.
   * **Owner's Email Address:** Kept strictly private.
   * **Owner's Home Address:** Kept strictly private.
   * **Full Medical/Vaccination Records:** Kept strictly private.

---

## 4. Reporting a Sighting via Public QR Scan

If you have found a tagged pet:
1. On the public scan page, click **Report Sighting**.
2. Enter the sighting details:
   * **Location:** Current address or tap **Use Current Location** to capture GPS coordinates automatically.
   * **Condition Note:** (e.g., "Safe in my yard", "Appears healthy", "Slightly scared").
   * **Photo Upload:** Optional photo of the animal at the sighting spot.
   * **Finder Contact:** Optional phone number if you wish to allow PawGuard or the owner to contact you.
3. Click **Submit Sighting Report**.
4. The owner receives an immediate notification on their PawGuard account with the exact sighting location map and notes!
