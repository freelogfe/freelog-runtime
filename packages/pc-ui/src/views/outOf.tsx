import NodeFreezed from "./_outAuth/nodeFreezed";
import ThemeFreezed from "./_outAuth/themeFreezed";
import ThemeNone from "./_outAuth/themeNone";
import UserFreezed from "./_outAuth/userFreezed";
import NodeOffline from "./_outAuth/nodeOffline";
import NodePrivate from "./_outAuth/nodePrivate";
import NodeDeleted from "./_outAuth/nodeDeleted";
import { freelogAuth } from "freelog-runtime-core";

const {
  NODE_FREEZED,
  THEME_NONE,
  THEME_FREEZED,
  USER_FREEZED,
  NODE_OFFLINE,
  NODE_PRIVATE,
  NODE_DELETED
} = freelogAuth.eventType;
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
          case NODE_DELETED:
            return <NodeDeleted />;
          case NODE_FREEZED:
            return <NodeFreezed outData={outData} />;
          case THEME_NONE:
            return <ThemeNone />;
          case THEME_FREEZED:
            return <ThemeFreezed />;
          case USER_FREEZED:
            return <UserFreezed outData={outData} />;
          case NODE_OFFLINE:
            return <NodeOffline />;
          case NODE_PRIVATE:
            return <NodePrivate />;
          default:
            return null;
        }
      })()}
    </>
  );
}
