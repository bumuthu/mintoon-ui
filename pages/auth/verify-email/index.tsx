import React from "react";
import EmailValidationForm from "components/forms/email-validation-form";
import AuthTemplate from "components/templates/auth-template";

const VerifyEmail = () => {
  return (
    <AuthTemplate title="Email Verification">
      <EmailValidationForm />
    </AuthTemplate>
  );
};

export default VerifyEmail;
