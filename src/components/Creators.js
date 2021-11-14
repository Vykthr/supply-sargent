import { LinearProgress, List, ListItem } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import generalApi from '../redux/api/general';

const Creators = ({ general, user }) => {
    const [ creators, setCreators ] = useState([])
    const [ users, setUsers ] = useState(general?.users || [])
    const [ userData, setUserData ] = useState(user?.userData || {})
    const [ fetching, setFetching ] = useState(false)

    const getCreators = async () => {
        try{
            setFetching(true)
            const permits = await generalApi.getPermits()
            const permitUsers = permits.filter((permit) => permit?.user !== userData?.email ).map((permit) => permit.user);
            setCreators(permitUsers)
        } 
        catch(err) {
            console.log(err)
        }
        finally {
            setFetching(false)
        }
    }

    const init = async () => {
        await getCreators()
    }
    
    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user])

    useEffect(() => {
        setUsers(general?.users || []);
    }, [general?.users])

    useEffect(() => {
        init();
    }, [])

    return (
        <>
            <h4 className="sectionTitle">Content Creators</h4>
            {
                fetching ?
                <LinearProgress color="primary" style={{ margin: '.5rem 0' }} />
                :
                <List>
                    {
                        creators.map((creator, key) => {
                            const usr = users?.find(({ email }) => email === creator) || {}
                            return (
                                key < 6 && <ListItem key={key} className="no-margin no-padding">
                                    <Person style={{ marginRight: '.5rem' }} />
                                    <b className="no-margin">{usr?.lastName + ' ' + usr?.firstName || creator }</b>
                                </ListItem>
                            )
                        })
                    }
                </List>
            }   
        </>
    )
}
const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Creators)
