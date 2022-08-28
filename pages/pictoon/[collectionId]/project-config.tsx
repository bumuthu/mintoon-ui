import { Box } from "@mui/system";
import React, { useState } from "react";
import AppBar from "components/page-components/layer-config/appbar";
import LeftPanel from "components/page-components/project-config/left-panel";
import RightPanel from "components/page-components/project-config/right-panel";
import Slider from "components/page-components/project-config/slider";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { MainColumnsDataType, Metadata } from "types";
import { useSelector } from "react-redux";
import { RootState } from "store";

const ProjectConfigs = () => {
  const theme = useTheme();
  const maxWidth1300 = useMediaQuery("(max-width:1300px)");
  const otherData: MainColumnsDataType = useSelector(
    (state: RootState) => state.configuration.otherData
  );
  const [initialData, setInitialData] =
    useState<MainColumnsDataType>(otherData);
  const [metaData, setMetadata] = useState<Metadata>({
    defaultMetadata: [
      "name",
      "description",
      "image",
      "dna",
      "edition",
      "date",
      "attributes",
      "compiler",
      "project-url",
    ],
    customMetadata: [{ key: "", value: "", type: "Text" }],
  });
  return (
    <Box
      sx={{
        width: "100vw",
        padding: "0 54px 72px 54px",
        minHeight: '100vh',
        height: maxWidth1300 ? undefined : "100vh",
        backgroundColor: theme.palette.background.paper,
        overFlow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar initialData={initialData} setInitialData={setInitialData} />
      <Box
        sx={{ height: 200, width: 1000, display: "flex", alignItems: "center" }}
      >
        <Slider />
      </Box>
      <Grid container columnGap="52px">
        <LeftPanel metaData={metaData} setMetadata={setMetadata} />
        <RightPanel metaData={metaData} setMetadata={setMetadata} />
      </Grid>
    </Box>
  );
};

export default ProjectConfigs;
