import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommonForm from "../../components/common/Form";
import SpinningLoader from "../../components/ui/loader";
import { loginFormControls } from "../../config";
import { LoginFormData } from "../../models/auth";
import { loginUser } from "../../services/auth/authService";
import { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-helper";
import {
  clearMessages,
  setErrorMsg,
  setLoading,
  setSuccessMsg,
  setUser,
} from "../../store/auth";

const initialState: LoginFormData = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialState);

  const { isLoading, errorMsg, successMsg } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  // Update the onSubmit to use the correct event type
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const resp = await loginUser(formData);

      // Check if the response is an AxiosResponse
      if (resp && (resp as AxiosResponse).status === 400) {
        dispatch(setLoading(false));

        const errorMessage =
          (resp as AxiosResponse).data.msg || "An unexpected error occurred.";

        dispatch(setErrorMsg(errorMessage));
      } else if (
        resp &&
        (resp as AxiosResponse).status === 200 &&
        "data" in resp
      ) {
        dispatch(setLoading(false));
        dispatch(setUser(resp.data.user));

        setFormData(initialState);
        dispatch(setSuccessMsg("User Logged in Successfully!"));

        // Clear success message and navigate after 2 seconds
        setTimeout(() => {
          dispatch(clearMessages()); // Clear success message
        }, 1000); // Wait for 1 seconds before clearing message
      }
    } catch (error) {
      // Handle generic JavaScript errors
      if (error instanceof Error) {
        dispatch(setErrorMsg(error.message));
      }
    }

    // Clear the error message after 2 seconds
    setTimeout(() => {
      dispatch(clearMessages());
    }, 1500); // Wait for 1.5 seconds before clearing the error message
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to Your Account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit} // Pass the updated onSubmit
      />
      <div className=" text-center">
        <p className="mt-2">
          Don't Remember Credentials?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/reset-password-request"
          >
            Reset Password
          </Link>
        </p>
      </div>
      {isLoading && (
        <div className=" flex justify-center items-center">
          <SpinningLoader />
        </div>
      )}
      {errorMsg && (
        <div className=" text-center">
          <p className=" text-red-600">{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className=" text-center">
          <p className=" text-green-600">{successMsg}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
