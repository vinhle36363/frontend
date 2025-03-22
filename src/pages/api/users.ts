import type { NextApiRequest, NextApiResponse } from "next";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../data/users";

const API_TOKEN = process.env.API_TOKEN;

// Debug API token configuration
console.log('API Token configured:', !!API_TOKEN);
console.log('API Token value:', API_TOKEN);

// Define the User type
type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

// Mock database (replace with actual database in production)
let users: User[] = [];

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

// GET /api/users
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const user = getUserById(id as string);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }
  
  return res.status(200).json(getUsers());
}

// POST /api/users
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, role, status } = req.body;

  if (!username || !email || !role || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate role
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Validate status
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const newUser = createUser({
    username,
    email,
    role,
    status,
  });

  return res.status(201).json(newUser);
}

// PUT /api/users
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { username, email, role, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Validate role if provided
  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Validate status if provided
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updatedUser = updateUser(id as string, {
    username,
    email,
    role,
    status,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(updatedUser);
}

// DELETE /api/users
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const deleted = deleteUser(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User deleted successfully" });
} 