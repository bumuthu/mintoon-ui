import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import Image from "next/image";
import { previewMetadata } from "types";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation, Swiper as SwiperType } from "swiper";

const CenterPanelPreview = ({
  previewImages,
  handleAutoPlay,
}: {
  previewImages: previewMetadata[];
  handleAutoPlay?: (swiper: SwiperType) => void;
}) => {
  const theme = useTheme();
  return (
    <div
      id="center-panel-container"
      style={{
        padding: "20px 52px",
        width: "calc(100vw - 840px)",
        marginLeft: "52px",
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Preview</Typography>
        <Typography
          variant="subtitle2"
          textAlign="end"
          fontWeight={600}
          sx={{ color: `${theme.palette.secondary.main}80` }}
        >
          6 Layers
        </Typography>
      </Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
        gap="12px"
      >
        <Box
          sx={{
            height: 500,
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {previewImages.length ? (
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              style={{ width: "100%", height: "100%" }}
              onAutoplay={handleAutoPlay}
              onSlideChange={handleAutoPlay}
            >
              {previewImages.map((item, key) => {
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
                    <Box sx={{width: 400, height: 400, backgroundImage: `url(data:image/png;base64,${item.image})`, 
                    backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: theme.palette.text.secondary }}
            >
              No images to preview
            </Typography>
          )}
        </Box>
      </Grid>
    </div>
  );
};

export default CenterPanelPreview;
