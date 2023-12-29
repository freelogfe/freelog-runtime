import { css } from "astroturf";

import NodeFreezed from "./_outAuth/nodeFreezed";
import ThemeFreezed from "./_outAuth/themeFreezed";
import ThemeNone from "./_outAuth/themeNone";
import UserFreezed from "./_outAuth/userFreezed";
import NodeOffline from "./_outAuth/nodeOffline";
import NodePrivate from "./_outAuth/nodePrivate";
//@ts-ignore
const props = window.$wujie?.props;
const { NODE_FREEZED, THEME_NONE, THEME_FREEZED, USER_FREEZED, NODE_OFFLINE, NODE_PRIVATE } =
props.freelogAuth.eventType;
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
          case NODE_OFFLINE:
            return <NodeOffline outData={outData} />;
          case NODE_PRIVATE:
            return <NodePrivate outData={outData} />;
          default:
            return null;
        }
      })()}
    </>
  );
}
