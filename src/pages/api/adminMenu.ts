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
    label: "Hotel system",
    children: [
      { key: "5", label: "Option 5", baotri: "0"},
      { key: "6", label: "Option 6", baotri: "0"},
      {
        key: "sub3",
        label: "Submenu",
        children: [
          { key: "7", label: "Option 7" , baotri: "0"},
          { key: "8", label: "Option 8", baotri: "0" },
        ],
      },
    ],
  },
  {
    key: "sub4",
    label: "Navigation Three",
    children: [
      { key: "9", label: "Option 9" , baotri: "0"},
      { key: "10", label: "Option 10" , baotri: "0"},
      { key: "11", label: "Option 11" , baotri: "0"},
      { key: "12", label: "Option 12" , baotri: "0"},
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ menu: menuData });
}
