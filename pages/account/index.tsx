import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import YourPlanCard from "components/your-plan-card";
import React, { useEffect, useState } from "react";
import GeneralTemplate from "templates/general";
import OtherPricePlanCard from "components/other-price-plan-card";
import HomeCircularGraphSection from "components/home-circular-graph-section";
import Timeline from "components/timeline";
import app from "api/modules/app";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import IOSSwitch from "components/ios-switch";
import { additionalColors } from "theme";
import { HistoryDetailsType } from "types";
import { motion } from "framer-motion";
import { setUser } from "store/slices/user-slice";
import { capitalizeFirstLetter, getDateStringForTimestamp } from "../../utils";

type Plan = {
  anualDiscount: number;
  anualOriginalPrice: number;
  anualPrice: number;
  description: string;
  displayName: string;
  features: {
    COLLECTION_GENERATION_ATTEMPTS: { description: string; value: number };
    MAX_IMAGES_PER_COLLECTION: { description: string; value: number };
    CUSTOMER_SUPPORT: { description: string; value: string };
  };
  monthlyDiscount: number;
  monthlyOriginalPrice: number;
  monthlyPrice: number;
};

const placeHolderPlan = {
  anualDiscount: 0,
  anualOriginalPrice: 0,
  anualPrice: 0,
  description: "Start learning the tool",
  displayName: "FREE",
  features: {
    COLLECTION_GENERATION_ATTEMPTS: { description: "", value: 0 },
    MAX_IMAGES_PER_COLLECTION: { description: "", value: 0 },
    CUSTOMER_SUPPORT: { description: "", value: "" },
  },
  monthlyDiscount: 0,
  monthlyOriginalPrice: 0,
  monthlyPrice: 0,
};

const getDate = (timestamp?: number) => {
  let today = new Date();
  if (timestamp) today = new Date(timestamp);
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = today.getMonth();
  let yyyy = today.getFullYear();

  return (
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(mm) +
    "/" +
    dd +
    "/" +
    yyyy
  );
};

