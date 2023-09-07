import {ApolloProvider} from "@apollo/client";
import {client} from "./api/apollo.config.ts";
import GlobalRoutes from "./router/globalRoutes/globalRoutes.tsx";
import {Suspense} from "react";
import {Box, LinearProgress} from "@mui/material";
import {StyledEngineProvider} from "@mui/material";

function LinearIndeterminate() {
    return (
        // TODO: z-indexes must be a const
        <Box sx={{ width: '100%' , zIndex:9999, mt:0.1}}>
            <LinearProgress color='secondary' sx={{ zIndex:9999}}/>
        </Box>
    );
}

function App() {
    return (
        <ApolloProvider client={client}>
            <Suspense fallback={<LinearIndeterminate/>}>
                <StyledEngineProvider injectFirst>
                <GlobalRoutes/>
                </StyledEngineProvider>
            </Suspense>
        </ApolloProvider>
    )
}

export default App
