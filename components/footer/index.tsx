import {
  Facebook,
  Instagram,
  YouTube,
  Twitter,
} from "@mui/icons-material";
import { Box } from "@mui/material";

const Footer = () => {
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <>
      {/* <Box
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
      </Box> */}
      <Box marginTop="24px">
        <YouTube style={{ color: "#344767", margin: "0 12px" }} onClick={() => openInNewTab('https://www.youtube.com/channel/UCB37PkMF22kvKS0T5aKancQ')} />
        <Facebook style={{ color: "#344767", margin: "0 12px" }} onClick={() => openInNewTab('https://www.facebook.com/mintoon.io')} />
        <Instagram style={{ color: "#344767", margin: "0 12px" }} onClick={() => openInNewTab('https://www.instagram.com/mintoon_io')} />
        <Twitter style={{ color: "#344767", margin: "0 12px" }} onClick={() => openInNewTab('https://twitter.com/mintoon_io')} />
      </Box>
      <Box color="#344767" fontWeight="400" marginTop="24px">
        Copyright © 2022 by Mintoon
      </Box>
    </>
  );
};

export default Footer;
