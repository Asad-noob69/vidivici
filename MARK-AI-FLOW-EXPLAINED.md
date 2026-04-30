# How Mark AI Booking Works — Full Flow Explained

This document explains the complete lifecycle of a booking made through Mark, the AI concierge chatbot. Written in plain language so anyone on the team can understand.

---

## What Is Mark?

**Mark** is the AI chat assistant that lives on the bottom-right of the website. Customers talk to him like a real concierge — they tell him what they want, he searches the inventory, agrees on a price, and sets up a booking. Mark is powered by GPT-4o.

Mark handles **three types of bookings**:
- 🚗 **Car rentals**
- 🏠 **Villa stays**
- 🎉 **Events / venue bookings**

These are completely separate from the regular website booking flow (the PayPal checkout on car/villa pages). Mark bookings go through a manual concierge workflow managed by your admin team.

---

## The Full 7-Step Flow (Step by Step)

### ─────────────────────────────────────────
### STEP 1 — Customer Chats With Mark
**Who does what:** Customer ↔ Mark AI

The customer opens the chat bubble on the website and starts talking. Mark will:

1. Ask what they're looking for (car, villa, event?)
2. Ask about dates, budget, location, group size, special requests
3. **Search your inventory** in real time (calls the database silently)
4. Show matching options as clickable links
5. Collect the customer's **full name, email, and phone number**
6. Agree on a **total price and deposit amount** (typically 10–20% of total)
7. **Check availability** for those exact dates
8. **Create the booking** and generate a deposit payment link

> At the end of this step, a `MarkBooking` record is created in the database with status **`booking_ready`**.
>
> Mark shares a deposit payment link in the chat, e.g.:
> `https://vidivicihospitalitygroup.com/mark/pay?token=abc123...`
>
> **Admin gets an email** notifying them a new booking was created.

---

### STEP 2 — Customer Pays the Deposit
**Who does what:** Customer (on their own)

The customer clicks the deposit link Mark shared in the chat. They land on a clean payment page (`/mark/pay?token=...`) that shows:
- Booking reference number
- What they're booking, dates, guests
- Total price and deposit amount due

They pay using **PayPal** (card or PayPal account). Payment is captured immediately.

> Status changes to **`deposit_paid`**.
>
> **Admin gets an email** with deposit confirmation and a link to the booking in the admin panel.

---

### STEP 3 — Admin Sends to Owner for Confirmation
**Who does what:** Admin

Admin opens the Mark AI booking in the admin dashboard (`/admin/mark-bookings`). They see the deposit is paid. Now they need to **contact the car owner or property owner manually** (phone/WhatsApp/email — this part happens outside the system).

Once admin has verified the owner is aware, they click **"Send to Owner for Confirmation"** in the admin panel.

> Status changes to **`awaiting_owner`**.

---

### STEP 4 — Owner Confirms or Declines
**Who does what:** Admin (after hearing from owner)

After speaking with the owner/partner:
- If the owner **approves** → Admin clicks **"Owner Confirmed"** in the panel
- If the owner **declines** → Admin clicks **"Owner Declined"** → booking is cancelled

> If confirmed, status changes to **`owner_confirmed`**.

---

### STEP 5 — Admin Sends Confirmation + Wire Instructions to Customer
**Who does what:** Admin triggers it, system sends the email automatically

This is the step you asked about. Here is exactly how the wire upload link gets to the customer:

**Admin does this:**
1. Opens the booking detail page
2. Sets a **Balance Due Date** (a date picker field)
3. Clicks **"Send Confirmation + Wire Instructions"**

**The system automatically sends a branded email to the customer** containing:
- Booking confirmed notification
- Full booking summary (item, dates, guests)
- Deposit received ✅
- Remaining balance amount (e.g. $4,500)
- Balance due date
- **Bank wire transfer instructions** (Bank Name, Account Number, Routing Number, SWIFT Code, Bank Address — all pulled from Admin → Settings)
- A big button: **"Upload Wire Transfer Proof"** → this links to the upload portal

The upload link looks like:
```
https://vidivicihospitalitygroup.com/mark/upload-proof?token=9dc20b0d-0bee-4eaa-ba9e-398275f9bc37
```

> ⚠️ **You do NOT manually send this link.** The system emails it automatically when you click the button. The only thing you need to do first is set the wire bank details in **Admin → Settings → Wire Transfer Instructions**.

