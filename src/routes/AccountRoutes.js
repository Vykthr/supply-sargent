import React from 'react'
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import Account from '../pages/Account';
import Orders from '../pages/Orders';
import ChatView from '../pages/ChatView';
import Messages from '../pages/Messages';
import Cart from '../pages/Cart';
const AccountRoutes = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/chat`} component={ChatView} />
            <Route exact path={`${path}/cart`} component={Cart} />
            <Route exact path={`${path}/messages`} component={Messages} />
            <Route exact path={`${path}/orders`} component={Orders} />
            <Route path={`${path}/`} component={Account} />

            <Route path="**">
                <Account />
            </Route>
        </Switch>
    );
};

export default AccountRoutes
