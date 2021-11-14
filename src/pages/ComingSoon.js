import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

const ComingSoon = () => {
    const eventTime = 1638140400000; // Timestamp - 29 Nov 2021 00:00:00 GMT
    const [ timer, setTimer ] = useState()

    const startTimer = () => {
        var currentTime = Date.now(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime * 1000, 'milliseconds');
        var interval = 1000;

        setInterval(() => {
            duration = moment.duration(duration - interval, 'milliseconds');
            setTimer(duration.hours() + " Hours: " + duration.minutes() + " Mins: " + duration.seconds() + ' Secs')
        }, interval);
    };

    useEffect(() => {
        // startTimer();
    }, [])

    return (
        <div className="home">
            <div className="overlay"></div>
            <Grid container className="home-content" justifyContent="center" alignItems="center" style={{ textAlign: 'center', width: '100%', height: '100%' }}>
                <Grid item xs={12}>
                    <h3>Coming Soon</h3>
                    <h3></h3>
                    <h3>Launch Date: {moment(eventTime).format('DD[TH] MMMM, YYYY')}</h3>
                </Grid>
            </Grid>
        </div>
    )
}

export default ComingSoon
