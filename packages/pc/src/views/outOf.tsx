/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NodeFreezed from "./_outAuth/nodeFreezed";
import ThemeFreezed from "./_outAuth/themeFreezed";
import ThemeNone from "./_outAuth/themeNone";
import UserFreezed from "./_outAuth/userFreezed";
const { NODE_FREEZED, THEME_NONE, THEME_FREEZED, USER_FREEZED } =
  window.freelogAuth.eventType;
interface OutOfProps {
  eventType: any;
  outData: any;
  children?: any;
}
export default function OutOf({ eventType, outData }: OutOfProps) {
  return (
    <>
      {(() => {
        switch (eventType) {
          case NODE_FREEZED:
            return <NodeFreezed outData={outData} />;
          case THEME_NONE:
            return <ThemeNone outData={outData} />;
          case THEME_FREEZED:
            return <ThemeFreezed outData={outData} />;
          case USER_FREEZED:
            return <UserFreezed outData={outData} />;
          default:
            return null;
        }
      })()}
    </>
  );
}
