import { CONTROLS_WIDTH, COLOR_BY } from "../../utils/constants";
import { getMediaArr } from "../../utils/utils";
import * as THREE from "three";
import * as d3 from "d3";
import { Tweet } from "../../types";

export function getForceGraphProps(
  width: any,
  height: any,
  onNodeHover: (node: any) => void,
  onNodeClick: (node: any) => void,
  is3d: any,
  colorBy: any,
  fgRef: React.MutableRefObject<undefined>,
  allowedMediaTypes: any
) {
  return {
    width: width - CONTROLS_WIDTH,
    height,
    onNodeHover,
    onNodeClick,
    cooldownTime: is3d ? 10000 : 5000,
    nodeRelSize: 25,
    nodeColor: (node) => getNodeColor(node, colorBy),

    onEngineStop: () =>
      fgRef.current && !is3d ? (fgRef.current as any).zoomToFit(400) : null,

    // nodeCanvasObject: (node, ctx, scale) => {
    //   const mediaArr = getMediaArr(node);
    //   const imageObj1 = new Image();
    //   if (!mediaArr[0]) {
    //     ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    //     return;
    //   }
    //   imageObj1.src = mediaArr[0].poster || mediaArr[0].src;
    //   imageObj1.onload = function () {
    //     ctx.drawImage(imageObj1, 0, 0);
    //   };
    //   return mediaArr[0] ? ctx.drawImage(imageObj1, 10, 10) : null;
    // },
    // nodeCanvasObjectMode: () => "after" as any,
    nodeThreeObject:
      colorBy === COLOR_BY.mediaType
        ? (node: Tweet) => {
            const mediaArr = getMediaArr(node);
            const first = mediaArr[0];
            if (!allowedMediaTypes.includes(first?.type)) {
              return null;
            }
            const imgSrc = node.isUserNode
              ? node.user.profile_image_url_https
              : first?.poster || first?.src;

            const imgTexture = new THREE.TextureLoader().load(imgSrc);
            const color = new THREE.Color(
              node.isUserNode
                ? "hsl(200,100%,75%)"
                : first?.type === "video"
                ? "hsl(10,100%,80%)"
                : "hsl(120,100%,80%)"
            );
            const material = new THREE.SpriteMaterial({
              map: imgTexture,
              color,
            });
            const sprite = new THREE.Sprite(material);
            const scaleDown = 0.35;
            const { h, w, d } = node.isUserNode
              ? {
                  h: 48,
                  w: 48,
                  d: 48,
                }
              : {
                  h: first?.sizes.small.h * scaleDown,
                  w: first?.sizes.small.w * scaleDown,
                  d: 0,
                };
            sprite.scale.set(w, h, d);

            return sprite;
          }
        : colorBy === COLOR_BY.profilePhoto
        ? (node) => {
            const imgSrc = node.user.profile_image_url_https;
            const imgTexture = new THREE.TextureLoader().load(imgSrc);
            const color = new THREE.Color("hsl(10,100%,100%)");
            const material = new THREE.SpriteMaterial({
              map: imgTexture,
              color,
            });
            const sprite = new THREE.Sprite(material);
            const { h, w, d } = {
              h: 48,
              w: 48,
              d: 0,
            };
            sprite.scale.set(w, h, d);

            return sprite;
          }
        : null,
  };
}

const DEFAULT_NODE_COLOR = "steelblue";

function getNodeColor(node, colorBy) {
  switch (colorBy) {
    case COLOR_BY.mediaType:
      const type = node.extended_entities?.media[0].type;
      return type === "video"
        ? "tomato"
        : type === "photo"
        ? "limegreen"
        : DEFAULT_NODE_COLOR;

    case COLOR_BY.sentiment:
      const scale = d3.scaleSequential(d3.interpolatePiYG).domain([-1, 1]);

      return scale(node.sentimentResult?.comparative) as string;

    default:
      return DEFAULT_NODE_COLOR;
  }
}
