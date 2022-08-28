export type ImageMetadata = {
  name: string;
  rarity: number;
  url: string;
  originUri: string;
  item: File;
  lock: boolean;
  max: number;
  base64?: string;
  onlyOneInTheList?: boolean;
  size?: string;
  loading?: boolean;
  loadingSuccess?: "success" | "error" | "cancel";
};

export type ImagesType = {
  [key: string]: ImageMetadata;
};

export type ColumnDataType = {
  id: string;
  title: string;
  percentage: string;
  numberOfLayers: string;
  images: ImagesType;
  size: string;
};

export type ColumnsType = {
  [key: string]: ColumnDataType;
};

export type MainColumnsDataType = {
  columns: ColumnsType;
  columnOrder: string[];
  projectName: string;
  projectId: string;
  projectThumbnail: string;
};

export type CustomMetadataType = {
  key: string;
  value: string;
  type?: "Text" | "Number";
};

export type Metadata = {
  defaultMetadata: string[];
  customMetadata: CustomMetadataType[];
};

export type previewMetadata = {
  image: string;
  metadata: any;
};

export type HistoryDetailsType = {
  eventType:
    | "GENERAL_EVENT"
    | "PRICING_UPGRADE_EVENT"
    | "PRICING_DOWNGRADE_EVENT"
    | "COLLECTION_SUCCESS_EVENT"
    | "COLLECTION_FAILED_EVENT";
  timestamp: number;
  title?: string;
  description?: string;
  collectionName?: string;
  outputsCount?: number;
  failureReason?: string;
  pricingPlanName?: string;
  planValidTill?: number;
  reason?: string;
};

export type Plan = {
  anualDiscount: number;
  anualOriginalPrice: number;
  anualPrice: number;
  description: string;
  displayName: string;
  features: {
    COLLECTION_GENERATION_ATTEMPTS: { description: string; value: number, unlimited?: boolean };
    MAX_IMAGES_PER_COLLECTION: { description: string; value: number };
    CUSTOMER_SUPPORT: { description: string; value: string };
  };
  monthlyDiscount: number;
  monthlyOriginalPrice: number;
  monthlyPrice: number;
};
