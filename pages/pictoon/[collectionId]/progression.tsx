import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import AppBar from "components/page-components/layer-config/appbar";
import Image from "next/image";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Slider from "components/page-components/project-config/slider";
import { MainColumnsDataType } from "types";
import { useSelector } from "react-redux";
import { RootState } from "store";
import {
  startCreating,
  downloadAllZips,
  getMaxCombinations,
} from "@mintoven/art-engine";
import { useRouter } from "next/router";
import app from "api/modules/app";
import CustomOutlinedButton from "components/custom-outlined-button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "store/slices/user-slice";
import OutlinedLoadingButton from "components/outlined-loading-button";

const Progression = () => {
  const [progress, setProgress] = useState({
    done: 0,
    timeLeft: 0,
    zipping: false,
    pausing: false
  });
  const [percentage, setPercentage] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const [zipping, setZipping] = useState(false);
  const [allImages, setAllImages] = useState(0);
  const [started, setStarted] = useState(false);
  const [completedImages, setCompletedImages] = useState(0);
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);
  const [yesButtonLoading, setYesButtonLoading] = useState(false);
  const isMounted = useRef(false);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const otherData: MainColumnsDataType = useSelector(
    (state: RootState) => state.configuration.otherData
  );
  const configuration = useSelector(
    (state: RootState) => state.configuration.configData
  );
  const userData = useSelector((state: RootState) => state.user.user);
  const [initialData, setInitialData] =
    useState<MainColumnsDataType>(otherData);
  useEffect(() => {
    if (configuration.layerConfigurations[0].growEditionSizeTo)
      setAllImages(configuration.layerConfigurations[0].growEditionSizeTo);
  }, [configuration]);
  useEffect(() => {
    const newPercentage =
      (progress.done * 100) /
      parseInt(configuration.layerConfigurations[0].growEditionSizeTo);
    setPercentage(newPercentage ? Math.round(newPercentage) : 0);
    setZipping(progress.zipping);
    const seconds = progress.timeLeft;
    setTimeLeft({
      minutes: Math.floor(seconds / 60),
      seconds: Math.round(seconds % 60),
    });
    setCompletedImages(progress.done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);
  const handleStartButtonPress = () => {
    try {
      console.log("CREATE config object 1:", configuration);
      startCreating(configuration, setProgress, progress, true);
    } catch (e) {
      toast.error("Library error");
    }
  };
  const handleBackButtonPress = () => {
    router.back();
  };
  const handleDownloadButtonPress = async () => {
    try {
      setDeleteButtonLoading(true);
      downloadAllZips();
    } catch (e) {
    } finally {
      setDeleteButtonLoading(false);
    }
  };
  const handleStopCreating = async () => {
    try {
      const result = await app.collectionFail(
        typeof router.query.collectionId === "string"
          ? router.query.collectionId
          : ""
      );
    } catch (e) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    // if (isMounted.current) {
      if (started == false) {
        console.log("Called started!");
        const maxCombinations = getMaxCombinations(
          configuration.layerConfigurations[0].layersOrder
        );
        setStarted(true);
        try {
          startCreating(configuration, setProgress, progress, true).then(
            ({ status, failedReason }) => {
              if (status === "FAILED") toast.error(failedReason);
              else {
                app
                  .collectionSuccess(
                    typeof router.query.collectionId === "string"
                      ? router.query.collectionId
                      : ""
                  )
                  .then(([{ status }, payload]) => {
                    if (status === 200)
                      dispatch(setUser({ ...userData, ...payload.payload }));
                  });
              }
            }
          );
        } catch (e) {
          toast.error("Technical error");
        }
      }
    // } else isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      sx={{
        width: "100vw",
        padding: "0 54px 72px 54px",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <AppBar initialData={initialData} setInitialData={setInitialData} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            padding: "40px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "10px",
          }}
        >
          <Typography color="primary" variant="body1" textAlign="center">
            Do you really want to stop?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                width: 250,
              }}
            >
              <OutlinedLoadingButton
                onClick={async () => {
                  const collectionId =
                    typeof router.query.collectionId === "string"
                      ? router.query.collectionId
                      : "";
                  handleClose();
                  setYesButtonLoading(true);
                  await handleStopCreating();
                  setYesButtonLoading(false);
                  router.push(`/pictoon/${collectionId}/layer-config`);
                }}
                variant="contained"
                buttonText="Yes"
                loadingElement={
                  <CircularProgress
                    sx={{ color: theme.palette.background.default }}
                    size={16}
                  />
                }
                style={{
                  backgroundColor: theme.palette.error.main,
                }}
                containerStyle={{ width: 100 }}
              />
              <OutlinedLoadingButton
                onClick={handleClose}
                variant="outlined"
                buttonText="No"
                style={{
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.main,
                }}
                containerStyle={{ width: 100 }}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          borderRadius: `${theme.shape.borderRadius}px`,
          width: "100%",
          height: "calc(100vh - 176px)",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
          }}
        >
          <Typography variant="h4" textAlign="center">
            Untitled Project
          </Typography>
          <Box
            sx={{
              height: 200,
              width: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "48px",
            }}
          >
            <Slider />
          </Box>
          <Box sx={{ width: "100%" }}>
            {percentage !== 0 ? (
              percentage === 100 && !zipping ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "48px",
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Zipping...
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "48px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {percentage}%
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ marginLeft: "2px" }}
                    >
                      ({completedImages}/{allImages}) completed
                    </Typography>
                  </Box>
                  {percentage === 100 ? (
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      sx={{ width: 360, textAlign: "right" }}
                    >
                      0 seconds left
                    </Typography>
                  ) : (
                    <Typography
                      fontWeight="bold"
                      variant="subtitle2"
                      sx={{ width: 360, textAlign: "right" }}
                    >
                      About{" "}
                      {`${timeLeft.minutes
                        ? timeLeft.minutes === 1
                          ? `${timeLeft.minutes} minute and `
                          : `${timeLeft.minutes} minutes and `
                        : ""
                        }`}{" "}
                      {`${timeLeft.seconds
                        ? timeLeft.seconds === 1
                          ? `${timeLeft.seconds} second `
                          : `${timeLeft.seconds} seconds `
                        : ""
                        }`}{" "}
                      left
                    </Typography>
                  )}
                </Box>
              )
            ) : null}

            <LinearProgress
              sx={{
                height: 10,
                borderRadius: 5,
                marginTop: "8px",
                [`&.${linearProgressClasses.colorPrimary}`]: {
                  backgroundColor: `${theme.palette.text.secondary}54`,
                },
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              value={percentage}
              variant={
                percentage === 100 && !zipping ? "indeterminate" : "determinate"
              }
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              {percentage !== 100 ? (
                percentage === 0 ? (
                  <Typography variant="caption" textAlign="center">
                    We are going to generate the files. Please keep the browser
                    and tab alive <br></br>after clicking start button untill
                    the process is completed.
                  </Typography>
                ) : (
                  <Typography variant="caption" textAlign="center">
                    We are generating the files. Please keep the browser and tab
                    alive <br></br>untill the process is completed.
                  </Typography>
                )
              ) : (
                <Typography variant="caption" textAlign="center">
                  We are done with generation! Please download the zip file and see the images
                  and metadatas.
                </Typography>
              )}
            </Box>
          </Box>
          {percentage === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "48px",
              }}
            >
              <Button
                variant="contained"
                color="info"
                sx={{
                  "&.MuiButton-contained": {
                    width: 150,
                  },
                }}
                onClick={handleStartButtonPress}
              >
                start
              </Button>
              <Button
                variant="outlined"
                color="info"
                sx={{
                  marginTop: "12px",
                  "&.MuiButton-outlined": {
                    borderWidth: "2px",
                    width: 150,
                  },
                }}
                onClick={handleBackButtonPress}
              >
                back
              </Button>
            </Box>
          ) : percentage === 100 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "48px",
              }}
            >
              <CustomOutlinedButton
                loading={deleteButtonLoading}
                onlySx={{
                  "&.MuiButton-contained": {
                    width: 284,
                    height: 36.5,
                    fontSize: 14,
                    borderRadius: "5px",
                    color: theme.palette.primary.contrastText,
                  },
                }}
                variant="contained"
                onClick={handleDownloadButtonPress}
                buttonText="Redownload"
              />
              <OutlinedLoadingButton
                buttonText="Back To Project"
                style={{
                  marginTop: "12px",
                  "&.MuiButton-outlined": {
                    borderWidth: "2px",
                    width: 284,
                    height: 35,
                  },
                }}
                onClick={() =>
                  router.push(
                    `/pictoon/${router.query.collectionId || ""}/layer-config`
                  )
                }
              />
            </Box>
          ) : (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpen}
              sx={{
                marginTop: "48px",
                "&.MuiButton-outlined": {
                  borderWidth: "2px",
                  width: 284,
                },
              }}
            >
              stop
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Progression;
