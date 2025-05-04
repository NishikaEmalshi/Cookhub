import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfilePostsPart from '../../Components/ProfilePageCard/ProfilePostsPart';
import UserDetailCard from '../../Components/ProfilePageCard/UserDetailCard';
import { isFollowing, isReqUser } from '../../Config/Logic';
import { findByUsernameAction, getUserProfileAction } from '../../Redux/User/Action';

const Profile = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { username } = useParams();
  const { user } = useSelector(store => store);

  const isRequser = isReqUser(user.reqUser?.id, user.findByUsername?.id);
  const isFollowed = isFollowing(user.reqUser, user.findByUsername);

  useEffect(() => {
    const data = {
      token,
      username
    };
    dispatch(getUserProfileAction(token));
    dispatch(findByUsernameAction(data));
  }, [username, user.follower, user.following, dispatch, token]);

  const activeUser = isRequser ? user.reqUser : user.findByUsername;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 bg-white border border-gray-100 shadow-md rounded-xl">
          <UserDetailCard 
            user={activeUser} 
            isFollowing={isFollowed} 
            isRequser={isRequser}
          />
        </div>

        {/* Profile Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex justify-center -mb-px">
            <div className="px-6 py-3 text-sm font-medium text-blue-500 border-b-2 border-blue-500">
              Posts
            </div>
          </nav>
        </div>

        {/* Posts Grid */}
        <div className="p-6 bg-white border border-gray-100 shadow-md rounded-xl">
          <ProfilePostsPart user={activeUser} />
        </div>
      </div>
    </div>
  );
};

export default Profile;