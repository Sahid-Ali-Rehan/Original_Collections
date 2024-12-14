import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeBanner = () => {
  // Desktop images
  const desktopImages = [
    'https://www.shutterstock.com/image-vector/3d-yellow-great-discount-sale-260nw-2056851839.jpg',
    'https://img.freepik.com/free-vector/flat-horizontal-banner-template-black-friday-sale_23-2150852978.jpg?semt=ais_hybrid',
    'https://www.shutterstock.com/image-vector/ecommerce-web-banner-3d-smartphone-260nw-2069305328.jpg',
    'https://t4.ftcdn.net/jpg/03/48/05/47/360_F_348054737_Tv5fl9LQnZnzDUwskKVKd5Mzj4SjGFxa.jpg'
  ];

  // Mobile images
  const mobileImages = [
    'https://i.pinimg.com/originals/ff/7a/02/ff7a02360e21b746375a944bc97a06ba.png',
    'https://i.pinimg.com/736x/a6/bb/43/a6bb43c064ea2487bf8c6ef8ab723917.jpg',
    'https://i.pinimg.com/originals/ff/7a/02/ff7a02360e21b746375a944bc97a06ba.png',
    'https://i.pinimg.com/736x/c4/1a/fc/c41afcfdac7f7fbf2747cf75911ca275.jpg'
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    fade: true,
    infinite: true,
    speed: 500,
  };

  // Determine which images to display based on the screen size
  const imagesToDisplay = isMobile ? mobileImages : desktopImages;

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Slider {...settings}>
        {imagesToDisplay.map((image, index) => (
          <div key={index} className="w-full h-full flex justify-center items-center">
            <img
              src={image}
              alt={`Banner ${index}`}
              className="w-full h-screen object-cover"
              style={{ zIndex: -1 }} // Keep the image behind other content
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;
