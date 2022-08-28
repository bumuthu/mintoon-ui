import { Box, Checkbox, CircularProgress, useTheme } from "@mui/material";
import Input from "components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import CustomButton from "components/custom-submit-button";
import Link from "next/link";
import { signIn } from "routes";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import auth from "api/modules/auth";
import TermsAndConditionsDialog from "components/terms-and-conditions-dialog";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
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
      if(checked) {
        try {
          setLoading(true);
          const [msg] = await auth.register({
            name: values.name,
            email: values.email,
            password: values.password,
            type: "EMAIL",
          });
          if (msg.status !== 200) toast.error(msg.message);
          else
            router.push({
              pathname: "/auth/verify-email",
              query: { email: values.email },
            });
        } catch (e: any) {
          toast.error(e.err.message);
        } finally {
          setLoading(false);
        }
      }
      else toast.error('You should agree to the terms & condition.')
    },
  });
  const theme = useTheme();
  return (
    <>
      <Input
        name="name"
        id="name"
        formik={formik}
        placeholder="Name"
        type="text"
      />
      <Input
        name="email"
        id="email"
        formik={formik}
        placeholder="Email"
        type="email"
      />
      <Input
        name="password"
        id="password"
        formik={formik}
        placeholder="Password"
        type="password"
      />
      <Input
        name="confirmPassword"
        id="confirmPassword"
        formik={formik}
        placeholder="Confirm Password"
        type="password"
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Checkbox
          checked={checked}
          onClick={() => setChecked(prevState => !prevState)}
          sx={{
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <span
          style={{
            color: theme.palette.secondary.main,
          }}
        >
          I agree the
        </span>
        <span
          style={{
            color: theme.palette.secondary.main,
            fontWeight: 600,
            marginLeft: 4,
            cursor: 'pointer'
          }}
          onClick={handleClickOpen}
        >
          Terms & Conditions
        </span>
        <TermsAndConditionsDialog 
          open={open} 
          handleClickOpen={handleClickOpen} 
          handleClose={handleClose} 
        />
      </Box>
      <CustomButton
        loading={loading}
        onClick={() => {
          formik.submitForm();
        }}
        fullWidth
      >
        Sign Up
      </CustomButton>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "32px",
        }}
      >
        <span
          style={{
            color: theme.palette.secondary.light,
          }}
        >
          Already have an account?
        </span>
        <Link href={signIn} passHref>
          <span
            style={{
              color: theme.palette.secondary.main,
              fontWeight: 600,
              marginLeft: 4,
              cursor: "pointer",
            }}
          >
            Sign in
          </span>
        </Link>
      </Box>
    </>
  );
};

export default SignUpForm;
