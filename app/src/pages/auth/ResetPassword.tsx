import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonForm from "@/components/common/Form";
import { resetPasswordControls } from "@/config";
import { ResetPasswordData } from "@/models/auth";
import { resetPassword } from "@/services/auth/authService";
import { AxiosResponse } from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-helper";
import {
  clearMessages,
  setErrorMsg,
  setLoading,
  setSuccessMsg,
} from "@/store/auth";
import SpinningLoader from "@/components/ui/loader";

const initialState: ResetPasswordData = {
  password: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState<ResetPasswordData>(initialState);
  const navigate = useNavigate();

  const { isLoading, errorMsg, successMsg } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const { resetToken } = useParams();
  console.log(typeof resetToken);

  // Update the onSubmit to use the correct event type
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const resp = await resetPassword(formData, resetToken);

      // Check if the response is an AxiosResponse
      if (resp && (resp as AxiosResponse).status === 400) {
        dispatch(setLoading(false));
        // console.log("Error:", resp);
        const errorMessage =
          (resp as AxiosResponse).data.msg || "An unexpected error occurred.";
        dispatch(setErrorMsg(errorMessage));
      } else if (resp && (resp as AxiosResponse).status === 200) {
        dispatch(setLoading(false));
        setFormData(initialState);
        dispatch(setSuccessMsg("Password Updated Successfully!"));

        // Clear success message and navigate after 2 seconds
        setTimeout(() => {
          dispatch(clearMessages()); // Clear success message
          navigate("/auth/login");
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
          Reset Your Password!
        </h1>
        <p className="mt-2">Enter your new password.</p>
      </div>
      <CommonForm
        formControls={resetPasswordControls}
        buttonText={"Reset Password"}
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

export default ResetPassword;
