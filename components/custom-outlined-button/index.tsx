import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress, Skeleton, useTheme } from "@mui/material";

type Props = {
  loading?: boolean;
  skeletonLoading?: boolean;
  disabled?: boolean;
  variant?: "text" | "outlined" | "contained";
  buttonText: string;
  sx?: object;
  onlySx?: object;
  onClick?: () => void;
};

const CustomOutlinedButton = (props: Props) => {
  const {
    buttonText,
    sx,
    onClick,
    loading,
    variant,
    onlySx,
    disabled,
    skeletonLoading,
  } = props;
  const theme = useTheme();
  return skeletonLoading ? (
    <Skeleton sx={{ width: 100, marginX: "6px" }} variant="rectangular" />
  ) : (
    <LoadingButton
      variant={variant || "outlined"}
      loading={loading}
      loadingIndicator={
        <CircularProgress
          sx={{ color: theme.palette.secondary.main }}
          size={16}
        />
      }
      fullWidth
      sx={
        onlySx || {
          "&.MuiButton-root": {
            color: "rgb(52, 71, 103)",
            marginTop: 2,
            border: "2px solid rgb(52, 71, 103)",
            fontWeight: 700,
            textTransform: "none",
            height: "38.5px",
            ...sx,
          },
        }
      }
      onClick={onClick}
      disabled={disabled}
    >
      {!loading && buttonText}
    </LoadingButton>
  );
};

export default CustomOutlinedButton;
