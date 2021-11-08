import React, { useState, useEffect } from 'react'
import { Grid, Button, Avatar, Dialog, DialogContent, DialogActions, CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import generalApi from '../redux/api/general'
import { useHistory } from 'react-router-dom'

const NewsCard = ({ news, general, user, profile = false, refresh, editFeed }) => {
    const [ allUsers, setAllUsers ] = useState(general.users)
    const [ confirmDelete, setSetConfirmDelete ] = useState(false)
    const [ deleting, setDeleting ] = useState(false)
    const [ deletingError, setDeletingError ] = useState('')
    const history = useHistory()

    useEffect(() => {
        setAllUsers(general.users)
    }, [general])

    const deleteFeed = async () => {
        setDeletingError('')
        if(news.user === user.userData.email) {            
            try {
                setDeleting(true)
                await generalApi.deleteFeed(news.id);
                setSetConfirmDelete(false)
                refresh();
            }
            catch(err) {
                console.log(err)
                setDeletingError(err?.message || 'An error occurred')
            } finally {
                setDeleting(false)
            }
        } else {
            setDeletingError('You are not authorized to delete this feed')
        }
    }

    const edit = async () => {
        if(news.user === user.userData.email) {
            editFeed(news)
        } else {
            alert('You are not authorized to edit this feed')
        }
    }

    const openProfile = () => {
        history.push(`/profile/${news.user}`)
    }

    const chat = () => {
        if(Boolean(news.user !== user.userData.email)) {
            history.push(`/messages/${news.user}`)
        }
    }

    const getUserDetails = (email, property) => {
        const user = allUsers.find((usr) => usr.email === email)
        return Boolean(user) ? (property === 'name') ? user?.lastName + ' ' + user?.firstName : (property === 'followers') ? user?.followers?.length : user[property] : '';
    }

    return (
        <Grid xs={12} item container className="news-card">
            <Grid xs={12} item className="wt-bg">
                <Grid container alignItems="center" spacing={2}>
                    <Grid item >
                        <Avatar style={{ cursor: 'pointer' }} onClick={() => openProfile()} source={getUserDetails(news.user, 'image')} />
                    </Grid>
                    <Grid item xs={8} md={5} onClick={() => openProfile()} style={{ cursor: 'pointer' }}>
                        <p className="name">{getUserDetails(news.user, 'name')}</p>
                        <p className="email">{news.user}</p>
                    </Grid>
                    <Grid item container xs={12} md={6} className="actions" spacing={2}>
                        <Grid item xs={3}>
                            <p>{news?.likes?.length || 0}</p>
                            <Button color="primary" fullWidth variant="contained">Like</Button>
                        </Grid>
                        { 
                            profile ?
                            <>
                                <Grid item xs={3} >
                                    <Button onClick={() => edit()} style={{ marginTop: '1.5rem'}} color="primary" fullWidth variant="contained">Edit</Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button onClick={() => setSetConfirmDelete(true)} style={{ marginTop: '1.5rem', color: '#fff' }} color="secondary" fullWidth variant="contained">
                                        { deleting ? <CircularProgress size={15} color="inherit" /> : 'Delete'}
                                    </Button>
                                </Grid>
                            </>
                            :
                            <>
                                <Grid item xs={3}>
                                    <p>{getUserDetails(news.user, 'followers') || 0}</p>
                                    <Button color="primary" fullWidth variant="contained">Follow</Button>
                                </Grid>
                                <Grid item xs={3} onClick={() => chat()}>
                                    <Button color="secondary" style={{ marginTop: '1.5rem', color: '#fff' }} fullWidth variant="contained">Message</Button>
                                </Grid>
                            </>
                        }
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

            <Dialog open={confirmDelete}>
                <DialogContent>
                    <h3>Delete feed?</h3>
                    <p>Are you sure you want to delete this feed? </p>
                    { Boolean(deletingError) && <p className="error-text">{deletingError}</p> }
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{ color: '#fff', minWidth: '90px' }} onClick={() => deleteFeed()} color="secondary">
                        { deleting ? <CircularProgress size={15} color="inherit" /> : 'Delete'}
                    </Button>
                    <Button variant="contained" onClick={() => setSetConfirmDelete(false)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
            
        </Grid>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

export default connect(mapStateToProps, null)(NewsCard)
