import React from "react";
import { useConfig } from "../../providers/store";
import { CollapsibleSwitchWithLabels } from "../common/styledComponents";

export function SwitchReplace() {
  const { replace, setConfig } = useConfig();
  return (
    <CollapsibleSwitchWithLabels
      labelLeft="Add"
      labelRight="Replace"
      onChange={() => setConfig({ replace: !replace })}
      checked={replace}
    />
  );
}
