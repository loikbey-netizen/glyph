import { useTabsContext } from "@/contexts/TabsContext";
import { useDefaultAppPrompt } from "@/hooks/useDefaultAppPrompt";
import { useErrorReportingPrompt } from "@/hooks/useErrorReportingPrompt";
import { DefaultAppBanner } from "./DefaultAppBanner";
import { ErrorReportingBanner } from "./ErrorReportingBanner";
import { WorkspaceNoticeBanner } from "./WorkspaceNoticeBanner";

/** First-run nudges and workspace notices above the tab bar. Upstream Glyph
 * releases are deliberately checked only from Settings, never on launch. */
export function AppBanners() {
  const { workspaceNotice, dismissWorkspaceNotice } = useTabsContext();
  // One-time first-run nudge to make Glyph the default Markdown app.
  const defaultAppPrompt = useDefaultAppPrompt();
  const errorReportingPrompt = useErrorReportingPrompt();

  return (
    <>
      {defaultAppPrompt.show && (
        <DefaultAppBanner
          onSetDefault={defaultAppPrompt.setDefault}
          onNotNow={defaultAppPrompt.notNow}
          onNever={defaultAppPrompt.never}
        />
      )}
      {errorReportingPrompt.show && (
        <ErrorReportingBanner
          onEnable={errorReportingPrompt.enable}
          onDecline={errorReportingPrompt.decline}
        />
      )}
      <WorkspaceNoticeBanner notice={workspaceNotice} onDismiss={dismissWorkspaceNotice} />
    </>
  );
}
