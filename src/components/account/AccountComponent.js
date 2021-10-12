import { Button, Grid, IconButton } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../PageContainer'
import trees from '../../assets/images/trees.png'
import cart from '../../assets/images/cart.png'
import permits from '../../assets/images/permits.png'
import logout from '../../assets/images/logout.png'
import orders from '../../assets/images/orders.png'
import products from '../../assets/images/products.png'
import wallet from '../../assets/images/wallet.png'
import { Link, useHistory } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from '@material-ui/icons'
import { useMediaQuery } from 'react-responsive'

const links = [
    { link: 'products', label: 'Products', icon: products},
    { link: 'cart', label: 'My Cart', icon: cart},
    { link: 'permits', label: 'Permits', icon: permits },
    { link: 'orders', label: 'Orders', icon: orders},
    { link: 'wallet', label: 'Wallet', icon: wallet}
]


const AccountComponent = ({ children, section }) => {
    const history = useHistory()
    const [ active, setActive ] = useState(links[0]);
    const isTab = useMediaQuery({ query: '(max-width: 1280px)' })

    useEffect(() => {
        setActive(links.find(({ link }) => link === section) || links[0])
    }, [section])

    const navigate = (type) => {
        const index = links.indexOf(active);
        let nxt;
        if(type === 'next') {
            nxt = links[ index < links.length - 1 ? index + 1 : 0]
        } else {
            nxt = links[ index > 0 ? index - 1 : links.length - 1]
        }

        history.push(`/account/${nxt.link}`)
    }

    return (
        <PageContainer type="profile" transparentHeader noBgPadding>
            <Grid container>
                <Grid item xs={12} md={12} lg={6} container style={{ padding: '8rem 2rem 2rem' }}>
                    <Grid xs={12} item style={{ padding: '1rem' }} container direction="row" justifyContent="center" alignItems="center">
                        <Button onClick={() => navigate('previous')} style={{ height: '200px', margin: '0 .5rem' }}><ChevronLeft /></Button>
                        <div className="dash-let" style={{ width: '200px', height: '200px', padding: '1rem' }}>
                            <img src={active.icon} />
                            <p>{active.label}</p>
                        </div>
                        <Button onClick={() => navigate('next')} style={{ height: '200px', margin: '0 .5rem' }}><ChevronRight /></Button>
                    </Grid>
                    <Grid xs={12} item>
                        <div className="wt-bg">
                            {children}
                        </div>
                    </Grid>
                </Grid>
                { 
                    !isTab &&
                    <Grid lg={6}>
                        <img src={trees} style={{ width: '100%' }} />
                    </Grid>
                }
            </Grid>
        </PageContainer>
    )
}

export default AccountComponent
