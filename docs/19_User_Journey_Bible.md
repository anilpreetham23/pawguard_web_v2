# PawGuard User Journey Bible

## Complete step-by-step journeys for every user path.

Each step maps: User Thought → Emotion → Question → Information → Action → Potential Failure → Recovery

---

## EMERGENCY JOURNEY

### Step 1: Discover (user sees animal in danger)

| Layer | Description |
|-------|-------------|
| **User thought** | "That animal needs help. I need to do something." |
| **Emotion** | Shock, fear, urgency |
| **Question** | "Who can help?" |
| **Information** | None yet — user is processing |
| **Action** | Open phone, search "animal rescue" or type pawguard.org |
| **Potential failure** | User doesn't know how to find help, calls wrong number |
| **Recovery** | PawGuard must be searchable. Emergency hotline prominent wherever the brand appears. |

### Step 2: Arrive (user lands on homepage)

| Layer | Description |
|-------|-------------|
| **User thought** | "Is this the right place? Can they help?" |
| **Emotion** | Urgency mixed with uncertainty |
| **Question** | "Is this for emergencies?" |
| **Information** | EmergencyActionPanel must be the most visible element |
| **Action** | Tap "Emergency" CTA |
| **Potential failure** | User doesn't see the Emergency CTA because it's visually secondary to "Find a Pet" |
| **Recovery** | Emergency CTA must be crimson, prominent, visually weighted above other CTAs |
| **Failure path** | User finds Adopt or Donate instead, wastes time |

### Step 3: Land on Emergency page

| Layer | Description |
|-------|-------------|
| **User thought** | "What do they need from me?" |
| **Emotion** | Focused urgency |
| **Question** | "Can I fill this out quickly? Do I have all the info?" |
| **Information** | Hotline number visible, 4 form fields, severity toggle |
| **Action** | Begin filling form |
| **Potential failure** | User doesn't know the exact address (animal is on a highway, no cross street) |
| **Recovery** | Geolocation prefilled, "approximate location" option, "describe landmarks" field |

### Step 4: Fill the form

| Layer | Description |
|-------|-------------|
| **User thought** | "Location... description... is this enough?" |
| **Emotion** | Focused, anxious about correctness |
| **Question** | "What if I don't know the species? What if I can't describe it?" |
| **Information** | Each field provides guidance: "Where is the animal?", "Describe what you see" |
| **Action** | Fill fields, attach photo if possible |
| **Potential failure** | User abandons mid-form (form too long, interrupted, loss of signal) |
| **Recovery** | sessionStorage saves progress. "Resume report" option on return. No timeout. |

### Step 5: Submit the report

| Layer | Description |
|-------|-------------|
| **User thought** | "Did it go through?" |
| **Emotion** | Relief mixed with doubt |
| **Question** | "Was it received? Is someone coming?" |
| **Information** | Loading → "Contacting Nearest Unit..." → "✓ Rescue Team Dispatched. ETA: ~12 minutes" |
| **Action** | See confirmation |
| **Potential failure** | Network failure — user gets no confirmation and doesn't know if report was received |
| **Recovery** | Cache report locally, retry on reconnect, notify user of offline submission |

### Step 6: Track / Follow-up

| Layer | Description |
|-------|-------------|
| **User thought** | "Is help actually coming? Should I call to check?" |
| **Emotion** | Residual concern |
| **Question** | "What happens next?" |
| **Information** | Report reference number, "What happens next" steps, hotline number |
| **Action** | Save reference number, call hotline if needed |
| **Potential failure** | User loses reference number, can't get status updates |
| **Recovery** | SMS/email confirmation with reference number. Status-check page with reference number. |

---

## ADOPTION JOURNEY

### Step 1: Arrive on Adoption page

| Layer | Description |
|-------|-------------|
| **User thought** | "What animals are available?" |
| **Emotion** | Hope, curiosity |
| **Question** | "Are there animals I might like?" |
| **Information** | Card grid showing animals with photos, names, breeds |
| **Action** | Browse cards |
| **Potential failure** | No animals returned (empty state) or all animals look similar |
| **Recovery** | Empty state: "New animals join us every week. Check back soon." Suggest email alerts. |

