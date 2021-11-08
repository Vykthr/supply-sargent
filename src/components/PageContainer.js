import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Logo from '../assets/images/whitelogo.png'
import World from '../assets/images/world.png'
import { Grid, LinearProgress } from '@material-ui/core'
import Loader from './Loader'

const PageContainer = ({ secondary = false, pageTitle, type = '', account, noBgPadding, transparentHeader, ...props }) => {
    return (
        <div className={ secondary ? "bg" : ""} style={{ display: 'flex', flexDirection: 'column' }}>
            <Header secondary={secondary} type={type} transparentHeader={transparentHeader || secondary} logo={props?.logo || ''}/>

            {
                // props.processing && <LinearProgress color="primary" />
                props.processing && <Loader />
            }
            {
                secondary ?
                <Grid container style={{ minHeight: '100%' }}>
                    <Grid item md={6} xs={12} className="world">
                        <img src={World} />
                        <img src={Logo} style={{ position: 'absolute', left: 30, bottom: 30, width: 150 }} />
                    </Grid>

                    <Grid item md={6} xs={12} container className='d-flex-column' style={{ padding: '2rem', justifyContent:'flex-start' }}>
                        <div className="wt-bg" style={{ padding: '2rem', textAlign: 'center' }}>
                            { pageTitle && <h1 style={{ textTransform: 'uppercase' }}>{pageTitle}</h1> }
                            {props.children}
                        </div>

                        <div className="footer">
                            <p>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</p>
                        </div>
                    </Grid>

                </Grid>
                :
                <>
                    {
                        props.pageTitle && <h1 className="pageTitle">{props.pageTitle}</h1>
                    }
                    <div className={!props?.noBg ? "bg" : "" } style={{ padding: !noBgPadding && '1rem 2rem', flex: 1 }}>
                        {props.children}
                    </div>
                </>
            }
            
            <Footer />
        </div>
    )
}

export default PageContainer
