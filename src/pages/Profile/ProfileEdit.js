import React, { useState } from 'react';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import {ToastContainer} from "react-toastify";
import Footer from "../Component/Footer/Footer";
const ProfileEdit = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <React.Fragment>
            <HeaderComponents />
            <div className="container">
                <div className="container-custom mb-5 p-2 min-heights" style={{minHeight: '75vh'}}>
                    <div className="mt-4">
                        <div className="mt-5 m-3">
                            {/* Email Input */}
                            <form onSubmit={handleSubmit}>
                                <div className="row profile-form mt-4 ">
                                    <div className="col-md-12 pt-3">
                                        <label>Name</label>
                                        <br/>
                                        <input
                                            type="text"
                                            name="Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control "
                                        />
                                    </div>
                                    <div className="col-md-12 pt-3">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="form-control "
                                        />
                                    </div>
                                    <div className="col-md-12 pt-3">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control "
                                        />
                                    </div>
                                    <div className="col-md-12 pt-3">
                                        <label>Role</label>
                                        <input
                                            type="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="form-control "
                                        />
                                    </div>
                                    <div className=" mb-0 pt-3 mt-2">
                                        <button
                                            text="Save"
                                            className="btn btn-primary"
                                            type="submit">Save</button>
                                        <button
                                            text="Cancel"
                                            className="btn btn-primary ms-2"
                                            type="button" onClick={onCancel}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </React.Fragment>

    );
};

export default ProfileEdit;
