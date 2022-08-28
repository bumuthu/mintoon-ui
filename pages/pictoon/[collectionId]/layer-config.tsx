import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import AppBar from "components/page-components/layer-config/appbar";
import LeftPanel from "components/page-components/layer-config/left-panel";
import CenterPanel from "components/page-components/layer-config/center-panel";
import RightPanel from "components/page-components/layer-config/right-panel";
import RightPanelPreview from "components/page-components/layer-config/right-panel-preview";
import CenterPanelPreview from "components/page-components/layer-config/center-panel-preview";
import {
  ImageMetadata,
  ImagesType,
  MainColumnsDataType,
  ColumnsType,
  previewMetadata,
} from "types";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useDispatch } from "react-redux";
import {
  setConfigData,
  setOtherData,
  setPreviewImages as setReduxPreviewImages,
} from "store/slices/config-slice";
import { getProjectPreviewImage } from "@mintoven/art-engine";
import { useRouter } from "next/router";
import app from "api/modules/app";
import { NextPage } from "next";
import Swiper from "swiper";
import { configurationData, initialOtherData } from "data/initialData";

const LayerConfig: NextPage = () => {
  const theme = useTheme();
  const [imageData, setImageData] = useState<ImageMetadata[]>([]);
  const [preview, setPreview] = useState(false);
  const [previewImages, setPreviewImages] = useState<previewMetadata[]>([]);
  const [routeCollectionId, setRouteCollectionId] = useState("");
  const [layerLoading, setLayerLoading] = useState(false);
  const [previewMetadata, setPreviewMetadata] = useState<{
    metadata: any;
  }>({ metadata: null });
  const [initialLoading, setInitialLoading] = useState(false);
  const [initialData, setInitialData] = useState<MainColumnsDataType>({
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
    projectId: "",
    projectThumbnail: "/image-placeholder.svg",
  });
  const dispatch = useDispatch();
  const initialRender = useRef(true);
  const route: any = useRouter();
  const maxWidth1350 = useMediaQuery("(max-width:1368px)");
  const maxWidth900 = useMediaQuery("(max-width:900px)");

  const otherData = useSelector(
    (state: RootState) => state.configuration.otherData
  );

  const configurationObj = useSelector(
    (state: RootState) => state.configuration.configData
  );

  const [selectedLayer, setSelectedLayer] = useState(
    initialData.columnOrder[0]
  );

  useEffect(() => {
    document.getElementsByTagName("html")[0].style.overflowX = "auto";
  }, []);

  useEffect(() => {
    dispatch(setReduxPreviewImages(previewImages));
    if (previewImages.length === 10) {
      const image = document.createElement('img')
      image.src = `data:image/png;base64,${previewImages[0].image}`
      image.onload = function() {
        getProjectPreviewImage(
          previewImages
            .slice(0, 5)
            .map((item) => `data:image/png;base64,${item.image}`), image.width, image.height
        ).then((collectionImage) => {
          setInitialData((prevState) => ({
            ...prevState,
            projectThumbnail: `data:image/gif;base64,${collectionImage.image}`,
          }));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImages]);

  useEffect(() => {
    setRouteCollectionId(route.query.collectionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.query.collectionId]);

  useEffect(() => {
    try {
      if (routeCollectionId && otherData.projectId !== routeCollectionId) {
        setInitialLoading(true);
        app.getProject(routeCollectionId).then(async (data) => {
          if (data && data[0].status === 200) {
            const [, { payload }] = data;
            if (payload) {
              const oldData: MainColumnsDataType = {
                ...payload.metadata.frontEndConfigData,
              };
              const newColumns: ColumnsType = {};
              const layersOrder: any = [];
              if (oldData.columns) {
                setSelectedLayer(oldData.columnOrder[0]);
                await Promise.all(
                  Object.keys(oldData.columns).map(async (column) => {
                    const newImages: ImagesType = {};
                    const images: any = [];
                    try {
                      await Promise.all(
                        Object.keys(oldData.columns[column].images || []).map(
                          async (image) => {
                            const oldImage =
                              oldData.columns[column].images[image];
                            const [{ status }, { payload }] =
                              await app.getImage(oldImage.originUri);
                            const base64String = `data:image/png;base64,${payload.data}`;
                            const newImage = {
                              ...oldImage,
                              base64: base64String,
                            };
                            newImages[image] = newImage;
                            images.push({
                              imageId: oldImage.name,
                              name: oldImage.name,
                              rarity: oldImage.rarity,
                              image: base64String,
                            });
                          }
                        )
                      );
                    } catch (e) {}
                    newColumns[column] = {
                      ...oldData.columns[column],
                      numberOfLayers: Object.keys(newImages).length.toString(),
                      images: newImages,
                    };
                    layersOrder.push({
                      layerId: oldData.columns[column].id,
                      name: oldData.columns[column].title,
                      images,
                    });
                  })
                );
                setInitialLoading(false);
                const newData = {
                  ...oldData,
                  columns: newColumns,
                  projectId: routeCollectionId,
                };
                const configuration = {
                  ...payload.metadata,
                  layerConfigurations: [
                    {
                      growEditionSizeTo: 0,
                      layersOrder,
                    },
                  ],
                };
                setInitialData(newData);
                dispatch(setOtherData(newData));
                dispatch(setConfigData(configuration));
              } else {
                const otherDataWhenElse = {
                  ...initialOtherData,
                  projectId: routeCollectionId,
                  projectName: payload.metadata.namePrefix,
                };
                const configuration = {
                  ...configurationObj,
                  ...payload.metadata,
                };
                setInitialData(otherDataWhenElse);
                dispatch(setOtherData(otherDataWhenElse));
                dispatch(setConfigData(configuration));
              }
            }
          }
          setInitialLoading(false);
        });
      } else {
        setSelectedLayer(initialData.columnOrder[0]);
      }
      if (otherData.projectId === routeCollectionId) {
        console.log(selectedLayer);
        setImageData(Object.values(otherData.columns[selectedLayer].images));
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCollectionId]);

  useEffect(() => {
    if (initialRender.current) initialRender.current = false;
    else {
      const images: ImagesType = {};
      imageData.forEach((item) => {
        images[item.name] = {
          name: item.name,
          rarity: item.rarity,
          url: item.url,
          originUri: item.originUri,
          item: item.item,
          lock: item.lock,
          max: item.max,
          base64: item.base64,
          onlyOneInTheList: item.onlyOneInTheList,
          size: item.size,
          loading: item.loading,
          loadingSuccess: item.loadingSuccess,
        };
      });
      const newData = {
        ...otherData,
        columns: {
          ...otherData.columns,
          [selectedLayer]: {
            ...otherData.columns[selectedLayer],
            images: Object.keys(images)
              ? images
              : otherData.columns[selectedLayer].images,
            size:
              Object.values(images) && Object.values(images)[0]
                ? //@ts-ignore
                  Object.values(images)[0].size
                : 0,
            //@ts-ignore
            numberOfLayers: Object.keys(images).length.toString(),
          },
        },
      };
      setInitialData(newData);
      if (routeCollectionId) dispatch(setOtherData(newData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  const handleAutoPlay = (swiper: Swiper) => {
    setPreviewMetadata(
      previewImages[
        swiper && swiper.activeIndex === 11 ? 0 : swiper.activeIndex - 1
      ]?.metadata
    );
  };

  return (
    <Box
      sx={{
        width: maxWidth900 ? 900 : "100vw",
        overflowX: "auto",
        padding: maxWidth1350 ? "0 20px 20px 20px" : "0 54px 62px 54px",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <AppBar
        initialData={initialData}
        setInitialData={setInitialData}
        projectId={routeCollectionId}
        initialLoading={initialLoading}
        preview={preview}
      />
      <Grid container>
        <LeftPanel
          initialData={initialData}
          setSelectedLayer={setSelectedLayer}
          setInitialData={setInitialData}
          selectedLayer={selectedLayer}
          initialLoading={initialLoading}
          layerLoading={layerLoading}
        />
        {!preview ? (
          <CenterPanel
            setImageData={setImageData}
            setInitialData={setInitialData}
            setSelectedLayer={setSelectedLayer}
            initialData={initialData}
            selectedLayer={selectedLayer}
            projectId={routeCollectionId}
            initialLoading={initialLoading}
            setLayerLoading={setLayerLoading}
          />
        ) : (
          <CenterPanelPreview
            previewImages={previewImages}
            handleAutoPlay={handleAutoPlay}
          />
        )}
        {!preview ? (
          <RightPanel
            initialData={initialData}
            setInitialData={setInitialData}
            selectedLayer={selectedLayer}
            setPreviewProp={setPreview}
            setPreviewImages={setPreviewImages}
            initialLoading={initialLoading}
          />
        ) : (
          <RightPanelPreview
            setPreview={setPreview}
            metadata={previewMetadata}
          />
        )}
      </Grid>
    </Box>
  );
};

export default LayerConfig;
