import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  projectNumber: string;
  projectName: string;
  description: string;
  imageUrl: string;
};

const ProjectCard = (props: Props) => {
  const { projectNumber, projectName, description, imageUrl } = props;
  const router = useRouter();
  const theme = useTheme();
  const shortenProjectName = (name: string): string => {
    if (name.length > 30) {
      return name.slice(0, 30) + '...';
    }
    return name;
  }
  return (
    <Grid
      item
      sx={{
        width: "100%",
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
      xs={12}
      md={6}
      lg={4}
      xl={2.4}
    >
      <Box
        sx={{
          width: "100%",
          height: "200px",
          backgroundImage: `url(${imageUrl || "/image-placeholder.svg"})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: `${theme.shape.borderRadius}px`,
          boxShadow: `-4px -10px 50px 0 #0000001A`,
          marginBottom: "20px",
        }}
      />
      <Box>
        <Box>
          <Typography
            sx={{ color: theme.palette.text.secondary,fontSize: 10 }}
            // variant="caption"
          >
            Project ID #{projectNumber}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ color: theme.palette.text.primary }}
            variant="subtitle2"
            fontWeight="bold"
          >
            {shortenProjectName(projectName)}
          </Typography>
        </Box>
        {/* <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "48px",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.secondary,
            }}
            variant="caption"
          >
            {description}
          </Typography>
        </Box> */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", fontSize: 11, transform: "translateY(-25px)" }}
            onClick={() =>
              router.push(`/pictoon/${projectNumber}/layer-config`)
            }
          >
            View
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default ProjectCard;
