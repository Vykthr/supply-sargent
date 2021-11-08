import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import PageContainer from '../../components/PageContainer';
import ChatView from './ChatView';
import moment from 'moment'
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchChats } from '../../redux/actions/user';
import { bindActionCreators } from 'redux';

const Messages = ({ general, user, fetchChats }) => {
    const history = useHistory()
    // const chats = [
    //     {
    //         messages: [
    //             {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
    //             {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
    //             {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
    //             {date: Date.now(), message: 'Let me check the inventory and get back to you', userId: '123321'},
    //             {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
    //             {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
    //             {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
    //             {date: Date.now(), message: 'Let me check the inventory and get back to you', userId: '123321'},
    //             {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
    //             {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
    //             {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
    //             {date: Date.now(), message: 'Let me check the inventory and get back to you, Let me check the inventory and get back to you', userId: '123321'},
    //         ],
    //         user: { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    //                 name: 'Jessica Baker', userId: '123321' 
    //             }
    //     },
    // ]
    const [ activeChat, setActiveChat] = useState({})
    const [ chats, setChats] = useState([])
    const [ processing, setProcessing ] = useState(false)
    const isTab = useMediaQuery({ query: '(max-width: 990px)' })

    useEffect(() => {
        const email = history?.location?.pathname?.split('messages/')?.[1] || ''
        if(email) {
            setActiveChat(chats[0])
        }
    }, [history])

    const truncate = (string) => {
        return (string.length > 35) ? `${string.substring(0, 35)}...` : string
    }

    return (
        <PageContainer logo="dark" processing={processing}>
            <Grid container>
                <Grid item xs={isTab ? 12 : 4}>
                    <List className="chats">
                        {
                            chats.map(({ user, messages }, key) => (
                                <>
                                    <ListItem key={key} button onClick={() => setActiveChat({user, messages})}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <img src={user.image} alt="usr"/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} secondary={truncate(messages[messages.length - 1]?.message)} />

                                        <ListItemSecondaryAction>
                                            <ListItemText className="chat-time" primary={moment(messages[messages.length - 1]?.date).startOf('day').fromNow()} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </>
                            ))
                        }
                    </List>
                </Grid>
                { !isTab && <Grid item sm={12} md={8}>
                    <ChatView chat={activeChat} />
                </Grid> }
            </Grid>
            
        </PageContainer>
    )
}
const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchChats }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Messages)
