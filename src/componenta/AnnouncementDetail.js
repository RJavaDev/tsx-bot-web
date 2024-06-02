// AnnouncementDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import BASE_URL from './utils/config';
import LoadingPage from './LoadingPage';
import { formatDate } from './utils/DateUtil';

const { Meta } = Card;

const AnnouncementDetail = () => {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncementDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}/announcement/get/${id}`);
                const result = await response.json();
                if (result.code === 200) {
                    setAnnouncement(result.body);
                }
            } catch (error) {
                console.error('Error fetching announcement details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncementDetail();
    }, [id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (!announcement) {
        return <p>No announcement found</p>;
    }

    return (
        <div style={{ margin: 15 }}>
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        hoverable
                        style={{ width: '100%' }}
                        cover={
                            announcement.attachUrlResponses && announcement.attachUrlResponses.length > 0 ? (
                                <img
                                    alt="announcement"
                                    src={announcement.attachUrlResponses[0].minFile}
                                    style={{ width: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    style={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f0f0f0',
                                    }}
                                >
                                    No Image
                                </div>
                            )
                        }
                    >
                        <Meta
                            title={announcement.title}
                            description={
                                <div>
                                    <p>{announcement.description}</p>
                                    <p>
                                        {announcement.priceTag.price} {announcement.priceTag.currency.code}
                                    </p>
                                    <p>{announcement.contactInfo.phone}</p>
                                    <p>{announcement.contactInfo.address}</p>
                                    <p>{formatDate(announcement.createDateTime)}</p>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AnnouncementDetail;
