import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

import React, { useEffect, useState, useRef } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import "./CreatePostModal.css";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPost, findPostByIdAction } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import CommentModal from "../../Comment/CommentModal";
import SpinnerCard from "../../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { editPOst } from "../../../Redux/Post/Action";
import { useToast } from "@chakra-ui/react";


const EditPostModal = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [postData, setPostData] = useState({
    caption: "",
    location: "",
    mediaUrls: [],
    id: null
  });

  useEffect(() => {
    if (post) {
      setPostData({
        caption: post.caption || "",
        location: post.location || "",
        mediaUrls: post.mediaUrls || [],
        id: post.id
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setLoading(true);
        try {
          const imageUrl = await uploadToCloudinary(file);
          if (imageUrl) {
            setPostData(prev => ({
              ...prev,
              mediaUrls: [imageUrl]
            }));
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            throw new Error("Failed to get image URL");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Failed to upload image",
            description: "Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!postData.id) return;

    const data = {
      jwt: token,
      data: {
        id: postData.id,
        caption: postData.caption,
        location: postData.location,
        mediaUrls: postData.mediaUrls
      }
    };

    dispatch(editPOst(data));
    onClose();
  };

  return (
    <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
      <ModalContent className="overflow-hidden shadow-2xl rounded-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-bold text-white">Edit Post</h2>
            <Button
              onClick={handleSubmit}
              bgGradient="linear(to-r, red.400, pink.500)"
              _hover={{ bgGradient: "linear(to-r, red.500, pink.600)" }}
              color="white"
              size="md"
              isLoading={loading}
              loadingText="Updating..."
              px={6}
              rounded="full"
            >
              Update
            </Button>
          </div>
        </div>

        <ModalBody p={6}>
          <div className="flex flex-col space-y-6">
            {/* Caption Input */}
            <div>
              <textarea
                className="w-full p-4 min-h-[150px] text-lg border rounded-lg resize-none 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  bg-gray-50"
                placeholder="Write a caption..."
                name="caption"
                value={postData.caption}
                onChange={handleInputChange}
              />
              <div className="flex justify-end mt-2">
                <span className="text-sm text-gray-500">
                  {postData.caption?.length}/2,200
                </span>
              </div>
            </div>

            {/*modify edit Location Input */}
            <input
              className="w-full p-4 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              type="text"
              placeholder="Add location"
              name="location"
              value={postData.location}
              onChange={handleInputChange}
            />

            {/*modify Image Section */}
            <div 
              className="relative min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg
                hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
              onClick={handleImageClick}
            >
              {postData.mediaUrls?.length > 0 ? (
                <img
                  className="object-contain w-full h-full p-4 max-h-[400px]"
                  src={postData.mediaUrls[0]}
                  alt="post"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="p-4 mb-4 rounded-full bg-blue-50">
                    <FaPhotoVideo className="text-3xl text-blue-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    Click to upload photo
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    JPG, PNG files are allowed
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
