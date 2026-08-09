import { openUrl } from "@tauri-apps/plugin-opener";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkForUpdate } from "@/lib/updateCheck";
import { UpdatesSection } from "./UpdatesSection";

vi.mock("@/lib/updateCheck", () => ({
  checkForUpdate: vi.fn(),
}));

const mockedCheck = vi.mocked(checkForUpdate);

function renderSection() {
  render(<UpdatesSection />);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("UpdatesSection", () => {
  it("offers only a manual upstream check", () => {
    renderSection();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check Now" })).toBeInTheDocument();
  });

  it("reports when already up to date", async () => {
    mockedCheck.mockResolvedValue({ status: "current", currentVersion: "0.8.1" });
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Check Now" }));
    expect(await screen.findByText(/based on the latest Glyph release/i)).toBeInTheDocument();
  });

  it("offers a review link when an upstream update is available", async () => {
    mockedCheck.mockResolvedValue({
      status: "available",
      latestVersion: "0.9.0",
      currentVersion: "0.8.1",
      url: "https://example.com/0.9.0",
    });
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Check Now" }));

    expect(
      await screen.findByText(/Glyph 0\.9\.0 is available for manual review/),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "View release" }));
    expect(openUrl).toHaveBeenCalledWith("https://example.com/0.9.0");
  });

  it("reports an error when the check fails", async () => {
    mockedCheck.mockResolvedValue({ status: "error" });
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Check Now" }));
    expect(await screen.findByText(/Couldn't check for updates/i)).toBeInTheDocument();
  });
});
