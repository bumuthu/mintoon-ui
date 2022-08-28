import { Box, Paper } from "@mui/material";
import Footer from "components/footer";
import SignUpForm from "components/forms/sign-up-form";
import AuthTemplate from "components/templates/auth-template";
import React from "react";

const SignUp = () => {
  return (
    <AuthTemplate title="Sign Up">
      <SignUpForm />
    </AuthTemplate>
  );
};

export default SignUp;
