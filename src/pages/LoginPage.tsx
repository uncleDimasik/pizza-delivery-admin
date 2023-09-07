import {InferType, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Avatar, Box, Container, CssBaseline, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useSignInMutation} from "../@generated/generated.graphql.ts";
import {useNavigate} from "react-router-dom";
import {Paths} from "../router/globalRoutes/paths.ts";
import {LoadingButton} from '@mui/lab';

const schema = object({
    email: string().required('Email field is required').email().max(100),
    password: string().min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.').required('Password field is required').max(100),
});

type Login = InferType<typeof schema>;


export const LoginPage = () => {

    const [signIn, {error, loading}] = useSignInMutation();
    const navigate = useNavigate();
    const {control, handleSubmit, formState: {errors}} = useForm<Login>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
    });

    const onSubmit = handleSubmit(data => {
        signIn({
            variables: {
                loginInput: {
                    email: data.email,
                    password: data.password
                }
            }
        }).then(() => navigate(Paths.DASHBOARD, {relative: "route"}))
    });


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={onSubmit} noValidate sx={{mt: 1}}>
                    <Controller
                        control={control}
                        name="email"
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                error={!!errors.email}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                                helperText={errors.email?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                error={!!errors.password}
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                helperText={errors.password?.message}
                                {...field}
                            />
                        )}
                    />
                    <>
                        {error ? <Typography color={"red"}>
                            {error.message}
                        </Typography> : ''}
                    </>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        loading={loading}
                    >
                        Sign In
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};
