import { Button, Grid, TextField } from '@material-ui/core'
import React from 'react'
import PageContainer from '../components/PageContainer'

const Advertise = () => {
    const adverts = [
        { label: '100', price: 1 },
        { label: '500', price: 4 },
        { label: '1,000', price: 7 },
        { label: '5,000', price: 30 },
        { label: '10,000', price: 50 },
    ]
    return (
        <PageContainer secondary pageTitle="Advertise with Us">
            <p className="semi-bold">Our advertising plans allows members to advertise their product(s) or external businesses on the platform.</p>
            <p className="semi-bold">Images &amp; Videos will be shown on the news feed of all our members and the content created by our content creators</p>
            <p className="semi-bold">Below are the various packages available. Each package has a view total. The package will only end when your advertise product(s) reaches the total amount of views highlighted below.</p>
            <table style={{ fontSize: 13, textAlign: 'center', width: '100%' }} className="semi-bold">
                <tbody>
                    {
                        adverts.map(({ label, price }, key) => (
                            <tr key={key}>
                                <td>REACH {label} VIEWS</td>
                                <td>${price}.00USD</td>
                                <td><Button style={{ fontSize: 11, margin: '.3rem 0' }} variant="contained" color="primary" className="btn red">Request</Button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
                
        </PageContainer>
    )
}

export default Advertise
