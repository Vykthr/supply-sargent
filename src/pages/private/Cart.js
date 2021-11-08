import { Table, TableBody, TableHead, TableRow, TableCell, Button, ListItemText, IconButton, Grid, TableContainer } from '@material-ui/core';
import { Delete, Remove, Add } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { addToCart } from '../../redux/actions/user';
import { bindActionCreators } from 'redux';
import AccountComponent from '../../components/account/AccountComponent';

const Cart = ({ user, addToCart }) => {

    const [ cartList, setCartList ] = useState(user.cartList)

    useEffect(() => {
        setCartList(user.cartList)
    }, [user])

    return (
        <AccountComponent section="cart">
            
            <TableContainer>
                <Table>
                    <TableHead stickyHeader >
                        <TableRow>
                            <TableCell align="center">S/N</TableCell>
                            <TableCell align="center">Product Image</TableCell>
                            <TableCell align="center">Product</TableCell>
                            <TableCell align="center">Unit Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Sub Total</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            cartList.map((prod, key) => (
                                <TableRow key={key}>
                                    <TableCell>{key + 1}</TableCell>
                                    <TableCell>
                                        <img style={{ objectFit: 'contain', width: '100px', height: '50px' }} 
                                            src={prod.images.length > 0 ? prod.images[0].file : ''}
                                            alt="prod-image" 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ListItemText primary={prod.name} secondary={`Seller: ${prod.seller}`} />
                                    </TableCell>
                                    <TableCell>${prod.price}</TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton><Remove /></IconButton>
                                            <span style={{ margin: '0 .5rem' }}>{prod.quantity}</span>
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
            </TableContainer>
            {/* <Grid container>
                <Grid xs={12}>
                    
                </Grid>
            </Grid> */}
        </AccountComponent>

    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)
