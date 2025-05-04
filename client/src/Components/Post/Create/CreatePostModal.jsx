import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";

import React, { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import "./CreatePostModal.css";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { Button, IconButton } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import SpinnerCard from "../../Spinner/Spinner";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const CreatePostModal = ({ onOpen, isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector(store => store);

  const [postData, setPostData] = useState({ 
    mediaUrls: [], 
    caption: '', 
    location: "" 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setIsDragOver(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    
    if (validFiles.length === 0) {
      alert("Please select image or video files.");
      return;
    }

    setUploadStatus("uploading");
    try {
      const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      setPostData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...urls.filter(url => url)]
      }));
      setUploadStatus("uploaded");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      alert("Failed to upload files. Please try again.");
    }
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === postData.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? postData.mediaUrls.length - 1 : prev - 1
    );
  };

  const handleSubmit = async () => {
    if (!token || postData.mediaUrls.length === 0) return;
    
    const data = {
      jwt: token,
      data: postData,
    };
    
    dispatch(createPost(data));
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
    setIsDragOver(false);
    setPostData({ mediaUrls: [], caption: '', location: "" });
    setUploadStatus("");
    setCurrentMediaIndex(0);
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <Modal size={"4xl"} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
      <ModalContent className="overflow-hidden shadow-2xl rounded-2xl">
        {/* Header chanage color and format */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-bold text-white">Create New Post</h2>
            <Button
              onClick={handleSubmit}
              bgGradient="linear(to-r, red.400, pink.500)"
              _hover={{ bgGradient: "linear(to-r, red.500, pink.600)" }}
              color="white"
              size="md"
              isDisabled={postData.mediaUrls.length === 0}
              px={6}
              rounded="full"
            >
              Share
            </Button>
          </div>
        </div>

        <ModalBody p={6}>
          <div className="flex flex-col space-y-6">
            {/* full screen Caption Input change */}
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

            {/* Location Input */}
            <input
              className="w-full p-4 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              type="text"
              placeholder="Add location"
              name="location"
              value={postData.location}
              onChange={handleInputChange}
            />

            {/* Media Upload Section */}
            <div 
              className={`relative min-h-[300px] border-2 border-dashed rounded-lg
                transition-colors cursor-pointer bg-gray-50
                ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {postData.mediaUrls.length > 0 ? (
                <div className="relative h-full">
                  {isVideo(postData.mediaUrls[currentMediaIndex]) ? (
                    <video
                      src={postData.mediaUrls[currentMediaIndex]}
                      className="object-contain w-full h-full p-4 max-h-[400px]"
                      controls
                    />
                  ) : (
                    <img
                      src={postData.mediaUrls[currentMediaIndex]}
                      className="object-contain w-full h-full p-4 max-h-[400px]"
                      alt="Upload preview"
                    />
                  )}
                  
                  {/* Navigation arrows for multiple media */}
                  {postData.mediaUrls.length > 1 && (
                    <>
                      <IconButton
                        icon={<ChevronLeftIcon />}
                        onClick={handlePrevMedia}
                        position="absolute"
                        left="2"
                        top="50%"
                        transform="translateY(-50%)"
                        rounded="full"
                        colorScheme="blue"
                      />
                      <IconButton
                        icon={<ChevronRightIcon />}
                        onClick={handleNextMedia}
                        position="absolute"
                        right="2"
                        top="50%"
                        transform="translateY(-50%)"
                        rounded="full"
                        colorScheme="blue"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="p-4 mb-4 rounded-full bg-blue-50">
                    <FaPhotoVideo className="text-3xl text-blue-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    Drag photos or videos here
                  </p>
                  <label className="px-6 py-2 mt-4 text-white transition-colors bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                    Select from computer
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*, video/*"
                      multiple
                      onChange={handleOnChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;