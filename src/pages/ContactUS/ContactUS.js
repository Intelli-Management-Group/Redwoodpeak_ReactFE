import React from "react";
import ContactUsBanner from "../../assets/banner_images/redwood_contact_us.jpg"
import Maps from "../../assets/images/rewood_location.png"
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import Footer from "../Component/Footer/Footer";
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";
import IconComponent from "../Component/IconComponents/IconComponents";
import { faPhone, faEnvelope, faFax, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {

    return (
        <div>
            <HeaderComponents />
            <MetaTitle pageTitle={'Contact Us – Redwood Peak Limited'} />

            <div>
                <Image
                    src={ContactUsBanner}
                    className="w-100 bannerHeight"
                    alt="CONTACT US Banner"
                />

            </div>
            <div className="row m-0 p-0 " >
                
                <div className="mt-2 mt-xl-5 col-md-6">
                    <ul className="contact-left-content" >
                        <p>
                            <strong>
                                <span style={{ color: "#823535" }}>Redwood Peak Limited</span>
                            </strong>
                        </p>
                        <p className="mt-3 d-flex contactSectionFonts">
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
                <div className="col-md-6 p-0">
                    <div id="map" className="mobileTopMargin">
                        <Image
                            src={Maps}
                            className="w-100 mapImage"
                            alt="CONTACT US Banner"
                        />
                    </div>            
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
