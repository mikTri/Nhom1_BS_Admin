import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const DropdownBox = ({ handleChange, roles, value }) => {
    const [role, setRole] = React.useState(value);  //cập nhật useState ban đầu của role trong DropdownBox để nhận giá trị từ props value, nếu không sẽ không thể hiển thị giá trị đã chọn ban đầu.

    const handleSelectChange = (event) => {
        const selectedRole = event.target.value;
        setRole(selectedRole);
        handleChange(event);
    };

    return (
        <Box sx={{ minWidth: 120 }} className="dropbox w-100">
            <FormControl size="small" className="w-100">
                <Select
                    className="w-100"
                    labelId="staffRole-selection-label"
                    id="staffRole-selection"
                    value={value}
                    onChange={handleSelectChange}
                >
                    {roles.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name} ({item.id})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}


export default DropdownBox;
