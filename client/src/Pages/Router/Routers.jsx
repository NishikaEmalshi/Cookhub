import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import { getUserProfileAction } from "../../Redux/User/Action";
import Auth from "../Auth/Auth";
import EditProfilePage from "../EditProfile/EditProfilePage";
import HomePage from "../HomePage/HomePage";
import Profile from "../Profile/Profile";
import LearningPlan from "../../Components/LearningPlan/LearningPlan";
import LearningProgress from "../../Components/LearningProgress/LearningProgress";
import AboutUs from "../AboutUs/AboutUs";
import OAuthSuccess from "../Auth/OAuthSuccess";

const Routers = () => {
  const location = useLocation();
  const reqUser = useSelector((store) => store.user.reqUser);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!isAuthPage && <Navbar />} {/* Top Navbar on all pages except login/signup */}

      <Routes>
        {isAuthPage ? (
          <>
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/p/:postId" element={<HomePage />} />
            <Route path="/p/:postId/edit" element={<HomePage />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="/account/edit" element={<EditProfilePage />} />
            <Route path="/learning_plan" element={<LearningPlan />} />
            <Route path="/learning-progress" element={<LearningProgress />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default Routers;