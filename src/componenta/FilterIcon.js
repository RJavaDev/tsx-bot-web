import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Drawer, Button, Form } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import BASE_URL from './utils/config';
import CategorySelect from './CategorySelect';
import RegionSelect from './RegionSelect';
import { setSearchParams, setIsSearching } from './utils/searchSlice';

const FilterIcon = ({ onSearch }) => {
    const dispatch = useDispatch();
    const searchParams = useSelector((state) => state.search.searchParams);
    const [visible, setVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);

    const [form] = Form.useForm();

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

    useEffect(() => {
        form.setFieldsValue({
            categoryId: searchParams.categoryId,
            regionId: searchParams.regionId,
        });
    }, [form, searchParams]);

    const onValuesChange = (changedValues, allValues) => {
        dispatch(setSearchParams(allValues));
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    const onFinish = (values) => {
        const updatedSearchParams = {
            ...searchParams,
            ...values,
        };
        dispatch(setIsSearching(true));
        dispatch(setSearchParams(updatedSearchParams));
        onSearch(updatedSearchParams);
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
                <Form
                    layout="vertical"
                    form={form}
                    // onValuesChange={onValuesChange}
                    onFinish={onFinish}
                >
                    <Form.Item name="categoryId" label="Category">
                        <CategorySelect
                            categories={categories}
                            value={form.getFieldValue('categoryId')}
                            onChange={(value) => form.setFieldsValue({ categoryId: value })}
                        />
                    </Form.Item>
                    <Form.Item name="regionId" label="Region">
                        <RegionSelect
                            regions={regions}
                            value={form.getFieldValue('regionId')}
                            onChange={(value) => form.setFieldsValue({ regionId: value })}
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
