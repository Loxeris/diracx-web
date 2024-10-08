import React from "react";
import { render } from "@testing-library/react";
import { useOidcAccessToken, useOidc } from "@axa-fr/react-oidc";
import UserDashboard from "@/components/UserDashboard/UserDashboard";
import { ThemeProvider } from "@/contexts/ThemeProvider";

// Mock the modules
jest.mock("@axa-fr/react-oidc", () => ({
  useOidc: jest.fn(),
  useOidcAccessToken: jest.fn(),
}));

jest.mock("jsoncrush", () => ({
  crush: jest.fn().mockImplementation((data) => `crushed-${data}`),
  uncrush: jest.fn().mockImplementation((data) => data.replace("crushed-", "")),
}));

describe("<UserDashboard />", () => {
  it("renders not authenticated message when accessTokenPayload is not defined", () => {
    (useOidc as jest.Mock).mockReturnValue({ isAuthenticated: false });
    (useOidcAccessToken as jest.Mock).mockReturnValue({
      accessTokenPayload: null,
    });

    const { getByText } = render(
      <ThemeProvider>
        <UserDashboard />
      </ThemeProvider>,
    );
    expect(getByText("Not authenticated")).toBeInTheDocument();
  });

  it("renders welcome message when accessTokenPayload is defined", () => {
    (useOidc as jest.Mock).mockReturnValue({ isAuthenticated: true });
    (useOidcAccessToken as jest.Mock).mockReturnValue({
      accessTokenPayload: { preferred_username: "TestUser" },
    });

    const { getByText } = render(
      <ThemeProvider>
        <UserDashboard />
      </ThemeProvider>,
    );
    expect(getByText("Hello TestUser")).toBeInTheDocument();
  });
});
