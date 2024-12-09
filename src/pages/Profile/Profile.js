// src/components/ProfilePage.js
import React, { useState } from 'react';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import AuthenticationServices from '../../Services/AuthenticationServices';
import {notifyError, notifySuccess, notifyWarning} from "../Component/ToastComponents/ToastComponents";
import { ToastContainer } from 'react-toastify';

const ProfilePage = () => {
    const userData = localStorage.getItem('userData');
    const [user, setUser] = useState(JSON.parse(userData));

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSave = async (formData) => {
        console.log(formData)
  
        try {
            const formdata = new FormData();
            formdata.append("id", formData?.id ? formData?.id : "");
            formdata.append("first_name", formData?.first_name);
            formdata.append("last_name", formData?.last_name);
            formdata.append("email", formData?.email);
            formdata.append("contact", formData?.contact);
            formdata.append("country", formData?.country);
            formdata.append("companyName", formData?.companyName);;
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
            console.log("res", response)
            if (response?.status_code === 200) {
              notifySuccess(formData?.id ? "User Updated SuccessFully!" : "User Created SuccessFully");
                localStorage.setItem('userData', JSON.stringify(response.user));

            //   setTimeout(() => {
            //     navigate(`/usersManagement?status=all`);
            //     onHide()
      
            //   }, 3000);
      
      
              // if (onSave) onSave(); // Optional callback for parent component
              // onHide();
            } else {
              throw new Error(response.message || "Something went wrong!");
            }
          } catch (error) {
            notifyError(error.message || "Failed to register user.",);
          } finally {
            setLoading(false);
          }
    };

    return (
        <div className="">
            {isEditing ? (
                <ProfileEdit user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
                <ProfileView user={user} onEdit={() => setIsEditing(true)} />
            )}

        </div>
    );
};

export default ProfilePage;
