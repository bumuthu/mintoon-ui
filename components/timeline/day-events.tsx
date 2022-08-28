import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { additionalColors } from "theme";
import Image from "next/image";
import { HistoryDetailsType } from "types";
import { capitalizeFirstLetter, getDateStringForTimestamp } from "../../utils";

const DayEvents = ({
  events,
  day,
}: {
  day: string;
  events: HistoryDetailsType[];
}) => {
  const iconMapping = {
    GENERAL_EVENT: "/general-event.svg",
    PRICING_UPGRADE_EVENT: "/pricing-upgrade-event.svg",
    PRICING_DOWNGRADE_EVENT: "/pricing-downgrade-event.svg",
    COLLECTION_SUCCESS_EVENT: "/collection-success-event.svg",
    COLLECTION_FAILED_EVENT: "/collection-failed-event.svg",
  };
  return (
    <Box sx={{ marginBottom: "24px" }}>
      <Typography
        fontWeight="bold"
        sx={{ color: additionalColors.homeCardSubtitleColor }}
      >
        {day}
      </Typography>
      <Box sx={{ display: "flex", marginTop: "16px" }}>
        <Divider orientation="vertical" flexItem sx={{ marginLeft: "18px" }} />
        <Box sx={{ marginLeft: "48px", width: "calc(100% - 57px)" }}>
          {events.map((item, key) => {
            return (
              <Box
                sx={{ display: "flex", marginBottom: "24px", width: "100%" }}
                key={key}
              >
                <Image
                  src={iconMapping[item.eventType]}
                  alt="collection-success-event"
                  width={42}
                  height={42}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "40px",
                    width: "calc(100% - 82px)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "70%"
                    }}
                  >
                    {item.title && <Typography fontWeight="bold">{item.title}</Typography>}
                    {item.eventType === "COLLECTION_SUCCESS_EVENT" && <Typography fontWeight="bold">Successful Collection</Typography>}
                    {item.eventType === "COLLECTION_FAILED_EVENT" && <Typography fontWeight="bold">Failed Collection</Typography>}
                    {item.eventType === "PRICING_UPGRADE_EVENT" && <Typography fontWeight="bold">Pricing Plan Upgraded to {capitalizeFirstLetter(item.pricingPlanName!)}</Typography>}
                    {item.eventType === "PRICING_DOWNGRADE_EVENT" && <Typography fontWeight="bold">Pricing Plan Downgraded to {capitalizeFirstLetter(item.pricingPlanName!)}</Typography>}
                    {item.description && <Typography
                      sx={{ color: additionalColors.timelineSubtitleColor }}
                    >
                      {item.description}
                    </Typography>}
                    {item.outputsCount && <Typography
                      sx={{ color: additionalColors.timelineSubtitleColor }}
                    >
                      {`Output Count: ${item.outputsCount}`}
                    </Typography>}
                    {item.failureReason && <Typography
                      sx={{ color: additionalColors.timelineSubtitleColor }}
                    >
                      {`Failure Reason: ${item.failureReason}`}
                    </Typography>}
                    {item.planValidTill && <Typography
                      sx={{ color: additionalColors.timelineSubtitleColor }}
                    >
                      {`Valid Until: ${getDateStringForTimestamp(item.planValidTill)}`}
                    </Typography>}
                    {item.reason && <Typography
                      sx={{ color: additionalColors.timelineSubtitleColor }}
                    >
                      {`Reason: ${item.reason}`}
                    </Typography>}
                  </Box>
                  <Typography
                    display="flex" justifyContent="flex-end"
                    sx={{
                      color: additionalColors.timelineTimeStampColor,
                      fontSize: 11,
                      width: "30%",
                      justifyContent: "flex-end"
                    }}
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(item.timestamp)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default DayEvents;
