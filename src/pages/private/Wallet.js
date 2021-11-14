import { Button, Grid, TextField } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import AccountComponent from '../../components/account/AccountComponent'
import { formatNumber } from '../../util'
import { updateProfile } from '../../redux/actions/user'
import { bindActionCreators } from 'redux'
import userApi from '../../redux/api/user'

const Wallet = ({ user, updateProfile }) => {
    const [ userData, setUserData ] = useState(user?.userData || {})
    const [ processing, setProcessing] = useState(false)

    useEffect(() => {
        setUserData(user?.userData || {})
    }, [user])

    const init = async (email) => {
        try {
            setProcessing(true)
            const res = await userApi.getUserData(email);
            console.log(res.data())
        }
        catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }


    useEffect(() => {
        if(userData?.email) init(userData?.email)
    }, [userData])

    return (
        <AccountComponent section="wallet" processing={processing}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                    <TextField InputProps={{ style: { height: '40px' } }} fullWidth variant="outlined" placeholder="Enter voucher code" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button fullWidth className="btn red mt-0"  color="primary" variant="contained">Process</Button>
                </Grid>
                <Grid item xs={12} md={8}>
                    <p className="wallet-balance">
                        <sup>BALANCE</sup>
                        ${formatNumber(userData.balance)}
                        <sub>TTD</sub>
                    </p>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button fullWidth className="btn red mt-0"  color="primary" variant="contained">Change Currency</Button>
                </Grid>
                <Grid item xs={12}>
                    <p className="text-center mt-1 mb-2">Do you want the full experience? <b>Download SS-Pay</b></p>
                    <p className="text-center mt-1 mb-2"><b>SEND, RECEIVE, WITHDRAW &amp; TRACK YOUR PAYMENTS</b></p>
                </Grid>
            </Grid>
        </AccountComponent>
    )
}
const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateProfile }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
