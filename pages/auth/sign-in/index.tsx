import { Box, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import SignInForm from "components/forms/sign-in-form";
import Footer from "components/footer";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter()
  const isSignIn = useSelector((state: RootState) => state.user.isSignIn)
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if(isSignIn) router.push('/');
    const hideContent = () => setAuthorized(false)
    const authCheck = () => {
      if(isSignIn) router.push('/');
      else setAuthorized(true);
    }
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);
    
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    authorized ? <Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        width="50vw"
        height="80vh"
        style={{
          borderRadius: "0 0 0 16px",
          backgroundImage: "url('/curved-6.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%, 0 98%)",
        }}
      />
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "16px",
          left: 0,
        }}
      ></Box>
      <Grid container width="100%" minHeight="80vh" padding="0 10%">
        <SignInForm />
      </Grid>
      <Box
        width="100%"
        minHeight="20vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Footer />
      </Box>
    </Box> : null
  );
};

export default SignIn;
