import React from "react";
import { MenuItem, Select } from "@material-ui/core";
import countryCodes from "../../utils/countryCodes";
import languages from "../../utils/languages";
import { useConfig } from "../../providers/store/useConfig";
import { ControlTitle, TwoColRowStyles } from "../common/TwoColRowStyles";

export function SelectLanguage() {
  const { setConfig, lang } = useConfig();
  return (
    <TwoColRowStyles>
      <ControlTitle className="inputLabel">Language</ControlTitle>
      <Select
        labelId="language"
        onChange={(event) => {
          setConfig({ lang: String(event.target.value) });
        }}
        value={lang}
      >
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>
        {languages.map(({ code, name }) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </TwoColRowStyles>
  );
}

export function SelectCountry() {
  const { countryCode, setConfig } = useConfig();
  return (
    <TwoColRowStyles>
      <ControlTitle className="inputLabel">Country</ControlTitle>
      <Select
        labelId="location"
        onChange={(event) => {
          setConfig({ countryCode: event.target.value as string });
        }}
        value={countryCode}
      >
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>
        {Object.entries(countryCodes).map(([code, countryName]) => (
          <MenuItem key={code} value={code}>
            {countryName}
          </MenuItem>
        ))}
      </Select>
    </TwoColRowStyles>
  );
}
