import { Grid, ListItem, Button, TextField, InputAdornment, IconButton, FormControl, FormControlLabel, Checkbox, FormGroup, List } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import ProductCard from '../components/ProductCard'
import { Search, Person } from '@material-ui/icons'
import { connect } from 'react-redux'
import { addToCart } from '../redux/actions/user'
import { bindActionCreators } from 'redux';
import { fetchAll } from '../redux/actions/general'
const NewsFeed = ({ general, fetchAll }) => {
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
        <PageContainer>
            <Grid container>
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ padding: '1rem 2rem 0 0', top: '120px' }}>

                        <Button color="primary" variant="contained" fullWidth>
                            Upload an Item
                        </Button>

                        <FormControl className="form-control" style={{ margin: '0 0 1rem'}}>
                            <TextField
                                variant="outlined"
                                placeholder="Search"
                                style={{ marginTop: '1.5rem' }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                className="no-margin"
                                                disableRipple
                                                disableTouchRipple
                                                disableFocusRipple
                                                edge="end"
                                            >
                                                <Search />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </FormControl>

                        <div className="section">
                            <h4 className="sectionTitle">Categories</h4>

                            <FormControl className="categories" style={{ height: `${categoriesHeight}`, overflow: 'hidden' }}>
                                <FormGroup>
                                    {
                                        categories.sort((a, b) => (a.name > b.name) ? 1 : -1)
                                        .map((category, key) => (
                                            <FormControlLabel key={key}
                                                control={<Checkbox color="primary" name={category.name} />}
                                                label={category.name}
                                            />
                                        ))
                                    }
                                </FormGroup>
                            </FormControl>
                            <Button 
                                color="primary" 
                                onClick={() => setCategoriesHeight(categoriesHeight == '200px' ? 'auto' : '200px')} 
                                variant="contained"
                                style={{ marginTop: '1rem' }}
                            >
                                { categoriesHeight == '200px' ? 'Expand' : 'Collapse' }
                            </Button>

                        </div>

                        <div className="section">
                            <h4 className="sectionTitle">Search Radius</h4>

                            <p style={{ margin: '1rem 0 -0.3rem' }}>Country</p>
                            <Button variant="contained" color="primary" style={{ marginRight: '.5rem' }}>Trinidad</Button>

                            <p style={{ margin: '1rem 0 -0.3rem' }}>Distance</p>
                            <Button variant="contained" color="primary">40 KM</Button>
                        </div>

                        <small style={{ textAlign: 'center', display: 'block' }}>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</small>

                    </div>
                </Grid>
                
                <Grid item xs={12} md={9} lg={8}>
                    {
                        products.map((product, key) => (
                            <ProductCard key={key} product={product} />
                        ))
                    }
                </Grid>
            
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar right">
                    <div className="MuiAppBar-positionSticky" style={{ padding: '1rem 0 0 2rem', top: '120px' }}>
                        <div className="section">
                            <h4 className="sectionTitle">Account Balance</h4>
                            <div style={{ display: 'flex'}}><span className="price">$1,015.25 </span><span className="price-sup">TTD</span> </div>

                            <Button variant="contained" color="primary" style={{ marginRight: '.5rem' }}>Withdraw</Button>
                            <Button variant="contained" color="primary">Send</Button>
                        </div>


                        <div className="section">
                            <h4 className="sectionTitle">My Cart</h4>
                            <div style={{ display: 'flex'}}><span className="price">$1,015.25 </span><span className="price-sup">TTD</span> </div>
                            <p className="no-margin">4 items in cart</p>

                            <Button variant="contained" color="primary" style={{ marginRight: '.5rem' }}>Withdraw</Button>
                            <Button variant="contained" color="primary">Send</Button>
                        </div>

                        <div className="section">
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
    return bindActionCreators({ fetchAll }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
