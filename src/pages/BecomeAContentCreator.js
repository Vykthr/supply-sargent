import { Button } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/PageContainer'

const BecomeAContentCreator = () => {
    return (
        <PageContainer secondary pageTitle="Become a Content Creator">
            <p className="semi-bold">Enjoy the benefits of uploading content on the platform</p>
            <p className="semi-bold">Content must be related to the agricultural world or food industry ONLY!</p>
            <p className="semi-bold">Content creators will benefit from being paid per view based on our system implemented.</p>

            <Link to="/account/permits"><Button variant="contained" color="primary"  className="btn red">Go to Permits</Button></Link>
        </PageContainer>
    )
}

export default BecomeAContentCreator
