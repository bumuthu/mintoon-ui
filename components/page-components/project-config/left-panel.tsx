import {
  Box,
  Grid,
  Typography,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import LeftPanelFact from "components/page-components/project-config/left-panel-fact";
import Input from "components/input";
import { CustomMetadataType, Metadata } from "types";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';

type Props = {
  metaData: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
};

const LeftPanel = (props: Props) => {
  const { metaData, setMetadata } = props;
  const [customMetadata, setCustomMetadata] = useState([
    ...metaData.customMetadata,
  ]);
  const theme = useTheme();
  const maxWidth1200 = useMediaQuery("(max-width:1300px)");
  const handleAddCustomMetadataButtonPress = () => {
    const newCustomMetadata = [...customMetadata, { key: "", value: "", type: "Text" }];
    setCustomMetadata(newCustomMetadata as CustomMetadataType[]);
  };
  const handleRemoveCustomMetadataButtonPress = (index: number) => {
    const newCustomMetadata = [...customMetadata];
    newCustomMetadata.splice(index, 1);
    setCustomMetadata(newCustomMetadata);
    setMetadata({ ...metaData, customMetadata: newCustomMetadata });
  };
  const handleKeyInputChange = (index: number, value: string) => {
    const newCustomMetadata = [...customMetadata];
    newCustomMetadata[index] = { ...newCustomMetadata[index], key: value };
    setCustomMetadata(newCustomMetadata);
  };
  const handleValueInputChange = (index: number, value: string) => {
    const newCustomMetadata = [...customMetadata];
    newCustomMetadata[index] = { ...newCustomMetadata[index], value: value };
    setCustomMetadata(newCustomMetadata);
  };
  const handleTypeInputChange = (index: number, value: "Text" | "Number") => {
    const newCustomMetadata = [...customMetadata];
    newCustomMetadata[index] = { ...newCustomMetadata[index], type: value };
    setCustomMetadata(newCustomMetadata);
  };
  const handleBlur = () => {
    setMetadata({ ...metaData, customMetadata: customMetadata });
  };
  return (
    !maxWidth1200 ? <Grid
      sx={{
        justifyContent: "center",
        width: maxWidth1200 ? "100%" : undefined,
        display: "flex",
      }}
    >
      <Box
        sx={{
          padding: "32px",
          width: 520,
          minHeight: "calc(100vh - 376px)",
          backgroundColor: theme.palette.background.default,
          borderRadius: `${theme.shape.borderRadius}px`,
          height: 'calc(100vh - 350px)',
          overflowY: 'auto',
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
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          Metadata Configuration
        </Typography>
        <Box
          sx={{
            padding: "16px",
            paddingBottom: 0,
            marginTop: "16px",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Default Attributes
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <LeftPanelFact
              attribute="edition"
              type="Number"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="name"
              type="Text"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="description"
              type="Text"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="dna"
              type="Text"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="date"
              type="Number"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="attributes"
              type="Object"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="compiler"
              type="Text"
              metaData={metaData}
              setMetadata={setMetadata}
            />
            <LeftPanelFact
              attribute="project-url"
              type="Text"
              metaData={metaData}
              setMetadata={setMetadata}
            />
          </Box>
        </Box>
        <Box
          sx={{
            padding: "0 16px",
            marginTop: "8px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Custom Attributes
            </Typography>
            <IconButton
              size="small"
              onClick={handleAddCustomMetadataButtonPress}
            >
              <PlaylistAddOutlinedIcon
                sx={{ color: theme.palette.text.primary }}
              />
            </IconButton>
          </Box>
          {customMetadata.map((item, index) => {
            return (
              <Box
                sx={{
                  backgroundColor: `${theme.palette.background.paper}CC`,
                  borderRadius: `${theme.shape.borderRadius}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  marginTop: "8px",
                }}
                key={index}
              >
                <Input
                  name="key"
                  placeholder="Enter key"
                  type="text"
                  value={item.key}
                  onChange={(e) => handleKeyInputChange(index, e.target.value)}
                  onBlur={() => handleBlur()}
                  containerStyle={{
                    width: 140,
                    minHeight: undefined,
                    marginBottom: 0,
                  }}
                />
                <Box
                  sx={{
                    borderRadius: `4px`,
                    border: `1px solid ${theme.palette.text.primary}`,
                    justifySelf: "flex-end",
                    width: 72,
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleTypeInputChange(
                      index,
                      item.type === "Text" ? "Number" : "Text"
                    )
                  }
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "400",
                      margin: "0 8px",
                      textAlign: "center",
                    }}
                  >
                    {item.type}
                  </Typography>
                </Box>
                <Input
                  name="value"
                  placeholder="Value"
                  type={item.type || "Text"}
                  value={item.value}
                  onChange={(e) =>
                    handleValueInputChange(index, e.target.value)
                  }
                  onBlur={() => handleBlur()}
                  containerStyle={{
                    width: 140,
                    minHeight: undefined,
                    marginBottom: 0,
                    marginLeft: "8px",
                  }}
                />
                {customMetadata.length > 1 ? (
                  <IconButton
                    onClick={() => handleRemoveCustomMetadataButtonPress(index)}
                    sx={{ padding: 0, alignSelf: "flex-start" }}
                  >
                    <CloseOutlinedIcon
                      sx={{ fontSize: 10, color: theme.palette.text.primary }}
                    />
                  </IconButton>
                ) : null}
              </Box>
            );
          })}
        </Box>
        {/* <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "24px" }}
      >
        <OutlinedLoadingButton
          variant="contained"
          buttonText="Regenerate Metadata"
          style={{ minWidth: 240 }}
          containerStyle={{ display: "flex", justifyContent: "center" }}
        />
      </Box> */}
      </Box>
    </Grid> : null
  );
};

export default LeftPanel;
