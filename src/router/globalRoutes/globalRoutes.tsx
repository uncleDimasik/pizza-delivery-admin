import {FC} from "react";
import {RouteObject, useRoutes} from "react-router-dom";
import {Paths} from "./paths.ts";
import {NotFoundPage} from "../../pages/NotFoundPage.tsx";
import {DashboardPage} from "../../pages/DashboardPage.tsx";
import {LoginPage} from "../../pages/LoginPage.tsx";
import {ProtectedRoute} from "../protectedRoutes.tsx";
import {CategoryTable} from "../../components/sections/category/CategoryTable.tsx";
import {CategoryEdit} from "../../components/sections/category/CategoryEdit.tsx";
import {GoodTable} from "../../components/sections/goods/GoodTable.tsx";
import {GoodEdit} from "../../components/sections/goods/GoodEdit.tsx";
import {IngredientTable} from "../../components/sections/ingredient/IngredientTable.tsx";
import {IngredientEdit} from "../../components/sections/ingredient/IngredientEdit.tsx";
import {OptionTable} from "../../components/sections/option/OptionTable.tsx";
import {OptionEdit} from "../../components/sections/option/OptionEdit.tsx";
import {ToppingTable} from "../../components/sections/topping/ToppingTable.tsx";
import {ToppingEdit} from "../../components/sections/topping/ToppingEdit.tsx";
import {OrderTable} from "../../components/sections/order/OrderTable.tsx";
import {OrderEdit} from "../../components/sections/order/OrderEdit.tsx";
import {DishTable} from "../../components/sections/dish/DishTable.tsx";
import {DishEdit} from "../../components/sections/dish/DishEdit.tsx";

const GlobalRoutes: FC = () => {
  const routes: RouteObject[] = [
    {
      path: Paths.DASHBOARD,
      element: (
          <ProtectedRoute>
            <DashboardPage/>
          </ProtectedRoute>
      ),
      errorElement: <NotFoundPage/>,
      children: [
        {
          index: true,
          path: Paths.CATEGORY,
          element: <CategoryTable/>,
        },
        {
          index: true,
          path: Paths.CATEGORY_EDIT,
          element: <CategoryEdit/>,
        },
        {
          index: true,
          path: Paths.CATEGORY_ADD,
          element: <CategoryEdit/>,
        },
        //------------------------------------------------------------
        {
          index: true,
          path: Paths.GOOD,
          element: <GoodTable/>,
        },
        {
          index: true,
          path: Paths.GOOD_EDIT,
          element: <GoodEdit/>,
        },
        {
          index: true,
          path: Paths.GOOD_ADD,
          element: <GoodEdit/>,
        },
        //--------------------------------------------------------------
        {
          index: true,
          path: Paths.INGREDIENT,
          element: <IngredientTable/>,
        },
        {
          index: true,
          path: Paths.INGREDIENT_EDIT,
          element: <IngredientEdit/>,
        },
        {
          index: true,
          path: Paths.INGREDIENT_ADD,
          element: <IngredientEdit/>,
        },
          //---------------------------------------------------------------
        {
          index: true,
          path: Paths.OPTION,
          element: <OptionTable/>,
        },
        {
          index: true,
          path: Paths.OPTION_EDIT,
          element: <OptionEdit/>,
        },
        {
          index: true,
          path: Paths.OPTION_ADD,
          element: <OptionEdit/>,
        },
        //---------------------------------------------------------------
        {
          index: true,
          path: Paths.TOPPING,
          element: <ToppingTable/>,
        },
        {
          index: true,
          path: Paths.TOPPING_EDIT,
          element: <ToppingEdit/>,
        },
        {
          index: true,
          path: Paths.TOPPING_ADD,
          element: <ToppingEdit/>,
        },
        //---------------------------------------------------------------
        {
          index: true,
          path: Paths.DISH,
          element: <DishTable/>,
        },
        {
          index: true,
          path: Paths.DISH_EDIT,
          element: <DishEdit/>,
        },
        {
          index: true,
          path: Paths.DISH_ADD,
          element: <DishEdit/>,
        },
        //---------------------------------------------------------------
        {
          index: true,
          path: Paths.ORDER,
          element: <OrderTable/>,
        },
        {
          index: true,
          path: Paths.ORDER_EDIT,
          element: <OrderEdit/>,
        },
      ]
    },
    {
      index: true,
      path: Paths.LOGIN,
      element: <LoginPage/>,
    },
    {
      index: true,
      path: '*',
      element: (
          <NotFoundPage/>
      ),
    },
  ];

  return useRoutes(routes);
};

export default GlobalRoutes;
