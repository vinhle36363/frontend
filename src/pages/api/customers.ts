import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../../data/customers";

const API_TOKEN = process.env.API_TOKEN;

// Ghi nhật ký cấu hình API token
console.log('API Token được cấu hình:', !!API_TOKEN);
console.log('Giá trị API Token:', API_TOKEN);

// Định nghĩa kiểu dữ liệu Customer
type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

// Cơ sở dữ liệu giả (thay thế bằng cơ sở dữ liệu thực tế trong môi trường sản xuất)
let customers: Customer[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Kiểm tra xem API_TOKEN đã được cấu hình chưa
  if (!API_TOKEN) {
    console.error("❌ API_TOKEN chưa được cấu hình!");
    return res.status(500).json({ message: "Ối giời ơi! Máy chủ quên cài API_TOKEN rồi!" });
  }
  // Thiết lập các header CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  // Xử lý các yêu cầu preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Xử lý các phương thức HTTP khác nhau
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
      return res.status(405).json({ message: "Phương thức này không chơi được đâu nha!" });
  }
}

// GET /api/customers
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (id) {
    const customer = getCustomerById(id as string);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng nào, chắc đi lạc rồi!" });
    }
    return res.status(200).json(customer);
  }
  
  return res.status(200).json(getCustomers());
}

// POST /api/customers
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, phone, address, status } = req.body;

  console.log('Dữ liệu khách hàng nhận được:', req.body);

  if (!name) {
    return res.status(400).json({ message: "Tên đâu rồi? Không có tên thì ai biết là ai!" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email đâu? Không có email thì gửi thư kiểu gì?" });
  }
  if (!phone) {
    return res.status(400).json({ message: "Số điện thoại đâu? Không có số thì gọi kiểu gì?" });
  }
  if (!address) {
    return res.status(400).json({ message: "Địa chỉ đâu? Không có địa chỉ thì ship kiểu gì?" });
  }
  if (!status) {
    return res.status(400).json({ message: "Trạng thái đâu? Không có trạng thái thì biết sống hay nghỉ?" });
  }
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái gì lạ vậy? Chỉ nhận 'active' hoặc 'inactive' thôi nha!" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email nhìn sai sai, kiểm tra lại đi!" });
  }
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Số điện thoại gì lạ vậy? Nhập lại cho đúng nha!" });
  }

  try {
    const newCustomer = createCustomer({
      name,
      email,
      phone,
      address,
      status,
    });

    console.log('Đã tạo khách hàng mới:', newCustomer);
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Lỗi khi tạo khách hàng:', error);
    return res.status(500).json({ message: "Ối giời ơi! Tạo khách hàng thất bại rồi!" });
  }
}

// PUT /api/customers
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, email, phone, address, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID khách hàng đâu? Không có ID thì sửa kiểu gì?" });
  }

  // Kiểm tra giá trị trạng thái nếu được cung cấp
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái gì lạ vậy? Chỉ nhận 'active' hoặc 'inactive' thôi nha!" });
  }

  const updatedCustomer = updateCustomer(id as string, {
    name,
    email,
    phone,
    address,
    status,
  });

  if (!updatedCustomer) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng nào để sửa, chắc đi lạc rồi!" });
  }

  return res.status(200).json(updatedCustomer);
}

// DELETE /api/customers
function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID khách hàng đâu? Không có ID thì xóa kiểu gì?" });
  }

  const deleted = deleteCustomer(id as string);
  if (!deleted) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng nào để xóa, chắc đi lạc rồi!" });
  }

  return res.status(200).json({ message: "Xóa khách hàng thành công, bye bye nha!" });
}
