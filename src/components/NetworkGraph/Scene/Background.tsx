import { Environment } from "@react-three/drei";
import { shuffle } from "lodash";
import { Suspense } from "react";

const Background = ({ background }: { background: boolean }) => {
  // const isDaytime = getIsDaytime();
  return (
    <Suspense fallback={null}>
      <Environment
        background={background}
        path="/cubemap/"
        // files={shuffle(["kelp.hdr", "deepsea.hdr"])[0]} // * random background?
        files={"kelp.hdr"}
        // files={["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]}
      />
    </Suspense>
  );
};

export default Background;

// function getIsDaytime() {
//   var d = new Date();
//   var h = d.getHours();
//   if (h < 6 || h > 18) {
//     return false;
//   }
//   return true;
// }
