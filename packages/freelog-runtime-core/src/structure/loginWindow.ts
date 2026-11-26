import { getCurrentUser, urls } from "freelog-runtime-api";
import { watchLoginOnReturn } from "../bridge/eventOn";
import { SUCCESS, USER_CANCEL } from "../bridge/eventType";

const USER_NOT_LOGGED_IN = 30;
const CLOSE_CHECK_INTERVAL = 500;

export type LoginStatus = "blocked" | "waiting" | "checking" | "error";

type LoginNode = {
  nodeTitle?: string;
  nodeName?: string;
  nodeShortDescription?: string;
  nodeLogo?: string;
};

interface LoginRequest {
  url: string;
  status: LoginStatus;
  popup: Window | null;
  onFinished: (result: number, user?: { userId: number }) => void;
  stopWatching?: () => void;
}

interface LoginWindowOptions {
  onStatus: (status: LoginStatus | null) => void;
  features?: string;
  checkCloseOnlyWhenVisible?: boolean;
}

export function buildLoginUrl(node: LoginNode | undefined, goTo?: string) {
  const url = new URL(urls.userSignIn);
  if (goTo) url.searchParams.set("goTo", goTo);
  else url.searchParams.set("autoClose", "1");
  const title = node?.nodeTitle || node?.nodeName;
  if (title) url.searchParams.set("title", title);
  if (node?.nodeShortDescription) url.searchParams.set("desc", node.nodeShortDescription);
  if (node?.nodeLogo) url.searchParams.set("cover", node.nodeLogo);
  return url.href;
}

export function createLoginWindow({ onStatus, features, checkCloseOnlyWhenVisible }: LoginWindowOptions) {
  let request: LoginRequest | null = null;

  function setStatus(current: LoginRequest, status: LoginStatus) {
    current.status = status;
    onStatus(status);
  }

  function release(current: LoginRequest) {
    current.stopWatching?.();
    if (current.popup && !current.popup.closed) current.popup.close();
  }

  function finish(result: number, user?: { userId: number }) {
    const current = request;
    if (!current) return;
    request = null;
    onStatus(null);
    try {
      current.onFinished(result, user);
    } finally {
      release(current);
    }
  }

  async function check() {
    const current = request;
    if (!current?.popup || current.status === "checking") return;

    const wasClosed = current.popup.closed;
    setStatus(current, "checking");
    let body;
    try {
      body = (await getCurrentUser())?.data;
    } catch {
      if (request === current) setStatus(current, "error");
      return;
    }
    if (request !== current) return;

    if (body?.ret === 0 && body.errCode === 0 && body.data?.userId) {
      finish(SUCCESS, body.data);
    } else if (body?.ret === 0 && body.errCode === USER_NOT_LOGGED_IN) {
      // A close during an earlier check needs a new session query.
      if (wasClosed) finish(USER_CANCEL);
      else setStatus(current, "waiting");
    } else {
      setStatus(current, "error");
    }
  }

  function open() {
    const current = request;
    if (!current) return;
    if (current.popup) {
      if (!current.popup.closed) current.popup.focus();
      return;
    }

    let popup: Window | null = null;
    try {
      popup = window.open("about:blank", "_blank", features);
      if (!popup || popup === window || popup.closed) {
        setStatus(current, "blocked");
        return;
      }
      // Keep the handle for close detection while the login page has no opener.
      popup.opener = null;
      popup.location.replace(current.url);
    } catch {
      if (popup && popup !== window && !popup.closed) popup.close();
      setStatus(current, "blocked");
      return;
    }

    current.popup = popup;
    const unwatch = watchLoginOnReturn(() => { void check(); });
    const timer = window.setInterval(() => {
      if (request !== current || current.status !== "waiting" || !current.popup?.closed) return;
      if (checkCloseOnlyWhenVisible && document.visibilityState !== "visible") return;
      void check();
    }, CLOSE_CHECK_INTERVAL);
    current.stopWatching = () => {
      unwatch();
      window.clearInterval(timer);
    };
    setStatus(current, "waiting");
  }

  function start(node: LoginNode | undefined, onFinished: LoginRequest["onFinished"]) {
    if (!request) request = { url: buildLoginUrl(node), status: "blocked", popup: null, onFinished };
    open();
  }

  function dispose() {
    const current = request;
    request = null;
    if (current) release(current);
  }

  return { start, open, check, cancel: () => finish(USER_CANCEL), dispose };
}
