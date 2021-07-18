import { useCallback, useEffect, useRef } from "react";
// https://www.npmjs.com/package/react-force-graph
import { useTooltipNode } from "../../providers/store/useSelectors";
import { useConfig } from "../../providers/store/useConfig";
import RightClickMenu from "../common/RightClickMenu";
import { rightClickMenuAtom } from "providers/store/store";
import { useAtom } from "jotai";
// https://www.npmjs.com/package/d3-force-cluster

export default function GraphRightClickMenu() {
  const [rightClickMenu] = useAtom(rightClickMenuAtom);

  const tooltipNode = useTooltipNode();
  const { cooldownTime, setConfig } = useConfig();
  const prevCooldownTime = useRef(cooldownTime);
  useEffect(() => {
    prevCooldownTime.current = cooldownTime;
  }, [cooldownTime]);

  // when we right-click, pause, when we clickaway, unpause

  // unpause on clickaway
  const handleCloseMenu = useHandleCloseMenu();

  // // close the menu when ?
  // useEffect(() => {
  //   if (!tooltipNode && rightClickMenu.mouseY) {
  //     handleCloseMenu();
  //   }
  // }, [tooltipNode, handleCloseMenu, rightClickMenu.mouseY]);

  return (
    <RightClickMenu
      {...{
        anchorEl: null,
        handleClose: handleCloseMenu,
        isMenuOpen: Boolean(rightClickMenu.node !== null),
        user: tooltipNode?.user,
        MenuProps: {
          onClick: () => {
            // restart the simulation
            setConfig({ cooldownTime: prevCooldownTime.current });
          },
          keepMounted: true,
          anchorReference: "anchorPosition",
          anchorPosition:
            rightClickMenu.mouseY !== null && rightClickMenu.mouseX !== null
              ? {
                  top: rightClickMenu.mouseY,
                  left: rightClickMenu.mouseX,
                }
              : undefined,
        },
      }}
    />
  );
}

export function useHandleCloseMenu() {
  const [, setRightClickMenu] = useAtom(rightClickMenuAtom);
  const { setConfig } = useConfig();
  return useCallback(() => {
    setConfig({ isPaused: false });
    setRightClickMenu({
      mouseX: null,
      mouseY: null,
      node: null,
    });
    // return cooldownTime to its previous value
  }, [setConfig, setRightClickMenu]);
}

export function useHandleOpenRightClickMenu(tweet) {
  const { setConfig } = useConfig();
  const [, setRightClickMenu] = useAtom(rightClickMenuAtom);

  function handleRightClick(event: MouseEvent) {
    // prevent default right-click menu
    event.preventDefault();
    // pause the simulation
    setConfig({ isPaused: true });

    // set the mouse position, triggering the menu to open
    setRightClickMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      node: tweet,
    });
  }
  return handleRightClick;
}