### Step 2: Filter

| Layer | Description |
|-------|-------------|
| **User thought** | "I want a [species/age/size]. Let me narrow this down." |
| **Emotion** | Intentional, focused |
| **Question** | "Which filters will help me find what I'm looking for?" |
| **Information** | Filter sidebar with species, age, size checkboxes. Sort dropdown. |
| **Action** | Select filters, review results |
| **Potential failure** | Filters return no results |
| **Recovery** | "No animals match your filters. Try adjusting or clearing." Show what results would look like without filters. |

### Step 3: Inspect a card

| Layer | Description |
|-------|-------------|
| **User thought** | "This one looks interesting. Tell me more." |
| **Emotion** | Interest, connection |
| **Question** | "Is this the right animal for me?" |
| **Information** | Card shows: photo, name, breed, age, gender, badges (urgent, new, vaccinated) |
| **Action** | Click/tap card → navigate to detail page |
| **Potential failure** | Card links to /adopt instead of /adopt/:id (current state — NO detail page exists) |
| **Recovery** | MUST BE FIXED: create `/adopt/:id` pages with full details |

### Step 4: Detail page

| Layer | Description |
|-------|-------------|
| **User thought** | "This could be the one. Let me learn everything." |
| **Emotion** | Connection, evaluation |
| **Question** | "What is this animal's personality? Health? Requirements?" |
| **Information** | Photo gallery, personality description, health status, care requirements, adoption process, "Meet Me" form |
| **Action** | Read details, view photos, consider fit |
| **Potential failure** | Insufficient information to make a decision |
| **Recovery** | "Have questions? Contact our adoption team." Clear CTA to ask. |

### Step 5: Apply

| Layer | Description |
|-------|-------------|
| **User thought** | "I want to meet this animal. How do I apply?" |
| **Emotion** | Commitment mixed with nervousness |
| **Question** | "What's the application process? Am I qualified?" |
| **Information** | Simple application form, process preview (4 steps) |
| **Action** | Fill application, submit |
| **Potential failure** | Application too long, user gives up mid-way |
| **Recovery** | Save progress, clear steps indicator, "submit partial application + we'll follow up" |

### Step 6: Post-application

| Layer | Description |
|-------|-------------|
| **User thought** | "I've done it. Now what?" |
| **Emotion** | Hope mixed with patience |
| **Question** | "When will I hear back?" |
| **Information** | "Application received. We'll contact you within 2 business days." Process steps preview. |
| **Action** | Wait for contact |
| **Potential failure** | User never hears back (no follow-through mechanism) |
| **Recovery** | Automated confirmation email. Status tracking. "Haven't heard from us? Contact the adoption team." |

---

## DONATION JOURNEY

### Step 1: Arrive on Donate page

| Layer | Description |
|-------|-------------|
| **User thought** | "I want to donate. Is this organization trustworthy?" |
| **Emotion** | Skepticism, evaluation |
| **Question** | "Is PawGuard legitimate? Will my money actually help animals?" |
| **Information** | Hero: 78% to programs stat, 501(c)(3) status. Trust badges. Impact breakdown. |
| **Action** | Scroll down to see evidence before reaching the form |
| **Potential failure** | User sees "Demo Mode" and loses trust (current state — no real payment) |
| **Recovery** | Acceptable for demo. In production: real Stripe integration. |

### Step 2: Choose amount

