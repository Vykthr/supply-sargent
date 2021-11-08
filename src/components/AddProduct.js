import { Dialog, DialogActions, DialogContent, FormControl, Grid, TextField, Select, InputLabel, Button, CircularProgress, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import generalApi from '../redux/api/general';
import userApi from '../redux/api/user';
import { AddAPhoto, CameraAlt, DeleteForever } from '@material-ui/icons';
import LocationPicker from 'react-location-picker';

const AddProduct = ({ open = false, user = null, freeTrial = false, setOpenDialog, categories = [], product = {} }) => {
    const [ activePermits, setActivePermits] = useState([])
    const [ uploading, setUploading ] = useState(false)
    const [ currentPermits, setCurrentPermits ] = useState([])  
    const [ prod, setProd ] = useState({})
    const [ location, setLocation ] = useState( {
        address: "",
        position: {
            lat: 0,
            lng: 0
        }
    })
    const [ isEdit, setIsEdit ] = useState(false)
    const [ processing, setProcessing ] = useState(false)
    const [ imageToUpload, setImageToUpload ] = useState(0)
    const imageUpload = useRef(null)
    const [ error, setError ] = useState('')

    const init = async () => {
        setError('')
        if(Boolean(product?.name)) {
            setProd(product);
            setIsEdit(true)
        } else {
            setProd({
                name: '',
                value: '',
                seller: '',
                location: '',
                condition: '',
                availability: '',
                categories: [],
                distance: '',
                likes: 0,
                rating: 0,
                price: 0,
                images: [''],
            })
            setIsEdit(false)
        }
        try {
            setProcessing(true)
            const res = await userApi.getActivePermits(user)
            setActivePermits(res)
        }
        catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }

    const handleUpload = (file) => {
        if(typeof(file) === 'string') {
            var newImages = [ ...prod.images ]
            newImages.push('')
            handleFormChange({ name: 'images', value: newImages })
        }
        else if (file.files.length > 0) {
            var newImages = [ ...prod.images ]
            newImages[imageToUpload] = file.files[0]
            handleFormChange({ name: 'images', value: newImages})
        }
    }

    const handleFormChange = ({name, value}) => {
        setProd({ ...prod, [name]: value  })
    }

    const handleChange = (cat) => {
        if(prod.categories.indexOf(cat.id) > -1 ){
            const newCats = prod.categories.filter((id) => id !== cat.id )
            handleFormChange({ name: 'categories', value: newCats})
        } else {
            const newCats = [ ...prod.categories ]
            newCats.push(cat.id)
            handleFormChange({ name: 'categories', value: newCats})
        }
    };

    const addProduct = async () => {
        setError('')
        const expires = categories?.find(({ id }) => id === prod.permitId)?.expires || ''
        try {
            setUploading(true)
            if (prod.name && prod.images.length > 0 && prod.condition && prod.availability && prod.categories.length > 0 && prod.location && prod.permitId && prod.price && prod.value ) {
                const payload = {
                    ...prod,
                    seller: user,
                    expires
                }
                if(isEdit) {
                    await generalApi.editProduct(prod.id, payload);
                }
                else {
                    console.log('new')
                    await generalApi.addProduct(payload);

                }                
                setOpenDialog(false)
            } else {
                alert("All fields marked * are required")
            }
        } catch(err) {
            alert(err.message || 'An error occurred. Kindly try again')
        }finally {
            setUploading(false)
        }
    };

    const handleLocationChange = ({ position, address = '', places }) => {
        setLocation({ position, address });
    }

    useEffect(() => {
        if(open === true) init()
    }, [open])

    const removeImage = (key) => {
        var newImages = [ ...prod.images ]
        newImages = newImages.filter((img, ky) => ky !==key );
        handleFormChange({ name: 'images', value: newImages})
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }
                handleLocationChange(location);
            });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        getLocation()
    }, [])


    return (
        <Dialog open={open}>
            <DialogContent style={{ minWidth: '50%' }}>
                {
                    processing ?
                    <div className="d-flex justify-center">
                        <CircularProgress size={30} /> 
                    </div>
                    :
                    !Boolean(user) ?
                    <>
                        <h3>Kindly Login to continue</h3>
                        <p>Click <Link className="text-primary" to="/login">here</Link> to login or <Link className="text-primary" to="/sign-up">create an account</Link></p>
                    </>
                    :
                    (freeTrial || Boolean(activePermits.find((active) => active?.id !== 1))) ?
                    <div>
                        <h2 className="pageTitle">{ isEdit ? 'Edit Product' : 'New Product' }</h2>
                        <Grid container className="product-form">
                            <Grid item xs={12}>
                                <FormControl className="form-control">
                                    <TextField
                                        variant="outlined"
                                        value={prod.name}
                                        name="name"
                                        onChange={(e) => handleFormChange(e.target) }
                                        label="Product Name"
                                        placeholder="Enter Product Name"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl className="form-control" variant="outlined">
                                    <InputLabel>Product Value</InputLabel>
                                    <Select 
                                        variant="outlined"
                                        value={prod.value}
                                        name="value"
                                        onChange={(e) => handleFormChange(e.target) }
                                        label="Product Value"
                                        native
                                    >
                                        <option>Select Value</option>
                                        <option value="pounds">Pounds</option>
                                        <option value="dozens">Dozens</option>

                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl className="form-control">
                                    <TextField 
                                        variant="outlined"
                                        value={prod.price} type="number"
                                        name="price"
                                        onChange={(e) => handleFormChange(e.target) }
                                        label="Product Price"
                                        placeholder="Enter Product Price"
                                    />
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl className="form-control availability">
                                    <TextField 
                                        variant="outlined"
                                        style={{ marginRight: 0 }}
                                        value={prod.availability}
                                        name="availability" type="number"
                                        onChange={(e) => handleFormChange(e.target) }
                                        label="Product Availability"
                                        placeholder="Enter Product Availability"
                                        InputProps={{
                                            endAdornment: (
                                                <p>
                                                    {prod.value}
                                                </p>
                                            )
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            
                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" className="form-control">
                                    <InputLabel>Product Location</InputLabel>
                                    <Select
                                        value={prod.location}
                                        name="location"
                                        onChange={(e) => handleFormChange(e.target) }
                                        native
                                        label="Product Location"
                                    >
                                        <option value={null}>Select Location</option>
                                        <option value="tridad">Tridad</option>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <LocationPicker
                                    containerElement={ <div style={ {height: '100%'} } /> }
                                    mapElement={ <div style={ {height: '400px'} } /> }
                                    defaultPosition={location.position}
                                    onChange={handleLocationChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" className="form-control">
                                    <InputLabel>Product Condition</InputLabel>
                                    <Select
                                        value={prod.condition}
                                        name="condition"
                                        onChange={(e) => handleFormChange(e.target) }
                                        native
                                        label="Product Condition"
                                    >
                                        <option value={null}>Select Condition</option>
                                        <option value="ripe">Ripe</option>
                                        <option value="good">Good</option>
                                        <option value="unripe">Unripe</option>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl variant="outlined" className="form-control">
                                    <InputLabel>Permit Category</InputLabel>
                                    <Select
                                        value={prod.permitId}
                                        name="permitId"
                                        onChange={(e) => handleFormChange(e.target) }
                                        native
                                        label="Permit Category"
                                    >
                                        <option value={null}>Select permit category</option>
                                        {
                                            activePermits.map((permit, key) => (
                                                permit.id !== 1 && <option key={key} value={permit.id}>{permit.name}</option>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl className="form-control">
                                    <FormLabel component="legend">Product Categories <small>(select a permit category first)</small></FormLabel>
                                    <FormGroup>
                                        <Grid container>
                                            {
                                                prod?.permitId &&
                                                categories.filter(({ permitId }) => (prod?.permitId == permitId) )
                                                .sort((a, b) => (a.name > b.name) ? 1 : -1)
                                                .map((cat, key) => (
                                                    <Grid item xs={12} md={4}>
                                                        <FormControlLabel
                                                            key={key}
                                                            color="primary"
                                                            checked={prod?.categories?.indexOf(cat.id) > -1}
                                                            control={<Checkbox  onChange={() => handleChange(cat)} name={cat.name} />}
                                                            label={cat.name}
                                                            style={{ textTransform: 'capitalize' }}
                                                        />

                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            <Grid container item xs={12} className="form-control images">
                                <Grid item xs={12}>
                                    <FormLabel component="legend">Product Images</FormLabel>
                                </Grid>
                                <input hidden onChange={({target}) => handleUpload(target)} ref={imageUpload} type="file" accept="image/*" />

                                {
                                    prod.hasOwnProperty('images') && prod.images.map((img, key) => (
                                        <Grid item xs={12} md={6} key={key}>
                                            <div className="image-holder">
                                                { 
                                                    !img ? 
                                                    <div onClick={() => { setImageToUpload(key); imageUpload.current.click()}}>
                                                        <a >
                                                            <CameraAlt />
                                                            <h5 className="mt-0">Select Product Image</h5>
                                                        </a>
                                                    </div>
                                                    :
                                                    <img onClick={() => { setImageToUpload(key); imageUpload.current.click()}} src={img?.file ? img.file : typeof(img) === 'string' ? img : URL.createObjectURL(img)} />
                                                }
                                                {
                                                    (key > 0) &&
                                                    <div onClick={() => removeImage(key)} className="del-image"><DeleteForever /></div>
                                                }
                                            </div>

                                        </Grid>
                                    ))
                                }
                                
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button startIcon={<AddAPhoto />} variant="outlined" color="primary" className="button" fullWidth onClick={() => handleUpload('')} >Add new image</Button>
                            </Grid>


                        </Grid>
                    </div>
                    :
                    <>
                        <p>You don't have any active Permits</p>
                        <p>Click <Link className="text-primary" to="/account/permits">here</Link> to purchase one</p>
                    </>
                }
            </DialogContent>
            <DialogActions style={{ margin: '0 1rem 1rem 0' }}>
                <Button onClick={() => setOpenDialog(false)} className="btn red" variant="contained" color="primary">Close</Button>
                { (!processing && (freeTrial || Boolean(activePermits.find((active) => active?.id !== 1)))) && 
                    <Button disabled={uploading} variant="contained" color="primary" className="btn" onClick={() => addProduct()} >
                        { 
                            uploading ? <CircularProgress color="inherit" size={15} />
                            :
                            isEdit ? 'Update Product' : 'Upload new product '
                        }
                    </Button>
                }
            </DialogActions>
        </Dialog>
    )
}

export default AddProduct
