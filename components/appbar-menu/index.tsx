import {
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { Logout } from "@mui/icons-material";
import { additionalColors } from "theme";
import auth from "api/modules/auth";
import { setIsSignIn, setTokens } from "store/slices/user-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";

const AppBarMenu = ({
  anchorEl,
  open,
  handleClose,
}: {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt:
            router.pathname === "/" || router.pathname === "/home" ? 3.5 : 1.5,
          "&.MuiPaper-root": {
            top: "28px !important",
            transform: "translateX(-52px) !important",
            width: "200px",
          },
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 20,
            right: -5,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(135deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
        >
          {user && user.name ? user.name : ""}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {user && user.email ? user.email : ""}
        </Typography>
      </Box>
      <Link href="/" passHref>
        <MenuItem>
          <HomeIcon
            sx={{
              color: additionalColors.menuIconColor,
              marginRight: "8px",
            }}
          />{" "}
          <Typography
            variant="subtitle2"
            sx={{ color: additionalColors.menuItemTextColor }}
          >
            Home
          </Typography>
        </MenuItem>
      </Link>
      <Link href="/account" passHref>
        <MenuItem>
          <AccountCircleIcon
            sx={{
              color: additionalColors.menuIconColor,
              marginRight: "8px",
            }}
          />{" "}
          <Typography
            variant="subtitle2"
            sx={{ color: additionalColors.menuItemTextColor }}
          >
            My Account
          </Typography>
        </MenuItem>
      </Link>
      <Divider />
      <MenuItem
        onClick={async () => {
          try {
            await auth.logout();
            dispatch(setTokens({}));
          } catch (e) {
          } finally {
            dispatch(setIsSignIn(false));
            router.push("/auth/sign-in");
          }
        }}
      >
        <Logout
          sx={{
            color: additionalColors.menuIconColor,
            marginRight: "8px",
          }}
        />{" "}
        <Typography
          variant="subtitle2"
          sx={{ color: additionalColors.menuItemTextColor }}
        >
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default AppBarMenu;
