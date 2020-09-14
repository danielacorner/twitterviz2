import React from "react";
import { Tabs, Tab, Typography } from "@material-ui/core";
import NetworkGraph from "./NetworkGraph/NetworkGraph";
import Wordcloud from "./Wordcloud/Wordcloud";
import styled from "styled-components/macro";
import { useConfig, TAB_INDICES } from "../providers/store";
import Gallery from "./Gallery/Gallery";
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
        .tabs {
          width: 100%;
          display: grid;
          justify-content: center;
          box-shadow: 0px 2px 2px 0px #0000003d;
        }
      `}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        className="tabs"
        aria-label="simple tabs example"
      >
        <Tab
          label={
            <Typography variant="button" color="textPrimary">
              Network Graph
            </Typography>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <Typography variant="button" color="textPrimary">
              Word Cloud
            </Typography>
          }
          {...a11yProps(1)}
        />
        <Tab
          label={
            <Typography variant="button" color="textPrimary">
              Gallery
            </Typography>
          }
          {...a11yProps(2)}
        />
      </Tabs>
      <TabPanel value={value} index={TAB_INDICES.NETWORKGRAPH}>
        <NetworkGraph />
      </TabPanel>
      <TabPanel value={value} index={TAB_INDICES.WORDCLOUD}>
        <Wordcloud />
      </TabPanel>
      <TabPanel value={value} index={TAB_INDICES.GALLERY}>
        <Gallery />
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
