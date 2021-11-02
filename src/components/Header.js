import React, { useState, useEffect } from 'react'
import { PRIMARY_COLOR } from '../styles/colors'
import Logo from '../assets/images/whitelogo.png'
import LogoDark from '../assets/images/SS-White-Logo.png'
import { AppBar, Toolbar, Grid, Divider, Drawer, List, ListItem, IconButton } from '@material-ui/core'
import { Menu, Search } from '@material-ui/icons'
import { Link, useHistory } from 'react-router-dom';
import { logoutUser } from '../redux/actions/user';
import { useMediaQuery } from 'react-responsive'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const Header = ({ type, user, logo = '', transparentHeader = false, secondary = false, logoutUser }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const [ cartList, setCartList ] = useState(user.cartList)
    const [drawer, setDrawer] = React.useState(false);
    const [userDetails, setUserDetails] = React.useState(user);
    const history = useHistory()
    const toggleDrawer = () => {
        setDrawer(!drawer)
    };
    const links = [
        { label: 'Home', url: '/'},
        { label: 'Newsfeed', url: '/newsfeed'},
        { label: 'Marketplace', url: '/marketplace'},
        { label: 'my dashboard', url: '/account'},
        // { label: 'my cart', url: '/cart', badge: cartList.length}
    ]	

    const handleRequest = async () => {
        if(userDetails.authenticated) {
            await logoutUser()
        } else {
            history.push('/login')
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', (e) => {
            const nav = document.querySelector('#float')
            // const childDiv = document.querySelector('#float #float-div')
            const scrollValue = document.documentElement.scrollTop || document.body.scrollTop
            if(scrollValue) { 
                if(scrollValue > 100 ) {
                    nav?.setAttribute('style', 'background: #fff'); 
                    // childDiv?.setAttribute('style', 'padding: 0 5%');
                } else {
                    nav?.setAttribute('style', `background: ${transparentHeader ? 'transparent' : '#fff'}`)
                    // childDiv?.removeAttribute('style'); 
                }
            }
        })
    }, [])
    
    useEffect(() => {
        setCartList(user.cartList)
        setUserDetails(user)
    }, [user])
// a	search	bar, and	'log	out.
    return (
        <AppBar id="float" elevation={secondary ? 0 : 4} position={ type == 'profile' ? 'fixed' : 'sticky'} style={{ backgroundColor: transparentHeader ? 'transparent' : '#fff' }}>
            <Toolbar style={{ display: 'block' }}>
                <nav>
                    <Grid container>
                        { 
                            type !== 'profile' &&
                            <Grid item  className="d-flex align-center">
                                { 
                                    !secondary && 
                                    <Link to="/">
                                        <img src={logo == 'dark' ? LogoDark : Logo } />
                                    </Link>
                                }
                            </Grid>
                        }
                        <Grid item className="d-flex align-center">
                            { 
                                !isPhone ?
                                <ul className="d-flex">
                                    {
                                        links.map(({label, url, badge = null}, key) => (
                                            <li key={key}><Link to={url}>{label}{badge > 0 && <sup className="badge">{badge}</sup>}</Link></li>
                                        ))
                                    }
                                    <li><Search style={{ color: "#FFF" }} /></li>
                                </ul>
                                :
                                <Menu onClick={() => toggleDrawer()} style={{ color: "#000", fontSize: 35 }} />
                            }
                        </Grid>
                    </Grid>
                </nav>
            </Toolbar>
            <>
                <Drawer className="custom-menu" anchor='right' open={drawer} onClose={() => toggleDrawer()}>
                    <List className="bg">
                        {
                            links.map(({label, url, badge=null}, key) => (
                                <div key={key}>
                                    <ListItem>
                                        <Link to={url} style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }}>
                                            {label}{badge && badge}
                                        </Link>
                                    </ListItem>
                                    
                                    <Divider />
                                </div>
                            ))
                        }
                        
                        <ListItem>
                            <Link to="#" style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }} onClick={() => handleRequest()}>
                                { userDetails.authenticated ? 'Logout' : 'Login' }
                            </Link>
                        </ListItem>
                    </List>
                </Drawer>
            </>
        </AppBar>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
