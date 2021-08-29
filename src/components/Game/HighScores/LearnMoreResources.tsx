import styled from "styled-components/macro";
import { Dialog, IconButton } from "@material-ui/core";
import { colorLink, darkBackground } from "utils/colors";
import ReactPlayer from "react-player";
import { CUSTOM_SCROLLBAR_CSS } from "components/RightDrawer/CUSTOM_SCROLLBAR_CSS";
import { Close } from "@material-ui/icons";

export function LearnMoreResources({ handleClose, isLearnMoreOpen }) {
  return (
    <DialogStyles>
      <Dialog
        PaperProps={{ style: { background: "none" } }}
        open={isLearnMoreOpen}
      >
        <LearnMoreStyles>
          {LEARN_MORE_RESOURCES.map(({ title, description, url }) => (
            <div className="learnMoreRow" key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <div className="title">{title}</div>
                <div className="player">
                  <ReactPlayer className="reactPlayer" url={url} height={200} />
                </div>
                <div className="description">
                  <pre>{description}</pre>
                </div>
              </a>
            </div>
          ))}
          <IconButton className="btnClose" onClick={handleClose}>
            <Close />
          </IconButton>
        </LearnMoreStyles>
      </Dialog>
    </DialogStyles>
  );
}
const LEARN_MORE_RESOURCES = [
  {
    title: "Secrets of Social Media PsyOps - BiaSciLab",
    description: `Psychological Warfare through social media is one of the most powerful weapons in today's political battlefield. PsyOps groups have figured out how to sharpen the blade through algorithms and targeted advertising. Nation states are using PsyOps to influence the citizens of their enemies, fighting battles from behind the keyboard.

In this talk, BiaSciLab with cover a brief history of PsyOps and how it has been used both on the battlefield and the political stage. Followed by a dive deep into how it works on the mind and how PsyOps groups are using social media to influence the political climate and elections worldwide.`,
    url: "https://www.youtube.com/watch?v=6pse_lOyT14",
  },
  {
    title: "Don't @ Me: Hunting Twitter Bots at Scale",
    description: `In this talk, we explore the economy around Twitter bots, as well as demonstrate how attendees can track down bots in through a three step methodology: building a dataset, identifying common attributes of bot accounts, and building a classifier to accurately identify bots at scale.

By Jordan Wright + Olabode Anise`,
    url: "https://www.youtube.com/watch?v=bQsRg0VsYoo",
  },
];

const DialogStyles = styled.div``;
const LearnMoreStyles = styled.div`
  border-radius: 16px;
  overflow: hidden;
  ${CUSTOM_SCROLLBAR_CSS}
  padding: 2em;
  background: ${darkBackground};
  a {
    text-decoration: none;
    color: ${colorLink};
    &:hover {
      opacity: 0.9;
    }
  }
  .title {
    text-align: center;
    font-size: 1.6em;
    font-family: "Poiret One", cursive;
  }
  .player {
    width: 100%;
    margin: 1em auto;
    display: grid;
    justify-items: center;
    .reactPlayer {
      width: 100% !important;
    }
  }
  .description {
    color: white;
    margin-bottom: 3em;
    pre {
      font-size: 14px;
      white-space: pre-wrap;
      font-family: "Roboto", sans-serif;
    }
  }
  .btnClose {
    position: absolute;
    top: 0px;
    right: 0px;
    color: white;
  }
`;
