import { Divider, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import PageContainer from '../components/PageContainer';
import Dashlet from '../components/profile/Dashlet';
import { Dashboard, AccountBalanceWallet, Settings, ShoppingCart, ShoppingBasket, ListAlt, Message, PermContactCalendar, ExitToApp } from '@material-ui/icons'
import { useMediaQuery } from 'react-responsive'
import { useHistory, useLocation } from 'react-router-dom';
import Permits from '../components/profile/Permits';
import Wallet from '../components/profile/Wallet';
import Products from '../components/profile/Products';
import EditProduct from '../components/profile/EditProduct';
import { logoutUser } from '../redux/actions/user';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const Profile = ({ logoutUser, ...props}) => {
    const location = useLocation();
    const [ section, setSection ] = useState('')
    const [ product, setProduct ] = useState()
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const history = useHistory()
    const dashlets = [
        {
            icon: <AccountBalanceWallet style={{ color: "green" }} />,
            data: 200,
            label: 'Wallet Balance'
        },
        {
            icon: <ShoppingBasket style={{ color: "green" }} />,
            data: 200,
            label: 'All Products'
        },
        {
            icon: <ShoppingCart style={{ color: "green" }} />,
            data: 200,
            label: 'All Product Orders'
        },
        {
            icon: <ListAlt style={{ color: "green" }} />,
            data: 200,
            label: 'All Transactions'
        },
        {
            icon: <Message style={{ color: "green" }} />,
            data: 200,
            label: 'All Messages'
        },
    ]
 
    const links = [
        { link: '', label: 'Dashboard', icon: <Dashboard />},
        { link: 'products', label: 'Products', icon: <ShoppingBasket />},
        { link: 'prod-orders', label: 'Product Orders', icon: <ListAlt /> },
        { link: 'permits', label: 'Permits', icon: <PermContactCalendar />},
        { link: 'wallet', label: 'Wallet', icon: <AccountBalanceWallet />},
        { link: 'settings', label: 'Settings', icon: <Settings />}
    ]

    const getActiveColor = (sect) => {
        const path = location.pathname.split('profile/')[1]
        return (sect.includes(path) && (path !== '')) ? true : (path == '' && sect == '') ? true : false
    }

    const navigate = (link) => {
        history.push(`/profile/${link}`)
    }

    const DashboardSection = () => (
        <Grid container>
            {
                dashlets.map((dash, key) => (
                    <Dashlet dashlet={dash} key={key} />
                ))
            }
        </Grid>
    )

    const getSection = () => {
        switch(section) {
            case 'products': return <Products navigate={navigate} setProduct={setProduct} />
            case 'permits': return <Permits />
            case 'product': return <EditProduct product={product} />
            case 'prod-orders': return <></>
            case 'wallet': return <Wallet />
            case '': return <DashboardSection />
            default: return <> </>
        }
    }

    useEffect(() => {
        if(props.match.params.hasOwnProperty('section')) setSection(props.match.params.section)
        else { setSection('') }
    }, [props.match.params])

    return (
        <PageContainer>
            <Grid container style={{ marginLeft: '-1rem' }}>
                <Grid item xs={2} className="profile-sidebar">
                    <List>
                        {
                            links.map((link, key) => (
                                <ListItem 
                                    onClick={() => navigate(link.link)} 
                                    alignItems="center" button key={key} 
                                    className={getActiveColor(link.link) ? 'active-menu' : ''}
                                >
                                    <ListItemIcon>{link.icon}</ListItemIcon>
                                    { !isPhone && <ListItemText primary={link.label} /> }
                                </ListItem>
                            ))
                        }
                        <ListItem 
                            onClick={async () => await logoutUser()} 
                            alignItems="center" button
                        >
                            <ListItemIcon><ExitToApp /></ListItemIcon>
                            { !isPhone && <ListItemText primary="Logout" /> }
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={10} style={{ padding: '0rem 0 2rem 2rem' }}>
                    { getSection() }
                </Grid>
            </Grid>
        </PageContainer>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser }, dispatch)
}

export default connect(null, mapDispatchToProps)(Profile)
