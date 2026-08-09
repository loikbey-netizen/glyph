import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabsContext } from "@/contexts/TabsContext";
import { useDefaultAppPrompt } from "@/hooks/useDefaultAppPrompt";
import { useErrorReportingPrompt } from "@/hooks/useErrorReportingPrompt";
import { tabsContextValue } from "@/test/fixtures/tabsContext";
import { AppBanners } from "./AppBanners";

vi.mock("@/hooks/useDefaultAppPrompt", () => ({ useDefaultAppPrompt: vi.fn() }));
vi.mock("@/hooks/useErrorReportingPrompt", () => ({ useErrorReportingPrompt: vi.fn() }));

// The children are covered by their own suites; here only the mounting
// decision matters, so each is a marker.
vi.mock("./DefaultAppBanner", () => ({ DefaultAppBanner: () => <div>default app banner</div> }));
vi.mock("./ErrorReportingBanner", () => ({
  ErrorReportingBanner: () => <div>error reporting banner</div>,
}));
vi.mock("./WorkspaceNoticeBanner", () => ({
  WorkspaceNoticeBanner: () => <div>workspace notice banner</div>,
}));

function setPrompts({
  defaultApp,
  errorReporting,
}: {
  defaultApp: boolean;
  errorReporting: boolean;
}) {
  vi.mocked(useDefaultAppPrompt).mockReturnValue({
    show: defaultApp,
    setDefault: vi.fn(),
    notNow: vi.fn(),
    never: vi.fn(),
  });
  vi.mocked(useErrorReportingPrompt).mockReturnValue({
    show: errorReporting,
    enable: vi.fn(),
    decline: vi.fn(),
  });
}

function renderBanners() {
  return render(
    <TabsContext.Provider value={tabsContextValue()}>
      <AppBanners />
    </TabsContext.Provider>,
  );
}

describe("AppBanners", () => {
  it("shows only the always-mounted banners while neither prompt is due", () => {
    setPrompts({ defaultApp: false, errorReporting: false });
    renderBanners();

    expect(screen.getByText("workspace notice banner")).toBeInTheDocument();
    expect(screen.queryByText("default app banner")).not.toBeInTheDocument();
    expect(screen.queryByText("error reporting banner")).not.toBeInTheDocument();
  });

  it("adds each first-run nudge once its prompt is due", () => {
    setPrompts({ defaultApp: true, errorReporting: true });
    renderBanners();

    expect(screen.getByText("default app banner")).toBeInTheDocument();
    expect(screen.getByText("error reporting banner")).toBeInTheDocument();
  });
});
