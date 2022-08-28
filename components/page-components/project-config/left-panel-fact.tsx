import { Box, Typography, useTheme } from "@mui/material";
import IOSSwitch from "components/ios-switch";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Metadata } from "types";

type Props = {
  attribute: string;
  type: string;
  metaData: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
};

const LeftPanelFact = (props: Props) => {
  const { attribute, type, metaData, setMetadata } = props;
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    const newDefaultMetadata = [...metaData.defaultMetadata];
    if (event.target.checked && !newDefaultMetadata.includes(attribute))
      newDefaultMetadata.push(attribute);
    else newDefaultMetadata.splice(newDefaultMetadata.indexOf(attribute), 1);
    setMetadata({ ...metaData, defaultMetadata: newDefaultMetadata });
  };
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "280px",
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <IOSSwitch
        sx={{
          "& .MuiSwitch-track": {
            backgroundColor: theme.palette.grey[300],
          },
        }}
        checked={checked}
        onChange={handleChange}
      />
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", marginLeft: "8px", width: 140 }}
        color={
          checked ? theme.palette.text.primary : theme.palette.text.secondary
        }
      >
        {attribute}
      </Typography>
      <Box
        sx={{
          borderRadius: `4px`,
          border: `1px solid ${
            checked ? theme.palette.text.primary : theme.palette.text.secondary
          }`,
          justifySelf: "flex-end",
          width: 72,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "400", margin: "0 8px", textAlign: "center" }}
          color={
            checked ? theme.palette.text.primary : theme.palette.text.secondary
          }
        >
          {type}
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftPanelFact;
