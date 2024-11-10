import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getSettings, saveSettings } from "@/lib/storage";
import { UserSettings } from "@/types";

const Options = () => {
  const [settings, setSettings] = useState<UserSettings>({
    htmlTags: [],
    filters: [],
  });

  useEffect(() => {
    (async () => {
      const storedSettings = await getSettings();
      setSettings(storedSettings);
    })();
  }, []);

  const handleSave = () => {
    saveSettings(settings);
  };

  return (
    <div>
      <h1>Extension Options</h1>
      {/* Options form to update settings */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

const container = document.getElementById("options-root");
if (container) {
  const root = createRoot(container);
  root.render(<Options />);
}
