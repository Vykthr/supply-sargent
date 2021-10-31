import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AccountComponent from '../../components/account/AccountComponent'
import { fetchUtilities } from '../../redux/actions/general'
import moment from 'moment'
import userApi from '../../redux/api/user'

const Permits = ({ general, user, fetchUtilities }) => {
    const [ permits, setPermits] = useState(general?.utilities?.permits || [])
    const [ userData, setUserData] = useState(user?.userData || {})
    const [ freeTrial, setFreeTrial] = useState(false)
    const [ categories, setCategories] = useState(general?.utilities?.categories || [])
    const [ activePermits, setActivePermits] = useState([])
    const [ processing, setProcessing] = useState(false)

    const [ purchasing, setPurchasing] = useState(false)

    const [ selectedPermit, setSelectedPermit] = useState(null)

    useEffect(() => {
        setPermits(general?.utilities?.permits || [])
        setCategories(general?.utilities?.categories || [])
    }, [general])

    const init = async () => {
        try {
            setProcessing(true)
            await fetchUtilities();
            const res = await userApi.getActivePermits(userData?.email)
            setActivePermits(res)
        }
        catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        setUserData(user?.userData || {})
    }, [user])

    useEffect(() => {
        setFreeTrial(
            userData.freeTrial
        )
    }, [userData])

    const purchase = async (permit) => {
        try {
            setPurchasing(true)
            const payload = {
                user: userData.email,
                ...permit
            }
            await userApi.purchasePermit(payload)
            init();
        }
        catch (err) {
            alert(err?.message || 'An error occurred. Kindly try again')
        }
        finally{
            setPurchasing(false)
        }
    }
    
    return (
        <AccountComponent section="permits" processing={processing}>
            {
                freeTrial && 'You are on a 2 months free trial'
            }
            <TableContainer>
                <Table>
                    <TableBody>
                        {
                            permits.map(({ name, price, id, ...others }, key) => (
                                <TableRow key={key}>
                                    <TableCell style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{name}</TableCell>
                                    <TableCell>${price}USD</TableCell>
                                    <TableCell className="d-flex">
                                        { 
                                            (freeTrial || Boolean(activePermits.find((active) => active?.id == id))) ?
                                            <Button onClick={() => setSelectedPermit({ name, price, id, ...others })} className="btn green mr-1" color="primary" variant="contained">Active</Button>
                                            :
                                            <Button onClick={() => purchase({ name, price, id, ...others })} className="btn red mr-1" color="primary" variant="contained">
                                                { purchasing ? <CircularProgress color="inherit" size={15} /> : 'Purchase'}
                                            </Button>
                                        }
                                        <Button onClick={() => setSelectedPermit({ name, price, id, ...others })} className="btn" color="primary" variant="contained">View Categories</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={Boolean(selectedPermit)} onClose={() => setSelectedPermit(null)}>
                <DialogContent className="pr-2 pl-2 pt-2">
                    <h3 className="no-margin text-capitalize">{ selectedPermit?.name } Categories</h3>
                    {
                        Boolean(selectedPermit) &&
                        categories.filter(({ permitId }) => permitId === selectedPermit?.id ).sort((a, b) => (a > b) ? 1 : -1).map((cat, key) => (
                            <p  className="text-capitalize" key={key}>{key + 1}. {cat.name}</p>
                        ))
                    }
                    {
                        freeTrial ?
                        `Expires: ${moment(userData?.registered).add(30, 'days').format('DD MMMM, YYYY')}`
                        :
                        Boolean(activePermits.find((active) => active?.id == selectedPermit?.id)) ?
                        `Expires: ${moment(activePermits.find((active) => active?.id == selectedPermit?.id)?.expires).format('DD MMMM, YYYY')}` : ''
                    }
                </DialogContent>
                <DialogActions className="pr-2 pl-2 pb-2">
                    <Button onClick={() => setSelectedPermit(null)} className="btn red" variant="contained" color="primary">Close</Button>

                    { !Boolean(activePermits.find((active) => active?.id == selectedPermit?.id)) && <Button onClick={() => purchase(selectedPermit)} color="primary" className="btn" variant="contained">
                        { 
                            purchasing ? <CircularProgress color="inherit" size={15} /> : 
                            'Purchase' 
                        }
                    </Button> }
                </DialogActions>
            </Dialog>
        </AccountComponent>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchUtilities }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Permits);
