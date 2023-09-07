import {useNavigate, useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import {InferType, number, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import {Box, Container, CssBaseline, Grid, InputAdornment, MenuItem, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SectionHeader} from "../../SectionHeader.tsx";
import Link from '@mui/material/Link';
import {
    useCategoriesQuery,
    useCreateGoodMutation,
    useGoodLazyQuery,
    useUpdateGoodMutation
} from "../../../@generated/generated.graphql.ts";


const schema = object({
    name: string().required('Name field is required').max(100),
    image: string().required('Image field is required').url('Image field must be an url'),
    price: number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
    description: string().required('Field is required').max(100),
    category: string().required('Field is required')
});

type GoodEdit = InferType<typeof schema>;
export const GoodEdit = () => {
    const {goodId} = useParams<Params.GOOD_PARAMS>();
    const navigate = useNavigate();
    const [isEditable] = useState(!!goodId)
    const [getGood] = useGoodLazyQuery()
    const {data: categories} = useCategoriesQuery()

    const [createGood, {loading: createLoading, error: createError}] = useCreateGoodMutation();
    const [updateGood, {loading: updateLoading, error: updateError}] = useUpdateGoodMutation();

    const {control, handleSubmit, formState: {errors}, setValue} = useForm<GoodEdit>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
    });


    useEffect(() => {
        if (goodId) {
            getGood({
                variables: {
                    where: {
                        id: goodId
                    }
                }
            }).then((good) => {
                    setValue('name', good.data!.good.name)
                    setValue('image', good.data!.good.images![0])
                    setValue('price', good.data!.good.price)
                    setValue('description', good.data!.good.description)
                    setValue('category', good.data!.good.category.name)
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

    const handleEdit = (data: GoodEdit) => {
        console.log(data);
        updateGood({
            variables: {
                data: {
                    images: [data.image],
                    name: data.name,
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    slug:data.image,
                    category: {
                        connect: {
                            name: data.category,
                        }
                    }
                },
                where: {
                    id: goodId,
                }
            }
        }).then(() => {
            navigate(-1);
        })
    };

    const handleCreate = (data: GoodEdit) => {
        createGood({
            variables: {
                data: {
                    images: [data.image],
                    name: data.name,
                    price: parseFloat(data.price.toString()),
                    description: data.description,
                    slug:data.image,
                    category: {
                        connect: {
                            name: data.category,
                        }
                    }
                }
            }
        }).then(() => {
            navigate(-1);
        })
    };

    return (
        <>
            <Container component="main" maxWidth="lg">
                <SectionHeader title="Good details"/>
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
                                label="Good name"
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
                                label="Good Image"
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
                                label="Good category"
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
                                label="Good price"
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
                                label="Good description"
                                helperText={errors.description?.message}
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

