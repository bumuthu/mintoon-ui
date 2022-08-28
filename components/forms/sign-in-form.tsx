import { Grid, Box, useTheme } from "@mui/material";
import Input from "components/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import CustomButton from "components/custom-submit-button";
import Link from "next/link";
import { forgotPassword, signUp } from "routes";
import auth from "api/modules/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { setTokens, setIsSignIn } from "store/slices/user-slice";
import { useDispatch } from "react-redux";
import { AuthType } from "@mintoven/common";

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const query = router.query;
  const formik = useFormik({
    initialValues: {
      email: query.email && typeof query.email === "string" ? query.email : "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await auth.login(values.email, values.password);
        router.push("/home");
        dispatch(setTokens(result));
        dispatch(setIsSignIn(true));
      } catch (e: any) {
        toast.error(e.err.message);
      } finally {
        setLoading(false);
      }
    },
  });
  const theme = useTheme();
  return (
    <Grid
      item
      xs={12}
      md={6}
      lg={4}
      marginLeft="64px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <h1
        style={{
          fontWeight: "bold",
          display: "inline-block",
          background: `-webkit-linear-gradient(310deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome to Mintoon!
      </h1>
      <Box color={theme.palette.secondary.main} fontWeight={400}>
        Enter your email and password to sign in
      </Box>
      <Box marginTop="42px">
        <Input
          formik={formik}
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
          containerStyle={{
            height: 80,
          }}
        />
        <Input
          formik={formik}
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          containerStyle={{
            height: 60,
          }}
        />
        {/* <Box display="flex" alignItems="center">
          <IOSSwitch defaultChecked />
          <span
            style={{
              color: theme.palette.secondary.main,
            }}
          >
            Remember me
          </span>
        </Box> */}
        <Link href={forgotPassword} passHref>
          <span
            style={{
              color: theme.palette.primary.main,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Forgot password
          </span>
        </Link>
        <CustomButton
          loading={loading}
          onClick={() => {
            formik.submitForm();
          }}
        >
          Sign In
        </CustomButton>
        <Box
          marginTop="32px"
          color={theme.palette.secondary.main}
          display="flex"
          justifyContent="center"
        >
          {"Don't have an account?"}{" "}
          <Link href={signUp} passHref={true}>
            <span
              style={{
                fontWeight: "bold",
                display: "inline-block",
                background: `-webkit-linear-gradient(310deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginLeft: "4px",
                cursor: "pointer",
              }}
            >
              Sign up
            </span>
          </Link>
        </Box>
      </Box>
    </Grid>
  );
};

export default SignInForm;
