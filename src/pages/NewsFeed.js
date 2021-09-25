import { Grid, ListItem, Button, TextField, InputAdornment, IconButton, FormControl, FormControlLabel, Checkbox, FormGroup, List, Paper } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import ProductCard from '../components/ProductCard'
import { Search, Person } from '@material-ui/icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchAll } from '../redux/actions/general';
import { addToCart } from '../redux/actions/user';
import { Link } from 'react-router-dom'

const NewsFeed = ({ general, fetchAll, addToCart }) => {
    const [ categories, setCategories ] = useState([])
    const [ categoriesHeight, setCategoriesHeight ] = useState('200px')
    const [ products, setProducts ] = useState(general.products)

    useEffect(() => {
        updateAll();
    }, [general])

    const updateAll = () => {
        if(general.utilities?.hasOwnProperty('categories')) {
            setCategories(general.utilities.categories)
        }
        setProducts(general.products)
    }

    const init = async () => {
        await fetchAll();
    }

    useEffect(() => {
        init();
    }, [])
    
    
    return (
        <PageContainer logo="dark">
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ top: '120px' }}>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Become a Content Creator Today</h4>
                            <Link to="become-a-content-creator">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Request your prime orders</h4>
                            <Link to="/prime-orders">
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
                </Grid>
                
                <Grid item xs={12} md={9} lg={8}>
                    {
                        products.map((product, key) => (
                            <ProductCard addToCart={addToCart} key={key} product={product} />
                        ))
                    }
                </Grid>
            
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar right">
                    <div className="MuiAppBar-positionSticky" style={{  top: '120px' }}>
                        <Button className="btn" color="primary" variant="contained" fullWidth>
                            Upload an Item
                        </Button>

                        <Button className="btn white" color="inherit" variant="contained" fullWidth>
                            Verify your account
                        </Button>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle">Content Creators</h4>
                            <List>
                                <ListItem>
                                    <Person />
                                    <p className="no-margin">Jane Doe</p>
                                </ListItem>
                            </List>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle">Followed Profiles</h4>
                            <List>
                                <ListItem>
                                    <Person />
                                    <p className="no-margin">Jane Doe</p>
                                </ListItem>
                            </List>
                        </div>


                    </div>
                </Grid>
                
            </Grid>
        </PageContainer>
    )
}

const mapStateToProps = ({ general }) => ({ general })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchAll, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
