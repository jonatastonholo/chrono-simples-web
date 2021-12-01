import * as React from 'react';
import {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {IComboBoxValue} from "../domain/IComboBoxValue";

type props = {
  label: string;
  helperText?: string;
  onSelect: (value: any) => void;
  values: IComboBoxValue[];
  defaultValue?: IComboBoxValue | undefined;
};

export default function ComboBox({label, values, helperText, onSelect, defaultValue} : props) {
  const [selected, setSelected] = React.useState("");

  useEffect(() => {
    (() => {
      if (!!defaultValue) setSelected(defaultValue.objectId)
    })();
  }, [defaultValue]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="select-helper-label">{label}</InputLabel>
        <Select
          labelId="select-helper-label"
          id="simple-select-helper"
          value={selected}
          label={label}
          onChange={handleChange}
          defaultValue={defaultValue?.objectValue}
        >
          {values.map((value, index) => {
            return (
              <MenuItem key={index} value={value.objectId}>{value.objectValue}</MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}
