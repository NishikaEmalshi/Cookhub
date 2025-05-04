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
    <div>
      <div className="flex flex-col items-center w-full border rounded-md">
        <div className="flex justify-between items-center w-full py-4 px-5">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full"
              src={
                post.user.userImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt=""
            />

            <div className="pl-2">
              <p className="font-semibold text-sm flex items-center">
                <span
                  onClick={() => handleNavigate(username)}
                  className="cursor-pointer"
                >
                  {post?.user?.username}
                </span>
                <span className="opacity-50 flex items-center">
                  <BsDot />
                  {timeDifference(post?.createdAt)}
                </span>
              </p>
              <p className="font-thin text-sm">{location}</p>
            </div>
          </div>
          <div>
          <div className="dropdown">
          <button
  onClick={handleClick}
  className="dots flex items-center gap-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition duration-300 ease-in-out"
>
  More
</button>


  
  {isOwnPost && showDropdown && (
    <div className="dropdown-content">
      <div className="p-2 w-[10rem] shadow-xl bg-white">
        <p
          onClick={handleOpenEditPostModal}
          className="hover:bg-slate-300 py-2 px-4 cursor-pointer font-semibold"
        >
          Edit
        </p>
        <hr />
        <p
          onClick={() => handleDeletePost(post.id)}
          className="hover:bg-slate-300 px-4 py-2 cursor-pointer font-semibold"
        >
          Delete
        </p>
      </div>
    </div>
  )}
</div>

          </div>
        </div>

        {/* Media Slider Section */}
        <div className="w-full relative">
          {post.mediaUrls?.map((url, index) => (
            <div
              key={index}
              className={`${index === currentMediaIndex ? "block" : "hidden"}`}
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  controls
                  className="w-full"
                />
              ) : (
                <img
                  src={url}
                  alt={`Post media ${index + 1}`}
                  className="w-full"
                />
              )}
            </div>
          ))}

          {post.mediaUrls?.length > 1 && (
            <>
              {}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                {post.mediaUrls?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentMediaIndex ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    aria-label={`Go to media ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center w-full px-5 py-4">
  <div className="flex items-center space-x-4">
    {isPostLiked ? (
      <button
        onClick={handleUnLikePost}
        className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
      >
        Unlike
      </button>
    ) : (
      <button
        onClick={handleLikePost}
        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded"
      >
        Like
      </button>
    )}

    <button
      onClick={handleOpenCommentModal}
      className="px-3 py-1 text-white bg-gray-500 hover:bg-gray-600 rounded"
    >
      Comment
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
                className="text-xl hover:opacity-50 cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="w-full py-2 px-5">
          {numberOfLikes > 0 && (
            <p className="text-sm">{numberOfLikes} likes</p>
          )}
          <p className="py-2">
            <span className="font-semibold">{post?.user?.username}</span> {post.caption}
          </p>
          {post?.comments?.length > 0 && (
            <p
              onClick={handleOpenCommentModal}
              className="opacity-50 text-sm py-2 -z-0 cursor-pointer"
            >
              View all {post?.comments?.length} comments
            </p>
          )}
        </div>
        <div className="border border-t w-full">
          <div className="w-full flex items-center px-5">
            <BsEmojiSmile />
            <input
              onKeyPress={handleOnEnterPress}
              onChange={handleCommentInputChange}
              value={commentContent}
              className="commentInput"
              type="text"
              placeholder="Add a comment..."
            />
          </div>
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