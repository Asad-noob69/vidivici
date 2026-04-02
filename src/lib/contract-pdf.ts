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
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  const center = (text: string, yPos: number, size: number = 12) => {
    doc.setFontSize(size)
    doc.text(text, pageWidth / 2, yPos, { align: "center" })
  }

  const left = (text: string, yPos: number, size: number = 11) => {
    doc.setFontSize(size)
    doc.text(text, 20, yPos)
  }

  const line = (yPos: number) => {
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos, pageWidth - 20, yPos)
  }

  // Header
  doc.setFont("helvetica", "bold")
  center("VIDI VICI", y, 22)
  y += 8
  doc.setFont("helvetica", "normal")
  center("Luxury Rentals", y, 12)
  y += 12
  line(y)
  y += 12

  // Title
  doc.setFont("helvetica", "bold")
  center("RENTAL AGREEMENT", y, 16)
  y += 12

  // Booking info
  doc.setFont("helvetica", "normal")
  left(`Booking Reference: ${data.bookingNumber}`, y)
  y += 7
  left(`Date Issued: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, y)
  y += 12
  line(y)
  y += 12

  // Customer details
  doc.setFont("helvetica", "bold")
  left("CUSTOMER DETAILS", y, 13)
  y += 9
  doc.setFont("helvetica", "normal")
  left(`Name: ${data.customerName}`, y)
  y += 7
  left(`Email: ${data.customerEmail}`, y)
  y += 12

  // Rental details
  doc.setFont("helvetica", "bold")
  left("RENTAL DETAILS", y, 13)
  y += 9
  doc.setFont("helvetica", "normal")

  const typeLabel = data.bookingType === "car" ? "Vehicle" : data.bookingType === "villa" ? "Property" : "Event"
  left(`${typeLabel}: ${data.itemName}`, y)
  y += 7

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  if (data.bookingType === "villa") {
    left(`Check-in: ${fmtDate(data.startDate)}`, y)
    y += 7
    left(`Check-out: ${fmtDate(data.endDate)}`, y)
    y += 7
    if (data.guests) {
      left(`Guests: ${data.guests}`, y)
      y += 7
    }
  } else {
    left(`Start Date: ${fmtDate(data.startDate)}`, y)
    y += 7
    left(`End Date: ${fmtDate(data.endDate)}`, y)
    y += 7
    if (data.pickupLocation) {
      left(`Pickup Location: ${data.pickupLocation}`, y)
      y += 7
    }
  }

  left(`Total Price: $${data.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, y)
  y += 12
  line(y)
  y += 12

  // Terms
  doc.setFont("helvetica", "bold")
  left("TERMS AND CONDITIONS", y, 13)
  y += 9
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  const terms = [
    "1. The renter agrees to return the rental item in the same condition as received.",
    "2. The renter is responsible for any damages during the rental period.",
    "3. Cancellations made less than 48 hours before the start date are non-refundable.",
    "4. A security deposit may be held and returned upon satisfactory inspection.",
    "5. The renter must provide valid identification and meet all eligibility requirements.",
    "6. Late returns may incur additional charges at the daily rate.",
    "7. Vidi Vici reserves the right to cancel any booking with full refund if necessary.",
    "8. By signing below, the renter acknowledges and accepts all terms above.",
  ]

  for (const term of terms) {
    const lines = doc.splitTextToSize(term, pageWidth - 45)
    doc.text(lines, 20, y)
    y += lines.length * 5 + 3
  }

  y += 8
  line(y)
  y += 16

  // Signature
  doc.setFontSize(11)
  left("Customer Signature: ________________________________", y)
  y += 10
  left("Date: ________________________________", y)
  y += 16

  left("Vidi Vici Representative: ________________________________", y)
  y += 10
  left("Date: ________________________________", y)

  return Buffer.from(doc.output("arraybuffer"))
}
