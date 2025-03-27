import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  calculateInvoiceTotals,
} from "../../data/invoices";

const API_TOKEN = process.env.API_TOKEN;
type InvoiceItem = {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
};

type Invoice = {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "cancelled";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock database (replace with actual database in production)
let invoices: Invoice[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Kiem tra API T0ken da duoc cau hinh chua
  if (!API_TOKEN) {
    console.error("❌ Chua config api token kia` ╰（‵□′）╯");
    return res
      .status(500)
      .json({ message: "Server configuration error: API_TOKEN is not set" });
  }
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle different HTTP methods
  switch (req.method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "PUT":
      return handlePut(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: "ko tim` thay phuong thuc" });
  }
}

// get invoice api
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (id) {
    const invoice = getInvoiceById(id as string);
    if (!invoice) {
      return res.status(404).json({ message: "ko tim` thay invoices id (ToT)/~~~" });
    }
    return res.status(200).json(invoice);
  }

  return res.status(200).json(getInvoices());
}

// post invoices api
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { customerId, customerName, items, tax, status, paymentMethod, notes } =
    req.body;

  if (
    !customerId ||
    !customerName ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !status
  ) {
    return res.status(400).json({ message: "Nhap thieu du lieu rui` kia` ╰（‵□′）╯" });
  }

  if (!["pending", "paid", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const { subtotal, total } = calculateInvoiceTotals(items, tax || 0);

  const newInvoice = createInvoice({
    customerId,
    customerName,
    items,
    subtotal,
    tax: tax || 0,
    total,
    status,
    paymentMethod,
    notes,
  });

  return res.status(201).json(newInvoice);
}

// put invoices api
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { customerId, customerName, items, tax, status, paymentMethod, notes } =
    req.body;

  if (!id) {
    return res.status(400).json({ message: "Ko tim` thay invoices id nhe" });
  }
  if (status && !["pending", "paid", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Them trang thai hoat dong kia` ma  ╰（‵□′）╯"  });
  }
  let subtotal = 0;
  let total = 0;
  if (items && Array.isArray(items)) {
    const totals = calculateInvoiceTotals(items, tax || 0);
    subtotal = totals.subtotal;
    total = totals.total;
  }

  const updatedInvoice = updateInvoice(id as string, {
    customerId,
    customerName,
    items,
    subtotal,
    tax: tax || 0,
    total,
    status,
    paymentMethod,
    notes,
  });

  if (!updatedInvoice) {
    return res.status(404).json({ message: "ko tim` thay invoices id nhe" });
  }

  return res.status(200).json(updatedInvoice);
}

// delete invoices api
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Chua co invoices id ne`" });
  }

  const deleted = deleteInvoice(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Ko tim` thay invoices id ne` OK?" });
  }

  return res.status(200).json({ message: "Xoa duoc rui`" });
}
