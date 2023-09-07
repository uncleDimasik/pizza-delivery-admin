import {useNavigate, useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import {InferType, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    useCreateIngredientMutation,
    useIngredientLazyQuery,
    useUpdateIngredientMutation
} from "../../../@generated/generated.graphql.ts";
import {useEffect, useState} from "react";
import {Box, Container, CssBaseline, Grid, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SectionHeader} from "../../SectionHeader.tsx";
import Link from '@mui/material/Link';

const schema = object({
    name: string().required('Name field is required').max(50),
    image: string().required('Image field is required').url('Image field must be an url')
});

type IngredientEdit = InferType<typeof schema>;
export const IngredientEdit = () => {
    const {ingredientId} = useParams<Params.INGREDIENT_PARAMS>();
    const navigate = useNavigate();
    const [isEditable] = useState(!!ingredientId)
    const [getIngredient, {data}] = useIngredientLazyQuery()
    const [createIngredient, {loading: createLoading, error: createError}] = useCreateIngredientMutation();
    const [updateIngredient, {loading: updateLoading, error: updateError}] = useUpdateIngredientMutation();

    const {control, handleSubmit, formState: {errors}, setValue} = useForm<IngredientEdit>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
        defaultValues: data?.ingredient
    });

    useEffect(() => {
        if (ingredientId) {
            getIngredient({
                variables: {
                    where: {
                        id: ingredientId
                    }
                }
            }).then((data) => {
                    setValue('name', data.data!.ingredient.name)
                    setValue('image', data.data!.ingredient.image)
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

    const handleEdit = (data: IngredientEdit) => {
        console.log(data);
        updateIngredient({
            variables: {
                data: {
                    image: data.image,
                    name: data.name,
                },
                where: {
                    id: ingredientId,
                }
            }
        }).then(() => {
            navigate(-1);
        })
    };

    const handleCreate = (data: IngredientEdit) => {
        createIngredient({
            variables: {
                data: {
                    image: data.image,
                    name: data.name,
                },
            }
        }).then(() => {
            navigate(-1);
        })
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <SectionHeader title="Ingredient details"/>
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
                                defaultValue={data?.ingredient.name}
                                label="Ingredient name"
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
                                defaultValue={data?.ingredient.image}
                                label="Ingredient Image"
                                type="url"
                                id="image"
                                autoComplete="current-password"
                                helperText={errors.image?.message}
                                {...field}
                            />
                        )}
                    />
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

