import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signinAction } from "../../Redux/Auth/Action";
import { getUserProfileAction } from "../../Redux/User/Action";
import spiceupImage from '../../assets/logo.png';
import leftImage from '../../assets/bg.jpg'; 

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Signin = () => {
  const initialValues = { email: "", password: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signin } = useSelector((store) => store);
  const toast = useToast();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token || signin));
  }, [signin, token]);

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate(`/${user.reqUser?.username}`);
      toast({
        title: "Signin successful",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    }
  }, [user.reqUser]);

  const handleSubmit = (values, actions) => {
    dispatch(signinAction(values));
    actions.setSubmitting(false);
  };

  return (
    <Box
      
      display="flex"
      height="80vh"
      width="60vw"
      overflow="hidden"
    >
      {/* Left Image Section */}
      <Box
        width="40%"
        display={{ base: "none", md: "block" }}
      >
        <img
          src={leftImage}
          alt="Left Side"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* Right Form Section */}
      <Box
        width={{ base: "100%", md: "50%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="#f9f9f9"
        padding={4}
      >
        <Box
          width="100%"
          maxW="400px"
          p={8}
          boxShadow="lg"
          backgroundColor="white"
          borderRadius="md"
        >
          <img
            className="mb-5 mx-auto"
            src={spiceupImage}
            alt="SpiceUp Logo"
            style={{ width: "120px" }}
          />

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <Form>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb={4}
                    >
                      <Input
                        {...field}
                        id="email"
                        placeholder="Please Enter your Email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                      mb={4}
                    >
                      <Input
                        {...field}
                        type="password"
                        id="password"
                        placeholder="Please Enter your Password"
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <p className="mt-5 text-center text-sm">
                  By signing up, you agree to our{" "}
                  <span className="text-blue-600">Terms</span>,{" "}
                  <span className="text-blue-600">Privacy Policy</span> and{" "}
                  <span className="text-blue-600">Cookies Policy</span>.
                </p>

                <Button
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                  width="100%"
                >
                  Sign In
                </Button>

                <Button
                  as="a"
                  href="http://localhost:5454/oauth2/authorization/google"
                  colorScheme="red"
                  mt={4}
                  width="100%"
                >
                  Sign in with Google
                </Button>
              </Form>
            )}
          </Formik>

          <Box mt={6} textAlign="center">
            <p>
              If You Don't Have Already Account
              <span
                onClick={() => navigate("/signup")}
                className="ml-2 text-blue-700 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
