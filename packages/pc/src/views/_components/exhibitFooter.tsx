/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "../_commons/button";
interface exhibitFooterProps {
  currentExhibit: any;
  getCurrentUser: any;
  selectedPolicies: any;
  act: any;
  children?: any;
}
export default function ExhibitFooter({
  currentExhibit,
  getCurrentUser,
  selectedPolicies,
  act,
}: exhibitFooterProps) {
  return (
    <div className="h-74 w-100x flex-row justify-center align-center">
      {!getCurrentUser() ? (
        <span
          className="mr-20 fs-14"
          css={css`
            font-weight: 400;
            color: #999999;
          `}
        >
          进行签约及授权管理，请先登录
        </span>
      ) : null}
      <Button
        disabled={
          (selectedPolicies.length === 0 && getCurrentUser()) ||
          !currentExhibit.isAvailable || currentExhibit.onlineStatus === 0
        }
        click={act}
        className={
          (getCurrentUser() ? "w-300" : "") + " px-20 h-38 fs-14 flex-column-center"
        }
      >
        {getCurrentUser() ? "立即签约" : "立即登录"}
      </Button>
    </div>
  );
}
