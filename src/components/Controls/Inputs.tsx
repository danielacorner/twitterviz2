import React from "react";
import { TextField } from "@material-ui/core";
import { useConfig } from "../../providers/store/useConfig";
import { Body1 } from "../common/styledComponents";
import styled from "styled-components/macro";
export const Div = styled.div``;

// export function FetchUserTweetsForm() {
//   const [userHandle, setUserHandle] = useState("");

//   const { fetchTimelineByHandle, loading } = useFetchTimeline();

//   return (
//     <TwoColFormStyles
//       onSubmit={(e) => {
//         e.preventDefault();
//         fetchTimelineByHandle(userHandle);
//       }}
//     >
//       <InputStyles>
//         <Body1
//           style={{ color: "hsl(0,0%,50%)", marginBottom: 6, marginRight: 4 }}
//         >
//           @
//         </Body1>
//         <TextField
//           variant="outlined"
//           style={{ textAlign: "left", height: 36, marginTop: -32 }}
//           InputProps={{ style: { height: 36 } }}
//           label={"Fetch user..."}
//           value={userHandle}
//           onChange={(e) => setUserHandle(e.target.value)}
//           type="text"
//         />
//       </InputStyles>
//       <Button
//         variant="contained"
//         color="primary"
//         disabled={loading || !userHandle}
//         type="submit"
//       >
//         <SearchIcon />
//       </Button>
//     </TwoColFormStyles>
//   );
// }

export function HowManyTweets() {
  const { numTweets, setConfig } = useConfig();

  return (
    <Div
      css={`
        .MuiFormLabel-root {
          white-space: nowrap;
        }
        display: flex;
        align-items: baseline;
      `}
    >
      <Body1>Fetch</Body1>
      <TextField
        style={{ width: 60, padding: "0 10px" }}
        value={numTweets}
        onChange={(e) => setConfig({ numTweets: +e.target.value })}
        type="number"
        inputProps={{
          step: 10,
          min: 1,
          max: 500,
        }}
      />
      <Body1>tweet{numTweets === 1 ? "" : "s"} from...</Body1>
    </Div>
  );
}
