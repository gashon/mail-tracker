export interface UserSettings {
  apiKey?: string;
  htmlTags: string[];
  filters: string[];
}

export interface MessageType {
  type: string;
  payload?: any;
}

type LanguageModelFilterOptions = {
  apiKey: string;
  filters: string[];
  userDefinedFilters: string[];
};
