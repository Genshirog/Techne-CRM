/**
 * JobOrderPDF.ts
 * Generates a Job Order PDF client-side using jsPDF.
 * Install: npm install jspdf
 * Mirrors the structure of show.blade.php exactly.
 */

import jsPDF from "jspdf"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobOrderPDFData {
  jobNo:         string
  projectTitle:  string
  status:        string
  technician:    string | null
  assignedBy:    string | null
  startDate:     string | null
  expectedFinish:string | null
  completedAt:   string | null

  customer: {
    name:    string
    address: string
    phone:   string
    email:   string
  }

  items: {
    name:        string
    description: string
    qty:         number
    unitPrice:   number
    source:      "Quotation" | "Technician"
  }[]

  scopes: {
    scenario: string
    cases:    { name: string; desc: string }[]
  }[]

  waivers: {
    title: string
    cases: { name: string; desc: string }[]
  }[]

  deliverables:    string[]
  timelineMin:     string
  timelineMax:     string
  technicianNotes: string

  customerName:        string
  customerSignature:   string
  customerDate:        string
  technicianSignature: string
  technicianDate:      string

  quotationRef: string
  inquiryRef:   string
  createdAt:    string
  updatedAt:    string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MARGIN    = 14
const PAGE_W    = 210
const CONTENT_W = PAGE_W - MARGIN * 2

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PHP = (n: number) =>
  "PHP " +
  new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

function hr(doc: jsPDF, y: number, color = "#cccccc"): number {
  doc.setDrawColor(color)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  return y + 5
}

function checkPage(doc: jsPDF, y: number, needed = 14): number {
  if (y + needed > 282) {
    doc.addPage()
    return 16
  }
  return y
}

function writeWrapped(
  doc:       jsPDF,
  text:      string,
  x:         number,
  y:         number,
  maxWidth:  number,
  lineH    = 5,
): number {
  const lines = doc.splitTextToSize(text || "—", maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

function sectionHeading(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text(label, MARGIN, y)
  doc.setFont("helvetica", "normal")
  return y + 6
}

function labelValue(
  doc:   jsPDF,
  label: string,
  value: string,
  x:     number,
  y:     number,
): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor("#111827")
  doc.text(label, x, y)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#374151")
  doc.text(value || "—", x + doc.getTextWidth(label) + 1.5, y)
  return y + 5.5
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateJobOrderPDF(data: JobOrderPDFData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = MARGIN

  // ── 1. Company Header ──────────────────────────────────────────────────────

  doc.setDrawColor("#cccccc")
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, CONTENT_W, 30)

  // Left cell — shaded logo area
  doc.setFillColor("#f7f7f7")
  doc.rect(MARGIN, y, CONTENT_W * 0.35, 30, "F")
  doc.setFontSize(8)
  doc.setTextColor("#999999")
  doc.text("Company Logo", MARGIN + (CONTENT_W * 0.35) / 2, y + 15, { align: "center" })

  // Right cell — company info
  const rx = MARGIN + CONTENT_W * 0.35 + 4
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("Techne Fixer Computer and Laptop Repair Services", rx, y + 7)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor("#444444")
  doc.text("Contact No: 09662406825", rx, y + 13)
  doc.text("007 Manga Street Crossing Bayabas, Davao City", rx, y + 18)

  doc.setDrawColor("#dddddd")
  doc.rect(rx - 2, y + 21, CONTENT_W * 0.65 - 4, 7)
  doc.setFontSize(7.5)
  doc.text(
    "Business ID: 2024-18343-92  |  Permit No: B-1894606-6  |  TIN No: 618-863-736-000000",
    rx, y + 26,
  )

  y += 34

  // ── 2. Job Information Block ───────────────────────────────────────────────

  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#374151")

  const jobInfoRows: [string, string][] = [
    ["Job Order #:",           data.jobNo],
    ["Project Title:",         data.projectTitle],
    ["Quotation Reference:",   data.quotationRef],
    ["Inquiry Reference:",     data.inquiryRef],
    ["Status:",                data.status],
    ["Technician Assigned:",   data.technician ?? "Unassigned"],
    ["Assigned By:",           data.assignedBy ?? "—"],
    ["Date Started:",          data.startDate ?? "Not Started"],
    ["Expected Finish Date:",  data.expectedFinish ?? "TBD"],
    ["Actual Completion:",     data.completedAt ?? "Pending"],
    ["Created:",               data.createdAt],
  ]

  jobInfoRows.forEach(([label, value]) => {
    y = checkPage(doc, y, 6)
    y = labelValue(doc, label, value, MARGIN, y)
  })

  y += 4

  // ── 3. Client Details Card ─────────────────────────────────────────────────

  y = checkPage(doc, y, 32)

  doc.setDrawColor("#cccccc")
  doc.rect(MARGIN, y, CONTENT_W, 30)

  doc.setFillColor("#f7f7f7")
  doc.rect(MARGIN, y, CONTENT_W * 0.35, 30, "F")
  doc.setFontSize(8)
  doc.setTextColor("#999999")
  doc.text("Client Photo / Logo", MARGIN + (CONTENT_W * 0.35) / 2, y + 15, { align: "center" })

  const cx = MARGIN + CONTENT_W * 0.35 + 4
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("Client Details", cx, y + 6)

  doc.setDrawColor("#cccccc")
  doc.line(cx - 2, y + 8, PAGE_W - MARGIN, y + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor("#374151")

  const clientRows: [string, string][] = [
    ["Client:",      data.customer.name    || "—"],
    ["Address:",     data.customer.address || "—"],
    ["Contact No:",  data.customer.phone   || "—"],
    ["Email:",       data.customer.email   || "—"],
  ]
  clientRows.forEach(([label, value], i) => {
    const ry = y + 13 + i * 5.5
    doc.setFont("helvetica", "bold"); doc.text(label, cx, ry)
    doc.setFont("helvetica", "normal"); doc.text(value, cx + doc.getTextWidth(label) + 2, ry)
  })

  y += 34

  // ── 4. Items & Services Table ──────────────────────────────────────────────

  y = checkPage(doc, y, 20)
  y = sectionHeading(doc, "Items and Services Used", y)

  // Column X offsets
  const COL = { item: 0, desc: 50, qty: 108, price: 124, total: 152, source: 178 }
  const HDR_H = 6

  // Header
  doc.setFillColor("#f3f4f6")
  doc.rect(MARGIN, y, CONTENT_W, HDR_H, "F")
  doc.setDrawColor("#d1d5db")
  doc.rect(MARGIN, y, CONTENT_W, HDR_H)

  doc.setFontSize(7.5)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#374151")

  doc.text("Item / Part",    MARGIN + COL.item   + 1, y + 4)
  doc.text("Description",    MARGIN + COL.desc   + 1, y + 4)
  doc.text("Qty",            MARGIN + COL.qty    + 1, y + 4)
  doc.text("Unit Price",     MARGIN + COL.price  + 1, y + 4)
  doc.text("Total",          MARGIN + COL.total  + 1, y + 4)
  doc.text("Source",         MARGIN + COL.source + 1, y + 4)

  y += HDR_H

  let quotationSub = 0
  let techSub      = 0

  data.items.forEach((item) => {
    y = checkPage(doc, y, 7)
    const lineTotal = item.qty * item.unitPrice
    const isQuote   = item.source === "Quotation"

    if (isQuote) quotationSub += lineTotal
    else         techSub      += lineTotal

    // Row background
    if (isQuote) {
      doc.setFillColor("#f9fafb")
      doc.rect(MARGIN, y, CONTENT_W, 6.5, "F")
    }

    doc.setDrawColor("#e5e7eb")
    doc.rect(MARGIN, y, CONTENT_W, 6.5)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(isQuote ? "#6b7280" : "#111827")

    const name = doc.splitTextToSize(item.name || "—", 47)[0]
    const desc = doc.splitTextToSize(item.description || "—", 56)[0]

    doc.text(name,            MARGIN + COL.item   + 1, y + 4.5)
    doc.text(desc,            MARGIN + COL.desc   + 1, y + 4.5)
    doc.text(String(item.qty),MARGIN + COL.qty    + 1, y + 4.5)
    doc.text(PHP(item.unitPrice), MARGIN + COL.price + 1, y + 4.5)
    doc.text(PHP(lineTotal),  MARGIN + COL.total  + 1, y + 4.5)

    doc.setFontSize(7)
    doc.setTextColor(isQuote ? "#9ca3af" : "#6366f1")
    doc.text(item.source,     MARGIN + COL.source + 1, y + 4.5)

    y += 6.5
  })

  // Cost Summary
  y += 4
  const subtotal      = quotationSub + techSub
  const diagnosticFee = subtotal * 0.10
  const grandTotal    = subtotal + diagnosticFee

  const totalBlockX = MARGIN + CONTENT_W * 0.55
  const totalBlockW = CONTENT_W * 0.45

  const costRows: [string, string, boolean][] = [
    ["Quotation Subtotal:",    PHP(quotationSub),  false],
    ["Technician Items:",      PHP(techSub),        false],
    ["Diagnostic Fee (10%):",  PHP(diagnosticFee), false],
    ["Grand Total:",           PHP(grandTotal),     true ],
  ]

  costRows.forEach(([label, value, bold]) => {
    y = checkPage(doc, y, 6)
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(bold ? 9 : 8.5)
    doc.setTextColor(bold ? "#111827" : "#4b5563")

    if (bold) {
      doc.setDrawColor("#cccccc")
      doc.line(totalBlockX, y - 2, totalBlockX + totalBlockW, y - 2)
    }

    doc.text(label, totalBlockX, y)
    doc.text(value, totalBlockX + totalBlockW, y, { align: "right" })
    y += bold ? 6 : 5
  })

  y += 6

  // ── 5. Scope of Work ──────────────────────────────────────────────────────

  y = checkPage(doc, y, 14)
  y = hr(doc, y)
  y = sectionHeading(doc, "Scope of Work (Reference)", y)

  if (!data.scopes || data.scopes.length === 0) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#6b7280")
    doc.text("No scope defined.", MARGIN, y); y += 6
  } else {
    data.scopes.forEach((sc, i) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor("#111827")
      doc.text(`${i + 1}. ${sc.scenario}`, MARGIN, y); y += 5

      sc.cases.forEach((c) => {
        y = checkPage(doc, y, 7)
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
        doc.text("•", MARGIN + 4, y)
        doc.setFont("helvetica", "bold")
        doc.text(c.name + ":", MARGIN + 8, y)
        doc.setFont("helvetica", "normal")
        const afterLabel = MARGIN + 8 + doc.getTextWidth(c.name + ": ")
        y = writeWrapped(doc, c.desc, afterLabel, y, CONTENT_W - (afterLabel - MARGIN) - 2)
        y += 1
      })
      y += 3
    })
  }

  // ── 6. Waiver of Liability ────────────────────────────────────────────────

  y = checkPage(doc, y, 20)
  y = hr(doc, y)
  y = sectionHeading(doc, "Waiver of Liability (Reference)", y)

  if (!data.waivers || data.waivers.length === 0) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#6b7280")
    doc.text("No waiver information available.", MARGIN, y); y += 6
  } else {
    data.waivers.forEach((w) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor("#111827")
      doc.text(w.title, MARGIN, y); y += 5

      w.cases.forEach((c) => {
        y = checkPage(doc, y, 7)
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
        doc.text("•", MARGIN + 4, y)
        doc.setFont("helvetica", "bold")
        doc.text(c.name + ":", MARGIN + 8, y)
        doc.setFont("helvetica", "normal")
        const afterLabel = MARGIN + 8 + doc.getTextWidth(c.name + ": ")
        y = writeWrapped(doc, c.desc, afterLabel, y, CONTENT_W - (afterLabel - MARGIN) - 2)
        y += 1
      })
      y += 3
    })
  }

  // ── 7. Deliverables ───────────────────────────────────────────────────────

  if (data.deliverables && data.deliverables.length > 0) {
    y = checkPage(doc, y, 14)
    y = hr(doc, y)
    y = sectionHeading(doc, "Deliverables Verified", y)

    data.deliverables.forEach((d) => {
      y = checkPage(doc, y, 6)
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
      doc.text("•", MARGIN + 4, y)
      y = writeWrapped(doc, d, MARGIN + 9, y, CONTENT_W - 11)
      y += 1
    })
    y += 4
  }

  // ── 8. Timeline ───────────────────────────────────────────────────────────

  y = checkPage(doc, y, 10)
  y = hr(doc, y)
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  const timelineStr =
    data.timelineMin && data.timelineMax
      ? `${data.timelineMin}–${data.timelineMax} days`
      : data.timelineMin
      ? `${data.timelineMin} days`
      : "TBD"
  doc.setFont("helvetica", "bold"); doc.text("Timeline:", MARGIN, y)
  doc.setFont("helvetica", "normal")
  doc.text(
    `Estimated ${timelineStr} | Expected completion: ${data.expectedFinish ?? "TBD"}.`,
    MARGIN + doc.getTextWidth("Timeline: ") + 1, y,
  )
  y += 7

  // ── 9. Technician Notes ───────────────────────────────────────────────────

  y = checkPage(doc, y, 16)
  y = hr(doc, y)
  y = sectionHeading(doc, "Technician Notes / Findings", y)
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    data.technicianNotes || "No notes recorded.",
    MARGIN, y, CONTENT_W,
  )
  y += 6

  // ── 10. Acceptance / Signatures ───────────────────────────────────────────

  y = checkPage(doc, y, 44)
  y = hr(doc, y)
  y = sectionHeading(doc, "Acceptance of Completed Work", y)

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    "By signing below, both parties confirm that all listed services were rendered in accordance with the agreed scope and that the work has been inspected and accepted.",
    MARGIN, y, CONTENT_W,
  )
  y += 6

  const halfW = (CONTENT_W - 10) / 2
  const col2X = MARGIN + halfW + 10

  const sigBlock = (
    x:     number,
    role:  string,
    name:  string,
    sig:   string,
    date:  string,
  ) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor("#111827")
    doc.text(role, x, y)

    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
    doc.text(name || "___________________________", x, y + 6)

    doc.text("Signature / eSign:", x, y + 13)
    doc.setDrawColor("#cccccc")
    doc.line(x + 32, y + 13, x + halfW - 2, y + 13)
    if (sig) { doc.setFontSize(7); doc.text(sig, x + 33, y + 12) }

    doc.setFontSize(8.5)
    doc.text("Date:", x, y + 20)
    doc.text(date || "___________________", x + 12, y + 20)
  }

  sigBlock(MARGIN, "Customer / Authorized Representative:", data.customerName,   data.customerSignature,   data.customerDate)
  sigBlock(col2X,  "Technician:",                           data.technician ?? "",data.technicianSignature, data.technicianDate)

  y += 28

  // ── 11. Footer ────────────────────────────────────────────────────────────

  y = checkPage(doc, y, 10)
  hr(doc, y)
  doc.setFontSize(8); doc.setTextColor("#9ca3af"); doc.setFont("helvetica", "normal")
  doc.text(
    "Techne Fixer Computer and Laptop Repair Services | Job Order",
    PAGE_W / 2, y + 5, { align: "center" },
  )

  // ── Save ──────────────────────────────────────────────────────────────────

  const pdfUrl = doc.output("bloburl")
  window.open(pdfUrl, "_blank")   
}