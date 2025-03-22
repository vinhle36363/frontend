import type { NextApiRequest, NextApiResponse } from "next";
import { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, calculateInvoiceTotals } from "../../data/invoices";

const API_TOKEN = process.env.API_TOKEN;

// Debug API token configuration
console.log('API Token configured:', !!API_TOKEN);
console.log('API Token value:', API_TOKEN);

// Define the Invoice type
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
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock database (replace with actual database in production)
let invoices: Invoice[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if API_TOKEN is configured
  if (!API_TOKEN) {
    console.error("❌ API_TOKEN is not configured!");
    return res.status(500).json({ message: "Server configuration error: API_TOKEN is not set" });
  }

  // Verify API token
  const authHeader = req.headers.authorization;
  console.log('Received authorization header:', authHeader);
  
  if (!authHeader) {
    console.error("❌ No authorization header provided");
    return res.status(401).json({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log('Received token:', token);
  
  if (!token) {
    console.error("❌ No token provided in authorization header");
    return res.status(401).json({ message: "No token provided in authorization header" });
  }

  if (token !== API_TOKEN) {
    console.error("❌ Invalid API token");
    console.error('Expected:', API_TOKEN);
    console.error('Received:', token);
    return res.status(401).json({ message: "Invalid API token" });
  }

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// GET /api/invoices
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const invoice = getInvoiceById(id as string);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    return res.status(200).json(invoice);
  }
  
  return res.status(200).json(getInvoices());
}

// POST /api/invoices
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { customerId, customerName, items, tax, status, paymentMethod, notes } = req.body;

  if (!customerId || !customerName || !items || !Array.isArray(items) || items.length === 0 || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate status
  if (!['pending', 'paid', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Calculate totals
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

// PUT /api/invoices
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { customerId, customerName, items, tax, status, paymentMethod, notes } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  // Validate status if provided
  if (status && !['pending', 'paid', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Calculate totals if items are provided
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
    return res.status(404).json({ message: "Invoice not found" });
  }

  return res.status(200).json(updatedInvoice);
}

// DELETE /api/invoices
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Invoice ID is required" });
  }

  const deleted = deleteInvoice(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  return res.status(200).json({ message: "Invoice deleted successfully" });
} 