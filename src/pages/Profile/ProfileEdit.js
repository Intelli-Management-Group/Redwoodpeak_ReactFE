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
    const [isEdited, setIsEdited] = useState(false);

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
        contact_no: "",
        country: "",
        company_name: ""
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
                contact_no: user?.contact_no || "",
                country: user?.country || "",
                company_name: user?.company_name || "",
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
        setIsEdited(true);
    };

    const handleCountryChange = (selectedOption) => {
        setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" });
        setIsEdited(true);
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        const nameRegex = /^[a-zA-Z\s'-]+$/;

        // Helper for length check
        const checkLength = (value, min, max) => value.length < min ? `must be at least ${min} characters long.` : value.length > max ? `cannot exceed ${max} characters.` : null;

        // Name fields
        [
            { key: 'first_name', label: 'First name' },
            { key: 'last_name', label: 'Last name' }
        ].forEach(({ key, label }) => {
            const val = formData[key];
            if (!val) {
                newErrors[key] = `${label} is required.`;
            } else if (checkLength(val, 3, 30)) {
                newErrors[key] = `${label} ${checkLength(val, 3, 30)}`;
            } else if (!nameRegex.test(val)) {
                newErrors[key] = `${label} can only contain letters, spaces, hyphens, and apostrophes.`;
            }
        });

        // Username
        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (checkLength(formData.username, 3, 30)) {
            newErrors.username = `Username ${checkLength(formData.username, 3, 30)}`;
        }

        // Email
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Password (only if provided)
        if (formData.password) {
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.password = "Passwords do not match.";
            }
        }

        // Contact
        if (!formData.contact_no) {
            newErrors.contact_no = "Contact number is required.";
        } else if (!/^[0-9]+$/.test(formData.contact_no)) {
            newErrors.contact_no = "Contact number must contain only numbers.";
        } else if (formData.contact_no.length < 8 || formData.contact_no.length > 15) {
            newErrors.contact_no = "Contact number must be between 8 and 15 digits.";
        }

        // Company Name (optional)
        if (formData.company_name) {
            if (checkLength(formData.company_name, 3, 30)) {
                newErrors.company_name = `Company name ${checkLength(formData.company_name, 3, 30)}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (validateForm()) {
            onSave(formData);
            notifySuccess('Profile updated successfully!');
            setLoading(false)
            setIsEdited(false);
        } else {
            setLoading(false)
        }
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
                                                name="contact_no"
                                                value={formData.contact_no}
                                                onChange={handleChange}
                                                isInvalid={errors.contact_no}
                                                required
                                            />
                                            {errors.contact_no && <Form.Control.Feedback type="invalid">{errors.contact_no}</Form.Control.Feedback>}
                                        </Form.Group>

                                        <Form.Group controlId="company_name" className="mb-3">
                                            <Form.Label>Company Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                isInvalid={errors.company_name}
                                                required
                                            />
                                            {errors.company_name && <Form.Control.Feedback type="invalid">{errors.company_name}</Form.Control.Feedback>}
                                        </Form.Group>


                                        <Button
                                            text={loading ? "Updateting..." : "Update"}
                                            onClick={handleSubmit}
                                            disabled={loading || !isEdited}
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
                </div>
                <ToastContainer />
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ProfileEdit;
