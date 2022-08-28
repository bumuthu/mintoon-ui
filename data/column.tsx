import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import dynamic from "next/dynamic";

const Draggable = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.Draggable;
  },
  { ssr: false }
);

type ColumnType = {
  id: string;
  title: string;
  percentage: string;
  numberOfLayers: string;
};

type Props = {
  column: ColumnType;
  label: string;
  percentage: string;
  numberOfLayers: string;
  index: number;
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  initialLoading: boolean;
  layerLoading: boolean;
};

const Column = (props: Props) => {
  const {
    column,
    label,
    percentage,
    numberOfLayers,
    index,
    initialLoading,
    setSelectedLayer,
    layerLoading,
  } = props;
  const theme = useTheme();
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Box
            sx={{
              width: "100%",
              marginBottom: "10px",
              backgroundColor: theme.palette.background.default,
              borderRadius: `${theme.shape.borderRadius}px`,
              height: 60,
              padding: "12px",
              display: "flex",
              alignItem: "center",
              justifyContent: "space-between",
              boxShadow: `0 4px 4px 0 ${theme.palette.primary.contrastText}40`,
            }}
            onClick={() => {
              if (!layerLoading) setSelectedLayer(column.id);
            }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              fontWeight={600}
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "12px",
                width: "60%",
                whiteSpace: "nowrap",
                overFlow: "hidden",
                textOverflow: "eclipse",
              }}
            >
              {initialLoading ? (
                <Skeleton
                  sx={{
                    width: "100%",
                    "&.MuiSkeleton-root": {
                      borderRadius: "4px",
                    },
                  }}
                />
              ) : (
                label
              )}
            </Typography>
            <Box
              sx={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItem: "flexEnd",
              }}
            >
              <Typography variant="subtitle2" textAlign="end" fontWeight={600}>
                {initialLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Skeleton
                      sx={{
                        width: "40%",
                        "&.MuiSkeleton-root": {
                          borderRadius: "4px",
                        },
                        textAlign: "end",
                      }}
                    />
                  </Box>
                ) : (
                  `${percentage}%`
                )}
              </Typography>
              <Typography
                variant="caption"
                textAlign="end"
                fontWeight={600}
                sx={{ color: `${theme.palette.secondary.main}80` }}
              >
                {initialLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Skeleton
                      sx={{
                        width: "60%",
                        "&.MuiSkeleton-root": {
                          borderRadius: "4px",
                        },
                        textAlign: "end",
                      }}
                    />
                  </Box>
                ) : (
                  `${numberOfLayers} Traits`
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default Column;
