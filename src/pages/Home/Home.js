import React, { useEffect } from 'react';
import '../../Assetes/Css/style.css'
import Image from '../Component/ImagesComponets/ImagesComponets';
import Slide1 from "../../Assetes/images/slider_img1.jpg"
import service_img1 from "../../Assetes/images/service_img1.jpg"
import service_img2 from "../../Assetes/images/service_img2.jpg"
import service_img3 from "../../Assetes/images/service_img3.jpg"
import Button from '../Component/ButtonComponents/ButtonComponents';
import Footer from '../Component/Footer/Footer';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';

const HomePage = () => {
    const settings = {
        dots: true,            // Enables dots for navigation
        infinite: true,        // Infinite loop of slides
        speed: 500,            // Speed of slide transition
        slidesToShow: 1,       // Number of slides to show at once
        slidesToScroll: 1,     // Number of slides to scroll at once
        autoplay: true,        // Enable autoplay
        autoplaySpeed: 3000,   // Slide change interval
        adaptiveHeight: true,  // Automatically adjusts the slider height based on content
    };

    useEffect(() => {
        console.log('Home component mounted');
    }, []);
    const handleClick = () => {
        console.log("Learn more clicked!");
    };
    return (
        <React.Fragment>
            <div>
                <HeaderComponents />
                <MetaTitle pageTitle={"Redwood Peak Limited – Hong Kong based asset manager focused on fund & separate account management"} />

                <div className='' style={{ width: '100%', overflow: 'hidden' }}>
                    <Slider {...settings}>
                        <div style={{ height: '200px', position: 'relative' }}>
                            <img
                                src={Slide1}
                                alt="Slide 1"
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </Slider>
                </div>
                {/* First Section */}
                <div className="wrapper pt-0">
                    <div className="row pt-0 no-gutters d-flex align-items-stretch">
                        {/* First Column */}
                        <div className="col-md-12 col-lg-4 pr-0 pl-0 p-0">
                            <div className="card p-5 h-100" style={{ backgroundColor: '#04243d' }}>
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <h5 className="card-title cards-titles">22 OCTOBER 2023, 08.00 PM EDT</h5>
                                        <h2 className="cards-headings text-white">
                                            Smart investing strategies:<br /> building wealth for the future
                                        </h2>
                                    </div>
                                    <div className="p-0 pt-3" style={{ backgroundColor: '#fff0' }}>
                                        <Button
                                            text="Learn More"
                                            onClick={handleClick}
                                            className="btn-primary"
                                            style={{}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second Column */}
                        <div className="col-md-6 col-lg-4 pr-0 pl-0 p-0">
                            <div className="card p-5 card-bg-img h-100">
                                <h5 className="cards-headings">
                                    Some quick example text to build on the card title and make up the bulk of the card's content.
                                </h5>
                            </div>
                        </div>

                        {/* Third Column */}
                        <div className="col-md-6 col-lg-4 pr-0 pl-0 p-0">
                            <div className="card p-5 h-100" style={{ backgroundColor: '#fff' }}>
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <h2 className="welcome-title-class">Our View</h2>
                                        <div className="mt-3">
                                            <ul className='ps-0' style={{ listStyle: 'none' }}>
                                                <li className="mt-2">China Outlook Q1 2023</li>
                                                <li className="mt-2">China Outlook Q4 2022</li>
                                                <li className="mt-2">China Outlook Q3 2022</li>
                                                <li className="mt-2">China Outlook Q2 2022</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mt-5 ml-5 mr-5">
                        <h2 className="pt-2">Discover our expertise by learning what we offer</h2>
                    </div>

                    <div className="w-75 m-auto">
                        <p>Sub heading TBC</p>
                    </div>

                    {/* Services Section */}
                    <div className="mt-5 container ">
                        <div className="mt-3 mb-5">
                            <div className="row row-padding">
                                <div className="col-md-4 mt-4">
                                    <div className="card card-shadow">
                                        <Image
                                            src={service_img1}
                                            alt="Service Image 1"
                                            className="card-img-top"
                                        />
                                        <div className="card-body text-left">
                                            <h5 className="card-title cards-Label primaryColor">Portfolio Management</h5>
                                            <p className="card-text text-left p-0">
                                                Cultivating change enthusiasts fuels success, resulting in superior, more efficient, and robust innovations.
                                            </p>
                                            <div>
                                                <Button
                                                    text="Learn More"
                                                    onClick={handleClick}
                                                    className="btn-primary"
                                                    style={{}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mt-4">
                                    <div className="card card-shadow">
                                        <Image
                                            src={service_img2}
                                            alt="Service Image 1"
                                            className="card-img-top"
                                        />
                                        <div className="card-body text-left">
                                            <h5 className="card-title cards-Label primaryColor">Financial Planning</h5>
                                            <p className="card-text text-left p-0">
                                                Cultivating change enthusiasts fuels success, resulting in superior, more efficient, and robust innovations.
                                            </p>
                                            <div>
                                                <Button
                                                    text="Learn More"
                                                    onClick={handleClick}
                                                    className="btn-primary"
                                                    style={{}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mt-4">
                                    <div className="card card-shadow">
                                        <Image
                                            src={service_img3}
                                            alt="Service Image 1"
                                            className="card-img-top"
                                        />
                                        <div className="card-body text-left">
                                            <h5 className="card-title cards-Label primaryColor">Wealth Management</h5>
                                            <p className="card-text text-left p-0">
                                                Cultivating change enthusiasts fuels success, resulting in superior, more efficient, and robust innovations.
                                            </p>
                                            <div>
                                                <Button
                                                    text="Learn More"
                                                    onClick={handleClick}
                                                    className="btn-primary"
                                                    style={{}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest News, Visits, and Contact Us Section */}
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h2 className="welcome-title-class">Latest News</h2>
                                <div className="mt-3">
                                    <ul className='ps-0'>
                                        <li className="mt-2">Sunshine Action for elderly people</li>
                                        <li className="mt-2">Sunshine Action for hundred of homeless people</li>
                                        <li className="mt-2">Redwood Peak Volunteers with Sunshine Action to Distribute Food to the Homeless</li>
                                        <li className="mt-2">Wal-Mart Stores Inc.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h2 className="welcome-title-class">Our Visits</h2>
                                <div className="mt-3">
                                    <ul className='ps-0'>
                                        <li className="mt-2">Visiting Electric Vehicle Dealers in Shenzhen</li>
                                        <li className="mt-2">Visit to Vanke and Evergrande Guangzhou</li>
                                        <li className="mt-2">Wal-Mart Stores Inc.</li>
                                        <li className="mt-2">Mastercard Inc.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h2 className="welcome-title-class">Contact Us</h2>
                                <div className="mt-3">
                                    <ul className='ps-0'>
                                        <li className="mt-2">
                                            18/Floor, China Hong Kong Tower, 8-12 Hennessy Road, Wan Chai, Hong Kong.
                                        </li>
                                        <li className="mt-2">Telephone: (852) 2878 3100</li>
                                        <li className="mt-2">Facsimile: (852) 2509 9233</li>
                                        <li className="mt-2">Email: IR@redwoodpeak.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default HomePage;
