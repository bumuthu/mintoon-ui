import {
  Box,
  Grid,
  useMediaQuery,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { ImageMetadata, MainColumnsDataType } from "types";
import CentralPanelBox from "components/page-components/layer-config/central-panel-box";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import app from "api/modules/app";
import { additionalColors } from "theme";
import ConfirmationModal from "components/confirmation-modal";

type Props = {
  setImageData: Dispatch<SetStateAction<ImageMetadata[]>>;
  setInitialData: Dispatch<SetStateAction<MainColumnsDataType>>;
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  setLayerLoading: Dispatch<SetStateAction<boolean>>;
  initialData: MainColumnsDataType;
  selectedLayer: string;
  projectId: string;
  initialLoading: boolean;
};

const CenterPanel = (props: Props) => {
  const {
    setImageData,
    setInitialData,
    setSelectedLayer,
    setLayerLoading,
    initialData,
    selectedLayer,
    projectId,
    initialLoading,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const input = useRef<HTMLInputElement>(null);
  const [isDropZoneActivated, setIsDropZoneActivated] = useState(false);
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const minWidth1920 = useMediaQuery("(min-width:1920px)");
  const maxWidth1920 = useMediaQuery("(max-width:1920px)");
  const maxWidth1800 = useMediaQuery("(max-width:1800px)");
  const maxWidth1600 = useMediaQuery("(max-width:1600px)");
  const maxWidth1500 = useMediaQuery("(max-width:1500px)");
  const maxWidth1350 = useMediaQuery("(max-width:1368px)");
  const maxWidth900 = useMediaQuery("(max-width:900px)");
  const getBase64 = (item: File) =>
    new Promise<{
      base64String: string | ArrayBuffer | null;
      width: number;
      height: number;
    }>((resolve, _reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.addEventListener("load", (e) => {
        const image = new Image();
        if (typeof e.target?.result === "string") image.src = e.target?.result;
        image.addEventListener("load", function () {
          const width = this.width;
          const height = this.height;
          const result = {
            base64String: reader.result,
            width: width,
            height: height,
          };
          resolve(result);
        });
      });
    });
  const handleFileChange = async (event: any, fromDropZone = false) => {
    event.preventDefault();
    const imageObjects: ImageMetadata[] = [];
    const oldImagesWithNewValues: ImageMetadata[] = [];
    const imagesUploadingPromises: {
      name: string;
      promise: () => Promise<any[]>;
    }[] = [];
    const files: File[] =
      fromDropZone && event.dataTransfer.files
        ? event.dataTransfer.files
        : input.current?.files;
    const oldImages = initialData.columns[selectedLayer].images;
    //@ts-ignore
    if (files) {
      const percentage = 100 / (files.length + Object.keys(oldImages).length);
      await Promise.all(
        Object.values(files).map(async (item: File, _index: number) => {
          const nameArray = item.name.split(".").splice(0, 1);
          const { base64String, width, height } = await getBase64(item);
          imageObjects.push({
            url: URL.createObjectURL(item),
            originUri: "",
            rarity: percentage,
            item: item,
            name: nameArray.join(""),
            lock: files.length + Object.keys(oldImages).length === 1 || false,
            onlyOneInTheList:
              files.length + Object.keys(oldImages).length === 1,
            max: 100,
            base64: typeof base64String === "string" ? base64String : "",
            size: `${width}*${height}`,
            loading: true,
          });
          imagesUploadingPromises.push({
            name: nameArray.join(""),
            promise: () =>
              app.addImage(
                projectId ? projectId : "",
                base64String,
                selectedLayer,
                item.name
              ),
          });
        })
      );
      Object.values(oldImages).map((item) => {
        oldImagesWithNewValues.push({
          ...item,
          rarity: percentage,
          lock: item.onlyOneInTheList ? false : item.lock,
          onlyOneInTheList: false,
        });
      });
    }
    if (
      initialData &&
      initialData.columns &&
      initialData.columns[selectedLayer]
    )
      setImageData([...oldImagesWithNewValues, ...imageObjects]);
    resetInput();
    setLayerLoading(true);
    await Promise.all(
      imagesUploadingPromises.map(async (item) => {
        const result = await item.promise();
        if (result) {
          const [{ status }, payload] = result;
          if (status === 200) {
            setImageData((prevState: ImageMetadata[]) => {
              const newImage = {
                ...prevState.filter((image) => image.name === item.name)[0],
              };
              newImage.loading = false;
              newImage.originUri = payload ? payload.payload.imageUri : "";
              newImage.loadingSuccess = "success";
              return [...prevState, newImage];
            });
          } else
            setImageData((prevState: ImageMetadata[]) => {
              const newImage = {
                ...prevState.filter((image) => image.name === item.name)[0],
              };
              newImage.loading = false;
              newImage.loadingSuccess = "error";
              return [...prevState, newImage];
            });
        }
      })
    );
    setLayerLoading(false);
  };

  const resetInput = () => {
    if (input.current) {
      input.current.files = null;
      input.current.value = "";
    }
  };

  const handleLayerDelete = () => {
    const oldData = { ...initialData };
    const newColumns = { ...oldData.columns };
    const newColumnOrder = [...oldData.columnOrder];
    delete newColumns[selectedLayer];
    const index = newColumnOrder.indexOf(selectedLayer);
    if (index > -1) newColumnOrder.splice(index, 1);
    const newData = {
      ...oldData,
      columns: newColumns,
      columnOrder: newColumnOrder,
    };
    setSelectedLayer(newColumnOrder[0]);
    setInitialData(newData);
    dispatch(setOtherData(newData));
    handleClose()
  };

  return (
    <Box
      id="center-panel-container"
      sx={{
        padding: "20px 52px",
        width: maxWidth1350 ? "calc(100vw - 760px)" : "calc(100vw - 840px)",
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
        height: maxWidth1350 ? "calc(100vh - 144px)" : "calc(100vh - 176px)",
        overflowY: "auto",
        marginLeft: maxWidth1350 ? "20px" : "52px",
        "::-webkit-scrollbar": {
          width: "0.4em",
        },
        "::-webkit-scrollbar-track": {
          webkitBoxShadow: `inset 0 0 6px ${theme.palette.secondary.contrastText}`,
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: `${theme.palette.primary.main}33`,
          outline: `1px solid ${theme.palette.primary.main}66`,
          borderRadius: "0.2em",
        },
      }}
      onDragStart={() => setIsDropZoneActivated(true)}
      onDragOver={() => setIsDropZoneActivated(true)}
      onDragLeave={() => setIsDropZoneActivated(false)}
    >
      <ConfirmationModal open={open} handleClose={handleClose} layerOrProject="layer" handleYes={handleLayerDelete} />
      {initialData &&
        initialData.columns &&
        initialData.columns[selectedLayer] && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
            onDragStart={() => setIsDropZoneActivated(true)}
            onDragOver={() => setIsDropZoneActivated(true)}
            onDragLeave={() => setIsDropZoneActivated(false)}
          >
            <Typography variant="h6">
              {initialLoading ? (
                <Skeleton sx={{ width: 150 }} />
              ) : (
                `Layers/${initialData.columns[selectedLayer].title}`
              )}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle2"
                textAlign="end"
                fontWeight={600}
                sx={{ color: `${theme.palette.secondary.main}80` }}
              >
                {initialLoading ? (
                  <Skeleton sx={{ width: 20 }} />
                ) : (
                  `${initialData.columns[selectedLayer].numberOfLayers} Traits`
                )}
              </Typography>
              {initialData.columnOrder.length !== 1 && (
                <IconButton
                  onClick={handleOpen}
                  sx={{
                    "&.MuiButtonBase-root": {
                      marginLeft: "20px",
                      paddingBottom: initialLoading ? 0 : undefined,
                    },
                  }}
                  disabled={initialLoading}
                >
                  {initialLoading ? (
                    <Skeleton sx={{ width: 20 }} />
                  ) : (
                    <DeleteIcon color="error" />
                  )}
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      {!isDropZoneActivated ? (
        <Box
          sx={{
            marginTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: maxWidth1350 ? "center" : "flex-start",
          }}
        >
          {initialData &&
            initialData.columns &&
            initialData.columns[selectedLayer] &&
            Object.values(initialData.columns[selectedLayer].images).map(
              (image: ImageMetadata, index: number) => {
                return (
                  <CentralPanelBox
                    src={image.base64 || ""}
                    projectId={projectId}
                    originUri={image.originUri}
                    key={index}
                    name={image.name}
                    percentage={image.rarity}
                    isSizeChange={
                      initialData.columns[selectedLayer].size !== image.size
                    }
                    isLocked={image.lock}
                    initialData={initialData}
                    selectedLayer={selectedLayer}
                    setInitialData={setInitialData}
                    loading={image.loading}
                    loadingSuccess={image.loadingSuccess}
                  />
                );
              }
            )}

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
            <label
              htmlFor="file-upload"
              style={{
                width: "100%",
                height: 184,
                backgroundColor: `${theme.palette.background.paper}54`,
                color: theme.palette.text.secondary,
                borderRadius: `${Number(theme.shape.borderRadius) + 2}px`,
                padding: "8px",
                border: `2px solid ${theme.palette.secondary.main}40`,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              Click here to browse images
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              ref={input}
              multiple
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      ) : (
        <Box
          onDragLeave={() => setIsDropZoneActivated(false)}
          style={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "20px",
            border: `2px dashed ${additionalColors.dividerColor}66`,
            width: "100%",
            height: "calc(100% - 52px)",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleFileChange(event, true);
            setIsDropZoneActivated(false);
          }}
          onDragOver={(event) => event.preventDefault()}
        >
          <AddPhotoAlternateIcon
            sx={{ fontSize: 32, color: additionalColors.dividerColor }}
          />
          <Typography
            sx={{ color: additionalColors.dividerColor, marginTop: "12px" }}
            variant="subtitle1"
          >
            Upload your images
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CenterPanel;
