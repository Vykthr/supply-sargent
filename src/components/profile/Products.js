import { Button, IconButton, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Edit } from '@material-ui/icons';

const Products = ({ navigate, user, setProduct, general }) => {
    const history = useHistory()
    const [ toggleModal, setToggleModal ] = useState(false)
    const [ userDetails, setUserDetails ] = useState({})
    const [ currentPermits, setCurrentPermits ] = useState({})
    const [ products, setProducts ] = useState(general.products)

    const upload = () => {
        if(currentPermits.filter((permit) => moment(new Date(permit.endDate)).diff(new Date(), 'days') > -1 ) || userDetails?.admin) {
            setProduct({
                name: '',
                value: '',
                seller: '',
                location: '',
                condition: '',
                availability: '',
                categories: [],
                permitId: '',
                distance: '',
                likes: 0,
                rating: 0,
                price: 0,
                images: [''],
            })
            navigate('product')
        } else {
            setToggleModal(true)
        }
    }

    useEffect(() => {
        if(user?.userData) setUserDetails(user?.userData)   
        if(user?.userData?.currentPermits) setCurrentPermits(user?.userData?.currentPermits)   
    }, [user])

    useEffect(() => {
        setProducts(general.products)
    }, [general])

    const editProduct = (product) => {
        setProduct(product)
        
        navigate('product')
    }


    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={() => upload()}>
                        Upload Product
                    </Button>
                </Grid>
            </Grid>

            <Card style={{ padding: '20px', margin: '20px 0' }}>
                <Grid container style={{ alignItems: 'center' }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5">
                            All Products
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            variant="outlined"
                            placeholder="Search Products"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Card>
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>S/N</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Orders</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={{ textTransform: 'capitalize' }}>
                    {
                        products.map((prod, key) => (
                            <TableRow key={key}>
                                <TableCell>{key + 1}</TableCell>
                                <TableCell>{ prod.images.length > 0 && <img width="100px" src={prod.images[0].file} /> }</TableCell>
                                <TableCell>{prod.name}</TableCell>
                                <TableCell>{prod.price}</TableCell>
                                <TableCell>{prod.condition}</TableCell>
                                <TableCell>{prod.location}</TableCell>
                                <TableCell>{prod.availability}</TableCell>
                                <TableCell>{prod.active ? 'True' : 'False'}</TableCell>
                                <TableCell>0</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => editProduct(prod)}>
                                        <Edit color="primary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        
            <Dialog open={toggleModal} PaperProps={{ style: { padding: '1rem' }}}>
                <DialogContent>
                    <h2 style={{ marginBottom: 0 }}>Permit is Required</h2>
                    <h4 style={{ marginTop: '5px' }}>You need a permit to upload products</h4>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" className="button" onClick={() => setToggleModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" className="button" onClick={() => navigate('permits')}>
                        Get a permit
                    </Button>
                </DialogActions>
            </Dialog>
        
        
        </div>
    )
}

const mapStateToProps = ({ user, general }) => ({ user, general })

export default connect(mapStateToProps, null)(Products)
