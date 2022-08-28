import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import Footer from "components/footer";
import React from "react";

type Props = {
  children: ReactJSXElement;
  title: string;
};

const AuthTemplate = (props: Props) => {
  const { children, title } = props;
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          padding: "16px",
          width: "100%",
          minHeight: 664,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            height: "50vh",
            minHeight: "432px",
            borderRadius: `${theme.shape.borderRadius}px`,
            backgroundImage: "url('/curved14.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={24}
              style={{
                minWidth: 340,
                width: "22%",
                backgroundColor: "white",
                borderRadius: `${theme.shape.borderRadius}px`,
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
              <Box
                style={{
                  marginTop: 32,
                  width: "100%",
                }}
              >
                {children}
              </Box>
            </Paper>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "320px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthTemplate;
