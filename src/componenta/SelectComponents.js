import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import BASE_URL from './utils/config';

const { TreeNode } = TreeSelect;

const renderTreeNodes = (data) =>
  data.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <TreeNode value={item.id} title={item.nameUz} key={item.id} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode value={item.id} title={item.nameUz} key={item.id} dataRef={item} isLeaf={false} />;
  });

const CategorySelect = ({ categories, onChange, value }) => {
  const [treeData, setTreeData] = useState(categories);

  const onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.dataRef.children && treeNode.props.dataRef.children.length > 0) {
        resolve();
        return;
      }
      fetch(`${BASE_URL}/category/get/tree-three-level`)
        .then(response => response.json())
        .then(data => {
          const newChildren = data.body.find(cat => cat.id === treeNode.props.dataRef.id)?.children || [];
          treeNode.props.dataRef.children = newChildren;
          setTreeData([...treeData]);
          resolve();
        });
    });
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Select a category"
      allowClear
      loadData={onLoadData}
      onChange={onChange}
      filterTreeNode={(inputValue, treeNode) =>
        treeNode.title && treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
      }
    >
      {renderTreeNodes(treeData)}
    </TreeSelect>
  );
};

const RegionSelect = ({ regions, onChange, value }) => {
  const [treeData, setTreeData] = useState(regions);

  const onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.dataRef.children && treeNode.props.dataRef.children.length > 0) {
        resolve();
        return;
      }
      fetch(`${BASE_URL}/region/get/all-tree`)
        .then(response => response.json())
        .then(data => {
          const newChildren = data.body.find(region => region.id === treeNode.props.dataRef.id)?.children || [];
          treeNode.props.dataRef.children = newChildren;
          setTreeData([...treeData]);
          resolve();
        });
    });
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Select a region"
      allowClear
      loadData={onLoadData}
      onChange={onChange}
      filterTreeNode={(inputValue, treeNode) =>
        treeNode.title && treeNode.title.toLowerCase().includes(inputValue.toLowerCase())
      }
    >
      {renderTreeNodes(treeData)}
    </TreeSelect>
  );
};

export { CategorySelect, RegionSelect };
