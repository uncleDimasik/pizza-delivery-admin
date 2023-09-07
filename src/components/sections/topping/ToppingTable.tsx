import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {ToppingQuery, ToppingsQuery, useRemoveToppingMutation, useToppingsQuery} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export const ToppingTable = () => {
    const {data, loading, refetch} = useToppingsQuery()
    const navigate = useNavigate()
    const [deleteTopping] = useRemoveToppingMutation();
    const handleAdd = () => {
        navigate(Paths.TOPPING_ADD)
    };

    const handleDelete = (data: ToppingQuery['topping']) => {
        if (confirm('Delete?')) {
            deleteTopping({
                variables: {
                    where: {
                        id: data.id
                    }
                }
            }).then(() => refetch())
        }

    };

    const handleEdit = (data: ToppingQuery['topping']) => {
        navigate(`${Paths.TOPPING_EDIT_BASE}${data.id}`)
    };

    const renderTableRow = (data: ToppingsQuery) => {
        if (data.toppings.length !== 0) {
            return (
                <>
                    {data.toppings.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell align="center">{item.option.name}</TableCell>
                            <TableCell align="center">{item.option.price}</TableCell>
                            <TableCell align="center">{item.ingredientLabel.name}</TableCell>
                            <TableCell align="center"> <img
                                src={`${item.ingredientLabel.image}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.ingredientLabel.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.ingredientLabel.name}
                                loading="lazy"
                            /></TableCell>
                            <TableCell align="center">{item.price}</TableCell>
                            <TableCell align="right">
                                <Box display="flex" alignItems="center">
                                    <Tooltip title="Delete news">
                                        <IconButton
                                            aria-label="block"
                                            onClick={() => {
                                                handleDelete(item);
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
                                                handleEdit(item);
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
            <SectionHeader title="Toppings list"/>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdd}
            >
                Add Topping
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="center">Option name</TableCell>
                        <TableCell align="center">Option price</TableCell>
                        <TableCell align="center">Ingredient name</TableCell>
                        <TableCell align="center">IngredientImage</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="right"> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderTableRow(data)}</TableBody>
            </Table>
        </>}
        </>

    );
};

