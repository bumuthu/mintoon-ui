import React from "react";
import AuthTemplate from "components/templates/auth-template";
import ForgotPasswordForm from "components/forms/forgot-password-form";

const ForgotPassword = () => {
  return (
    <AuthTemplate title="Forgot Password">
      <ForgotPasswordForm />
    </AuthTemplate>
  );
};

export default ForgotPassword;
