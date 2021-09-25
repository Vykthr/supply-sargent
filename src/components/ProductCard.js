import React, { useState, useEffect } from 'react'
import { Grid, Button, IconButton } from '@material-ui/core'
import { useMediaQuery } from 'react-responsive'
import { ThumbUpAlt, Grade, PersonAdd, Remove, Add } from '@material-ui/icons'
import { connect } from 'react-redux'

import tick from '../assets/images/tick.svg'
import choice from '../assets/images/choice.svg'
import badge from '../assets/images/badge.svg'

const ProductCard = ({ product, general, addToCart, user }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const isTab = useMediaQuery({ query: '(max-width: 1200px)' })
    const [ cartList, setCartList ] = useState(user.cartList)
    const [ quantity, setCartQuantity ] = useState(0)

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

    const getQuantity = () => {
        const prod = cartList.find(({ id }) => product.id === id)
        return prod?.quantity || 0
    }

    return (
        <Grid xs={6} md={4} container className="product-card">
            <Grid xs={12} container className="section wt-bg">
                <Grid item xs={12}>
                    <img className="img" src={(product.images.length > 0) ? product.images[0].file : ''} />
                </Grid>
                <Grid item xs={12}>
                    <h4>{product.name}</h4>
                    <h5>By {product.seller}</h5>
                    <p>${product.price} <sup>PER {product.value}</sup></p>
                </Grid>
                <Grid className="icons" item xs={12} container alignItems="center" direction="row">
                    <img src={choice} />
                    <img src={tick} />
                    <img src={tick} />
                    <img src={badge} />
                {/*                    
                    <div style={{ display: 'flex' }}>
                        <Button variant="outlined" color="primary" startIcon={<ThumbUpAlt /> }>     
                            { !isPhone && 'Like' }
                        </Button>
                        <Button variant="outlined" color="primary" startIcon={<PersonAdd /> }>
                        { !isPhone && 'Follow' }
                        </Button>
                        <span className="price">${product.price}</span>
                        <span className="price-sup">TTD</span>
                    </div>

                    <p>Product Value: <span>{product.value}</span></p>
                    <p>Condition: <span>{product.condition}</span></p>
                    <p>Location: <span>{product.location}</span></p>
                    <p>Availability: <span>{product.availability}</span></p>
                    <p>Distance: <span></span></p>

                    <Grid container>
                        <Grid container item xs={12} md={6} style={{ padding: isPhone ? '.25rem' : '0 .5rem 0 0' }}>
                            {
                                (cartList.map(({ id }) => id).indexOf(product.id) === -1) ?
                                <Button onClick={() => addToCartList()} variant="contained" color="primary" fullWidth style={{ height: '100%' }} >
                                    Add to cart
                                </Button>
                                :
                                <div className="cart-add-btns">
                                    <IconButton><Remove /></IconButton>
                                    <span>{getQuantity()}</span>
                                    <IconButton onClick={() => addToCartList()}><Add /></IconButton>
                                </div>
}
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: isPhone ? '.25rem' : '0 .5rem 0 0' }}>
                            <Button variant="contained" color="primary" fullWidth style={{ height: '100%' }}>Message Seller</Button>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(ProductCard)
