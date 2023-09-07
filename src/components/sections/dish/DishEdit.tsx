import {useNavigate, useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import {InferType, number, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Fragment, useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Checkbox,
    CssBaseline,
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SectionHeader} from "../../SectionHeader.tsx";
import Link from '@mui/material/Link';
import {
    useCategoriesQuery,
    useCreateDishMutation,
    useDishLazyQuery,
    useIngredientsQuery,
    useOptionsQuery,
    useUpdateDishMutation
} from "../../../@generated/generated.graphql.ts";
import {Card, Sheet} from "@mui/joy";
import Table from "@mui/joy/Table";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const schema = object({
    name: string().required('Name field is required').max(100),
    image: string().required('Image field is required').url('Image field must be an url'),
    price: number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
    description: string().required('Field is required').max(100),
    category: string().required('Field is required')
});


type DishEdit = InferType<typeof schema>;

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

type OptionState = {
    id: string;
    name: string;
    price: number;
}
type IngredientState = {
    id: string;
    name: string;
    image: string;
}
export const DishEdit = () => {
    const {dishId} = useParams<Params.DISH_PARAMS>();
    const navigate = useNavigate();
    const [isEditable] = useState(!!dishId)
    const [getDish, {data: dishData, refetch: refetchDish}] = useDishLazyQuery()
    const {data: categories} = useCategoriesQuery()
    const {data: allOptions} = useOptionsQuery()
    const {data: allIngredients} = useIngredientsQuery()
    const [selectedOptions, setSelectedOptions] = useState<Array<OptionState>>();
    const [selectedIngredients, setSelectedIngredients] = useState<Array<IngredientState>>();


    const [createDish, {loading: createLoading, error: createError}] = useCreateDishMutation();
    const [updateDish, {loading: updateLoading, error: updateError}] = useUpdateDishMutation();

    const {control, handleSubmit, formState: {errors}, setValue} = useForm<DishEdit>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
    });


    useEffect(() => {
        if (dishId) {
            getDish({
                variables: {
                    where: {
                        id: dishId
                    }
                }
            }).then((dish) => {
                    setValue('name', dish.data!.dish.name)
                    setValue('image', dish.data!.dish.images![0])
                    setValue('price', dish.data!.dish.price)
                    setValue('description', dish.data!.dish.description)
                    setValue('category', dish.data!.dish.category.name)
                    setSelectedOptions(dish.data!.dish.options?.map((opt) => ({
                        id: opt.id,
                        name: opt.name,
                        price: opt.price
                    })));
                    setSelectedIngredients(dish.data!.dish.ingradients?.map((opt) => ({
                        id: opt.id,
                        name: opt.name,
                        image: opt.image
                    })));
                }
            ).catch((e) => {
                navigate('/*')
                console.log(e);
            })
        }
    }, [])


    const onSubmit = handleSubmit(data => {
        if (isEditable) {
            handleEdit(data);
        } else {
            handleCreate(data)
        }
    });

    const handleEdit = (data: DishEdit) => {
        console.log(selectedIngredients);
        updateDish({
            variables: {
                data: {
                    images: [data.image],
                    name: data.name,
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    slug: data.image,
                    category: {
                        connect: {
                            name: data.category,
                        }
                    },
                    options: {
                        set: selectedOptions?.map((item) => ({id: item.id}))
                    },
                    ingradients: {
                        set: selectedIngredients?.map((item) => ({id: item.id}))
                    }
                },
                where: {
                    id: dishId,
                }
            }
        }).then(() => {
            refetchDish();
            // navigate(-1);
        })
    };

    const handleCreate = (data: DishEdit) => {
        createDish({
            variables: {
                data: {
                    images: [data.image],
                    name: data.name,
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    slug: data.image,
                    category: {
                        connect: {
                            name: data.category,
                        }
                    },
                    options: {
                        connect: selectedOptions?.map((item) => ({id: item.id}))
                    },
                    ingradients: {
                        connect: selectedIngredients?.map((item) => ({id: item.id}))
                    }
                }
            }
        }).then(() => {

            navigate(-1);
        })
    };

    return (
        <>
            <Box display={"flex"} flexDirection={'row'} alignItems={'center'} justifyContent={'space-around'}>
                <Box component="main" maxWidth="sm">
                    <SectionHeader title="Dish details"/>
                    <CssBaseline/>
                    <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
                        <Link
                            href="https://tree-ams5-0000.secure.backblaze.com/b2_browse_files2.htm?selectedFileOrFolder=1684060214954-c2439e57-c788-46ce-ad51-12b74663258f-2231141&bucketId=ef87e06975b990ff8a710d13">
                            B2 Cloud Storage for your image
                        </Link>

                        <Controller
                            control={control}
                            name="name"
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    error={!!errors.name}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Dish name"
                                    autoComplete="name"
                                    autoFocus
                                    helperText={errors.name?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="image"
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    error={!!errors.image}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Dish Image"
                                    type="url"
                                    id="image"
                                    helperText={errors.image?.message}
                                    {...field}
                                />
                            )}
                        />
                        {categories && <Controller
                            control={control}
                            name="category"
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    id="category"
                                    select
                                    fullWidth
                                    error={!!errors.category}
                                    label="Dish category"
                                    helperText={errors.category?.message}
                                    {...field}
                                >
                                    {categories?.categories.map((option) => (
                                        <MenuItem key={option.id} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />}

                        <Controller
                            control={control}
                            name="price"
                            defaultValue={0}
                            render={({field}) => (
                                <TextField
                                    id="price"
                                    error={!!errors.price}
                                    margin="normal"
                                    required
                                    type={'number'}
                                    fullWidth
                                    label="Dish price"
                                    helperText={errors.price?.message}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                                    }}
                                    inputProps={{
                                        maxLength: 7,
                                        inputMode: 'numeric',
                                    }}
                                    {...field}
                                />
                            )}
                        />
                        {allOptions && <Autocomplete
                            multiple
                            id="options"
                            options={allOptions.options}
                            disableCloseOnSelect
                            isOptionEqualToValue={(option, value) => (option.id === value.id)}
                            defaultValue={dishData?.dish.options?.map((opt) => ({
                                id: opt.id,
                                name: opt.name,
                                price: opt.price
                            }))}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, values) => {
                                setSelectedOptions(values)
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {`${option.name}, ${option.price} ₽`}
                                </li>
                            )}
                            style={{width: 500}}
                            renderInput={(params) => (
                                <TextField {...params} label="Options" placeholder="Selected options"/>
                            )}
                        />}

                        {allIngredients && <Autocomplete
                            sx={{pt: '10px'}}
                            multiple
                            id="ingredients"
                            options={allIngredients.ingredients}
                            disableCloseOnSelect
                            isOptionEqualToValue={(option, value) => (option.id === value.id)}
                            defaultValue={dishData?.dish.ingradients?.map((opt) => ({
                                id: opt.id,
                                name: opt.name,
                                image: opt.image
                            }))}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, values) => {
                                setSelectedIngredients(values)
                            }}
                            renderOption={(props, option, {selected}) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {`${option.name}`}
                                    <img
                                        style={{paddingLeft: "10px"}}
                                        height={'30px'}
                                        src={`${option.image}?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`${option.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={option.name}
                                        loading="lazy"
                                    />
                                </li>
                            )}
                            style={{width: 500}}
                            renderInput={(params) => (
                                <TextField {...params} label="Ingredients" placeholder="Selected ingredients"/>
                            )}
                        />}

                        <Controller
                            control={control}
                            name="description"
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    id="description"
                                    error={!!errors.description}
                                    margin="normal"
                                    type={"text"}
                                    required
                                    fullWidth
                                    label="Dish description"
                                    helperText={errors.description?.message}
                                    {...field}
                                />
                            )}
                        />
                        <Grid spacing={8} justifyContent={"center"}>
                            <Grid item xs={6} lg={6}>
                                {
                                    isEditable ? <>
                                        {updateError ? <Typography color={"red"}>
                                            {updateError.message}
                                        </Typography> : ''}
                                        <LoadingButton
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{mt: 3, mb: 2}}
                                            loading={updateLoading}
                                        >
                                            Update
                                        </LoadingButton>
                                    </> : <>
                                        {createError ? <Typography color={"red"}>
                                            {createError.message}
                                        </Typography> : ''}
                                        <LoadingButton
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{mt: 3, mb: 2}}
                                            loading={createLoading}
                                        >
                                            Create
                                        </LoadingButton>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Box>

                </Box>
                <Card
                    variant="soft"
                    color={'warning'}
                    sx={{p: 1, pl: 6, width: '40%'}}
                >
                    <Typography variant={"h6"} component="div">
                        Dish Ingredients
                    </Typography>
                    <Table
                        borderAxis="bothBetween"
                        stripe={"even"}
                    >
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th style={{textAlign: 'start'}}>image</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dishData?.dish.ingradients?.map((ing) => (
                            <Fragment key={ing.id}>
                                <tr>
                                    <th>{ing.id}</th>
                                    <th>{ing.name}</th>
                                    <th>
                                        <img
                                            height={'50px'}
                                            src={`${ing.image}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${ing.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            alt={ing.name}
                                            loading="lazy"
                                        />
                                    </th>
                                </tr>
                            </Fragment>
                        ))}
                        </tbody>
                    </Table>
                </Card>

            </Box>

            <Sheet
                variant="soft"
                color={'primary'}
                sx={{p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)'}}
            >
                <Typography variant={"h6"} component="div">
                    Options
                </Typography>
                <Table
                    borderAxis="bothBetween"
                    stripe={"even"}
                >
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th style={{textAlign: 'start'}}>price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dishData?.dish.options?.map((opt) => (
                        <Fragment key={opt.id}>
                            <tr>
                                <th>{opt.id}</th>
                                <th>{opt.name}</th>
                                <th>{opt.price}</th>
                            </tr>
                            <tr>
                                <th colSpan={3}>
                                    <Box p={'40px'}>
                                        <Typography variant={"h6"} component="div">
                                            Toppings
                                        </Typography>
                                        <Sheet
                                            variant="soft"
                                            sx={{p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)'}}
                                        >
                                            <Typography variant="h6" component="div">
                                                History
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
                                                {opt.toppings?.map((topping) => (
                                                    <Fragment key={topping.id}>
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
                                                    </Fragment>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </Sheet>
                                    </Box>
                                </th>
                            </tr>
                        </Fragment>
                    ))}

                    </tbody>
                </Table>
            </Sheet>

        </>
    );
};

