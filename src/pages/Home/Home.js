import React, { useEffect, useState } from 'react';
import '../../Assetes/Css/style.css'
import Image from '../Component/ImagesComponets/ImagesComponets';
import Slide1 from "../../Assetes/images/banner_homepage.jpg"
import service_img1 from "../../Assetes/images/service_img1.jpg"
import service_img2 from "../../Assetes/images/service_img2.jpg"
import service_img3 from "../../Assetes/images/service_img3.jpg"
import Button from '../Component/ButtonComponents/ButtonComponents';
import Footer from '../Component/Footer/Footer';


import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import DisclaimerModal from '../Component/DisclimerModal/DisclimerModal';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import SimpleImageSlider from "react-simple-image-slider";
import "../Home/Home.css"
import { useNavigate } from 'react-router-dom';

const images = [
    { url: Slide1 },
];

const HomePage = () => {
    const navigate = useNavigate();

    const limit = 5;
    const page = 1;
    const isAuthenticated = localStorage.getItem('userToken');

    const documentType = "publications";
    const [isLoading, setIsLoading] = useState(true);
    const [overViewData, setOverViewData] = useState([])
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [showNewsAlert, setShowNewsAlert] = useState(false)
    const [showVisitAlert, setShowVisitAlert] = useState(false)


    const [visitData, setVisitData] = useState([])
    const [newsData, setNewsData] = useState([])



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
        getFetchOverView()
        getFetchNewsVisit()

    }, []);
    useEffect(() => {
        if (showLoginAlert === true) {
            setTimeout(() => {
                setShowLoginAlert(false)
            }, 2500);
        } else if (showNewsAlert === true) {
            setTimeout(() => {
                setShowNewsAlert(false)
            }, 2500);
        } else if (showVisitAlert === true) {
            setTimeout(() => {
                setShowVisitAlert(false)
            }, 2500);
        }
    }, [showLoginAlert, showNewsAlert, showVisitAlert]);
    const handleClick = () => {
        console.log("Learn more clicked!");
    };

    const getFetchNewsVisit = async () => {
        setIsLoading(true);
        try {
            const resp = await pagesServices.getPostList({ limit, page, documentType });
            if (resp?.status_code === 200) {
                console.log(resp);
                if (resp?.list?.data) {
                    function categorizePosts(posts) {
                        // Step 1: Group by category
                        const categorized = posts.reduce((acc, post) => {
                            if (!acc[post.category]) {
                                acc[post.category] = [];
                            }
                            acc[post.category].push(post);
                            return acc;
                        }, {});

                        // Step 2: Select only the first 5 posts from each category
                        for (const category in categorized) {
                            categorized[category] = categorized[category].slice(0, 5); // Limit to 5 records
                        }

                        return categorized;
                    }

                    const result = categorizePosts(resp?.list?.data);
                    setVisitData(result?.visit)
                    setNewsData(result?.news)


                } else {
                    console.error("No data found in response.");
                    notifyError("No data found. Please try again.");
                }
            } else {
                // Handle non-200 status codes or unexpected responses
                console.error("Failed to fetch data: ", resp?.message);
                notifyError("Please try again.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notifyError("An error occurred during fetching data. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false once the request is done
        }

    };
    const getFetchOverView = async () => {
        setIsLoading(true);
        try {
            const resp = await pagesServices.getPageList({ limit, page, documentType });
            if (resp?.status_code === 200) {
                console.log(resp);
                if (resp?.list?.data) {
                    //   const publications = resp.list.data.reduce((acc, item) => {
                    //     if (!acc[item.year]) {
                    //       acc[item.year] = [];
                    //     }
                    //     acc[item.year].push(item);
                    //     return acc;
                    //   }, {});
                    // console.log(publications);
                    setOverViewData(resp?.list?.data || []);
                } else {
                    console.error("No data found in response.");
                    notifyError("No data found. Please try again.");
                }
            } else {
                // Handle non-200 status codes or unexpected responses
                console.error("Failed to fetch data: ", resp?.message);
                notifyError("Please try again.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notifyError("An error occurred during fetching data. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false once the request is done
        }

    };
    function handleOverViewClick(item) {
        console.log(item); // Logs the clicked item
        console.log(isAuthenticated); // Logs the authentication status

        if (isAuthenticated) {
            // Open the PDF
            window.open(item.file_path, '_blank');
        } else {
            console.log(showLoginAlert); // Should work now
            setShowLoginAlert(true); // Update the alert state
        }
    }
    function handlePostClick(item) {
        if (isAuthenticated) {
            if (item === "news") {
                navigate('/news');
            } else {
                navigate('/visits');
            }
        } else {
            if (item === "news") {
                setShowNewsAlert(true)
            } else {
                setShowVisitAlert(true)
            }
        }
    }
    console.log(visitData);
    console.log(newsData);
    return (
        <React.Fragment>
            <div style={{ overflow: 'hidden' }}>
                <HeaderComponents />
                <MetaTitle pageTitle={"Redwood Peak Limited – Hong Kong based asset manager focused on fund & separate account management"} />

                {/* <div className='' style={{ width: '100%', overflow: 'hidden' }}>
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
                </div> */}
                <div>
                    <SimpleImageSlider
                        width={'100%'}
                        height={400}
                        images={images}
                        showBullets={true}
                        showNavs={true}
                    />
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
                                        {/* <div className="mt-3">
                                            {!isAuthenticated && showLoginAlert && (
                                                <div style={{ color: 'red', marginBottom: '10px' }}>
                                                    Please login first to access the files.
                                                </div>
                                            )}
                                            <ul className='ps-0' style={{ listStyle: 'none' }}>
                                                {overViewData.map((item, index) =>
                                                (
                                                    <li className="mt-2" onClick={handleOverViewClick(item)}>
                                                        {item.file_name.split('.').slice(0, -1).join('.').length > 30
                                                            ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 30) + "..."
                                                            : item.file_name.split('.').slice(0, -1).join('.')}
                                                    </li>
                                                )
                                                )}
                                            </ul>
                                        </div> */}
                                        <div className="mt-3">
                                            <div
                                                style={{
                                                    height: '20px',
                                                    marginBottom: '10px',
                                                    color: 'red',
                                                    visibility: !isAuthenticated && showLoginAlert ? 'visible' : 'hidden',
                                                }}
                                            >
                                                Please login first to access the files.
                                            </div>
                                            <ul className='ps-0' style={{ listStyle: 'none' }}>
                                                {overViewData.map((item, index) => (
                                                    <li className="mt-2 pointer" key={index} onClick={() => handleOverViewClick(item)}>
                                                        {item.file_name.split('.').slice(0, -1).join('.').length > 30
                                                            ? item.file_name.split('.').slice(0, -1).join('.').substring(0, 30) + "..."
                                                            : item.file_name.split('.').slice(0, -1).join('.')}
                                                    </li>
                                                ))}
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
                                            <p className="card-text text-left p-0" style={{ textAlign: 'left' }}>
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
                                            <p className="card-text text-left p-0" style={{ textAlign: 'left' }}>
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
                                            <p className="card-text text-left p-0" style={{ textAlign: 'left' }}>
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
                                    <div
                                        style={{
                                            height: '20px',
                                            marginBottom: '10px',
                                            color: 'red',
                                            visibility: !isAuthenticated && showNewsAlert ? 'visible' : 'hidden',
                                        }}
                                    >
                                        Please login first to access the files.
                                    </div>
                                    <ul className='ps-0'>
                                        {newsData.map((news, index) => {
                                            console.log(news)
                                            return (
                                                <li className="mt-2 pointer" key={index} onClick={() => handlePostClick("news")}>
                                                    {news?.title}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h2 className="welcome-title-class">Our Visits</h2>
                                <div className="mt-3">
                                <div
                                        style={{
                                            height: '20px',
                                            marginBottom: '10px',
                                            color: 'red',
                                            visibility: !isAuthenticated && showVisitAlert ? 'visible' : 'hidden',
                                        }}
                                    >
                                        Please login first to access the files.
                                    </div>
                                    <ul className='ps-0'>
                                        {visitData.map((visit, index) => {
                                             console.log(visit)
                                             return (
                                            <li className="mt-2 pointer" key={index} onClick={() => handlePostClick("visit")}>
                                                {visit?.title}
                                            </li>
                                        )})}
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
                <DisclaimerModal />
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default HomePage;
