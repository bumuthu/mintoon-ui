import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import app from "api/modules/app";
import { setConfigData } from "store/slices/config-slice";
import {
  ImageMetadata,
  MainColumnsDataType,
  ColumnsType,
  ImagesType,
} from "types";

export const handleSave = (
  initialData: MainColumnsDataType,
  configurationObj: any,
  dispatch: Dispatch<AnyAction>,
  noUpdate?: boolean
) => {
  const newInitialDataColumns: ColumnsType = {};
  initialData.columnOrder.forEach((item: string) => {
    const layer = initialData.columns[item];
    const images: ImagesType = {};
    Object.keys(layer.images).forEach((img) => {
      const image: ImageMetadata = layer.images[img];
      const imageWithoutBase64 = { ...image };
      delete imageWithoutBase64.base64;
      images[img] = imageWithoutBase64;
    });
    newInitialDataColumns[item] = {
      ...layer,
      images,
    };
  });
  const newInitialData = {
    ...initialData,
    columns: newInitialDataColumns,
  };
  const newColumns: any = {};
  const layersOrder = initialData.columnOrder.map((item: string) => {
    const layer = initialData.columns[item];
    newColumns[item] = {
      ...initialData.columns[item],
    };
    const images = Object.keys(layer.images).map((img) => {
      const image: ImageMetadata = layer.images[img];
      const imageWithoutBase64 = { ...image };
      delete imageWithoutBase64.base64;
      newColumns[item] = {
        ...newColumns[item],
        images: { ...newColumns[item].images, [img]: imageWithoutBase64 },
      };
      return {
        imageId: image.name,
        name: image.name,
        rarity: image.rarity,
        image: image.base64,
      };
    });
    return {
      layerId: layer.id,
      name: layer.title,
      images: images,
    };
  });
  const configuration = {
    // ...configurationObj,
    namePrefix: initialData ? initialData.projectName : "",
    description:
      configurationObj && configurationObj.description
        ? configurationObj.description
        : "",
    baseUri:
      configurationObj && configurationObj.baseUri
        ? configurationObj.baseUri
        : "",
    format:
      configurationObj &&
        configurationObj.format &&
        Object.keys(configurationObj.format).length > 0
        ? configurationObj.format
        : {
          width: 512,
          height: 512,
          smoothing: false,
        },
    gif:
      configurationObj &&
        configurationObj.gif &&
        Object.keys(configurationObj.gif).length > 0
        ? configurationObj.gif
        : {
          export: false,
          repeat: 0,
          quality: 100,
          delay: 500,
        },
    background:
      configurationObj &&
        configurationObj.background &&
        Object.keys(configurationObj.background).length > 0
        ? configurationObj.background
        : {
          generate: false,
          brightness: 100,
        },
    extraMetadata:
      configurationObj && configurationObj.extraMetadata
        ? configurationObj.extraMetadata
        : {},
    preview_gif:
      configurationObj &&
        configurationObj.preview_gif &&
        Object.keys(configurationObj.preview_gif).length > 0
        ? configurationObj.preview_gif
        : {
          numberOfImages: 5,
          order: "ASC",
          repeat: 0,
          quality: 100,
          delay: 500,
          imageName: "preview.gif",
        },
    metadata_props:
      configurationObj && configurationObj.metadata_props
        ? configurationObj.metadata_props
        : [
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
    layerConfigurations: [
      {
        growEditionSizeTo:
          configurationObj &&
            configurationObj.layerConfigurations &&
            configurationObj.layerConfigurations[0]
            ? configurationObj.layerConfigurations[0].growEditionSizeTo
            : 0,
        layersOrder,
      },
    ],
    frontEndConfigData: newInitialData,
  };
  dispatch(setConfigData(configuration));
  if (!noUpdate)
    app.updateProject(
      initialData.projectId ? initialData.projectId : "",
      configuration
    );
  return configuration;
};

export const getNextMonth = (planValidTill?: number) => {
  let date = new Date()
  if (planValidTill) {
    date = new Date(planValidTill);
  }
  const nextMonth = date.getMonth() === 11 ? 1 : date.getMonth() + 2;
  const year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
  const nextMonthDate = new Date(`${year}-${nextMonth}-${date.getDate()}`)
  return `${date.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMonthDate)} ${year}`
}

export const getNextYear = (planValidTill?: number) => {
  let date = new Date();
  if (planValidTill) {
    date = new Date(planValidTill);
  }
  const nextMonth = date.getMonth() + 1;
  const year = date.getFullYear() + 1;
  const nextMonthDate = new Date(`${year}-${nextMonth}-${date.getDate()}`);
  return `${date.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMonthDate)} ${year}`
}

export const getDateStringForTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const nextMonthDate = new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  return `${date.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(nextMonthDate)} ${date.getFullYear()}`
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}