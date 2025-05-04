import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserDetailsAction,
  getUserProfileAction,
} from "../../Redux/User/Action";
import ChangeProfilePhotoModal from "./ChangeProfilePhotoModal";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";

const EditProfileForm = () => {
  const { user } = useSelector((store) => store);
  const toast = useToast();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    mobile: "",
    gender: "",
    private: false,
  });

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    const newValue = {};
    for (let item in initialValues) {
      if (user.reqUser && user.reqUser[item]) {
        newValue[item] = user.reqUser[item];
      }
    }
    formik.setValues(newValue);
  }, [user.reqUser]);

  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: (values) => {
      const data = {
        jwt: token,
        data: { ...values, id: user.reqUser?.id },
      };
      dispatch(editUserDetailsAction(data));
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleProfileImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    const image = await uploadToCloudinary(selectedFile);
    setImageFile(image);
    const data = {
      jwt: token,
      data: { image, id: user.reqUser?.id },
    };
    dispatch(editUserDetailsAction(data));
    onClose();
  };

  return (
    <Box
      maxW="700px"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <Flex mb={6} alignItems="center">
        <Avatar
          size="md"
          name={user.reqUser?.name}
          src={
            imageFile ||
            user.reqUser?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
        />
        <Box ml={4}>
          <Text fontWeight="bold">{user.reqUser?.username}</Text>
          <Text
            color="blue.500"
            fontSize="sm"
            cursor="pointer"
            onClick={onOpen}
          >
            Change Profile Photo
          </Text>
        </Box>
      </Flex>

      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={5} align="stretch">
          <FormControl>
            <FormLabel>Your Name</FormLabel>
            <Input {...formik.getFieldProps("name")} placeholder="Please enter your Name" />
          </FormControl>

          <FormControl>
            <FormLabel>Your Username</FormLabel>
            <Input {...formik.getFieldProps("username")} placeholder="Please enter your Username" />
          </FormControl>


          <FormControl>
            <FormLabel>Enter Bio</FormLabel>
            <Textarea {...formik.getFieldProps("bio")} placeholder="Please enter your Bio" />
          </FormControl>

          <Heading size="sm" pt={4} borderTop="1px solid #eee">
            Personal Information
          </Heading>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type="email" {...formik.getFieldProps("email")} placeholder="Please enter your Email" />
          </FormControl>

          <FormControl>
            <FormLabel>Phone number</FormLabel>
            <Input type="tel" {...formik.getFieldProps("mobile")} placeholder="Please enter your Phone" />
          </FormControl>

          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Input type="text" {...formik.getFieldProps("gender")} placeholder="Please enter your Gender" />
          </FormControl>

          <Button colorScheme="blue" type="submit">
            Save Changes
          </Button>
        </VStack>
      </form>

      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </Box>
  );
};

export default EditProfileForm;
