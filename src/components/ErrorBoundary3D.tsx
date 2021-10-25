import { Html } from "@react-three/drei";
import { Component } from "react";
import styled from "styled-components/macro";

const ErrorBoundaryStyles = styled.h1`
  padding: 6px;
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    background: none;
    border: none;
    text-decoration: underline;
    color: inherit;
    font-size: 100%;
    cursor: pointer;
    color: #1a0dab;
  }
`;

/** Sentry exposes a Sentry.ErrorBoundary component as well, if we want to send bounded errors to Sentry
 * https://docs.sentry.io/platforms/javascript/guides/react/#add-react-error-boundary
 */
export class ErrorBoundary extends Component<{
  ignore?: boolean;
  fallback?: React.ReactNode;
}> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, info: any) {
    if (!this.props.ignore) {
      console.log({ error, info });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html>
          <ErrorBoundaryStyles>
            {this.props.fallback || (
              <>
                Something went wrong --{" "}
                <button onClick={() => window.location.reload()}>
                  click to retry
                </button>
              </>
            )}
          </ErrorBoundaryStyles>
        </Html>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
