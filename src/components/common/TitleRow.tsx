import React, { Component, useState } from "react";
import { IconButton, Collapse } from "@material-ui/core";
import { ColumnDiv, H5, RowDiv } from "./styledComponents";
import { ArrowDropDown } from "@material-ui/icons";

export default function TitleRow({
  children,
  title,
  collapsible = false,
}: {
  children: any;
  title: string | Component;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <ColumnDiv
      css={`
        width: 100%;
      `}
    >
      <RowDiv
        style={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          padding: "1em 0 2em 0",
        }}
        onClick={() => setOpen(!open)}
      >
        {collapsible && (
          <IconButton
            style={{
              position: "absolute",
              left: -28,
              width: "fit-content",
              transition: "transform 0.3s ease-in-out",
              transform: `rotate(${open ? 0 : -0.25}turn)`,
            }}
          >
            <ArrowDropDown />
          </IconButton>
        )}
        <H5 style={{ margin: 0, padding: 0 }}>
          <span style={{ marginLeft: "1em" }}>{title}</span>
        </H5>
      </RowDiv>
      <Collapse in={open} style={{ width: "100%" }}>
        <div style={{ paddingBottom: "2em" }}>{children}</div>
      </Collapse>
    </ColumnDiv>
  );
}
