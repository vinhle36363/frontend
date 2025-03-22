import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Select,
  Tag,
  InputNumber,
  List,
  Divider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Option } = Select;

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "available" | "unavailable";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "cancelled";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const InvoiceManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Debug environment variables
  useEffect(() => {
    console.log("API Token available:", !!process.env.NEXT_PUBLIC_API_TOKEN);
    console.log("API Token value:", process.env.NEXT_PUBLIC_API_TOKEN);
  }, []);

  // Fetch services and customers
  const fetchServicesAndCustomers = async () => {
    try {
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

      if (!apiToken) {
        console.error("API Token is not configured!");
        message.error(
          "API configuration error. Please check your environment variables."
        );
        return;
      }

      const headers = {
        Authorization: `Bearer ${apiToken}`,
      };

      // Fetch services
      const servicesResponse = await fetch("/api/services", { headers });
      if (!servicesResponse.ok) {
        throw new Error("Failed to fetch services");
      }
      const servicesData = await servicesResponse.json();
      setServices(servicesData);

      // Fetch customers
      const customersResponse = await fetch("/api/customers", { headers });
      if (!customersResponse.ok) {
        throw new Error("Failed to fetch customers");
      }
      const customersData = await customersResponse.json();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch services and customers");
    }
  };

  useEffect(() => {
    fetchServicesAndCustomers();
  }, []);

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

      if (!apiToken) {
        console.error("API Token is not configured!");
        message.error(
          "API configuration error. Please check your environment variables."
        );
        return;
      }

      console.log("Making API request with token:", apiToken);
      const response = await fetch("/api/invoices", {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to fetch invoices");
      }

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to fetch invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAdd = () => {
    setEditingInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Invoice) => {
    setEditingInvoice(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

      if (!apiToken) {
        console.error("API Token is not configured!");
        message.error(
          "API configuration error. Please check your environment variables."
        );
        return;
      }

      const response = await fetch(`/api/invoices?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete invoice");
      }

      message.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to delete invoice"
      );
    }
  };

  // Add customer name handling
  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (selectedCustomer) {
      form.setFieldsValue({
        customerName: selectedCustomer.name,
      });
    }
  };

  // Add service price handling
  const handleServiceChange = (serviceId: string | number, name: string) => {
    const selectedService = services.find((s) => s.id === String(serviceId));
    if (selectedService) {
      form.setFieldsValue({
        [`items.${name}.serviceName`]: selectedService.name,
        [`items.${name}.price`]: selectedService.price,
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Submitting invoice with values:', values);
      
      // Validate required fields
      if (!values.customerId || !values.customerName || !values.items || values.items.length === 0) {
        console.error('Missing required fields:', {
          customerId: values.customerId,
          customerName: values.customerName,
          items: values.items
        });
        message.error('Please fill in all required fields');
        return;
      }

      const invoiceData = {
        customerId: values.customerId,
        customerName: values.customerName,
        items: values.items.map((item: any) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          quantity: Number(item.quantity),
          price: Number(item.price),
          total: Number(item.quantity) * Number(item.price)
        })),
        tax: Number(values.tax) || 0,
        status: values.status,
        paymentMethod: values.paymentMethod,
        notes: values.notes
      };

      console.log('Sending invoice data:', invoiceData);

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to save invoice');
      }

      const data = await response.json();
      message.success('Invoice saved successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchInvoices();
    } catch (error) {
      console.error('Error saving invoice:', error);
      message.error(error instanceof Error ? error.message : 'Failed to save invoice');
    }
  };

  const handleAddItem = () => {
    const items = form.getFieldValue('items') || [];
    form.setFieldsValue({
      items: [
        ...items,
        {
          serviceId: undefined,
          serviceName: '',
          quantity: 1,
          price: 0,
          total: 0
        }
      ]
    });
  };

  const handleQuantityChange = (value: number, index: number) => {
    const items = form.getFieldValue('items');
    items[index].quantity = value;
    items[index].total = value * items[index].price;
    form.setFieldsValue({ items });
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <List
          size="small"
          dataSource={record.items}
          renderItem={(item) => (
            <List.Item>
              {item.serviceName} x {item.quantity} - ${item.total.toFixed(2)}
            </List.Item>
          )}
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal: number) => `$${subtotal.toFixed(2)}`,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (tax: number) => `$${tax.toFixed(2)}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "paid"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this invoice?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>Invoice Management</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Invoice
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingInvoice ? "Edit Invoice" : "Add New Invoice"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={editingInvoice || {
              items: [{ serviceId: undefined, serviceName: '', quantity: 1, price: 0, total: 0 }]
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Customer"
                  name="customerId"
                  rules={[{ required: true, message: 'Please select a customer' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select customer"
                    onChange={handleCustomerChange}
                  >
                    {customers.map(customer => (
                      <Select.Option key={customer.id} value={customer.id}>
                        {customer.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Customer Name"
                  name="customerName"
                  rules={[{ required: true, message: 'Please enter customer name' }]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card key={field.key} style={{ marginBottom: 16 }}>
                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item
                            {...field}
                            label="Quantity"
                            name={[field.name, 'quantity']}
                            rules={[{ required: true, message: 'Please enter quantity' }]}
                          >
                            <InputNumber
                              min={1}
                              onChange={(value) => handleQuantityChange(value || 1, index)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...field}
                            label="Price"
                            name={[field.name, 'price']}
                            rules={[{ required: true, message: 'Please enter price' }]}
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...field}
                            label="Total"
                            name={[field.name, 'total']}
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button
                            type="link"
                            danger
                            onClick={() => remove(field.name)}
                            style={{ marginTop: 32 }}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={handleAddItem} block>
                    Add Service
                  </Button>
                </>
              )}
            </Form.List>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tax"
                  name="tax"
                  initialValue={0}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select status' }]}
                  initialValue="pending"
                >
                  <Select>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="paid">Paid</Select.Option>
                    <Select.Option value="cancelled">Cancelled</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Payment Method"
                  name="paymentMethod"
                >
                  <Select>
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="card">Card</Select.Option>
                    <Select.Option value="bank">Bank Transfer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Notes"
              name="notes"
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Invoice
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
