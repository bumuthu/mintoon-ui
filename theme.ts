import { createTheme } from "@mui/material/styles";

// Left: #12BDE2
// Right: #3B4BDF
// Red: #E61968

const theme = createTheme({
  palette: {
    primary: {
      main: "#12BDE2",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#344767",
      light: "#909090",
      contrastText: "#F5F5F5",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F6F6F6",
    },
    text: {
      primary: "#000000DE",
      secondary: "#9C9C9C",
    },
  },
  shape: {
    borderRadius: 5,
  },
});

export const additionalColors = {
  menuIconColor: "#737373",
  menuItemTextColor: "#515151",
  homeCardTitleColor: "#6B6B6B",
  homeCardSubtitleColor: "#9E9A9A",
  circularProgressPathColor: "#DCDCDC",
  specialTextColor: "#565656",
  dividerColor: "#999999",
  otherPricingPlansCardBackgroundColor: "#E9E9E9",
  timelineSubtitleColor: "#969696",
  timelineTimeStampColor: "#636363",
  accountPageSwitch: "#353535",
  annualMonthLabelText: "#282828",
  primaryMainGradient: "linear-gradient(to right, #12bde2, #3b4bdf)"
};

export default theme;
