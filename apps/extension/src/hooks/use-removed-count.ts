import React from "react";
import { RequestMessage } from "@/consts";

const POLLING_INTERVAL = 1_000;

export const useRemovedCount = () => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchCount = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (!currentTab?.id) return;

        chrome.tabs.sendMessage(
          currentTab.id,
          { type: RequestMessage.PROMOTION_FILTER_COUNT },
          (response) => {
            if (chrome.runtime.lastError) {
              return;
            }
            if (response) {
              setCount(response.count);
            }
          }
        );
      });
    };

    fetchCount();

    const interval = setInterval(fetchCount, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [setCount]);

  return count;
};
