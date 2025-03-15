// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string,
  logoname: string,
  phonenumber: string,
  email: string,
  logoLink: string,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    name: "Admin NHP",
    logoname: "Hotel Management",
    logoLink: "https://localhost:3000",
    phonenumber: "1234567890",
    email: "email@email.com",
  });

}
