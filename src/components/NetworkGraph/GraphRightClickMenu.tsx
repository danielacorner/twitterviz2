import React, { useCallback, useEffect, useState } from "react";
// https://www.npmjs.com/package/react-force-graph
import { useTooltipNode } from "../../providers/store";
import { useMount } from "../../utils/utils";
import RightClickMenu from "../common/RightClickMenu";
// https://www.npmjs.com/package/d3-force-cluster

export default function GraphRightClickMenu() {
  const tooltipNode = useTooltipNode();
  const [mousePosition, setMousePosition] = useState({
    mouseX: null,
    mouseY: null,
  });

  const handleCloseMenu = useCallback(() => {
    setMousePosition({
      mouseX: null,
      mouseY: null,
    });
  }, []);

  useEffect(() => {
    if (!tooltipNode && mousePosition.mouseY) {
      handleCloseMenu();
    }
  }, [tooltipNode, handleCloseMenu, mousePosition.mouseY]);

  useMount(() => {
    function handleRightClick(event) {
      // prevent default right-click menu
      event.preventDefault();
      // pause the simulation

      // set the mouse position, triggering the menu to open
      setMousePosition({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
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
