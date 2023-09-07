import {useNavigate, useParams} from "react-router-dom";
import {Params} from "../../../router/globalRoutes/paths.ts";
import {InferType, number, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    useCreateOptionMutation,
  useOptionLazyQuery,
 useUpdateOptionMutation
} from "../../../@generated/generated.graphql.ts";
import {useEffect, useState} from "react";
import {Box, Container, CssBaseline, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {SectionHeader} from "../../SectionHeader.tsx";
import Link from '@mui/material/Link';

const schema = object({
    name: string().required('Name field is required').max(100),
    price: number().required('Price is required').min(0, 'Price must be greater than or equal to 0'),
});

type OptionEdit = InferType<typeof schema>;
export const OptionEdit = () => {
    const {optionId} = useParams<Params.OPTION_PARAMS>();
    const navigate = useNavigate();
    const [isEditable] = useState(!!optionId)
    const [getOption, {data}] = useOptionLazyQuery()
    const [createOption, {loading: createLoading, error: createError}] = useCreateOptionMutation();
    const [updateOption, {loading: updateLoading, error: updateError}] = useUpdateOptionMutation();

    const {control, handleSubmit, formState: {errors}, setValue} = useForm<OptionEdit>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
        defaultValues: data?.option
    });

    useEffect(() => {
        if (optionId) {
            getOption({
                variables: {
                    where: {
                        id: optionId
                    }
                }
            }).then((data) => {
                    setValue('name', data.data!.option.name)
                    setValue('price', data.data!.option.price)
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

    const handleEdit = (data: OptionEdit) => {
        console.log(data);
        updateOption({
            variables: {
                data: {
                    price: data.price,
                    name: data.name,
                },
                where: {
                    id: optionId,
                }
            }
        }).then(() => {
            navigate(-1);
        })
    };

    const handleCreate = (data: OptionEdit) => {
        createOption({
            variables: {
                data: {
                    price: data.price,
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
                <SectionHeader title="Option details"/>
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
                                defaultValue={data?.option.name}
                                label="Option name"
                                autoComplete="name"
                                autoFocus
                                helperText={errors.name?.message}
                                {...field}
                            />
                        )}
                    />
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

