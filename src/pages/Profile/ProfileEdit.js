import React, { useEffect, useState, useMemo } from 'react';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import { ToastContainer } from "react-toastify";
import Form from 'react-bootstrap/Form';
import Select from "react-select";
import countryList from 'react-select-country-list'
import Footer from "../Component/Footer/Footer";
import { notifyError, notifySuccess } from '../Component/ToastComponents/ToastComponents';
import Button from '../Component/ButtonComponents/ButtonComponents';
const ProfileEdit = ({ user, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false)

    const options = useMemo(() => countryList().getData(), []);
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
        status: "",
        contact: "",
        country: "",
        companyName: ""
    });

    const [errors, setErrors] = useState({});

    // Pre-fill form fields when userData changes
    useEffect(() => {
        if (user) {
            setFormData({
                id: user?.id || "",
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                username: user?.username || "",
                email: user?.email || "",
                name: user?.name || "",
                contact: user?.contact || "",
                country: user?.country || "",
                companyName: user?.companyName || "",
                role: user?.role || "",
                status: user?.status || "approve",
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

    const handleCountryChange = (selectedOption) => {
        setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name) newErrors.first_name = "First Name is required";
        if (!formData.last_name) newErrors.last_name = "Last Name is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.contact) newErrors.contact = "Contact is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.companyName) newErrors.companyName = "Company Name is required";
        if (formData.password && formData.password !== formData.confirmPassword) {
            newErrors.password = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (validateForm()) {
            onSave(formData);
            notifySuccess('Profile updated successfully!');
            setLoading(false)

        } else {
            setLoading(false)
            // notifyError('Please fix the errors in the form.');
        }
    };

    return (
        <React.Fragment>
            <HeaderComponents />
            <div className="container">
                <div className="container-custom mb-5 p-2 min-heights" style={{ minHeight: '75vh' }}>
                    <div className="mt-4">
                        <div className="mt-5 m-3">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        isInvalid={errors.first_name}
                                        required
                                    />
                                    {errors.first_name && <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        isInvalid={errors.last_name}
                                        required
                                    />
                                    {errors.last_name && <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        isInvalid={errors.username}
                                        required
                                    />
                                    {errors.username && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="country" className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Select
                                        id="country"
                                        options={options}
                                        onChange={handleCountryChange}
                                        value={options.find(option => option.value === formData.country)}
                                        isInvalid={errors.country}
                                        placeholder="Select a country..."
                                        isClearable
                                    />
                                    {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                </Form.Group>

                                <Form.Group controlId="contact_no" className="mb-3">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        isInvalid={errors.contact}
                                        required
                                    />
                                    {errors.contact && <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>}
                                </Form.Group>

                                <Form.Group controlId="companyName" className="mb-3">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        isInvalid={errors.companyName}
                                        required
                                    />
                                    {errors.companyName && <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>}
                                </Form.Group>


                                <Button
                                    text={loading ? "Updateting..." : "Update"}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn btn-primary w-auto"
                                    type="submit"
                                />

                                <Button
                                    text={"Cancel"}
                                    onClick={onCancel}
                                    className="btn btn-primary w-auto ms-3"
                                    type="submit"
                                />
                                {/* <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={onCancel}
                                    style={{ width: 'auto' }}
                                    className="ms-2"
                                >
                                    
                                </Button> */}
                            </Form>
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
