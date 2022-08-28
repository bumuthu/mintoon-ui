import { styled } from "@mui/material/styles";
import { CircularProgress, useTheme, ButtonProps } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ReactNode } from "react";

const StyledButton = styled(LoadingButton)(() => ({
  width: "100%",
  backgroundImage: "linear-gradient(310deg, rgb(20, 23, 39), rgb(58, 65, 111))",
  marginTop: "32px",
  color: "white",
  textTransform: "none",
}));

type Props = {
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
};

const CustomButton = (props: Props) => {
  const { loading, children, onClick, fullWidth } = props;
  const theme = useTheme();
  return (
    <StyledButton
      fullWidth={fullWidth}
      loading={loading}
      loadingIndicator={
        <CircularProgress
          sx={{ color: theme.palette.secondary.contrastText }}
          size={16}
        />
      }
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default CustomButton;
