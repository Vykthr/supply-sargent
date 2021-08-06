import { Button, Card, CardActions, CardContent, CircularProgress, Grid, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateProfile } from '../../redux/actions/user'
import userApi from '../../redux/api/user'
import moment from 'moment';
import Alert from '../Alert'
import { useHistory } from 'react-router-dom';

const Permits = ({ user, updateProfile, general }) => {
    const history = useHistory()
    const [userDetails, setUserDetails] = useState(user.userData)
    const [ categories, setCategories ] = useState([])
    const [ currentPermits, setCurrentPermits] = useState([])
    const [ updating, setUpdating] = useState(-1)
    const [ alertConfig, setAlertConfig ] = useState({})   
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setUserDetails(user.userData)
        if(user.userData?.currentPermits) setCurrentPermits(user.userData.currentPermits)
        console.log(currentPermits)
    }, [user])

    useEffect(() => {
        if(general.utilities.hasOwnProperty('categories')) setCategories(general.utilities.categories)
    }, [general])

    const permits = [
        { id: 1, name: 'content creator', price: 4.99, categories: categories.filter(({ permitId }) => permitId == 1 ) },
        { id: 2, name: 'seedling', price: 5.99, categories: categories.filter(({ permitId }) => permitId == 2 ) },
        { id: 3, name: 'professional', price: 7.99, categories: categories.filter(({ permitId }) => permitId == 3 ) },
        { 
            id: 4,
            name: 'agro-shop', price: 12.99, 
            categories: categories.filter(({ permitId }) => permitId == 4 ) 
        },
        { 
            id: 5, name: 'business', price: 13.99, 
            categories: categories.filter(({ permitId }) => permitId == 5 )
        },
        { 
            id: 6, name: 'farmer', price: 15.99, 
            categories: categories.filter(({ permitId }) => permitId == 6 )
        },
    ]

    const setPermit = async ({ categories, ...permit }) => {
        try {
            setUpdating(permit.id)
            const usrDetails = await (await userApi.getUserData(userDetails.email)).data()

            if(usrDetails?.balance && usrDetails?.balance > permit.price) {
                const currentPs = [ ...currentPermits ]
                const permitToAdd = {
                    ...permit,
                    paymentRef: '',
                    startDate: moment().format(),
                    endDate: moment().add(1, 'months').format()
                }
                const index = currentPs.map(({ id }) => {return id; }).indexOf(permit.id);

                if(index > -1) {
                    currentPs[index] = permitToAdd;
                } else {
                    currentPs.push(permitToAdd)
                }

                const payload = { 
                    currentPermits: currentPs,
                    balance: usrDetails.balance - permit.price
                }
                await userApi.updateProfile(userDetails.email, payload)
                await updateProfile(userDetails.email)
                setAlertConfig({ 
                    success: true,
                    header: 'Successful', 
                    message: 'Thank you for your purchase, you can now access the categories in' + permit.name + "permit",
                })
                setOpenModal(true)


            } else {
                setAlertConfig({
                    error: true,
                    header: 'Insufficient Balance', 
                    message: 'Kindly visit the nearest supermarket, mini mart or any partnering business to purchase vouchers',
                    btn1Text: 'Purchase Now',
                    btn2Text: 'Cancel',
                    btn1Action: () => { history.push('/profile/wallet') }
                })
                setOpenModal(true)

            }
        }
        catch(err) {
            setAlertConfig({ error: true, open: true, header: 'Error', message: err.message})
            setOpenModal(true)
        }
        finally{
            setUpdating(-1)
        }
    }

    
    return (
        <>
            <h1 className="pageTitle">Permits</h1>

            <Grid container>
                {
                    permits.map((permit, key) => (
                        <Grid item xs={12} key={key} sm={12} md={4} className="permit-plan">
                            <Card>
                                <h3>{permit.name} Permit</h3>

                                <h4>
                                    ${permit.price}USD 
                                    <br /><small>per month</small>
                                </h4>
                                <CardContent style={{ flex: 1 }}>

                                    <h5>Available Categories</h5>
                                    <ul>
                                        {
                                            permit.categories.sort((a, b) => (a.name > b.name) ? 1 : -1 ).map(({name}, key) => (
                                                <li key={key}>{name}</li>
                                            ))
                                        }
                                    </ul>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth className="button btn" color="primary" variant="contained" onClick={() => setPermit(permit)}>
                                        {   
                                            updating == permit.id ? 
                                            <CircularProgress size={20} color="inherit" /> 
                                            : 
                                            (currentPermits.map(({ id }) => {return id; }).indexOf(permit.id) > -1) ? 'Renew' : 'Purchase'
                                        }
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>

            <Alert open={openModal} config={alertConfig} setOpenModal={setOpenModal}/>
        </>
    )
}

const mapStateToProps = ({ user, general }) => ({ user, general })

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({ updateProfile }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permits)
