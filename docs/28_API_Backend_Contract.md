# PawGuard API & Backend Contract

## Complete endpoint mapping for every user interaction.

---

## API BASE

```
Base URL: https://api.pawguard.org/v1
Content-Type: application/json
Authorization: Bearer {token} (future, when auth implemented)
```

---

## EMERGENCY REPORT

### POST /emergency/reports

**Purpose:** Submit an emergency animal rescue report.

**Flow:** EmergencyPage form → validate → create report → dispatch → return status

**Request:**

```json
{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, Springfield, IL",
    "accuracy": 15
  },
  "animal": {
    "species": "dog",
    "condition": "injured",
    "description": "Medium-sized brown dog, limping, lying on sidewalk"
  },
  "severity": "critical",
  "reporter": {
    "name": "Jane Smith",
    "phone": "+15551234567"
  },
  "media": ["https://cdn.pawguard.org/uploads/photo-123.jpg"],
  "source": "web"
}
```

**Validation:**
| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| location.latitude | Conditional | number | Required if GPS available |
| location.longitude | Conditional | number | Required if GPS available |
| location.address | Conditional | string | Required if GPS unavailable |
| animal.species | Yes | string | Max 100 chars |
| animal.condition | Yes | enum | injured, trapped, abandoned, sick, other |
| animal.description | Yes | string | 10-2000 chars |
| severity | Yes | enum | critical, non-critical |
| reporter.phone | No | string | E.164 format |
| media | No | string[] | Max 3 images, max 10MB each |

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "report_id": "RPT-2024-08-001234",
    "status": "dispatched",
    "estimated_arrival_minutes": 12,
    "dispatch_time": "2024-08-15T14:30:00Z",
    "unit": {
      "id": "UNIT-042",
      "type": "mobile-rescue",
      "eta_minutes": 12
    },
    "hotline": "1-800-PAW-GUARD"
  }
}
```

**Loading State:** Button: "Contacting Nearest Unit..." (spinner)
**Success State:** Modal: "✓ Rescue Team Dispatched" with report_id, ETA, unit info
**Error State:** Alert: "Couldn't reach our servers. Your report has been saved offline."
**Offline Logic:** Queue report in localStorage. Retry on reconnect. Notify on success.

**Analytics Event:**
```
event: emergency_report_submitted
properties: { severity, species, has_photo, source, gps_accuracy }
```

---

### GET /emergency/reports/:report_id

**Purpose:** Check the status of an emergency report.

**Flow:** User receives report_id → calls this endpoint → gets current status

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "report_id": "RPT-2024-08-001234",
    "current_status": "on_scene",
    "timeline": [
      { "status": "reported", "timestamp": "2024-08-15T14:30:00Z" },
      { "status": "dispatched", "timestamp": "2024-08-15T14:30:15Z" },
      { "status": "en_route", "timestamp": "2024-08-15T14:32:00Z" },
      { "status": "on_scene", "timestamp": "2024-08-15T14:38:00Z" }
    ],
    "unit": {
      "id": "UNIT-042",
      "type": "mobile-rescue"
    }
  }
}
```

**States:** reported → dispatched → en_route → on_scene → resolved

---

## ADOPTION

### GET /adoption/animals

**Purpose:** List animals available for adoption.

**Flow:** AdoptionPage loads → fetches animals → renders cards / empty state

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| species | string[] | [] | Filter by species: dog, cat |
| age | string[] | [] | Filter by age: puppy, young, adult, senior |
| size | string[] | [] | Filter by size: small, medium, large |
| sort | string | "newest" | Sort: newest, name, age |
| page | number | 1 | Pagination |
| limit | number | 12 | Items per page |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "animals": [
      {
        "id": "ANM-001",
        "slug": "bella-labrador-mix",
        "name": "Bella",
        "species": "dog",
        "breed": "Labrador Mix",
        "age": "young",
        "size": "large",
        "gender": "female",
        "description": "Gentle, playful, and great with children. Fully vaccinated.",
        "images": [
          { "src": "https://cdn.pawguard.org/animals/bella-1.jpg", "alt": "Bella — a golden Labrador Mix lying on grass" }
        ],
        "badges": ["vaccinated", "spayed", "microchipped"],
        "tags": ["urgent"],
        "status": "available",
        "intake_date": "2024-06-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 45,
      "total_pages": 4
    }
  }
}
```

**Empty State (no animals):** `{ "data": { "animals": [] }, "pagination": { "total": 0 } }`
**Empty State UI:** "No animals are currently available. Check back soon." + email alert signup CTA.

---

### GET /adoption/animals/:slug

**Purpose:** Get detailed information about a specific animal.

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "ANM-001",
    "slug": "bella-labrador-mix",
    "name": "Bella",
    "species": "dog",
    "breed": "Labrador Mix",
    "age": "young",
    "age_months": 24,
    "size": "large",
    "weight_kg": 28,
    "gender": "female",
    "description": "Bella was found as a stray and has blossomed into a confident, affectionate companion. She loves long walks, belly rubs, and playing fetch.",
    "personality": ["Gentle", "Playful", "Good with children", "Good with other dogs"],
    "health": {
      "vaccinated": true,
      "spayed_neutered": true,
      "microchipped": true,
      "medical_notes": "Minor hip dysplasia — managed with daily exercise"
    },
    "requirements": {
      "yard": false,
      "other_pets": "Good with dogs. Unknown with cats.",
      "experience": "Beginner-friendly",
      "children": "Good with children 5+"
    },
    "images": [
      { "src": "https://cdn.pawguard.org/animals/bella-1.jpg", "alt": "Bella lying on grass" },
      { "src": "https://cdn.pawguard.org/animals/bella-2.jpg", "alt": "Bella playing fetch" }
    ],
    "status": "available",
    "intake_date": "2024-06-15",
    "location": "Springfield Shelter"
  }
}
```

