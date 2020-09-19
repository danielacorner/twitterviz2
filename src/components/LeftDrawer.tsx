import React, { useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Controls from "./Controls/Controls";
import styled from "styled-components/macro";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      // transition: theme.transitions.create(["margin", "width"], {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth - theme.spacing(1),
      // transition: theme.transitions.create(["margin", "width"], {
      //   easing: theme.transitions.easing.easeOut,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },

    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: 0,
      // necessary for content to be below app bar
      // ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: 0,
      // transition: theme.transitions.create("margin", {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      marginLeft: -drawerWidth - theme.spacing(1) + 64,
    },
    contentShift: {
      // transition: theme.transitions.create("margin", {
      //   easing: theme.transitions.easing.easeOut,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
      marginLeft: 0,
    },
  })
);

const Div = styled.div``;

/** https://material-ui.com/components/drawers/#persistent-drawer */
export default function LeftDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(window.innerWidth > 600);
  const toggleOpen = () => {
    setOpen((p) => !p);
  };

  return (
    <Div
      css={`
        ${open
          ? ""
          : ".MuiPaper-root{ transform: translateX(-182px) !important }"}
        .btnChevron {
          position: absolute;
          top: 8px;
          right: 8px;
          transform: rotate(${open ? 0 : 180}deg);
        }
      `}
      className={classes.root}
    >
      <CssBaseline />

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        PaperProps={{
          style: {
            transform: `translateX(${open ? 0 : -170}px)`,
            visibility: "visible",
          },
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton className={"btnChevron"} onClick={toggleOpen}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Controls />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </Div>
  );
}
