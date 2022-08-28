import { Box, Button, CircularProgress, Skeleton, useTheme } from "@mui/material";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { ReactNode } from "react";

const OutlinedLoadingButton = ({
  style,
  loading,
  loadingElement,
  buttonText,
  onClick,
  variant,
  disabled,
  containerStyle,
  skeletonLoading,
}: {
  buttonText: string;
  style?: object;
  loading?: boolean;
  loadingElement?: ReactNode;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  containerStyle?: object;
  skeletonLoading?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{ width: "100%", ...containerStyle }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {skeletonLoading ? (
        <Skeleton
          variant="rectangular"
          sx={{
            minWidth: 100,
            marginX: "6px",
          }}
        />
      ) : (
        <Button
          sx={{
            "&.MuiButton-outlined": {
              height: 26,
              fontSize: 14,
              borderRadius: "5px",
              borderWidth: "1px",
              borderColor: theme.palette.primary.main,
              fontWeight: "bold",
              padding: 0,
              minWidth: 100,
              ...style,
            },
            "&.MuiButton-contained": {
              height: 26,
              fontSize: 14,
              borderRadius: "5px",
              borderWidth: "2px",
              fontWeight: "bold",
              padding: 0,
              minWidth: 100,
              ...style,
            },
            "&.Mui-disabled": {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[300]
            }
          }}
          variant={variant || "outlined"}
          onClick={onClick}
          disabled={disabled}
        >
          {!loading && !skeletonLoading ? buttonText : loadingElement ||
            <CircularProgress
              sx={{ color: theme.palette.secondary.contrastText }}
              size={16}
            />}
        </Button>
      )}
    </Box>
  );
};

export default OutlinedLoadingButton;
