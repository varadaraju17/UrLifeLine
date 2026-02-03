import React from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
        return <div className="text-center mt-10">Please login to view profile.</div>
    }

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-2xl mx-auto surface rounded-lg shadow-md overflow-hidden">
                <div className="bg-[#0f1724] p-4 text-white">
                    <h1 className="text-2xl font-bold">Profile: {currentUser.name}</h1>
                </div>
                <div className="p-6 text-gray-200">
                    <p className="mb-2">
                        <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{" "}
                        {currentUser.token.substr(currentUser.token.length - 20)}
                    </p>
                    <p className="mb-2">
                        <strong>Id:</strong> {currentUser.id}
                    </p>
                    <p className="mb-2">
                        <strong>Email:</strong> {currentUser.email}
                    </p>
                    <p className="mb-2">
                        <strong>Roles:</strong>
                        <ul className="list-disc ml-5 mt-1 text-gray-300">
                            {currentUser.roles &&
                                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
