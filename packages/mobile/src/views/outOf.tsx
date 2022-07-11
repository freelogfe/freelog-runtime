import { css } from "astroturf";

import NodeFreezed from "./_outAuth/nodeFreezed";
import ThemeFreezed from "./_outAuth/themeFreezed";
import ThemeNone from "./_outAuth/themeNone";

const { NODE_FREEZED, THEME_NONE, THEME_FREEZED } =
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
          default:
            return null;
        }
      })()}
    </>
  );
}
