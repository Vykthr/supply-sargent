import { Button, Grid, TextField } from '@material-ui/core'
import React from 'react'
import PageContainer from '../components/PageContainer'

const PrimeOrders = () => {
    const submitForm = (e) => {
        e.preventDefault();
    }
    return (
        <PageContainer secondary pageTitle="Prime Orders">
            <p className="semi-bold">Prime orders allows members to order items directly from us.</p>
            <p className="semi-bold">Orders will be fulfilled by our SS-Choice farmers</p>
            <p className="semi-bold">Members will be eligible for a line of credit which will increase as the relationship with our company increases.</p>
            <form className="mt-2" onSubmit={(e) => submitForm(e)}>
                <TextField 
                    name="email" label="Email Address" InputLabelProps={{ shrink: true }}
                    placeholder="Enter email address" variant="outlined" fullWidth
                />
                <TextField 
                    name="subject" label="Subject" InputLabelProps={{ shrink: true }}
                    placeholder="Enter email address" fullWidth
                    value="Prime Order" variant="outlined"
                    className="mt-2"
                />
                <TextField 
                    name="email" label="Order Request" InputLabelProps={{ shrink: true }}
                    placeholder="Enter order request" multiline rows={5} variant="outlined" fullWidth
                    className="mt-2"
                />
                <Button variant="contained" color="primary" type="submit" className="btn red">Send Email</Button>
            </form>
        </PageContainer>
    )
}

export default PrimeOrders
