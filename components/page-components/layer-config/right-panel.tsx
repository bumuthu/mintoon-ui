import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { Dispatch, useState } from "react";
import Input from "components/input";
import RightPanelSlider from "components/page-components/layer-config/right-panel-slider";
import { useRouter } from "next/router";
import { MainColumnsDataType, previewMetadata } from "types";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";
import { startPreview } from "@mintoven/art-engine/lib/src/main";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "store";
import { handleSave } from "utils";
import OutlinedLoadingButton from "components/outlined-loading-button";

type Props = {
  initialData: MainColumnsDataType;
  setInitialData: Dispatch<React.SetStateAction<MainColumnsDataType>>;
  selectedLayer: string;
  setPreviewImages: Dispatch<React.SetStateAction<previewMetadata[]>>;
  setPreviewProp: any;
  initialLoading: boolean;
};

const RightPanel = (props: Props) => {
  const {
    initialData,
    setInitialData,
    selectedLayer,
    setPreviewProp,
    setPreviewImages,
    initialLoading,
  } = props;
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [prevButtonLoading, setPrevButtonLoading] = useState(false);
  const [nextButtonLoading, setNextButtonLoading] = useState(false);
  const maxWidth1368 = useMediaQuery("(max-width:1368px)");
  const configuration = useSelector(
    (state: RootState) => state.configuration.configData
  );
  const handleChange = (e: any) => {
    const newData = {
      ...initialData,
      columns: {
        ...initialData.columns,
        [selectedLayer]: {
          ...initialData.columns[selectedLayer],
          title: e.target.value,
        },
      },
    };
    setInitialData(newData);
  };
  const handleBlur = () => {
    let newData = { ...initialData };
    if (!initialData.columns[selectedLayer].title) {
      newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [selectedLayer]: {
            ...initialData.columns[selectedLayer],
            title: "Untitled",
          },
        },
      };
    }
    setInitialData(newData);
    dispatch(setOtherData(newData));
  };
  const handlePreview = async (preview: boolean, createPreviewData = true) => {
    const isProjectIdMatched =
      router.query.collectionId === configuration.frontEndConfigData.projectId;
    const configurationObj = await handleSave(
      initialData,
      isProjectIdMatched ? configuration : {},
      dispatch,
      true
    );
    if (createPreviewData) {
      let configClone: any = JSON.parse(JSON.stringify(configurationObj));
      setPreviewProp(preview);
      try {
        await startPreview(configClone, setPreviewImages, true);
      } catch (e) {
        toast.error("Library error");
      }
    }
  };

  return (
    <Grid
      sx={{
        width: 380,
        padding: "20px 20px 20px 52px",
        marginLeft: "20px",
        height: maxWidth1368 ? "calc(100vh - 144px)" : "calc(100vh - 176px)",
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {initialData &&
        initialData.columns &&
        initialData.columns[selectedLayer] && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="subtitle2"
                textAlign="end"
                fontWeight={600}
                sx={{ color: `${theme.palette.secondary.main}B3` }}
              >
                Layer Setting
              </Typography>
            </Box>
            {initialLoading ? (
              <Skeleton
                sx={{
                  width: "100%",
                  "&.MuiSkeleton-root": {
                    borderRadius: "8px",
                    height: "36px",
                  },
                }}
              />
            ) : (
              <Input
                label="Layer Name"
                value={initialData.columns[selectedLayer].title}
                type={"text"}
                name={"layerName"}
                placeholder={""}
                labelStyle={{
                  color: `${theme.palette.secondary.main}B3`,
                  fontSize: 12,
                }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
            {/* <Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ color: `${theme.palette.secondary.main}B3`, fontSize: 12 }}
            >
              Layer Rarity
            </Typography>
            <Typography
              variant="subtitle2"
              textAlign="end"
              fontWeight={600}
              sx={{ marginLeft: "8px" }}
            >
              {sliderValue}%
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItem: "center",
            }}
          >
            <Slider
              defaultValue={50}
              value={sliderValue}
              color="secondary"
              onChange={(
                event: Event,
                value: number | Array<number>,
                activeThumb: number
              ) => {
                if (typeof value === "number") {
                  setSliderValue(value);
                }
              }}
              sx={{
                marginTop: "4px",
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                },
              }}
            />
            <Input
              type={"number"}
              name={"layerRarity"}
              placeholder={""}
              containerStyle={{
                width: "100px",
                marginLeft: "24px",
              }}
              value={sliderValue.toFixed(1)}
              min={0}
              max={100}
              onChange={(event: any) =>
                setSliderValue(parseInt(event.target.value))
              }
            />
          </Box>
        </Box> */}
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  textAlign="end"
                  fontWeight={600}
                  sx={{ color: `${theme.palette.secondary.main}B3` }}
                >
                  Feature Settings
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 'calc(100vh - 420px)',
                  overflowY: "auto",
                  overflowX: "hidden",
                  marginTop: "8px",
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
              >
                {Object.keys(initialData.columns[selectedLayer].images).map(
                  (item) => {
                    return (
                      <RightPanelSlider
                        name={item}
                        percentage={
                          initialData.columns[selectedLayer].images[item]
                            .rarity
                        }
                        key={item}
                        setInitialData={setInitialData}
                        initialData={initialData}
                        selectedLayer={selectedLayer}
                        showLock
                        max={
                          initialData.columns[selectedLayer].images[item].max
                        }
                        initialLoading={initialLoading}
                      />
                    );
                  }
                )}
              </Box>
            </>
          </Box>
        )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          marginTop: "1vh",
          marginBottom: "1vh"
        }}
      >
        <OutlinedLoadingButton
          loading={prevButtonLoading}
          variant="outlined"
          onClick={async () => {
            setPrevButtonLoading(true);
            await handlePreview(true);
            setPrevButtonLoading(false);
          }}
          buttonText="Preview"
          disabled={initialLoading}
          skeletonLoading={initialLoading}
          style={{
            minWidth: 200,
            fontSize: 11,
          }}
          containerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <OutlinedLoadingButton
          loading={nextButtonLoading}
          variant="contained"
          onClick={() => {
            setNextButtonLoading(true);
            handlePreview(false, false);
            setNextButtonLoading(false);
            router.push(`/pictoon/${router.query.collectionId}/project-config`);
          }}
          buttonText="Next"
          disabled={initialLoading}
          skeletonLoading={initialLoading}
          style={{
            marginTop: "8px",
            minWidth: 200,
            fontSize: 11,
          }}
          containerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          loadingElement={
            <CircularProgress
              sx={{ color: theme.palette.secondary.contrastText }}
              size={16}
            />
          }
        />
      </Box>
    </Grid>
  );
};

export default RightPanel;
