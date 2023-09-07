import {FC, ReactNode} from "react";
import {Paths} from "../router/globalRoutes/paths.ts";
import CategoryIcon from '@mui/icons-material/Category';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Link} from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

interface IListItem {
    title: string;
    pathTo: string;
    icon: ReactNode;
}

const ListItemsData: IListItem[] = [
    {
        title: 'Orders',
        pathTo: Paths.ORDER,
        icon: <RestaurantIcon/>,
    },
    {
        title: 'Categories',
        pathTo: Paths.CATEGORY,
        icon: <CategoryIcon/>,
    },
    {
        title: 'Goods',
        pathTo: Paths.GOOD,
        icon: <ShoppingCartIcon/>,
    },
    {
        title: 'Dishes',
        pathTo: Paths.DISH,
        icon: <LocalPizzaIcon/>,
    },
    {
        title: 'Ingredients',
        pathTo: Paths.INGREDIENT,
        icon: <BubbleChartIcon/>,
    },
    {
        title: 'OptionDish',
        pathTo: Paths.OPTION,
        icon: <AutoAwesomeMosaicIcon/>,
    },
    {
        title: 'ToppingDish',
        pathTo: Paths.TOPPING,
        icon: <AddBoxIcon/>,
    },
];
export const IconsList: FC<{ isOpen: boolean }> = ({isOpen}) => {

    return (
        <>
            {ListItemsData.map((item, index) => (
                <ListItem key={index} disablePadding sx={{display: 'block'}}>
                    <Link to={item.pathTo}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            // onClick={() => handleClick(item.pathTo)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isOpen ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} sx={{opacity: isOpen ? 1 : 0}}/>
                        </ListItemButton>
                    </Link>
                </ListItem>
            ))}
        </>
    );
};

