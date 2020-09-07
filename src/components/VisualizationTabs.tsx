import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import NetworkGraph from "./NetworkGraph/NetworkGraph";
import Wordcloud from "./Wordcloud/Wordcloud";
import styled from "styled-components/macro";
import { useConfig } from "../providers/store";
const Div = styled.div``;

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function VisualizationTabs() {
  const { tabIndex: value, setConfig } = useConfig();
  const setValue = (newValue) => setConfig({ tabIndex: newValue });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Div
      className="visualizationTabs"
      css={`
        display: grid;
        place-items: center;
        grid-template-rows: auto 1fr;
      `}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab label="Network Graph" {...a11yProps(0)} />
        <Tab label="Word Cloud" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <NetworkGraph />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Wordcloud />
      </TabPanel>
    </Div>
  );
}

function TabPanel({ children, value, index, ...other }) {
  const hidden = value !== index;
  return (
    <div
      style={hidden ? {} : { height: "100%", width: "100%" }}
      role="tabpanel"
      hidden={hidden}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {!hidden && (
        <Div
          css={`
            height: 100%;
            width: 100%;
            display: grid;
            place-items: center;
          `}
        >
          {children}
        </Div>
      )}
    </div>
  );
}
