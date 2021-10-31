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
        // <Link to>
            <Grid item xs={12} md={4} container className="product-card">
                <Grid item xs={12} container className="section wt-bg">
                    <Grid item xs={12}>
                        <img className="img" src={(product.images.length > 0) ? product.images[0].file : ''} />
                    </Grid>
                    <Grid item xs={12}>
                        <h4>{product.name}</h4>
                        <h5>By {product.seller}</h5>
                        <p>${product.price} <sup>PER {product.value}</sup></p>
                    </Grid>
                    <Grid className="icons" item xs={12} container alignItems="center" direction="row" wrap="nowrap">
                        <img src={choice} />
                        <img src={tick} />
                        <img src={tick} />
                        <img src={badge} />
                    </Grid>
                </Grid>
            </Grid>
        // </Link>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(ProductCard)
