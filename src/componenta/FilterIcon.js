import React, { useState, useEffect } from 'react';
import { Tooltip, Drawer, Button, Form } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import BASE_URL from './utils/config';
import { CategorySelect, RegionSelect } from './SelectComponents';

const FilterIcon = ({ onSearch }) => {
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    // Category data fetching
    fetch(`${BASE_URL}/category/get/tree-three-level`)
      .then(response => response.json())
      .then(data => setCategories(data.body))
      .catch(error => console.error('Error fetching categories:', error));

    // Region data fetching
    fetch(`${BASE_URL}/region/get/all-tree`)
      .then(response => response.json())
      .then(data => setRegions(data.body))
      .catch(error => console.error('Error fetching regions:', error));
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
  };

  const onFinish = () => {
    const filter = {
      categoryId: selectedCategory,
      regionId: selectedRegion
    };
    onSearch(filter);
    closeDrawer();
  };

  return (
    <>
      <Tooltip title="Filter">
        <FilterOutlined
          style={{ fontSize: '24px', cursor: 'pointer', color: '#1890ff' }}
          onClick={showDrawer}
        />
      </Tooltip>
      <Drawer
        title="Filter Options"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Category">
            <CategorySelect
              categories={categories}
              onChange={handleCategoryChange}
              value={selectedCategory}
            />
          </Form.Item>
          <Form.Item label="Region">
            <RegionSelect
              regions={regions}
              onChange={handleRegionChange}
              value={selectedRegion}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default FilterIcon;
