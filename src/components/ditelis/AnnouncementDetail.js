import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Carousel, Modal, Button } from 'antd';
import { AiOutlineLeft } from "react-icons/ai";
import BASE_URL from '../utils/config';
import LoadingPage from '../utils/LoadingPage';
import { formatDate } from '../utils/DateUtil';
import yourImage from "../../images/annoucement.png";
import '../style/annoucement-ditils.css';
import { LinearGradientButtons, LinearGradientButtonsNoneClick } from "../buttons/LinerGredentButton";

const { Meta } = Card;

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
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

    const handleShowPhoneNumber = () => {
        setShowPhoneNumber(true);
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
                                        No Image
                                    </div>
                                )
                            }
                        >
                            <Meta
                                title={announcement.title}
                                description={
                                    <div style={{ color: "black" }}>
                                        <p>{announcement.description}</p>
                                        <p>
                                            {announcement.priceTag.price} {announcement.priceTag.currency.code}
                                        </p>
                                        <p>{announcement.contactInfo.address}</p>
                                        <p>{formatDate(announcement.createDateTime)}</p>
                                    </div>
                                }
                            />
                        </Card>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '17px',
                        }}>
                            {showPhoneNumber ? (
                                <LinearGradientButtonsNoneClick uis={`${announcement.contactInfo.phone}`} />
                            ) : (
                                <LinearGradientButtons onClick={handleShowPhoneNumber} uis={'Telefon raqamini ko\'rish'} />
                            )}
                        </div>
                    </Col>
                </Row>
                <div style={{ padding: '10px'}}>
                    <h3>Shunga o'xshash elonlar</h3>
                    <Carousel arrows infinite={false}>
                        {groupCategoryAnnouncements(categoryAnnouncements).map((group, groupIndex) => (
                            <div key={groupIndex} style={{ display: 'inline-block'}}>
                                {group.map((catAnnouncement, index) => (
                                    <Card
                                        key={index}
                                        hoverable
                                        style={{ width: '45%', display:'inline-block', margin:'5px'}}
                                        cover={<img alt={`announcement-${index}`}
                                                    src={catAnnouncement.attachUrlResponses.originFile}
                                                    style={{ height: 150, objectFit: 'cover' }} />}
                                        onClick={() => navigate(`/announcement/${catAnnouncement.id}`)}
                                    >
                                        <Meta title={catAnnouncement.title}
                                              description={`${catAnnouncement.price} ${catAnnouncement.currencyCode}`} />
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
