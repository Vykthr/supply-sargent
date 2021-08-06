import { Grid, Button } from '@material-ui/core'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import Logo from '../assets/images/whitelogo.png'

const Home = () => {
    const history = useHistory()

    return (
        <div className="home">
            <Grid container className="overlay">
                <Grid item xs={12} md={6}>
                    <Link to="/">
                        <img src={Logo} className="home-logo" />
                    </Link>
                </Grid>
                <Grid item xs={12} md={6} >
                    <div className="card">
                        <h1 className="title">
                            Supply Sargent
                        </h1>
                        <p>Supply Sargent LLC is an e-commerce platform which facilities the connection between farmers, agri-businesses and their customers in a unique, easy to use marketplace</p>
                    
                        <Button variant="contained" color="primary" className="button" onClick={() => history.push('/news-feed')}>ENTER</Button>
                    </div>
                </Grid>

            </Grid>
        </div>
    )
}
export default Home
