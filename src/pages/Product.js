import { Grid, Button, TextField} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchProducts } from '../redux/actions/general';
import { addToCart } from '../redux/actions/user';
import { Link, useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { formatNumber, getDistanceFromLatLonInKm } from '../util'
import generalApi from '../redux/api/general'
import userApi from '../redux/api/user'
import tick from '../assets/images/tick.svg'
import choice from '../assets/images/choice.svg'
import badge from '../assets/images/badge.svg'


const Product = ({ addToCart, user, general }) => {
    const history = useHistory()
    const [ product, setProduct ] = useState({})
    const [ seller, setSeller ] = useState({})
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 1220px)' })
    const [ processing, setProcessing ] = useState(false)
    const [ userData, setUserData ] = useState({})
    const [ cartList, setCartList ] = useState(user.cartList)
    const [ currentLocation, setCurrentLocation ] = useState({})

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                setCurrentLocation(location);
            });
        } else {
            alert("Geolocation is required to upload a product.");
        }
    }

    const init = async (slug) => {
        setProcessing(true)
        try {
            const res = await generalApi.getProduct(slug);
            if(Boolean(res)) {
                setProduct(res)
                const slr = await userApi.getUserData(res.seller);
                setSeller(slr?.data() || {});
            }
        }
        finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user])

    useEffect(() => {
        getLocation()
    }, [])

    const addToCartList = async (remove = false) => {
        let newCart = [ ...cartList ]
        const index = newCart.map(({ id }) => id).indexOf(product.id)
        if(index > -1) {
            newCart[index].quantity += 1;
        } else {
            newCart.push({ ...product, quantity: 1 });
        }
        await addToCart(newCart)
    }

    useEffect(() => {
        setCartList(user.cartList)
    }, [user])

    const goto = (link) => {
        history.push(link)
    }

    useEffect(() => {
        const slug = history?.location?.pathname?.split('/product/')?.[1] || ''
        if(slug) init(slug)
        else history.push('/marketplace')
    }, [history])

    const chat = (email) => {
        if(Boolean(email !== userData.email)) {
            history.push(`/messages/${email}`)
        }
    }
    
    
    return (
        <PageContainer logo="dark" processing={processing}>
            <Grid container spacing={isPhone ? 0 : 3}>
                {   isDesktop && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar MuiAppBar-positionSticky"style={{ top: '120px' }}>
                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Do you want to become a vendor?</h4>
                            <Button onClick={() => goto('/become-a-vendor')} className="btn red" color="primary" variant="contained" fullWidth>
                                Learn More
                            </Button>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Request your prime orders</h4>
                            <Link to="prime-orders">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Advertise Now!</h4>
                            <h6 className="sectionTitle">Increase Sales <br/> Increase Traffic</h6>
                            <Link to="advertise">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <small style={{ color: '#fff', display: 'block' }}>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</small>

                </Grid> }
                
                <Grid item xs={12} md={9} lg={8} container spacing={3}>
                    {
                        Boolean(product?.name) &&
                        <Grid item xs={12} container className="product-card mt-1" style={{ height: 'fit-content' }}>
                            <Grid item xs={12} container className="section wt-bg no-padding" alignItems="center" spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <img style={{ width: '100%' }} src={(product.images.length > 0) ? product.images[0].file : ''} />
                                </Grid>
                                <Grid item xs={12} md={5} container>
                                    <Grid item xs={12}>
                                        <h1 className="mb-2">{product.name}</h1>

                                        <span>SELLER</span>
                                        <h3 className="mt-0">{seller?.lastName + ' ' + seller?.firstName}</h3>
                                        
                                        <p className="mt-1 mb-1" style={{ fontSize: '50px' }}>${formatNumber(product.price)} <sup style={{ fontSize: '18px' }}>PER {product.value}</sup></p>
                                    </Grid>

                                    <Grid className="icons"  spacing={1} item xs={12} container alignItems="center" direction="row" wrap="nowrap">
                                        <Grid item xs={5}><img src={choice} /></Grid>
                                        <Grid item xs={2}><img src={tick} /></Grid>
                                        <Grid item xs={2}><img src={tick} /></Grid>
                                        <Grid item xs={2}><img src={badge} /></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {
                        Boolean(seller?.firstName) &&
                        <Grid item xs={12} container className="product-card mt-1" style={{ height: 'fit-content' }}>
                            <Grid item xs={12} container className="section wt-bg" alignItems="center" spacing={3}>
                                <Grid item xs={12} md={8} container>
                                    <Grid className="icons" item xs={12} container alignItems="center" direction="row" wrap="nowrap">
                                        <Button variant="contained" className="btn green">Meeting Point</Button>
                                        <Button variant="contained" className="btn green">Curbside</Button>
                                    </Grid>
                                    <Grid item xs={12} className="prod-details">
                                        <p><span>Location:</span> {product?.location?.address || `${product?.location?.position?.lat} ${product?.location?.position?.lng}`}</p>
                                        <p><span>Condition:</span> {product?.condition}</p>
                                        {
                                            Boolean(currentLocation?.lat && currentLocation?.lng) ?
                                            <p><span>Distance:</span> {getDistanceFromLatLonInKm(currentLocation?.lat, currentLocation?.lng, product?.location?.position?.lat, product?.location?.position?.lng)}</p>
                                            :
                                            <p><small>Access to current location denied</small></p>
                                        }
                                        <p><span>Quantity:</span> {product?.availability} {product.value}</p>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <img style={{ width: '100%' }} src={(product?.images?.length > 0) ? product.images[0].file : ''} />
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar right MuiAppBar-positionSticky" style={{  top: '120px' }}>
                    <Button className="btn" color="primary" variant="contained" onClick={() => addToCartList()} fullWidth fullWidth>
                        Add to cart
                    </Button>

                    <Button className="btn white" color="inherit" variant="contained" fullWidth onClick={() => chat(product?.seller)}>
                        Message Seller
                    </Button>

                    <div className="section wt-bg">
                        <h4 className="sectionTitle">Change Currency</h4>
                        <TextField select SelectProps={{ native: true, style: { height: '40px' } }} variant="outlined" fullWidth style={{ margin: '.5rem 0 0' }} >
                            <option value="">Select an option</option>
                        </TextField>
                    </div>

                    <div className="section wt-bg">
                        <h4 className="sectionTitle">Wallet Balance</h4>

                        <h4 className="sectionTitle price">${formatNumber(userData.balance)}<sub>TTD</sub></h4>
                        <Link to="/account/wallet">
                            <Button className="btn red" color="primary" variant="contained" fullWidth>
                                Go to wallet
                            </Button>
                        </Link>

                        <label className="sectionTitle form-label">Vendors</label>
                        <TextField select SelectProps={{ native: true, style: { height: '40px' } }} variant="outlined" fullWidth >
                            <option value="">All Vendors</option>
                        </TextField>

                        <label className="sectionTitle form-label">Radius Meter</label>
                        <TextField InputProps={{ style: { height: '40px' } }} type="number" variant="outlined" fullWidth 
                            placeholder="Ex. 10km"
                        />
                    </div>
                </Grid>
                
                { !isDesktop && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar MuiAppBar-positionSticky" style={{ top: '120px' }}>
                    <div className="section wt-bg">
                        <h4 className="sectionTitle bigger">Do you want to become a vendor?</h4>
                        <Button onClick={() => goto('/become-a-vendor')} className="btn red" color="primary" variant="contained" fullWidth>
                            Learn More
                        </Button>
                    </div>

                    <div className="section wt-bg">
                        <h4 className="sectionTitle bigger">Request your prime orders</h4>
                        <Link to="prime-orders">
                            <Button className="btn red" color="primary" variant="contained" fullWidth>
                                Learn more
                            </Button>
                        </Link>
                    </div>

                    <div className="section wt-bg">
                        <h4 className="sectionTitle bigger">Advertise Now!</h4>
                        <h6 className="sectionTitle">Increase Sales <br/> Increase Traffic</h6>
                        <Link to="advertise">
                            <Button className="btn red" color="primary" variant="contained" fullWidth>
                                Learn more
                            </Button>
                        </Link>
                    </div>

                    <small style={{ color: '#fff', display: 'block' }}>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</small>

                </Grid> }

            </Grid>
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchProducts, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Product)
