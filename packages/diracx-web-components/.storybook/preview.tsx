import type { Preview } from "@storybook/react";
import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "../contexts/ThemeProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: "60vw", maxWidth: "900px" }}>
          <CssBaseline />
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
