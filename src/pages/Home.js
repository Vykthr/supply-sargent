import { Grid, Button } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import Logo from '../assets/images/whitelogo.png'

const Home = ({ user }) => {
    const history = useHistory()

    return (
        <div className="home">
            <div container className="overlay" style={{ justifyContent: 'inherit' }}>
                <Grid container>
                    <Grid item container xs={12} className="home-nav no-wrap d-flex align-center">
                        <Grid item xs={12} md={10} className="d-flex align-center">
                            <img src={Logo} />
                            <p>Welcome to <span>Supply sargent</span></p>
                        </Grid>
                        <Grid item md={2}>
                            <Button onClick={() => user.userData ? history.push('/news-feed') : history.push('/login') } fullWidth color="primary" variant="contained" className="btn">Enter</Button>
                        </Grid>
                    </Grid> 

                    
                    <Grid item xs={12} className="home-content">
                        <h3>connect with<br/>farmers &amp; agri-businesses<br/>worldwide </h3>

                        <p className="card">
                            Supply sargent is an e-commerce platform which facilitates the connection between farmers, agri-businesses and their customers providing a unique, easy to use online marketplace.
                        </p>


                        <Button variant="contained" className="home-btn button" onClick={() => user.userData ? history.push('/news-feed') : history.push('/login') }>SIGN UP/LOGIN</Button>
                    </Grid>
                    
                    <Grid item xs={12} className="home-footer">
                        <p>Copyright &copy; {new Date().getFullYear() } Supply Sargent LLC - All Rights Reserved </p>
                    </Grid>
                </Grid>
                {/* // <p style={{ textAlign: 'center', fontWeight: 900, fontSize: '18pt', marginTop: '1rem' }}>Connecting Agri needs</p> */}
            </div>
        </div>
    )
}

const mapStateToProps = ({ user }) => ({ user })

export default connect(mapStateToProps, null)(Home)
