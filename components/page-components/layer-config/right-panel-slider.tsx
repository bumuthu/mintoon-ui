import { Box, Typography, Slider, useTheme, Skeleton } from "@mui/material";
import Input from "components/input";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ImageMetadata, ImagesType, MainColumnsDataType } from "types";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";

type Props = {
  row?: boolean;
  showLock?: boolean;
  name: string;
  percentage: number;
  initialData?: MainColumnsDataType;
  setInitialData?: Dispatch<SetStateAction<MainColumnsDataType>>;
  selectedLayer: string;
  max?: number;
  initialLoading: boolean;
  handleSliderChange?: (value: number) => void;
};

const RightPanelSlider = (props: Props) => {
  const {
    row,
    showLock,
    name,
    percentage,
    setInitialData,
    initialData,
    selectedLayer,
    max,
    initialLoading,
    handleSliderChange,
  } = props;
  const [isLocked, setIsLocked] = useState(
    initialData?.columns[selectedLayer].images[name].lock
  );
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLocked(initialData?.columns[selectedLayer].images[name].lock);
  }, [initialData?.columns, name, selectedLayer]);

  const handleChange = (value: number) => {
    let newSliderValue = value;
    if (max) {
      newSliderValue = value < max ? value : max;
    }
    if (initialData && setInitialData) {
      const imagesThatCanBeChanged = Object.values(
        initialData.columns[selectedLayer].images
      ).filter((image: any) => !image.lock);
      const imageThatCannotBeChanged = Object.values(
        initialData.columns[selectedLayer].images
      ).filter((image: any) => image.lock);
      const imagesNamesThatCanNotBeChanged = imageThatCannotBeChanged.map(
        (item) => item.name
      );

      let allocatedValue = 0;
      Object.values(imageThatCannotBeChanged).forEach((item: any) => {
        allocatedValue += item.rarity;
      });

      let otherAllocatedValue = Object.keys(imagesThatCanBeChanged).length - 1;
      const remainingPercentageForEach =
        (100 - allocatedValue - newSliderValue) / otherAllocatedValue;
      const newImages: ImagesType = {};
      Object.values(initialData.columns[selectedLayer].images).forEach(
        (item: ImageMetadata) => {
          if (item.name === name)
            newImages[item.name] = {
              ...item,
              rarity: newSliderValue,
            };
          else if (!imagesNamesThatCanNotBeChanged.includes(item.name))
            newImages[item.name] = {
              ...item,
              rarity: remainingPercentageForEach,
            };
          else newImages[item.name] = item;
        }
      );
      const newData: MainColumnsDataType = {
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
    }
  };

  const onChangeCommittedHandle = () => {
    dispatch(setOtherData(initialData));
  };
  const handleClick = () => {
    if (initialData && setInitialData) {
      const oldImages: ImagesType = initialData.columns[selectedLayer].images;
      const imagesThatCanBeChanged = Object.values(oldImages).filter(
        (image: ImageMetadata) => !image.lock && image.name !== name
      );
      const imagesThatCanBeChangedNames: string[] = imagesThatCanBeChanged.map(
        (item: ImageMetadata) => item.name
      );
      const imageThatCannotBeChanged = Object.values(oldImages).filter(
        (image: ImageMetadata) => image.lock || image.name === name
      );

      let allocatedValue = 0;
      Object.values(imageThatCannotBeChanged).forEach((item: ImageMetadata) => {
        allocatedValue += item.rarity;
      });
      let otherAllocatedValue = Object.keys(imagesThatCanBeChanged).length;
      const remainingPercentageForEach =
        (100 - allocatedValue) / otherAllocatedValue;
      const newImages: ImagesType = {};
      Object.values(oldImages).forEach((item: ImageMetadata) => {
        if (name === item.name) {
          newImages[item.name] = { ...item, lock: !isLocked };
        } else if (imagesThatCanBeChangedNames.includes(item.name))
          newImages[item.name] = {
            ...item,
            rarity: remainingPercentageForEach,
            max: 100 - allocatedValue - otherAllocatedValue + 1,
          };
        else newImages[item.name] = item;
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
    }
    setIsLocked((prevState: any) => !prevState);
  };
  return (
    <Box sx={{ minWidth: 300, marginLeft: "16px" }}>
      {!row && (
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{
            color: `${theme.palette.secondary.main}B3`,
            marginLeft: "-16px",
            fontSize: 12,
          }}
        >
          {initialLoading ? <Skeleton sx={{ width: "20%" }} /> : name}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 40,
          marginTop: row ? undefined : "-6px",
        }}
      >
        {row && (
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{
              color: `${theme.palette.secondary.main}B3`,
              fontSize: 12,
              marginRIght: "16px",
            }}
          >
            Brightness
          </Typography>
        )}
        {initialLoading ? (
          <Skeleton sx={{ width: "40%" }} />
        ) : (
          <Slider
            defaultValue={50}
            disabled={isLocked}
            value={percentage}
            color="secondary"
            size="small"
            onChangeCommitted={(_event, value) => {
              if (typeof value === "number" && !handleSliderChange) {
                onChangeCommittedHandle();
              }
            }}
            onChange={(_event, value, _activeThumb) =>
              handleSliderChange
                ? handleSliderChange(typeof value === "number" ? value : 0)
                : handleChange(typeof value === "number" ? value : 0)
            }
            sx={{
              marginTop: "4px",
              width: "40%",
              marginLeft: row ? "16px" : undefined,
              position: "relative",
              zIndex: 2,
            }}
          />
        )}
        {initialLoading ? (
          <Skeleton
            sx={{
              width: "80px",
              marginLeft: "24px",
              marginRight: "8px",
              marginTop: row ? "8px" : undefined,
              minHeight: undefined,
            }}
          />
        ) : (
          <Input
            type={"number"}
            name={"layerRarity"}
            placeholder={""}
            containerStyle={{
              width: "80px",
              marginLeft: "24px",
              marginRight: "8px",
              marginTop: row ? "8px" : undefined,
              minHeight: undefined,
            }}
            disabled={isLocked}
            inputStyle={{
              fontSize: 12,
              padding: "4px 8px",
            }}
            value={typeof percentage === "number" ? percentage.toFixed(1) : "0"}
            min={0}
            onChange={(event: any) => {
              const value = event.target.value == '' ? 0 : event.target.value;
              const floatValue = parseFloat(parseFloat(value).toFixed(1))
              handleSliderChange
                ? handleSliderChange(floatValue)
                : handleChange(floatValue);
            }}
            onBlur={
              !handleSliderChange ? () => onChangeCommittedHandle() : undefined
            }
          />
        )}
        {showLock &&
          !initialData?.columns[selectedLayer].images[name]
            .onlyOneInTheList && (
            <Box onClick={handleClick}>
              {isLocked ? (
                <LockIcon fontSize="small" />
              ) : (
                <LockOpenIcon fontSize="small" />
              )}
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default RightPanelSlider;
