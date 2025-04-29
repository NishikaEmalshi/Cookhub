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
    console.log("signup", values);
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
    }
  }, [auth.signup]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
  className="rounded-lg shadow-lg max-w-md w-full p-6"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(5px)", 
  }}
>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img
            className="mb-4"
            src="https://www.pekarskiglasnik.com/images/slike/cook%20hub%20kuhinja/CookHub-logo.JPG"
            alt="CookHub Logo"
          />
          <p className="font-bold opacity-50 text-lg mb-6 text-center">
            Experience the delightful experience of cooking with CookHub.
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
                        placeholder="Please enter Your Password"
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
                  className="w-full"
                  mt={4}
                  colorScheme="blue"
                  type="submit"
                  isLoading={formikProps.isSubmitting}
                >
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        <div className="w-full mt-5">
          <p className="text-center py-2 text-sm">
            If You Have Already Account{" "}
            <span
              onClick={() => navigate("/login")}
              className="ml-2 text-blue-700 cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
