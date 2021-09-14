import React from 'react'
import Header from './Header'
import Footer from './Footer'

const PageContainer = (props) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            {
                props.pageTitle && <h1 className="pageTitle">{props.pageTitle}</h1>
            }
            <div style={{ padding: '1rem 2rem', flex: 1 }}>
                {props.children}
            </div>
            
            <Footer />
        </div>
    )
}

export default PageContainer
