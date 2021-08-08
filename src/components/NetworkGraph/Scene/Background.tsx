import { Environment } from "@react-three/drei";
import { Suspense } from "react";

const Background = ({ background }: { background: boolean }) => {
  const isDaytime = getIsDaytime();
  return (
    <Suspense fallback={null}>
      <Environment
        background={background}
        path="/cubemap/"
        files={isDaytime ? "maxresdefault.hdr" : "deepsea.hdr"}
        // files={"maxresdefault.hdr"}
      />
    </Suspense>
  );
};

export default Background;

function getIsDaytime() {
  var d = new Date();
  var h = d.getHours();
  if (h < 6 || h > 18) {
    return false;
  }
  return true;
}
