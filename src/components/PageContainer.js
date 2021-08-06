import React from 'react'
import Header from './Header'
import Footer from './Footer'

const PageContainer = (props) => {
    return (
        <div>
            <Header />
            
            {
                props.pageTitle && <h1 className="pageTitle">{props.pageTitle}</h1>
            }
            <div style={{ padding: '1rem 2rem' }}>
                {props.children}
            </div>
            
            <Footer />
        </div>
    )
}

export default PageContainer
