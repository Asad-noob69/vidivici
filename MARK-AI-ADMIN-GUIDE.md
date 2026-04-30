# Admin Guide — Observing & Managing Mark AI Bookings

This is the action guide for the admin team. Everything you need to monitor Mark AI's work, take action at each stage, and keep the booking pipeline moving.

---

## Where to Find Mark AI Bookings

Go to: **Admin Panel → Mark AI Bookings** (`/admin/mark-bookings`)

This is a dedicated section — completely separate from the regular car/villa bookings. Every booking Mark creates through chat shows up here.

---

## The Booking List Page

At a glance you'll see:

- **Stats bar at the top:**
  - Total bookings
  - Active bookings (anything not closed or cancelled)
  - Total deposits received (USD)
  - Total pipeline value (USD)

- **Searchable, filterable table** showing every booking with:
  - Booking number (e.g. `MK-A4BX`)
  - Customer name + email
  - Item booked (car/villa/event name)
  - Type badge
  - Dates
  - Total price
  - Deposit status (paid or pending)
  - Workflow status badge (color-coded)

### Filters Available:
| Filter | Options |
|---|---|
| Status | All, Booking Ready, Deposit Paid, Awaiting Owner, Owner Confirmed, Balance Info Sent, Proof Uploaded, Closed, Cancelled |
| Type | All, Car, Villa, Event |
| Search | Customer name, email, booking #, item name |

---

## The Booking Detail Page

Click any booking number to open the full detail view. This is where you take all actions.

### Layout Overview:

```
[ HEADER: Booking # + status badge + back arrow ]

[ WORKFLOW STEPPER: visual 7-step progress bar ]

[ Column 1 ]          [ Column 2 ]          [ Column 3 ]
Customer info         Pricing               Admin Notes
Booking details       Wire Proof (if any)   Activity Log
                      ACTION BUTTONS        Owner Notes (if any)
```

---

## Workflow Stepper

The stepper at the top shows the 7 stages visually:

```
[1 Booking Ready] → [2 Deposit Paid] → [3 Awaiting Owner] → [4 Owner Confirmed]
→ [5 Balance Info Sent] → [6 Proof Uploaded] → [7 Closed]
```

- **Green** = completed step
- **Black** = current step
- **Gray** = not yet reached

---

## Your Actions at Each Step

### 🔵 Status: `Booking Ready`

Mark created the booking. Customer hasn't paid yet.

**What you see:**
- Deposit payment link displayed (token URL)
- Text: "Share this link with the customer to pay their deposit."

**Your action:**
- If the customer paid through the chat link Mark gave them, they'll move to Deposit Paid automatically
- If they need help, you can manually share the deposit link shown on this page
- You can also **Cancel Booking** from here if needed

---

### 🟡 Status: `Deposit Paid`

Customer paid their deposit via PayPal. You received a notification email.

**Your action:**
1. Contact the car owner / property partner to check availability (phone/WhatsApp/email — this is manual)
2. Once you've made contact, click **"Send to Owner for Confirmation"**

This button just marks that you've escalated it to the owner — it doesn't automatically contact the owner.

---

### 🟠 Status: `Awaiting Owner`

You've contacted the owner and are waiting for their response.

**Your action (once you hear back):**
- Owner says **yes** → Click **"Owner Confirmed"** ✅
- Owner says **no** → Click **"Owner Declined"** (this cancels the booking and sets status to `cancelled`) ❌

---

### 🟣 Status: `Owner Confirmed`

Owner approved. Now you need to tell the customer to pay the remaining balance by wire.

**Your action:**
1. Set the **Balance Due Date** (date picker field appears) — this is the deadline for the customer to wire the money
2. Click **"Send Confirmation + Wire Instructions"**

The system will automatically email the customer with:
- Booking confirmed message
- Full booking summary
- Deposit received confirmation
- Remaining balance amount
- Due date you selected
- Bank wire instructions (from your Settings)
- Upload link for wire proof

> ⚠️ Make sure **Admin → Settings → Wire Transfer Instructions** is filled in before doing this or the wire details in the email will be blank.

---

### 🔵 Status: `Balance Info Sent`

Confirmation email has been sent. Customer is wiring the money.

**What you see:**
- Wire proof upload link is displayed (in case you need to manually share it)
- No action button — just waiting for the customer

**Your action:**
- Wait for the proof upload notification email
- If customer is having trouble, share the upload link shown on this page manually (via email or WhatsApp)

---

### 🟢 Status: `Proof Uploaded`

Customer uploaded their wire transfer receipt. You received a notification email.

