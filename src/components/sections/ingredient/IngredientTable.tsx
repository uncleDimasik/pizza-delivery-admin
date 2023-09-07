import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {
IngredientQuery, IngredientsQuery,
    useIngredientsQuery,
    useRemoveIngredientMutation
} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export const IngredientTable = () => {
    const {data, loading, refetch} = useIngredientsQuery()
    const navigate = useNavigate()
    const [deleteIngredient] = useRemoveIngredientMutation();
    const handleAddIngredient = () => {
        navigate(Paths.INGREDIENT_ADD)
    };

    const handleDeleteIngredient = (data: IngredientQuery['ingredient']) => {
        if (confirm('Delete category?')) {
            deleteIngredient({
                variables: {
                    where: {
                        id: data.id
                    }
                }
            }).then(() => refetch())
        }

    };

    const handleEditIngredient = (data: IngredientQuery['ingredient']) => {
        navigate(`${Paths.INGREDIENT_EDIT_BASE}${data.id}`)
    };

    const renderTableRow = (data: IngredientsQuery) => {
        if (data.ingredients.length !== 0) {
            return (
                <>
                    {data.ingredients.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell align="center">{item.name}</TableCell>
                            <TableCell align="center">{item.updatedAt}</TableCell>
                            <TableCell align="center"> <img
                                src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.name}
                                loading="lazy"
                            /></TableCell>
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
            <SectionHeader title="Ingredient list"/>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddIngredient}
            >
                Add Ingredient
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">Updated at</TableCell>
                        <TableCell align="center">Image</TableCell>
                        <TableCell align="right"> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderTableRow(data)}</TableBody>
            </Table>
        </>}
        </>

    );
};

