// ${BASE_URL}


import { BASE_URL } from "../../Config/api";
import { SIGN_IN, SIGN_UP } from "./ActionType";

export const signinAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(data.email + ":" + data.password),
      },
    });
    const token = res.headers.get("Authorization");

    localStorage.setItem("token", token);
    console.log("token from header :- ", token);
    dispatch({type:SIGN_IN,payload:token})
  } catch (error) {
    console.log("catch error ", error);
  }
};

export const signupAction = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      // Check if it's a duplicate email error
      if (responseData.message && responseData.message.includes("email")) {
        throw new Error("This email is already registered. Please use a different email.");
      }
      throw new Error(responseData.message || "Signup failed. Please try again.");
    }

    dispatch({ type: SIGN_UP, payload: responseData });
  } catch (error) {
    console.log("catch error ", error);
    dispatch({ 
      type: SIGN_UP, 
      payload: { 
        error: true, 
        message: error.message || "An error occurred during signup. Please try again." 
      } 
    });
  }
};
