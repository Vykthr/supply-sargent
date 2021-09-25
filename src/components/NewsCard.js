import React, { useState, useEffect } from 'react'
import { Grid, Button, IconButton, Avatar } from '@material-ui/core'
import { useMediaQuery } from 'react-responsive'
import { ThumbUpAlt, Grade, PersonAdd, Remove, Add } from '@material-ui/icons'
import { connect } from 'react-redux'

const NewsCard = ({ news, general, user }) => {
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const isTab = useMediaQuery({ query: '(max-width: 1200px)' })

    return (
        <Grid xs={12} container className="news-card">
            <Grid xs={12} item className="wt-bg">
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Avatar source={news.user?.image} />
                    </Grid>
                    <Grid item xs={4} md={5}>
                        <p className="name">{news.user?.name}</p>
                        <p className="email">{news.user?.email}</p>
                    </Grid>
                    <Grid item container xs={12} md={6} className="actions" spacing={2}>
                        <Grid item xs={3}>
                            <p>{news.likes}</p>
                            <Button color="primary" fullWidth variant="contained">Like</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <p>{news.user?.followers}</p>
                            <Button color="primary" fullWidth variant="contained">Follow</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button color="secondary" style={{ marginTop: '1.5rem', color: '#fff' }} fullWidth variant="contained">Message</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <p className="views">{news.views}<span>views</span></p>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <p>{news.caption}</p>
                    <img className="img" src={news.postImage} />
                </Grid>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(NewsCard)