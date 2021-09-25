import React, { useState, useEffect } from 'react'
import { PRIMARY_COLOR } from '../styles/colors'
import Logo from '../assets/images/whitelogo.png'
import LogoDark from '../assets/images/SS-White-Logo.png'
import { AppBar, Toolbar, Grid, Divider, Drawer, List, ListItem, IconButton } from '@material-ui/core'
import { Menu, Search } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { connect } from 'react-redux'
const Header = ({ type, user, logo = '', transparentHeader = false, secondary = false }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const [ cartList, setCartList ] = useState(user.cartList)
    const [drawer, setDrawer] = React.useState(false);
    const toggleDrawer = () => {
        setDrawer(!drawer)
    };
    const links = [
        { label: 'Home', url: '/'},
        { label: 'Newsfeed', url: '/newsfeed'},
        { label: 'Marketplace', url: '/marketplace'},
        { label: 'my dashboard', url: '/profile'},
        // { label: 'my cart', url: '/cart', badge: cartList.length}
    ]	
    
    useEffect(() => {
        console.log(user)
        setCartList(user.cartList)
    }, [user])
// a	search	bar, and	'log	out.
    return (
        <AppBar elevation={secondary ? 0 : 4} position={ type == 'profile' ? 'fixed' : 'sticky'} style={{ backgroundColor: transparentHeader ? 'transparent' : '#fff' }}>
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
                    <List>
                        {
                            links.map(({label, url, badge=null}, key) => (
                                <div  key={key}>
                                    <ListItem>
                                        <Link to={url} style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }}>
                                            {label}{badge && badge}
                                        </Link>
                                    </ListItem>
                                    
                                    <Divider />
                                </div>
                            ))
                        }
                        <ListItem button>
                            <Link  style={{ textTransform: 'capitalize', color: '#212529', fontWeight: '600' }} to='/'>
                                Login
                            </Link>
                        </ListItem>
                    </List>
                </Drawer>
            </>
        </AppBar>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(Header)
