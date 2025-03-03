import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Component/ButtonComponents/ButtonComponents";
import Footer from "../Component/Footer/Footer";
import AuthenticationServices from "../../Services/AuthenticationServices";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../Component/ToastComponents/ToastComponents";
import { ToastContainer } from "react-toastify";
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // State to hold form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // State to handle validation errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setErrors({
      email: "",
      password: "",
    });

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const formDataCopy = { ...formData };
      delete formDataCopy.remember;

      const response = await AuthenticationServices.userLogin(formDataCopy);
      if (response?.status_code === 200) {
        const { token, user } = response;
        if (user?.status === "approve") {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userData", JSON.stringify(user));

          notifySuccess("Login successful!");
          setTimeout(() => {
            const from = location.state?.from?.pathname || "/";
            navigate(from);
          }, 1500);
        } else {
          notifyWarning(`${user?.email} has not been approved by the admin.`);
        }
      } else {
        notifyError(response?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      notifyError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToRegister = () => {
    window.location.href = "/register";
  };
  const forgotPassword = () => {
    window.location.href = "/forgotPassword";
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <HeaderComponents />
        <MetaTitle pageTitle={"Login"} />
        <div className="content-area">
          <div className="container">
            <div className="container-custom mb-5 p-2 min-heights">
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
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
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

                      {/* Password Input with Toggle */}
                      <div className="col-md-12">
                        <label htmlFor="password">Password</label>
                        <div className="position-relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${
                              errors.password ? "is-invalid" : ""
                            }`}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <FontAwesomeIcon
                              icon={showPassword ? faEyeSlash : faEye}
                            />
                          </button>
                        </div>
                        {errors.password && (
                          <span className="invalid-feedback" role="alert">
                            <strong>{errors.password}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-check mt-5 mb-1">
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

                    <div className="row mt-3">
                      <label
                        className="form-check-label pointer"
                        onClick={forgotPassword}
                      >
                        Forgot your password?
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="row">
                      <div className="mb-0 mt-2">
                        <Button
                          text={loading ? "Loading..." : "Login"}
                          onClick={handleSubmit}
                          className="btn-primary"
                          disabled={loading}
                          type="submit"
                        />

                        <Button
                          text="Register"
                          onClick={redirectToRegister}
                          className="btn-secondarys ms-3"
                          type="button"
                        />
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

export default Login;
