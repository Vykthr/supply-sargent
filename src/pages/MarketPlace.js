import { Grid, Button, TextField} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import ProductCard from '../components/ProductCard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchProducts } from '../redux/actions/general';
import { addToCart } from '../redux/actions/user';
import { Link, useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import AddProduct from '../components/AddProduct'
import { formatNumber } from '../util'

const MarketPlace = ({ general, fetchProducts, addToCart, user }) => {
    const history = useHistory()
    const [ categories, setCategories ] = useState([])
    const [ products, setProducts ] = useState(general.products)
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ processing, setProcessing ] = useState(false)
    const [ userData, setUserData ] = useState({})

    useEffect(() => {
        updateAll();
    }, [general])

    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user])

    const updateAll = () => {
        if(general.utilities?.hasOwnProperty('categories')) {
            setCategories(general.utilities.categories)
        }
        setProducts(general.products)
    }

    const init = async () => {
        setProcessing(true)
        try {
            await fetchProducts();
        }
        finally {
            setProcessing(false)
        }
    }

    const goto = (link) => {
        history.push(link)
    }

    useEffect(() => {
        if(!openDialog) init()
    }, [openDialog])

    
    
    return (
        <PageContainer logo="dark" processing={processing}>
            <Grid container>
                { !isPhone && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ top: '120px' }}>

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

                    </div>
                </Grid> }
                
                <Grid item xs={12} md={9} lg={8} container spacing={2} style={{ padding: isPhone ? 0 : '1rem' }}>
                    {
                        products.map((product, key) => (
                            <ProductCard addToCart={addToCart} key={key} product={product} />
                        ))
                    }
                </Grid>
            
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar right">
                    <div className="MuiAppBar-positionSticky" style={{  top: '120px' }}>
                        <Button className="btn" color="primary" variant="contained" fullWidth fullWidth onClick={() => setOpenDialog(true)}>
                            Upload an Product
                        </Button>

                        <Button className="btn white" color="inherit" variant="contained" fullWidth>
                            Advanced Search
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


                    </div>
                </Grid>
                
                { isPhone && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ top: '120px' }}>

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

                    </div>
                </Grid> }

                <AddProduct categories={categories} open={openDialog} setOpenDialog={setOpenDialog} user={userData?.email || null} freeTrial={userData?.freeTrial || null} />
            </Grid>
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchProducts, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MarketPlace)
