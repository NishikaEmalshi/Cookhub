import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostCard from "../../Components/Post/PostCard/PostCard";
import { hasStory, suggetions, timeDifference } from "../../Config/Logic";
import { findUserPost } from "../../Redux/Post/Action";
import { findByUserIdsAction, getUserProfileAction } from "../../Redux/User/Action";
import "./HomePage.css";

const HomePage = () => {
  const dispatch=useDispatch();
  const [userIds, setUserIds]= useState([]);
  const token=localStorage.getItem("token");
  const reqUser = useSelector(store=>store.user.reqUser);
  const {user, post} = useSelector((store)=>store)
  const [suggestedUser,setSuggestedUser]=useState([]);
  const navigate=useNavigate();

  
 

  useEffect(()=>{
     dispatch(getUserProfileAction(token));
  },[token])


  useEffect(()=>{

    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id);
      setUserIds([ reqUser?.id, ...newIds]);
      setSuggestedUser(suggetions(reqUser))
    }


  },[reqUser])

  useEffect(()=>{
    
    const data={
      userIds:[userIds].join(","),
      jwt:token
    }

    if(userIds.length>0){
      dispatch(findUserPost(data))
      dispatch(findByUserIdsAction(data))
    }
    
  },[userIds,post.createdPost,post.deletedPost,post.updatedPost])
  
  const storyUsers=hasStory(user.userByIds)


  return (
    <div 
      className="min-h-screen"
      style={{ 
        paddingTop: "5px",
        backgroundImage: `url('https://t4.ftcdn.net/jpg/07/97/89/53/360_F_797895328_VRaJ04gpKCahlOPFhM45epaCIMhpy0qT.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="mt-10 flex w-[100%] justify-center">
        <div className="flex flex-col w-[44%] px-10 items-center">
          <div className="w-full space-y-10 postsBox">
            {post.userPost?.length>0 && post?.userPost?.map((item) => (
              <PostCard
                userProfileImage={
                  item.user.userImage?item.user.userImage:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                username={item?.user?.username}
                location={item?.location}
                postImage={item?.image}
                
                createdAt={timeDifference(item?.createdAt)}
                postId={item?.id}
                post={item}
              />
            ))}
          </div>
        </div>
      </div> 
    </div>
  );
};

export default HomePage;


