import React, { useState } from 'react';
import Footer from "../Footer/Footer";
import HeaderComponents from "../HeaderComponents/HeaderComponents";
import { ToastContainer } from "react-toastify";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const formdata = new FormData();
    formdata.append("user_id", "");
    formdata.append("old_password", "");
    formdata.append("new_password", "");
    formdata.append("confirm_password", "");

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch("{{url}}/api/user/update-password", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return;
        }

        // Here, add the logic to send the data to your backend API
        // For demonstration, let's assume it's successful
        setSuccessMessage("Password successfully changed.");
        setErrorMessage('');
    };

    return (
        <React.Fragment>
            <div className="page-wrapper">

                <HeaderComponents />
                <div className="content-area">

                    <div className="container">
                        <div className="container-custom mb-5 p-2 min-heights" style={{}}>
                            <div className="mt-4">
                                <div className="mt-5 m-3">
                                    {/* Email Input */}
                                    <form>
                                        <div className="row profile-form mt-4 ">
                                            <div className="col-md-12 pt-3">
                                                <label>Current Password</label>
                                                <br />
                                                <input
                                                    type="password"
                                                    className="form-control "
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 pt-3">
                                                <label>New Password:</label>
                                                <input
                                                    type="password"
                                                    className="form-control "
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-12 pt-3">
                                                <label>Confirm New Password:</label>
                                                <input
                                                    type="password"
                                                    className="form-control "
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className=" mb-0 pt-3 mt-2">
                                                <button text="Change Password"
                                                    className="btn btn-primary"
                                                    disabled
                                                    type="submit">
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ChangePassword;
