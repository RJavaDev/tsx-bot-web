// Home.js
import React from 'react';
import Footer from './Footer';
import { Routes, Route } from 'react-router-dom';
import AnnouncementDetail from './ditelis/AnnouncementDetail';

const Home = () => {
    return (
        <Routes>
            <Route path="/" element={<Footer />} />
            <Route path="/announcement/:id" element={<AnnouncementDetail />} />
        </Routes>
    );
};

export default Home;
