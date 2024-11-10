import { UserSettings } from "@/types";

export const saveSettings = (settings: UserSettings): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings }, () => {
      resolve();
    });
  });
};

export const getSettings = (): Promise<UserSettings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get("settings", (data) => {
      resolve(data.settings || { htmlTags: [], filters: [] });
    });
  });
};
