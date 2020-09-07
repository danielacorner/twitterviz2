import React, { useState } from "react";
import styled from "styled-components/macro";
import { useConfig } from "../../providers/store";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { useMount } from "../../utils/utils";
import { Modal, IconButton, Button } from "@material-ui/core";
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
    background: hsla(100, 80%, 45%, 0.9);
    position: absolute;
    top: -24px;
    right: -24px;
  }
`;

const SelectGeolocation = ({ google }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { geolocation, setConfig } = useConfig();
  const [initialCenter, setInitialCenter] = useState({
    lat: geolocation?.latitude || 0,
    lng: geolocation?.longitude || 0,
  });

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

  const handleConfirmGeolocation = () => {};

  return (
    <>
      <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
        Select Geolocation
      </Button>

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
          />
          <Button
            className="btnConfirmLocation"
            variant="contained"
            onClick={handleConfirmGeolocation}
          >
            Filter to within the visible area
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
