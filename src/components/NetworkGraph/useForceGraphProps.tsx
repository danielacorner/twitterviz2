import { CONTROLS_WIDTH, COLOR_BY } from "../../utils/constants";
import { getMediaArr } from "../../utils/utils";
import * as THREE from "three";
import * as d3 from "d3";
import { Tweet } from "../../types";
import { useCallback, useRef } from "react";
// https://www.npmjs.com/package/react-force-graph
import { useWindowSize } from "../../utils/hooks";
import {
  useConfig,
  useSetTooltipNode,
  useSetSelectedNode,
} from "../../providers/store";

const NODE_SIZE = 25;

/** https://www.npmjs.com/package/react-force-graph */

const DEFAULT_NODE_COLOR = "steelblue";

export function useForceGraphProps() {
  const { is3d, colorBy, allowedMediaTypes } = useConfig();

  const setTooltipNode = useSetTooltipNode();
  const setSelectedNode = useSetSelectedNode();

  const fgRef = useRef();

  const onBackgroundClick = () => {
    setSelectedNode(null);
    setTooltipNode(null);
  };

  const { width, height } = useWindowSize();
  const onNodeHover = useCallback(
    (node) => {
      if (node) {
        setTooltipNode(node);
      }
    },
    [setTooltipNode]
  );
  // on click, open the bottom drawer containing tweet info
  const onNodeClick = useCallback(
    (node) => {
      setSelectedNode(node);
      setTooltipNode(null);
    },
    [setSelectedNode, setTooltipNode]
  );
  const forceGraphProps = {
    width: width - CONTROLS_WIDTH,
    height,
    onNodeHover,
    onNodeClick,
    cooldownTime: is3d ? 10000 : 1000,
    nodeRelSize: NODE_SIZE,
    nodeColor: (node) => getNodeColor(node, colorBy),

    onEngineStop: () =>
      fgRef.current && !is3d ? (fgRef.current as any).zoomToFit(400) : null,
    ...(colorBy === COLOR_BY.profilePhoto
      ? // show profile photo
        {
          nodeCanvasObject: (node, ctx) => {
            const img = new Image(NODE_SIZE, NODE_SIZE);
            img.src = node.user.profile_image_url_https;
            ctx.drawImage(img, node.x, node.y);
          },
        }
      : colorBy === COLOR_BY.media
      ? // show media
        {
          nodeCanvasObject: (node, ctx) => {
            const mediaArr = getMediaArr(node);
            if (!mediaArr[0]) {
              // draw a circle if there's no media

              ctx.beginPath();
              ctx.arc(node.x, node.y, NODE_SIZE / 2, 0, Math.PI * 2);
              // stroke styles https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
              ctx.strokeStyle = "cornflowerblue";
              ctx.stroke();
            } else {
              const image = mediaArr[0];
              const small = image.sizes.small;
              const hwRatio = small.h / small.w;
              const imgHeight = NODE_SIZE * hwRatio * 2;
              const imgWidth = NODE_SIZE * 2;

              // show the first image/video preview

              const ctxImg = new Image(imgWidth, imgHeight);
              ctxImg.src = image.poster || image.src;

              // drawImage https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
              ctx.drawImage(
                ctxImg,
                node.x - imgWidth / 2,
                node.y - imgHeight / 2,
                imgWidth,
                imgHeight
              );
            }
          },
        }
      : {}),
    nodeThreeObject:
      colorBy === COLOR_BY.mediaType
        ? null
        : colorBy === COLOR_BY.media
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

    onBackgroundClick,
  };
  return { fgRef, forceGraphProps };
}

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
