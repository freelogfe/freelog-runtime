import { Button, Space } from "antd-mobile";
import { createPortal } from "react-dom";
import FI18n from "@/I18nNext";

const messages = {
  zh_CN: {
    blocked: "无法打开新页面。在当前页登录后，请重新发起刚才的操作。",
    error: "暂时无法检查登录状态。",
    continue: "在当前页登录",
    retry: "重试",
    cancel: "取消",
  },
  en_US: {
    blocked: "Could not open a new page. After signing in here, start your previous action again.",
    error: "Could not check sign-in status.",
    continue: "Sign in here",
    retry: "Retry",
    cancel: "Cancel",
  },
};

interface LoginNoticeProps {
  status: "blocked" | "error";
  onContinue: () => void;
  onRetry: () => void;
  onCancel: () => void;
}

export default function LoginNotice({ status, onContinue, onRetry, onCancel }: LoginNoticeProps) {
  const copy = messages[FI18n.i18nNext.getCurrentLanguage()] ?? messages.zh_CN;
  const blocked = status === "blocked";

  return createPortal(
    <section
      style={{
        position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 3100,
        maxWidth: 420, margin: "0 auto", padding: 16, borderRadius: 8,
        background: "#fff", color: "#222", boxShadow: "0 2px 12px #0003",
      }}
    >
      <p role="alert" style={{ margin: "0 0 12px" }}>{copy[status]}</p>
      <Space>
        <Button size="small" color="primary" onClick={blocked ? onContinue : onRetry}>
          {blocked ? copy.continue : copy.retry}
        </Button>
        <Button size="small" onClick={onCancel}>{copy.cancel}</Button>
      </Space>
    </section>,
    document.body,
  );
}
