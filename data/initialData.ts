export const configurationData = {
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
    generate: false,
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
};

export const initialOtherData = {
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
};
