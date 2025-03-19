import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CustomerType {
  key: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

const CustomersManagement: React.FC = () => {
  const columns: ColumnsType<CustomerType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">View Details</Button>
          <Button type="link">Edit</Button>
        </Space>
      ),
    },
  ];

  const data: CustomerType[] = [
    {
      key: '1',
      name: 'Alice Johnson',
      phone: '(555) 123-4567',
      email: 'alice@example.com',
      status: 'active',
    },
    {
      key: '2',
      name: 'Bob Wilson',
      phone: '(555) 234-5678',
      email: 'bob@example.com',
      status: 'inactive',
    },
    {
      key: '3',
      name: 'Carol Smith',
      phone: '(555) 345-6789',
      email: 'carol@example.com',
      status: 'active',
    },
  ];

  return (
    <div>
      <h2>Customers Management</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CustomersManagement; 