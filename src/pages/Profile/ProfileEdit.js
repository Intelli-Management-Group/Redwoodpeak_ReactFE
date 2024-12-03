import React, { useEffect, useState } from 'react';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import { ToastContainer } from "react-toastify";
import Form from 'react-bootstrap/Form';

import Footer from "../Component/Footer/Footer";
const ProfileEdit = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        username: "",
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        sendEmail: false,
        status: ''
    });
    // Pre-fill form fields when userData changes

    useEffect(() => {
        if (user) {
            setFormData({
                id: user?.id ? user?.id : "",
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                username: user.username || "",
                email: user.email || "",
                name: user.name || "",
                role: user.role || "",
                status: user.status || "approve",
                password: "",
                confirmPassword: "",
                sendEmail: false
            });
        }
    }, [user]);
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
                <div className="container-custom mb-5 p-2 min-heights" style={{ minHeight: '75vh' }}>
                    <div className="mt-4">
                        <div className="mt-5 m-3">
                            {/* Email Input */}
                            {/* <form onSubmit={handleSubmit}>
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
                            </form> */}
                            <Form onSubmit={handleSubmit}>
                                {/* <Modal.Body style={{ height: 400, overflow: "auto" }}> */}
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {/* Username */}
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                {/* Name */}
                                {/* <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group> */}

                                {/* Email */}
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={true}
                                    />
                                </Form.Group>



                                {/* Role */}
                                {/* <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >  <option value="">Select role</option>
                                        <option value="admin">Admin</option>
                                        <option value="siteAdmin">Site Admin</option>
                                        <option value="user">User</option>

                                    </Form.Control>
                                </Form.Group> */}



                                {/* Send Email Checkbox */}
                                {/* <Form.Group className="mb-3" controlId="sendEmail">
                                    <Form.Check
                                        type="checkbox"
                                        name="sendEmail"
                                        label="Send User Notification"
                                        checked={formData.sendEmail}
                                        onChange={handleChange}
                                    />
                                </Form.Group> */}
                                {/* </Modal.Body> */}

                                {/* <Modal.Footer>
                                    <Button variant="secondary" onClick={onHide}>
                                        Close
                                    </Button>
                                    <Button type="submit" variant="primary" >
                                        {userData ? "Save Changes" : "Add User"}
                                    </Button>
                                </Modal.Footer> */}
                            </Form>
                            <button
                                type="button"
                                className="btn btn-primary border-0 shadow-none"
                                id="submitDisclaimer"
                                // disabled={isButtonDisabled}
                                onClick={handleSubmit}
                                style={{ width: 'auto' }}
                            >
                                Update
                            </button>
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
