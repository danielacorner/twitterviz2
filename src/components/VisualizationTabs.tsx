import React, { useEffect, useState } from "react";
import { Tabs, Tab, Typography } from "@material-ui/core";
import NetworkGraph from "./NetworkGraph/NetworkGraph";
import Wordcloud from "./Wordcloud/Wordcloud";
import styled from "styled-components/macro";
import { TAB_INDICES } from "../providers/store";
import Gallery from "./Gallery/Gallery";
import { TABS_HEIGHT } from "../utils/constants";
import { useHistory, useLocation } from "react-router";
import qs from "query-string";
import { isEqual } from "lodash";

const Div = styled.div``;

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
VisualizationTabs.whyDidYouRender = { logOnDifferentValues: true };
export default function VisualizationTabs() {
  const [tabIndex, setTabIndex] = useState(TAB_INDICES.NETWORKGRAPH);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // sync tab index to url
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const queryObj = qs.parse(location.search);
    const newQuery = { ...queryObj, tab: tabIndex };
    const newSearch = qs.stringify(newQuery);
    const newPath = `${location.pathname}?${newSearch}`;
    if (!isEqual(newPath, location.pathname)) {
      history.replace(newPath);
    }
  }, [tabIndex, history, location.pathname, location.search]);

  return (
    <Div
      className="visualizationTabs"
      css={`
        display: grid;
        place-items: center;
        grid-template-rows: auto 1fr;
        max-height: 100vh;
        .tabs {
          width: 100%;
          display: grid;
          height: ${TABS_HEIGHT}px;
          justify-content: start;
          box-shadow: 0px 2px 2px 0px #0000003d;
        }
      `}
    >
      <Tabs
        value={tabIndex}
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
        {process.env.NODE_ENV === "development" && (
          <Tab
            label={
              <Typography variant="button" color="textPrimary">
                Gallery
              </Typography>
            }
            {...a11yProps(2)}
          />
        )}
      </Tabs>
      <TabPanel value={tabIndex} index={TAB_INDICES.NETWORKGRAPH}>
        <NetworkGraph />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_INDICES.WORDCLOUD}>
        <Wordcloud />
      </TabPanel>
      {process.env.NODE_ENV === "development" && (
        <TabPanel value={tabIndex} index={TAB_INDICES.GALLERY}>
          <Gallery />
        </TabPanel>
      )}
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
