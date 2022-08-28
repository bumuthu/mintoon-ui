import {
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import Input from "components/input";
import IOSSwitch from "components/ios-switch";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import RightPanelSlider from "components/page-components/layer-config/right-panel-slider";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ImageMetadata, MainColumnsDataType, Metadata } from "types";
import { setOtherData, setConfigData } from "store/slices/config-slice";
import { handleSave } from "utils";
import { getMaxCombinations } from "@mintoven/art-engine";
import OutlinedLoadingButton from "components/outlined-loading-button";
import { toast } from "react-toastify";
import Link from "next/link";

type Props = {
  metaData: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
};

const RightPanel = (props: Props) => {
  const { metaData, setMetadata } = props;
  const theme = useTheme();
  const [gifExportOpen, setGiftExportOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [startLoading, setStartLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const otherData: MainColumnsDataType = useSelector(
    (state: RootState) => state.configuration.otherData
  );
  const { currentPlan, user } = useSelector(
    (state: RootState) => state.user
  );
  const collectionsAttemptsUsed =
    user && user.collectionAttemptsUsed ? user.collectionAttemptsUsed : 0;
  const currentPlanAttemptsLimit =
    currentPlan.features.COLLECTION_GENERATION_ATTEMPTS.value || 'unlimited'
  const submitValues = (values: any, isBack = false) => {
    const newColumns: any = {};
    const layerOrder = otherData.columnOrder.map((item) => {
      const layer = otherData.columns[item];
      newColumns[item] = {
        ...otherData.columns[item],
      };
      const images = Object.keys(layer.images).map((img) => {
        const image: ImageMetadata = layer.images[img];
        const imageWithoutBase64 = { ...image };
        delete imageWithoutBase64.base64;
        newColumns[item] = {
          ...newColumns[item],
          images: { ...newColumns[item].images, [img]: imageWithoutBase64 },
        };
        return {
          imageId: image.name,
          name: image.name,
          rarity: image.rarity,
          image: image.base64,
        };
      });
      return {
        layerId: layer.id,
        name: layer.title,
        images: images,
      };
    });
    try {
      const customMetadata: any = {};
      metaData.customMetadata.forEach((item) => {
        if (item.key) customMetadata[item.key] = item.value;
      });
      const configuration = {
        namePrefix: values.projectName,
        description: values.projectDescription,
        baseUri: values.projectUrl,
        layerConfigurations: [
          {
            growEditionSizeTo: parseInt(values.collectionSize),
            layersOrder: layerOrder,
          },
        ],
        format: {
          width:
            typeof values.imageDimensionWidth === "string"
              ? parseInt(values.imageDimensionWidth)
              : values.imageDimensionWidth,
          height:
            typeof values.imageDimensionHeight === "string"
              ? parseInt(values.imageDimensionHeight)
              : values.imageDimensionHeight,
          smoothing: false,
        },
        background: {
          generate: colorBackgroundOpen,
          brightness: values.brightness,
        },
        extraMetadata: customMetadata,
        metadata_props: metaData.defaultMetadata,
        frontEndConfigData: {
          columns: newColumns,
          columnOrder: otherData.columnOrder,
          projectName: otherData.projectName,
          projectId: otherData.projectId,
          projectThumbnail: otherData.projectThumbnail,
        },
      };
      if (currentPlan.features.MAX_IMAGES_PER_COLLECTION.value < values.collectionSize) toast.error('Maximum collection size limit for your plan is exceeded.')
      else if (typeof currentPlanAttemptsLimit === 'number' && currentPlanAttemptsLimit <= collectionsAttemptsUsed) toast.error('Maximum monthly attempts limit for your plan is exceeded.')
      else {
        setStartLoading(true);
        const returnedConfiguration = handleSave(
          { ...otherData },
          configuration,
          dispatch
        );
        setStartLoading(false);
        if (!isBack) router.push(`/pictoon/${router.query.collectionId}/progression`);
      }
    } catch (e) {
      toast.error("Something went wrong!");
      setStartLoading(false);
    } finally {
    }
  }
  const [width, height] =
    otherData.columns[otherData.columnOrder[0]].size &&
      otherData.columns[otherData.columnOrder[0]].size.includes("*")
      ? otherData.columns[otherData.columnOrder[0]].size.split("*")
      : ["512", "512"];
  const persistedConfigurationObj =
    useSelector((state: RootState) => state.configuration.configData) || {};
  const isSameCollection =
    persistedConfigurationObj && persistedConfigurationObj.frontEndConfigData
      ? persistedConfigurationObj.frontEndConfigData.projectId ===
      router.query.collectionId
      : false;

  const [colorBackgroundOpen, setColorBackgroundOpen] = useState<boolean>(
    persistedConfigurationObj.background.generate || false
  );
  const maxCombinations =
    getMaxCombinations(
      persistedConfigurationObj.layerConfigurations
        ? persistedConfigurationObj.layerConfigurations[0].layersOrder
        : []
    ) || 0;
  const maxWidth1200 = useMediaQuery("(max-width:1300px)");
  const formik = useFormik({
    initialValues: {
      projectName: otherData.projectName,
      projectDescription: isSameCollection
        ? persistedConfigurationObj.description
        : "",
      projectUrl: isSameCollection ? persistedConfigurationObj.baseUri : "",
      collectionSize:
        isSameCollection &&
          persistedConfigurationObj.layerConfigurations &&
          persistedConfigurationObj.layerConfigurations[0].growEditionSizeTo
          ? persistedConfigurationObj.layerConfigurations[0].growEditionSizeTo.toString()
          : "",
      imageDimensionWidth: isSameCollection ? parseInt(width) : 512,
      imageDimensionHeight: isSameCollection ? parseInt(height) : 512,
      brightness: isSameCollection
        ? persistedConfigurationObj.background.brightness
        : 100,
      // gifExportQuality: "",
      // gifExportDelay: "",
      // previewGifNumberOfImages: "",
      // previewGifDelay: "",
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Required"),
      projectDescription: Yup.string(),
      projectUrl: Yup.string(),
      collectionSize: Yup.number()
        .max(maxCombinations, "Available maximum different combinations exceeded.")
        .required("Required"),
      imageDimensionWidth: Yup.number().required("Required"),
      imageDimensionHeight: Yup.number().required("Required"),
      brightness: Yup.number(),
      // gifExportQuality: Yup.number().required("Required"),
      // gifExportDelay: Yup.number().required("Required"),
      // previewGifNumberOfImages: Yup.number().required("Required"),
      // previewGifDelay: Yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      submitValues(values)
    },
  });
  useEffect(() => {
    formik.setFieldValue("projectName", otherData.projectName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherData]);

  const handleProjectNameChange = (e: any) => {
    formik.handleChange(e);
  };

  const handleProjectNameBlur = (e: any) => {
    formik.handleBlur(e);
    dispatch(
      setOtherData({ ...otherData, projectName: formik.values.projectName })
    );
  };

  const handleSliderChange = (value: number) => {
    formik.setFieldValue("brightness", value);
  };
  return (
    <Grid
      sx={{
        width: maxWidth1200 ? "100%" : "calc(100% - 572px)",
        marginTop: maxWidth1200 ? "52px" : 0,
        padding: "32px",
        paddingBottom: 0,
        height: 'calc(100vh - 350px)',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
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
      <Typography
        sx={{
          fontWeight: "bold",
        }}
      >
        Project Configuration
      </Typography>
      <Box
        sx={{
          padding: "16px 32px",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            flexDirection: maxWidth1200 ? "column" : "row",
          }}
        >
          <Box
            sx={{
              width: 200,
              display: "flex",
            }}
          >
            <Typography variant="subtitle2">Project Name</Typography>
            <Typography
              sx={{ marginLeft: "4px" }}
              color="error"
              variant="subtitle1"
            >
              *
            </Typography>
          </Box>
          <Input
            type="text"
            name="projectName"
            id="projectName"
            formik={formik}
            onChange={handleProjectNameChange}
            onBlur={handleProjectNameBlur}
            placeholder=""
            containerStyle={{
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
              minHeight: undefined,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            flexDirection: maxWidth1200 ? "column" : "row",
          }}
        >
          <Box sx={{ width: 200, display: "flex" }}>
            <Typography variant="subtitle2">Collection Size</Typography>
            <Typography
              sx={{ marginLeft: "4px" }}
              color="error"
              variant="subtitle1"
            >
              *
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
            }}
          >
            <Input
              type="number"
              name="collectionSize"
              id="collectionSize"
              formik={formik}
              placeholder=""
              containerStyle={{
                minHeight: undefined,
              }}
              inputStyle={{
                textAlign: "right",
              }}
            />
            <Typography textAlign="center" display="inline-block" variant="subtitle2">
              Your maximum collection size limit is <strong>{currentPlan.features.MAX_IMAGES_PER_COLLECTION.value}</strong>.
              {currentPlan.displayName != "PREMIUM" && (<Link href={"/account"} passHref={true}>
                <span
                  style={{
                    fontWeight: "bold",
                    display: "inline-block",
                    background: `-webkit-linear-gradient(310deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginLeft: "4px",
                    cursor: "pointer",
                  }}
                >
                  Want to upgrade?
                </span>
              </Link>)
              }
            </Typography>
            <Typography textAlign="center" variant="subtitle2">
              Number of available maximum different combinations is <strong>{maxCombinations}</strong>{" "}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "200px", display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 200, display: "flex" }}>
              <Typography variant="subtitle2">
                Output Image Dimension
              </Typography>
              <Typography
                sx={{ marginLeft: "4px" }}
                color="error"
                variant="subtitle1"
              >
                *
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
              display: "flex",
              justifyContent: maxWidth1200 ? "flex-start" : "flex-end",
              marginLeft: maxWidth1200 ? undefined : "200px",
            }}
          >
            <Grid
              container
              columnGap="8px"
              sx={{
                width: "100%",
              }}
              justifyContent="space-between"
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "45%",
                }}
                item
              >
                <Typography variant="subtitle2">Width</Typography>
                <Input
                  type="number"
                  name="imageDimensionWidth"
                  id="imageDimensionWidth"
                  formik={formik}
                  placeholder={""}
                  containerStyle={{ width: "100%", minHeight: undefined }}
                  inputStyle={{ textAlign: "right" }}
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "45%",
                }}
                item
              >
                <Typography variant="subtitle2">Height</Typography>
                <Input
                  type="number"
                  name="imageDimensionHeight"
                  id="imageDimensionHeight"
                  formik={formik}
                  placeholder={""}
                  containerStyle={{ width: "100%", minHeight: undefined }}
                  inputStyle={{ textAlign: "right" }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            flexDirection: maxWidth1200 ? "column" : "row",
          }}
        >
          <Typography sx={{ width: 200 }} variant="subtitle2">
            Project URL
          </Typography>
          <Input
            type="text"
            name="projectUrl"
            id="projectUrl"
            formik={formik}
            placeholder=""
            containerStyle={{
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
              minHeight: undefined,
              marginTop: maxWidth1200 ? "4px" : undefined,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            flexDirection: maxWidth1200 ? "column" : "row",
          }}
        >
          <Typography sx={{ width: 200 }} variant="subtitle2">
            Project Description
          </Typography>
          <Input
            type="text"
            name="projectDescription"
            id="projectDescription"
            formik={formik}
            placeholder=""
            multiline
            rows={2}
            containerStyle={{
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
              minHeight: undefined,
              marginTop: maxWidth1200 ? "4px" : undefined,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: maxWidth1200 ? "column" : "row",
          }}
        >
          <Box sx={{ width: "200px", display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2">Background</Typography>
              <Typography variant="caption">Randomized solid color</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: maxWidth1200 ? "100%" : "calc(100% - 200px)",
              marginTop: maxWidth1200 ? "4px" : undefined,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                setColorBackgroundOpen((prevState) => !prevState);
              }}
            >
              <IOSSwitch
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: theme.palette.grey[300],
                  },
                }}
                onChange={(e: any) => setColorBackgroundOpen(e.target.checked)}
                checked={colorBackgroundOpen}
              />
              <Divider
                sx={{
                  width: "calc(100% - 128px)",
                  height: 1,
                  backgroundColor: `${theme.palette.secondary.light}54`,
                  marginRight: "16px",
                }}
              />
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.secondary,
                  cursor: "pointer",
                }}
                variant="subtitle2"
              >
                {colorBackgroundOpen ? "Collapse" : "Expand"}
              </Typography>
            </Box>
            <Collapse in={colorBackgroundOpen} timeout="auto" unmountOnExit>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <RightPanelSlider
                  row
                  showLock={false}
                  name={""}
                  percentage={
                    typeof formik.values.brightness === "string"
                      ? parseInt(formik.values.brightness)
                      : formik.values.brightness
                  }
                  selectedLayer={""}
                  handleSliderChange={handleSliderChange}
                  initialLoading={false}
                />
              </Box>
            </Collapse>
          </Box>
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "152px", display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontWeight: "bold" }} variant="subtitle2">
              Gif Export
            </Typography>
            <IOSSwitch
              sx={{
                marginLeft: "32px",
                "& .MuiSwitch-track": {
                  backgroundColor: theme.palette.text.primary,
                },
              }}
              defaultChecked
              onChange={(e: any) => setGiftExportOpen(e.target.checked)}
            />
          </Box>
          <Box sx={{ width: "calc(100% - 180px)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                setGiftExportOpen((prevState) => !prevState);
              }}
            >
              <Divider
                sx={{
                  width: "calc(100% - 100px)",
                  height: 1,
                  backgroundColor: `${theme.palette.secondary.light}54`,
                  marginRight: "16px",
                }}
              />
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.secondary,
                  cursor: "pointer",
                }}
                variant="subtitle2"
              >
                {gifExportOpen ? "Collapse" : "Expand"}
              </Typography>
            </Box>
            <Collapse in={gifExportOpen} timeout="auto" unmountOnExit>
              <Grid
                container
                columnGap="8px"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "40%",
                  }}
                  item
                >
                  <Typography variant="subtitle2">Quality</Typography>
                  <Input
                    type={"text"}
                    name="gifExportQuality"
                    id="gifExportQuality"
                    formik={formik}
                    placeholder={""}
                    containerStyle={{ width: "100%", minHeight: undefined }}
                  />
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "40%",
                  }}
                  item
                >
                  <Typography variant="subtitle2">Delay</Typography>
                  <Input
                    type={"text"}
                    name="gifExportDelay"
                    id="gifExportDelay"
                    formik={formik}
                    placeholder={""}
                    containerStyle={{ width: "100%", minHeight: undefined }}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Box>
        </Box> */}
        {/* <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "162px", display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontWeight: "bold" }} variant="subtitle2">
              Preview Gif
            </Typography>
            <IOSSwitch
              sx={{
                marginLeft: "32px",
                "& .MuiSwitch-track": {
                  backgroundColor: theme.palette.text.primary,
                },
              }}
              defaultChecked
              onChange={(e: any) => setPreviewOpen(e.target.checked)}
            />
          </Box>
          <Box sx={{ width: "calc(100% - 190px)" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                setPreviewOpen((prevState) => !prevState);
              }}
            >
              <Divider
                sx={{
                  width: "calc(100% - 100px)",
                  height: 1,
                  backgroundColor: `${theme.palette.secondary.light}54`,
                  marginRight: "16px",
                }}
              />
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.secondary,
                  cursor: "pointer",
                }}
                variant="subtitle2"
              >
                {previewOpen ? "Collapse" : "Expand"}
              </Typography>
            </Box>
            <Collapse in={previewOpen} timeout="auto" unmountOnExit>
              <Grid
                container
                columnGap="8px"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "40%",
                  }}
                  item
                >
                  <Typography variant="subtitle2">Number of images</Typography>
                  <Input
                    type={"text"}
                    name="previewGifNumberOfImages"
                    id="previewGifNumberOfImages"
                    formik={formik}
                    placeholder={""}
                    containerStyle={{ width: "100%", minHeight: undefined }}
                  />
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "40%",
                  }}
                  item
                >
                  <Typography variant="subtitle2">Delay</Typography>
                  <Input
                    type={"text"}
                    name="previewGifDelay"
                    id="previewGifDelay"
                    formik={formik}
                    placeholder={""}
                    containerStyle={{ width: "100%", minHeight: undefined }}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Box>
        </Box> */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <OutlinedLoadingButton
            variant="outlined"
            onClick={() => { submitValues(formik.values, true); router.back(); }}
            buttonText="Back"
            style={{
              marginTop: "40px",
              minWidth: 150,
              marginBottom: "30px",
              fontSize: 11,
            }}
            containerStyle={{ width: 150 }}
          />
          <OutlinedLoadingButton
            variant="contained"
            loading={startLoading}
            onClick={() => {
              formik.submitForm();
            }}
            buttonText="Start"
            style={{
              marginTop: "40px",
              minWidth: 150,
              marginBottom: "30px",
              fontSize: 11,
            }}
            containerStyle={{ width: 150, marginLeft: "20px" }}
            loadingElement={
              <CircularProgress
                sx={{ color: theme.palette.secondary.contrastText }}
                size={16}
              />
            }
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default RightPanel;
