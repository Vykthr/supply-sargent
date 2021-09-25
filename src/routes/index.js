import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AOS from 'aos';
import Home from '../pages/Home';
import NewsFeed from '../pages/NewsFeed';
import ChatView from '../pages/ChatView';
import Messages from '../pages/Messages';
import Cart from '../pages/Cart';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../redux/actions/user.js'
import firebase from '../redux/api/config'
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import { updateProfile } from '../redux/actions/user'
import { fetchAll } from '../redux/actions/general'
import MarketPlace from '../pages/MarketPlace';
import BecomeAVendor from '../pages/BecomeAVendor';
import PrimeOrders from '../pages/PrimeOrders';
import Advertise from '../pages/Advertise';
import BecomeAContentCreator from '../pages/BecomeAContentCreator';
import Auth from '../pages/Auth';

const ScrollToTop = () => {
  const history = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history.location.pathname]);

  return null;
};

const ResetScroll = withRouter(ScrollToTop);

const Routes = ({ user, logoutUser, updateProfile, fetchAll }) => {
  const init = async () => {
    AOS.init()
    try {
        await fetchAll();
        if(user?.userData?.hasOwnProperty('email')) {
            await updateProfile(user.userData.email)
        }
    }
    finally {

    }
  }

  useEffect(() => {
    init();
  }, [])
  
  const PrivateRoute = ({ component: Component, exact, ...rest }) => {
    // firebase.auth().onAuthStateChanged((user) => {
    //   if(!user) {
    //     logoutUser();
    //   }
    // })
    const authenticated =  user.authenticated;
    return (
      <Route
        {...rest}
        render={(props) =>
          authenticated ? <Component {...props} /> : <Redirect to="/login" />
        }
        exact={exact}
      />
    );
  };

  return (
    <Router>
      <ResetScroll />
      <Switch>
        <Route exact path="/home">
          <Redirect to={`/`} />
        </Route>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Auth} />
        <Route exact path="/sign-up" component={Auth} />
        <Route exact path="/forgot-password" component={Auth} />
        <Route exact path="/newsfeed" component={NewsFeed} />
        <Route exact path="/marketplace" component={MarketPlace} />
        <Route exact path="/become-a-vendor" component={BecomeAVendor} />
        <Route exact path="/become-a-content-creator" component={BecomeAContentCreator} />
        <Route exact path="/prime-orders" component={PrimeOrders} />
        <Route exact path="/advertise" component={Advertise} />
        
        <PrivateRoute exact path="/chat" component={ChatView} />
        <PrivateRoute exact path="/cart" component={Cart} />
        <PrivateRoute exact path="/messages" component={Messages} />
        <PrivateRoute exact path="/profile/" component={Profile} />
        <PrivateRoute exact path="/profile/:section" component={Profile} />
        <PrivateRoute exact path="/orders" component={Orders} />

        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser, updateProfile, fetchAll }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);