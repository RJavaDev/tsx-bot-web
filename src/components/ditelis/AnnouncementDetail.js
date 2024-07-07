import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Carousel, Modal, Button } from 'antd';
import { AiOutlineLeft } from "react-icons/ai";
import BASE_URL from '../utils/config';
import LoadingPage from '../utils/LoadingPage';
import { formatDate } from '../utils/DateUtil';
import yourImage from "../../images/annoucement.png";
import '../style/annoucement-ditils.css';
import {LinearGradientButtons, LinearGradientButtonsNoneClick}from "../buttons/LinerGredentButton";

const { Meta } = Card;

const AnnouncementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const carouselRef = useRef(null);

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

        fetchAnnouncementDetail().then(() => {});
    }, [id]);

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
                }} onClick={handleBackClick} >
                    <AiOutlineLeft size={20} />
                </Button>
            </div>
            <div>
                <Row gutter={[10, 10]} style={{ margin: 0, padding: '5%', height: '100vh', overflow:"auto" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card
                            hoverable
                            style={{ width: '100%', backgroundColor: '#F2F4F5' }}
                            cover={
                                announcement.attachUrlResponses && announcement.attachUrlResponses.length > 0 ? (
                                    <div ref={carouselRef} onClick={handleCarouselClick}>
                                        <Carousel arrows infinite={false}>
                                            {announcement.attachUrlResponses.map((attachUrl, index) => (
                                                <div key={index}>
                                                    <img
                                                        alt={`announcement-${index}`}
                                                        src={attachUrl.originFile}
                                                        style={{ width: '100%', height: "auto", objectFit: 'cover' }}
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
                                    <div>
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
                            {/*<AiOutlinePhone size={25} rotate={30} style={{ marginRight: '10px', rotate:-30 }} />*/}
                            {showPhoneNumber ? (
                                    <a href={`tel:+${announcement.contactInfo.phone}`}>
                                        <LinearGradientButtonsNoneClick uis = {`+${announcement.contactInfo.phone}`}/>
                                    </a>

                                // <Button>
                                //     <a href={`tel:+${announcement.contactInfo.phone}`}>
                                //         +{announcement.contactInfo.phone}
                                //     </a>
                                // </Button>
                            ) : (
                                <LinearGradientButtons onClick={handleShowPhoneNumber} uis = {'Telefon raqamini ko\'rish'}/>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={handleCloseModal}
                width="100%"
                centered
                style={{ top: 0 }}
                bodyStyle={{ backgroundColor: 'rgb(40,134,177)' }}
                maskStyle={{ backdropFilter: 'blur(5px)' }}
            >
                <Carousel arrows infinite={false}>
                    {announcement.attachUrlResponses.map((attachUrl, index) => (
                        <div key={index}>
                            <img
                                alt={`announcement-${index}`}
                                src={attachUrl.originFile}
                                style={{ width: '100%', maxHeight: '70%', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                </Carousel>
            </Modal>
        </div>
    );
};

export default AnnouncementDetail;
