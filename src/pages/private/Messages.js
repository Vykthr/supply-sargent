import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import PageContainer from '../../components/PageContainer';
import ChatView from './ChatView';
import moment from 'moment'

const Messages = () => {
    const chats = [
        {
            messages: [
                {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
                {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
                {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
                {date: Date.now(), message: 'Let me check the inventory and get back to you', userId: '123321'},
                {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
                {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
                {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
                {date: Date.now(), message: 'Let me check the inventory and get back to you', userId: '123321'},
                {date: Date.now(), message: 'Hello, i need the product today', userId: '12'},
                {date: Date.now(), message: 'Sorry, this product is no longer available sir', userId: '123321'},
                {date: Date.now(), message: "Oh that's sad, what else can i get similar to it? ", userId: '12'},
                {date: Date.now(), message: 'Let me check the inventory and get back to you, Let me check the inventory and get back to you', userId: '123321'},
            ],
            user: { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    name: 'Jessica Baker', userId: '123321' 
                }
        },
        {
            messages: [{date: Date.now(), message: 'Hi, how much is it?', userI: '12'}],
            user: { image: 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                    name: 'Michael Butcher', userId: '123322' 
                }
        },
        {
            messages: [{date: Date.now() + 100000, message: "What's your final offer?", userI: '12'}],
            user: { image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
                    name: 'Steve Jones', userId: '123323' 
                }
        },
        {
            messages: [{date: Date.now(), message: 'Good morning', userI: '12'}],
            user: { image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=333&q=80',
                    name: 'Amanda Smith', userId: '123324' 
                }
        },
        {
            messages: [{date: Date.now(), message: 'Hello!', userI: '12'}],
            user: { image: 'https://images.unsplash.com/photo-1554384645-13eab165c24b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=375&q=80',
                    name: 'Esther Alex', userId: '123325' 
                }
        },
    ]
    const [activeChat, setActiveChat] = useState({})

    useEffect(() => {
        setActiveChat(chats[0])
    }, [])

    const truncate = (string) => {
        return (string.length > 35) ? `${string.substring(0, 35)}...` : string
    }

    return (
        <PageContainer pageTitle="Messages">
            <Grid container>
                <Grid item sm={12} md={4}>
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
                                            <ListItemText primary={moment(messages[messages.length - 1]?.date).startOf('day').fromNow()} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </>
                            ))
                        }
                    </List>
                </Grid>
                <Grid item sm={12} md={8}>
                    <ChatView chat={activeChat} />
                </Grid>
            </Grid>
            
        </PageContainer>
    )
}

export default Messages
