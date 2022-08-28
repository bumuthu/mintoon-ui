import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import HomeIcon from "@mui/icons-material/Home";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useRouter } from "next/router";
import React, { Children, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import app from "api/modules/app";
import AppBarMenu from "components/appbar-menu";
import PuffLoader from "react-spinners/PuffLoader";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { youtubeChannelUrl } from "../routes";

type Props = {
  children: ReactNode;
  loading?: boolean;
};

const ChildrenWithPageLoading = ({
  children,
  pageLoading,
}: {
  children: ReactNode;
  pageLoading?: boolean;
}) => {
  const theme = useTheme();
  const router = useRouter()
  const isSignIn = useSelector((state: RootState) => state.user.isSignIn)
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    if (isSignIn) setAuthorized(true);
    const hideContent = () => setAuthorized(false)
    const authCheck = () => { if (isSignIn) setAuthorized(true); }
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.on('routeChangeComplete', authCheck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignIn])
  return pageLoading ? (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PuffLoader color={theme.palette.primary.main} />
    </Box>
  ) : (
    <>{authorized && children}</>
  );
};

const GeneralTemplate = (props: Props) => {
  const { children, loading } = props;
  const theme = useTheme();
  const router = useRouter();
  const [newCollectionPageLoading, setNewCollectionPageLoading] =
    useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const maxWidth1200 = useMediaQuery("(max-width:1200px)");
  const drawerItems = [
    { label: "Home", icon: <HomeIcon />, path: ["/", "/home"] },
    {
      label: "New Collection",
      icon: <CollectionsBookmarkIcon />,
      path: [""],
    },
    {
      label: "My Collections",
      icon: <LibraryAddCheckIcon />,
      path: ["/pictoon/my-collections"],
    },
    {
      label: "My Account", icon: <CreditCardIcon />,
      path: ["/account", "/account/payment"]
    },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    document
      .getElementsByTagName("html")[0]
      .setAttribute(
        "style",
        `background-color: ${theme.palette.background.paper}`
      );
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleOnClickWatch = () => {
    window.open(youtubeChannelUrl, '_blank', 'noopener,noreferrer');
  }
  const Drawer = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "56px",
          }}
        >
          <img src="/logo.png" alt="logo-svg" style={{ width: "150px" }} />
        </Box>
        {drawerItems.map((item, index) =>
          item.path.includes(router.pathname) ? (
            <Paper
              key={index}
              sx={{
                padding: "8px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.background.default,
                cursor: "pointer",
                boxShadow: `0px 0px 20px 0 #0000001A`,
              }}
            >
              {item.icon}
              <Typography
                sx={{
                  paddingLeft: "16px",
                  fontWeight: theme.typography.fontWeightLight,
                  fontSize: 12,
                }}
                variant="subtitle2"
              >
                {item.label}
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                padding: "8px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.background.default,
                cursor: "pointer",
              }}
              key={index}
              onClick={async () => {
                if (item.label === "New Collection") {
                  try {
                    setNewCollectionPageLoading(true);
                    const [, { payload }]: any = await app.createNewProject();
                    const newCollectionData = {
                      columns: {
                        "column-1": {
                          id: "column-1",
                          title: "Background",
                          percentage: "100",
                          numberOfLayers: "0",
                          images: {},
                          size: "512*512",
                        },
                      },
                      columnOrder: ["column-1"],
                      projectName: "Untitled Project",
                      projectId: payload._id,
                    };
                    dispatch(setOtherData(newCollectionData));
                    await router.push(`/pictoon/${payload._id}/layer-config`);
                    setNewCollectionPageLoading(false);
                  } catch (e) { }
                } else router.push(item.path[0]);
              }}
            >
              {item.icon}
              <Typography
                sx={{
                  paddingLeft: "20px",
                  fontWeight: theme.typography.fontWeightLight,
                  fontSize: 12
                }}
                variant="subtitle2"
              >
                {item.label}
              </Typography>
            </Box>
          )
        )}
      </Box>
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to top right, #12BDE2, #3B4BDF)',
          width: '100%',
          minHeight: 92,
          borderRadius: '10px',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Box>
          <Typography sx={{ color: theme.palette.primary.contrastText, fontSize: 10 }}>Need Help?</Typography>
          <Typography variant="caption" sx={{ color: theme.palette.primary.contrastText }} fontWeight="bold">Please check our tutorials.</Typography>
        </Box>
        <Button variant="contained"
          sx={{
            backgroundColor: theme.palette.background.default, width: '80%',
            textTransform: 'none', fontSize: 10, fontWeight: 'bold', color: theme.palette.primary.main,
            '&.MuiButton-root': {
              '&:hover': {
                color: theme.palette.background.default,
              }
            }
          }}
          onClick={handleOnClickWatch}
          >
          Watch
        </Button>
      </Box>
    </Box>
  );
  return (
    <ChildrenWithPageLoading pageLoading={loading || newCollectionPageLoading}>
      <Grid
        container
        sx={{
          padding: "36px",
          backgroundColor: theme.palette.background.paper,
          minHeight: "100vh",
        }}
        gap="36px"
      >
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              width: 300,
              padding: "36px",
              backgroundColor: theme.palette.background.default,
              height: "100vh",
              position: "relative",
            }}
          >
            <IconButton
              sx={{ position: "absolute", top: 16, right: 16 }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>
            <Drawer />
          </Box>
        </Modal>
        {!maxWidth1200 && (
          <Grid
            item
            sx={{
              width: 220,
              height: 'calc(100vh - 72px)',
              position: 'fixed',
              padding: "16px",
              backgroundColor: theme.palette.background.default,
              borderRadius: `${typeof theme.shape.borderRadius === "number"
                ? theme.shape.borderRadius + 10
                : 0
                }px`,
            }}
          >
            <Drawer />
          </Grid>
        )}
        <Grid
          item
          sx={{ width: maxWidth1200 ? "100%" : "calc(100vw - 345px)", marginLeft: maxWidth1200 ? 0 : '256px' }}
        >
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: maxWidth1200 ? "space-between" : "flex-end",
                cursor: "pointer",
                marginBottom: "16px",
                borderRadius: "50%",
              }}
            >
              {maxWidth1200 && (
                <IconButton
                  onClick={handleOpenModal}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    top:
                      router.pathname === "/" || router.pathname === "/home"
                        ? 20
                        : undefined,
                    left:
                      router.pathname === "/" || router.pathname === "/home"
                        ? 20
                        : undefined,
                  }}
                >
                  <MenuIcon
                    sx={{
                      color:
                        router.pathname === "/" || router.pathname === "/home"
                          ? theme.palette.background.default
                          : theme.palette.secondary.light,
                    }}
                  />
                </IconButton>
              )}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{
                    ml: 2,
                    position: "relative",
                    zIndex: 2,
                    top:
                      router.pathname === "/" || router.pathname === "/home"
                        ? 20
                        : undefined,
                    right:
                      router.pathname === "/" || router.pathname === "/home"
                        ? 20
                        : undefined,
                  }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user && user.name ? user.name[0].toUpperCase() : ""}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <AppBarMenu
              anchorEl={anchorEl}
              open={open}
              handleClose={handleClose}
            />
          </Grid>
          {children}
        </Grid>
      </Grid>
    </ChildrenWithPageLoading>
  );
};

export default GeneralTemplate;
