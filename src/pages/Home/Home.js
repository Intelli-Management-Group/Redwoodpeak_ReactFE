import React, { useEffect, useRef, useState } from 'react';
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
import "../Home/Home.css"
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { faPhone, faEnvelope, faFax, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import IconComponent from '../Component/IconComponents/IconComponents';
import AuthenticationServices from '../../Services/AuthenticationServices';
import moment from 'moment';
import Logo from "../../assets/images/logo.png"


const HomePage = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    // const prevLocationRef = useRef(); // This will store the previous location


    const limit = 5;
    const page = 1;
    const isAuthenticated = localStorage.getItem('userToken');

    const documentType = "publications";
    const [isLoading, setIsLoading] = useState(true);
    const [isOverVirewLoading, setIsOverVirewLoading] = useState(true);
    const [overViewData, setOverViewData] = useState([])
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [visitData, setVisitData] = useState([])
    const [newsData, setNewsData] = useState([])
    const [tokenLoading, setTokenLoading] = useState(false);
    // const prevLocation = useRef(location);  // Store the previous location
   

    // useEffect(() => {
    //     const handleTokenMessage = (event) => {
    //         const token = event?.data?.token;
    //         if(token){
    //             setTokenLoading(true);
    //         }
    //         const currentDomain = window.location.origin;
    //         console.log("Current domain:", currentDomain);
            
    //         if (event.origin === currentDomain && token) {
    //             const decodedToken = atob(token);
    //             if (decodedToken) {
    //                 getTokenVerify(decodedToken);
    //             }
    //         }

    //         // Compare previous route with current route
    //         setTimeout(() => {
    //             if (prevLocation.current.origin === currentDomain) {
    //                 setTokenLoading(false);  // Set tokenLoading to false if the route is same
    //             }
    //         }, 4000);
    //     };

    //     window.addEventListener("message", handleTokenMessage);

    //     return () => {
    //         window.removeEventListener("message", handleTokenMessage);
    //     };
    // }, [location]);

    // // To track the previous location and update it on route change
    // useEffect(() => {
    //     prevLocation.current = location; // Update the previous location
    // }, [location]);
    

    useEffect(() => {
        // console.log("Current location:", location);
        // const currentLocation = location.pathname;
        // const previousLocation = prevLocationRef.current;
        // console.log("current Location",currentLocation)
        // console.log("previousLocation Location",previousLocation)
        const handleTokenMessage = (event) => {
            const token = event?.data?.token;
            if (token) {
                setTokenLoading(true)
                const decodedToken = atob(token);
                if (decodedToken) {
                    getTokenVerify(decodedToken);
                }
            }else{
                setTokenLoading(false)
            }
            setTimeout(() => {
                setTokenLoading(false);
            }, 4000);
        };
        window.addEventListener("message", handleTokenMessage);
        return () => {
            window.removeEventListener("message", handleTokenMessage);
        };
    }, []);

    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);
    //     const token = params.get('token');
    //     if (token) {
    //         try {
    //             const decodedToken = atob(token);
    //             if (decodedToken) {
    //                 getTokenVerify(decodedToken)
    //             }
    //         } catch (error) {
    //             console.error("Invalid token:", error);
    //             notifyError("Invalid token in URL.");
    //         }
    //     }
    // }, [location]);

    useEffect(() => {
        getFetchOverView();
        getFetchNews();
        getFetchVisit();
    }, []);

    const getTokenVerify = async (tokens) => {
        try {
            const resp = await AuthenticationServices.tokenVerify(tokens);
            if (resp?.status_code === 200) {

                localStorage.setItem("userToken", tokens);
                localStorage.setItem("token", tokens);
                localStorage.setItem('userData', JSON.stringify(resp.message));

            } else {
                notifyError(resp?.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Token verification error:", error);
            notifyError("An error occurred during token verification. Please try again.");
        }
    };

    const handleClick = () => {
        console.log("Learn more clicked!");
    };

    const getFetchNews = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("category", "news");
            const resp = await pagesServices.getPostList({
                page: page,
                limit: limit,
                body: formData,
            });
            if (resp?.status_code === 200) {
                if (resp?.list?.data) {
                    setNewsData(resp?.list?.data)
                }
            } else {
                console.error("Failed to fetch data: ", resp?.message);
                notifyError("Please try again.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notifyError("An error occurred during fetching data. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };
    const getFetchVisit = async (category) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("category", "visit");
            const resp = await pagesServices.getPostList({
                page: page,
                limit: limit,
                body: formData,
            });
            if (resp?.status_code === 200) {
                console.log("only NEws Data", resp);
                if (resp?.list?.data) {
                    setVisitData(resp?.list?.data)
                }

            } else {
                console.error("Failed to fetch data: ", resp?.message);
                notifyError("Please try again.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notifyError("An error occurred during fetching data. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };

    const getFetchOverView = async () => {
        setIsOverVirewLoading(true);
        try {
            const resp = await pagesServices.getPageList({ limit, page, documentType });
            if (resp?.status_code === 200) {
                console.log(resp);
                if (resp?.list?.data) {
                    setOverViewData(resp?.list?.data || []);
                    setIsOverVirewLoading(false)
                } else {
                    console.error("No data found in response.");
                    notifyError("No data found. Please try again.");
                }
            } else {
                setIsOverVirewLoading(false);
                console.error("Failed to fetch data: ", resp?.message);
                notifyError("Please try again.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notifyError("An error occurred during fetching data. Please try again.");
            setIsOverVirewLoading(false);
        } finally {
            setIsOverVirewLoading(false);
        }

    };
    function handleOverViewClick(item) {
        // console.log(item);
        // console.log(isAuthenticated);

        if (isAuthenticated) {
            window.open(item.file_path, '_blank');
        } else {
            console.log(showLoginAlert);
            setShowLoginAlert(true);
        }
    }
    function handlePostClick(item, data) {
        if (isAuthenticated) {
            if (item === "news") {
                navigate('/news', { state: { id: data.id } });
            } else {
                navigate('/visits', { state: { id: data.id } });
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

    const formatDate = (date) => {
        return moment(date).format('DD MMMM YYYY, hh:mm A');
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    return (
        <React.Fragment>
            {tokenLoading ? (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <div className="centered-logo-loading">
                        <div className="logo-containerss">
                            <img src={Logo} className="d-inline-block align-top" alt="Logo" />
                            <p className="mt-3 text-center bouncing-dots">Loading<span></span><span></span><span></span></p>
                        </div>

                    </div>
                </div>
            ) : (
                <div style={{ overflow: 'hidden' }}>
                    <HeaderComponents />
                    <MetaTitle pageTitle={"Redwood Peak Limited – Hong Kong based asset manager focused on fund & separate account management"} />
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
                                        {isLoading ? (
                                            <p className="p-0 mt-5 text-left contactSectionFonts text-white">
                                                Loading please wait...
                                            </p>
                                        ) : newsData?.length === 0 ? (
                                            <p className="p-0 mt-5 text-left contactSectionFonts text-white">
                                                <span>
                                                    Oops! No data available at the moment. <br /> Please try again later.
                                                </span>
                                            </p>
                                        ) : (
                                            newsData.slice(0, 1).map((news, index) => (
                                                <React.Fragment key={index}>
                                                    <div>
                                                        <h5 className="card-title cards-titles" style={{ fontSize: 16 }}>{formatDate(news?.created_at)}</h5>
                                                        <h2 className="cards-headings text-white">{news?.title}</h2>
                                                    </div>
                                                    <div className="p-0 pt-3">
                                                        <Button
                                                            text="Describe News"
                                                            onClick={() => handlePostClick("news", news)}
                                                            className="cs-btn-primary"
                                                        />
                                                    </div>
                                                </React.Fragment>
                                            ))
                                        )}
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
                                                <ul className='ps-0' style={{ listStyle: 'none', display: 'grid' }}>
                                                    {/* Conditional rendering for loading and empty data */}
                                                    {isOverVirewLoading ? (
                                                        <p className='p-0 mt-2 text-left text-blue-500 font-semibold'>
                                                            Loading overview data, please wait...
                                                        </p>
                                                    ) : overViewData?.length === 0 ? (
                                                        <p className='p-0 mt-2 text-left text-red-500 font-semibold'>
                                                            Oops! No data available at the moment. Please try again later.
                                                        </p>
                                                    ) : (
                                                        overViewData.slice(0, 4).map((item, index) => (
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
                                                                    {(() => {
                                                                        const targetName = "redwood peak china outlook";
                                                                        const file_name = item.file_name || "";
                                                                        const name = item.name || "";

                                                                        const fileNameWithoutExtension = file_name.split('.').slice(0, -1).join('.');

                                                                        const normalize = (str) => str.toLowerCase().replace(/-/g, " ").trim();
                                                                        const normalizedFileName = normalize(fileNameWithoutExtension);
                                                                        const normalizedName = normalize(name);

                                                                        const shouldDisplayTargetName =
                                                                            normalizedFileName.startsWith(targetName) || normalizedName.startsWith(targetName);

                                                                        let displayName = shouldDisplayTargetName
                                                                            ? (normalizedFileName.startsWith(targetName) ? fileNameWithoutExtension : name)
                                                                            : fileNameWithoutExtension;

                                                                        return displayName.length > 60 ? displayName.substring(0, 60) + "..." : displayName;
                                                                    })()}
                                                                </span>

                                                            </p>
                                                        ))
                                                    )}
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
                                                disabled={true}
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
                                                disabled={true}
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
                                                disabled={true}
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
                                            {isLoading ? (
                                                <p className='p-0 mt-2 text-left contactSectionFonts'>
                                                    Loading news, please wait...
                                                </p>
                                            ) : newsData?.length === 0 ? (
                                                <p className='p-0 mt-2 text-left contactSectionFonts'>
                                                    <span>
                                                        Oops! No data available at the moment. <br /> Please try again later.
                                                    </span>
                                                </p>
                                            ) : (
                                                newsData?.map((news, index) => (
                                                    <li key={index} className='p-0 ps-3 text-left pointer news-item-name contactSectionFonts'>
                                                        <span className='file-item-name' onClick={() => handlePostClick("news", news)}>
                                                            {news?.title}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
                                        </ul>

                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <h3 className="welcome-title-class">Our Visits</h3>
                                    <div className="mt-3 pt-1">
                                        <ul className='ps-0'>
                                            {isLoading ? (
                                                <p className='p-0 mt-2 text-left contactSectionFonts'>
                                                    Loading visit data, please wait...
                                                </p>
                                            ) : visitData?.length === 0 ? (
                                                <p className='p-0 mt-2 text-left contactSectionFonts'>
                                                    <span>
                                                        Oops! No data available at the moment. <br /> Please try again later.
                                                    </span>
                                                </p>
                                            ) : (
                                                visitData.map((visit, index) => (
                                                    <li key={index} className='p-0 ps-3 text-left pointer news-item-name contactSectionFonts'>
                                                        <span className='file-item-name' onClick={() => handlePostClick("visit", visit)}>
                                                            {visit?.title}
                                                        </span>
                                                    </li>
                                                ))
                                            )}
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
            )}
        </React.Fragment>
    );
};

export default HomePage;
