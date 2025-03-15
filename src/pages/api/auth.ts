// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  token?: string;
  message?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {


  const { username, password } = req.body;

  if (username === 'admin' && password === '123456') {
    console.log('Login success');
    return res.status(200).json({ token: 'thisisadmin' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
