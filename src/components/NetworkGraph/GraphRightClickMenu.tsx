import React, { useCallback, useEffect, useRef, useState } from "react";
// https://www.npmjs.com/package/react-force-graph
import { useConfig, useTooltipNode } from "../../providers/store";
import { useMount } from "../../utils/utils";
import RightClickMenu from "../common/RightClickMenu";
// https://www.npmjs.com/package/d3-force-cluster

export default function GraphRightClickMenu() {
  const tooltipNode = useTooltipNode();
  const { cooldownTime, setConfig } = useConfig();
  const prevCooldownTime = useRef(cooldownTime);
  useEffect(() => {
    prevCooldownTime.current = cooldownTime;
  }, [cooldownTime]);

  const [mousePosition, setMousePosition] = useState({
    mouseX: null,
    mouseY: null,
  });

  // when we right-click, pause, when we clickaway, unpause

  // unpause on clickaway
  const handleCloseMenu = useCallback(() => {
    setConfig({ isPaused: false });
    setMousePosition({
      mouseX: null,
      mouseY: null,
    });
    // return cooldownTime to its previous value
  }, [setConfig]);

  // close the menu when ?
  useEffect(() => {
    if (!tooltipNode && mousePosition.mouseY) {
      handleCloseMenu();
    }
  }, [tooltipNode, handleCloseMenu, mousePosition.mouseY]);

  function handleRightClick(event) {
    // prevent default right-click menu
    event.preventDefault();
    // pause the simulation
    setConfig({ isPaused: true });

    // set the mouse position, triggering the menu to open
    setMousePosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  }
  useMount(() => {
    const canvas = document.querySelector("canvas");
    canvas.addEventListener("contextmenu", handleRightClick);
    return () => {
      canvas.removeEventListener("contextmenu", handleRightClick);
    };
  });

  return (
    <RightClickMenu
      {...{
        anchorEl: null,
        handleClose: handleCloseMenu,
        isMenuOpen: Boolean(tooltipNode && mousePosition.mouseY !== null),
        user: tooltipNode?.user,
        MenuProps: {
          onClick: () => {
            // restart the simulation
            setConfig({ cooldownTime: prevCooldownTime.current });
          },
          keepMounted: true,
          anchorReference: "anchorPosition",
          anchorPosition:
            mousePosition.mouseY !== null && mousePosition.mouseX !== null
              ? { top: mousePosition.mouseY, left: mousePosition.mouseX }
              : undefined,
        },
      }}
    />
  );
}
