export enum Params {
  CATEGORY_PARAMS = 'categoryId',
  GOOD_PARAMS = 'goodId',
  DISH_PARAMS = 'dishId',
  INGREDIENT_PARAMS = 'ingredientId',
  OPTION_PARAMS = 'optionId',
  TOPPING_PARAMS = 'toppingId',
  ORDER_PARAMS = 'orderId',
}

export enum Paths {
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  CATEGORY = `${Paths.DASHBOARD}/category`,
  CATEGORY_ADD = `${Paths.DASHBOARD}/category/add`,
  CATEGORY_EDIT = `${Paths.DASHBOARD}/category/edit/:${Params.CATEGORY_PARAMS}`,
  CATEGORY_EDIT_BASE = `${Paths.DASHBOARD}/category/edit/`,
  // ------------------------------------------------------------------
  GOOD = `${Paths.DASHBOARD}/good`,
  GOOD_ADD = `${Paths.DASHBOARD}/good/add`,
  GOOD_EDIT = `${Paths.DASHBOARD}/good/edit/:${Params.GOOD_PARAMS}`,
  GOOD_EDIT_BASE = `${Paths.DASHBOARD}/good/edit/`,
  // ----------------------------
  INGREDIENT = `${Paths.DASHBOARD}/ingredient`,
  INGREDIENT_ADD = `${Paths.DASHBOARD}/ingredient/add`,
  INGREDIENT_EDIT = `${Paths.DASHBOARD}/ingredient/edit/:${Params.INGREDIENT_PARAMS}`,
  INGREDIENT_EDIT_BASE = `${Paths.DASHBOARD}/ingredient/edit/`,
  //--------------------------------
  OPTION = `${Paths.DASHBOARD}/option`,
  OPTION_ADD = `${Paths.DASHBOARD}/option/add`,
  OPTION_EDIT = `${Paths.DASHBOARD}/option/edit/:${Params.OPTION_PARAMS}`,
  OPTION_EDIT_BASE = `${Paths.DASHBOARD}/option/edit/`,
  //--------------------------------
  TOPPING = `${Paths.DASHBOARD}/topping`,
  TOPPING_ADD = `${Paths.DASHBOARD}/topping/add`,
  TOPPING_EDIT = `${Paths.DASHBOARD}/topping/edit/:${Params.TOPPING_PARAMS}`,
  TOPPING_EDIT_BASE = `${Paths.DASHBOARD}/topping/edit/`,
  //--------------------------------
 ORDER = `${Paths.DASHBOARD}/order`,
 // ORDER_ADD = `${Paths.DASHBOARD}/order/add`,
 ORDER_EDIT = `${Paths.DASHBOARD}/order/edit/:${Params.ORDER_PARAMS}`,
 ORDER_EDIT_BASE = `${Paths.DASHBOARD}/order/edit/`,
  // ------------------------------------------------------------------
  DISH = `${Paths.DASHBOARD}/dish`,
  DISH_ADD = `${Paths.DASHBOARD}/dish/add`,
  DISH_EDIT = `${Paths.DASHBOARD}/dish/edit/:${Params.DISH_PARAMS}`,
  DISH_EDIT_BASE = `${Paths.DASHBOARD}/dish/edit/`,
}



