import React, { useEffect, useState } from "react";
import ContactUsBanner from "../../assets/banner_images/redwood_contact_us.jpg"
import Maps from "../../assets/images/rewood_location.png"
import Image from "../Component/ImagesComponets/ImagesComponets";
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import Footer from "../Component/Footer/Footer";
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";
import Input from "../Component/InputComponents/InputComponents";
import Button from "../Component/ButtonComponents/ButtonComponents";
import IconComponent from "../Component/IconComponents/IconComponents";
import { faPhone, faEnvelope, faFax, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    useEffect(() => {
        console.log('component mounted');
    }, []);

    // Form Functionality Commented
    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     setErrors({});

    //     let formErrors = {};

    //     if (!formData.name) {
    //         formErrors.name = "Name is required.";
    //     }

    //     if (!formData.email) {
    //         formErrors.email = "Email is required.";
    //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //         formErrors.email = "Email is not valid.";
    //     }

    //     if (!formData.subject) {
    //         formErrors.subject = "Subject is required.";
    //     }

    //     if (!formData.message) {
    //         formErrors.message = "Message is required.";
    //     }

    //     if (Object.keys(formErrors).length > 0) {
    //         setErrors(formErrors);
    //     } else {
    //         console.log(formData);
    //     }
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };


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
            {/*<div className="container mb-5">*/}
            {/*    <div className="container-custom mt-1 mb-5 p-lg-4">*/}
            {/*        /!*<h1 className="header-post-title-class">Contact Us</h1>*!/*/}

            {/*    </div>*/}
            {/*</div>*/}
            <div className="row m-0 p-0 " >
                
                <div className="mt-2 mt-xl-5 col-md-6">
                    {/* style={{ marginTop: "15%", marginLeft: "15%" }} */}
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
                        // style={{width:"100%", height:"100%"}}
                        />
                    </div>
                    {/* Currently Form Commentds */}
                    {/* <form onSubmit={handleSubmit}>
                                <div className="row pt-5">
                                    <Input
                                        label="Your Name"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                    />

                                    <Input
                                        label="E-mail"
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        required
                                    />

                                    <Input
                                        label="Subject"
                                        id="subject"
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        error={errors.subject}
                                        required
                                    />
                                    <div className="col-md-12 mt-4">
                                        <label htmlFor="message">Your Message</label>
                                        <textarea
                                            id="message"
                                            className={`form-control ${errors.message ? "is-invalid" : ""}`}
                                            name="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        {errors.message && (
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{errors.message}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group row mb-0 mt-3 ml-0 mr-0 ps-2">
                                    <Button
                                        text="Send"
                                        onClick={handleSubmit}
                                        className="btn-primary"
                                        type="submit"
                                    />
                                </div>
                            </form> */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
