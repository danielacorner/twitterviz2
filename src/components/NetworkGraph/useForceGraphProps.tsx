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
  useAllowedMediaTypes,
  useTooltipNode,
} from "../../providers/store";
import { useIsLight } from "../../providers/ThemeManager";

export const NODE_DIAMETER = 25;
const AVATAR_DIAMETER = NODE_DIAMETER * 2;

/** https://www.npmjs.com/package/react-force-graph */

const DEFAULT_NODE_COLOR = "steelblue";

export function useForceGraphProps() {
  const { is3d, colorBy, isGridMode, showUserNodes } = useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const setTooltipNode = useSetTooltipNode();
  const tooltipNode = useTooltipNode();
  const setSelectedNode = useSetSelectedNode();
  const isLightTheme = useIsLight();
  console.log("🌟🚨: useForceGraphProps -> isLightTheme", isLightTheme);
  const fgRef = useRef();

  const onBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setTooltipNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    d3VelocityDecay: 0.7,
    d3AlphaDecay: 0.01,
    // warmupTicks: 10,
    // cooldownTicks: 10,
    // nodeAutoColorBy: "group",
    cooldownTime: (isGridMode ? 200 : 400) * (showUserNodes ? 2 : 1),
    nodeRelSize: NODE_DIAMETER,
    nodeColor: (node) => getNodeColor(node, colorBy),
    onEngineStop: () =>
      fgRef.current && !is3d ? (fgRef.current as any).zoomToFit(400) : null,
    nodeCanvasObject: (node, ctx) => {
      if (tooltipNode?.id_str === node.id_str) {
        drawHighlightCircle(node, ctx);
      }

      if (colorBy === COLOR_BY.profilePhoto || node.isUserNode) {
        // show profile photo
        drawProfilePhoto(node, ctx);
      } else if (colorBy === COLOR_BY.media) {
        // show media
        const mediaArr = getMediaArr(node);
        if (!mediaArr[0]) {
          // draw an empty circle if there's no media
          ctx.beginPath();
          ctx.arc(node.x, node.y, NODE_DIAMETER / 2, 0, Math.PI * 2);
          // stroke styles https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
          ctx.strokeStyle = "cornflowerblue";
          ctx.stroke();
        } else {
          const image = mediaArr[0];
          const small = image.sizes.small;
          const hwRatio = small.h / small.w;
          const imgHeight = NODE_DIAMETER * hwRatio * 2;
          const imgWidth = NODE_DIAMETER * 2;

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
      } else {
        // draw circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_DIAMETER / 2, 0, Math.PI * 2);
        // stroke styles https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
        ctx.fillStyle = getNodeColor(node, colorBy);
        ctx.fill();
      }
    },
    linkWidth: 1,
    backgroundColor: "transparent",
    linkColor: ({ source, target }) => {
      const LIGHTGREY = "#D3D3D3";
      const DARKGREY = "#a9a9a9";
      const userToTweetColor = LIGHTGREY;
      // TODO: link by likes
      // TODO: link by replies
      // TODO: link by retweets
      const other = DARKGREY;
      return source.isUserNode ? userToTweetColor : other;
    },
    // linkOpacity: 0.2,
    // linkDirectionalArrowLength: 8,
    // linkDirectionalArrowRelPos: 1,
    nodeThreeObject:
      colorBy === COLOR_BY.mediaType
        ? null
        : colorBy === COLOR_BY.media
        ? (node: Tweet) => {
            const mediaArr = getMediaArr(node);
            const first = mediaArr[0];
            if (!allowedMediaTypesStrings.includes(first?.type)) {
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

    enableZoomPanInteraction: true,
    enableNavigationControls: true,
    onLinkHover: (link, prevLink) => {},
    enablePointerInteraction: /* tweets.length<500 */ true,
    enableNodeDrag: true,
  };

  return { fgRef, forceGraphProps };
}

function drawHighlightCircle(node: any, ctx: any) {
  // circle
  ctx.beginPath();
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
  ctx.arc(
    node.x, // x: The horizontal coordinate of the arc's center.
    node.y, // y: The vertical coordinate of the arc's center.
    AVATAR_DIAMETER / 2, // radius
    0, // startAngle
    Math.PI * 2 // endAngle
  );
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  /*
   * restore() restores the canvas context to its original state
   * before we defined the clipping region
   */
  // ctx.restore();
  // ctx.beginPath();
  // ctx.arc(node.x, node.y, AVATAR_DIAMETER / 2, 0, 2 * Math.PI, false);
  // ctx.lineWidth = 10;
  // ctx.strokeStyle = "blue";
  // ctx.stroke();
  // ctx.clip();
  // ctx.closePath();
  // ctx.clip();
  // ctx.fill();
}

// https://codesandbox.io/s/distracted-nash-4251j?file=/src/index.js
function drawProfilePhoto(node: any, ctx: any) {
  const img = new Image(AVATAR_DIAMETER, AVATAR_DIAMETER);
  img.src = node.user.profile_image_url_https;
  ctx.save();

  // circle
  ctx.beginPath();
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
  ctx.arc(
    node.x, // x: The horizontal coordinate of the arc's center.
    node.y, // y: The vertical coordinate of the arc's center.
    AVATAR_DIAMETER / 2, // radius
    0, // startAngle
    Math.PI * 2 // endAngle
  );
  ctx.clip();

  // photo

  // execute drawImage statements here
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  ctx.drawImage(
    img,
    node.x - AVATAR_DIAMETER / 2, // dx: The x-axis coordinate in the destination canvas at which to place the top-left corner of the source
    node.y - AVATAR_DIAMETER / 2, // dy: The y-axis coordinate in the destination canvas at which to place the top-left corner of the source
    AVATAR_DIAMETER, // dWidth: The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn.
    AVATAR_DIAMETER // dHeight: The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn.
  );
}

function getNodeColor(node, colorBy) {
  switch (colorBy) {
    case COLOR_BY.mediaType:
      const type = node.extended_entities?.media[0].type;
      return type === "video"
        ? "tomato"
        : type === "photo"
        ? "limegreen"
        : type === "animated_gif"
        ? "wheat"
        : DEFAULT_NODE_COLOR;

    case COLOR_BY.sentiment:
      const scale = d3.scaleSequential(d3.interpolatePiYG).domain([-1, 1]);

      return scale(node.sentimentResult?.comparative) as string;

    default:
      return DEFAULT_NODE_COLOR;
  }
}
