import type { Preview } from "@storybook/react";
import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "../src/contexts";

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
        <div style={{ width: "55vw" }}>
          <CssBaseline />
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;