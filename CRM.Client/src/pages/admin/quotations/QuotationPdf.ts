/**
 * QuotationPDF.ts
 * Generates a quotation PDF client-side using jsPDF.
 * Install: npm install jspdf
 * Mirrors the structure of pdf.blade.php exactly.
 */

import jsPDF from "jspdf"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuotationPDFData {
  projectTitle: string
  objective: string
  dateIssued: string
  clientName: string
  clientAddress: string
  clientLogoPreview: string | null   // base64 data URL or null

  items: {
    name: string
    description: string
    qty: number
    unit_price: number
  }[]

  scopes: {
    scenario: string
    cases: { name: string; description: string }[]
  }[]

  waivers: {
    scenario: string
    cases: { name: string; description: string }[]
  }[]

  deliverables: { detail: string }[]

  timelineMin: string
  timelineMax: string

  termsConditions: string

  customerName: string
  customerSignature: string
  customerDate: string
  providerName: string
  providerSignature: string
  providerDate: string

  diagnosticFee: number
  serviceName: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PHP = (n: number) =>
  "PHP " + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const MARGIN = 14
const PAGE_W = 210   // A4 mm
const CONTENT_W = PAGE_W - MARGIN * 2

// Draws a horizontal rule
function hr(doc: jsPDF, y: number, color = "#cccccc"): number {
  doc.setDrawColor(color)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  return y + 4
}

// Wraps text and returns the new Y after writing
function writeWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5,
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

// Section heading
function sectionHeading(doc: jsPDF, label: string, y: number): number {
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text(label, MARGIN, y)
  doc.setFont("helvetica", "normal")
  return y + 6
}

// Checks if we need a new page; adds one if so
function checkPage(doc: jsPDF, y: number, needed = 12): number {
  if (y + needed > 280) {
    doc.addPage()
    return 16
  }
  return y
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateQuotationPDF(data: QuotationPDFData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  let y = MARGIN

  // ── 1. Company Header ──────────────────────────────────────────────────────

  // Box border
  doc.setDrawColor("#cccccc")
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, CONTENT_W, 28)

  // Left cell: shaded background + logo placeholder
  doc.setFillColor("#f7f7f7")
  doc.rect(MARGIN, y, CONTENT_W * 0.35, 28, "F")

  if (data.clientLogoPreview) {
    try {
      doc.addImage(data.clientLogoPreview, "JPEG", MARGIN + 2, y + 2, CONTENT_W * 0.35 - 4, 24)
    } catch {
      doc.setFontSize(8)
      doc.setTextColor("#999999")
      doc.text("Logo not found", MARGIN + 4, y + 14)
    }
  } else {
    doc.setFontSize(8)
    doc.setTextColor("#999999")
    doc.text("No Logo", MARGIN + (CONTENT_W * 0.35) / 2, y + 15, { align: "center" })
  }

  // Right cell: company info
  const rx = MARGIN + CONTENT_W * 0.35 + 4
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("Techne Fixer Computer and Laptop Repair Services", rx, y + 7)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor("#444444")
  doc.text("Contact No: 09662406825", rx, y + 13)
  doc.text("007 Manga Street Crossing Bayabas Davao City", rx, y + 18)

  // Business IDs box (nested inside right cell)
  doc.setDrawColor("#dddddd")
  doc.rect(rx - 2, y + 21, CONTENT_W * 0.65 - 4, 6)
  doc.setFontSize(7.5)
  doc.text("Business ID: 2024-18343-92  |  Permit No: B-1894606-6  |  TIN No: 618-863-736-000000", rx, y + 25)

  y += 32

  // ── 2. Project Title & Objective ──────────────────────────────────────────

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("Project Title:", MARGIN, y)
  doc.setFont("helvetica", "normal")
  doc.text(data.projectTitle || "—", MARGIN + 26, y)
  y += 6

  doc.setFont("helvetica", "bold")
  doc.text("Objective:", MARGIN, y)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#444444")
  y = writeWrapped(doc, data.objective || "—", MARGIN + 22, y, CONTENT_W - 22)
  y += 4

  // ── 3. Client Details Card ────────────────────────────────────────────────

  y = checkPage(doc, y, 32)

  // Card border
  doc.setDrawColor("#cccccc")
  doc.rect(MARGIN, y, CONTENT_W, 30)

  // Left cell: shaded (client photo placeholder)
  doc.setFillColor("#f7f7f7")
  doc.rect(MARGIN, y, CONTENT_W * 0.35, 30, "F")
  doc.setFontSize(8)
  doc.setTextColor("#999999")
  doc.text("Client Photo / Logo", MARGIN + (CONTENT_W * 0.35) / 2, y + 15, { align: "center" })

  // Right cell: client details
  const cx = MARGIN + CONTENT_W * 0.35 + 4
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#111827")
  doc.text("Client Details", cx, y + 6)

  doc.setDrawColor("#cccccc")
  doc.line(cx - 2, y + 8, PAGE_W - MARGIN, y + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor("#444444")

  const rows: [string, string][] = [
    ["Client:",       data.clientName    || "—"],
    ["Date Issued:",  data.dateIssued    || "—"],
    ["Address:",      data.clientAddress || "—"],
  ]
  rows.forEach(([label, value], i) => {
    const ry2 = y + 13 + i * 6
    doc.setFont("helvetica", "bold")
    doc.text(label, cx, ry2)
    doc.setFont("helvetica", "normal")
    doc.text(value, cx + 22, ry2)
  })

  y += 34

  // ── 4. Items & Services Table ─────────────────────────────────────────────

  y = checkPage(doc, y, 20)
  y = sectionHeading(doc, "Items and Services", y)

  // Table header
  const cols = { name: 0, desc: 48, qty: 110, price: 128, total: 158 }
  const colW = { name: 46, desc: 60, qty: 16, price: 28, total: 28 }

  doc.setFillColor("#f3f4f6")
  doc.rect(MARGIN, y, CONTENT_W, 6, "F")
  doc.setDrawColor("#cccccc")
  doc.rect(MARGIN, y, CONTENT_W, 6)

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#374151")

  doc.text("Item Name",       MARGIN + cols.name  + 1, y + 4)
  doc.text("Description",     MARGIN + cols.desc  + 1, y + 4)
  doc.text("Qty",             MARGIN + cols.qty   + 1, y + 4)
  doc.text("Unit Price (PHP)",MARGIN + cols.price + 1, y + 4)
  doc.text("Total (PHP)",     MARGIN + cols.total + 1, y + 4)

  y += 6

  // Table rows
  const subtotalItems = data.items.reduce((s, r) => s + r.qty * r.unit_price, 0)

  data.items.forEach((item) => {
    y = checkPage(doc, y, 8)

    doc.setDrawColor("#e5e7eb")
    doc.rect(MARGIN, y, CONTENT_W, 7)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor("#111827")

    // Truncate long text to fit columns
    const name = doc.splitTextToSize(item.name || "—", colW.name - 2)[0]
    const desc = doc.splitTextToSize(item.description || "—", colW.desc - 2)[0]

    doc.text(name,                            MARGIN + cols.name  + 1, y + 4.5)
    doc.text(desc,                            MARGIN + cols.desc  + 1, y + 4.5)
    doc.text(String(item.qty),                MARGIN + cols.qty   + 1, y + 4.5)
    doc.text(PHP(item.unit_price),            MARGIN + cols.price + 1, y + 4.5)
    doc.text(PHP(item.qty * item.unit_price), MARGIN + cols.total + 1, y + 4.5)

    y += 7
  })

  // Totals (right-aligned block, 40% width)
  y += 4
  const totalBlockX = MARGIN + CONTENT_W * 0.6
  const totalBlockW = CONTENT_W * 0.4

  const subtotal = subtotalItems
  const tax      = (subtotal + data.diagnosticFee) * 0.1
  const grand    = subtotal + data.diagnosticFee + tax

  const totalsRows: [string, string][] = [
    ["Subtotal (Labor):",                      PHP(subtotal)],
    [`Diagnostic Fee (${data.serviceName}):`,  PHP(data.diagnosticFee)],
    ["Tax (10%):",                             PHP(tax)],
    ["Grand Total:",                           PHP(grand)],
  ]

  totalsRows.forEach(([label, value], i) => {
    y = checkPage(doc, y, 6)
    const isBold = i === totalsRows.length - 1
    doc.setFont("helvetica", isBold ? "bold" : "normal")
    doc.setFontSize(9)
    doc.setTextColor(isBold ? "#111827" : "#4b5563")
    doc.text(label, totalBlockX, y)
    doc.text(value, totalBlockX + totalBlockW, y, { align: "right" })
    if (isBold) {
      doc.setDrawColor("#cccccc")
      doc.line(totalBlockX, y - 3, totalBlockX + totalBlockW, y - 3)
    }
    y += 5
  })

  y += 6

  // ── 5. Scope of Work ──────────────────────────────────────────────────────

  y = checkPage(doc, y, 14)
  y = hr(doc, y)
  y = sectionHeading(doc, "Scope of Work", y)

  if (data.scopes.length === 0) {
    doc.setFontSize(9); doc.setTextColor("#6b7280"); doc.text("No scope defined.", MARGIN, y); y += 6
  } else {
    data.scopes.forEach((sc) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor("#111827")
      doc.text(sc.scenario, MARGIN, y); y += 5

      sc.cases.forEach((c) => {
        y = checkPage(doc, y, 8)
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
        doc.text("•", MARGIN + 3, y)
        doc.setFont("helvetica", "bold"); doc.text(c.name + ":", MARGIN + 7, y)
        doc.setFont("helvetica", "normal")
        y = writeWrapped(doc, c.description, MARGIN + 7 + doc.getTextWidth(c.name + ": ") + 1, y, CONTENT_W - 20)
        y += 1
      })
      y += 3
    })
  }

  // ── 6. Waiver of Liability ────────────────────────────────────────────────

  y = checkPage(doc, y, 20)
  y = hr(doc, y)
  y = sectionHeading(doc, "Waiver of Liability", y)

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  const waiverIntro =
    `This Waiver of Liability is executed on ${data.dateIssued} by ${data.clientName || "_______________"} ` +
    `(the "Customer") in favor of Techne Fixer Computer and Laptop Repair Services (the "Service Provider").`
  y = writeWrapped(doc, waiverIntro, MARGIN, y, CONTENT_W)
  y += 4

  if (data.waivers.length > 0) {
    y = sectionHeading(doc, "Scope of Liability", y)
    data.waivers.forEach((w) => {
      y = checkPage(doc, y, 10)
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor("#111827")
      doc.text(w.scenario, MARGIN, y); y += 5

      w.cases.forEach((c) => {
        y = checkPage(doc, y, 8)
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
        doc.text("•", MARGIN + 3, y)
        doc.setFont("helvetica", "bold"); doc.text(c.name + ":", MARGIN + 7, y)
        doc.setFont("helvetica", "normal")
        y = writeWrapped(doc, c.description, MARGIN + 7 + doc.getTextWidth(c.name + ": ") + 1, y, CONTENT_W - 20)
        y += 1
      })
      y += 3
    })
  }

  // Indemnification
  y = checkPage(doc, y, 14)
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor("#111827")
  doc.text("Indemnification", MARGIN, y); y += 5
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    "The Customer agrees to indemnify and hold harmless the Service Provider from any claims, damages, or expenses resulting from misuse or negligence of the repaired equipment.",
    MARGIN, y, CONTENT_W,
  )
  y += 6

  // ── 7. Acceptance of Terms ────────────────────────────────────────────────

  y = checkPage(doc, y, 40)
  y = hr(doc, y)
  y = sectionHeading(doc, "Acceptance of Terms", y)

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
  y = writeWrapped(
    doc,
    "By signing below, the Customer acknowledges and agrees to the terms, conditions, and scope of this quotation and authorizes Techne Fixer Computer and Laptop Repair Services to proceed with the listed work and repairs.",
    MARGIN, y, CONTENT_W,
  )
  y += 6

  // Two-column signature block
  const halfW = (CONTENT_W - 8) / 2
  const col2X = MARGIN + halfW + 8

  const sigBlock = (x: number, role: string, name: string, sig: string, date: string) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor("#111827")
    doc.text(role, x, y)
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
    doc.text(name || "___________________________", x, y + 5)

    doc.text("Signature / eSign:", x, y + 11)
    doc.setDrawColor("#cccccc")
    doc.line(x + 30, y + 11, x + halfW - 2, y + 11)
    doc.text(sig || "", x + 31, y + 10)

    doc.text("Date:", x, y + 17)
    doc.text(date || data.dateIssued, x + 12, y + 17)
  }

  sigBlock(MARGIN, "Customer / Authorized Representative:", data.customerName, data.customerSignature, data.customerDate)
  sigBlock(col2X,  "Service Provider Representative:",      data.providerName, data.providerSignature, data.providerDate)

  y += 24

  // ── 8. Expected Deliverables ──────────────────────────────────────────────

  if (data.deliverables.length > 0) {
    y = checkPage(doc, y, 16)
    y = hr(doc, y)
    y = sectionHeading(doc, "Expected Deliverables", y)

    data.deliverables.forEach((d) => {
      y = checkPage(doc, y, 6)
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
      doc.text("•", MARGIN + 3, y)
      y = writeWrapped(doc, d.detail, MARGIN + 8, y, CONTENT_W - 10)
      y += 1
    })
    y += 4
  }

  // ── 9. Timeline ───────────────────────────────────────────────────────────

  y = checkPage(doc, y, 10)
  const timelineStr =
    data.timelineMin && data.timelineMax
      ? `${data.timelineMin}–${data.timelineMax} days`
      : data.timelineMin
      ? `${data.timelineMin} days`
      : "TBD"

  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor("#374151")
  doc.setFont("helvetica", "bold"); doc.text("Timeline:", MARGIN, y)
  doc.setFont("helvetica", "normal")
  doc.text(
    `Estimate project completion ${timelineStr} (depending on availability of replacement parts and completion of the issue)`,
    MARGIN + 20, y,
  )
  y += 6

  // ── 10. Terms & Conditions ────────────────────────────────────────────────

  if (data.termsConditions.trim()) {
    y = checkPage(doc, y, 16)
    y = hr(doc, y)
    y = sectionHeading(doc, "Terms and Conditions", y)
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor("#374151")
    y = writeWrapped(doc, data.termsConditions, MARGIN, y, CONTENT_W)
    y += 4
  }

  // ── 11. Footer ────────────────────────────────────────────────────────────

  y = checkPage(doc, y, 10)
  hr(doc, y)
  doc.setFontSize(8); doc.setTextColor("#9ca3af"); doc.setFont("helvetica", "normal")
  doc.text("Techne Fixer Computer and Laptop Repair Services | Quotation", PAGE_W / 2, y + 6, { align: "center" })

  // ── Save ─────────────────────────────────────────────────────────────────
  const pdfUrl = doc.output("bloburl")
  window.open(pdfUrl, "_blank")   
}