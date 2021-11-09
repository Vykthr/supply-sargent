import { Grid, ListItem, Button, List, Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import NewsCard from '../components/NewsCard'
import { Person } from '@material-ui/icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchNewsFeeds, fetchUsers } from '../redux/actions/general';
import { addToCart } from '../redux/actions/user';
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import generalApi from '../redux/api/general'
import userApi from '../redux/api/user'
import AddFeed from '../components/AddFeed'
import { useHistory } from 'react-router-dom'

import tick from '../assets/images/tick.svg'
import choice from '../assets/images/choice.svg'
import badge from '../assets/images/badge.svg'

const Profile = ({ general, fetchNewsFeeds, fetchUsers, user }) => {
    const history = useHistory()
    const [ creators, setCreators ] = useState([])
    const [ userData, setUserData ] = useState({})
    const [ customUser, setCustomUser ] = useState({})
    const [ fetching, setFetching ] = useState(false)
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ news, setNews ] = useState([])
    const [ feedToEdit, setFeedToEdit ] = useState(null)
    const [ users, setUsers ] = useState(general.users)
    const isDesktop = useMediaQuery({ query: '(min-width: 1220px)' })
    const isTab = useMediaQuery({ query: '(max-width: 1000px)' })

    const updateAll = async () => {
        await init(customUser.email)
        await getCreators()
    }

    const init = async (email = '') => {
        try{
            setFetching(true)
            const docs = await fetchNewsFeeds();
            if(email) {
                const res = await userApi.getUserData(email)
                setCustomUser(res.data());
                handleNews(docs, email)
            } else {
                setCustomUser(user.userData);
                handleNews(docs, user.userData.email)
            }

            // await fetchUsers();
        } 
        catch(err) {
            console.log(err)
        }
        finally {
            setFetching(false)
        }
    }

    const getCreators = async () => {
        try{
            setFetching(true)
            const permits = await generalApi.getPermits()
            setCreators(permits.map((permit) => users.find(usr => usr.email === permit.user)));
            // setCreators(docs)
        } 
        catch(err) {
            console.log(err)
        }
        finally {
            setFetching(false)
        }
    }

    const handleNews = (feed = [], email = '') => {
        setNews(feed.filter(({ user }) => user === email))
    }

    useEffect(() => {
        handleNews(general.news, customUser.email)
        setUsers(general.users)
    }, [general, user])

    useEffect(() => {
        setUserData(user.userData);
    }, [user])

    const editFeed = (feed) => {
        setFeedToEdit(feed)
    }

    const closeModal = () => {
        setOpenDialog(false)
        setFeedToEdit(null);
        updateAll();
    }

    useEffect(() => {
        if(Boolean(feedToEdit)) setOpenDialog(true);
    }, [editFeed])

    useEffect(() => {
        const email = history?.location?.pathname?.split('profile/')?.[1] || '';
        if(email) {
            init(email)
        } else init()
    }, [history])

    const chat = () => {
        if(Boolean(customUser.email !== user.userData.email)) {
            history.push(`/messages/${customUser.email}`)
        }
    }
    
    
    return (
        <PageContainer processing={fetching} logo="dark">
            <Grid container>
                { isDesktop && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ top: '120px' }}>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Become a Content Creator Today</h4>
                            <Link to="become-a-content-creator">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Request your prime orders</h4>
                            <Link to="/prime-orders">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Advertise Now!</h4>
                            <h6 className="sectionTitle">Increase Sales <br/> Increase Traffic</h6>
                            <Link to="advertise">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <small style={{ color: '#fff', display: 'block' }}>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</small>

                    </div>
                </Grid> }
                
                <Grid item xs={12} md={9} lg={8} container >
                    <div style={{ padding: isTab ? 0 : '1rem', width: '100%' }} className="news-card">
                        <Grid xs={12} item container alignItems="center"className="wt-bg">
                            <Grid item xs={2} md={1}> 
                                <Avatar src={customUser?.image} variant="rounded" />
                            </Grid>
                            <Grid item xs={10} md={5}> 
                                <p className="name">{customUser?.lastName + ' ' + customUser?.firstName}</p>
                                <p className="email">{customUser.email}</p>
                            </Grid>
                            <Grid item xs={12} md={3} container spacing={1} alignItems="center"> 
                                <Grid item xs={5}><img src={choice} /></Grid>
                                <Grid item xs={2}><img src={tick} /></Grid>
                                <Grid item xs={2}><img src={tick} /></Grid>
                                <Grid item xs={2}><img src={badge} /></Grid>
                            </Grid>
                            <Grid item xs={12} md={3} container spacing={2} className="actions">
                                <Grid item xs={6}>
                                    <p>{customUser?.followers?.length || 0}</p>
                                    <Button color="primary" fullWidth variant="contained">
                                        Follow
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button onClick={() => chat()} style={{ marginTop: '1.5rem', color: '#fff' }} color="secondary" fullWidth variant="contained">
                                        Message
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    {
                        news.sort((a, b) => (a.added > b.added) ? -1 : 1).map((news, key) => (
                            <NewsCard key={key} news={news} profile={Boolean(customUser.email === user.userData.email)} refresh={init} editFeed={editFeed} />
                        ))
                    }
                </Grid>
            
                <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar right">
                    <div className="MuiAppBar-positionSticky" style={{  top: '120px' }}>
                        <Button className="btn" color="primary" variant="contained" fullWidth onClick={() => setOpenDialog(true)}>
                            Upload Content
                        </Button>

                        <Button className="btn white" color="inherit" variant="contained" fullWidth>
                            Verify your account
                        </Button>

                        <div className="section wt-bg pl-1 pr-1">
                            <h4 className="sectionTitle">Content Creators</h4>
                            <List>
                                {
                                    creators.map((creator, key) => (
                                        <ListItem key={key} className="no-margin no-padding">
                                            <Person style={{ marginRight: '.5rem' }} />
                                            <b className="no-margin">{creator?.lastName} {creator?.firstName}</b>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle">Followed Profiles</h4>
                            <List>
                                {
                                    userData?.following?.map((creator, key) => (
                                        <ListItem key={key} className="no-margin no-padding">
                                            <Person style={{ marginRight: '.5rem' }} />
                                            <b className="no-margin">{creator?.lastName} {creator?.firstName}</b>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </div>


                    </div>
                </Grid>
                
                { isTab && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
                    <div className="MuiAppBar-positionSticky" style={{ top: '120px' }}>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Become a Content Creator Today</h4>
                            <Link to="become-a-content-creator">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Request your prime orders</h4>
                            <Link to="/prime-orders">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <div className="section wt-bg">
                            <h4 className="sectionTitle bigger">Advertise Now!</h4>
                            <h6 className="sectionTitle">Increase Sales <br/> Increase Traffic</h6>
                            <Link to="advertise">
                                <Button className="btn red" color="primary" variant="contained" fullWidth>
                                    Learn more
                                </Button>
                            </Link>
                        </div>

                        <small style={{ color: '#fff', display: 'block' }}>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</small>

                    </div>
                </Grid> }
            </Grid>

            <AddFeed edit={feedToEdit} open={openDialog} closeModal={closeModal} user={userData?.email || null} freeTrial={userData?.freeTrial || null} />
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchNewsFeeds, fetchUsers, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)

