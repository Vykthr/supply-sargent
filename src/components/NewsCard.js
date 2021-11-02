import React, { useState, useEffect } from 'react'
import { Grid, Button, Avatar } from '@material-ui/core'
import { useMediaQuery } from 'react-responsive'
import { connect } from 'react-redux'

const NewsCard = ({ news, general, user }) => {
    const [ allUsers, setAllUsers ] = useState(general.users)

    useEffect(() => {
        setAllUsers(general.users)
    }, [general])

    const getUserDetails = (email, property) => {
        const user = allUsers.find((usr) => usr.email === email)
        return Boolean(user) ? (property === 'name') ? user?.lastName + ' ' + user?.firstName : (property === 'followers') ? user?.followers?.length : user[property] : '';
    }

    return (
        <Grid xs={12} item container className="news-card">
            <Grid xs={12} item className="wt-bg">
                <Grid  container alignItems="center" spacing={2}>
                    <Grid item>
                        <Avatar source={getUserDetails(news.user, 'image')} />
                    </Grid>
                    <Grid item xs={8} md={5}>
                        <p className="name">{getUserDetails(news.user, 'name')}</p>
                        <p className="email">{news.user}</p>
                    </Grid>
                    <Grid item container xs={12} md={6} className="actions" spacing={2}>
                        <Grid item xs={3}>
                            <p>{news?.likes?.length || 0}</p>
                            <Button color="primary" fullWidth variant="contained">Like</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <p>{getUserDetails(news.user, 'followers') || 0}</p>
                            <Button color="primary" fullWidth variant="contained">Follow</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button color="secondary" style={{ marginTop: '1.5rem', color: '#fff' }} fullWidth variant="contained">Message</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <p className="views">{news?.views?.length || 0}<span> views</span></p>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <p>{news.caption}</p>
                    <img className="img" src={news.image} />
                </Grid>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(NewsCard)
