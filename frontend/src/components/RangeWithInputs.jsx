import { Slider, Box, TextField } from '@mui/material';

const RangeWithInputs = ({ label, minValue, maxValue, formState, handleSliderChange, handleInputChange, initialFormState }) => (
  <Box sx={{ width: 200, marginTop: 2 }}>
    <label>{label}</label>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Slider
        value={[formState[minValue], formState[maxValue]]}
        onChange={(e, newValue) => handleSliderChange(label, newValue)}
        valueLabelDisplay="auto"
        min={initialFormState[minValue]}
        max={initialFormState[maxValue]}
        sx={{
          '& .MuiSlider-thumb': {
            width: 13,
            height: 13,
            backgroundColor: 'primary.main',
          }
        }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          type="number"
          value={formState[minValue]}
          onChange={(e) => handleInputChange(minValue, e.target.value)}
          size="small"
          sx={{ width: 70 }}
        />
        <TextField
          type="number"
          value={formState[maxValue]}
          onChange={(e) => handleInputChange(maxValue, e.target.value)}
          size="small"
          sx={{ width: 70 }}
        />
      </Box>
    </Box>
  </Box>
);

export default RangeWithInputs;