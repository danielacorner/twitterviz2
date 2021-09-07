import styled from "styled-components/macro";
import { Dialog, IconButton } from "@material-ui/core";
import { colorLink, darkBackground } from "utils/colors";
import ReactPlayer from "react-player";
import { CUSTOM_SCROLLBAR_CSS } from "components/RightDrawer/CUSTOM_SCROLLBAR_CSS";
import { Close } from "@material-ui/icons";
const VOTE_LEAVE_BREXIT_BOTNET = {
  title: `The Brexit Botnet and User-Generated Hyperpartisan News`,
  description: `(Page 50 Figure 4) Two-tiered botnet, with bots specialized in retweeting active users and bots dedicated to retweeting other bots.
Vertice and edge color identify source of information.`,
  url: "https://journals.sagepub.com/doi/pdf/10.1177/0894439317734157",
  imageUrl:
    "data:image/jpeg;base64,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",
};
const BREXIT_BOTNET = {
  title: `Brexit Botnet`,
  description: `The image shows the interaction on Twitter between bots and real users during the UK EU membership referendum. Bots or automated accounts are often used as sockpuppets, which are false online identities used to voice opinions and manipulate public opinion while pretending to be another person. The hub and spoke formations shown in the network result from the large volume of retweets triggered by bots, which are effective at rapidly generating cascades.`,
  url: "https://city.figshare.com/articles/figure/Brexit_Botnet/6955253/1",
  imageUrl:
    "https://s3-eu-west-1.amazonaws.com/ppreviews-city-127369554970/12754466/preview.jpg",
};
const LEARN_MORE_IMAGE_LINKS = [VOTE_LEAVE_BREXIT_BOTNET, BREXIT_BOTNET];
export function LearnMoreResources({ handleClose, isLearnMoreOpen }) {
  return (
    <DialogStyles>
      <Dialog
        PaperProps={{ style: { background: "none" } }}
        open={isLearnMoreOpen}
      >
        <LearnMoreStyles>
          {/* <div className="learnMoreTitle">More about twitter bots</div> */}
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
          {LEARN_MORE_IMAGE_LINKS.map(
            ({ title, description, url, imageUrl }) => (
              <div className="learnMoreRow">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <div className="title" style={{ marginBottom: 12 }}>
                    {title}
                  </div>
                  <img style={{ width: "100%" }} src={imageUrl} alt="" />
                </a>
                <div className="description">
                  <pre>{description}</pre>
                </div>
              </div>
            )
          )}
          <IconButton className="btnClose" onClick={handleClose}>
            <Close />
          </IconButton>
        </LearnMoreStyles>
      </Dialog>
    </DialogStyles>
  );
}
export const SOCIAL_MEDIA_PSYOPS = {
  title: "Secrets of Social Media PsyOps - BiaSciLab",
  description: `Psychological Warfare through social media is one of the most powerful weapons in today's political battlefield. PsyOps groups have figured out how to sharpen the blade through algorithms and targeted advertising. Nation states are using PsyOps to influence the citizens of their enemies, fighting battles from behind the keyboard.

In this talk, BiaSciLab with cover a brief history of PsyOps and how it has been used both on the battlefield and the political stage. Followed by a dive deep into how it works on the mind and how PsyOps groups are using social media to influence the political climate and elections worldwide.`,
  url: "https://www.youtube.com/watch?v=6pse_lOyT14",
};
export const DONT_AT_ME = {
  title: "Don't @ Me: Hunting Twitter Bots at Scale",
  description: `In this talk, we explore the economy around Twitter bots, as well as demonstrate how attendees can track down bots in through a three step methodology: building a dataset, identifying common attributes of bot accounts, and building a classifier to accurately identify bots at scale.

  By Jordan Wright + Olabode Anise`,
  url: "https://www.youtube.com/watch?v=bQsRg0VsYoo",
};

const LEARN_MORE_RESOURCES = [SOCIAL_MEDIA_PSYOPS, DONT_AT_ME];

const DialogStyles = styled.div``;
const LearnMoreStyles = styled.div`
  .learnMoreTitle {
    font-family: "Roboto", sans-serif;
    font-size: 2em;
    color: #fff;
    margin: 0 auto 2em;
  }
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
  .learnMoreRow {
  }
`;
