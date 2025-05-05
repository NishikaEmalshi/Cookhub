import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupAction } from "../../Redux/Auth/Action";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import spiceupImage from '../../assets/logo.png';
import leftImage from '../../assets/bg3.jpg';

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Required"),
});

const Signup = () => {
  const initialValues = { email: "", username: "", password: "", name: "" };
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (values, actions) => {
    dispatch(signupAction(values));
    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (auth.signup?.username) {
      navigate("/login");
      toast({
        title: "Account created successfully",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    } else if (auth.signup?.error) {
      toast({
        title: "Signup failed",
        description: auth.signup.message,
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    }
  }, [auth.signup, navigate, toast]);

  return (
    <Box display="flex" height="80vh" width="60vw" overflow="hidden">
      
      {/* Left Image Section */}
      <Box width="40%" display={{ base: "none", md: "block" }}>
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
          <p className="font-bold opacity-50 text-lg mb-6 text-center">
            Experience the delightful world of cooking with SpiceUp.
          </p>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formikProps) => (
              <Form className="w-full">
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb={4}
                    >
                      <Input
                        {...field}
                        id="email"
                        placeholder="Please Enter Your Email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="username">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.username && form.touched.username}
                      mb={4}
                    >
                      <Input
                        {...field}
                        id="username"
                        placeholder="Please Enter Your Username"
                      />
                      <FormErrorMessage>
                        {form.errors.username}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                      mb={4}
                    >
                      <Input
                        {...field}
                        id="name"
                        placeholder="Please Enter Full Name"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
                        placeholder="Please Enter Your Password"
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <p className="mt-4 text-center text-sm">
                  By signing up, you agree to our{" "}
                  <span className="underline">Terms</span>,{" "}
                  <span className="underline">Privacy Policy</span> and{" "}
                  <span className="underline">Cookies Policy</span>.
                </p>

                <Button
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                  width="100%"
                >
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>

          <Box mt={6} textAlign="center">
            <p>
              If You Already Have an Account
              <span
                onClick={() => navigate("/login")}
                className="ml-2 text-blue-700 cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
