import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../../data/customers";

const API_TOKEN = process.env.API_TOKEN;

// Debug API token configuration
console.log('API Token configured:', !!API_TOKEN);
console.log('API Token value:', API_TOKEN);

// Define the Customer type
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock database (replace with actual database in production)
let customers: Customer[] = [];

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

// GET /api/customers
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const customer = getCustomerById(id as string);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer);
  }
  
  return res.status(200).json(getCustomers());
}

// POST /api/customers
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, phone, address, status } = req.body;

  console.log('Received customer data:', req.body);

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }
  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  // Validate status
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be either 'active' or 'inactive'" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate phone format (basic validation)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid phone format" });
  }

  try {
    const newCustomer = createCustomer({
      name,
      email,
      phone,
      address,
      status,
    });

    console.log('Created new customer:', newCustomer);
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ message: "Failed to create customer" });
  }
}

// PUT /api/customers
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, email, phone, address, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  // Validate status if provided
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updatedCustomer = updateCustomer(id as string, {
    name,
    email,
    phone,
    address,
    status,
  });

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  return res.status(200).json(updatedCustomer);
}

// DELETE /api/customers
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  const deleted = deleteCustomer(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Customer not found" });
  }

  return res.status(200).json({ message: "Customer deleted successfully" });
}
