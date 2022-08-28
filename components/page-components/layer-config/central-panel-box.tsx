import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { ImageMetadata, ImagesType, MainColumnsDataType } from "types";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";
import CircularProgress from "@mui/material/CircularProgress";
import app from "api/modules/app";

type Props = {
  src: string;
  name: string;
  projectId: string;
  originUri: string;
  percentage: number;
  isSizeChange: boolean;
  isLocked: boolean;
  initialData: MainColumnsDataType;
  selectedLayer: string;
  loading?: boolean;
  loadingSuccess?: "success" | "error" | "cancel";
  setInitialData: Dispatch<SetStateAction<MainColumnsDataType>>;
};

const CentralPanelBox = (props: Props) => {
  const {
    src,
    name,
    percentage,
    isSizeChange,
    isLocked,
    selectedLayer,
    initialData,
    setInitialData,
    projectId,
    originUri,
    loading,
    loadingSuccess,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [state, setState] = useState<"success" | "error" | "cancel">(
    loadingSuccess ? loadingSuccess : "cancel"
  );
  const [oldState, setOldState] = useState<"success" | "error" | "cancel">(
    loadingSuccess ? loadingSuccess : "cancel"
  );
  const minWidth1920 = useMediaQuery("(min-width:1920px)");
  const maxWidth1920 = useMediaQuery("(max-width:1920px)");
  const maxWidth1800 = useMediaQuery("(max-width:1800px)");
  const maxWidth1600 = useMediaQuery("(max-width:1600px)");
  const maxWidth1500 = useMediaQuery("(max-width:1500px)");
  const maxWidth1350 = useMediaQuery("(max-width:1368px)");
  useEffect(() => {
    setState(loadingSuccess ? loadingSuccess : "cancel");
    const timeoutId = setTimeout(() => {
      // setState("cancel");
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [loadingSuccess]);
  const onCloseButtonClick = async (name: string) => {
    try {
      const oldImages = { ...initialData.columns[selectedLayer].images };
      const newImages: ImagesType = {};
      delete oldImages[name];
      const imagesThatCanBeChanged: ImageMetadata[] = Object.values(
        oldImages
      ).filter((item) => !item.lock);
      const imageThatCannotBeChanged: ImageMetadata[] = Object.values(
        oldImages
      ).filter((item) => item.lock);
      const imagesNamesThatCannotBeChanged: string[] =
        imageThatCannotBeChanged.map((item) => item.name);
      let allocatedValue = 0;
      imageThatCannotBeChanged.forEach((item) => {
        allocatedValue += item.rarity;
      });
      const remainingPercentageForEach =
        (100 - allocatedValue) / imagesThatCanBeChanged.length;
      Object.keys(oldImages).forEach((item) => {
        newImages[item] = {
          ...oldImages[item],
          rarity: imagesNamesThatCannotBeChanged.includes(item)
            ? oldImages[item].rarity
            : remainingPercentageForEach,
          lock: Object.keys(oldImages).length === 1,
          onlyOneInTheList: Object.keys(oldImages).length === 1,
        };
      });
      const newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [selectedLayer]: {
            ...initialData.columns[selectedLayer],
            images: newImages,
          },
        },
      };
      setInitialData(newData);
      dispatch(setOtherData(newData));
      const result = await app.removeImage(originUri);
    } catch (e) { }
  };
  return (
    <Grid
      component={motion.div}
      whileHover={{ translateY: -5 }}
      onHoverStart={() => {
        if (state !== "cancel") setOldState(state);
        setState("cancel");
      }}
      onHoverEnd={() => {
        setState(oldState)
      }}
    >
      <Box
        sx={{
          paddingX: "6px",
          paddingBottom: "12px",
          minWidth: 144,
          width: minWidth1920
            ? 144
            : // : maxWidth1350
            // ? "50%"
            maxWidth1500
              ? "33.33%"
              : maxWidth1600
                ? "25%"
                : maxWidth1800
                  ? "20%"
                  : maxWidth1920
                    ? "16.66%"
                    : 144,
        }}
      >
        <Box
          sx={{
            width: "100%",
            // minWidth: 144,
            backgroundColor: theme.palette.background.default,
            borderRadius: `${theme.shape.borderRadius}px`,
            height: 184,
            padding: "8px",
            border: `2px solid ${isSizeChange ? "#FF0000" : theme.palette.secondary.main
              }40`,
            position: "relative",
          }}
        >
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {src ? (
              <Box sx={{
                width: 124,
                height: 124,
                backgroundImage: `url(${src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }} />
            ) : null}
          </Box>
          <Box
            sx={{
              width: 124,
              height: 20,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              sx={{
                color: `${theme.palette.secondary.main}CC`,
              }}
              variant="caption"
            >
              {name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" fontWeight={600}>
              Rarity
            </Typography>
            <Box sx={{ display: "flex", alignItem: "center" }}>
              <Typography variant="caption" fontWeight={600}>
                {percentage ? percentage.toFixed(1) : ""}%
              </Typography>
              {isLocked ? (
                <LockIcon sx={{ fontSize: 14, marginLeft: "4px" }} />
              ) : (
                <LockOpenIcon sx={{ fontSize: 14, marginLeft: "4px" }} />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: -8,
              top: -8,
              cursor: "pointer",
            }}
            onClick={() => onCloseButtonClick(name)}
          >
            {loading ? (
              <Box
                sx={{
                  backgroundColor: theme.palette.text.primary,
                  padding: "4px",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  size={12}
                  sx={{ color: theme.palette.background.default }}
                  thickness={5}
                />
              </Box>
            ) : (
              <>
                {state === "cancel" && (
                  <CancelIcon
                    sx={{
                      fontSize: 18,
                      marginLeft: "4px",
                    }}
                  />
                )}
                {state === "success" && (
                  <CheckCircleIcon
                    sx={{
                      fontSize: 18,
                      marginLeft: "4px",
                    }}
                    color="success"
                  />
                )}
                {state === "error" && (
                  <ErrorIcon
                    sx={{
                      fontSize: 18,
                      marginLeft: "4px",
                    }}
                    color="error"
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default CentralPanelBox;
