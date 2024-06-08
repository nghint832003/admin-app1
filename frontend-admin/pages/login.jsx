import React from 'react';
import Heading from '@/components/Heading';

const HomePage = () => {
    return (
        <div className='home-page position-fixed d-flex justify-content-center align-items-center'>
            <div className="home-box">
                <Heading title="Chào mừng đến trang chủ" />
                <p>Đây là nội dung của trang chủ.</p>
            </div>
        </div>
    );
};

export default HomePage;