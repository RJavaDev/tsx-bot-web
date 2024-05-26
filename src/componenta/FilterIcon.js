// FilterIcon.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Drawer, Button, Form } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import BASE_URL from './utils/config';
import { CategorySelect, RegionSelect } from './SelectComponents';
import { setSearchParams, setIsSearching } from './utils/searchSlice';
import { fetchData } from './request/Api';

const FilterIcon = () => {
  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.search.searchParams);
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/category/get/tree-three-level`)
        .then(response => response.json())
        .then(data => setCategories(data.body))
        .catch(error => console.error('Error fetching categories:', error));

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

  const onFinish = (values) => {
    const newSearchParams = { ...searchParams, ...values };
    dispatch(setIsSearching(true));
    dispatch(setSearchParams(newSearchParams));
    fetchData(
        `${BASE_URL}/announcement/search`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter: newSearchParams, page: 1, size: 10 }),
        },
        true,
        () => {}, // setLoading function
        () => {}, // setSearchResults function
        () => {}  // setTotal function
    );
    closeDrawer();
  };

  return (
      <>
        <Tooltip title="Filter">
          <FilterOutlined style={{ fontSize: '24px', cursor: 'pointer', color: '#1890ff' }} onClick={showDrawer} />
        </Tooltip>
        <Drawer title="Filter Options" placement="right" onClose={closeDrawer} visible={visible}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="categoryId" label="Category">
              <CategorySelect categories={categories} value={searchParams.categoryId} />
            </Form.Item>
            <Form.Item name="regionId" label="Region">
              <RegionSelect regions={regions} value={searchParams.regionId} />
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
