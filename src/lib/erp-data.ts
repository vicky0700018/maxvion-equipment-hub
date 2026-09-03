// Mock ERP data for the MAXVION Industrial ERP demo. Frontend-only, no backend.

export type ID = string;

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const daysBetween = (iso: string) =>
  Math.round((new Date(iso).getTime() - new Date("2026-09-03").getTime()) / 86400000);

export interface Invoice {
  id: ID;
  no: string;
  customer: string;
  equipment: string;
  amount: number;
  gst: number;
  status: "Paid" | "Partially Paid" | "Unpaid" | "Overdue";
  date: string;
}

export interface Quotation {
  id: ID;
  no: string;
  customer: string;
  equipment: string;
  qty: number;
  basePrice: number;
  gstRate: number;
  validUntil: string;
  status: "Draft" | "Sent" | "Approved" | "Rejected" | "Expired";
}

export interface Proforma {
  id: ID;
  no: string;
  buyer: string;
  equipment: string;
  serial: string;
  qty: number;
  unitPrice: number;
  gstRate: number;
  deliveryTerms: string;
  paymentTerms: string;
}

export interface Product {
  id: ID;
  name: string;
  category: string;
  sku: string;
  serial: string;
  batch: string;
  qty: number;
  warehouse: string;
  purchasePrice: number;
  sellingPrice: number;
  warranty: string;
  amc: "Active" | "Not Applicable" | "Expiring" | "Expired";
  stock: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface SerialRecord {
  id: ID;
  serial: string;
  equipment: string;
  customer: string;
  installed: string;
  warrantyExpiry: string;
  amcExpiry: string;
  lastService: string;
  nextService: string;
  calibrationDue: string;
  status: "Installed" | "In Service" | "In Warehouse" | "Under Repair";
  timeline: { stage: string; date: string; note: string }[];
  history: { date: string; type: string; engineer: string; remarks: string }[];
}

export interface AMC {
  id: ID;
  customer: string;
  equipment: string;
  serial: string;
  start: string;
  end: string;
  nextService: string;
  engineer: string;
  status: "Active" | "Due Soon" | "Expired" | "Service Pending";
}

export interface Ticket {
  id: ID;
  customer: string;
  equipment: string;
  serial: string;
  issue: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  engineer: string;
  openDate: string;
  dueDate: string;
  status: "Open" | "Assigned" | "In Progress" | "Waiting for Parts" | "Resolved" | "Closed";
}

export interface Calibration {
  id: ID;
  equipment: string;
  serial: string;
  customer: string;
  last: string;
  next: string;
  certificate: string;
  safetyCert: "Valid" | "Expiring" | "Expired";
  sterilization: string;
  status: "Compliant" | "Due Soon" | "Overdue";
}

export interface Warranty {
  id: ID;
  equipment: string;
  serial: string;
  customer: string;
  start: string;
  end: string;
  status: "Active" | "Expiring Soon" | "Expired";
}

export interface Customer {
  id: ID;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  gstin: string;
  city: string;
  outstanding: number;
  contracts: number;
}

export interface Purchase {
  id: ID;
  no: string;
  vendor: string;
  equipment: string;
  qty: number;
  amount: number;
  delivery: string;
  status: "Draft" | "Ordered" | "Partially Received" | "Received" | "Cancelled";
}

export interface Vendor {
  id: ID;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  gstin: string;
  payable: number;
  status: "Active" | "On Hold" | "Blacklisted";
}

export interface SiteContent {
  heroTitle: string;
  heroDescription: string;
  aboutContent: string;
  solutionsIntro: string;
  servicesIntro: string;
  phone: string;
  email: string;
  address: string;
}

const uid = (p: string) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
export const newId = uid;

export const customers: Customer[] = [
  { id: "C1", name: "Apollo Diagnostics", type: "Diagnostic Centre", contact: "Rahul Mehta", phone: "020-4455 1201", email: "procure@apollodiag.demo", gstin: "27AABCA1234F1Z5", city: "Pune", outstanding: 845000, contracts: 4 },
  { id: "C2", name: "Pune Multispeciality Hospital", type: "Hospital", contact: "Dr. S. Kulkarni", phone: "020-6677 8890", email: "biomed@pmh.demo", gstin: "27AACCP7788K1Z2", city: "Pune", outstanding: 1560000, contracts: 6 },
  { id: "C3", name: "Meditech Research Labs", type: "Research Institution", contact: "Dr. Anita Rao", phone: "020-2211 4567", email: "labs@meditechres.demo", gstin: "27AAECM4433L1Z9", city: "Pune", outstanding: 420000, contracts: 3 },
  { id: "C4", name: "Maharashtra Government Health Services", type: "Government Institution", contact: "Procurement Cell", phone: "022-2202 9911", email: "tenders@mghs.demo", gstin: "27AAAGM0099P1ZQ", city: "Mumbai", outstanding: 1985000, contracts: 5 },
  { id: "C5", name: "Precision Clinical Laboratory", type: "Laboratory", contact: "Nikhil Deshpande", phone: "020-3344 7788", email: "ops@precisionlab.demo", gstin: "27AADCP5566N1Z4", city: "Pimpri", outstanding: 265000, contracts: 2 },
  { id: "C6", name: "Sunrise Diagnostic Centre", type: "Diagnostic Centre", contact: "Meera Joshi", phone: "020-2900 4411", email: "admin@sunrisedx.demo", gstin: "27AAFCS2211R1Z7", city: "Nashik", outstanding: 315000, contracts: 2 },
  { id: "C7", name: "Sahyadri Healthcare Infrastructure", type: "Healthcare Infrastructure Company", contact: "Amol Patil", phone: "020-4020 3030", email: "projects@sahyadriinfra.demo", gstin: "27AAGCS9090T1Z1", city: "Pune", outstanding: 640000, contracts: 3 },
  { id: "C8", name: "Deccan Institute of Life Sciences", type: "Research Institution", contact: "Dr. K. Iyer", phone: "020-2555 6677", email: "purchase@dils.demo", gstin: "27AAHCD3311V1Z8", city: "Pune", outstanding: 445000, contracts: 2 },
];

export const invoices: Invoice[] = [
  { id: "I1", no: "MAX/INV/2026-0148", customer: "Apollo Diagnostics", equipment: "Digital X-Ray Diagnostic Panel", amount: 1450000, gst: 12, status: "Paid", date: "2026-08-04" },
  { id: "I2", no: "MAX/INV/2026-0149", customer: "Pune Multispeciality Hospital", equipment: "Automated Autoclave Sterilizer Unit", amount: 985000, gst: 18, status: "Partially Paid", date: "2026-08-09" },
  { id: "I3", no: "MAX/INV/2026-0150", customer: "Meditech Research Labs", equipment: "Spectrophotometer Fluidic Tubing Kit", amount: 268000, gst: 18, status: "Unpaid", date: "2026-08-14" },
  { id: "I4", no: "MAX/INV/2026-0151", customer: "Maharashtra Government Health Services", equipment: "Patient Monitoring System (8 Units)", amount: 2240000, gst: 12, status: "Overdue", date: "2026-07-22" },
  { id: "I5", no: "MAX/INV/2026-0152", customer: "Precision Clinical Laboratory", equipment: "Laboratory Centrifuge", amount: 415000, gst: 18, status: "Paid", date: "2026-08-18" },
  { id: "I6", no: "MAX/INV/2026-0153", customer: "Sunrise Diagnostic Centre", equipment: "Laboratory Analyzer", amount: 730000, gst: 12, status: "Unpaid", date: "2026-08-21" },
  { id: "I7", no: "MAX/INV/2026-0154", customer: "Sahyadri Healthcare Infrastructure", equipment: "Medical Vacuum System", amount: 1180000, gst: 18, status: "Partially Paid", date: "2026-08-25" },
  { id: "I8", no: "MAX/INV/2026-0155", customer: "Deccan Institute of Life Sciences", equipment: "Laboratory Incubator (4 Units)", amount: 560000, gst: 18, status: "Unpaid", date: "2026-08-29" },
];

export const quotations: Quotation[] = [
  { id: "Q1", no: "MAX/QTN/2026-0311", customer: "Pune Multispeciality Hospital", equipment: "Anaesthesia Workstation", qty: 2, basePrice: 1250000, gstRate: 12, validUntil: "2026-09-25", status: "Sent" },
  { id: "Q2", no: "MAX/QTN/2026-0312", customer: "Apollo Diagnostics", equipment: "Digital X-Ray Diagnostic Panel", qty: 1, basePrice: 1450000, gstRate: 12, validUntil: "2026-09-18", status: "Approved" },
  { id: "Q3", no: "MAX/QTN/2026-0313", customer: "Meditech Research Labs", equipment: "Spectrophotometer Fluidic Tubing Kit", qty: 6, basePrice: 44500, gstRate: 18, validUntil: "2026-09-12", status: "Draft" },
  { id: "Q4", no: "MAX/QTN/2026-0314", customer: "Maharashtra Government Health Services", equipment: "Automated Autoclave Sterilizer Unit", qty: 4, basePrice: 985000, gstRate: 18, validUntil: "2026-10-05", status: "Sent" },
  { id: "Q5", no: "MAX/QTN/2026-0315", customer: "Precision Clinical Laboratory", equipment: "Laboratory Analyzer", qty: 1, basePrice: 730000, gstRate: 12, validUntil: "2026-08-20", status: "Expired" },
  { id: "Q6", no: "MAX/QTN/2026-0316", customer: "Sunrise Diagnostic Centre", equipment: "Patient Monitoring System", qty: 3, basePrice: 280000, gstRate: 12, validUntil: "2026-09-29", status: "Sent" },
  { id: "Q7", no: "MAX/QTN/2026-0317", customer: "Sahyadri Healthcare Infrastructure", equipment: "Medical Vacuum System", qty: 1, basePrice: 1180000, gstRate: 18, validUntil: "2026-09-15", status: "Rejected" },
  { id: "Q8", no: "MAX/QTN/2026-0318", customer: "Deccan Institute of Life Sciences", equipment: "Laboratory Incubator", qty: 4, basePrice: 140000, gstRate: 18, validUntil: "2026-10-02", status: "Approved" },
];

export const proformas: Proforma[] = [
  { id: "P1", no: "MAX/PI/2026-0087", buyer: "Maharashtra Government Health Services", equipment: "Automated Autoclave Sterilizer Unit", serial: "MAX-AUTO-2026-00131", qty: 4, unitPrice: 985000, gstRate: 18, deliveryTerms: "6-8 weeks, FOR site Mumbai", paymentTerms: "50% advance, 50% on installation" },
  { id: "P2", no: "MAX/PI/2026-0088", buyer: "Apollo Diagnostics", equipment: "Digital X-Ray Diagnostic Panel", serial: "MAX-XRAY-2026-00412", qty: 1, unitPrice: 1450000, gstRate: 12, deliveryTerms: "4 weeks, FOR site Pune", paymentTerms: "30% advance, 70% against delivery" },
  { id: "P3", no: "MAX/PI/2026-0089", buyer: "Meditech Research Labs", equipment: "Spectrophotometer Fluidic Tubing Kit", serial: "BATCH-SPF-2609", qty: 6, unitPrice: 44500, gstRate: 18, deliveryTerms: "2 weeks, ex-warehouse Hinjawadi", paymentTerms: "100% against proforma" },
  { id: "P4", no: "MAX/PI/2026-0090", buyer: "Pune Multispeciality Hospital", equipment: "Anaesthesia Workstation", serial: "MAX-ANWS-2026-00077", qty: 2, unitPrice: 1250000, gstRate: 12, deliveryTerms: "5 weeks, FOR site Pune", paymentTerms: "40% advance, 60% on commissioning" },
  { id: "P5", no: "MAX/PI/2026-0091", buyer: "Sunrise Diagnostic Centre", equipment: "Patient Monitoring System", serial: "MAX-PMS-2026-00298", qty: 3, unitPrice: 280000, gstRate: 12, deliveryTerms: "3 weeks, FOR site Nashik", paymentTerms: "Net 30 days" },
  { id: "P6", no: "MAX/PI/2026-0092", buyer: "Precision Clinical Laboratory", equipment: "Laboratory Centrifuge", serial: "MAX-CENT-2026-00505", qty: 2, unitPrice: 207500, gstRate: 18, deliveryTerms: "2 weeks, ex-warehouse", paymentTerms: "Net 15 days" },
];

export const products: Product[] = [
  { id: "PR1", name: "High-Precision Polymer Surgical Seals", category: "Consumables & Components", sku: "MAX-POLY-SEAL-01", serial: "—", batch: "BATCH-PS-2604 (Exp 2028-04)", qty: 4200, warehouse: "Hinjawadi WH-1", purchasePrice: 340, sellingPrice: 590, warranty: "Not Applicable", amc: "Not Applicable", stock: "In Stock" },
  { id: "PR2", name: "Automated Autoclave Sterilizer Unit", category: "Sterilization Equipment", sku: "MAX-AUTO-STR-12", serial: "MAX-AUTO-2026-00128", batch: "—", qty: 6, warehouse: "Hinjawadi WH-2", purchasePrice: 720000, sellingPrice: 985000, warranty: "24 Months", amc: "Active", stock: "In Stock" },
  { id: "PR3", name: "Spectrophotometer Fluidic Tubing Kits", category: "Scientific Equipment", sku: "MAX-SPF-KIT-08", serial: "—", batch: "BATCH-SPF-2609", qty: 84, warehouse: "Hinjawadi WH-1", purchasePrice: 28500, sellingPrice: 44500, warranty: "12 Months", amc: "Not Applicable", stock: "In Stock" },
  { id: "PR4", name: "Digital X-Ray Diagnostic Panels", category: "Diagnostic Equipment", sku: "MAX-XRAY-PNL-05", serial: "MAX-XRAY-2026-00412", batch: "—", qty: 3, warehouse: "Chakan WH-3", purchasePrice: 1080000, sellingPrice: 1450000, warranty: "36 Months", amc: "Active", stock: "Low Stock" },
  { id: "PR5", name: "Anaesthesia Workstation", category: "Medical Equipment", sku: "MAX-ANWS-22", serial: "MAX-ANWS-2026-00077", batch: "—", qty: 4, warehouse: "Hinjawadi WH-2", purchasePrice: 940000, sellingPrice: 1250000, warranty: "24 Months", amc: "Active", stock: "In Stock" },
  { id: "PR6", name: "Laboratory Centrifuge", category: "Laboratory Equipment", sku: "MAX-CENT-14", serial: "MAX-CENT-2026-00505", batch: "—", qty: 9, warehouse: "Hinjawadi WH-1", purchasePrice: 148000, sellingPrice: 207500, warranty: "18 Months", amc: "Expiring", stock: "In Stock" },
  { id: "PR7", name: "Patient Monitoring System", category: "Medical Equipment", sku: "MAX-PMS-30", serial: "MAX-PMS-2026-00298", batch: "—", qty: 11, warehouse: "Chakan WH-3", purchasePrice: 198000, sellingPrice: 280000, warranty: "24 Months", amc: "Active", stock: "In Stock" },
  { id: "PR8", name: "Surgical OT Equipment Set", category: "Surgical Machinery", sku: "MAX-OT-SET-09", serial: "MAX-OTS-2026-00061", batch: "—", qty: 2, warehouse: "Hinjawadi WH-2", purchasePrice: 1620000, sellingPrice: 2150000, warranty: "36 Months", amc: "Active", stock: "Low Stock" },
  { id: "PR9", name: "Laboratory Incubator", category: "Laboratory Equipment", sku: "MAX-INCB-07", serial: "MAX-INCB-2026-00219", batch: "—", qty: 7, warehouse: "Hinjawadi WH-1", purchasePrice: 96000, sellingPrice: 140000, warranty: "12 Months", amc: "Not Applicable", stock: "In Stock" },
  { id: "PR10", name: "Diagnostic Imaging Equipment (Ultrasound)", category: "Diagnostic Equipment", sku: "MAX-IMG-USG-11", serial: "MAX-USG-2026-00344", batch: "—", qty: 0, warehouse: "Chakan WH-3", purchasePrice: 1320000, sellingPrice: 1780000, warranty: "24 Months", amc: "Expired", stock: "Out of Stock" },
  { id: "PR11", name: "Medical Vacuum System", category: "Medical Infrastructure", sku: "MAX-VAC-SYS-04", serial: "MAX-VACS-2026-00090", batch: "—", qty: 3, warehouse: "Chakan WH-3", purchasePrice: 880000, sellingPrice: 1180000, warranty: "36 Months", amc: "Active", stock: "In Stock" },
  { id: "PR12", name: "Laboratory Analyzer", category: "Scientific Equipment", sku: "MAX-ANLZ-19", serial: "MAX-ANLZ-2026-00157", batch: "—", qty: 5, warehouse: "Hinjawadi WH-1", purchasePrice: 540000, sellingPrice: 730000, warranty: "24 Months", amc: "Active", stock: "In Stock" },
];

export const serials: SerialRecord[] = [
  {
    id: "S1", serial: "MAX-AUTO-2026-00128", equipment: "Automated Autoclave Sterilizer", customer: "Pune Multispeciality Hospital",
    installed: "2026-03-12", warrantyExpiry: "2028-03-11", amcExpiry: "2026-10-11", lastService: "2026-07-15", nextService: "2026-10-15", calibrationDue: "2026-09-20", status: "Installed",
    timeline: [
      { stage: "Purchase", date: "2026-01-18", note: "PO MAX/PO/2026-0042 — Steriline Industries" },
      { stage: "Warehouse Received", date: "2026-02-02", note: "Hinjawadi WH-2, QC cleared" },
      { stage: "Sold", date: "2026-02-27", note: "Invoice MAX/INV/2026-0149" },
      { stage: "Installed", date: "2026-03-12", note: "Commissioned by Eng. R. Shinde" },
      { stage: "Warranty Started", date: "2026-03-12", note: "24 months coverage" },
      { stage: "AMC Activated", date: "2026-03-12", note: "AMC/2026/018 — comprehensive" },
      { stage: "Service Visit", date: "2026-07-15", note: "Preventive maintenance completed" },
      { stage: "Calibration", date: "2026-03-20", note: "Certificate CAL-2026-0781" },
      { stage: "Next Service", date: "2026-10-15", note: "Scheduled quarterly visit" },
    ],
    history: [
      { date: "2026-07-15", type: "Preventive Maintenance", engineer: "R. Shinde", remarks: "Chamber gasket replaced, pressure test passed" },
      { date: "2026-05-08", type: "Breakdown Call", engineer: "A. Kadam", remarks: "Door interlock sensor replaced" },
      { date: "2026-03-20", type: "Calibration", engineer: "External NABL Agency", remarks: "Certificate CAL-2026-0781 issued" },
    ],
  },
  {
    id: "S2", serial: "MAX-XRAY-2026-00412", equipment: "Digital X-Ray Diagnostic Panel", customer: "Apollo Diagnostics",
    installed: "2026-04-05", warrantyExpiry: "2029-04-04", amcExpiry: "2027-04-04", lastService: "2026-08-02", nextService: "2026-11-02", calibrationDue: "2026-09-14", status: "Installed",
    timeline: [
      { stage: "Purchase", date: "2026-02-10", note: "PO MAX/PO/2026-0051" },
      { stage: "Warehouse Received", date: "2026-03-01", note: "Chakan WH-3" },
      { stage: "Sold", date: "2026-03-24", note: "Invoice MAX/INV/2026-0148" },
      { stage: "Installed", date: "2026-04-05", note: "Radiation safety clearance obtained" },
      { stage: "Warranty Started", date: "2026-04-05", note: "36 months coverage" },
      { stage: "AMC Activated", date: "2026-04-05", note: "AMC/2026/022" },
      { stage: "Service Visit", date: "2026-08-02", note: "Detector alignment check" },
      { stage: "Calibration", date: "2026-04-10", note: "AERB compliance verified" },
      { stage: "Next Service", date: "2026-11-02", note: "Scheduled" },
    ],
    history: [
      { date: "2026-08-02", type: "Preventive Maintenance", engineer: "S. Bhosale", remarks: "Detector alignment and image QC passed" },
      { date: "2026-04-10", type: "Calibration", engineer: "External NABL Agency", remarks: "AERB documentation filed" },
    ],
  },
  {
    id: "S3", serial: "MAX-ANWS-2026-00077", equipment: "Anaesthesia Workstation", customer: "Pune Multispeciality Hospital",
    installed: "2026-05-19", warrantyExpiry: "2028-05-18", amcExpiry: "2026-09-25", lastService: "2026-08-19", nextService: "2026-09-19", calibrationDue: "2026-10-30", status: "In Service",
    timeline: [
      { stage: "Purchase", date: "2026-03-30", note: "PO MAX/PO/2026-0064" },
      { stage: "Warehouse Received", date: "2026-04-20", note: "Hinjawadi WH-2" },
      { stage: "Sold", date: "2026-05-06", note: "PI MAX/PI/2026-0090" },
      { stage: "Installed", date: "2026-05-19", note: "OT-3 commissioning" },
      { stage: "Warranty Started", date: "2026-05-19", note: "24 months" },
      { stage: "AMC Activated", date: "2026-05-19", note: "AMC/2026/029" },
      { stage: "Service Visit", date: "2026-08-19", note: "Vaporiser calibration" },
      { stage: "Calibration", date: "2026-05-25", note: "Flow sensor certified" },
      { stage: "Next Service", date: "2026-09-19", note: "Due soon" },
    ],
    history: [
      { date: "2026-08-19", type: "Preventive Maintenance", engineer: "P. Gaikwad", remarks: "Vaporiser output verified" },
      { date: "2026-06-28", type: "Breakdown Call", engineer: "R. Shinde", remarks: "O2 sensor replaced under warranty" },
    ],
  },
  {
    id: "S4", serial: "MAX-ANLZ-2026-00157", equipment: "Laboratory Analyzer", customer: "Meditech Research Labs",
    installed: "2026-02-14", warrantyExpiry: "2028-02-13", amcExpiry: "2026-09-14", lastService: "2026-06-14", nextService: "2026-09-14", calibrationDue: "2026-08-28", status: "Under Repair",
    timeline: [
      { stage: "Purchase", date: "2025-12-11", note: "PO MAX/PO/2025-0388" },
      { stage: "Warehouse Received", date: "2026-01-06", note: "Hinjawadi WH-1" },
      { stage: "Sold", date: "2026-01-29", note: "Invoice MAX/INV/2026-0102" },
      { stage: "Installed", date: "2026-02-14", note: "Lab-2 bench install" },
      { stage: "Warranty Started", date: "2026-02-14", note: "24 months" },
      { stage: "AMC Activated", date: "2026-02-14", note: "AMC/2026/011" },
      { stage: "Service Visit", date: "2026-06-14", note: "Reagent line flush" },
      { stage: "Calibration", date: "2026-02-28", note: "Overdue re-calibration flagged" },
      { stage: "Next Service", date: "2026-09-14", note: "Pending part" },
    ],
    history: [
      { date: "2026-08-30", type: "Breakdown Call", engineer: "A. Kadam", remarks: "Awaiting fluidic pump spare" },
      { date: "2026-06-14", type: "Preventive Maintenance", engineer: "S. Bhosale", remarks: "Reagent lines flushed" },
    ],
  },
  {
    id: "S5", serial: "MAX-PMS-2026-00298", equipment: "Patient Monitoring System", customer: "Sunrise Diagnostic Centre",
    installed: "2026-06-08", warrantyExpiry: "2028-06-07", amcExpiry: "2027-06-07", lastService: "2026-08-10", nextService: "2026-11-10", calibrationDue: "2026-11-20", status: "Installed",
    timeline: [
      { stage: "Purchase", date: "2026-04-15", note: "PO MAX/PO/2026-0071" },
      { stage: "Warehouse Received", date: "2026-05-04", note: "Chakan WH-3" },
      { stage: "Sold", date: "2026-05-28", note: "PI MAX/PI/2026-0091" },
      { stage: "Installed", date: "2026-06-08", note: "3 bedside units" },
      { stage: "Warranty Started", date: "2026-06-08", note: "24 months" },
      { stage: "AMC Activated", date: "2026-06-08", note: "AMC/2026/033" },
      { stage: "Service Visit", date: "2026-08-10", note: "Sensor accuracy check" },
      { stage: "Calibration", date: "2026-06-18", note: "NIBP module certified" },
      { stage: "Next Service", date: "2026-11-10", note: "Scheduled" },
    ],
    history: [{ date: "2026-08-10", type: "Preventive Maintenance", engineer: "P. Gaikwad", remarks: "All 3 units within tolerance" }],
  },
  {
    id: "S6", serial: "MAX-VACS-2026-00090", equipment: "Medical Vacuum System", customer: "Sahyadri Healthcare Infrastructure",
    installed: "2026-07-02", warrantyExpiry: "2029-07-01", amcExpiry: "2027-07-01", lastService: "2026-08-28", nextService: "2026-11-28", calibrationDue: "2026-12-05", status: "Installed",
    timeline: [
      { stage: "Purchase", date: "2026-05-05", note: "PO MAX/PO/2026-0080" },
      { stage: "Warehouse Received", date: "2026-06-01", note: "Chakan WH-3" },
      { stage: "Sold", date: "2026-06-20", note: "Invoice MAX/INV/2026-0154" },
      { stage: "Installed", date: "2026-07-02", note: "Central plant room" },
      { stage: "Warranty Started", date: "2026-07-02", note: "36 months" },
      { stage: "AMC Activated", date: "2026-07-02", note: "AMC/2026/041" },
      { stage: "Service Visit", date: "2026-08-28", note: "Pump load test" },
      { stage: "Calibration", date: "2026-07-12", note: "Pressure gauges certified" },
      { stage: "Next Service", date: "2026-11-28", note: "Scheduled" },
    ],
    history: [{ date: "2026-08-28", type: "Preventive Maintenance", engineer: "R. Shinde", remarks: "Pump load test passed" }],
  },
];

export const amcs: AMC[] = [
  { id: "AMC/2026/018", customer: "Pune Multispeciality Hospital", equipment: "Automated Autoclave Sterilizer", serial: "MAX-AUTO-2026-00128", start: "2026-03-12", end: "2026-10-11", nextService: "2026-10-15", engineer: "R. Shinde", status: "Due Soon" },
  { id: "AMC/2026/022", customer: "Apollo Diagnostics", equipment: "Digital X-Ray Diagnostic Panel", serial: "MAX-XRAY-2026-00412", start: "2026-04-05", end: "2027-04-04", nextService: "2026-11-02", engineer: "S. Bhosale", status: "Active" },
  { id: "AMC/2026/029", customer: "Pune Multispeciality Hospital", equipment: "Anaesthesia Workstation", serial: "MAX-ANWS-2026-00077", start: "2026-05-19", end: "2026-09-25", nextService: "2026-09-19", engineer: "P. Gaikwad", status: "Due Soon" },
  { id: "AMC/2026/011", customer: "Meditech Research Labs", equipment: "Laboratory Analyzer", serial: "MAX-ANLZ-2026-00157", start: "2026-02-14", end: "2026-09-14", nextService: "2026-09-14", engineer: "A. Kadam", status: "Service Pending" },
  { id: "AMC/2026/033", customer: "Sunrise Diagnostic Centre", equipment: "Patient Monitoring System", serial: "MAX-PMS-2026-00298", start: "2026-06-08", end: "2027-06-07", nextService: "2026-11-10", engineer: "P. Gaikwad", status: "Active" },
  { id: "AMC/2026/041", customer: "Sahyadri Healthcare Infrastructure", equipment: "Medical Vacuum System", serial: "MAX-VACS-2026-00090", start: "2026-07-02", end: "2027-07-01", nextService: "2026-11-28", engineer: "R. Shinde", status: "Active" },
  { id: "AMC/2025/097", customer: "Precision Clinical Laboratory", equipment: "Laboratory Centrifuge", serial: "MAX-CENT-2026-00505", start: "2025-08-01", end: "2026-07-31", nextService: "—", engineer: "A. Kadam", status: "Expired" },
];

export const tickets: Ticket[] = [
  { id: "TKT-2026-0451", customer: "Meditech Research Labs", equipment: "Laboratory Analyzer", serial: "MAX-ANLZ-2026-00157", issue: "Fluidic pump pressure drop", priority: "Critical", engineer: "A. Kadam", openDate: "2026-08-30", dueDate: "2026-09-04", status: "Waiting for Parts" },
  { id: "TKT-2026-0452", customer: "Pune Multispeciality Hospital", equipment: "Anaesthesia Workstation", serial: "MAX-ANWS-2026-00077", issue: "Vaporiser output drift", priority: "High", engineer: "P. Gaikwad", openDate: "2026-09-01", dueDate: "2026-09-05", status: "In Progress" },
  { id: "TKT-2026-0453", customer: "Apollo Diagnostics", equipment: "Digital X-Ray Diagnostic Panel", serial: "MAX-XRAY-2026-00412", issue: "Image artifact on left quadrant", priority: "High", engineer: "S. Bhosale", openDate: "2026-08-28", dueDate: "2026-09-03", status: "Assigned" },
  { id: "TKT-2026-0454", customer: "Sunrise Diagnostic Centre", equipment: "Patient Monitoring System", serial: "MAX-PMS-2026-00298", issue: "SpO2 probe replacement", priority: "Medium", engineer: "P. Gaikwad", openDate: "2026-08-26", dueDate: "2026-09-06", status: "Open" },
  { id: "TKT-2026-0455", customer: "Precision Clinical Laboratory", equipment: "Laboratory Centrifuge", serial: "MAX-CENT-2026-00505", issue: "Rotor imbalance alarm", priority: "Medium", engineer: "A. Kadam", openDate: "2026-08-20", dueDate: "2026-08-27", status: "Resolved" },
  { id: "TKT-2026-0456", customer: "Sahyadri Healthcare Infrastructure", equipment: "Medical Vacuum System", serial: "MAX-VACS-2026-00090", issue: "Routine filter replacement", priority: "Low", engineer: "R. Shinde", openDate: "2026-08-18", dueDate: "2026-08-30", status: "Closed" },
  { id: "TKT-2026-0457", customer: "Maharashtra Government Health Services", equipment: "Automated Autoclave Sterilizer", serial: "MAX-AUTO-2026-00131", issue: "Chamber not reaching set pressure", priority: "Critical", engineer: "R. Shinde", openDate: "2026-09-02", dueDate: "2026-09-04", status: "Assigned" },
  { id: "TKT-2026-0458", customer: "Deccan Institute of Life Sciences", equipment: "Laboratory Incubator", serial: "MAX-INCB-2026-00219", issue: "Temperature deviation ±1.4°C", priority: "Medium", engineer: "S. Bhosale", openDate: "2026-08-31", dueDate: "2026-09-08", status: "In Progress" },
];

export const calibrations: Calibration[] = [
  { id: "CAL-2026-0781", equipment: "Automated Autoclave Sterilizer", serial: "MAX-AUTO-2026-00128", customer: "Pune Multispeciality Hospital", last: "2026-03-20", next: "2026-09-20", certificate: "CAL-2026-0781", safetyCert: "Valid", sterilization: "2026-08-29", status: "Due Soon" },
  { id: "CAL-2026-0802", equipment: "Digital X-Ray Diagnostic Panel", serial: "MAX-XRAY-2026-00412", customer: "Apollo Diagnostics", last: "2026-04-10", next: "2026-09-14", certificate: "CAL-2026-0802", safetyCert: "Expiring", sterilization: "—", status: "Due Soon" },
  { id: "CAL-2026-0744", equipment: "Laboratory Analyzer", serial: "MAX-ANLZ-2026-00157", customer: "Meditech Research Labs", last: "2026-02-28", next: "2026-08-28", certificate: "CAL-2026-0744", safetyCert: "Expired", sterilization: "—", status: "Overdue" },
  { id: "CAL-2026-0833", equipment: "Spectrophotometer", serial: "MAX-SPEC-2026-00611", customer: "Deccan Institute of Life Sciences", last: "2026-05-02", next: "2026-11-02", certificate: "CAL-2026-0833", safetyCert: "Valid", sterilization: "—", status: "Compliant" },
  { id: "CAL-2026-0850", equipment: "Laboratory Centrifuge", serial: "MAX-CENT-2026-00505", customer: "Precision Clinical Laboratory", last: "2026-06-11", next: "2026-12-11", certificate: "CAL-2026-0850", safetyCert: "Valid", sterilization: "—", status: "Compliant" },
  { id: "CAL-2026-0866", equipment: "Patient Monitoring System", serial: "MAX-PMS-2026-00298", customer: "Sunrise Diagnostic Centre", last: "2026-06-18", next: "2026-11-20", certificate: "CAL-2026-0866", safetyCert: "Valid", sterilization: "—", status: "Compliant" },
  { id: "CAL-2026-0699", equipment: "Anaesthesia Workstation", serial: "MAX-ANWS-2026-00077", customer: "Pune Multispeciality Hospital", last: "2026-05-25", next: "2026-10-30", certificate: "CAL-2026-0699", safetyCert: "Expiring", sterilization: "2026-08-15", status: "Compliant" },
];

export const warranties: Warranty[] = [
  { id: "W1", equipment: "Automated Autoclave Sterilizer", serial: "MAX-AUTO-2026-00128", customer: "Pune Multispeciality Hospital", start: "2026-03-12", end: "2028-03-11", status: "Active" },
  { id: "W2", equipment: "Digital X-Ray Diagnostic Panel", serial: "MAX-XRAY-2026-00412", customer: "Apollo Diagnostics", start: "2026-04-05", end: "2029-04-04", status: "Active" },
  { id: "W3", equipment: "Laboratory Centrifuge", serial: "MAX-CENT-2026-00505", customer: "Precision Clinical Laboratory", start: "2024-09-20", end: "2026-09-19", status: "Expiring Soon" },
  { id: "W4", equipment: "Laboratory Incubator", serial: "MAX-INCB-2026-00219", customer: "Deccan Institute of Life Sciences", start: "2025-07-01", end: "2026-06-30", status: "Expired" },
  { id: "W5", equipment: "Patient Monitoring System", serial: "MAX-PMS-2026-00298", customer: "Sunrise Diagnostic Centre", start: "2026-06-08", end: "2028-06-07", status: "Active" },
  { id: "W6", equipment: "Medical Vacuum System", serial: "MAX-VACS-2026-00090", customer: "Sahyadri Healthcare Infrastructure", start: "2026-07-02", end: "2029-07-01", status: "Active" },
  { id: "W7", equipment: "Anaesthesia Workstation", serial: "MAX-ANWS-2026-00077", customer: "Pune Multispeciality Hospital", start: "2026-05-19", end: "2028-05-18", status: "Active" },
  { id: "W8", equipment: "Laboratory Analyzer", serial: "MAX-ANLZ-2026-00157", customer: "Meditech Research Labs", start: "2026-02-14", end: "2026-09-30", status: "Expiring Soon" },
];

export const purchases: Purchase[] = [
  { id: "PO1", no: "MAX/PO/2026-0091", vendor: "Steriline Industries Pvt Ltd", equipment: "Automated Autoclave Sterilizer Unit", qty: 4, amount: 2880000, delivery: "2026-09-28", status: "Ordered" },
  { id: "PO2", no: "MAX/PO/2026-0092", vendor: "RadTech Imaging Systems", equipment: "Digital X-Ray Diagnostic Panel", qty: 2, amount: 2160000, delivery: "2026-10-12", status: "Partially Received" },
  { id: "PO3", no: "MAX/PO/2026-0093", vendor: "Polymed Components LLP", equipment: "Polymer Surgical Seals (5000 units)", qty: 5000, amount: 1700000, delivery: "2026-09-15", status: "Received" },
  { id: "PO4", no: "MAX/PO/2026-0094", vendor: "LabCore Scientific", equipment: "Laboratory Analyzer", qty: 3, amount: 1620000, delivery: "2026-10-05", status: "Ordered" },
  { id: "PO5", no: "MAX/PO/2026-0095", vendor: "VacuMed Systems", equipment: "Medical Vacuum System", qty: 1, amount: 880000, delivery: "2026-11-02", status: "Draft" },
  { id: "PO6", no: "MAX/PO/2026-0096", vendor: "CareMonitor Devices", equipment: "Patient Monitoring System", qty: 8, amount: 1584000, delivery: "2026-09-22", status: "Cancelled" },
];

export const vendors: Vendor[] = [
  { id: "V1", name: "Steriline Industries Pvt Ltd", category: "Sterilization Equipment", contact: "Manoj Sharma", phone: "022-4477 1122", email: "sales@steriline.demo", gstin: "27AABCS1122K1Z3", payable: 1240000, status: "Active" },
  { id: "V2", name: "RadTech Imaging Systems", category: "Diagnostic Equipment", contact: "Kavita Nair", phone: "080-3344 5566", email: "orders@radtech.demo", gstin: "29AACCR3344M1Z6", payable: 980000, status: "Active" },
  { id: "V3", name: "Polymed Components LLP", category: "Consumables & Components", contact: "Suresh Yadav", phone: "0265-227 8899", email: "supply@polymed.demo", gstin: "24AAFFP5566Q1Z0", payable: 320000, status: "Active" },
  { id: "V4", name: "LabCore Scientific", category: "Scientific Equipment", contact: "Dr. P. Menon", phone: "044-2288 7766", email: "info@labcore.demo", gstin: "33AAGCL7788N1Z5", payable: 745000, status: "On Hold" },
  { id: "V5", name: "VacuMed Systems", category: "Medical Infrastructure", contact: "Irfan Shaikh", phone: "020-6611 2200", email: "projects@vacumed.demo", gstin: "27AAHCV9900R1Z2", payable: 415000, status: "Active" },
  { id: "V6", name: "CareMonitor Devices", category: "Medical Equipment", contact: "Neha Bansal", phone: "011-4455 6677", email: "b2b@caremonitor.demo", gstin: "07AAJCC2233T1Z8", payable: 0, status: "Blacklisted" },
];

export const engineers = ["R. Shinde", "A. Kadam", "S. Bhosale", "P. Gaikwad", "M. Chavan"];

export const categories = [
  "Medical Equipment",
  "Surgical Machinery",
  "Scientific Equipment",
  "Diagnostic Equipment",
  "Laboratory Equipment",
  "Medical Infrastructure",
  "Consumables & Components",
  "Sterilization Equipment",
];

export const defaultContent: SiteContent = {
  heroTitle: "Smart Infrastructure Solutions for Medical, Surgical & Scientific Equipment",
  heroDescription:
    "A complete B2B equipment management and service ecosystem for hospitals, laboratories, diagnostic centers and institutional buyers.",
  aboutContent:
    "MAXVION INFRASTRUCTURE PRIVATE LIMITED is primarily involved in the wholesale, supply, servicing and infrastructure support of scientific, medical, surgical machinery and equipment. The company provides solutions for hospitals, laboratories, diagnostic centers, healthcare institutions, research facilities and other institutional buyers.",
  solutionsIntro:
    "End-to-end equipment supply, installation, service and compliance support across the healthcare and scientific research ecosystem.",
  servicesIntro:
    "Annual maintenance contracts, preventive service schedules, breakdown support and lifecycle management for high-value equipment.",
  phone: "2151254354",
  email: "maxvioninfrastructurepvtltd@gmail.com",
  address:
    "Office 237, 2nd Floor, Gera's Imperium Rise, Infotech Park (Hinjawadi), Haveli, Pune, Maharashtra, India - 411057",
};
