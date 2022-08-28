import React from "react";
import Image from "next/image";
import { Box, Grid, Typography, useTheme } from "@mui/material";

const defaultProps = {
  isBackgroundShown: true
}

const YourPlanCard = ({
  packageType,
  myPackage,
  collectionsLimit,
  collectionSize,
  customerSupportType,
  validUntill,
  isBackgroundShown,
}: {
  packageType: string;
  myPackage: string;
  collectionsLimit: number | string;
  collectionSize: number;
  customerSupportType: string;
  validUntill: string;
  isBackgroundShown?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: "20px",
        width: "100%",
        height: "100%",
        backgroundImage: isBackgroundShown ? `url(/${packageType}.svg)` : undefined,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Image
        src="/MINT.svg"
        alt="mint"
        layout="fill"
        objectPosition={"50px 100px"}
      />
      <Typography
        variant="h5"
        fontFamily="Amaranth"
        sx={{ color: isBackgroundShown ? theme.palette.background.default : undefined }}
      >
        You are on
      </Typography>
      <Typography
        variant="h4"
        fontFamily="Amaranth"
        sx={{ color: isBackgroundShown ? theme.palette.background.default : undefined }}
      >
        {myPackage}
      </Typography>
      <Typography
        variant="subtitle2"
        fontFamily="Amaranth"
        sx={{
          color: isBackgroundShown ? theme.palette.background.default : undefined,
          width: 300,
          textAlign: "left",
          marginTop: "48px",
        }}
      >
        You can
      </Typography>
      <Box
        sx={{
          width: 280,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src={isBackgroundShown ? "/charm_square-tick.svg" : "/charm_square-tick-grey.svg"}
              alt="tick"
              width={16}
              height={16}
            />
            <Typography
              variant="subtitle2"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              Generate upto
            </Typography>
            <Typography
              variant="h6"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              {collectionsLimit}
            </Typography>
            <Typography
              variant="subtitle2"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              Collections
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src={isBackgroundShown ? "/charm_square-tick.svg" : "/charm_square-tick-grey.svg"}
              alt="tick"
              width={16}
              height={16}
            />
            <Typography
              variant="subtitle2"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              Collection size limit of
            </Typography>
            <Typography
              variant="h6"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              {collectionSize}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src={isBackgroundShown ? "/charm_square-tick.svg" : "/charm_square-tick-grey.svg"}
              alt="tick"
              width={16}
              height={16}
            />
            <Typography
              variant="subtitle2"
              fontFamily="Amaranth"
              sx={{
                color: isBackgroundShown ? theme.palette.background.default : undefined,
                marginLeft: "4px",
              }}
            >
              {customerSupportType} customer support
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "32px",
        }}
      >
        <Typography
          variant="subtitle2"
          fontFamily="Amaranth"
          sx={{
            color: isBackgroundShown ? theme.palette.background.default : undefined,
          }}
        >
          Valid until
        </Typography>
        <Typography
          variant="h6"
          fontFamily="Amaranth"
          sx={{
            color: isBackgroundShown ? theme.palette.background.default : undefined,
          }}
        >
          {validUntill}
        </Typography>
      </Box>
    </Box>
  );
};

YourPlanCard.defaultProps = defaultProps

export default YourPlanCard;
