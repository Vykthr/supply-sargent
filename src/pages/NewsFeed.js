import { Grid, ListItem, Button, TextField, InputAdornment, IconButton, FormControl, FormControlLabel, Checkbox, FormGroup, List, Paper } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import PageContainer from '../components/PageContainer'
import NewsCard from '../components/NewsCard'
import { Search, Person } from '@material-ui/icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchNewsFeeds, fetchUsers } from '../redux/actions/general';
import { addToCart } from '../redux/actions/user';
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import generalApi from '../redux/api/general'
import AddFeed from '../components/AddFeed'

const NewsFeed = ({ general, fetchNewsFeeds, fetchUsers, user }) => {
    const [ creators, setCreators ] = useState([])
    const [ categories, setCategories ] = useState([])
    const [ userData, setUserData ] = useState({})
    const [ fetching, setFetching ] = useState(false)
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ categoriesHeight, setCategoriesHeight ] = useState('200px')
    const [ news, setNews ] = useState(general.news)
    const [ users, setUsers ] = useState(general.users)
    const isPhone = useMediaQuery({ query: '(max-width: 812px)' })
    const isTab = useMediaQuery({ query: '(max-width: 1200px)' })

    const updateAll = async () => {
        await init()
        await getCreators()

    }

    const init = async () => {
        try{
            setFetching(true)
            const docs = await fetchNewsFeeds(); 
            await fetchUsers();
            setNews(docs)
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

    useEffect(() => {
        setNews(general.news)
        setUsers(general.users)
    }, [general])

    useEffect(() => {
        if(!openDialog) updateAll()
    }, [openDialog])


    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user])
    
    
    return (
        <PageContainer processing={fetching} logo="dark">
            <Grid container>
                { !isPhone && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
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
                
                { isPhone && <Grid item xs={12} md={3} lg={2} className="news-feed-side-bar">
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

            <AddFeed open={openDialog} setOpenDialog={setOpenDialog} user={userData?.email || null} freeTrial={userData?.freeTrial || null} />
        </PageContainer>
    )
}

const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchNewsFeeds, fetchUsers, addToCart }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)
