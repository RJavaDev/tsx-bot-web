// api.js
import BASE_URL from '../utils/config';

export const fetchData = (url, options = {}, isSearching, setLoading, setSearchResults, setAnnouncements, setTotal) => {
    setLoading(true);
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Log fetched data
            if (isSearching) {
                setSearchResults(data.body.rows || []);
            } else {
                setAnnouncements(data.body.rows || []);
            }
            setTotal(data.body.total || 0);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
};

export const handleSearch = (values, setIsSearching, setSearchParams, fetchData, pageSize, setLoading, setSearchResults, setTotal) => {
    setIsSearching(true);
    setSearchParams(values); // Update search parameters
    const filter = {
        page: 1, // Start from the first page on new search
        size: pageSize,
        filter: values,
    };
    console.log('Search filter:', filter); // Log filter data
    fetchData(`${BASE_URL}/announcement/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
    }, true, setLoading, setSearchResults, setTotal);
};
