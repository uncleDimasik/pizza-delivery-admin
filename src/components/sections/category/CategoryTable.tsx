import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {
    CategoriesQuery,
    CategoryQuery,
    useCategoriesQuery,
    useRemoveCategoryMutation
} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export const CategoryTable = () => {
    const {data, loading, refetch} = useCategoriesQuery()
    const navigate = useNavigate()
    const [deleteCategory] = useRemoveCategoryMutation();
    const handleAddCategory = () => {
        navigate(Paths.CATEGORY_ADD)
    };

    const handleDeleteCategory = (data: CategoryQuery['category']) => {
        if (confirm('Delete category?')) {
            deleteCategory({
                variables: {
                    where: {
                        id: data.id
                    }
                }
            }).then(() => refetch())
        }

    };

    const handleEditCategory = (data: CategoryQuery['category']) => {
        navigate(`${Paths.CATEGORY_EDIT_BASE}${data.id}`)
    };

    const renderTableRow = (data: CategoriesQuery) => {
        if (data.categories.length !== 0) {
            return (
                <>
                    {data.categories.map((item) => (
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
                                                handleDeleteCategory(item);
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
                                                handleEditCategory(item);
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
            <SectionHeader title="Categories list"/>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
            >
                Add Category
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

