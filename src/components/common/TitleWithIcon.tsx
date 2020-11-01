import React from "react";
import { Grid, Typography } from "@material-ui/core";

export function TitleWithIcon({ title, icon }: any) {
  return (
    <Grid container={true} spacing={2} alignItems="center">
      <Grid item={true}>{icon}</Grid>
      <Grid item={true}>
        <Typography gutterBottom={true}>{title}</Typography>
      </Grid>
    </Grid>
  );
}
