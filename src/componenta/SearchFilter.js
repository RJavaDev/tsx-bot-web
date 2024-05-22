import React, { useEffect } from 'react';
import { Input, Button, Form } from 'antd';

export const SearchFilter = ({ onSearch, searchParams }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(searchParams);
  }, [searchParams]);

  const onFinish = (values) => {
    onSearch(values);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Form.Item name="title">
        <Input placeholder="Search by title" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};
