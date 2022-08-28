import React, { Dispatch, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Tooltip,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";
import Input from "components/input";
import { setConfigData, setOtherData } from "store/slices/config-slice";
import { useDispatch, useSelector } from "react-redux";
import { MainColumnsDataType } from "types";
import { RootState } from "store";
import CustomOutlinedButton from "components/custom-outlined-button";
import { handleSave } from "utils";
import { useRouter } from "next/router";
import AppBarMenu from "components/appbar-menu";
import app from "api/modules/app";
import OutlinedLoadingButton from "components/outlined-loading-button";
import ConfirmationModal from "components/confirmation-modal";

type Props = {
  initialData: MainColumnsDataType;
  initialLoading?: boolean;
  setInitialData: Dispatch<React.SetStateAction<MainColumnsDataType>>;
  projectId?: string;
  preview?: boolean;
};

const AppBar = (props: Props) => {
  const { initialData, setInitialData, projectId, initialLoading, preview } =
    props;
  const [showInput, setShowInput] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [newButtonLoading, setNewButtonLoading] = useState(false);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
  const [openModal, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const otherData = useSelector(
    (state: RootState) => state.configuration.otherData
  );

  const configurationObj = useSelector(
    (state: RootState) => state.configuration.configData
  );
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

  useEffect(() => {
    document.addEventListener("click", (e: any) => {
      if (e.target.id !== "projectName") {
        setShowInput(false);
      }
    });
    return () => {
      document.removeEventListener("click", (e: any) => {
        if (e.target.id !== "projectName") {
          setShowInput(false);
        }
      });
    };
  }, []);
  useEffect(() => {
    setInitialData(otherData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherData]);
  const handleChange = (e: any) => {
    const newData = {
      ...initialData,
      projectName: e.target.value,
    };
    setInitialData(newData);
  };
  const handleBlur = (e: any) => {
    let newData = { ...initialData };
    newData = {
      ...initialData,
      projectName: e.target.value,
    };
    setInitialData(newData);
    dispatch(setOtherData(newData));
    dispatch(
      setConfigData({ ...configurationObj, namePrefix: e.target.value })
    );
  };
  const handleDoubleClickOnProjectName = (e: any) => {
    if (!router.pathname.includes("/progression") && e.detail === 2) {
      setShowInput(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        paddingY: "36px",
        display: "flex",
        justifyContent: "space-between",
        alignItem: "center",
      }}
    >
      <ConfirmationModal open={openModal} handleClose={handleCloseModal} layerOrProject="project" handleYes={async () => {
                setDeleteButtonLoading(true);
                try {
                  await app.deleteCollection(initialData.projectId);
                  router.push(`/pictoon/my-collections`);
                } catch (e) {
                } finally {
                  setDeleteButtonLoading(false);
                  handleCloseModal()
                }
              }} loading={deleteButtonLoading} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeIcon
          sx={{
            color: theme.palette.secondary.light,
            marginRight: "16px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/home")}
        />
        {showInput ? (
          <Input
            value={initialData.projectName}
            type={"text"}
            name={"projectName"}
            id={"projectName"}
            placeholder={""}
            labelStyle={{
              color: `${theme.palette.secondary.main}B3`,
              fontSize: 12,
            }}
            containerStyle={{ minHeight: 28, marginBottom: 0 }}
            inputStyle={{ paddingY: 0, fontSize: 20 }}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <Box onClick={handleDoubleClickOnProjectName}>
            <Typography variant="h6" id="projectName">
              {!initialLoading ? (
                initialData.projectName
              ) : (
                <Skeleton variant="text" sx={{ width: 150 }} />
              )}
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {!router.pathname.includes("/progression") && !preview && (
          <>
            <OutlinedLoadingButton
              variant="contained"
              onClick={async () => {
                setNewButtonLoading(true);
                try {
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
                  router.push(`/pictoon/${payload._id}/layer-config`);
                } catch (e) {
                } finally {
                  setNewButtonLoading(false);
                }
              }}
              skeletonLoading={initialLoading}
              disabled={initialLoading}
              buttonText="New"
              loading={newButtonLoading}
              style={{
                fontWeight: "bold",
                fontSize: 10,
                minWidth: 80
              }}
              loadingElement={
                <CircularProgress
                  sx={{ color: theme.palette.primary.contrastText }}
                  size={16}
                />
              }
            />
            <CustomOutlinedButton
              loading={saveButtonLoading}
              onlySx={{
                "&.MuiButton-outlined": {
                  height: 26,
                  fontSize: 10,
                  fontWeight: "bold",
                  borderRadius: "5px",
                  minWidth: 80
                },
                marginLeft: "12px",
              }}
              onClick={async () => {
                setSaveButtonLoading(true);
                await handleSave(initialData, configurationObj, dispatch);
                setSaveButtonLoading(false);
              }}
              buttonText="Save"
              disabled={initialLoading}
              skeletonLoading={initialLoading}
            />
            <OutlinedLoadingButton
              onClick={handleOpen}
              buttonText="Delete"
              style={{
                height: 26,
                fontSize: 10,
                borderRadius: "5px",
                borderWidth: "1px",
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                marginLeft: "12px",
                padding: "5px 15px",
                minWidth: 80,
                marginRight: 43
              }}
              loading={deleteButtonLoading}
              skeletonLoading={initialLoading}
              disabled={initialLoading}
              loadingElement={
                <CircularProgress
                  sx={{ color: theme.palette.error.main }}
                  size={16}
                />
              }
            />
          </>
        )}

        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
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
        <AppBarMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
      </Box>
    </Box>
  );
};

export default AppBar;
