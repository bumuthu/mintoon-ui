import React, { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomButton from "components/custom-submit-button";
import Input from "components/input";
import CustomOutlinedButton from "components/custom-outlined-button";
import { useRouter } from "next/router";
import auth from "api/modules/auth";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await auth.forgotPassword(values.email);
        setShowCodeInput(true);
        formikNewPassword.resetForm();
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    },
  });
  const formikNewPassword = useFormik({
    initialValues: { code: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      code: Yup.string().required("Required"),
      password: Yup.string()
        .required("Required")
        .matches(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        ),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await auth.confirmPassword(values.code, values.password);
        router.push({
          pathname: "/auth/sign-in",
          query: { email: formik.values.email },
        });
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <>
      {!showCodeInput && (
        <Input
          name="email"
          id="email"
          formik={formik}
          placeholder="Email"
          type="email"
        />
      )}
      {showCodeInput && (
        <>
          <Input
            name="code"
            id="code"
            formik={formikNewPassword}
            placeholder="Verification Code"
            type="text"
          />
          <Input
            name="password"
            id="password"
            formik={formikNewPassword}
            placeholder="Password"
            type="password"
          />
          <Input
            name="confirmPassword"
            id="confirmPassword"
            formik={formikNewPassword}
            placeholder="Confirm Password"
            type="password"
          />
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: "center",
            color: `${theme.palette.secondary.main}A6`,
          }}
        >
          {"We will sent you an one-time password to your email password"}
        </Typography>
      </Box>
      <CustomButton
        loading={loading}
        onClick={() => {
          if (!showCodeInput) formik.submitForm();
          else formikNewPassword.submitForm();
        }}
        fullWidth
      >
        {!showCodeInput ? "Send Code" : "Submit"}
      </CustomButton>
      <CustomOutlinedButton
        onClick={() => {
          !showCodeInput ? router.back() : setShowCodeInput(false);
        }}
        buttonText="Back"
      />
    </>
  );
};

export default ForgotPasswordForm;
