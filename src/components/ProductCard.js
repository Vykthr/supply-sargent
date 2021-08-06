import React, { useState, useEffect } from 'react'
import { Grid, Button, IconButton } from '@material-ui/core'
import { useMediaQuery } from 'react-responsive'
import { ThumbUpAlt, Grade, PersonAdd, Remove, Add } from '@material-ui/icons'
import { connect } from 'react-redux'
import { addToCart } from '../redux/actions/user'
import { bindActionCreators } from 'redux';

const ProductCard = ({ product, general, addToCart, user }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const [ cartList, setCartList ] = useState(user.cartList)
    const [ quantity, setCartQuantity ] = useState(0)

    const addToCartList = async () => {
        let newCart = [ ...cartList ]
        const index = newCart.map(({ id }) => id).indexOf(product.id)
        console.log(index)
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

    useEffect(() => {
        const prod = cartList.find(({ id }) => product.id === id)
        if(prod) {
            setCartQuantity(prod.quantity)
        }
    }, [cartList])

    return (
        <>
            <Grid container className="product-card">
                <Grid item xs={12} md={6}>
                    <h4>{product.name}</h4>
                    <h5 style={{ margin: '.5rem 0' }}>Seller: {product.seller}</h5>
                    <img src={(product.images.length > 0) ? product.images[0].file : ''} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <p className="rating"><Grade style={{ color: 'orange', height: 'inherit' }} /> {product.rating ? (product.rating * 1).toFixed(1) : 0}</p>
                    
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
                    <p>Distance: <span>{product.quantity}</span></p>

                    <Grid container>
                        <Grid item xs={12} md={6} style={{ padding: isPhone ? '.25rem' : '0 .5rem 0 0' }}>
                            {
                                (cartList.map(({ id }) => id).indexOf(product.id) === -1) ?
                                <Button onClick={() => addToCartList()} variant="contained" color="primary" fullWidth style={{ height: '100%' }} >
                                    Add to cart
                                </Button>
                                :
                                <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                    <IconButton><Remove /></IconButton>
                                    <span>{quantity}</span>
                                    <IconButton><Add /></IconButton>
                                </div>
}
                        </Grid>
                        <Grid item xs={12} md={6} style={{ padding: isPhone ? '.25rem' : '0 .5rem 0 0' }}>
                            <Button variant="contained" color="primary" fullWidth style={{ height: '100%' }}>Message Seller</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
