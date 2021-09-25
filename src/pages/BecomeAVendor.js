import { Button } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/PageContainer'

const BecomeAVendor = () => {
    return (
        <PageContainer secondary pageTitle="Become a Vendor">
            <p className="semi-bold">To become a vendor on the platform. A user must purchase permits.</p>
            <p className="semi-bold">Each permit will have its own categories whereby a person can label their product(s) so its can be found easily be a consumer on the platform.</p>
            <p className="semi-bold">A free trial period of three(3) months for each permit is granted to a potential seller so they can experience the benefits of becoming a vendor on the platform.</p>
            <p className="mt-5">Permits lasts for a 30 day period whereby they must be renewed or the person will no longer be able to upload product(s) using that specific permit.</p>

            <Link to="/account/permits"><Button variant="contained" color="primary"  className="btn red">Go to Permits</Button></Link>
        </PageContainer>
    )
}

export default BecomeAVendor
