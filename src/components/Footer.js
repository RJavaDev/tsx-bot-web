// Home.js
import React, {useEffect, useState} from 'react';
import BASE_URL from './utils/config';
import LoadingPage from './utils/LoadingPage';
import SearchFilter from './ditelis/SearchFilter';
import {fetchData, handleSearch} from './request/Api';
import FilterIcon from './utils/FilterIcon';
import {useDispatch, useSelector} from 'react-redux';
import {setIsSearching, setSearchParams} from './utils/searchSlice';

const Footer = () => {
    useDispatch();
    const searchParams = useSelector((state) => state.search.searchParams);
    const isSearching = useSelector((state) => state.search.isSearching);
    const [, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setTotal] = useState(0);
    const [currentPage, ] = useState(1);
    const [pageSize, ] = useState(6);
    const [, setSearchResults] = useState([]);

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
        <div >
            <div style={{
                padding: 19,
                paddingBottom: 19,
                background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(115,189,211,1) 100%)',

            }}>
                <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                    <SearchFilter onSearch={onSearch} searchParams={searchParams}/>
                    <FilterIcon onSearch={onSearch}/>
                </div>
            </div>
        </div>

    );
};

export default Footer;
