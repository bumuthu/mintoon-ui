import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  Twitter,
} from "@mui/icons-material";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="40%"
      >
        <Box color="#344767" fontWeight="400">
          Company
        </Box>
        <Box color="#344767" fontWeight="400">
          About us
        </Box>
        <Box color="#344767" fontWeight="400">
          Team
        </Box>
        <Box color="#344767" fontWeight="400">
          Product
        </Box>
        <Box color="#344767" fontWeight="400">
          Blog
        </Box>
        <Box color="#344767" fontWeight="400">
          Pricing
        </Box>
      </Box>
      <Box marginTop="24px">
        <Facebook style={{ color: "#344767", margin: "0 12px" }} />
        <Twitter style={{ color: "#344767", margin: "0 12px" }} />
        <Instagram style={{ color: "#344767", margin: "0 12px" }} />
        <Pinterest style={{ color: "#344767", margin: "0 12px" }} />
        <LinkedIn style={{ color: "#344767", margin: "0 12px" }} />
      </Box>
      <Box color="#344767" fontWeight="400" marginTop="24px">
        Copyright © 2022 by Mintoon
      </Box>
    </>
  );
};

export default Footer;
