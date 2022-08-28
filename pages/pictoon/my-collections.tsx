import { Grid, Box, useTheme, Typography } from "@mui/material";
import ProjectCard from "components/project-card";
import React, { useEffect, useState } from "react";
import GeneralTemplate from "templates/general";
import AddIcon from "@mui/icons-material/Add";
import app from "api/modules/app";
import { setCollections as setUserCollections } from "store/slices/user-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";

const MyCollections = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [collections, setCollections] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const userCollections = useSelector((state: RootState) => state.user.collections)
  useEffect(() => {
    if(!userCollections.length) setPageLoading(true);
    else setCollections(userCollections)
    app
      .getProjects()
      .then((data) => {
        if (data && data[0].status === 200) {
          const [, { payload }] = data;
          if (payload) {
            setCollections(payload);
            dispatch(setUserCollections(payload))
            setPageLoading(false);
          }
        }
      })
      .finally(() => setPageLoading(false));
  }, []);

  return (
    <GeneralTemplate loading={pageLoading}>
      <Grid
        item
        sx={{
          borderRadius: `${theme.shape.borderRadius}px`,
          backgroundColor: theme.palette.background.default,
          height: "100%",
          width: "100%",
          padding: "16px 36px",
        }}
      >
        <Box
          sx={{
            marginBottom: "36px",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.text.primary,
            }}
          >
            Projects
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {collections.map(({ metadata, _id }: any) => {
            return (
              <ProjectCard
                projectNumber={_id}
                projectName={metadata.namePrefix}
                description={"Description"}
                imageUrl={
                  metadata.frontEndConfigData
                    ? metadata.frontEndConfigData.projectThumbnail
                    : ""
                }
                key={_id}
              />
            );
          })}
          {/* <Grid item xs={12} md={6} lg={4} xl={3}>
            <Box
              sx={{
                minHeight: "390px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                borderRadius: `${theme.shape.borderRadius}px`,
                border: `2px solid ${theme.palette.background.paper}`,
                color: theme.palette.text.secondary,
              }}
            >
              <AddIcon />
              <Typography variant="subtitle2" color="inherit">
                New Project
              </Typography>
            </Box>
          </Grid> */}
        </Grid>
      </Grid>
    </GeneralTemplate>
  );
};

export default MyCollections;