**Your action:**
1. Click **"View Uploaded Proof"** to review the document
2. Verify the amount matches the balance due
3. Verify the recipient account matches your wire details
4. If everything is correct → Click **"Close Booking"** ✅
5. If something looks wrong → Add a note and contact the customer

---

### 🟢 Status: `Closed`

Booking is complete. Nothing more to do.

---

### 🔴 Status: `Cancelled`

Booking was cancelled. This is a terminal state — no further actions possible.

---

## Cancelling a Booking

On any active booking (except when in `awaiting_owner` state), you'll see a **"Cancel Booking"** button at the bottom of the Actions section.

You'll be asked to confirm before it cancels. Once cancelled, it cannot be undone through the UI.

---

## Admin Notes

Each booking has an **Admin Notes** text area (Column 3). Use this to:
- Record what you told the owner
- Note any special arrangements
- Log customer preferences
- Track issues or concerns

Click **"Save Notes"** to persist them. Notes are only visible to admin — not the customer.

---

## Activity Log

The **Activity Log** (Column 3) is automatically updated every time something happens. It's a reverse-chronological timestamped list of events:

Examples of what gets logged:
- `Booking created by Mark AI`
- `Deposit paid via PayPal`
- `Sent to owner for confirmation`
- `Owner confirmed availability`
- `Confirmation email sent with wire instructions`
- `Wire transfer proof uploaded`
- `Booking closed by associate`
- `Booking cancelled`

This gives you a full audit trail for every booking.

---

## Email Notifications You'll Receive

| Event | Email Subject | What's In It |
|---|---|---|
| Mark creates a booking | `New Mark AI Booking — [Item]` | Customer info, dates, price, direct admin link |
| Customer pays deposit | `Deposit Paid — [Booking #]` | Payment confirmed, remaining balance, admin link |
| Customer uploads wire proof | `Wire Proof Uploaded — [Booking #]` | Notification to review, admin link |

All notification emails go to the admin email configured in your environment.

---

## Setup Checklist (Before Going Live)

Make sure these are configured:

- [ ] **Wire Transfer Instructions** filled in at Admin → Settings
  - Bank Name
  - Account Number  
  - Routing Number
  - SWIFT Code
  - Bank Address
- [ ] **Admin notification email** configured in environment (`ADMIN_EMAIL`)
- [ ] **SMTP email settings** working (so confirmation emails go out)
- [ ] **PayPal credentials** configured (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`)
- [ ] **OpenAI API key** set (`OPENAI_API_KEY`)

---

## Quick Reference: What Mark Does vs. What You Do

| Stage | Mark AI | Admin Team |
|---|---|---|
| Customer asks about options | Searches inventory, shows results | — |
| Customer wants to book | Collects info, agrees price, checks availability | — |
| Booking created | Creates record, emails admin, shares deposit link in chat | Reviews notification email |
| Deposit paid | — | Contacts owner, clicks "Send to Owner" |
| Owner responds | — | Marks confirmed/declined, sets due date, sends confirmation email |
| Customer wires money | — | — |
| Customer uploads proof | — | Reviews proof, closes booking |

---

## Monitoring Tips

1. **Check the dashboard daily** — look for anything stuck in `deposit_paid` or `owner_confirmed` that hasn't moved
2. **Watch for the notification emails** — each stage sends you an email so you don't have to constantly check the panel
3. **Filter by "Active"** — use status filter to exclude `closed` and `cancelled` bookings to see only live pipeline
4. **Check the stats bar** — quick snapshot of deposits received and total pipeline value
5. **If a booking stays in `balance_info_sent` for too long** — check the wire proof upload link on the detail page and manually resend it to the customer if needed

---

## Common Questions

**Q: Can I edit the total price after the booking is created?**
Yes — the `totalPrice` field can be updated via the API (PUT `/api/admin/mark-bookings/[id]` with `{ totalPrice: newAmount }`). The balance due will automatically recalculate.

**Q: What if the customer paid the deposit but the owner cancels?**
Cancel the booking from the admin panel. You'll need to refund the deposit manually through PayPal (the system doesn't auto-refund).

**Q: Can two Mark bookings exist for the same item on overlapping dates?**
Mark checks availability before creating a booking and will warn the customer if the dates conflict. However, admin should also double-check with the owner as an extra safety measure.

**Q: Where are the wire proof files stored?**
At `public/uploads/wire-proofs/` on your server. Files are named `wire-proof-[token-prefix]-[timestamp].[ext]`.

**Q: What if the customer loses the wire upload link?**
Open the booking detail page. While in `balance_info_sent` status, the upload link is displayed. Copy it and share it with the customer directly.
