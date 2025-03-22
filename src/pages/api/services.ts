import type { NextApiRequest, NextApiResponse } from "next";
import { getServices, getServiceById, createService, updateService, deleteService } from "../../data/services";

const API_TOKEN = process.env.API_TOKEN;

// Debug API token configuration
console.log('API Token configured:', !!API_TOKEN);
console.log('API Token value:', API_TOKEN);

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

// GET /api/services
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const service = getServiceById(id as string);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json(service);
  }
  
  return res.status(200).json(getServices());
}

// POST /api/services
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, price, category, status, imageUrl } = req.body;

  if (!name || !description || !price || !category || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate price
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  // Validate status
  if (!['available', 'unavailable'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const newService = createService({
    name,
    description,
    price,
    category,
    status,
    imageUrl,
  });

  return res.status(201).json(newService);
}

// PUT /api/services
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, description, price, category, status, imageUrl } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Service ID is required" });
  }

  // Validate price if provided
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ message: "Invalid price" });
  }

  // Validate status if provided
  if (status && !['available', 'unavailable'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updatedService = updateService(id as string, {
    name,
    description,
    price,
    category,
    status,
    imageUrl,
  });

  if (!updatedService) {
    return res.status(404).json({ message: "Service not found" });
  }

  return res.status(200).json(updatedService);
}

// DELETE /api/services
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Service ID is required" });
  }

  const deleted = deleteService(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Service not found" });
  }

  return res.status(200).json({ message: "Service deleted successfully" });
} 