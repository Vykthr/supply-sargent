import { Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import PageContainer from '../../components/PageContainer';
import Dashlet from '../../components/profile/Dashlet';
import { Dashboard, AccountBalanceWallet, Settings, ShoppingCart, ShoppingBasket, ListAlt, Message, PermContactCalendar, ExitToApp } from '@material-ui/icons'
import { useMediaQuery } from 'react-responsive'
import { Link, useHistory, useLocation } from 'react-router-dom';
import Permits from '../../components/profile/Permits';
import Wallet from '../../components/profile/Wallet';
import Products from '../../components/profile/Products';
import EditProduct from '../../components/profile/EditProduct';
import { logoutUser } from '../../redux/actions/user';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import trees from '../../assets/images/trees.png'

import cart from '../../assets/images/cart.png'
import permits from '../../assets/images/permits.png'
import logout from '../../assets/images/logout.png'
import orders from '../../assets/images/orders.png'
import products from '../../assets/images/products.png'
import wallet from '../../assets/images/wallet.png'

const Account = ({ logoutUser, ...props}) => {
    const location = useLocation();
    const [ section, setSection ] = useState('')
    const [ product, setProduct ] = useState()
    const isTab = useMediaQuery({ query: '(max-width: 1280px)' })
    const history = useHistory()

    const links = [
        { link: 'products', label: 'Products', icon: products},
        { link: 'cart', label: 'My Cart', icon: cart},
        { link: 'permits', label: 'Permits', icon: permits },
        { link: 'orders', label: 'Orders', icon: orders},
        { link: 'wallet', label: 'Wallet', icon: wallet}
    ]

    useEffect(() => {
        if(props.match.params.hasOwnProperty('section')) setSection(props.match.params.section)
        else { setSection('') }
    }, [props.match.params])

    return (
        <PageContainer type="profile" transparentHeader noBgPadding>
            <Grid container>
                <Grid container item xs={12} lg={4} style={{ padding: '8rem 2rem 2rem' }}>
                    {
                        links.map((link, key) => (
                            <Grid key={key} xs={6} item style={{ padding: '1rem' }}>
                                <Link to={`/account/${link.link}`}>
                                    <div className="dash-let">
                                        <img src={link.icon} />
                                        <p>{link.label}</p>
                                    </div>
                                </Link>
                            </Grid>
                        ))
                    }
                    <Grid xs={6} item style={{ padding: '1rem' }}>
                        <div className="dash-let" onClick={() => logoutUser()}>
                            <img src={logout} />
                            <p>Log Out</p>
                        </div>
                    </Grid>
                </Grid>
                { 
                    !isTab &&
                    <Grid item xs={12} lg={8}>
                        <img src={trees} style={{ width: '100%' }} />
                    </Grid>
                }
            </Grid>
        </PageContainer>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser }, dispatch)
}

export default connect(null, mapDispatchToProps)(Account)
