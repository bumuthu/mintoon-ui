import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { additionalColors } from "theme";
import Image from "next/image";
import DayEvents from "./day-events";
import { HistoryDetailsType } from "types";

const Timeline = ({
  history,
}: {
  history: { [key: string]: HistoryDetailsType[] };
}) => {
  return (
    <Box width="100%" sx={{ marginX: "32px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Typography
          variant="caption"
          sx={{ color: additionalColors.homeCardSubtitleColor }}
        >
          Activity History
        </Typography>
      </Box>
      {Object.keys(history).map((item, key) => {
        return <DayEvents events={history[item]} day={item} key={key} />;
      })}
    </Box>
  );
};

export default Timeline;
