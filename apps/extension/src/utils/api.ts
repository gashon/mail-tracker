import { UserSettings } from "@/types";

export const classifyElement = async (
  element: HTMLElement,
  settings: UserSettings
): Promise<"block" | "permit"> => {
  const textContent = element.innerText;

  const response = await fetch("https://api.llm-service.com/classify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      text: textContent,
      filters: settings.filters,
    }),
  });

  const result = await response.json();
  return result.classification as "block" | "permit";
};
