import React, { useEffect } from "react";
import Footer from '../Component/Footer/Footer';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import OurMissionBanner from "../../assets/images/redwood_our_approach.jpg"
import Image from "../Component/ImagesComponets/ImagesComponets";
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";
import RiskManagement from "../../assets/banner_images/redwood_risk_management.png"
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import IconComponent from "../Component/IconComponents/IconComponents";
import horizontalArrow from "../../assets/images/arrow.png"
import verticalArrow from "../../assets/images/verticalArrow.png"

const OurApproach = () => {
    useEffect(() => {
        console.log('component mounted');
    }, []);
    return (
        <div className="page-wrapper">
            <HeaderComponents />
            <MetaTitle pageTitle={'Our Approach – Redwood Peak Limited'} />
            <div className="content-area">
                <div>
                    <Image
                        src={OurMissionBanner}
                        className="w-100 bannerHeight"
                        alt="OverView Banner"
                    />
                </div>

                {/* Main Content */}
                <div className="container mb-5">
                    <div className="container-custom mt-1 mb-5 p-4">
                        {/*<h1 className="header-post-title-class">Our Approach</h1>*/}

                        <div class="mt-3">
                            <p>
                                Our investment process begins with identifying mispriced companies relative to their intrinsic value. The investment team internally generates research ideas by identifying high quality companies through meetings and screening securities. Using our extensive local network we meet managements, industry experts and assess a company’s ability to generate superior returns. We look for high quality managements who know how to run their companies well, and understand how to generate a cash return on capital above their cost of capital. We look for businesses which demonstrate strong competitive advantages through high barriers to entry, including technological, cost, brand or distribution advantages. Finally, we like to buy companies at a discount and we aim to invest in companies where we can see 50% upside to their intrinsic value. Analysts make written and oral recommendations which the portfolio manager weighs based on the level of conviction and risk to the overall portfolio. The investment team continues to monitor progress in portfolio companies while the portfolio manager in conjunction with the risk manager monitors overall portfolio risk.
                            </p>
                            {/* <p class="text-center mt-5 mb-5">
                            <Image
                                // decoding="async" 
                                className="aligncenter size-full wp-image-2037 w-100"
                                src={RiskManagement}
                                alt="investment-approach" />
                        </p> */}
                            <div className="container mt-5 mb-5">
                                <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
                                    {/* Box 1 */}
                                    <div className="aprroch-Box p-4">
                                        <div className="text-left">
                                            <div className="text-primary-color fw-bold aprroch-title">Sell Discipline</div>
                                            <ul>
                                                <li>Target Price on securities</li>
                                                <li>Fundamental Deterioration</li>
                                                <li>Review with risk: 10% issuer price loss limit</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="arrow">
                                        {/* Horizontal Arrow for Larger Screens */}
                                        <Image
                                            className="aligncenter size-full wp-image-2037 w-100 d-none d-md-block"
                                            src={horizontalArrow}
                                            alt="Horizontal Arrow"
                                        />

                                        {/* Vertical Arrow for Smaller Screens */}
                                        <Image
                                            className="aligncenter size-full wp-image-2037 w-100 d-block d-md-none"
                                            src={verticalArrow}
                                            alt="Vertical Arrow"
                                        />
                                    </div>

                                    {/* Box 2 */}
                                    <div className="aprroch-Box p-4">
                                        <div className="text-left">
                                            <div className="text-primary-color fw-bold aprroch-title">Real Time Monitoring</div>
                                            <ul>
                                                <li>Risk Manager and QRMO systems</li>
                                                <li>Real-time Position Monitoring</li>
                                                <li>3 layers of risk control</li>
                                                <ul>
                                                    <li>- Hard pre-trade systems</li>
                                                    <li>- Middle office risk reporting</li>
                                                    <li>- Internal Risk Officer Review</li>
                                                    <li>- Attribution</li>
                                                </ul>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="arrow">
                                        {/* Horizontal Arrow for Larger Screens */}
                                        <Image
                                            className="aligncenter size-full wp-image-2037 w-100 d-none d-md-block"
                                            src={horizontalArrow}
                                            alt="Horizontal Arrow"
                                        />

                                        {/* Vertical Arrow for Smaller Screens */}
                                        <Image
                                            className="aligncenter size-full wp-image-2037 w-100 d-block d-md-none"
                                            src={verticalArrow}
                                            alt="Vertical Arrow"
                                        />
                                    </div>

                                    {/* Box 3 */}
                                    <div className="aprroch-Box p-4">
                                        <div className="text-left">
                                            <div className="text-primary-color fw-bold aprroch-title">Risk Management</div>
                                            <ul>
                                                <li>Risk Manager and systems</li>
                                                <li>Daily Attribution</li>
                                                <li>Short Equities and hedges</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default OurApproach;
