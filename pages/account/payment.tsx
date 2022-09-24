import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import YourPlanCard from "components/your-plan-card";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "store";
import { setUser } from "store/slices/user-slice";
import GeneralTemplate from "templates/general";
import { additionalColors } from "theme";
import app from "../../api/modules/app";
import { capitalizeFirstLetter, getDateStringForTimestamp } from "../../utils";

const Payment = () => {
  const [started, setStarted] = useState(false);
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch();
  let userData = useSelector((state: RootState) => state.user.user);
  let currentPlan = useSelector((state: RootState) => state.user.currentPlan);
  useEffect(() => {
    if (started == false) {
      setStarted(true);
      app
        .checkoutComplete()
        .then(([{ status }, payload]) => {
          console.log("User after payment complete:", payload.payload)
          dispatch(setUser({ ...userData, ...payload.payload }));
          currentPlan = payload.payload.currentPlan;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigateHome = () => {
    router.push('/account')
  }

  return (
    <GeneralTemplate>
      {
        router.query && router.query.success === 'true' ?
          <Grid
            item
            sx={{
              borderRadius: `${theme.shape.borderRadius}px`,
              backgroundColor: theme.palette.background.default,
              height: "calc(100vh - 130px)",
              width: "100%",
              padding: "16px 36px",
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Typography variant='h2' fontFamily='Amaranth'>Congratulations!</Typography>
              <Box sx={{ display: 'flex', marginTop: "2%" }}>
                <Image width={474} height={376} src='/success.svg' alt='congratulation-svg' />
                <YourPlanCard
                  isBackgroundShown={false}
                  packageType={(currentPlan.displayName || "").toLowerCase()}
                  myPackage={`${currentPlan.displayName || ""} PACKAGE`}
                  collectionsLimit={
                    currentPlan.features
                      ? currentPlan.features.COLLECTION_GENERATION_ATTEMPTS.value
                      : 0
                  }
                  collectionSize={
                    currentPlan.features
                      ? currentPlan.features.MAX_IMAGES_PER_COLLECTION.value
                      : 0
                  }
                  customerSupportType={
                    currentPlan.features
                      ? capitalizeFirstLetter(currentPlan.features.CUSTOMER_SUPPORT.value)
                      : ""
                  }
                  validUntill={
                    userData.planValidTill
                      ? getDateStringForTimestamp(userData.planValidTill)
                      : "never expires"
                  }
                />
              </Box>
              <Button 
              variant="outlined" 
              color="primary"
              onClick={navigateHome}
              sx={{
                "&.MuiButton-outlined": {
                  width: 150,
                  marginTop: "40px"
                }
              }}
              >Continue</Button>
            </Box>
          </Grid> :
          router.query && router.query.canceled === 'true' ?
            <Grid
              item
              sx={{
                borderRadius: `${theme.shape.borderRadius}px`,
                backgroundColor: theme.palette.background.default,
                height: "calc(100vh - 130px)",
                width: "100%",
                padding: "16px 36px",
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Typography variant='h2' fontFamily='Amaranth'>Ops!</Typography>
                <Typography variant='h6' fontFamily='Amaranth' sx={{color: theme.palette.text.secondary, marginBottom: '80px'}}>Payment was rejected!</Typography>
                <Image width={386} height={250} src='/rejected.svg' alt='congratulation-svg' />
                <Button 
                variant="outlined" 
                color="primary" 
                onClick={navigateHome}
                sx={{
                  "&.MuiButton-outlined": {
                    width: 150,
                    marginTop: '40px'
                  }
                }}>Continue</Button>
              </Box>
            </Grid> : null
      }
    </GeneralTemplate>
  );
};

export default Payment;
