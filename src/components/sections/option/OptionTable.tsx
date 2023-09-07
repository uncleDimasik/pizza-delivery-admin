import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {
    OptionQuery,
    OptionsQuery,
    useOptionsQuery,
    useRemoveOptionMutation
} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export const OptionTable = () => {
    const {data, loading, refetch} = useOptionsQuery()
    const navigate = useNavigate()
    const [deleteIngredient] = useRemoveOptionMutation();
    const handleAddIngredient = () => {
        navigate(Paths.OPTION_ADD)
    };

    const handleDeleteIngredient = (data: OptionQuery['option']) => {
        if (confirm('Delete?')) {
            deleteIngredient({
                variables: {
                    where: {
                        id: data.id
                    }
                }
            }).then(() => refetch())
        }

    };

    const handleEditIngredient = (data: OptionQuery['option']) => {
        navigate(`${Paths.OPTION_EDIT_BASE}${data.id}`)
    };

    const renderTableRow = (data: OptionsQuery) => {
        if (data.options.length !== 0) {
            return (
                <>
                    {data.options.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell align="center">{item.name}</TableCell>
                            <TableCell align="center">{item.price}</TableCell>
                            <TableCell align="center">{item.updatedAt}</TableCell>
                            <TableCell align="right">
                                <Box display="flex" alignItems="center">
                                    <Tooltip title="Delete news">
                                        <IconButton
                                            aria-label="block"
                                            onClick={() => {
                                                handleDeleteIngredient(item);
                                            }}
                                            style={{color: 'red'}}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit news">
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => {
                                                handleEditIngredient(item);
                                            }}
                                        >
                                            <MoreVertIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </>
            );
        }
        return null;
    };

    if (loading) {
        return null
    }

    return (
        <>        {data && <>
            <SectionHeader title="Options list"/>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddIngredient}
            >
                Add Option
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Updated at</TableCell>
                        <TableCell align="right"> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderTableRow(data)}</TableBody>
            </Table>
        </>}
        </>

    );
};

