import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import Image from '../ImagesComponets/ImagesComponets';
import Logo from "../../../assets/images/logo.png";
import IconComponent from "../IconComponents/IconComponents";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const HeaderComponents = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('userToken');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent immediate closing
        setDropdownOpen((prev) => !prev); // Toggle dropdown
        setOpenDropdown(null); // Close other dropdowns
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleDropdownToggle = (dropdownName) => {
        setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const handleAuth = (actionType) => {
        navigate(actionType === "login" ? '/login' : '/register');
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    };

    const encodeToken = (token) => btoa(token);

    const handleRedirectWithToken = () => {
        const token = encodeToken(isAuthenticated);
        const targetDomain = "https://admin.jackychee.com/";
        const newWindow = window.open(targetDomain, "_blank");
        setTimeout(() => newWindow.postMessage({ token }, targetDomain), 2000);
    };

    return (
        <Navbar expand="xl" className="container px-4 mx-sm-3 mx-md-4 mx-lg-5">
            <Navbar.Brand href="/">
                <Image src={Logo} alt="Logo" />
            </Navbar.Brand>

            <div className="d-flex align-items-center ">
                <Navbar.Toggle aria-controls="navbarSupportedContent" className="me-2" />

                {isAuthenticated ? (
                    <div className="dropdown d-xl-none ms-2 me-2" ref={dropdownRef}>
                        <button className="dropbtn pe-2 border-0 bg-transparent" onClick={toggleDropdown}>
                            <IconComponent icon={faUser} className="primaryColor userIcons-size" />
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-content mt-3">
                                {(userData?.role === "admin" || userData?.role === "siteAdmin") && (
                                    <a href="#" onClick={handleRedirectWithToken}>Site Admin</a>
                                )}
                                <a href="#" onClick={() => navigate('/profile')}>Profile</a>
                                <a href="#" onClick={handleLogout}>Logout</a>
                            </div>
                        )}
                    </div>
                ): (
                    <div className='d-flex d-xl-none flex-column justify-content-center align-items-center me-1'>
                    <Button variant="primary" className="me-2 ms-2 mb-2" onClick={() => handleAuth("login")}>Log In</Button>
                    <Button variant="primary" onClick={() => handleAuth("signIn")}>Register</Button>
                  </div>
                )}
            </div>

            <Navbar.Collapse id="navbarSupportedContent" style={{ flexGrow: 0 }}>
                <Nav className="d-flex justify-content-between ps-md-5">
                    <ul className="navbar-nav mr-auto">
                        {/* Home Link */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location?.pathname === "/" ? "active-dropdown" : ""}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        {/* About Us Dropdown */}
                        <li
                            className={`nav-item dropdown ${openDropdown === "about" ? "dropdown-open" : ""}`}
                            onMouseEnter={() => handleDropdownToggle("about")}
                            onMouseLeave={() => handleDropdownToggle(null)}
                        >
                            <Link
                                className={`nav-link ${openDropdown === "about" || location?.pathname === "/our-mission" || location?.pathname === "/overview" || location?.pathname === "/senior-team" ? "active-dropdown" : ""}`}
                                to="#"
                                id="navbarDropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === "about"}
                            >
                                About Us
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/our-mission">Our Mission</Link>
                                <Link className="dropdown-item" to="/overview">Overview</Link>
                                <Link className="dropdown-item" to="/senior-team">Senior Team</Link>
                            </div>
                        </li>

                        {/* Investment Management Dropdown */}
                        <li
                            className={`nav-item dropdown ${openDropdown === "investment" ? "dropdown-open" : ""}`}
                            onMouseEnter={() => handleDropdownToggle("investment")}
                            onMouseLeave={() => handleDropdownToggle(null)}
                        >
                            <Link
                                className={`nav-link ${openDropdown === "investment" || location?.pathname === "/hedge-fund" || location?.pathname === "/managed-account" ? "active-dropdown" : ""}`}
                                to="#"
                                id="navbarDropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === "investment"}
                            >
                                Investment Management
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/hedge-fund">Hedge Fund</Link>
                                <Link className="dropdown-item" to="/managed-account">Managed Account</Link>
                            </div>
                        </li>

                        {/* Our Approach Link */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location?.pathname === "/our-approach" ? "active-dropdown" : ""}`}
                                to="/our-approach"
                            >
                                Our Approach
                            </Link>
                        </li>

                        {/* Publication & Updates Dropdown */}
                        <li
                            className={`nav-item dropdown ${openDropdown === "publication" ? "dropdown-open" : ""}`}
                            onMouseEnter={() => handleDropdownToggle("publication")}
                            onMouseLeave={() => handleDropdownToggle(null)}
                        >
                            <Link
                                className={`nav-link ${openDropdown === "publication" || location?.pathname === "/publications" || location?.pathname === "/news" || location?.pathname === "/visits" ? "active-dropdown" : ""}`}
                                to="#"
                                id="navbarDropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === "publication"}
                            >
                                Publication & Updates
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/publications">Publications</Link>
                                <Link className="dropdown-item" to="/news">News</Link>
                                <Link className="dropdown-item" to="/visits">Visits</Link>
                            </div>
                        </li>

                        {/* Investor Resources Dropdown */}
                        <li
                            className={`nav-item dropdown ${openDropdown === "investor" ? "dropdown-open" : ""}`}
                            onMouseEnter={() => handleDropdownToggle("investor")}
                            onMouseLeave={() => handleDropdownToggle(null)}
                        >
                            <Link
                                className={`nav-link ${openDropdown === "investor" || location?.pathname === "/hedge-fund-reports" || location?.pathname === "/managed-account-reports" ? "active-dropdown" : ""}`}
                                to="#"
                                id="navbarDropdown"
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === "investor"}
                            >
                                Investor Resources
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/hedge-fund-reports">Hedge Fund Reports</Link>
                                <Link className="dropdown-item" to="/managed-account-reports">Managed Account Reports</Link>
                            </div>
                        </li>

                        {/* Contact Us Link */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location?.pathname === "/contact-us" ? "active-dropdown" : ""}`}
                                to="/contact-us"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </Nav>
            </Navbar.Collapse>

            {isAuthenticated ? (
                <div className="dropdown d-none d-xl-flex ms-3" ref={dropdownRef}>
                    <button className="dropbtn pe-5 me-5 border-0 bg-transparent" onClick={toggleDropdown}>
                        <IconComponent icon={faUser} className="primaryColor fontAwsomeIconSize" />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-content" style={{
                            position: "absolute",
                            top: "30px",
                            right: "80px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "5px",
                            zIndex: 1000,
                            width: "150px",
                            padding: "5px 0",
                        }}>
                            {(userData?.role === "admin" || userData?.role === "siteAdmin") && (
                                <a href="#" onClick={handleRedirectWithToken}>Site Admin</a>
                            )}
                            <a href="#" onClick={() => navigate('/profile')}>Profile</a>
                            <a href="#" onClick={handleLogout}>Logout</a>
                        </div>
                    )}
                </div>
            ) : (
                <div className='d-none d-xl-flex justify-content-end me-sm-3'>
                    <Button variant="primary" className="me-2 ms-3" onClick={() => handleAuth("login")}>Log In</Button>
                    <Button variant="primary" onClick={() => handleAuth("signIn")}>Register</Button>
                </div>
            )}
        </Navbar>
    );
};

export default HeaderComponents;
