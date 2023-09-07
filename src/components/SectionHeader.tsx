import {FC} from "react";
import {Typography} from "@mui/material";

export const SectionHeader: FC<{ title: string }> = ({title}) => {
    return (
        <div>
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    margin: (theme) => theme.spacing(1, 0, 1),
                }
                }
            >
                {title}</Typography>

        </div>
    );
};