import React from 'react';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import { ToastContainer } from "react-toastify";
import Footer from "../Component/Footer/Footer";
import { useNavigate } from "react-router";


const ProfileView = ({ user, onEdit }) => {
    console.log(user)
    const navigate = useNavigate();

    const ChangePassword = () => {
        navigate('/ChangePassword');
    }
    return (
        <React.Fragment>
            <HeaderComponents />
            <div className="container">
                <div className="container-custom mb-5 p-2 min-heights" style={{ minHeight: '75vh' }}>
                    <div className="mt-4">
                        <div className="mt-5 m-3">
                            <div className=" row profile-view ">
                                <div className="col-6 col-md-3">
                                    <p>First Name </p>
                                    <p>Last Name </p>
                                    <p>User Name </p>
                                    <p>Email </p>
                                    <p>Country</p>
                                    <p>Contact</p>
                                    <p>Company Name</p>
                                </div>
                                <div className="col-6 col-md-3">
                                    <p>{user.first_name}</p>
                                    <p>{user.last_name}</p>
                                    <p>{user.username}</p>
                                    <p>{user.email}</p>
                                    <p>{user.country}</p>
                                    <p>{user.contact}</p>
                                    <p>{user.companyName}</p>
                                </div>
                            </div>
                            <br/>
                            <div>
                                <button text="Change Profile"
                                        className="btn btn-primary"
                                        type="submit"
                                        onClick={onEdit}>Edit Profile
                                </button>
                                <button text="Change Password"
                                        className="btn btn-primary ms-2"
                                        type="submit"
                                        onClick={ChangePassword}>Change Password
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </React.Fragment>
    );
};

export default ProfileView;
