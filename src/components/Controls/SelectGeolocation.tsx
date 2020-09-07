import React, { useState } from "react";
import styled from "styled-components/macro";
import { useConfig } from "../../providers/store";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { useMount } from "../../utils/utils";
import { Modal, IconButton, Button, TextareaAutosize } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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
  const { geolocation, setConfig } = useConfig();
  const [initialCenter, setInitialCenter] = useState({
    lat: geolocation
      ? (geolocation.latitude.left + geolocation.latitude.right) / 2
      : 0,
    lng: geolocation
      ? (geolocation.longitude.left + geolocation.longitude.right) / 2
      : 0,
  });
  const [currentGeolocation, setCurrentGeolocation] = useState(geolocation);

  useMount(() => {
    if (!geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        setInitialCenter({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        });
      });
    }
  });

  const handleConfirmGeolocation = () => {
    setConfig({ geolocation: currentGeolocation });
    setIsModalOpen(false);
  };

  const onDragEnd = (mapProps, map) => {
    const bounds = map.getBounds();
    setCurrentGeolocation({
      latitude: { left: bounds.Va.i, right: bounds.Va.j },
      longitude: { left: bounds.Za.i, right: bounds.Za.j },
    });
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
        Select Geolocation
      </Button>
      <TextareaAutosize
        style={{ resize: "none" }}
        value={`${JSON.stringify(geolocation)}`}
      />

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
          />
          <Button
            className="btnConfirmLocation"
            variant="contained"
            onClick={handleConfirmGeolocation}
            disabled={!currentGeolocation}
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
