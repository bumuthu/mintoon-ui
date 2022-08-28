import { Box, Button, Grid, List, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import ListItemCustom from "components/page-components/layer-config/list-item-custom-preview";

type Props = {
  setPreview: any;
  metadata: any;
};

const RightPanelPreview = (props: Props) => {
  const { setPreview, metadata } = props;
  const [sliderValue, setSliderValue] = useState(50);
  const date = new Date(metadata ? metadata.date : 0);
  const theme = useTheme();
  return (
    <Grid
      sx={{
        width: 380,
        padding: "20px 20px 20px 52px",
        minHeight: "calc(100vh - 176px)",
        marginLeft: "20px",
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ minHeight: 400 }}>
        {metadata && metadata.edition ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="subtitle2"
                textAlign="end"
                fontWeight={600}
                sx={{ color: `${theme.palette.secondary.main}B3` }}
              >
                Meta Data
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <List>
                <ListItemCustom
                  name="edition"
                  value={metadata ? metadata.edition.toString() : ""}
                />
                <ListItemCustom
                  name="name"
                  value={metadata ? metadata.name : ""}
                />
                <ListItemCustom
                  name="description"
                  value={metadata ? metadata.description : ""}
                />
                <ListItemCustom
                  name="image"
                  value={metadata ? metadata.image : ""}
                />
                <ListItemCustom
                  name="dna"
                  value={metadata ? metadata.dna : ""}
                />
                <ListItemCustom
                  name="date"
                  value={
                    date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear()
                  }
                />
                <ListItemCustom name="attributes" />
                <List sx={{ marginLeft: "32px" }}>
                  {metadata && metadata.attributes
                    ? metadata.attributes.map((item: any, index: number) => {
                        return (
                          <Box sx={{ marginY: "8px" }} key={index}>
                            <ListItemCustom
                              name="trait_type"
                              value={item.trait_type}
                              width={150}
                            />
                            <ListItemCustom
                              name="value"
                              value={item.value}
                              width={150}
                            />
                          </Box>
                        );
                      })
                    : null}
                </List>
              </List>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", color: theme.palette.text.secondary }}
            >
              No details to show
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <Button
          sx={{
            "&.MuiButton-contained": {
              height: 26,
              width: "60%",
              fontSize: 14,
              borderRadius: "5px",
            },
            marginTop: "8px",
          }}
          style={{
            minWidth: 200,
            marginBottom: "30px",
            fontSize: 11,
          }}
          variant="contained"
          onClick={() => setPreview(false)}
        >
          Exit Preview
        </Button>
      </Box>
    </Grid>
  );
};

export default RightPanelPreview;
