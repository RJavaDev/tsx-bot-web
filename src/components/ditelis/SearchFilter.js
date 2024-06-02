// SearchFilter.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Form } from 'antd';
import { setSearchParams, setIsSearching } from '../utils/searchSlice';
import { fetchData } from '../request/Api';
import BASE_URL from "../utils/config";

const SearchFilter = () => {
    const dispatch = useDispatch();
    const searchParams = useSelector((state) => state.search.searchParams);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(searchParams);
    }, [form, searchParams]);

    const onValuesChange = (changedValues, allValues) => {
        dispatch(setSearchParams(allValues));
    };

    const onFinish = () => {
        const values = form.getFieldsValue();
        dispatch(setIsSearching(true));
        fetchData(
            `${BASE_URL}/announcement/search`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filter: values, page: 1, size: 6 }),
            },
            true,
            ()=>{}, // setLoading function
            () => {}, // setSearchResults function
            () => {}  // setTotal function
        );
    };

    return (
        <Form
            form={form}
            layout="inline"
            onValuesChange={onValuesChange}
            onInput={onFinish}
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

export default SearchFilter;