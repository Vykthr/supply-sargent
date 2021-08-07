import { Grid, Button } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import Logo from '../assets/images/whitelogo.png'

const Home = ({ user }) => {
    const history = useHistory()

    return (
        <div className="home">
            <div container className="overlay">
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <Link to="/">
                            <img src={Logo} className="home-logo" />
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <div className="d-flex-column justify-center" style={{ height: '100%' }}>
                            <p style={{ fontWeight: 600, fontSize: '35pt' }}>Welcome to</p>
                            <h1 className="title">
                                Supply <br/> Sargent
                            </h1>
                            {/* <p>Supply Sargent LLC is an e-commerce platform which facilities the connection between farmers, agri-businesses and their customers in a unique, easy to use marketplace</p> */}
                        
                            <Button variant="contained" className="home-btn button" onClick={() => user.userData ? history.push('/news-feed') : history.push('/login') }>ENTER</Button>
                        </div>
                    </Grid>
                </Grid>
                <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '18pt' }}>Connecting Agri needs</p>
            </div>
        </div>
    )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps, null)(Home)