const Account = () => {
  const theme = useTheme();
  const plans = useSelector((state: RootState) => state.user.plans) || {
    FREE: placeHolderPlan,
    STANDARD: placeHolderPlan,
    PREMIUM: placeHolderPlan,
  };
  const currentPlan =
    useSelector((state: RootState) => state.user.currentPlan) ||
    placeHolderPlan;
  const user = useSelector((state: RootState) => state.user.user);
  const history: { [key: string]: HistoryDetailsType[] } = {};
  const maxWidth900 = useMediaQuery("(max-width:900px)");
  user && user.history
    ? user.history.map((item: any) => {
      const date = getDate(item.timestamp);
      const today = getDate();
      const dateArray = date.split("/");
      const todayArray = today.split("/");
      if (dateArray[0] === todayArray[0] && dateArray[2] === todayArray[2]) {
        if (dateArray[1] === todayArray[1])
          history["Today"] = history["Today"]
            ? [...history["Today"], item]
            : [item];
        else if (parseInt(dateArray[1]) === parseInt(todayArray[1]) - 1)
          history["Yesterday"] = history["Yesterday"]
            ? [...history["Yesterday"], item]
            : [item];
        else
          history[`${dateArray[1]} ${dateArray[0].slice(0, 3)}`] = history[
            `${dateArray[1]} ${dateArray[0].slice(0, 3)}`
          ]
            ? [
              ...history[`${dateArray[1]} ${dateArray[0].slice(0, 3)}`],
              item,
            ]
            : [item];
      } else if (dateArray[2] === todayArray[2])
        history[`${dateArray[1]} ${dateArray[0].slice(0, 3)}`] = history[
          `${dateArray[1]} ${dateArray[0].slice(0, 3)}`
        ]
          ? [...history[`${dateArray[1]} ${dateArray[0].slice(0, 3)}`], item]
          : [item];
      else
        history[
          `${dateArray[1]} ${dateArray[0].slice(0, 3)} ${dateArray[2]}`
        ] = history[
          `${dateArray[1]} ${dateArray[0].slice(0, 3)} ${dateArray[2]}`
        ]
            ? [
              ...history[
              `${dateArray[1]} ${dateArray[0].slice(0, 3)} ${dateArray[2]}`
              ],
              item,
            ]
            : [item];
    })
    : [];
  const [checked, setChecked] = useState(false);
  const [annualMonthLabelText, setAnnualMonthLabelText] = useState("Annually");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setAnnualMonthLabelText(event.target.checked ? "Annually" : "Monthly");
  };

  // In case, a payment was successful and the user callback was not called.
  const [startedCheckoutFail, setStartedCheckoutFail] = useState(false);
  const userData = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const lastPaymentHistory = (user.paymentHistory && user.paymentHistory.length != 0)
    ? user.paymentHistory[user.paymentHistory.length - 1]
    : { status: "" };
  useEffect(() => {
    if (
      startedCheckoutFail == false &&
      ["IN_PROGRESS", "USER_UPDATE_FAILED"].includes(lastPaymentHistory.status)
    ) {
      console.log("Calling account upgrade");
      setStartedCheckoutFail(true);
      app.checkoutComplete().then(([{ status }, payload]) => {
        console.log("User after payment complete:", payload.payload);
        dispatch(setUser({ ...userData, ...payload.payload }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <GeneralTemplate>
      <Grid
        container
        item
        gap="36px"
        width="100%"
        component={motion.div}
        layout
      >
        <Grid
          item
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: "20px",
            width: maxWidth900 ? "100%" : 420,
            display: "flex",
            alignItems: "center",
          }}
        >
          <YourPlanCard
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
              user.planValidTill
                ? getDateStringForTimestamp(user.planValidTill)
                : "never expires"
            }
          />
        </Grid>
        <Grid
          item
          container
          sx={{
            padding: "20px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "20px",
            minHeight: 460,
            width: maxWidth900 ? "100%" : "calc(100% - 456px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          component={motion.div}
        >
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                fontFamily="Amaranth"
                sx={{
                  color: additionalColors.annualMonthLabelText,
                  marginBottom: "4px",
                }}
              >
                {annualMonthLabelText}
              </Typography>
              <IOSSwitch
                sx={{
                  "& .MuiSwitch-track": {
                    backgroundColor: additionalColors.accountPageSwitch,
                  },
                }}
                checked={checked}
                onChange={handleChange}
              />
            </Box>
          </Grid>
          {Object.values(plans).map((item, key) => {
            return (
              item.displayName !== "FREE" && (
                <OtherPricePlanCard
                  isAnnual={checked}
                  packageName={`${item.displayName || ""} PACKAGE`}
                  packageType={item.displayName}
                  collectionsLimit={
                    item.features
                      ? item.features.COLLECTION_GENERATION_ATTEMPTS.unlimited
                        ? 'unlimited'
                        : item.features.COLLECTION_GENERATION_ATTEMPTS.value
                      : 0
                  }
                  collectionSize={
                    item.features
                      ? item.features.MAX_IMAGES_PER_COLLECTION.value
                      : 0
                  }
                  customerSupportType={
                    item.features ? item.features.CUSTOMER_SUPPORT.value : ""
                  }
                  annualDiscount={
                    item[
                      checked ? "anualDiscount" : "monthlyDiscount"
                    ].toString() || ""
                  }
                  annualOriginalPrice={
                    item[
                      checked ? "anualOriginalPrice" : "monthlyOriginalPrice"
                    ].toString() || ""
                  }
                  annualPrice={
                    item[checked ? "anualPrice" : "monthlyPrice"].toString() ||
                    ""
                  }
                  badgeUrl={`/badge-${item.displayName.toLowerCase() || ""
                    }.svg`}
                  key={key}
                />
              )
            );
          })}
        </Grid>
        <Grid
          item
          container
          sx={{
            padding: "20px",
            paddingRight: "10px",
            paddingLeft: "10px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "20px",
            minHeight: 460,
            width: maxWidth900 ? "100%" : "calc(100% - 496px)",
            maxHeight: 600,
            overflowY: "auto",
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
          <Timeline history={history} />
        </Grid>
        <Grid
          item
          container
          sx={{
            padding: "20px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "20px",
            minHeight: 460,
            width: maxWidth900 ? "100%" : 460,
          }}
        >
          <HomeCircularGraphSection showMainTitle={false} />
        </Grid>
      </Grid>
    </GeneralTemplate>
  );
};

export default Account;