---

### POST /adoption/applications

**Purpose:** Submit an adoption application.

**Request:**

```json
{
  "animal_id": "ANM-001",
  "applicant": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "address": "123 Main St, Springfield, IL"
  },
  "household": {
    "home_type": "house",
    "has_yard": true,
    "adults": 2,
    "children_under_18": 1,
    "current_pets": "One 5-year-old golden retriever"
  },
  "experience": "First-time dog owner but grew up with dogs",
  "reason": "Looking for a companion for our family"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "application_id": "APP-2024-08-00567",
    "status": "received",
    "expected_review_days": 2,
    "next_steps": "We'll review your application and contact you within 2 business days."
  }
}
```

**Success UI:** "Application Received. We'll contact you within 2 business days."

---

## DONATIONS

### POST /donations

**Purpose:** Process a donation.

**Request:**

```json
{
  "amount": 50.00,
  "frequency": "monthly",
  "currency": "USD",
  "donor": {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com"
  },
  "payment": {
    "method": "card",
    "token": "pm_123456789"  // Stripe PaymentMethod token
  },
  "source": "web"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "donation_id": "DON-2024-08-00987",
    "amount": 50.00,
    "frequency": "monthly",
    "status": "completed",
    "impact": "Your monthly gift of $50 will fund a complete veterinary assessment every month.",
    "receipt": {
      "ein": "87-1234567",
      "receipt_available_at": "2024-08-16T14:30:00Z"
    }
  }
}
```

**Success UI:** "Your gift of $50 will fund a complete veterinary assessment. Thank you."
**Failure UI:** "Payment didn't go through. Try a different card or contact your bank."

---

## VOLUNTEER

### POST /volunteer/applications

**Purpose:** Submit a volunteer application.

**Request:**

```json
{
  "applicant": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+15551234567"
  },
  "preferences": {
    "role": "Foster Care",
    "availability": "Weekday evenings, Saturday mornings",
    "location": "Springfield"
  },
  "experience": "Grew up with dogs. Comfortable handling medium to large breeds.",
  "source": "web"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "application_id": "VOL-2024-08-00345",
    "status": "received",
    "expected_review_days": 5,
    "next_steps": "Welcome to PawGuard. Our volunteer coordinator will be in touch within 5 business days to discuss next steps and schedule orientation."
  }
}
```

**Success UI:** "Welcome to PawGuard. We'll contact you within 5 business days."

---

## CONTACT

### POST /contact/messages

**Purpose:** Submit a contact form inquiry.

**Request:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Adoption Inquiry",
  "message": "I have questions about the adoption process for Bella.",
  "source": "web"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "message_id": "MSG-2024-08-00123",
    "status": "received",
    "expected_response_days": 2
  }
}
```

---

## NEWSLETTER

### POST /newsletter/subscribe

**Purpose:** Subscribe to email updates.

**Request:**

```json
{
  "email": "jane@example.com",
  "source": "footer"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "message": "Thank you for subscribing. You'll receive rescue news, adoption updates, and volunteer opportunities."
  }
}
```

---

## API ERROR FORMAT

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields require attention.",
    "details": [
      {
        "field": "location.address",
        "message": "We need the animal's location to send help"
      }
    ],
    "request_id": "REQ-2024-08-00abc"
  }
}
```

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| VALIDATION_ERROR | 422 | Input validation failed |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Temporary outage |
| PAYMENT_FAILED | 402 | Payment processing failed |

---

## ANALYTICS EVENTS

| Event | Trigger | Properties |
|-------|---------|------------|
| `page_viewed` | Route change | page_name, referrer, device, connection_speed |
| `emergency_form_started` | Emergency page load | has_geolocation |
| `emergency_report_submitted` | Success submit | severity, species, has_photo, source |
| `emergency_report_failed` | Failed submit | error_code, attempt_number |
| `adoption_filter_applied` | Filter change | species_filter, age_filter, size_filter |
| `adoption_card_clicked` | Card click | animal_id, animal_name, position_in_grid |
| `adoption_application_started` | Form appears | animal_id |
| `adoption_application_submitted` | Success submit | animal_id |
| `donation_amount_selected` | Amount choice | amount, frequency |
| `donation_completed` | Success submit | amount, frequency, payment_method |
| `donation_failed` | Failed submit | amount, frequency, error_code |
| `volunteer_application_started` | Form appears | — |
| `volunteer_application_submitted` | Success submit | role |
| `contact_form_submitted` | Success submit | subject |
| `newsletter_subscribed` | Success submit | source |
| `offline_detected` | Network loss | current_page |
| `online_restored` | Network restored | reports_queued |
