import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css'
import Image from '../Component/ImagesComponets/ImagesComponets';
import Slide1 from "../../assets/banner_images/redwood_homepage_hong_kong.jpg"
import Slide2 from "../../assets/banner_images/redwood_homepage_wealth_management.jpg"
import service_img1 from "../../assets/images/redrood_hgihlight_investment_strategies.png"
import service_img2 from "../../assets/images/redrood_hgihlight_investment_expertise.png"
import service_img3 from "../../assets/images/redrood_hgihlight_investment_platform.png"
import pdfIcon from "../../assets/images/pdf_icon1.png"
import Button from '../Component/ButtonComponents/ButtonComponents';
import Footer from '../Component/Footer/Footer';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import MetaTitle from '../Component/MetaTitleComponents/MetaTitleComponents';
import DisclaimerModal from '../Component/DisclimerModal/DisclimerModal';
import pagesServices from '../../Services/PagesServicesServices';
import { notifyError } from '../Component/ToastComponents/ToastComponents';
import SimpleImageSlider from "react-simple-image-slider";
import "../Home/Home.css"
import { useNavigate } from 'react-router-dom';
import { faPhone, faEnvelope, faFax, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import IconComponent from '../Component/IconComponents/IconComponents';
const outLookData = [{
    "id": 74,
    "name": "China Outlook Q1 2023.pdf",
    "category": "application",
    "path": "https://dev.jackychee.com/uploads/media/2024/12/laravel-58c1f5987c817f17b55d4153c1aacfa0.pdf",
    "size_in_kb": "97231",
    "extension": "pdf",
    "is_enabled": 1,
    "created_by": 1
},
{
    "id": 73,
    "name": "China Outlook Q4 2022.pdf",
    "category": "application",
    "path": "https://dev.jackychee.com/uploads/media/2024/12/laravel-bcf4ef7fe25972e784570cc4c53bd873.pdf",
    "size_in_kb": "120676",
    "extension": "pdf",
    "is_enabled": 1,
    "created_by": 1
},
{
    "id": 75,
    "name": "China Outlook Q3 2022.pdf",
    "category": "application",
    "path": "https://dev.jackychee.com/uploads/media/2024/12/laravel-bcd983adacdd50c49a534c3e5d9d8bd6.pdf",
    "size_in_kb": "110505",
    "extension": "pdf",
    "is_enabled": 1,
    "created_by": 1
}, {
    "id": 76,
    "name": "China Outlook Q2 2022.pdf",
    "category": "application",
    "path": "https://dev.jackychee.com/uploads/media/2024/12/laravel-88525464c0045b0c268c2d5b57c14e8a.pdf",
    "size_in_kb": "100605",
    "extension": "pdf",
    "is_enabled": 1,
    "created_by": 1
}]

// const images = [
//     { url: Slide1 },
//     { url: Slide2 },
// ];

const HomePage = () => {
    const navigate = useNavigate();

    const limit = 5;
    const page = 1;
    const isAuthenticated = localStorage.getItem('userToken');

    const documentType = "publications";
    const [isLoading, setIsLoading] = useState(true);
    const [overViewData, setOverViewData] = useState([])
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [visitData, setVisitData] = useState([])
    const [newsData, setNewsData] = useState([])


    useEffect(() => {
        getFetchOverView()
        getFetchNewsVisit()

    }, []);

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
            window.open(item.path, '_blank');
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
            setShowLoginAlert(true)
        }
    }

    const handleLogin = () => {
        navigate('/login');

    };
    const handleRegister = () => {
        navigate('/register');
    };

    const handleClose = () => setShowLoginAlert(false);

    const settings = {
        dots: true, // Enable dots below the slider
        infinite: true, // Loop through slides infinitely
        speed: 500, // Transition speed in ms
        slidesToShow: 1, // Number of slides to show
        slidesToScroll: 1, // Number of slides to scroll at a time
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // Autoplay interval in ms
    };
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
                {/*<div>*/}
                {/*    <SimpleImageSlider*/}
                {/*        width={'100%'}*/}
                {/*        height={500}*/}
                {/*        images={images}*/}
                {/*        showBullets={true}*/}
                {/*        showNavs={true}*/}
                {/*    />*/}
                {/*</div>*/}
                <div style={{ width: "100%", lineHeight: "0px" }}>
                    <Slider {...settings}>
                        <div className="slide">
                            <img
                                src={Slide1}
                                alt="Slide 1"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="slide">
                            <img
                                src={Slide2}
                                alt="Slide 2"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Slider>
                </div>

                {/* First Section */}
                <div className="wrapper pt-0 mb-5">
                    <div className="row pt-0 no-gutters d-flex align-items-stretch">
                        {/* First Column */}
                        <div className="col-md-12 col-lg-4 pr-0 pl-0 p-0">
                            <div className="card p-5 h-100 primaryBGColor">
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <h5 className="card-title cards-titles">22 OCTOBER 2023, 08.00 PM EDT</h5>
                                        <h2 className="cards-headings text-white">
                                            Smart investing strategies:<br /> building wealth for the future
                                        </h2>
                                    </div>
                                    <div className="p-0 pt-3">
                                        <Button
                                            text="Learn More"
                                            onClick={handleClick}
                                            className="cs-btn-primary"
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
                                    Empowering Your Financial Future with Bespoke Investment Excellence.
                                </h5>
                            </div>
                        </div>

                        {/* Third Column */}
                        <div className="col-md-6 col-lg-4 pr-0 pl-0 p-0">
                            <div className="card p-5 h-100 secondaryBGColor">
                                <div className="d-flex flex-row justify-content-between h-100">
                                    <div>
                                        <h3 className="welcome-title-class">Our View</h3>
                                        <div className="mt-2 pt-1">
                                            <ul className='ps-0' style={{ listStyle: 'none',display:'grid' }}>
                                                {outLookData.map((item, index) => (
                                                    <p
                                                        className='p-0 text-left pointer file-item'
                                                        key={index}
                                                        onClick={() => handleOverViewClick(item)}
                                                        style={{ textAlign: 'left' }}
                                                    >
                                                        <span className="pdf-icon">
                                                            <Image src={pdfIcon} alt="PDF icon" />
                                                        </span>
                                                        <span className="file-item-name">
                                                            {item.name?.split('.')?.slice(0, -1)?.join('.').length > 50
                                                                ? item.name?.split('.')?.slice(0, -1)?.join('.')?.substring(0, 50) + "..."
                                                                : item.name?.split('.')?.slice(0, -1)?.join('.')}
                                                        </span>
                                                    </p>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mt-5 ml-5 mr-5 mb-5 ">
                        <h3 className="">Aligning Success, Delivering Value</h3>
                        <div className="container text-left">
                            <p className='pt-2 pb-0'>
                                At Redwood Peak, we are dedicated to achieving investment excellence through a results-driven partnership with our clients, employees, and stakeholders. Since our founding in 2007, we’ve focused on providing bespoke wealth and fund management solutions for high-net-worth individuals, family offices, and institutions. With over 45 years of combined investment experience, we leverage our deep local network and disciplined approach to identify mispriced opportunities, always prioritizing the interests of our clients. Committed to excellence, integrity, and transparency, we aim to deliver sustainable success for all involved.</p>
                        </div>
                    </div>
                    {/* Services Section */}
                    <div className="container">
                        <div className="row">
                            {/* Card 1 */}
                            <div className="col-md-4">
                                <div className="tilesCard tilesCard-shadow h-100">
                                    <Image
                                        src={service_img1}
                                        alt="Service Image 1"
                                        className="tilesCard-img-top"
                                    />
                                    <div className="tilesCard-body">
                                        <h5 className="card-title cards-Label primaryColor">
                                            Tailored Investment Strategies
                                        </h5>
                                        <p className="card-text mb-0 mt-3">
                                            At Redwood Peak, we specialize in providing bespoke wealth and fund management solutions for high-net-worth individuals, family offices, and institutions. We design custom portfolios that are specifically crafted to meet your unique financial goals, with a focus on long-term growth and prudent risk management.
                                        </p>
                                    </div>
                                    <div className="tilesCard-footer text-left">
                                        <Button
                                            text="Learn More"
                                            onClick={handleClick}
                                            className="btn-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="col-md-4">
                                <div className="tilesCard tilesCard-shadow h-100">
                                    <Image
                                        src={service_img2}
                                        alt="Service Image 2"
                                        className="tilesCard-img-top"
                                    />
                                    <div className="tilesCard-body">
                                        <h5 className="card-title cards-Label primaryColor">
                                            Expertise & Integrity
                                        </h5>
                                        <p className="card-text mb-0 mt-3">
                                            With over 45 years of combined investment experience, we prioritize transparency and integrity in every partnership. Our extensive local network provides valuable insights, empowering us to make informed investment decisions. We place your interests at the forefront, ensuring our success is fully aligned with your objectives.
                                        </p>
                                    </div>
                                    <div className="tilesCard-footer text-left">
                                        <Button
                                            text="Learn More"
                                            onClick={handleClick}
                                            className="btn-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="col-md-4">
                                <div className="tilesCard tilesCard-shadow h-100">
                                    <Image
                                        src={service_img3}
                                        alt="Service Image 3"
                                        className="tilesCard-img-top"
                                    />
                                    <div className="tilesCard-body">
                                        <h5 className="card-title cards-Label primaryColor">
                                            Hedge Fund & Managed Account Platforms
                                        </h5>
                                        <p className="card-text mb-0 mt-3">
                                            We offer flexible and sophisticated investment vehicles tailored to your specific needs. Our hedge fund and managed account platforms provide access to transparent performance tracking, giving you confidence in your investments. Additionally, our operations are regulated by the Hong Kong Securities and Futures Commission, ensuring regulatory oversight and peace of mind.
                                        </p>
                                    </div>
                                    <div className="tilesCard-footer text-left">
                                        <Button
                                            text="Learn More"
                                            onClick={handleClick}
                                            className="btn-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Latest News, Visits, and Contact Us Section */}
                    <div className="container mt-5 mb-5">
                        <div className="row" style={{ marginBottom: 100 }}>
                            <div className="col-md-4">
                                <h3 className="welcome-title-class">Latest News</h3>
                                <div className="mt-3 pt-1">
                                    <ul className='ps-0'>
                                        {newsData.map((news, index) => {
                                            return (
                                                <p className='p-0 ps-3 text-left pointer news-item-name contactSectionFonts' key={index} onClick={() => handlePostClick("news")}>
                                                    <span className='file-item-name'>
                                                        {news?.title}
                                                    </span>
                                                </p>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h3 className="welcome-title-class">Our Visits</h3>
                                <div className="mt-3 pt-1">
                                    <ul className='ps-0'>
                                        {visitData.map((visit, index) => {
                                            return (
                                                <p className='p-0 ps-3 text-left pointer news-item-name contactSectionFonts' key={index} onClick={() => handlePostClick("visit")}>
                                                    <span className='file-item-name'>
                                                        {visit?.title}
                                                    </span>
                                                </p>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h3 className="welcome-title-class">Contact Us</h3>
                                <div className="mt-3">
                                    <ul className="ps-0">
                                        <p className="mt-2 d-flex contactSectionFonts">
                                            <span className="icon">
                                                <IconComponent icon={faLocationDot} className="primaryColor fontAwsomeIconSize" />
                                            </span>
                                            <span className="ps-3">
                                                18/Floor, China Hong Kong Tower, 8-12 Hennessy Road, Wan Chai, Hong Kong.
                                            </span>
                                        </p>
                                        <p className="mt-2 d-flex contactSectionFonts">
                                            <span className="icon">
                                                <IconComponent icon={faPhone} className="primaryColor fontAwsomeIconSize" />
                                            </span>
                                            <span className="ps-3 text-with-underline">
                                                Telephone: <a href="tel:+85228783100" className="text-with-underline contactLink">(852) 2878 3100</a>
                                            </span>
                                        </p>
                                        <p className="mt-2 d-flex contactSectionFonts">
                                            <span className="icon">
                                                <IconComponent icon={faFax} className="primaryColor fontAwsomeIconSize" />
                                            </span>
                                            <span className="ps-3 text-with-underline">
                                                Facsimile: <a href="tel:+85225099233" className="text-with-underline contactLink">(852) 2509 9233</a>
                                            </span>
                                        </p>
                                        <p className="mt-2 d-flex contactSectionFonts">
                                            <span className="icon">
                                                <IconComponent icon={faEnvelope} className="primaryColor fontAwsomeIconSize" />
                                            </span>
                                            <span className="ps-3 text-with-underline">
                                                Email: <a href="mailto:IR@redwoodpeak.com" className="text-with-underline contactLink">IR@redwoodpeak.com</a>
                                            </span>
                                        </p>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DisclaimerModal />
                <Footer />
                {!isAuthenticated && showLoginAlert && (
                    <div
                        className="modal fade show"
                        tabIndex="-1"
                        style={{ display: 'block', zIndex: 1050, marginTop: '5%' }}
                        id="LoginAlert"
                    >
                        <div className="modal-dialog">
                            <div
                                className="modal-content modal-custom-width"
                                style={{
                                    background: '#0f0f0f99',
                                    borderRadius: 12,
                                }}
                            >
                                {/* Top Right Close Button */}
                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={handleClose}
                                    style={{
                                        position: 'absolute',
                                        top: '25px',
                                        right: '25px',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '20px',
                                        color: '#531515',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                >
                                    X
                                </button>

                                <div
                                    className="modal-body popupContent m-3"
                                    style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        background: '#fff',
                                    }}
                                >
                                    <center className="pt-3 pb-3">
                                        <span style={{ fontSize: '20px', color: '#700000' }}>
                                            <strong>Login alert!</strong>
                                        </span>
                                    </center>
                                    <form id="disclaimerForm">
                                        <p style={{ fontSize: '14px', color: '#666666' }}>
                                            You need to log in to access this document. Please log in or register to continue.
                                        </p>
                                    </form>
                                </div>
                                <div
                                    className="modal-footer"
                                    style={{ justifyContent: 'flex-start', borderTop: 'none' }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-primary border-0 shadow-none"
                                        id="submitDisclaimer"
                                        onClick={handleLogin}
                                        style={{ width: 'auto' }}
                                    >
                                        Login
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary border-0 shadow-none ml-2"
                                        id="rejectDisclaimer"
                                        onClick={handleRegister}
                                        style={{ width: 'auto' }}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </React.Fragment>
    );
};

export default HomePage;
