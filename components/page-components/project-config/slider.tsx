import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "react-toastify";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./Slider.module.css";
import { RootState } from "store";
import { Box, Typography, useTheme } from "@mui/material";
import { getProjectPreviewImage, startPreview } from "@mintoven/art-engine";
import {
  setConfigData,
  setOtherData,
  setPreviewImages,
} from "store/slices/config-slice";

const Slider = () => {
  const theme = useTheme();
  const [images, setImages] = useState<any[]>([]);
  const dispatch = useDispatch();
  const { previewImages, configData, otherData } = useSelector(
    (state: RootState) => state.configuration
  );
  React.useEffect(() => {
    setImages(previewImages);
    if (!previewImages.length) {
      try {
        startPreview(configData, setImages, true);
      } catch (e) {
        toast.error("Library error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImages]);
  useEffect(() => {
    if (!previewImages.length && images.length === 10) {
      dispatch(setPreviewImages(images));
      const image = document.createElement('img')
      image.src = `data:image/png;base64,${images[0].image}`
      image.onload = function() {
        getProjectPreviewImage(
          images.slice(0, 5).map((item) => `data:image/png;base64,${item.image}`), image.width, image.height
        ).then((collectionImage) => {
          dispatch(
            setOtherData({
              ...otherData,
              projectThumbnail: `data:image/gif;base64,${collectionImage.image}`,
            })
          );
          dispatch(
            setConfigData({
              ...configData,
              frontEndConfigData: {
                ...configData.frontEndConfigData,
                projectThumbnail: `data:image/gif;base64,${collectionImage.image}`,
              },
            })
          );
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);
  return (
    <>
      {images.length > 2 ? (
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={5}
          coverflowEffect={{
            rotate: 7.5,
            stretch: 0,
            depth: 0.5,
            modifier: 1.25,
            scale: 0.75,
            slideShadows: false
          }}
          autoplay={{
            delay: 500,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
        >
          {images.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index} style={{ width: 170, height: 170, borderRadius: "20px" }}>
                <Box sx={{
                  width: 170, height: 170, borderRadius: "20px"
                }} >
                  <img 
                  src={`data:image/png;base64,${item.image}`} 
                  alt='slider-image' style={{ borderRadius: "20px", 
                  objectFit: 'contain', 
                  objectPosition: 'center', 
                  width: '100%' }} />
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: theme.palette.text.secondary }}
          >
            No images to preview
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Slider;
