import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConfigState = {
  configData: any;
  imageData: any;
  otherData: any;
  previewImages: any;
  pageLoading: boolean;
};

const initialState: ConfigState = {
  configData: {
    namePrefix: "",
    description: "",
    baseUri: "",
    layerConfigurations: [
      {
        growEditionSizeTo: 0,
        layersOrder: [],
      },
    ],
    format: {
      width: 512,
      height: 512,
      smoothing: false,
    },
    gif: {
      export: false,
      repeat: 0,
      quality: 100,
      delay: 500,
    },
    background: {
      generate: true,
      brightness: 100,
      static: false,
      default: "#000000",
    },
    extraMetadata: {},
    preview_gif: {
      numberOfImages: 5,
      order: "ASC",
      repeat: 0,
      quality: 100,
      delay: 500,
      imageName: "preview.gif",
    },
    metadata_props: [
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
    frontEndConfigData: {
      columns: {
        "column-1": {
          id: "column-1",
          title: "Background",
          percentage: "100",
          numberOfLayers: "0",
          images: {},
          size: "512*512",
        },
      },
      columnOrder: ["column-1"],
      projectName: "Untitled Project",
      projectId: "",
      projectThumbnail: "/image-placeholder.svg",
    },
  },
  imageData: {},
  otherData: {
    columns: {
      "column-1": {
        id: "column-1",
        title: "Background",
        percentage: "100",
        numberOfLayers: "0",
        images: {},
        size: "512*512",
      },
    },
    columnOrder: ["column-1"],
    projectName: "Untitled Project",
    projectId: "",
    projectThumbnail: "/image-placeholder.svg",
  },
  previewImages: [],
  pageLoading: false,
};

const configSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setConfigData(state, action: PayloadAction<any>) {
      state.configData = action.payload;
    },
    setImageData(state, action: PayloadAction<any>) {
      state.imageData = action.payload;
    },
    setOtherData(state, action: PayloadAction<any>) {
      state.otherData = action.payload;
    },
    setPreviewImages(state, action: PayloadAction<any>) {
      state.previewImages = action.payload;
    },
    setPageLoading(state, action: PayloadAction<boolean>) {
      state.pageLoading = action.payload;
    },
  },
});

export const {
  setConfigData,
  setImageData,
  setOtherData,
  setPreviewImages,
  setPageLoading,
} = configSlice.actions;
export default configSlice.reducer;
