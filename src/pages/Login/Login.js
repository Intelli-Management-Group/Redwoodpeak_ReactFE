import React, { useState } from 'react';
import HeaderComponents from '../Component/HeaderComponents/HeaderComponents';
import { useNavigate } from 'react-router-dom';
import Button from '../Component/ButtonComponents/ButtonComponents';
import Footer from "../Component/Footer/Footer";
import AuthenticationServices from '../../Services/AuthenticationServices';
import {notifyError, notifySuccess, notifyWarning} from "../Component/ToastComponents/ToastComponents";
import { ToastContainer } from 'react-toastify';

const Login = () => {
    const[loading, setLoading] = useState(false)
    // State to hold form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    // State to handle validation errors
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true when the form is submitted.

        // Clear previous errors
        setErrors({
            email: '',
            password: '',
        });


        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const formDataCopy = { ...formData };
            delete formDataCopy.remember;

            const response = await AuthenticationServices.userLogin(formDataCopy);
            console.log(response)
            if (response?.status_code === 200) {
                const { token, user } = response;
                if (user?.status === "approve") {
                    localStorage.setItem("userToken", token);
                    localStorage.setItem('userData', JSON.stringify(user));

                    notifySuccess(`Login successful!`);
                    setTimeout(() => navigate("/"), 1500);  // Redirect to the homepage after 1.5 seconds

                } else {
                    notifyWarning(`${user?.email} has not been approved by the admin. Please contact the administrator or wait for approval.`);
                }
            } else {
                notifyError(response?.message || 'Login failed. Please try again.');
            }

        } catch (error) {
            console.error("Login Error:", error);
            notifyError(`An error occurred during login. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const redirectToRegister = () => {
        window.location.href = '/register';
    };

    return (
        <React.Fragment>
            <HeaderComponents />
            <div className="container">
                <div className="container-custom mb-5 p-2 min-heights" style={{ minHeight: '75vh' }}>
                    <div className="mt-4">
                        <div className="mt-5 m-3">
                            <form onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <label htmlFor="email">E-mail</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && (
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{errors.email}</strong>
                                            </span>
                                        )}
                                    </div>

                                    {/* Password Input */}
                                    <div className="col-md-12">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.password && (
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{errors.password}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className=" form-check mt-5 mb-1">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="remember">
                                        Keep me signed in
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="form-group row mb-0 mt-2">
                                    <Button
                                        text={loading ?  "Loading..." :"Login"}
                                        onClick={handleSubmit}
                                        className="btn btn-primary"
                                        disabled={loading}
                                        type="submit"
                                    />

                                    <Button
                                        text="Register"
                                        onClick={redirectToRegister}
                                        className="btn btn-secondary ms-3 button-gap"
                                        type="submit"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>

            <Footer />
        </React.Fragment>
    );
};

export default Login;
