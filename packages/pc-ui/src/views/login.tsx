import { Alert, Button } from "antd";
import { createPortal } from "react-dom";
import FI18n from "@/I18nNext";

const messages = {
  zh_CN: {
    blocked: "登录窗口未打开",
    error: "暂时无法检查登录状态",
    open: "打开登录页",
    retry: "重试",
  },
  en_US: {
    blocked: "The sign-in window did not open",
    error: "Could not check sign-in status",
    open: "Open sign-in page",
    retry: "Retry",
  },
};

interface LoginNoticeProps {
  status: "blocked" | "error";
  onOpen: () => void;
  onCheck: () => void;
  onCancel: () => void;
}

export default function LoginNotice({ status, onOpen, onCheck, onCancel }: LoginNoticeProps) {
  const copy = messages[FI18n.i18nNext.getCurrentLanguage()] ?? messages.zh_CN;
  const blocked = status === "blocked";

  return createPortal(
    <Alert
      type="warning"
      message={copy[status]}
      action={
        <Button size="small" onClick={blocked ? onOpen : onCheck}>
          {blocked ? copy.open : copy.retry}
        </Button>
      }
      closable
      onClose={onCancel}
      style={{ position: "fixed", top: 16, right: 16, maxWidth: "calc(100vw - 32px)", zIndex: 3100 }}
    />,
    document.body,
  );
}
