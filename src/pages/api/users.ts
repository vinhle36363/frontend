import type { NextApiRequest, NextApiResponse } from "next";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../data/users";

const API_TOKEN = process.env.API_TOKEN;
type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

let users: User[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!API_TOKEN) {
    console.error("❌ API_TOKEN chưa được cấu hình!");
    return res.status(500).json({ message: "Lỗi cấu hình máy chủ: API_TOKEN chưa được thiết lập" });
  }

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
      return res.status(405).json({ message: "Phương thức không được phép" });
  }
}

// GET /api/users
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const user = getUserById(id as string);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    return res.status(200).json(user);
  }
  
  return res.status(200).json(getUsers());
}

// POST /api/users
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, role, status } = req.body;

  if (!username || !email || !role || !status) {
    return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
  }

  // Validate role
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ" });
  }

  // Validate status
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
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
    return res.status(400).json({ message: "Cần cung cấp ID người dùng" });
  }

  // Validate role if provided
  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ" });
  }

  // Validate status if provided
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  const updatedUser = updateUser(id as string, {
    username,
    email,
    role,
    status,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  return res.status(200).json(updatedUser);
}

// DELETE /api/users
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Cần cung cấp ID người dùng" });
  }

  const deleted = deleteUser(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  return res.status(200).json({ message: "Xóa người dùng thành công" });
}