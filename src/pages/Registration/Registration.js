import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Component/Footer/Footer";
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import Button from "../Component/ButtonComponents/ButtonComponents";
import AuthenticationServices from "../../Services/AuthenticationServices";
import { notifyError, notifySuccess, notifyWarning } from "../Component/ToastComponents/ToastComponents";
import { ToastContainer } from 'react-toastify';
import Select from "react-select";
import countryList from 'react-select-country-list'
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";


const Registration = () => {
  const navigate = useNavigate();
  const options = useMemo(() => countryList().getData(), [])
  const [loading, setLoading] = useState(false)
  // Form state and error state
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    companyName: "",
    contact: "",
    position: "",
    role: "user"
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" });
    if (!selectedOption) {
      setErrors({ ...errors, country: "Please select a country." });
    } else {
      setErrors({ ...errors, country: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const registrationData = new FormData();
      populateFormData(registrationData);

      const response = await AuthenticationServices.userSignUp(registrationData);

      if (response?.status_code === 200) {
        const { token, user } = response;

        if (user?.status === "pending") {
          notifySuccess(
            `Thank you for registering, ${user?.email}! Your account is pending admin approval. Please contact the administrator or wait for approval.`
          );
        } else {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userData", JSON.stringify(user));
          notifySuccess("Sign-up successful!");
          setTimeout(() => navigate("/"), 2500);
        }

        resetFormData();
      } else if (response?.status_code === 500 && response.message === "User With this Email Already Exist") {
        notifyError("Email already exists.");
      } else {
        notifyError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      notifyError("Failed to register. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = (formData) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.contact) {
      errors.contact = "Contact number is required.";
    } else if (!contactRegex.test(formData.contact)) {
      errors.contact = "Please enter a valid 10-digit contact number.";
    }

    return errors;
  };

  const populateFormData = (formDataObj) => {
    formDataObj.append("id", "");
    formDataObj.append("email", formData.email);
    formDataObj.append("password", formData.password);
    formDataObj.append("confirm_password", formData.confirmPassword);
    formDataObj.append("first_name", formData.firstName);
    formDataObj.append("last_name", formData.lastName);
    formDataObj.append("username", "");
    formDataObj.append("country", formData.country);
    formDataObj.append("contact_no", formData.contact);
    formDataObj.append("company_name", formData.companyName);
    formDataObj.append("position", formData.position);
    formDataObj.append("role", formData.role);
    formDataObj.append("status", "pending");
  };

  const resetFormData = () => {
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      companyName: "",
      contact: "",
      position: "",
      role: "user",
    });
  };


  return (
    <React.Fragment>
      <HeaderComponents />
      <MetaTitle pageTitle={"Registration"} />

      <div className="container ">
        <div className="container-custom mb-5 p-2 min-heights">
          {/* <h1 className="ml-5">Register</h1> */}
          <div className="mt-4 inside-container">
            <div className="text-center">
              <span
                style={{
                  color: "#823535",
                  fontSize: "22px",
                }}
              >
                Register for member-level access
              </span>
            </div>
            <div className="pt-3 text-center">
              <span style={{ color: "#823535" }}>
                Your password must contain at least one small letter, one capital letter and one number
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <label htmlFor="firstName">First Name <span style={{color:"red"}}>*</span></label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="lastName">Last Name <span style={{color:"red"}}>*</span></label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>
              {/* userName & Email  */}
              <div className="row mt-4">
                {/* <div className="col-md-6">
                  <label htmlFor="userName">User Name</label>
                  <input
                    id="userName"
                    type="text"
                    className={`form-control ${errors.userName ? "is-invalid" : ""}`}
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                  {errors.userName && (
                    <div className="invalid-feedback">{errors.userName}</div>
                  )}
                </div> */}
                <div className="col-md-12">
                  <label htmlFor="email">Email <span style={{color:"red"}}>*</span></label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>


              </div>

              {/* Password & Confirm Password */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <label htmlFor="password">Password <span style={{color:"red"}}>*</span></label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              {/* contact & Country */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <label htmlFor="contact">Contact</label>
                  <input
                    id="contact"
                    type="text"
                    className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                  {errors.contact && (
                    <div className="invalid-feedback">{errors.contact}</div>
                  )}
                </div>

                {/* <div className="col-md-6">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    className={`form-control ${errors.country ? "is-invalid" : ""}`}
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                  </select>
                  {errors.country && (
                    <div className="invalid-feedback">{errors.country}</div>
                  )}
                </div> */}
                <div className="col-md-6">
                  <label htmlFor="country">Country</label>
                  <Select
                    id="country"
                    options={options} // Country options from react-select-country-list
                    className={`basic-single ${errors.country ? "is-invalid" : ""}`}
                    classNamePrefix="select"
                    onChange={handleCountryChange}
                    value={options.find((option) => option.value === formData.country)} // Set selected value
                    placeholder="Select a country..."
                    isClearable
                  />
                  {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                </div>
              </div>

              {/* Company Name & Position */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    id="companyName"
                    type="text"
                    className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback">{errors.companyName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="position">Position</label>
                  <input
                    id="position"
                    type="text"
                    className={`form-control ${errors.position ? "is-invalid" : ""}`}
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                  {errors.position && (
                    <div className="invalid-feedback">{errors.position}</div>
                  )}
                </div>


              </div>

              {/* Position */}
              <div className="row mt-4">

              </div>

              {/* Footer information */}
              <div className="mt-2">
                <div style={{ fontSize: "17px" }}>
                  * For investor-level access please{" "}
                  <b>
                    <i>
                      <Link to="/contact-us" target="_blank" rel="noopener noreferrer">
                        contact us
                      </Link>
                    </i>
                  </b>
                  &nbsp;to ascertain your status as a professional investor.
                </div>
              </div>

              {/* Submit & Redirect buttons */}
              <div className="form-group row mb-0 mt-2 justify-content-center">
                <Button
                  text={loading ? "Submitting..." : "Submit"}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary w-auto"
                  type="submit"
                />
                {/* <Button
                  text="Login"
                  onClick={redirectToLogin}
                  className="btn btn-secondary ms-3 button-gap"
                  type="submit"
                /> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </React.Fragment>
  );
};

export default Registration;
