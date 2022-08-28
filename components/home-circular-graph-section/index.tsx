import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { additionalColors } from "theme";

const defaultProps = {
  showMainTitle: true,
};

const HomeCircularGraphSection = ({
  showMainTitle,
}: { showMainTitle?: boolean } & typeof defaultProps) => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);
  const collectionsAttemptsUsed =
    user && user.collectionAttemptsUsed ? user.collectionAttemptsUsed : 0;
  const currentPlanAttemptsLimit =
    useSelector(
      (state: RootState) =>
        state.user.currentPlan.features.COLLECTION_GENERATION_ATTEMPTS.value
    ) || 0;
  const {currentPlan} = useSelector((state: RootState) => state.user)  
  const percentage =
    collectionsAttemptsUsed !== 0 &&
    currentPlanAttemptsLimit !== 0 &&
    typeof collectionsAttemptsUsed === "number"
      ? Math.round((collectionsAttemptsUsed * 100) / currentPlanAttemptsLimit)
      : 0;
  return (
    <>
      {showMainTitle && (
        <Typography
          sx={{
            color: additionalColors.homeCardTitleColor,
            fontWeight: "bold",
          }}
        >
          Attempts
        </Typography>
      )}
      <Typography
        variant="caption"
        sx={{ color: additionalColors.homeCardSubtitleColor }}
      >
        Monthly Collection Attempts
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "32px",
        }}
      >
        <Box style={{ width: 200, height: 200, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: additionalColors.specialTextColor,
              }}
            >
              {percentage}%
            </Typography>
            <Typography
              sx={{
                fontWeight: "thin",
                color: additionalColors.homeCardSubtitleColor,
              }}
              variant="h6"
            >
              Used
            </Typography>
          </Box>
          <CircularProgressbar
            value={percentage}
            strokeWidth={16}
            styles={buildStyles({
              pathColor: additionalColors.circularProgressPathColor,
              trailColor: theme.palette.primary.main,
            })}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: 80,
          display: "flex",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingX: "16px",
            width: "40%",
            borderRight: `1px solid ${additionalColors.dividerColor}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: additionalColors.specialTextColor,
            }}
          >
            {collectionsAttemptsUsed || 0}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: additionalColors.homeCardSubtitleColor,
              fontSize: "10px",
            }}
          >
            Attempts used
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingX: "16px",
            width: "40%",
          }}
        >
          <Typography
            variant={currentPlan.displayName === 'PREMIUM' ? "h6" : "h2"}
            sx={{
              fontWeight: "bold",
              color: additionalColors.specialTextColor,
            }}
          >
            {currentPlan.displayName === 'PREMIUM' ? 'Unlimited' : currentPlanAttemptsLimit - collectionsAttemptsUsed}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              color: additionalColors.homeCardSubtitleColor,
              fontSize: "10px",
            }}
          >
            Attempts left
          </Typography>
        </Box>
      </Box>
    </>
  );
};

HomeCircularGraphSection.defaultProps = defaultProps;

export default HomeCircularGraphSection;
