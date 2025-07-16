// src/components/ProfilePage.js

import AuthenticationServices from '../../Services/AuthenticationServices';
import { notifyError, notifySuccess, notifyWarning } from "../Component/ToastComponents/ToastComponents";
import { ToastContainer } from 'react-toastify';
import React, { useEffect, useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import Form from 'react-bootstrap/Form';
import Select from "react-select";
import countryList from 'react-select-country-list'
import Footer from "../Component/Footer/Footer";
import Button from '../Component/ButtonComponents/ButtonComponents';

const ProfilePage = () => {
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
  const [focusedField, setFocusedField] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [pwConfirmPassword, setPwConfirmPassword] = useState("");
  const [pwEmailError, setPwEmailError] = useState("");
  const [pwPasswordError, setPwPasswordError] = useState("");
  const [pwConfirmPasswordError, setPwConfirmPasswordError] = useState("");
  const [pwIsLoading, setPwIsLoading] = useState(false);
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData');
  const [user, setUser] = useState(JSON.parse(userData));


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
    // Validate only the changed field
    const fieldError = validateField(name, value, { ...formData, [name]: value });
    setErrors(prev => {
      const newErrors = { ...prev, [name]: fieldError };
      if (!fieldError) delete newErrors[name];
      return newErrors;
    });
  };
  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleBlur = (e) => {
    setFocusedField("");
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption ? selectedOption.value : "" });
    setIsEdited(true);
  };

  const validateField = (name, value, allData) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    const checkLength = (val, min, max) => {
      if (val.length < min) return `must be at least ${min} characters long.`;
      if (val.length > max) return `cannot exceed ${max} characters.`;
      return null;
    };
    switch (name) {
      case "first_name":
        if (!value) return "First name is required.";
        if (checkLength(value, 3, 30)) return `First name ${checkLength(value, 3, 30)}`;
        if (!nameRegex.test(value)) return "First name can only contain letters, spaces, hyphens, and apostrophes.";
        break;
      case "last_name":
        if (!value) return "Last name is required.";
        if (checkLength(value, 3, 30)) return `Last name ${checkLength(value, 3, 30)}`;
        if (!nameRegex.test(value)) return "Last name can only contain letters, spaces, hyphens, and apostrophes.";
        break;
      case "username":
        if (!value) return "Username is required";
        if (checkLength(value, 3, 30)) return `Username ${checkLength(value, 3, 30)}`;
        break;
      case "email":
        if (!value) return "Email is required.";
        if (!emailRegex.test(value)) return "Please enter a valid email address.";
        break;
      case "password":
        if (value && !passwordRegex.test(value)) return "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
        if (value && value !== allData.confirmPassword) return "Passwords do not match.";
        break;
      case "confirmPassword":
        if (allData.password && value !== allData.password) return "Passwords do not match.";
        break;
      case "contact_no":
        if (!value) return "Contact number is required.";
        if (!/^[0-9]+$/.test(value)) return "Contact number must contain only numbers.";
        if (value.length < 8 || value.length > 15) return "Contact number must be between 8 and 15 digits.";
        break;
      case "company_name":
        if (value) {
          const err = checkLength(value, 3, 30);
          if (err) return `Company name ${err}`;
        }
        break;
      default:
        return null;
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    if (validateForm()) {
      try {
        const formdata = new FormData();
        formdata.append("id", formData?.id ? formData?.id : "");
        formdata.append("first_name", formData?.first_name);
        formdata.append("last_name", formData?.last_name);
        formdata.append("email", formData?.email);
        formdata.append("contact_no", formData?.contact_no);
        formdata.append("country", formData?.country);
        formdata.append("company_name", formData?.company_name);;
        if (!formData?.id) {
          formdata.append("password", formData?.password);
          formdata.append("confirm_password", formData?.confirmPassword);
        }
        formdata.append("username", formData?.username);
        // formdata.append("name", formData?.name);
        formdata.append("role", formData?.role);
        formdata.append("status", formData?.id ? formData?.status : "approve");
        formdata.append("send_user_notification", "1");
        formdata.append("role_id", "");
        // Call API to register user
        const response = await AuthenticationServices.userSignUp(formdata);
        if (response?.status_code === 200) {
          notifySuccess(formData?.id ? "User Updated SuccessFully!" : "User Created SuccessFully");
          localStorage.setItem('userData', JSON.stringify(response.user));
        } else {
          throw new Error(response.message || "Something went wrong!");
        }
      } catch (error) {
        notifyError(error.message || "Failed to register user.",);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false)
    }
  };

  const ChangePassword = (e) => {
    e.preventDefault();
    setPwEmail(formData.email || "");
    setShowPasswordModal(true);
  }

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPwEmailError("");
    setPwPasswordError("");
    setPwConfirmPasswordError("");
    setPwEmail("");
    setPwPassword("");
    setPwConfirmPassword("");
    setPwIsLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwEmailError("");
    setPwPasswordError("");
    setPwConfirmPasswordError("");
    let valid = true;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!pwEmail) {
      setPwEmailError("Email is required.");
      valid = false;
    } else if (!emailRegex.test(pwEmail)) {
      setPwEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!pwPassword) {
      setPwPasswordError("Password is required.");
      valid = false;
    } else if (!passwordRegex.test(pwPassword)) {
      setPwPasswordError("Password must contain at least one lowercase letter, one uppercase letter, and one number.");
      valid = false;
    }
    if (!pwConfirmPassword) {
      setPwConfirmPasswordError("Confirm password is required.");
      valid = false;
    } else if (pwPassword !== pwConfirmPassword) {
      setPwConfirmPasswordError("Passwords do not match.");
      valid = false;
    }
    if (!valid) return;
    setPwIsLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("token", token);
      formdata.append("email", pwEmail);
      formdata.append("password", pwPassword);

      const response = await AuthenticationServices.Update_Password_Via_Mail(formdata);
      if (response.status_code === 200) {
        notifySuccess(`Password Updated Successfully!`);
        handlePasswordModalClose();
      } else {
        setError(response.message || 'Failed to update password');
      }
    } catch (err) {
      notifyError('Error updating password');
    } finally {
      setIsLoading(false);
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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        isInvalid={errors.first_name && (focusedField === "first_name" || submitted)}
                        required
                      />
                      {errors.first_name && (focusedField === "first_name" || submitted) && <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>}
                    </Form.Group>

                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        isInvalid={errors.last_name && (focusedField === "last_name" || submitted)}
                        required
                      />
                      {errors.last_name && (focusedField === "last_name" || submitted) && <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>}
                    </Form.Group>

                    <Form.Group controlId="username" className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        isInvalid={errors.username && (focusedField === "username" || submitted)}
                        required
                      />
                      {errors.username && (focusedField === "username" || submitted) && <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>}
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

                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="mt-2">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={ChangePassword}
                        >Change Password</button>
                      </div>
                    </Form.Group>

                    {/* Password Change Modal */}
                    <Modal
                      show={showPasswordModal}
                      onHide={handlePasswordModalClose}
                      centered
                      backdrop="static"
                      keyboard={false}
                    >
                      <Modal.Body style={{ padding: 0 }}>
                        <div
                          style={{
                            fontFamily: 'Arial, sans-serif',
                            backgroundColor: '#0f0f0f99',
                            minHeight: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '15px',
                            borderRadius: '7px',
                          }}
                        >
                          <div
                            style={{
                              // maxWidth: '400px',
                              width: '100%',
                              padding: '20px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Password</h2>
                            <div>
                              <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="pwEmail" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Email Address</label>
                                <input
                                  type="email"
                                  id="pwEmail"
                                  name="pwEmail"
                                  required
                                  placeholder="Enter your email"
                                  value={pwEmail}
                                  disabled
                                  onChange={e => setPwEmail(e.target.value)}
                                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                {pwEmailError && <div style={{ color: 'red', fontSize: '12px' }}>{pwEmailError}</div>}
                              </div>

                              <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="pwPassword" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>New Password</label>
                                <input
                                  type="password"
                                  id="pwPassword"
                                  name="pwPassword"
                                  required
                                  placeholder="Enter your new password"
                                  value={pwPassword}
                                  onChange={e => {
                                    setPwPassword(e.target.value);
                                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
                                    if (!e.target.value) {
                                      setPwPasswordError("Password is required.");
                                    } else if (!passwordRegex.test(e.target.value)) {
                                      setPwPasswordError("Password must contain at least one lowercase letter, one uppercase letter, and one number.");
                                    } else if (pwConfirmPassword && e.target.value !== pwConfirmPassword) {
                                      setPwPasswordError("");
                                      setPwConfirmPasswordError("Passwords do not match.");
                                    } else {
                                      setPwPasswordError("");
                                      setPwConfirmPasswordError("");
                                    }
                                  }}
                                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                {pwPasswordError && <div style={{ color: 'red', fontSize: '12px' }}>{pwPasswordError}</div>}
                              </div>

                              <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="pwConfirmPassword" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Confirm New Password</label>
                                <input
                                  type="password"
                                  id="pwConfirmPassword"
                                  name="pwConfirmPassword"
                                  required
                                  placeholder="Confirm your new password"
                                  value={pwConfirmPassword}
                                  onChange={e => {
                                    setPwConfirmPassword(e.target.value);
                                    if (!e.target.value) {
                                      setPwConfirmPasswordError("Confirm password is required.");
                                    } else if (pwPassword && e.target.value !== pwPassword) {
                                      setPwConfirmPasswordError("Passwords do not match.");
                                    } else {
                                      setPwConfirmPasswordError("");
                                    }
                                  }}
                                  style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                {pwConfirmPasswordError && <div style={{ color: 'red', fontSize: '12px' }}>{pwConfirmPasswordError}</div>}
                              </div>

                              <div style={{ marginBottom: '15px' }}>
                                <button
                                  type="button"
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#511515',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                  }}
                                  disabled={pwIsLoading}
                                  onClick={handlePasswordUpdate}
                                >
                                  {pwIsLoading ? 'Updating...' : 'Update Password'}
                                </button>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <button type="button" onClick={handlePasswordModalClose} style={{ background: 'none', border: 'none', color: '#511515', textDecoration: 'underline', cursor: 'pointer' }}>Cancel</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>

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
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        isInvalid={errors.contact_no && (focusedField === "contact_no" || submitted)}
                        required
                      />
                      {errors.contact_no && (focusedField === "contact_no" || submitted) && <Form.Control.Feedback type="invalid">{errors.contact_no}</Form.Control.Feedback>}
                    </Form.Group>

                    <Form.Group controlId="company_name" className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        isInvalid={errors.company_name && (focusedField === "company_name" || submitted)}
                        required
                      />
                      {errors.company_name && (focusedField === "company_name" || submitted) && <Form.Control.Feedback type="invalid">{errors.company_name}</Form.Control.Feedback>}
                    </Form.Group>


                    <Button
                      text={loading ? "Updateting..." : "Update"}
                      onClick={handleSubmit}
                      disabled={loading || !isEdited}
                      className="btn btn-primary w-auto"
                      type="submit"
                    />

                    {/* <Button
                      text={"Cancel"}
                      onClick={() => setIsEditing(false)}
                      className="btn btn-primary w-auto ms-3"
                      type="submit"
                    /> */}
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
    // <div className="">
    //   {isEditing ? (
    //     <ProfileEdit user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} />
    //   ) : (
    //     <ProfileView user={user} onEdit={() => setIsEditing(true)} />
    //   )}

    // </div>
  );
};

export default ProfilePage;
