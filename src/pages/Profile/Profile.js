// src/components/ProfilePage.js
import React, { useState } from 'react';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';


const ProfilePage = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        username: '@johndoe',
        email: 'johndoe@example.com',
        role: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (updatedUser) => {
        setUser(updatedUser);
        setIsEditing(false);
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
