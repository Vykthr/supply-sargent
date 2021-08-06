import { Table, TableBody, TableHead, TableRow, TableCell, TableFooter, Button, ListItemText, IconButton, Grid } from '@material-ui/core';
import { Delete, Remove, Add } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer';
import { connect } from 'react-redux';
import { addToCart } from '../redux/actions/user';
import { bindActionCreators } from 'redux';

const Cart = ({ user, addToCart }) => {

    const [ cartList, setCartList ] = useState(user.cartList)

    useEffect(() => {
        setCartList(user.cartList)
    }, [user])

    return (
        <PageContainer pageTitle="My Cart">
            <Table>
                <TableHead stickyHeader >
                    <TableRow>
                        <TableCell>S/N</TableCell>
                        <TableCell>Product Image</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>SubTotal</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        cartList.map((prod, key) => (
                            <TableRow key={key}>
                                <TableCell>{key + 1}</TableCell>
                                <TableCell>
                                    <img style={{ objectFit: 'cover', width: '100px', height: '50px' }} 
                                        src={prod.images.length > 0 ? prod.images[0].file : ''}
                                        alt="prod-image" 
                                    />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={prod.name} secondary="Seller: James Gosling" />
                                </TableCell>
                                <TableCell>${prod.price}</TableCell>
                                <TableCell>
                                    <div>
                                        <IconButton><Remove /></IconButton>
                                        <span>{prod.quantity}</span>
                                        <IconButton><Add /></IconButton>
                                    </div>
                                </TableCell>
                                <TableCell>${prod.price * prod.quantity}</TableCell>
                                <TableCell>
                                    <IconButton>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Grid container>
                <Grid xs={12}>
                    
                </Grid>
            </Grid>
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)
