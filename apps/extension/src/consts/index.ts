export enum RequestMessage {
  PROMOTION_FILTER_COUNT = "PROMOTION_FILTER_COUNT",
  LANGUAGE_MODEL_FILTER = "LANGUAGE_MODEL_FILTER",
}

export type MessageType = {
  type: RequestMessage;
};

export enum LanguageModelFilter {
  RECRUITING_FILTER = "RECRUITING_FILTER",
}
