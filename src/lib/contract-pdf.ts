import { jsPDF } from "jspdf"

interface ContractData {
  bookingNumber: string
  customerName: string
  customerEmail: string
  itemName: string
  bookingType: string
  startDate: string
  endDate: string
  totalPrice: number
  pickupLocation?: string
  guests?: number
}

export function generateContractPdf(data: ContractData): Buffer {
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  let y = 0

  const GOLD = [183, 150, 90] as const       // #B7965A
  const DARK = [26, 26, 26] as const          // #1A1A1A
  const GRAY = [100, 100, 100] as const
  const LIGHT = [160, 160, 160] as const
  const WHITE = [255, 255, 255] as const
  const CREAM = [250, 248, 244] as const

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const fmtCurrency = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtShortDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  /* ------------------------------------------------------------------ */
  /*  PAGE 1 — Cover / Header                                           */
  /* ------------------------------------------------------------------ */

  // Dark header band
  doc.setFillColor(...DARK)
  doc.rect(0, 0, pw, 52, "F")

  // Gold accent line at bottom of header
  doc.setFillColor(...GOLD)
  doc.rect(0, 52, pw, 1.5, "F")

  // Company name
  doc.setTextColor(...WHITE)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.text("VIDI VICI", pw / 2, 22, { align: "center" })

  // Tagline
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...GOLD)
  doc.text("LUXURY RENTALS  ·  DOHA, QATAR", pw / 2, 31, { align: "center" })

  // Document type
  doc.setFontSize(13)
  doc.setTextColor(...WHITE)
  doc.setFont("helvetica", "bold")
  const titleLabel = data.bookingType === "car" ? "VEHICLE RENTAL AGREEMENT" :
    data.bookingType === "villa" ? "VILLA RENTAL AGREEMENT" : "EVENT BOOKING AGREEMENT"
  doc.text(titleLabel, pw / 2, 44, { align: "center" })

  y = 62

  // Booking ref + date row
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.setFont("helvetica", "normal")
  doc.text(`Agreement No: ${data.bookingNumber}`, 20, y)
  doc.text(`Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, pw - 20, y, { align: "right" })
  y += 12

  /* ------------------------------------------------------------------ */
  /*  Section helper                                                     */
  /* ------------------------------------------------------------------ */
  const sectionTitle = (title: string) => {
    doc.setFillColor(...GOLD)
    doc.rect(20, y - 4.5, 3, 7, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    doc.text(title, 27, y)
    y += 9
  }

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    doc.setTextColor(...GRAY)
    doc.text(label, 27, y)
    doc.setTextColor(...DARK)
    doc.setFont("helvetica", "bold")
    doc.text(value, 80, y)
    y += 6.5
  }

  const thinLine = () => {
    doc.setDrawColor(220, 218, 212)
    doc.setLineWidth(0.3)
    doc.line(20, y, pw - 20, y)
    y += 8
  }

  /* ------------------------------------------------------------------ */
  /*  PARTIES — Section 1                                                */
  /* ------------------------------------------------------------------ */
  sectionTitle("1. PARTIES")

  doc.setFillColor(...CREAM)
  doc.roundedRect(27, y - 3, pw - 47, 28, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text("LESSOR (Company)", 32, y + 3)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text("Vidi Vici Luxury Rentals, Doha, Qatar", 32, y + 9)
  doc.text("contact@vidivici.qa", 32, y + 15)

  doc.setFont("helvetica", "bold")
  doc.setTextColor(...DARK)
  doc.text("LESSEE (Customer)", pw / 2 + 5, y + 3)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...GRAY)
  doc.text(data.customerName, pw / 2 + 5, y + 9)
  doc.text(data.customerEmail, pw / 2 + 5, y + 15)

  y += 32
  thinLine()

  /* ------------------------------------------------------------------ */
  /*  RENTAL DETAILS — Section 2                                         */
  /* ------------------------------------------------------------------ */
  sectionTitle("2. RENTAL DETAILS")

  const typeLabel = data.bookingType === "car" ? "Vehicle" : data.bookingType === "villa" ? "Property" : "Event"
  row(`${typeLabel}:`, data.itemName)

  if (data.bookingType === "villa") {
    row("Check-in:", fmtDate(data.startDate))
    row("Check-out:", fmtDate(data.endDate))
    if (data.guests) row("Guests:", String(data.guests))
  } else {
    row("Start Date:", fmtDate(data.startDate))
    row("End Date:", fmtDate(data.endDate))
    if (data.pickupLocation) row("Pickup:", data.pickupLocation)
  }

  // Duration
  const msDay = 1000 * 60 * 60 * 24
  const dur = Math.max(1, Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / msDay))
  const durLabel = data.bookingType === "villa" ? `${dur} night${dur !== 1 ? "s" : ""}` : `${dur} day${dur !== 1 ? "s" : ""}`
  row("Duration:", durLabel)

  y += 2
  thinLine()

  /* ------------------------------------------------------------------ */
  /*  FINANCIAL SUMMARY — Section 3                                      */
  /* ------------------------------------------------------------------ */
  sectionTitle("3. FINANCIAL SUMMARY")

  doc.setFillColor(245, 243, 239)
  doc.roundedRect(27, y - 3, pw - 47, 14, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...DARK)
  doc.text("Total Amount Due:", 32, y + 5)
  doc.setTextColor(...GOLD)
  doc.text(fmtCurrency(data.totalPrice), pw - 25, y + 5, { align: "right" })
  y += 20

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...GRAY)
  doc.text("Payment has been authorized via PayPal. Final charge will be processed", 27, y)
  y += 4.5
  doc.text("once the contract is signed and the booking is confirmed by our team.", 27, y)
  y += 9
  thinLine()

  /* ------------------------------------------------------------------ */
  /*  TERMS & CONDITIONS — Section 4                                     */
  /* ------------------------------------------------------------------ */
  sectionTitle("4. TERMS & CONDITIONS")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...GRAY)

  const terms = data.bookingType === "car" ? [
    "1.  The Lessee shall return the vehicle in the same condition as received, normal wear accepted.",
    "2.  The Lessee is fully responsible for any damage, loss, or theft during the rental period.",
    "3.  Cancellations made less than 48 hours before the pickup date are non-refundable.",
    "4.  A refundable security deposit is held and returned upon satisfactory vehicle inspection.",
    "5.  The Lessee must possess a valid international or local driver's license at all times.",
    "6.  The vehicle must not be used for racing, off-road driving, or any illegal activity.",
    "7.  Smoking inside the vehicle is strictly prohibited. A cleaning fee of $500 will be charged.",
    "8.  Late returns will incur additional charges at 1.5× the applicable daily rate.",
    "9.  Fuel must be returned at the same level as provided; otherwise, refuelling charges apply.",
    "10. Mileage exceeding the included allowance will be billed at the agreed extra-mile rate.",
    "11. Sub-letting or unauthorized transfer of the vehicle to a third party is prohibited.",
    "12. Vidi Vici reserves the right to cancel any booking with full refund if deemed necessary.",
  ] : data.bookingType === "villa" ? [
    "1.  The Lessee shall maintain the property in good condition throughout the stay.",
    "2.  The Lessee is responsible for any damage caused during the rental period.",
    "3.  Cancellations made less than 72 hours before check-in are non-refundable.",
    "4.  A refundable security deposit is held and returned after satisfactory property inspection.",
    "5.  The Lessee must present valid ID or passport upon check-in.",
    "6.  Maximum occupancy must not exceed the agreed guest count.",
    "7.  Excessive noise after 11 PM is prohibited. Violations may result in early termination.",
    "8.  Smoking indoors is strictly prohibited. A cleaning fee of $1,000 will be charged.",
    "9.  Pets are not allowed unless prior written approval is obtained from the Lessor.",
    "10. Sub-letting or unauthorized events on the premises are strictly prohibited.",
    "11. All keys and access cards must be returned at check-out.",
    "12. Vidi Vici reserves the right to cancel any booking with full refund if deemed necessary.",
  ] : [
    "1.  The event must comply with all local regulations and venue policies.",
    "2.  Cancellations made less than 7 days before the event date are non-refundable.",
    "3.  The organizer is responsible for any damage caused during the event.",
    "4.  A refundable security deposit may be required and returned after inspection.",
    "5.  The agreed guest count must not be exceeded without prior approval.",
    "6.  Vidi Vici reserves the right to cancel any booking with full refund if deemed necessary.",
  ]

  for (const term of terms) {
    if (y > ph - 40) {
      doc.addPage()
      y = 20
    }
    const lines = doc.splitTextToSize(term, pw - 50)
    doc.text(lines, 27, y)
    y += lines.length * 4.5 + 2
  }

  y += 6
  thinLine()

  /* ------------------------------------------------------------------ */
  /*  PAGE 2 — Signatures (always start on new page)                     */
  /* ------------------------------------------------------------------ */
  doc.addPage()
  y = 25

  sectionTitle("5. SIGNATURES")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...GRAY)
  doc.text("By signing below, both parties agree to all terms and conditions outlined in this agreement.", 27, y)
  y += 14

  // Lessee signature block
  doc.setFillColor(...CREAM)
  doc.roundedRect(20, y - 3, (pw - 50) / 2, 44, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text("LESSEE (Customer)", 25, y + 4)
  doc.setDrawColor(...LIGHT)
  doc.setLineWidth(0.3)
  doc.line(25, y + 22, 25 + (pw - 60) / 2 - 10, y + 22)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text("Signature", 25, y + 27)
  doc.line(25, y + 36, 25 + (pw - 60) / 2 - 10, y + 36)
  doc.text("Date", 25, y + 41)

  // Lessor signature block
  const rightX = pw / 2 + 5
  doc.setFillColor(...CREAM)
  doc.roundedRect(pw / 2, y - 3, (pw - 50) / 2, 44, 2, 2, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text("LESSOR (Vidi Vici)", rightX, y + 4)
  doc.setDrawColor(...LIGHT)
  doc.line(rightX, y + 22, rightX + (pw - 60) / 2 - 10, y + 22)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text("Authorized Representative", rightX, y + 27)
  doc.line(rightX, y + 36, rightX + (pw - 60) / 2 - 10, y + 36)
  doc.text("Date", rightX, y + 41)

  y += 56

  /* ------------------------------------------------------------------ */
  /*  IMPORTANT NOTICE box                                               */
  /* ------------------------------------------------------------------ */
  doc.setFillColor(255, 248, 235)
  doc.roundedRect(20, y, pw - 40, 24, 2, 2, "F")
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.4)
  doc.roundedRect(20, y, pw - 40, 24, 2, 2, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...GOLD)
  doc.text("IMPORTANT", 26, y + 7)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text("Please sign this agreement and return it to contract@vidivici.qa within 48 hours.", 26, y + 13)
  doc.text("Your booking will be finalized and payment captured once the signed contract is received.", 26, y + 18)

  y += 32

  /* ------------------------------------------------------------------ */
  /*  Footer                                                             */
  /* ------------------------------------------------------------------ */
  const footerY = ph - 14
  doc.setFillColor(...DARK)
  doc.rect(0, footerY - 4, pw, 18, "F")
  doc.setFillColor(...GOLD)
  doc.rect(0, footerY - 4, pw, 1, "F")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(...LIGHT)
  doc.text("Vidi Vici Luxury Rentals  ·  Doha, Qatar  ·  contact@vidivici.qa", pw / 2, footerY + 4, { align: "center" })
  doc.text(`Agreement #${data.bookingNumber}  ·  Generated ${fmtShortDate(new Date().toISOString())}`, pw / 2, footerY + 9, { align: "center" })

  // Add same footer to page 1
  doc.setPage(1)
  doc.setFillColor(...DARK)
  doc.rect(0, footerY - 4, pw, 18, "F")
  doc.setFillColor(...GOLD)
  doc.rect(0, footerY - 4, pw, 1, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(...LIGHT)
  doc.text("Vidi Vici Luxury Rentals  ·  Doha, Qatar  ·  contact@vidivici.qa", pw / 2, footerY + 4, { align: "center" })
  doc.text(`Agreement #${data.bookingNumber}  ·  Page 1 of 2`, pw / 2, footerY + 9, { align: "center" })

  // Page 2 footer page number
  doc.setPage(2)
  doc.setFillColor(...DARK)
  doc.rect(0, footerY - 4, pw, 18, "F")
  doc.setFillColor(...GOLD)
  doc.rect(0, footerY - 4, pw, 1, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(...LIGHT)
  doc.text("Vidi Vici Luxury Rentals  ·  Doha, Qatar  ·  contact@vidivici.qa", pw / 2, footerY + 4, { align: "center" })
  doc.text(`Agreement #${data.bookingNumber}  ·  Page 2 of 2`, pw / 2, footerY + 9, { align: "center" })

  return Buffer.from(doc.output("arraybuffer"))
}
