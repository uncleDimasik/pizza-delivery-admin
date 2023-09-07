import {useNavigate, useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import {InferType, number, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    useCreateToppingMutation,
    useIngredientsQuery,
    useOptionsQuery,
    useToppingLazyQuery,
    useUpdateToppingMutation
} from "../../../@generated/generated.graphql.ts";
import {useEffect, useState} from "react";
import {Box, Container, CssBaseline, Grid, InputAdornment, MenuItem, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SectionHeader} from "../../SectionHeader.tsx";
import Link from '@mui/material/Link';

const schema = object({
    ingredient: string().required('Name field is required').max(100),
    option: string().required('Name field is required').max(100),
    price: number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
});

type ToppingEdit = InferType<typeof schema>;
export const ToppingEdit = () => {
    const {toppingId} = useParams<Params.TOPPING_PARAMS>();
    const navigate = useNavigate();
    const [isEditable] = useState(!!toppingId)
    const [getTopping] = useToppingLazyQuery()
    const [createTopping, {loading: createLoading, error: createError}] = useCreateToppingMutation();
    const [updateTopping, {loading: updateLoading, error: updateError}] = useUpdateToppingMutation();
    const {data: ingredients} = useIngredientsQuery()
    const {data: options} = useOptionsQuery()

    const {control, handleSubmit, formState: {errors}, setValue} = useForm<ToppingEdit>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (toppingId) {
            getTopping({
                variables: {
                    where: {
                        id: toppingId
                    }
                }
            }).then((data) => {
                    setValue('ingredient', data.data!.topping.ingredientLabel.name)
                    setValue('price', data.data!.topping.price)
                    setValue('option', data.data!.topping.option.id)
                }
            ).catch((e) => {
                navigate('/*')
                console.log(e);
            })
        }
    }, [isEditable])

    const onSubmit = handleSubmit(data => {
        if (isEditable) {
            handleEdit(data);
        } else {
            handleCreate(data)
        }
    });

    const handleEdit = (data: ToppingEdit) => {
        console.log(data);
        updateTopping({
            variables: {
                data: {
                    ingredientLabel: {
                        connect: {
                            name: data.ingredient
                        }
                    },
                    option: {
                        connect: {
                            id: data.option
                        }
                    },
                    price: data.price
                },
                where: {
                    id: toppingId,
                }
            }
        }).then(() => {
            navigate(-1);
        })
    };

    const handleCreate = (data: ToppingEdit) => {
        createTopping({
            variables: {
                data: {
                    ingredientLabel: {
                        connect: {
                            name: data.ingredient
                        }
                    },
                    option: {
                        connect: {
                            id: data.option
                        }
                    },
                    price: data.price
                },
            }
        }).then(() => {
            navigate(-1);
        })
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <SectionHeader title="Topping details"/>
                <CssBaseline/>
                <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
                    <Link
                        href="https://tree-ams5-0000.secure.backblaze.com/b2_browse_files2.htm?selectedFileOrFolder=1684060214954-c2439e57-c788-46ce-ad51-12b74663258f-2231141&bucketId=ef87e06975b990ff8a710d13">
                        B2 Cloud Storage for your image
                    </Link>
                    <Controller
                        control={control}
                        name="price"
                        defaultValue={0}
                        render={({field}) => (
                            <TextField
                                sx={{pb:1}}
                                id="price"
                                error={!!errors.price}
                                margin="normal"
                                required
                                type={'number'}
                                fullWidth
                                label="Topping price"
                                autoFocus
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
                    {ingredients && <Controller
                        control={control}
                        name="ingredient"
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                sx={{pb:2}}
                                id="ingredient"
                                select
                                fullWidth
                                error={!!errors.ingredient}
                                label="Topping ingredient"
                                helperText={errors.ingredient?.message}
                                {...field}
                            >
                                {ingredients?.ingredients.map((option) => (
                                    <MenuItem key={option.id} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />}

                    {options && <Controller
                        control={control}
                        name="option"
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                sx={{pb:1}}
                                id="option"
                                select
                                fullWidth
                                error={!!errors.option}
                                label="Topping option"
                                helperText={errors.option?.message}
                                {...field}
                            >
                                {options?.options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />}

                    <Grid container spacing={8} justifyContent={"center"}>
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
            </Container>
        </>
    );
};

