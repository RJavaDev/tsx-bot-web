// Home.js
import React, {useEffect, useState} from 'react';
import {Card, Col, Pagination, Row} from 'antd';
import {Link} from 'react-router-dom';
import BASE_URL from '../utils/config';
import LoadingPage from '../utils/LoadingPage';
import {formatDate} from '../utils/DateUtil';
import {fetchData} from '../request/Api';
import {useDispatch, useSelector} from 'react-redux';

import yourImage from '../../images/Home-image.png'; // import the image if it's local

const {Meta} = Card;

const AnnouncementPageable = () => {
    useDispatch();
    const searchParams = useSelector((state) => state.search.searchParams);
    const isSearching = useSelector((state) => state.search.isSearching);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (isSearching) {
            fetchData(
                `${BASE_URL}/announcement/search`,
                {
                    method: 'POST',
                    headers: {
                        'Accept-Language':'uz',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page: currentPage,
                        size: pageSize,
                        filter: searchParams,
                    }),
                },
                isSearching,
                setLoading,
                setSearchResults,
                setAnnouncements,
                setTotal
            );
        } else {
            const url = `${BASE_URL}/announcement/home?page=${currentPage}&size=${pageSize}`;
            fetchData(
                url,
                {
                    headers: {
                        'Accept-Language':'uz',
                        'Content-Type': 'application/json',
                    }
                },
                isSearching, setLoading, setSearchResults, setAnnouncements, setTotal);
        }
    }, [currentPage, pageSize, isSearching, searchParams]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const dataToShow = isSearching ? searchResults : announcements;

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div
            style={{background: 'linear-gradient(0deg,  #73BDD3 50%, #ffffff 100%)'}}
        >
            <div>

                <Row gutter={[10, 10]} style={{
                    paddingTop:'10px',
                    paddingBottom:'10px',
                    overflow:"auto",
                    height:'calc(100vh - 140px)',
                    margin:0,
                    backgroundImage: `url(${yourImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    width: '100%'
                }}>
                    {
                        dataToShow.map((announcement) => (
                            <Col key={announcement.id} xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Link to={`/announcement/${announcement.id}`}>
                                    <Card
                                        hoverable
                                        style={{height: 350}} // Set fixed height for the card
                                        cover={
                                            announcement.attachUrlResponses &&
                                            announcement.attachUrlResponses ? (
                                                <img
                                                    alt="announcement"
                                                    src={announcement.attachUrlResponses.minFile}
                                                    style={{height: 200, width: '100%', objectFit: 'cover'}}
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
                                                    <p style={{fontSize: 10, font:'Roboto'}}>
                                                        {announcement.price} {announcement.currencyCode}
                                                    </p>
                                                    {/*<p style={{fontSize: 10}}>{announcement.contactInfo.phone}</p>*/}
                                                    <p style={{fontSize: 10}}>
                                                        {announcement.address} - {formatDate(announcement.createDateTime)}
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    }
                </Row>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    style={{
                        textAlign: 'center',
                        // marginTop: 20,
                        paddingBottom: 19,
                        paddingTop: 19,
                        background: `linear-gradient(0deg,  #73BDD3 50%, #ffffff 100%)`
                    }}
                />
            </div>
        </div>

    );
};

export default AnnouncementPageable;
