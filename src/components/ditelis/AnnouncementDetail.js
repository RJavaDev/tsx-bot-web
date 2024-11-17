import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Card, Row, Col, Carousel, Modal, Button, message} from 'antd';
import { AiOutlineLeft } from "react-icons/ai";
import BASE_URL from '../utils/config';
import LoadingPage from '../utils/LoadingPage';
import { formatDate } from '../utils/DateUtil';
import yourImage from "../../images/annoucement.png";
import '../style/annoucement-ditils.css';

const { Meta } = Card;

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categoryAnnouncements, setCategoryAnnouncements] = useState([]);
    const carouselRef = useRef(null);

    const fetchAnnouncementDetail = useCallback(async () => {
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
    }, [id]);

    const fetchCategoryAnnouncements = useCallback(async (categoryId) => {
        try {
            const response = await fetch(`${BASE_URL}/announcement/get/by-category/${categoryId}`);
            const result = await response.json();
            if (result.code === 200) {
                setCategoryAnnouncements(result.body.rows.filter(item => item.id !== parseInt(id)));
            }
        } catch (error) {
            console.error('Error fetching category announcements:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchAnnouncementDetail();
    }, [fetchAnnouncementDetail]);

    useEffect(() => {
        if (announcement && announcement.categoryId) {
            fetchCategoryAnnouncements(announcement.categoryId);
        }
    }, [announcement, fetchCategoryAnnouncements]);

    const handleCarouselClick = (event) => {
        if (carouselRef.current) {
            const { clientX } = event;
            const { left, right } = carouselRef.current.getBoundingClientRect();
            const clickPosition = clientX - left;
            const carouselWidth = right - left;
            const leftBoundary = carouselWidth * 0.1;
            const rightBoundary = carouselWidth * 0.9;

            if (clickPosition >= leftBoundary && clickPosition <= rightBoundary) {
                setIsModalVisible(true);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Text copied to clipboard');
        }).catch(err => {
            message.error('Failed to copy text');
        });
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (!announcement) {
        return <p>No announcement found</p>;
    }

    const groupCategoryAnnouncements = (announcements) => {
        const groups = [];
        for (let i = 0; i < announcements.length; i += 2) {
            groups.push(announcements.slice(i, i + 2));
        }
        return groups;
    };

    return (
        <div style={{
            backgroundImage: `url(${yourImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100%',
            position: 'relative'
        }}>
            <div className={'back-icon'}>
                <Button style={{
                    background: 'linear-gradient(to right, #caf5ff, #aceefc, #8ae6fa, #61dff7, #00d7f4)',
                }} onClick={handleBackClick}>
                    <AiOutlineLeft size={20} />
                </Button>
            </div>
            <div style={{ margin: 0, height: '100vh', overflow: "auto" }}>
                <Row gutter={[10, 10]} style={{ margin: 0 }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ padding: 0 }}>
                        <Card
                            hoverable
                            style={{ width: '100%' }}
                            cover={
                                announcement.attachUrlResponses && announcement.attachUrlResponses.length > 0 ? (
                                    <div ref={carouselRef} onClick={handleCarouselClick}>
                                        <Carousel arrows infinite={false}>
                                            {announcement.attachUrlResponses.map((attachUrl, index) => (
                                                <div key={index}>
                                                    <img
                                                        alt={`announcement-${index}`}
                                                        src={attachUrl.originFile}
                                                        style={{
                                                            width: '100%',
                                                            height: 250,
                                                            borderRadius: 0,
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
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
                                        <h2 style={{ color: "#bbb" }}>No Image Available</h2>
                                    </div>
                                )
                            }
                        >
                            <Meta
                                title={
                                    <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#333" }}>
                                        {announcement.title}
                                    </h1>
                                }
                                description={
                                    <div style={{color: "black", marginTop: "10px"}}>
                                        <p style={{
                                            marginBottom: "10px",
                                            fontSize: "14px",
                                            color: "#666",
                                        }}>
                                            {announcement.description}
                                        </p>
                                        <h2 style={{color: "#555", fontSize: "16px", margin: "10px 0"}}>
                                            {announcement.priceTag.price} {announcement.priceTag.currency.code}
                                        </h2>
                                        <p style={{marginBottom: "10px", fontSize: "14px", color: "#666"}}>
                                            {announcement.contactInfo.address}
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingBottom: "10px"
                                            }}
                                        >
                                            <p style={{
                                                marginBottom: "10px",
                                                fontSize: "12px",
                                                color: "#888"
                                            }}>
                                                {formatDate(announcement.createDateTime)}
                                            </p>
                                            <div style={{textAlign: "right"}}>
                                                <p style={{margin: "0", fontSize: "14px", color: "#555"}} onClick={() => copyToClipboard(announcement.contactInfo.phone)}>
                                                    {announcement.contactInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
                <div style={{ paddingBottom: '10px', textAlign: 'center' }}>
                    <h3>Shunga o'xshash elonlar</h3>
                    <Carousel arrows infinite={false}>
                        {groupCategoryAnnouncements(categoryAnnouncements).map((group, groupIndex) => (
                            <div className="ann-card-container" key={groupIndex}
                                 style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                                {group.map((catAnnouncement, index) => (
                                    <Card
                                        hoverable
                                        style={{ height:240, width: '46%', margin: '1%', display:"inline-block"}} // Adjusted width and margin for better alignment
                                        cover={
                                            <img
                                                alt="announcement"
                                                src={catAnnouncement.attachUrlResponses.originFile}
                                                style={{ height: '145px', objectFit: 'cover' }}
                                            />
                                        }
                                        onClick={() => navigate(`/announcement/${catAnnouncement.id}`)}
                                    >
                                        <Meta style={{textAlign:"left"}}
                                            title={catAnnouncement.title}
                                            description={
                                                <div style={{ color: "black" }}>
                                                    <p style={{ fontSize: 12, font: 'Roboto', margin: 0, paddingTop: 5 }}>
                                                        <b>{catAnnouncement.price} {catAnnouncement.currencyCode}</b>
                                                    </p>
                                                    <p style={{ fontSize: 10, margin: 0 }}>
                                                        {catAnnouncement.address}
                                                    </p>
                                                    <span
                                                        style={{ fontSize: 10 }}>{formatDate(catAnnouncement.createDateTime)}</span>
                                                </div>
                                            }
                                        />
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={handleCloseModal}
                width="100%"
                centered
                style={{ top: 0, backgroundColor: '#ffffff00', padding: 0 }}
                maskStyle={{ backdropFilter: 'blur(5px)' }}
                modalStyle={{ padding: '0' }}
                modalContentStyle={{ padding: '0' }}
            >
                <Carousel style={{ backgroundColor: '#ffffff00' }} arrows infinite={false}>
                    {announcement.attachUrlResponses.map((attachUrl, index) => (
                        <div key={index}>
                            <img
                                alt={`announcement-${index}`}
                                src={attachUrl.originFile}
                                style={{ width: '100%', borderRadius: 8, height: 250, padding: 0, objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </Carousel>
            </Modal>
        </div>
    );
};

export default AnnouncementDetail;
