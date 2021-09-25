import { Grid, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import Logo from '../assets/images/whitelogo.png'
import { ArrowForwardIosOutlined }  from '@material-ui/icons'
import { fetchAll } from '../redux/actions/general';
import { bindActionCreators } from 'redux';
import PageContainer from '../components/PageContainer'
import { useMediaQuery } from 'react-responsive'

const Home = ({ user, fetchAll }) => {
    const history = useHistory()
    const [ userDetails, setDetails ] = useState()
    const isTab = useMediaQuery({ query: '(max-width: 950px)' })

    const init = async () => {
        await fetchAll();
    }

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        Boolean(user.userData) && setDetails(user.userData)
    }, [user])
    
    return (
        <div className="home">
            { isTab && <div className="overlay"></div> }
            <PageContainer noBg transparentHeader>
                <Grid container className="home-content">
                    <Grid item md={6} xs={12}>
                        <p>{ Boolean(userDetails) ? <span style={{ fontSize: '70%', textTransform: 'capitalize', color: '#F1FE2B' }}> Hi, {`${userDetails.firstName} ${userDetails.lastName}`} </span> : 'Welcome to'}
                        <span>Supply <br/> Sargent</span>
                        </p>

                        <h3>
                            Connect with farmers <br/> &amp; agri-businesses <br/> worldwide
                        </h3>
                    </Grid>
                    <Grid item md={6} xs={12} className="right">
                        <Button endIcon={<ArrowForwardIosOutlined />} >Learn More</Button>
                        <span>Copyright © { new Date().getFullYear() } Supply Sargent LLC - All Rights Reserved</span>
                    </Grid>
                </Grid>

            </PageContainer>
        </div>
    )
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchAll }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
