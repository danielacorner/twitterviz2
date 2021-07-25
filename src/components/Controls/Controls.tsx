import { useTheme } from "@material-ui/core";
import { useLoading } from "../../providers/store/useSelectors";
import SelectGeolocation from "./SelectGeolocation";
import { SelectCountry, SelectLanguage } from "./Dropdowns";
import {
  FilterLevelCheckboxes,
  MediaTypeCheckboxes,
  RecentPopularMixedRadioBtns,
} from "./Checkboxes";
import { ControlTitle } from "../common/TwoColRowStyles";
import ControlsStyles from "./ControlsStyles";
import { isLeftDrawerOpenAtom } from "providers/store/store";
import { useAtom } from "jotai";

export default function Controls() {
  const theme = useTheme();
  const loading = useLoading();
  const [isDrawerOpen] = useAtom(isLeftDrawerOpenAtom);
  return (
    <ControlsStyles
      isDrawerOpen={isDrawerOpen}
      isLoading={loading}
      isLight={theme.palette.type === "light"}
    >
      <div className="section">
        <ControlTitle>Recent / Popular</ControlTitle>
        <RecentPopularMixedRadioBtns />
      </div>
      <div className="section">
        <ControlTitle>Media Types</ControlTitle>
        <MediaTypeCheckboxes />
      </div>
      <div className="section">
        <ControlTitle>Content Filter</ControlTitle>
        <FilterLevelCheckboxes />
      </div>
      <div className="section" style={{ display: "grid", gridGap: 16 }}>
        <SelectLanguage />
        <SelectCountry />
        <SelectGeolocation />
      </div>
    </ControlsStyles>
  );
}
