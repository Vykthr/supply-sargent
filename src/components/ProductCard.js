import React from 'react'
import { Grid} from '@material-ui/core'
import { connect } from 'react-redux'

import tick from '../assets/images/tick.svg'
import choice from '../assets/images/choice.svg'
import badge from '../assets/images/badge.svg'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product?.slug || ''}`}>
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
                    <Grid className="icons"  spacing={1} item xs={12} container alignItems="center" direction="row" wrap="nowrap">
                        <Grid item xs={5}><img src={choice} /></Grid>
                        <Grid item xs={2}><img src={tick} /></Grid>
                        <Grid item xs={2}><img src={tick} /></Grid>
                        <Grid item xs={2}><img src={badge} /></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Link>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(ProductCard)
