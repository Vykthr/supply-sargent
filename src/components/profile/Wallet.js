import React from 'react'
import { Button, Dialog, Grid, DialogContent, TextField } from '@material-ui/core';


const Wallet = () => {
    return (
        <>
            <h1 className="pageTitle" style={{ marginBottom: 0 }}>Wallet</h1>

            <Grid>
                <Grid item xs={12} container style={{ margin: '20px 0' }}>
                    <Grid item xs={12} md={10} style={{ padding: '0 10px' }}>
                        <TextField 
                            variant="outlined" 
                            inputProps={{ style: { height: '30px', padding: '10px' } }} 
                            fullWidth placeholder="Enter Voucher" 
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>                
                        <Button fullWidth variant="contained" color="primary" className="button">
                            Process
                        </Button>
                    </Grid>
                </Grid>    
            </Grid>  


            
            <Dialog>
                <DialogContent>
                    <p>Kindly visit the nearest supermarket, mini mart or an partnering business to purchase vouchers</p>
                </DialogContent>
            </Dialog> 
        </>
    )
}

export default Wallet
