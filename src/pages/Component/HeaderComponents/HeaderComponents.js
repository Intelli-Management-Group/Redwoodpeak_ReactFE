
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


import { Navbar, Nav, Button } from 'react-bootstrap';
import Image from '../ImagesComponets/ImagesComponets';
import Logo from "../../../Assetes/images/logo.png"


const HeaderComponents = () => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);


    const handleDropdownToggle = (dropdownName) => {
        setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };
    const handleAuth = (actionType) => {
        if (actionType === "login") {
            navigate('/login');
        } else if (actionType === "signIn") {
            navigate('/register');
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.href = '/';
    }
    // console.log(openDropdown, location)
    return (
        <Navbar expand="lg" className="container px-4 mx-sm-3 mx-md-4 mx-lg-5">
            <Navbar.Brand href="/">
                <Image
                    src={Logo}
                    alt="Logo"
                    className=""
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarSupportedContent" />
            <Navbar.Collapse id="navbarSupportedContent">
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
                {isAuthenticated ? (
                    <Button variant="primary" className="ms-auto w-auto" onClick={handleLogout}>Logout</Button>
                ) : (
                    <>
                        <Button variant="primary" className="me-2 ms-3 w-auto" onClick={() => handleAuth("login")}>
                            Log In
                        </Button>
                        <Button variant="primary" className="w-auto" onClick={() => handleAuth("signIn")}>
                            Sign In
                        </Button>
                    </>
                )}
            </Navbar.Collapse >
        </Navbar >

    );
};

export default HeaderComponents;