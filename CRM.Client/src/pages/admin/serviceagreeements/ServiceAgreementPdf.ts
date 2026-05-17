/**
 * ServiceAgreementPDF.ts
 * Generates a Service Agreement PDF client-side using jsPDF.
 * Install: npm install jspdf
 *
 * Structure:
 *  1. Company Header
 *  2. Agreement Title + Reference Info
 *  3. Client Details
 *  4. Financial Summary
 *  5. Warranty Period
 *  6. Scope of Work
 *  7. Waiver of Liability + Indemnification
 *  8. Expected Deliverables
 *  9. Terms & Conditions
 * 10. Acceptance / Dual Signature Block
 * 11. Footer
 */

import jsPDF from "jspdf"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceAgreementPDFData {
  // IDs & refs
  agreementId:  number
  jobOrderId:   number
  quotationRef: string
  jobOrderRef:  string
  inquiryRef:   string

  // Status
  status: string
  issuedDate: string   // date the agreement was issued / created

  // Client (from Quotation nav)
  clientName:    string
  clientAddress: string
  clientPhone:   string
  clientEmail:   string
  projectTitle:  string

  // Financials (ServiceAgreement entity)
  finalLabor: number
  finalParts: number
  finalTotal: number

  // Warranty (ServiceAgreement entity)
  warrantyStart: string | null
  warrantyEnd:   string | null

  // Content (from Quotation nav)
  scopes: {
    scenario: string
    cases: { name: string; desc: string }[]
  }[]
  waivers: {
    title: string
    cases: { name: string; desc: string }[]
  }[]
  deliverables:    string[]
  termsConditions: string

  // Signatures (ServiceAgreementSignature entity)
  customerSignature:  string | null
  customerDate:       string | null
  providerName:       string
  providerSignature:  string | null
  providerDate:       string | null
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

function checkPage(doc: jsPDF, y: number, needed = 14): number {
  if (y + needed > 282) {
    doc.addPage()
    return 16
  }
  return y
}

function hr(doc: jsPDF, y: number, color = "#cccccc"): number {
  doc.setDrawColor(color)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  return y + 5
}

function sectionHeading(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text(label, MARGIN, y)
  doc.setFont("helvetica", "normal")
  return y + 6
}

function writeWrapped(
  doc:      jsPDF,
  text:     string,
  x:        number,
  y:        number,
  maxWidth: number,
  lineH   = 5,
): number {
  const lines = doc.splitTextToSize(text || "—", maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineH
}

function kv(
  doc:   jsPDF,
  label: string,
  value: string,
  x:     number,
  y:     number,
  labelW = 34,
): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor("#111827")
  doc.text(label, x, y)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#374151")
  doc.text(value || "—", x + labelW, y)
  return y + 5.5
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateServiceAgreementPDF(data: ServiceAgreementPDFData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = MARGIN

  // ── 1. Company Header ──────────────────────────────────────────────────────

  doc.setDrawColor("#cccccc")
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, CONTENT_W, 30)

  // Left cell — logo
  doc.setFillColor("#f7f7f7")
  doc.rect(MARGIN, y, CONTENT_W * 0.35, 30, "F")
  doc.setFontSize(8)
  doc.setTextColor("#999999")
  doc.text(
    "Company Logo",
    MARGIN + (CONTENT_W * 0.35) / 2, y + 15,
    { align: "center" },
  )

  // Right cell
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

  // ── 2. Agreement Title ────────────────────────────────────────────────────

  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("SERVICE AGREEMENT", PAGE_W / 2, y, { align: "center" })
  y += 7

  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#6b7280")
  doc.text(
    `SA-${String(data.agreementId).padStart(5, "0")}  ·  ${data.quotationRef}  ·  ${data.jobOrderRef}  ·  Issued: ${data.issuedDate}  ·  Status: ${data.status}`,
    PAGE_W / 2, y, { align: "center" },
  )
  y += 8

  y = hr(doc, y)

  // ── 3. Client Details ─────────────────────────────────────────────────────

  y = checkPage(doc, y, 34)

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

  const clientRows: [string, string][] = [
    ["Client:",   data.clientName    || "—"],
    ["Address:",  data.clientAddress || "—"],
    ["Phone:",    data.clientPhone   || "—"],
    ["Email:",    data.clientEmail   || "—"],
  ]
  clientRows.forEach(([label, value], i) => {
    const ry = y + 13 + i * 5
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.setTextColor("#111827")
    doc.text(label, cx, ry)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#374151")
    doc.text(value, cx + doc.getTextWidth(label) + 2, ry)
  })

  y += 34

  // ── 4. Project + Financial Summary ───────────────────────────────────────

  y = checkPage(doc, y, 36)
  y = sectionHeading(doc, "Project & Financial Summary", y)

  doc.setFontSize(8.5)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#374151")
  y = kv(doc, "Project Title:", data.projectTitle || "—", MARGIN, y)
  y = kv(doc, "Inquiry Ref:",   data.inquiryRef   || "—", MARGIN, y)
  y += 2

  // Financial table
  const finCols = { label: 0, value: 80 }
  const finRows: [string, string, boolean][] = [
    ["Final Labor:",  PHP(data.finalLabor), false],
    ["Final Parts:",  PHP(data.finalParts), false],
    ["Final Total:",  PHP(data.finalTotal), true ],
  ]

  finRows.forEach(([label, value, bold]) => {
    y = checkPage(doc, y, 6)

    if (bold) {
      doc.setFillColor("#f3f4f6")
      doc.rect(MARGIN, y - 4, 100, 7, "F")
      doc.setDrawColor("#e5e7eb")
      doc.rect(MARGIN, y - 4, 100, 7)
    }

    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(bold ? 9 : 8.5)
    doc.setTextColor(bold ? "#111827" : "#4b5563")
    doc.text(label, MARGIN + finCols.label + 2, y)
    doc.text(value, MARGIN + finCols.value,     y)
    y += bold ? 7 : 5.5
  })

  y += 5

  // ── 5. Warranty Period ────────────────────────────────────────────────────

  y = checkPage(doc, y, 16)
  y = hr(doc, y)
  y = sectionHeading(doc, "Warranty Period", y)

  if (data.warrantyStart && data.warrantyEnd) {
    doc.setFontSize(8.5)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#374151")
    y = kv(doc, "Warranty Start:", data.warrantyStart, MARGIN, y)
    y = kv(doc, "Warranty End:",   data.warrantyEnd,   MARGIN, y)
    y += 2

    // Warranty note box
    doc.setFillColor("#f0fdf4")
    doc.setDrawColor("#bbf7d0")
    doc.rect(MARGIN, y, CONTENT_W, 8, "FD")
    doc.setFontSize(8.5)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#166534")
    doc.text(
      "This agreement includes a 1-year parts and labor warranty under normal use conditions.",
      MARGIN + 3, y + 5,
    )
    y += 13
  } else {
    doc.setFontSize(8.5)
    doc.setFont("helvetica", "italic")
    doc.setTextColor("#9ca3af")
    doc.text("No warranty period defined for this agreement.", MARGIN, y)
    y += 6
  }

  // ── 6. Scope of Work ──────────────────────────────────────────────────────

  y = checkPage(doc, y, 14)
  y = hr(doc, y)
  y = sectionHeading(doc, "Scope of Work", y)

  if (!data.scopes || data.scopes.length === 0) {
    doc.setFont("helvetica", "italic")
    doc.setFontSize(8.5)
    doc.setTextColor("#9ca3af")
    doc.text("No scope defined.", MARGIN, y)
    y += 6
  } else {
    data.scopes.forEach((sc, i) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor("#111827")
      doc.text(`${i + 1}. ${sc.scenario}`, MARGIN, y)
      y += 5

      sc.cases.forEach((c) => {
        y = checkPage(doc, y, 7)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor("#374151")
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

  // ── 7. Waiver of Liability ────────────────────────────────────────────────

  y = checkPage(doc, y, 20)
  y = hr(doc, y)
  y = sectionHeading(doc, "Waiver of Liability", y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    `This Waiver of Liability is executed by ${data.clientName || "the Customer"} (the "Customer") ` +
    `in favor of Techne Fixer Computer and Laptop Repair Services (the "Service Provider").`,
    MARGIN, y, CONTENT_W,
  )
  y += 4

  if (!data.waivers || data.waivers.length === 0) {
    doc.setFont("helvetica", "italic")
    doc.setFontSize(8.5)
    doc.setTextColor("#9ca3af")
    doc.text("No waiver clauses defined.", MARGIN, y)
    y += 6
  } else {
    data.waivers.forEach((w) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor("#111827")
      doc.text(w.title, MARGIN, y)
      y += 5

      w.cases.forEach((c) => {
        y = checkPage(doc, y, 7)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8.5)
        doc.setTextColor("#374151")
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

  // Indemnification
  y = checkPage(doc, y, 16)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor("#111827")
  doc.text("Indemnification", MARGIN, y)
  y += 5
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    "The Customer agrees to indemnify and hold harmless the Service Provider from any claims, damages, " +
    "or expenses resulting from misuse or negligence of the repaired equipment after service completion.",
    MARGIN, y, CONTENT_W,
  )
  y += 6

  // ── 8. Expected Deliverables ──────────────────────────────────────────────

  if (data.deliverables && data.deliverables.length > 0) {
    y = checkPage(doc, y, 14)
    y = hr(doc, y)
    y = sectionHeading(doc, "Expected Deliverables", y)

    data.deliverables.forEach((d) => {
      y = checkPage(doc, y, 6)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor("#374151")
      doc.text("•", MARGIN + 4, y)
      y = writeWrapped(doc, d, MARGIN + 9, y, CONTENT_W - 11)
      y += 1
    })
    y += 4
  }

  // ── 9. Terms & Conditions ─────────────────────────────────────────────────

  if (data.termsConditions && data.termsConditions.trim()) {
    y = checkPage(doc, y, 16)
    y = hr(doc, y)
    y = sectionHeading(doc, "Terms and Conditions", y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor("#374151")
    y = writeWrapped(doc, data.termsConditions, MARGIN, y, CONTENT_W)
    y += 6
  }

  // ── 10. Acceptance / Signature Block ──────────────────────────────────────

  y = checkPage(doc, y, 52)
  y = hr(doc, y)
  y = sectionHeading(doc, "Acceptance of Terms", y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    "By signing below, both parties acknowledge and agree to all terms, conditions, scope, and " +
    "waiver clauses outlined in this Service Agreement, and authorize Techne Fixer Computer and " +
    "Laptop Repair Services to proceed with or confirm completion of the listed work.",
    MARGIN, y, CONTENT_W,
  )
  y += 7

  // Two-column signature block
  const halfW = (CONTENT_W - 10) / 2
  const col2X = MARGIN + halfW + 10

  const drawSigBlock = (
    x:     number,
    role:  string,
    name:  string,
    sig:   string | null,
    date:  string | null,
  ) => {
    // Role heading
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.setTextColor("#111827")
    doc.text(role, x, y)

    // Name
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor("#374151")
    doc.text(name || "___________________________", x, y + 6)

    // Signature line
    doc.text("Signature / eSign:", x, y + 13)
    doc.setDrawColor("#cccccc")
    doc.line(x + 32, y + 13, x + halfW - 2, y + 13)
    if (sig) {
      doc.setFontSize(7.5)
      doc.setTextColor("#6b7280")
      doc.text(sig, x + 33, y + 12)
      doc.setFontSize(8.5)
      doc.setTextColor("#374151")
    }

    // Date
    doc.text("Date:", x, y + 20)
    doc.text(date || "___________________", x + 12, y + 20)

    // Signed badge (if signed)
    if (sig && date) {
      doc.setFillColor("#f0fdf4")
      doc.setDrawColor("#bbf7d0")
      doc.rect(x, y + 24, halfW - 2, 6, "FD")
      doc.setFontSize(7.5)
      doc.setTextColor("#166534")
      doc.text("✓  Signed", x + 3, y + 28)
    }
  }

  drawSigBlock(
    MARGIN,
    "Customer / Authorized Representative:",
    data.clientName,
    data.customerSignature,
    data.customerDate,
  )
  drawSigBlock(
    col2X,
    "Service Provider Representative:",
    data.providerName,
    data.providerSignature,
    data.providerDate,
  )

  y += 36

  // ── 11. Footer ────────────────────────────────────────────────────────────

  y = checkPage(doc, y, 10)
  hr(doc, y)
  doc.setFontSize(8)
  doc.setTextColor("#9ca3af")
  doc.setFont("helvetica", "normal")
  doc.text(
    `Techne Fixer Computer and Laptop Repair Services  |  Service Agreement  |  SA-${String(data.agreementId).padStart(5, "0")}`,
    PAGE_W / 2, y + 5, { align: "center" },
  )

  // ── Save ──────────────────────────────────────────────────────────────────

  const pdfUrl = doc.output("bloburl")
  window.open(pdfUrl, "_blank")   
}