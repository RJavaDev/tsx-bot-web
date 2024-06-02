import React from 'react';
import {Route, Routes} from "react-router-dom";
import FooterAndAnnouncementPage from "./FooterAndAnnouncementPage";
import AnnouncementDetail from "./ditelis/AnnouncementDetail";

const RouterWrapper = () => {
    return(
        <div>
            <Routes>
                <Route path="/" element={<FooterAndAnnouncementPage />} />
                <Route path="/announcement/:id" element={<AnnouncementDetail />} />
            </Routes>
        </div>
    )
}

export default RouterWrapper