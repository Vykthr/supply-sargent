import React from 'react'
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import Account from '../pages/private/Account';
import Orders from '../pages/private/Orders';
import ChatView from '../pages/private/ChatView';
import Permits from '../pages/private/Permits';
import Products from '../pages/private/Products';
import Wallet from '../pages/private/Wallet';
import Cart from '../pages/private/Cart';
import Profile from '../pages/Profile';

const AccountRoutes = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/chat`} component={ChatView} />
            <Route exact path={`${path}/cart`} component={Cart} />
            <Route exact path={`${path}/orders`} component={Orders} />
            <Route exact path={`${path}/permits`} component={Permits} />
            <Route exact path={`${path}/products`} component={Products} />
            <Route exact path={`${path}/wallet`} component={Wallet} />
            <Route exact path={`${path}/profile`} component={Profile} />
            <Route path={`${path}/`} component={Account} />

            <Route path="**">
                <Account />
            </Route>
        </Switch>
    );
};

export default AccountRoutes
