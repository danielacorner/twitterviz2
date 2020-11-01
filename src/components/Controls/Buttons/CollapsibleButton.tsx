import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { useIsLeftDrawerOpen } from "../../../providers/store";
import styled from "styled-components/macro";
const Div = styled.div`
  button {
    text-transform: none !important;
  }
`;

export function CollapsibleButton({
  text = null,
  disabled,
  css,
  tooltipTitle = null,
  ...props
}: any) {
  const { isDrawerOpen } = useIsLeftDrawerOpen();

  return (
    <Tooltip title={tooltipTitle || ""}>
      <Div css={css}>
        <Tooltip title={isDrawerOpen ? "" : text}>
          <Button
            disabled={disabled}
            {...props}
            startIcon={isDrawerOpen ? props.startIcon : null}
            endIcon={isDrawerOpen ? props.endIcon : null}
          >
            {isDrawerOpen ? text : props.startIcon || props.endIcon}
          </Button>
        </Tooltip>
      </Div>
    </Tooltip>
  );
}
