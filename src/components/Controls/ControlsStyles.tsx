import styled from "styled-components/macro";
import { CUSTOM_SHRINKING_SCROLLBAR_CSS } from "../common/styledComponents";
import { CONTROLS_PADDING_INNER, FORM_HEIGHT } from "../../utils/constants";

const ControlsStyles = styled.div`
  ${CUSTOM_SHRINKING_SCROLLBAR_CSS}
  background: ${(props) => (props.isLight ? "hsl(0,0%,90%)" : "hsl(0,0%,15%)")};
  width: 100%;
  overflow: hidden auto;
  height: calc(100vh - 64px);
  display: grid;
  align-content: start;
  grid-gap: 18px;
  .section {
    display: grid;
  }

  button {
    width: fit-content;
    margin: auto;
    height: ${FORM_HEIGHT}px;
    min-width: 0;
  }
  .MuiFormControlLabel-root {
    margin-right: 0;
  }
  [class*="Checkboxes__RadioBtnsStyles"] {
    margin-right: -8px;
  }
  .checkboxes {
    display: grid;
    max-width: ${(props) => (props.isDrawerOpen ? 200 : FORM_HEIGHT)}px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  .MuiFormGroup-root {
    width: ${FORM_HEIGHT}px;
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
  .controlsContainer {
    width: 100%;
    display: grid;
    grid-auto-flow: row;
    justify-items: center;
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