> Status changes to **`balance_info_sent`**.

---

### STEP 6 — Customer Uploads Wire Proof
**Who does what:** Customer (on their own, using the emailed link)

The customer receives the email, wires the remaining balance to your bank, then clicks the link in the email. They land on a clean upload page (`/mark/upload-proof?token=...`) where they:

- See a summary of their booking and balance due
- Upload a file (PDF, JPG, or PNG — max 10MB): their bank receipt, SWIFT confirmation, or a screenshot

Once uploaded, the file is saved on your server at `public/uploads/wire-proofs/`.

> Status changes to **`proof_uploaded`**.
>
> **Admin gets an email** notifying them the wire proof was received, with a direct link to view it.

---

### STEP 7 — Admin Closes the Booking
**Who does what:** Admin

Admin opens the booking, clicks **"View Uploaded Proof"** or downloads it, verifies the wire transfer is correct and matches the balance due. If everything checks out, they click **"Close Booking"**.

> Status changes to **`closed`**. Booking is complete. 🎉

---

## Summary: Who Sends What to the Customer?

| What | How | When |
|---|---|---|
| Deposit payment link | Mark AI shares it in the chat | After booking is created (Step 1) |
| Booking confirmation + wire details + upload link | **Automatic email** triggered by admin clicking a button | Step 5 (after owner confirms) |

**The customer NEVER has to log in.** Everything works via secure token links in emails and chat.

---

## Status Glossary

| Status | Plain English |
|---|---|
| `booking_ready` | Mark created the booking, waiting for deposit |
| `deposit_paid` | Customer paid the deposit via PayPal |
| `awaiting_owner` | Admin notified the owner, waiting for their response |
| `owner_confirmed` | Owner said yes |
| `balance_info_sent` | Confirmation email with wire instructions sent to customer |
| `proof_uploaded` | Customer uploaded their wire transfer receipt |
| `closed` | Booking fully complete |
| `cancelled` | Booking cancelled at any stage |

---

## What Mark Can and Cannot Do

### ✅ Mark Can:
- Search cars, villas, events with filters (location, price, dates, bedrooms, etc.)
- Check real-time availability (checks both regular bookings AND Mark bookings)
- Create a booking record with a deposit payment link
- Speak in any language the customer uses (English, Arabic, French, Spanish, etc.)
- Handle multiple conversations simultaneously
- Remember customer info within a conversation (name, email, dates, selected item)

### ❌ Mark Cannot:
- Accept money directly (customers pay via PayPal on a separate page)
- Contact the property owner (that's done manually by admin)
- Send the confirmation email itself (admin triggers it)
- Answer questions unrelated to VIDI VICI (it's strictly scoped)

---

## Where to Configure Wire Transfer Details

Go to: **Admin → Settings → Wire Transfer Instructions**

Fill in:
- Bank Name
- Account Number
- Routing Number
- SWIFT Code
- Bank Address

These fields are pulled automatically into the Step 5 confirmation email. **If these are empty, the email will send without wire instructions — so make sure they're filled in before going live.**

---

## Email Notifications Summary

| Trigger | Who Gets Notified | What It Says |
|---|---|---|
| Mark creates a booking | Admin | New booking details + admin link |
| Customer pays deposit | Admin | Deposit confirmed + remaining balance + admin link |
| Admin clicks "Send Confirmation" | Customer | Booking confirmed + wire instructions + upload link |
| Customer uploads wire proof | Admin | Proof received + admin link to review |

---

## Tech Architecture (Quick Overview)

```
Customer chat
    └─► /api/chat/route.ts (GPT-4o with tools)
            ├─► search_cars / search_villas / search_events  (reads DB)
            ├─► check_availability  (checks Booking + MarkBooking tables)
            └─► create_mark_booking  (writes MarkBooking to DB, emails admin)

Customer deposit page
    └─► /mark/pay?token=...  →  /api/mark/pay  →  PayPal capture

Admin admin panel
    └─► /admin/mark-bookings/[id]
            ├─► PUT /api/admin/mark-bookings/[id]  (status updates)
            └─► POST /api/admin/mark-bookings/[id]/send-confirmation  (emails customer)

Customer wire upload page
    └─► /mark/upload-proof?token=...  →  /api/mark/upload-proof  →  saves file, emails admin
```
