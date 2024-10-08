import type { StorybookConfig } from "@storybook/nextjs";

import { join, dirname, resolve } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["./*.mdx", "../**/*.mdx", "../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (!config.resolve) {
      return config;
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@axa-fr/react-oidc": require.resolve("@/mocks/react-oidc.mock.ts"),
      "@actual/react-oidc": require.resolve("@axa-fr/react-oidc"),

      "@actual/hooks/metadata$": require.resolve("@/hooks/metadata"),
      "../../hooks/metadata": require.resolve("@/mocks/metadata.mock.ts"),

      "@actual/components/JobMonitor/JobDataService$": require.resolve(
        "@/components/JobMonitor/JobDataService.ts",
      ),
      "./JobDataService": require.resolve("@/mocks/JobDataService.mock.ts"),
    };
    return config;
  },
};
export default config;
