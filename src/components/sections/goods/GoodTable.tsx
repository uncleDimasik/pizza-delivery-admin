import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {
    GoodQuery, GoodsQuery,
    useGoodsQuery, useRemoveGoodMutation,
} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export const GoodTable = () => {
    const {data, loading, refetch} = useGoodsQuery()
    const navigate = useNavigate()
    const [deleteGood] = useRemoveGoodMutation();
    const handleAddCategory = () => {
        navigate(Paths.GOOD_ADD)
    };

    const handleDeleteCategory = (data: GoodQuery['good']) => {
        if (confirm('Delete good?')) {
            deleteGood({
                variables: {
                    where: {
                        id: data.id
                    }
                }
            }).then(() => refetch())
        }

    };

    const handleEditCategory = (data:  GoodQuery['good']) => {
        navigate(`${Paths.GOOD_EDIT_BASE}${data.id}`)
    };

    const renderTableRow = (data: GoodsQuery) => {
        if (data.goods.length !== 0) {
            return (
                <>
                    {data.goods.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell align="center">{item.name}</TableCell>
                            {item.images&& <TableCell align="center"> <img
                                height={'100px'}
                                src={`${item.images[0]}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.images[0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.name}
                                loading="lazy"
                            /></TableCell>}
                            <TableCell align="center">{item.price}</TableCell>
                            <TableCell align="center">{item.slug}</TableCell>
                            <TableCell align="center">{item.description}</TableCell>
                            <TableCell align="center">{item.category.name}</TableCell>
                            <TableCell align="center">{item.updatedAt}</TableCell>

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
            <SectionHeader title="Goods list"/>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
            >
                Add Goods
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="center">name</TableCell>
                        <TableCell align="center">image</TableCell>
                        <TableCell align="center">price</TableCell>
                        <TableCell align="center">slug</TableCell>
                        <TableCell align="center">description</TableCell>
                        <TableCell align="center">category</TableCell>
                        <TableCell align="center">updatedAt</TableCell>
                        <TableCell align="right"> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{renderTableRow(data)}</TableBody>
            </Table>
        </>}
        </>

    );
};

