# 13. Donations & Payments

PawGuard relies on generous public donations to fund stray animal feeding programs, emergency medical surgeries, shelter maintenance, and rescue operations.

---

## 1. Making a Donation

Visit `/donate` to make a contribution:
1. **Choose Giving Type:**
   * **One-Time Donation:** Single contribution.
   * **Monthly Care Sponsor:** Recurring monthly support.
   * **Specific Rescue Fund:** Contribute directly to an emergency rescue or medical case.
2. **Select Amount:** Choose a preset tier (e.g. ₹500 for feeding, ₹1,500 for vaccination, ₹5,000 for emergency surgery) or enter a custom amount.
3. **Donor Information:** Enter your Name, Email, and Phone Number (required for receipt issuance).
4. Click **Proceed to Payment**.

---

## 2. Razorpay Payment Checkout Process

PawGuard integrates directly with **Razorpay** for secure payments:
1. The official Razorpay checkout modal opens seamlessly on your screen.
2. Select your preferred payment method:
   * **UPI / QR Code:** Google Pay, PhonePe, Paytm, BHIM.
   * **Credit & Debit Cards:** Visa, Mastercard, RuPay, Maestro.
   * **NetBanking:** All major Indian banks.
   * **Wallets:** Paytm, Mobikwik, Freecharge.
3. Authorize the payment through your banking or UPI app.
4. Upon payment completion, Razorpay verifies the transaction with PawGuard's servers within seconds.

---

## 3. Post-Payment Confirmation & Receipts

* **Success Screen:** Displays your Payment ID, Order Number, Amount Paid, and Date.
* **Tax-Exempt Receipt:** A digital receipt is generated and emailed to your registered address.
* **Donation History (`/account/donations`):** Signed-in users can view their lifetime donation history and download past receipts at any time.

---

## 4. Payment Security & Support

* **100% PCI-DSS Compliant:** Payment credentials are handled entirely by Razorpay's encrypted gateway. PawGuard never sees or stores your card numbers, CVV, or UPI PIN.
* **Failed / Cancelled Payments:** If a payment fails due to bank network issues, no money is deducted. You can retry the donation at any time.
