import { Button } from "@material-ui/core";
import styled from "styled-components/macro";

export const StyledButton = styled(Button)`
  ${(p) => p.css}
  text-transform: none !important;
`;
