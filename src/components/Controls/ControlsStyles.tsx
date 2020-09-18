import styled from "styled-components/macro";
import { CUSTOM_SCROLLBAR_CSS } from "../common/styledComponents";
import { CONTROLS_PADDING_INNER, FORM_HEIGHT } from "../../utils/constants";

const ControlsStyles = styled.div`
  ${CUSTOM_SCROLLBAR_CSS}
  background: ${(props) => (props.isLight ? "hsl(0,0%,90%)" : "hsl(0,0%,15%)")};
  width: 100%;
  overflow: hidden auto;
  max-height: 100vh;
  display: grid;
  place-items: baseline;
  place-content: baseline;
  grid-gap: 72px;
  .section {
    display: grid;
    grid-gap: 12px;
  }
  input {
    margin: auto;
    height: ${FORM_HEIGHT};
  }
  button {
    width: calc(100% - 20px);
    margin: 0 10px;
    height: ${FORM_HEIGHT};
  }
  h5 {
    padding-bottom: 12px;
    margin-bottom: 12px;
    width: 100%;
    font-size: 1.5em;
    position: relative;
    text-align: left;
    &:after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: ${-CONTROLS_PADDING_INNER}px;
      right: ${-CONTROLS_PADDING_INNER}px;
      height: 1px;
      background: hsl(0, 12%, ${(props) => (props.isLight ? "20" : "50")}%);
    }
  }
  .MuiFormControl-root {
    height: 100%;
    width: 100%;
  }
  padding: ${CONTROLS_PADDING_INNER}px ${CONTROLS_PADDING_INNER + 2}px
    ${CONTROLS_PADDING_INNER}px ${CONTROLS_PADDING_INNER - 2}px;
  border-right: 1px solid black;
  [class*="TwoColRowStyles"] {
    width: 100%;
  }
  .diceIcon {
    transition: all 0.3s ease;
    animation: ${(props) =>
      props.isLoading ? "spin 0.8s ease-in-out infinite" : "none"};
    transform: scale(1.1);
  }
  @keyframes spin {
    from {
      transform: scale(1.1) rotate(0turn);
    }
    to {
      transform: scale(1.1) rotate(1turn);
    }
  }
`;

export default ControlsStyles;
