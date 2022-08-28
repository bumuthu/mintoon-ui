import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { setOtherData, setPageLoading } from "store/slices/config-slice";
import { setCollections as setUserCollections } from "store/slices/user-slice";
import { useDispatch } from "react-redux";
import appApi from "api/modules/app";
import GeneralTemplate from "templates/general";
import app from "api/modules/app";
import "react-circular-progressbar/dist/styles.css";
import { additionalColors } from "theme";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "store";
import ProjectCard from "components/project-card";
import HomeCircularGraphSection from "components/home-circular-graph-section";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination, Swiper as SwiperType } from "swiper";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.user.heroImages);
  const userCollections = useSelector((state: RootState) => state.user.collections)
  const [pageLoading, setPageLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const maxWidth1200 = useMediaQuery("(max-width:1200px)");
  const maxWidth900 = useMediaQuery("(max-width:900px)");
  useEffect(() => {
    if(!userCollections.length) setPageLoading(true);
    else setCollections(userCollections)
    app
      .getProjects()
      .then((data) => {
        if (data && data[0].status === 200) {
          const [, { payload }] = data;
          if (payload) {
            setCollections(payload);
            dispatch(setUserCollections(payload))
            setPageLoading(false);
          }
        }
      })
      .finally(() => setPageLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onNewProjectButtonPressHandler = async () => {
    try {
      const [, { payload }]: any = await appApi.createNewProject();
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
      router.push(`/app/layer-config/${payload._id}`);
    } catch (e) {}
  };
  return (
    <GeneralTemplate loading={pageLoading}>
      <Grid
        item
        container
        gap="36px"
        sx={{ width: maxWidth1200 ? "100%" : "calc(100vw - 345px)" }}
      >
        <Grid
          item
          sx={{
            borderRadius: `20px`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: "320px",
            width: maxWidth1200 ? "calc(100vw - 88px)" : "calc(100vw - 345px)",
            position: "absolute",
            zIndex: 0,
            top: "36px",
          }}
        >
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {images && images.map((item, key) => {
              return (
                <SwiperSlide
                  key={key}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage: `url(data:image/png;base64,${item})`,
                      borderRadius: `20px`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Grid>
        <Grid
          container
          item
          sx={{
            width: "100%",
            marginTop: "300px",
          }}
          gap="36px"
        >
          <Grid
            item
            sx={{
              width: 420,
              height: 420,
              borderRadius: "20px",
              backgroundColor: theme.palette.background.default,
              padding: "24px",
            }}
          >
            <HomeCircularGraphSection />
          </Grid>
          <Grid
            item
            sx={{
              width: maxWidth900 ? "100%" : "calc(100% - 456px)",
              height: 420,
              borderRadius: "20px",
              backgroundColor: theme.palette.background.default,
              padding: "24px",
            }}
          >
            <Typography
              sx={{
                color: additionalColors.homeCardTitleColor,
                fontWeight: "bold",
              }}
            >
              New Collection
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: additionalColors.homeCardSubtitleColor }}
            >
              Create your NFT collection
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Image
                src="/home-collection.svg"
                alt="image"
                width={420}
                height={300}
                objectFit="contain"
                objectPosition="center"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={async () => {
                  try {
                    setPageLoading(true);
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
                    setPageLoading(false);
                  } catch (e) {
                    toast.error("Something went wrong");
                  }
                }}
              >
                Start Here
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          container
          sx={{
            borderRadius: `20px`,
            backgroundColor: theme.palette.background.default,
            width: "100%",
            padding: "24px",
          }}
          gap="36px"
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                color: additionalColors.homeCardTitleColor,
                fontWeight: "bold",
              }}
            >
              My Collections
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: additionalColors.homeCardSubtitleColor }}
            >
              My Previous NFT Collection
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {collections.slice(0, 4).map(({ metadata, _id }: any) => {
              return (
                <ProjectCard
                  projectNumber={_id}
                  projectName={metadata.namePrefix}
                  description={"Description"}
                  imageUrl={
                    metadata &&
                    metadata.frontEndConfigData &&
                    metadata.frontEndConfigData.projectThumbnail
                      ? metadata.frontEndConfigData.projectThumbnail
                      : ""
                  }
                  key={_id}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </GeneralTemplate>
  );
};

export default Home;
