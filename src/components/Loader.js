import { LinearProgress } from '@material-ui/core';
import React from 'react'

const Loader = () => {
    return (
        <div className="loader">
            <img src="/logo.png" />
            {/* <h3>Easy Connect</h3> */}
            <LinearProgress color="primary" />
        </div>
    )
}

export default Loader