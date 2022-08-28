import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Box, CircularProgress, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { additionalColors } from "theme";
import OutlinedLoadingButton from "components/outlined-loading-button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import app from "api/modules/app";
import { getNextMonth, getNextYear } from "utils";
import { useSelector } from "react-redux";
import { RootState } from "store";

const OtherPricePlanCard = ({
  packageName,
  packageType,
  collectionsLimit,
  collectionSize,
  customerSupportType,
  annualDiscount,
  annualOriginalPrice,
  annualPrice,
  badgeUrl,
  isAnnual,
}: {
  packageName: string;
  packageType: string;
  collectionsLimit: number | string;
  collectionSize: number;
  customerSupportType: string;
  annualOriginalPrice: string;
  annualPrice: string;
  annualDiscount: string;
  badgeUrl: string;
  isAnnual: boolean;
}) => {
  const theme = useTheme();
  // const [showActivateButton, setShowActivateButton] = useState(false);
  const [activeButtonLoading, setActiveButtonLoading] = useState(false)
  const lessThan1640 = useMediaQuery("(max-width:1640px)");
  const { currentPlan, user } = useSelector((state: RootState) => state.user);
  const onClickActivate = async () => {
    try {
      setActiveButtonLoading(true)
      const [{ status }, payload] = await app.checkoutPayment(
        packageType,
        isAnnual ? "ANNUALLY" : "MONTHLY",
        isPackageCurrentPlan
      );
      if (status === 200) window.location = payload.payload.redirectUrl;
      else toast.error("Something went wrong!");
    } catch (e) {
      toast.error("Something went wrong!");
    }
    finally {
      setActiveButtonLoading(false)
    }
  };
  const isEnabledActivateButton = (): boolean => {
    if (currentPlan.displayName == 'PREMIUM' && packageType == 'STANDARD') {
      return false;
    }
    return true;
  }
  const isPackageCurrentPlan = (currentPlan.displayName === packageType);
  let nextMonth: string;
  let nextYear: string;
  if (isPackageCurrentPlan) {
    nextMonth = getNextMonth(user.planValidTill);
    nextYear = getNextYear(user.planValidTill)
  } else {
    nextMonth = getNextMonth();
    nextYear = getNextYear();
  }
  return (
    <>
      <Grid
        component={motion.div}
        whileHover={{ translateY: -5 }}
        // onMouseEnter={() => setShowActivateButton(true)}
        // onMouseLeave={() => setShowActivateButton(false)}
        sx={{
          width: lessThan1640 ? "100%" : "48%",
          marginTop: "20px"
        }}
      >
        <Box
          sx={{
            backgroundColor:
              additionalColors.otherPricingPlansCardBackgroundColor,
            borderRadius: "30px",
            padding: "16px 24px",
            position: "relative",
          }}
          component={motion.div}
        >
          <Box
            width={82}
            height={54}
            style={{
              position: "absolute",
              right: 8,
              top: -4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {packageName !== "FREE PACKAGE" && (
              <Image src={badgeUrl} alt="standard" layout="fill" />
            )}
            <Typography
              variant="subtitle2"
              fontFamily="Amaranth"
              sx={{
                position: "absolute",
                color: theme.palette.background.default,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -80%)",
                zIndex: 2,
              }}
            >
              -{annualDiscount}%
            </Typography>
          </Box>
          <Typography variant="subtitle2" fontFamily="Amaranth">
            {packageName}
          </Typography>
          <Box sx={{ marginTop: "32px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/charm_square-tick-grey.svg"
                alt="tick"
                width={16}
                height={16}
              />
              <Typography
                variant="subtitle2"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                Generate {collectionsLimit === 'unlimited' ? '' : 'upto'}
              </Typography>
              <Typography
                variant="h6"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                {collectionsLimit}
              </Typography>
              <Typography
                variant="subtitle2"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                collections monthly
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/charm_square-tick-grey.svg"
                alt="tick"
                width={16}
                height={16}
              />
              <Typography
                variant="subtitle2"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                Collection size limit of
              </Typography>
              <Typography
                variant="h6"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                {collectionSize}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/charm_square-tick-grey.svg"
                alt="tick"
                width={16}
                height={16}
              />
              <Typography
                variant="subtitle2"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.menuItemTextColor,
                  marginLeft: "4px",
                }}
              >
                {customerSupportType} customer support
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "32px",
              }}
            >
              <Typography variant="subtitle2" fontFamily="Amaranth">
                Valid until
              </Typography>
              <Typography variant="h6" fontFamily="Amaranth">
                {isAnnual ? nextYear : nextMonth}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginTop: "32px",
              }}
            >
              <Typography variant="h3" fontFamily="Amaranth" fontWeight="700">
                ${annualPrice}
              </Typography>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "58%",
                    width: "100%",
                    height: "1px",
                    backgroundColor: theme.palette.text.primary,
                  }}
                />
                <Typography variant="subtitle1" fontFamily="Amaranth">
                  ${annualOriginalPrice}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <AnimatePresence>
          <OutlinedLoadingButton
            buttonText={isPackageCurrentPlan ? "Renew" : "Activate"}
            style={{
              width: "100%",
              marginTop: "12px",
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
            }}
            onClick={onClickActivate}
            loading={activeButtonLoading}
            disabled={!isEnabledActivateButton()}
            loadingElement={
              <CircularProgress
                sx={{ color: theme.palette.error.main }}
                size={16}
              />
            }
          />
        </AnimatePresence>
      </Grid>
    </>
  );
};

export default OtherPricePlanCard;
