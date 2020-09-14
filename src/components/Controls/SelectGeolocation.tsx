import React, { useState } from "react";
import styled from "styled-components/macro";
import { useConfig } from "../../providers/store";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { useMount } from "../../utils/utils";
import { Modal, IconButton, Button, Input } from "@material-ui/core";
import LocationIcon from "@material-ui/icons/LocationOn";
import CloseIcon from "@material-ui/icons/Close";
import LocationOffIcon from "@material-ui/icons/LocationOff";

const Div = styled.div``;

const MODAL_PADDING = 50;

const MapContainerStyles = styled.div`
  position: relative;
  width: calc(100vw - ${2 * MODAL_PADDING}px);
  height: calc(100vw - ${2 * MODAL_PADDING}px);
  .btnClose {
    background: hsla(0, 0%, 100%, 0.7);
    position: absolute;
    top: -24px;
    right: -24px;
  }
  .btnConfirmLocation {
    background: hsla(100, 80%, 45%, 1);
    position: absolute;
    bottom: -24px;
    height: 48px;
    width: 300px;
    left: calc(50% - 150px);
    &:hover {
      background: hsla(100, 100%, 55%, 1);
    }
  }
`;

const SelectGeolocation = ({ google }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { geolocation: geo, setConfig } = useConfig();
  const [initialCenter, setInitialCenter] = useState({
    lat: geo ? (geo.latitude.left + geo.latitude.right) / 2 : 0,
    lng: geo ? (geo.longitude.left + geo.longitude.right) / 2 : 0,
  });
  const [currentGeo, setCurrentGeo] = useState(geo);

  useMount(() => {
    if (!geo) {
      navigator.geolocation.getCurrentPosition((res) => {
        setInitialCenter({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        });
      });
    }
  });

  const handleConfirmGeolocation = () => {
    setConfig({ geolocation: currentGeo });
    setIsModalOpen(false);
  };

  const onDragEnd = (mapProps, map) => {
    const bounds = map.getBounds();
    setCurrentGeo({
      latitude: { left: bounds.Va.i, right: bounds.Va.j },
      longitude: { left: bounds.Za.i, right: bounds.Za.j },
    });
  };

  return (
    <>
      <Div
        css={`
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
        `}
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Input
            style={{ pointerEvents: "none" }}
            value={geo ? `${JSON.stringify(geo)}` : "🗺 Geolocation"}
          />
        </Button>
        <IconButton
          className="btnClose"
          disabled={!geo}
          onClick={() => {
            setConfig({ geolocation: null });
          }}
        >
          {geo ? <LocationIcon /> : <LocationOffIcon />}
        </IconButton>
      </Div>

      <Modal
        style={{
          top: MODAL_PADDING,
          right: MODAL_PADDING,
          bottom: MODAL_PADDING,
          left: MODAL_PADDING,
        }}
        open={isModalOpen}
      >
        <MapContainerStyles>
          <Map
            google={google}
            style={{ width: "100%", height: "100%" }}
            initialCenter={initialCenter}
            onDragend={onDragEnd}
            onZoomChanged={onDragEnd}
          />
          <Button
            className="btnConfirmLocation"
            variant="contained"
            onClick={handleConfirmGeolocation}
            disabled={!currentGeo}
          >
            Select the current visible area
          </Button>
          <IconButton
            className="btnClose"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </MapContainerStyles>
      </Modal>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(SelectGeolocation);
