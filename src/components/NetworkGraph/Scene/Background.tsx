import { Environment } from "@react-three/drei";
import { Suspense } from "react";

const Background = ({ background }: { background: boolean }) => {
  return (
    <Suspense fallback="null">
      <Environment
        background={background}
        path="/cubemap/"
        // files={"KelpForestTrue.hdr"}
        files={"maxresdefault.hdr"}
        // files={"spacehdr.hdr"}
      />
    </Suspense>
  );
};

export default Background;
