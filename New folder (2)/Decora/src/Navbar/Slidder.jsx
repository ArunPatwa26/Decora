import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Slidder = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false, // Hide arrows for a cleaner look
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      <Slider {...settings}>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Slide 1" 
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Slide 2" 
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Slide 3" 
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Slide 4" 
            className="w-full h-[600px] object-cover rounded-xl"
          />
        </div>
      </Slider>
    </div>
  );
};

export default Slidder;
