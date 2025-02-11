import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderComponents from "../Component/HeaderComponents/HeaderComponents";
import Footer from "../Component/Footer/Footer";
import Button from '../Component/ButtonComponents/ButtonComponents';
import MetaTitle from "../Component/MetaTitleComponents/MetaTitleComponents";
import AuthenticationServices from "../../Services/AuthenticationServices";
import { notifyError, notifySuccess } from "../Component/ToastComponents/ToastComponents";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!email) {
            setErrors({ email: "Email is required." });
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Email is not valid." });
            return;
        }

        try {
            setLoading(true);

            const formdata = new FormData();
            formdata.append("email", email);
            const response = await AuthenticationServices.ForgotPassword(formdata);

            if (response.status_code === 200) {
                notifySuccess(`Reset link sent to your email.`);
              } else {
                notifyError(`Something went wrong. Please try again.`);
              }


            // if (response.ok) {
            //     console.log("Reset link sent to your email.");

            // }else{
            //     const data = await response.json();
            //     console.log("response",response)
            //     if (data.error) {
            //         setErrors({ email: data.error });
            //     } else {
            //         throw new Error("Something went wrong. Please try again.");
            //     }
            // }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <HeaderComponents />
            <MetaTitle pageTitle={"ForgotPassword"} />
            <div className="container">
                <div className="container-custom mb-5 p-2 min-heights" style={{ minHeight: "75vh" }}>
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
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        {errors.email && (
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{errors.email}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="form-group row mb-0 mt-4">
                                    <Button
                                        text={loading ? "Sending..." : "Send Reset Link"}
                                        onClick={handleSubmit}
                                        className="btn btn-primary fitContent"
                                        disabled={loading}
                                        type="submit"
                                    />
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

export default ForgotPassword;
