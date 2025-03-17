// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
type AdminMenu = {
  key: string;
  disabled?: boolean;
  icon?: string;
  label: string;
  baotri?: string;
  type?: "group" | "divider";
  badge?: number;
  children?: AdminMenu[];
};

const menuData: AdminMenu[] = [
  {
    key: "sub0",
    icon: "BellOutlined",
    label: "Messages",
    badge: 109,
    children: [
      { key: "0.1", label: "Messages", baotri: "1", disabled: true, badge: 43 },
      {
        key: "0.2",
        label: "Notifications",
        baotri: "1",
        disabled: true,
        badge: 66,
      },
    ],
  },
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
        key: "5",
        label: "Rooms",
        type: "group",
        children: [
          { key: "5.1", label: "Rooms Management", baotri: "0" },
          { key: "5.2", label: "Rooms Booking", baotri: "0" },
        ],
      },
    ],
  },
  {
    key: "sub4",
    label: "Services & Analytics",
    icon: "LineChartOutlined",

    children: [
      {
        key: "9",
        label: "Services & Invoices",
        type: "group",
        children: [
          { key: "9.1", label: "Services Management", baotri: "0" },
          { key: "9.2", label: "Invoices Management", baotri: "0" },
        ],
      },
      {
        key: "10",
        label: "Analytics & Report",
        type: "group",
        children: [
          { key: "10.1", label: "Analytics Management", baotri: "0" },
          { key: "10.2", label: "Report Management", baotri: "0" },
        ],
      },
    ],
  },
  {
    key: "sub5",
    label: "Settings",
    icon: "SettingOutlined",
    children: [
      { key: "11", label: "Settings", baotri: "0", disabled: true },
      { key: "12", label: "Logout", baotri: "1" },
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ menu: menuData });
}
