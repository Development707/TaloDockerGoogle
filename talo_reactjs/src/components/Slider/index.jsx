import { Carousel } from 'antd';
import SliderItem from 'components/SliderItem';
import React from 'react';

const Slider = () => {
    const introduces = [
        {
            image: 'https://storage.googleapis.com/talo-public-file/talo-welcome-screen-111.jpg',
            title: 'Chat nhóm với đồng nghiệp',
            description:
                'Tiện lợi và nhanh chóng hơn với công cụ trên máy tính.',
        },
        {
            image: 'https://storage.googleapis.com/talo-public-file/talo-welcome-screen-222.png',
            title: 'Nhắn tin hiều hơn, soạn thảo ít hơn',
            description: 'Trao đổi công việc, trò chuyện nhanh chóng dễ dàng.',
        },
        {
            image: 'https://storage.googleapis.com/talo-public-file/talo-welcome-screen-333.jpg',
            title: 'Trải nghiệm xuyên suốt',
            description: 'Kết nối nhanh chóng, dễ dàng sử dụng.',
        },
    ];
    return (
        <Carousel sel dots={false} autoplay>
            {introduces.map((introduce, index) => (
                <SliderItem
                    key={index}
                    image={introduce.image}
                    title={introduce.title}
                    description={introduce.description}
                />
            ))}
        </Carousel>
    );
};

export default Slider;
