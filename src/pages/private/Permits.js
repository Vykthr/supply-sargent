import { Button, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AccountComponent from '../../components/account/AccountComponent'
import { fetchUtilities } from '../../redux/actions/general'

const Permits = ({ general, fetchUtilities }) => {
    const [ permits, setPermits] = useState(general?.utilities?.permits || [])
    const [ categories, setCategories] = useState(general?.utilities?.categories || [])
    const [ processing, setProcessing] = useState(false)

    useEffect(() => {
        setPermits(general?.utilities?.permits || [])
        setCategories(general?.utilities?.categories || [])
    }, [general])

    const init = async () => {
        try {
            setProcessing(true)
            await fetchUtilities();
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
    return (
        <AccountComponent section="permits" processing={processing}>
            <TableContainer>
                <Table>
                    <TableBody>
                        {
                            permits.map(({ name, price }, key) => (
                                <TableRow key={key}>
                                    <TableCell style={{ textTransform: 'capitalize' }}>{name}</TableCell>
                                    <TableCell>${price}USD</TableCell>
                                    <TableCell className="d-flex">
                                        <Button className="btn red mr-1" color="primary" variant="contained">Purchase</Button>
                                        <Button className="btn" color="primary" variant="contained">View Categories</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </AccountComponent>
    )
}

const mapStateToProps = ({ general }) => ({ general })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchUtilities }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Permits);
