import React, { useState } from "react";
import CommonForm from "@/components/common/Form";
import { resetPasswordRequestControls } from "@/config";
import { ResetPasswordRequestData } from "@/models/auth";
import { resetPasswordRequest } from "@/services/auth/authService";
import { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import {
  setErrorMsg,
  setSuccessMsg,
  clearMessages,
  setLoading,
} from "@/store/auth";
import SpinningLoader from "@/components/ui/loader";

const initialState: ResetPasswordRequestData = {
  email: "",
};

const ResetPasswordRequest = () => {
  const [formData, setFormData] =
    useState<ResetPasswordRequestData>(initialState);

  const { isLoading, errorMsg, successMsg } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  // Update the onSubmit to use the correct event type
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const resp = await resetPasswordRequest(formData);

      // Check if the response is an AxiosResponse
      if (resp && (resp as AxiosResponse).status === 400) {
        dispatch(setLoading(false));

        const errorMessage =
          (resp as AxiosResponse).data.msg || "An unexpected error occurred.";

        dispatch(setErrorMsg(errorMessage));
      } else if (resp && (resp as AxiosResponse).status === 200) {
        dispatch(setLoading(false));

        setFormData(initialState);

        dispatch(
          setSuccessMsg(
            "Link to reset your password has been sent to your email"
          )
        );

        // Clear success message and navigate after 2 seconds
        setTimeout(() => {
          dispatch(clearMessages());
        }, 1000); // Wait for 1 seconds before navigating
      }
    } catch (error) {
      dispatch(setLoading(false));
      // Handle generic JavaScript errors
      if (error instanceof Error) {
        dispatch(setErrorMsg(error.message));
      }
    }

    // Clear the error message after 2 seconds
    setTimeout(() => {
      dispatch(clearMessages());
    }, 1500); // Wait for 2 seconds before clearing the error message
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot Your Password?
        </h1>
        <p className="mt-2">No worries we will send you reset instructions.</p>
      </div>
      <CommonForm
        formControls={resetPasswordRequestControls}
        buttonText={"Get Reset Password Request"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit} // Pass the updated onSubmit
      />
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

export default ResetPasswordRequest;
