import { FormControl, Grid, TextField, Select, InputLabel, Button, CircularProgress, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import { AddAPhoto, CameraAlt } from '@material-ui/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import generalApi from '../../redux/api/general'
import Alert from '../Alert';
import { useHistory } from 'react-router-dom';
import { fetchProducts } from '../../redux/actions/general';

const EditProduct = ({ product, user, general, fetchProducts }) => {
    const history = useHistory()
    const [userDetails, setUserDetails] = useState(user.userData)
    const [ categories, setCategories ] = useState([])
    const [ currentPermits, setCurrentPermits ] = useState([])  
    const [ prod, setProd ] = useState({})
    const [ isEdit, setIsEdit ] = useState(false)
    const [ processing, setProcessing ] = useState(false)
    const [ imageToUpload, setImageToUpload ] = useState(0)
    const [ error, setError ] = useState('')
    const imageUpload = useRef(null)
    const [ alertConfig, setAlertConfig ] = useState({
        success: true,
        header: 'Upload Successful', 
        message: `Your product has be ${isEdit ? 'updated' : 'added'} successfully`,
        btn1Text: 'Proceed',
        btn1Action: () => { history.push('/profile/products') }
    })   
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setUserDetails(user.userData)
        if(user.userData?.currentPermits) setCurrentPermits(user.userData.currentPermits) 
    }, [user])

    useEffect(() => {
        if(general.utilities.hasOwnProperty('categories')) setCategories(general.utilities.categories)
    }, [general])

    useEffect(() => {
        setProd(product)
        if(product.name) setIsEdit(true)
    }, [product])

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
        console.log(prod)
        setError('')
        const expires = categories?.find(({ id }) => id === prod.permitId)?.endDate || ''
        try {
            setProcessing(true)
            if (prod.name && prod.images.length > 0 && prod.condition && prod.availability && prod.categories.length > 0 && prod.location && prod.permitId && prod.price && prod.value ) {
                const payload = {
                    ...prod,
                    seller: userDetails.email,
                    expires
                }
                if(isEdit) {
                    await generalApi.editProduct(prod.id, payload);
                }
                else {
                    await generalApi.addProduct(payload);
                }                
                setOpenModal(true)
                await fetchProducts()
            } else {
                setError("All fields marked * are required")

            }
        } catch(err) {
            setError(err.message)
        }finally {
            setProcessing(false)
        }
    };

{/* 

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
        images: [],


*/}
    return (
        <div>
            <h2 className="pageTitle">{ isEdit ? 'Edit Product' : 'New Product' }</h2>
            <Grid container className="product-form">
                <Grid item xs={12} md={6}>
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
                    <FormControl className="form-control availability">
                        <TextField 
                            variant="outlined"
                            style={{ marginRight: 0 }}
                            value={prod.availability}
                            name="availability"
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
                    <FormControl className="form-control">
                        <TextField 
                            variant="outlined"
                            value={prod.price}
                            name="price"
                            onChange={(e) => handleFormChange(e.target) }
                            label="Product Price"
                            placeholder="Enter Product Price"
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
                                userDetails.hasOwnProperty('currentPermits') &&
                                userDetails.currentPermits.map((permit, key) => (
                                    <option key={key} value={permit.id}>{permit.name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl className="form-control">
                        <FormLabel component="legend">Product Categories</FormLabel>
                        <FormGroup>
                            <Grid container>
                                {
                                    prod.permitId &&
                                    categories.filter(({ permitId }) => (prod.permitId == permitId) )
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
                    <input hidden onChange={({target}) => handleUpload(target)} ref={imageUpload} type="file" accept="image/*" />

                    {
                        prod.hasOwnProperty('images') && prod.images.map((img, key) => (
                            <Grid item xs={12} md={4} key={key} onClick={() => { setImageToUpload(key); imageUpload.current.click()}}>
                                <div className="image-holder">
                                    { 
                                        !img ? 
                                        <a>
                                            <CameraAlt />
                                            <h4>Select Product Image</h4>
                                        </a>
                                        :
                                        <img src={img?.file ? img.file : typeof(img) === 'string' ? img : URL.createObjectURL(img)} />
                                    }
                                </div>
                            </Grid>
                        ))
                    }
                    
                </Grid>
                <Grid item xs={12}>
                    <Button startIcon={<AddAPhoto />} variant="outlined" color="primary" className="button" fullWidth onClick={() => handleUpload('')} >Add new product</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button disabled={processing} variant="contained" color="primary" className="button" fullWidth onClick={() => addProduct()} >
                        { 
                            processing ? <CircularProgress color="inherit" size={20} />
                            :
                            isEdit ? 'Update Product' : 'Upload new product '
                        }
                    </Button>
                </Grid>
            </Grid>
            <Alert open={openModal} config={alertConfig} setOpenModal={setOpenModal}/>

            {
                error && <p className="error-text">{error}</p>
            }
        </div>
    )
}

const mapStateToProps = ({ user, general }) => ({ user, general })

const mapDispatchToProps = ( dispatch ) => {
    return bindActionCreators({ fetchProducts }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct)