| Layer | Description |
|-------|-------------|
| **User thought** | "How much should I give? What difference will it make?" |
| **Emotion** | Generosity mixed with calculation |
| **Question** | "What will my donation fund?" |
| **Information** | Preset amounts with impact descriptions: "$25 funds a week of foster care" |
| **Action** | Select preset or enter custom amount |
| **Potential failure** | User is overwhelmed by choice (too many amounts) |
| **Recovery** | 5 presets is ideal (Hick's Law: 3-5 options optimal). Default selected: $50. |

### Step 3: Choose frequency

| Layer | Description |
|-------|-------------|
| **User thought** | "One-time or monthly?" |
| **Emotion** | Commitment evaluation |
| **Question** | "Can I afford a monthly donation?" |
| **Information** | Monthly/one-time toggle. Default: monthly. |
| **Action** | Select frequency |
| **Potential failure** | User feels pressured into monthly |
| **Recovery** | Monthly is default but one-time is equally prominent. "You can change or cancel anytime." |

### Step 4: Enter payment details

| Layer | Description |
|-------|-------------|
| **User thought** | "Is my payment information safe?" |
| **Emotion** | Trust mixed with caution |
| **Question** | "Is this secure? Will my data be sold?" |
| **Information** | SSL badge, "Secured by Stripe," privacy assurance text |
| **Action** | Enter name, email, payment info |
| **Potential failure** | Payment fails (card declined, network error) |
| **Recovery** | "Payment didn't go through. Try a different card or contact your bank." |

### Step 5: Confirmation

| Layer | Description |
|-------|-------------|
| **User thought** | "It worked. I helped." |
| **Emotion** | Satisfaction, pride |
| **Question** | "What happens next? Will I get a receipt?" |
| **Information** | "Your gift of $50 will fund a full veterinary assessment. You'll receive a tax receipt within 24 hours." |
| **Action** | Share (optional) or make another gift |
| **Potential failure** | Generic "Thank you" with no specific impact |
| **Recovery** | Always include specific amount and impact. Personalize the success message. |

---

## VOLUNTEER JOURNEY

### Step 1: Arrive on Volunteer page

| Layer | Description |
|-------|-------------|
| **User thought** | "I want to help. What can I do?" |
| **Emotion** | Interest, motivation |
| **Question** | "Are there roles that fit my schedule and skills?" |
| **Information** | Hero with volunteer imagery, stats bar (800+ volunteers), CTA to apply or view roles |
| **Action** | Scroll to browse roles |
| **Potential failure** | User doesn't see themselves in any role |
| **Recovery** | "Don't see a fit? Contact us — we'll find something." |

### Step 2: Browse roles

| Layer | Description |
|-------|-------------|
| **User thought** | "Foster care... transport... events... shelter support. Which one?" |
| **Emotion** | Evaluation, comparison |
| **Question** | "What does each role involve? What's the commitment?" |
| **Information** | 4 role cards with title, commitment, description, requirements |
| **Action** | Read cards, identify best fit |
| **Potential failure** | Role requirements are unclear or seem too demanding |
| **Recovery** | "No experience required for most roles. Training provided." Clear commitment levels. |

### Step 3: Read requirements

| Layer | Description |
|-------|-------------|
| **User thought** | "Am I eligible? Do I meet the requirements?" |
| **Emotion** | Self-evaluation, hope |
| **Question** | "Do I qualify? What's the process?" |
| **Information** | General requirements section (age, time, background check, training, location) |
| **Action** | Self-evaluate against requirements |
| **Potential failure** | User doesn't meet a requirement (too young, wrong location) |
| **Recovery** | "16+ with guardian consent" for age. "Remote volunteering options" for location. |

### Step 4: Apply

| Layer | Description |
|-------|-------------|
| **User thought** | "I'm ready. Let me apply." |
| **Emotion** | Commitment, purpose |
| **Question** | "What information do they need?" |
| **Information** | Form: name, email, phone, role, availability, message |
| **Action** | Fill form, submit |
| **Potential failure** | Form too long, user abandons |
| **Recovery** | Short form (6 fields). Progress not lost on back navigation. |

### Step 5: Confirmation

| Layer | Description |
|-------|-------------|
| **User thought** | "I've applied. Now what?" |
| **Emotion** | Belonging, anticipation |
| **Question** | "When will I hear back? What's next?" |
| **Information** | "Welcome to PawGuard. We'll contact you within 5 business days. Orientation: 2-hour session." |
| **Action** | Wait for contact |
| **Potential failure** | User never hears back |
| **Recovery** | Automated confirmation. "Haven't heard from us? Contact volunteer@pawguard.org." |
