import type { NextApiRequest, NextApiResponse } from "next";
import { getServices, getServiceById, createService, updateService, deleteService } from "../../data/services";

const API_TOKEN = process.env.API_TOKEN;

// Debug API token configuration
console.log('API Token configured:', !!API_TOKEN);
console.log('API Token value:', API_TOKEN);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if API_TOKEN is configured
  if (!API_TOKEN) {
    console.error("❌ CHua config t0ken kia ma!");
    return res.status(500).json({ message: "Lỗi cấu hình máy chủ: API_TOKEN chưa được thiết lập" });
  }
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

// get services api
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const service = getServiceById(id as string);
    if (!service) {
      return res.status(404).json({ message: "Dịch vụ không tồn tại" });
    }
    return res.status(200).json(service);
  }
  
  return res.status(200).json(getServices());
}

// post services api
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, price, category, status, imageUrl } = req.body;

  if (!name || !description || !price || !category || !status) {
    return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
  }

  // Validate price
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: "Giá không hợp lệ" });
  }

  // Validate status
  if (!['available', 'unavailable'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
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
    return res.status(400).json({ message: "Cần cung cấp ID dịch vụ" });
  }

  // Validate price if provided
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ message: "Giá không hợp lệ" });
  }

  // Validate status if provided
  if (status && !['available', 'unavailable'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
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
    return res.status(404).json({ message: "Dịch vụ không tồn tại" });
  }

  return res.status(200).json(updatedService);
}

// DELETE /api/services
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Cần cung cấp ID dịch vụ" });
  }

  const deleted = deleteService(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Dịch vụ không tồn tại" });
  }

  return res.status(200).json({ message: "Xóa dịch vụ thành công" });
}