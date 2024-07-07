import React from 'react';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

const CategorySelect = ({ categories, value, onChange }) => {
    const renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} value={item.id}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.id} value={item.id} />;
        });

    return (
        <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            onChange={onChange}
        >
            {renderTreeNodes(categories)}
        </TreeSelect>
    );
};

export default CategorySelect;
