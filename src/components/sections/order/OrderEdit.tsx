import {Box, Typography} from "@mui/material";
import {EnumOrderStatus, useOrderQuery, useUpdateOrderMutation} from "../../../@generated/generated.graphql.ts";
import {useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import Table from '@mui/joy/Table';
import {SectionHeader} from "../../SectionHeader.tsx";
import {Card, Chip, Sheet} from "@mui/joy";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {OrderStatus, typedKeys} from "./OrderTable.tsx";

export const OrderEdit = () => {
    const {orderId} = useParams<Params.ORDER_PARAMS>();
    const {data: order, loading} = useOrderQuery({variables: {where: {id: orderId}}});
    const [updateOrder] = useUpdateOrderMutation()

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

    if (loading) {
        return null
    }

    // TODO: refactor
    return (
        <>
            <SectionHeader title="Order details"/>
            {order?.order && <>
                <Box>
                    <Box display={"flex"} flexDirection={'row'} alignItems={'center'} justifyContent={'space-around'}>
                        <Table sx={{width: '30%'}} variant={'outlined'}>
                            <thead>
                            <tr>
                                <th colSpan={2} style={{textAlign: "center"}}>User info</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>User id</th>
                                <th>{order.order.user.id}</th>
                            </tr>
                            <tr>
                                <th>User phone number</th>
                                <th>{order.order.user.phone}</th>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <th>{order.order.user.email}</th>
                            </tr>
                            <tr>
                                <th>User name</th>
                                <th>{order.order.user.name}</th>
                            </tr>
                            </tbody>
                        </Table>
                        <Card variant="outlined" sx={{width: 470}}>
                            <Card variant={'soft'}>
                                <Typography>
                                    {order.order.description ? order.order.description : 'No order description'}
                                </Typography>
                            </Card>
                            <Box display={"flex"} flexDirection={'row'} justifyContent={'space-between'} pt={'20px'}>
                                <Chip sx={{height: '50px', p: 3}}>
                                    Total price: {order.order.totalPrice}
                                </Chip>
                                <Select defaultValue={order.order.status.toString()} onChange={(_, value) => {
                                    handleOnChangeStatus(value!, order?.order.id)
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
                        </Card>
                    </Box>
                    <Table sx={{mt: 4}} borderAxis={'both'} variant={'outlined'} hoverRow>
                        <thead>
                        <tr>
                            <th colSpan={6} style={{textAlign: "center", background: 'lightgreen'}}>Goods</th>
                        </tr>
                        <tr>
                            <th>Good id</th>
                            <th>Good name</th>
                            <th>Good image</th>
                            <th>Good price</th>
                            <th>Good slug</th>
                            <th>Good updatedAt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            order.order.items?.map((item) => {

                                    if (item.good) {
                                        return (
                                            <tr key={item.id}>
                                                <th>{item.good.id}</th>
                                                <th>{item.good.name}</th>
                                                <th><img
                                                    height={'100px'}
                                                    src={`${item.good.images![0]}?w=164&h=164&fit=crop&auto=format`}
                                                    srcSet={`${item.good.images![0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                    alt={item.good.images![0]}
                                                    loading="lazy"
                                                /></th>
                                                <th>{item.good.price}</th>
                                                <th>{item.good.slug}</th>
                                                <th>{item.good.updatedAt}</th>
                                            </tr>
                                        )
                                    }

                                }
                            )
                        }
                        </tbody>
                    </Table>
                    <Table sx={{mt: 4}} variant={'outlined'} borderAxis={'both'}>
                        <thead>
                        <tr>
                            <th colSpan={6} style={{textAlign: "center", background: 'lightcoral'}}>Dishes</th>
                        </tr>
                        <tr>
                            <th>Dish id</th>
                            <th>Dish name</th>
                            <th>Dish image</th>
                            <th>Dish slug</th>
                            <th>Dish updatedAt</th>
                            <th>Dish price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            order.order.items?.map((item) => {
                                    if (item.customerDish) {
                                        return (
                                            <>
                                                <tr key={item.id}>
                                                    <th>{item.customerDish.id}</th>
                                                    <th>{item.customerDish.parentDish.name}</th>
                                                    <th>
                                                        <img
                                                            height={'100px'}
                                                            src={`${item.customerDish.parentDish.images![0]}?w=164&h=164&fit=crop&auto=format`}
                                                            srcSet={`${item.customerDish.parentDish.images![0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                            alt={item.customerDish.parentDish.images![0]}
                                                            loading="lazy"
                                                        />
                                                    </th>
                                                    <th>{item.customerDish.parentDish.slug}</th>
                                                    <th>{item.customerDish.updatedAt}</th>
                                                    <th>{item.customerDish.price}</th>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3}>
                                                        <Sheet
                                                            variant="plain"
                                                        >
                                                            <Typography variant={"h6"} component="div">
                                                                Selected option
                                                            </Typography>
                                                            <Table
                                                                borderAxis="bothBetween"
                                                            >
                                                                <thead>
                                                                <tr>
                                                                    <th>id</th>
                                                                    <th>name</th>
                                                                    <th>price</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <th>{item.customerDish.selectedOption.id}</th>
                                                                    <th>{item.customerDish.selectedOption.name}</th>
                                                                    <th>{item.customerDish.selectedOption.price}</th>
                                                                </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Sheet>
                                                    </th>
                                                    <th colSpan={3}>
                                                        <Sheet
                                                            variant="plain"
                                                        >
                                                            <Typography variant={"h6"} component="div">
                                                                Selected options
                                                            </Typography>
                                                            <Table
                                                                borderAxis="bothBetween"
                                                            >
                                                                <thead>
                                                                <tr>
                                                                    <th>id</th>
                                                                    <th>name</th>
                                                                    <th>image</th>
                                                                    <th>price</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {item.customerDish.selectedToppings?.map((topping) => (
                                                                    <tr>
                                                                        <th>{topping.id}</th>
                                                                        <th>{topping.ingredientLabel.name}</th>
                                                                        <th>
                                                                            <img
                                                                                height={'50px'}
                                                                                src={`${topping.ingredientLabel.image}?w=164&h=164&fit=crop&auto=format`}
                                                                                srcSet={`${topping.ingredientLabel.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                                                alt={topping.ingredientLabel.name}
                                                                                loading="lazy"
                                                                            />
                                                                        </th>
                                                                        <th>{topping.price}</th>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table>
                                                        </Sheet>
                                                    </th>
                                                </tr>
                                            </>
                                        )
                                    }

                                }
                            )
                        }
                        </tbody>
                    </Table>
                </Box>
            </>}
        </>

    );
};

