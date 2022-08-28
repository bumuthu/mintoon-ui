import {
  Box,
  ListItem,
  ListItemIcon,
  Typography,
  useTheme,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

type Props = {
  name: string;
  value?: string;
  width?: number;
};

const ListItemCustom = (props: Props) => {
  const { name, value, width } = props;
  const theme = useTheme();
  return (
    <ListItem
      disablePadding
      sx={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}
    >
      <ListItemIcon
        sx={{
          minWidth: 24,
          marginTop: "8px",
        }}
      >
        <CircleIcon
          sx={{
            width: 8,
            height: 8,
          }}
        />
      </ListItemIcon>
      <Box sx={{ display: "flex" }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: `${theme.palette.secondary.main}B3`,
            width: 100,
          }}
        >
          {name}
        </Typography>
        {value ? (
          <Box
            sx={{
              width: width || 182,
              backgroundColor: theme.palette.secondary.contrastText,
              padding: "4px 16px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="subtitle2" sx={{ wordWrap: "break-word" }}>
              {value}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </ListItem>
  );
};

export default ListItemCustom;
