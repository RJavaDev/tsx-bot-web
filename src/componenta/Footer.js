// Home.js
import React, {useEffect, useState} from 'react';
import {Card} from 'antd';
import BASE_URL from './utils/config';
import LoadingPage from './LoadingPage';
import SearchFilter from './SearchFilter';
import {fetchData, handleSearch} from './request/Api';
import FilterIcon from './FilterIcon';
import {useDispatch, useSelector} from 'react-redux';
import {setIsSearching, setSearchParams} from './utils/searchSlice';
import AnnouncementPageable from "./AnnouncementPageable";

const {Meta} = Card;

const Footer = () => {
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

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div style={{margin: 15}}>
            <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                <SearchFilter onSearch={onSearch} searchParams={searchParams}/>
                <FilterIcon onSearch={onSearch}/>
            </div>
            <AnnouncementPageable/>
        </div>
    );
};

export default Footer;
