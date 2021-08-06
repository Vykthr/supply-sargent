import { Grid, ListItemText } from '@material-ui/core';
import React from 'react'

const Dashlet = ({ dashlet }) => {
    return (
        <Grid container item xs={12} md={3}>
            <div className="dashlet">
                {dashlet.icon}
                <ListItemText primary={dashlet.data} secondary={dashlet.label} />
            </div>
        </Grid>
    )
}

export default Dashlet
