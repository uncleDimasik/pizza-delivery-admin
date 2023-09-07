import {Navigate, useLocation} from 'react-router-dom';
import {Paths} from "./globalRoutes/paths.ts";
import {FC, PropsWithChildren} from "react";
import {EnumRole, useWhoAmIQuery} from "../@generated/generated.graphql.ts";


export const ProtectedRoute: FC<PropsWithChildren> = ({children}) => {
    const location = useLocation();
    const {data, loading} = useWhoAmIQuery()
    const role: EnumRole = EnumRole.Admin;

    console.log(loading);
    if (loading) return null;
    return (data && data.whoAmI.roles!.some(r => role === r)) ? <>{children}</> :
        <Navigate to={Paths.LOGIN} replace state={{from: location}}/>;

};