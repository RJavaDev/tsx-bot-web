// Home.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination } from 'antd';
import BASE_URL from './utils/config';
import LoadingPage from './LoadingPage';
import { formatDate } from './utils/DateUtil';
import SearchFilter from './SearchFilter';
import { fetchData, handleSearch } from './request/Api';
import FilterIcon2 from './FilterIcon2';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchParams, setIsSearching } from './utils/searchSlice';

const { Meta } = Card;

const Home = () => {
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
            fetchData(url, {}, isSearching, setLoading, setSearchResults, setAnnouncements, setTotal);
        }
    }, [currentPage, pageSize, isSearching, searchParams]);

    const onSearch = (values) => {
        handleSearch(values, setIsSearching, setSearchParams, fetchData, pageSize, setLoading, setSearchResults, setTotal);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    if (loading) {
        return <LoadingPage />;
    }

    const dataToShow = isSearching ? searchResults : announcements;

    return (
        <div style={{ margin: 15 }}>
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <SearchFilter onSearch={onSearch} searchParams={searchParams} />
                <FilterIcon2 onSearch={onSearch} /> {/* SearchFilter komponentining yonida FilterIcon */}
            </div>

            <Row gutter={[10, 10]}>
                {dataToShow.length > 0 ? (
                    dataToShow.map((announcement) => (
                        <Col key={announcement.id} xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card
                                hoverable
                                style={{ height: 350 }} // Set fixed height for the card
                                cover={
                                    announcement.attachUrlResponses &&
                                    announcement.attachUrlResponses.length > 0 ? (
                                        <img
                                            alt="announcement"
                                            src={announcement.attachUrlResponses[0].minFile}
                                            style={{ height: 200, width: '100%', objectFit: 'cover' }}
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
                                            <p style={{ fontSize: 10 }}>
                                                {announcement.priceTag.price} {announcement.priceTag.currency.code}
                                            </p>
                                            <p style={{ fontSize: 10 }}>{announcement.contactInfo.phone}</p>
                                            <p style={{ fontSize: 10 }}>
                                                {announcement.contactInfo.address} - {formatDate(announcement.createDateTime)}
                                            </p>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No announcements found</p>
                )}
            </Row>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                style={{ textAlign: 'center', marginTop: 20 }}
            />
        </div>
    );
};

export default Home;
