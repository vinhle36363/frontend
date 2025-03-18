import type { NextApiRequest, NextApiResponse } from "next";



const API_TOKEN = process.env.API_TOKEN; // Lấy token từ biến môi trường

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔹 API_TOKEN từ môi trường:", API_TOKEN);
  console.log("🔹 Token từ request:", req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];

  // Kiểm tra token
  if (!token || token !== API_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" }); // Trả về lỗi nếu token sai hoặc không có
  }

  // Dữ liệu menu
  const menuData = [
    {
      key: "sub1",
      icon: "CustomerServiceOutlined",
      label: "Customer Service",
      children: [
        {
          key: "g1",
          label: "User",
          type: "group",
          children: [
            { key: "1", label: "Customers Management", baotri: "0" },
            { key: "2", label: "Users Management", baotri: "0" },
          ],
        },
        {
          key: "g2",
          label: "Account",
          type: "group",
          children: [
            {
              key: "3",
              label: "Account Management",
              baotri: "1",
              disabled: true,
            },
            {
              key: "4",
              label: "Discount Management",
              baotri: "1",
              disabled: true,
            },
          ],
        },
      ],
    },
    {
      key: "sub2",
      icon: "HomeOutlined",
      label: "Rooms",
      children: [
        {
          key: "g3",
          label: "Rooms",
          type: "group",
          children: [
            { key: "5", label: "Rooms Management", baotri: "0" },
            { key: "6", label: "Rooms Booking", baotri: "0" },
          ],
        },
      ],
    },
    {
      key: "sub3",
      icon: "BellOutlined",
      label: "Messages",
      badge: 109,
      children: [
        { key: "7", label: "Messages", baotri: "1", disabled: true, badge: 43 },
        {
          key: "8",
          label: "Notifications",
          baotri: "1",
          disabled: true,
          badge: 66,
        },
      ],
    },
    {
      key: "sub4",
      label: "Services & Analytics",
      icon: "LineChartOutlined",
      children: [
        {
          key: "g4",
          label: "Services & Invoices",
          type: "group",
          children: [
            { key: "9", label: "Services Management", baotri: "0" },
            { key: "10", label: "Invoices Management", baotri: "0" },
          ],
        },
        {
          key: "g5",
          label: "Analytics & Report",
          type: "group",
          children: [
            { key: "11", label: "Analytics Management", baotri: "0" },
            { key: "12", label: "Report Management", baotri: "0" },
          ],
        },
      ],
    },
    {
      key: "sub5",
      label: "Settings",
      icon: "SettingOutlined",
      children: [
        { key: "13", label: "Settings", baotri: "0", disabled: true },
        { key: "14", label: "Logout", baotri: "1" },
      ],
    },
  ];

  res.status(200).json({ menu: menuData });
}
