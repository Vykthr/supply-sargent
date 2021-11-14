import { Grid, ListItem, Button, List } from '@material-ui/core'
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
import AddFeed from '../components/AddFeed'
import { useHistory } from 'react-router-dom'
import Creators from '../components/Creators';

const NewsFeed = ({ general, fetchNewsFeeds, fetchUsers, user }) => {
    const history = useHistory()
    const [ userData, setUserData ] = useState({})
    const [ fetching, setFetching ] = useState(false)
    const [ profile, setProfile ] = useState(false)
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ news, setNews ] = useState([])
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 1220px)' })
    const isTab = useMediaQuery({ query: '(max-width: 1000px)' })

    const updateAll = async () => {
        await init()
    }

    const init = async () => {
        try{
            setFetching(true)
            const docs = await fetchNewsFeeds(); 
            await fetchUsers();
            handleNews(docs)
        } 
        catch(err) {
            console.log(err)
        }
        finally {
            setFetching(false)
        }
    }



    const handleNews = (news = []) => {
        if(profile) {
            setNews(news.filter(({ user }) => user === userData.email))
        } else {
            setNews(news)
        }
    }

    useEffect(() => {
        handleNews(general.news)
    }, [general, profile, userData])

    useEffect(() => {
        if(!openDialog) updateAll()
    }, [openDialog])


    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user])

    useEffect(() => {
        setProfile(history?.location?.pathname?.includes('account/profile') || false);
    }, [history])

    const closeModal = () => {
        setOpenDialog(false)
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
                
                <Grid item xs={12} md={9} lg={8} container>
                    {
                        news.sort((a, b) => (a.added > b.added) ? -1 : 1).map((news, key) => (
                            <NewsCard key={key} news={news} />
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
                            <Creators />
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

            <AddFeed open={openDialog} closeModal={closeModal} user={userData?.email || null} freeTrial={userData?.freeTrial || null} />
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchNewsFeeds, fetchUsers, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
