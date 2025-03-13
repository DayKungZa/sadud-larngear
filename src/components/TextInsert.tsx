import { TextField } from "@mui/material";

interface TextProps{
    field:string;
}

export default function TextInsert({field}:TextProps){
    return(
        <TextField
            name={field}
            label={field}
            variant="standard"
            fullWidth
            required
        />
    );
}