import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import {
  BsBookmark,
  BsBookmarkFill,
  BsDot,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  isPostLikedByUser,
  isReqUserPost,
  isSavedPost,
  timeDifference,
} from "../../../Config/Logic";
import { createComment } from "../../../Redux/Comment/Action";
import {
  deletePostAction,
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../../Redux/Post/Action";
import CommentModal from "../../Comment/CommentModal";
import "./PostCard.css";
import EditPostModal from "../Create/EditPostModal";
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const PostCard = ({
  userProfileImage,
  username,
  location,
  post,
  createdAt,
}) => {
  const [commentContent, setCommentContent] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditPostModal, setOpenEditPostModal] = useState(false);

  const handleCommentInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const [numberOfLikes, setNumberOfLike] = useState(0);

  const data = {
    jwt: token,
    postId: post.id,
  };

  const handleAddComment = () => {
    const data = {
      jwt: token,
      postId: post.id,
      data: {
        content: commentContent,
      },
    };
    dispatch(createComment(data));
    setCommentContent("");
    

  };

  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleLikePost = () => {
    dispatch(likePostAction(data));
    setIsPostLiked(true);
    setNumberOfLike(numberOfLikes + 1);
    
  
  };

  const handleUnLikePost = () => {
    dispatch(unLikePostAction(data));
    setIsPostLiked(false);
    setNumberOfLike(numberOfLikes - 1);
  };

  const handleSavePost = () => {
    dispatch(savePostAction(data));
    setIsSaved(true);
  };

  const handleUnSavePost = () => {
    dispatch(unSavePostAction(data));
    setIsSaved(false);
  };

  const handleNavigate = (username) => {
    navigate(`/${username}`);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === post.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? post.mediaUrls.length - 1 : prev - 1
    );
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length);
  }, [user.reqUser, post]);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleWindowClick = (event) => {
    if (!event.target.matches(".dots")) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleDeletePost = (postId) => {
    const data = {
      jwt: token,
      postId,
    };
    dispatch(deletePostAction(data));
  };

  const isOwnPost = isReqUserPost(post, user.reqUser);

  const handleOpenCommentModal = () => {
    navigate(`/p/${post.id}`);
    onOpen();
  };

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false);
  };

  const handleOpenEditPostModal = () => {
    setOpenEditPostModal(true);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-3">
            <img
              className="object-cover w-10 h-10 rounded-full ring-2 ring-gray-100"
              src={post.user.userImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt=""
            />
            <div>
              <p className="font-semibold text-gray-800 cursor-pointer hover:underline"
                 onClick={() => handleNavigate(username)}>
                {post?.user?.username}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{location}</span>
                {location && <BsDot />}
                <span>{timeDifference(post?.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* More Options Button */}
          <div className="dropdown">
            <button
              onClick={handleClick}
              className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 dots"
            >
              <BsThreeDots size={20} />
            </button>

            {isOwnPost && showDropdown && (
              <div className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded-lg shadow-xl dropdown-content">
                <button
                  onClick={handleOpenEditPostModal}
                  className="w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                >
                  Edit
                </button>
                <hr />
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="w-full px-4 py-2 text-left text-red-600 transition-colors duration-200 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Description */}
        <div className="w-full px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{post?.user?.username}</span>
            <span className="text-gray-800">{post.caption}</span>
          </div>
        </div>

        {/* Media Section */}
        <div className="relative">
          {post.mediaUrls?.map((url, index) => (
            <div
              key={index}
              className={`${index === currentMediaIndex ? "block" : "hidden"}`}
            >
              {isVideo(url) ? (
                <video src={url} controls className="w-full h-[500px] object-cover" />
              ) : (
                <img src={url} alt={`Post media ${index + 1}`} className="w-full h-[500px] object-cover" />
              )}
            </div>
          ))}

          {/* Media Navigation */}
          {post.mediaUrls?.length > 1 && (
            <div className="absolute left-0 right-0 flex justify-center space-x-2 bottom-4">
              {post.mediaUrls?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 
                    ${index === currentMediaIndex ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={isPostLiked ? handleUnLikePost : handleLikePost}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200
                ${isPostLiked 
                  ? "bg-red-50 text-red-500 hover:bg-red-100" 
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {isPostLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
            </button>

            <button
              onClick={handleOpenCommentModal}
              className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors duration-200 rounded-full bg-gray-50 hover:bg-gray-100"
            >
              <FaRegComment size={20} />
              <span>Comment</span>
            </button>
          </div>

          <div className="cursor-pointer">
            {isSaved ? (
              <BsBookmarkFill
                onClick={handleUnSavePost}
                className="text-xl"
              />
            ) : (
              <BsBookmark
                onClick={handleSavePost}
                className="text-xl cursor-pointer hover:opacity-50"
              />
            )}
          </div>
        </div>

        {/* Likes and Comments Count */}
        <div className="w-full px-6 py-2 border-t">
          {numberOfLikes > 0 && (
            <p className="text-sm font-semibold">{numberOfLikes} likes</p>
          )}
          
          {post?.comments?.length > 0 && (
            <p
              onClick={handleOpenCommentModal}
              className="py-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            >
              View all {post?.comments?.length} comments
            </p>
          )}
        </div>
      </div>

      <EditPostModal
        onClose={handleCloseEditPostModal}
        isOpen={openEditPostModal}
        onOpen={handleOpenEditPostModal}
        post={post}
      />

      <CommentModal
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleUnSavePost={handleUnSavePost}
        handleUnLikePost={handleUnLikePost}
        isPostLiked={isPostLiked}
        isSaved={isSaved}
        postData={post}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
};

export default PostCard;