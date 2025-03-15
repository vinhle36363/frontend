// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type AdminMenu = {
  key: string;
  label: string;
  baotri?: string;
  type?: "group" | "divider";
  children?: AdminMenu[];
};

const menuData: AdminMenu[] = [
  {
    key: "sub1",
    label: "Customers",
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
          { key: "3", label: "Account Management" , baotri: "1"},
          { key: "4", label: "Discount Management" , baotri: "1"},
        ],
      },
    ],
  },
  {
    key: "sub2",
    label: "Rooms",
    children: [
      { key: "5", label: "Rooms", type: "group", children: [
        { key: "5.1", label: "Rooms Management" , baotri: "0"},
        { key: "5.2", label: "Rooms Booking" , baotri: "0"},
    ]},
  ],
},
  {
    key: "sub4",
    label: "Services & Analytics",
    children: [
      { key: "9", label: "Services & Invoices" , type: "group", children: [
        { key: "9.1", label: "Services Management" , baotri: "0"},
        { key: "9.2", label: "Invoices Management" , baotri: "0"},
    ]},
      { key: "10", label: "Analytics & Report" , type: "group", children: [
        { key: "10.1", label: "Analytics Management" , baotri: "0"},
        { key: "10.2", label: "Report Management" , baotri: "0"},
    ]},
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ menu: menuData });
}
