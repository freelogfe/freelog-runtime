import { useEffect, useState } from "react";
import { createLoginWindow, type LoginStatus } from "freelog-runtime-core";

export default function useLoginWindow() {
  const [status, setStatus] = useState<LoginStatus | null>(null);
  const [loginWindow] = useState(() => createLoginWindow({
    onStatus: setStatus,
    features: "popup,width=1000,height=700",
  }));

  useEffect(() => () => loginWindow.dispose(), [loginWindow]);

  return { status, ...loginWindow };
}
