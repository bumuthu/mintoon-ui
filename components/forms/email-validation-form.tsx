import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomButton from "components/custom-submit-button";
import Input from "components/input";
import CustomOutlinedButton from "components/custom-outlined-button";
import { useRouter } from "next/router";
import auth from "api/modules/auth";
import { toast } from "react-toastify";

const EmailValidationForm = () => {
  const router = useRouter();
  const { email } = router.query;
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: Yup.object({
      code: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setVerifyLoading(true);
        if (typeof email === "string") {
          const result = await auth.verifyEmail(email, values.code);
          if (result && result.response === "SUCCESS")
            router.push({ pathname: "/auth/sign-in", query: { email: email } });
          else toast.error(result.error);
        }
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setVerifyLoading(false);
      }
    },
  });
  const resendCodeHandler = async (email: string) => {
    try {
      setResendLoading(true);
      const result = await auth.verifyEmailResend(email);
      if (result) {
        toast.success("We have sent you another verification code.");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setResendLoading(false);
    }
  };
  return (
    <>
      <Input
        name="code"
        id="code"
        formik={formik}
        placeholder="code"
        type="text"
      />
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
          {"We've sent you an one-time password to"}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{
            textAlign: "center",
            color: theme.palette.secondary.main,
            fontWeight: "500",
          }}
        >
          {email}
        </Typography>
      </Box>
      <CustomButton
        loading={verifyLoading}
        onClick={() => {
          formik.submitForm();
        }}
        fullWidth
      >
        Verify
      </CustomButton>
      <CustomOutlinedButton
        buttonText="Resend"
        loading={resendLoading}
        onClick={() =>
          resendCodeHandler(typeof email === "string" ? email : "")
        }
      />
    </>
  );
};

export default EmailValidationForm;
