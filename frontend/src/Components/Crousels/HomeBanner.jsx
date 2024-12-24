import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import decstop1 from '/Banner/Decs1.png'
import decstop2 from '/Banner/Decs2.jpg'
import decstop3 from '/Banner/Decs3.jpg'
import decstop4 from '/Banner/Decs4.png'

import mob1 from '/Banner/Mob1.jpg'
import mob2 from '/Banner/Mob2.jpg'
import mob3 from '/Banner/Mob3.jpg'
import mob4 from '/Banner/Mob4.jpg'


const HomeBanner = () => {
  // Desktop images
  const desktopImages = [
    decstop1,
    decstop2,
    decstop3,
    decstop4
  ];

  // Mobile images
  const mobileImages = [
    mob1,
    mob2,
    mob3,
    mob4
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
