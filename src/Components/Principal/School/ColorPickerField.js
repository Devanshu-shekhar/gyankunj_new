import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
    Grid,
    TextField,
    InputAdornment,
    Box,
    ClickAwayListener,
    Popper,
} from '@mui/material';
import { SketchPicker } from 'react-color';

const ColorPickerField = ({ name, label, control }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <ClickAwayListener onClickAway={handleClose}>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            label={label}
                            fullWidth
                            value={field.value}
                            onClick={handleClick}
                            onChange={(e) => field.onChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                backgroundColor: field.value,
                                                borderRadius: '4px',
                                                border: '1px solid #999',
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
                            <Box sx={{ zIndex: 9999 }}>
                                <SketchPicker
                                    color={field.value}
                                    onChangeComplete={(color) => field.onChange(color.hex)}
                                />
                            </Box>
                        </Popper>
                    </Box>
                </ClickAwayListener>
            )}
        />
    );
};

export default ColorPickerField;
