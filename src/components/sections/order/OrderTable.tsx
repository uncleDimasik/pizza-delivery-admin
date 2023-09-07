import {Box, Table, TableBody, TableCell, TableHead, TableRow, Tooltip,} from "@mui/material";
import {SectionHeader} from "../../SectionHeader.tsx";
import {
    EnumOrderStatus,
    OrdersQuery,
    SortOrder,
    useOrdersLazyQuery,
    useRestaurantLazyQuery,
    useRestaurantsIdQuery,
    useUpdateOrderMutation
} from "../../../@generated/generated.graphql.ts";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useNavigate} from "react-router-dom";
import Divider from "@mui/material/Divider";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {Chip} from "@mui/joy";
import {Paths} from "../../../router/globalRoutes/paths.ts";

export enum OrderStatus {
    Canceled = 'CANCELED',
    Completed = 'COMPLETED',
    Pending = 'PENDING',
    Shipped = 'SHIPPED'
}

export const statusColors = new Map([
    [EnumOrderStatus.Pending, '#E23535',],
    [EnumOrderStatus.Shipped, '#FF7010'],
    [EnumOrderStatus.Completed, '#24D17E'],
    [EnumOrderStatus.Canceled, '#A5A5A5'],
]);

export const typedKeys = <T extends NonNullable<unknown>>(object: T): (keyof T)[] => {
    return Object.keys(object) as (keyof T)[];
}

//TODO: del restaurant query
export const OrderTable = () => {
    const [getRestaurant, {data, loading}] = useRestaurantLazyQuery()
    const [_, {data: ordersData, loading: ordersLoading, refetch: orderRefetch}] = useOrdersLazyQuery()
    const {data: restaurantId,} = useRestaurantsIdQuery()
    const [updateOrder] = useUpdateOrderMutation()

    const navigate = useNavigate()

    const handleEdit = (id: string) => {
        navigate(`${Paths.ORDER_EDIT_BASE}${id}`)
    };

    const handleOnChangeRestaurant = (value: string) => {
        getRestaurant({
            variables: {
                where: {
                    id: value,
                }

            }
        }).then(() => {
            orderRefetch({

                    where: {
                        restaurantId: {
                            equals: value
                        }
                    },
                    orderBy: [
                        {
                            updatedAt: SortOrder.Desc
                        }
                    ],
                }
            )
        })
    };

    const handleOnChangeStatus = (value: string, orderId: string) => {
        updateOrder({
            variables: {
                where: {
                    id: orderId
                },
                data: {
                    status: value as EnumOrderStatus
                }
            }
        })
    };

    const renderTableRow = (data: OrdersQuery) => {
        if (data.orders.length !== 0) {
            return (
                <>
                    {data.orders.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.number}</TableCell>
                            <TableCell align="center">
                                <Box flexDirection={"row"} display={"flex"}>
                                    <div style={{
                                        width: '4px',
                                        background: statusColors.get(item.status),
                                        margin: "4px"
                                    }}>
                                    </div>
                                    <Select defaultValue={item.status.toString()} onChange={(_, value) => {
                                        handleOnChangeStatus(value!, item.id)
                                    }}>
                                        {
                                            typedKeys(OrderStatus).map((opt) => (

                                                <Option key={opt} value={OrderStatus[opt]}>
                                                    {opt}
                                                </Option>

                                            ))
                                        }
                                    </Select>
                                </Box>
                            </TableCell>
                            <TableCell align="center">{item.updatedAt}</TableCell>
                            <TableCell align="center">{item.totalPrice}</TableCell>
                            <TableCell align="center">{item.changeFor}</TableCell>
                            <TableCell align="center"><Chip>{item.orderType}</Chip></TableCell>
                            <TableCell align="center"><Chip color="success">{item.paymentType}</Chip></TableCell>
                            <TableCell align="center">{item.description}</TableCell>
                            <TableCell align="center">{item.deliveryAddress}</TableCell>
                            <TableCell align="center">{item.user.phone}</TableCell>

                            <TableCell align="right">
                                <Box display="flex" alignItems="center">
                                    <Tooltip title="Edit">
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => {
                                                handleEdit(item.id);
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

    if (loading || ordersLoading) {
        return null
    }

    return (
        <>
            {restaurantId &&
                <>
                    <SectionHeader title="Orders list"/>
                    <Select defaultValue={data?.restaurant.id} onChange={(_, value) => {
                        handleOnChangeRestaurant(value!)
                    }}
                            sx={{m: 4}}
                    >
                        {restaurantId.restaurants.map((option) => (
                            <Option key={option.id} value={option.id}>
                                {`${option.name}, ${option.address}`}
                            </Option>
                        ))}
                    </Select>
                </>
            }

            {ordersData && <>
                <Divider/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order id</TableCell>
                            <TableCell>Order number</TableCell>
                            <TableCell align="center">Order status</TableCell>
                            <TableCell align="center">Order updatedAt</TableCell>
                            <TableCell align="center">Order total price</TableCell>
                            <TableCell align="center">Order changeFor</TableCell>
                            <TableCell align="center">Order orderType</TableCell>
                            <TableCell align="center">Order paymentType</TableCell>
                            <TableCell align="center">Order description</TableCell>
                            <TableCell align="center">Order deliveryAddress</TableCell>
                            <TableCell align="center">Customer phone</TableCell>
                            <TableCell align="right"> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTableRow(ordersData)}</TableBody>
                </Table>
            </>}
        </>

    );
};

