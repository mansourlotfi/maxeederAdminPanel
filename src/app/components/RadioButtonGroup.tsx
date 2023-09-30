import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface IProps {
  option: any[];
  onChange: (event: any) => void;
  selectedValue: string;
}
export default function RadioButtonGroup({
  option,
  onChange,
  selectedValue,
}: IProps) {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedValue}>
        {option.map(({ value, label }) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={label}
            key={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
