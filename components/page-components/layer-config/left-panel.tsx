import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import Column from "data/column";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { setOtherData } from "store/slices/config-slice";

const DragDropContext = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.DragDropContext;
  },
  { ssr: false }
);

const Droppable = dynamic(
  async () => {
    const mod = await import("react-beautiful-dnd");
    return mod.Droppable;
  },
  { ssr: false }
);

type Props = {
  initialData: any;
  setInitialData: any;
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
  initialLoading: boolean;
  layerLoading: boolean;
};

const LeftPanel = (props: Props) => {
  const {
    initialData,
    setSelectedLayer,
    selectedLayer,
    setInitialData,
    initialLoading,
    layerLoading,
  } = props;
  const [data, setData] = useState(initialData);
  const dispatch = useDispatch();
  useEffect(() => setData(initialData), [initialData]);
  const onPressHandler = () => {
    if (!layerLoading) {
      const newData = { ...initialData };
      const newColumnId = new Date().getTime();
      newData.columns = {
        ...newData.columns,
        [`column-${newColumnId}`]: {
          id: `column-${newColumnId}`,
          title: "Untitled",
          percentage: "100",
          numberOfLayers: "0",
          images: {},
        },
      };
      newData.columnOrder = [...newData.columnOrder, `column-${newColumnId}`];
      setInitialData(newData);
      dispatch(setOtherData(newData));
      setSelectedLayer(`column-${newColumnId}`);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const newColumnOrder = Array.from(data.columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);

    const newState = {
      ...data,
      columnOrder: newColumnOrder,
    };

    setData(newState);
    dispatch(setOtherData(newState));
  };

  const theme = useTheme();
  return (
    <Grid
      sx={{
        width: 280,
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"column"}>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ cursor: "pointer" }}
            >
              {data.columnOrder.map((column: string, index: number) => {
                //@ts-ignore
                const columnObj = data.columns[column];
                return (
                  columnObj && (
                    <Column
                      key={column}
                      layerLoading={layerLoading}
                      column={columnObj}
                      label={columnObj.title}
                      percentage={columnObj.percentage}
                      numberOfLayers={columnObj.numberOfLayers}
                      index={index}
                      setSelectedLayer={setSelectedLayer}
                      initialLoading={initialLoading}
                    />
                  )
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box
        sx={{
          width: "100%",
          height: 60,
          backgroundColor: `${theme.palette.background.paper}`,
          color: theme.palette.text.secondary,
          borderRadius: `${theme.shape.borderRadius}px`,
          padding: "8px",
          border: `2px solid ${theme.palette.secondary.main}40`,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={onPressHandler}
      >
        Add new layer
      </Box>
    </Grid>
  );
};

export default LeftPanel;
