// Home.js
import React from 'react';
import AnnouncementPageable from "./ditelis/AnnouncementPageable";
import Footer from "./Footer";


const FooterAndAnnouncementPage = () => {

    return (
        <div style={{margin: 15}}>
            <Footer/>
            <AnnouncementPageable/>
        </div>
    );
};

export default FooterAndAnnouncementPage;
