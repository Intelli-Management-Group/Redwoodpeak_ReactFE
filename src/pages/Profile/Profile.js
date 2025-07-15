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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
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
                            backgroundColor: '#fff',
                            minHeight: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '400px',
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
                                  onChange={e => setPwPassword(e.target.value)}
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
                                  onChange={e => setPwConfirmPassword(e.target.value)}
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
