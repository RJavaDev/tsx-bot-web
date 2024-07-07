import React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';

const colors1 = ['#6253E1', '#04BEFE'];
const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

interface LinearGradientButtonsProps {
    uis: string;
    onClick: () => void;
}

export const LinearGradientButtons: React.FC<LinearGradientButtonsProps> = ({ uis , onClick}) => (
    <Space>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                        lineWidth: 0,
                    },
                },
            }}
        >
            <Button type="primary" size="large" onClick={onClick}>
                {uis}
            </Button>
        </ConfigProvider>
    </Space>
);

// export default LinearGradientButtons;

export const LinearGradientButtonsNoneClick: React.FC<{ uis:string }> = ({ uis}) => (
    <Space>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                        lineWidth: 0,
                    },
                },
            }}
        >
            <Button type="primary" size="large" style={{width: '100%'}}>
                {uis}
            </Button>
        </ConfigProvider>
    </Space>
);
