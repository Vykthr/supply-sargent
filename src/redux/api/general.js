import firebase from "./config";

export default {
    async fetchUtilities() {
      let utilities = [];
      await firebase.firestore().doc('utilities/general').get().then(async (doc)=> {
        utilities = doc.data()
      })
      return utilities;
    },
    async fetchProducts() {
      var products = [];
      await firebase.firestore().collection('products').get().then(async (res)=> {
        new Promise((resolve, reject) => {
          res.docs.forEach((doc, index, array) => {
            const newDoc = doc.data()
            newDoc['id'] = doc.id
            products.push(newDoc)
            if (index === array.length -1) resolve();
          })
        });
      })
      return products
    },
    async addProduct({ images, ...payload }) {
        var id = '';
        await new Promise(async (resolve, reject) => {
            const date = Date.now()
            var imgs = []
            await firebase.firestore().collection('products').add({ ...payload, active: true, created: date  }).then(async (res) => {
                id = res.id;
                var bar = new Promise((resolve, reject) => {
                    const newObj = images.filter((img) => typeof(img) != 'string' );
                    if(newObj.length == 0) {
                        resolve();
                    } else {
                        newObj.forEach(async (image, index, array) => {
                            const imageRef = firebase.storage().ref().child(`products/${res.id}/images${imgs.length + 1}`)
                            await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                                await imageRef.getDownloadURL().then(async (downloadURL) => {
                                    imgs.push({ label: `images${imgs.length + 1}`, file: downloadURL})
                                    if (index === array.length -1) resolve();
                                });
                            })
                        });
                    }
                });
                
                bar.then(async () => {
                    await firebase.firestore().doc(`products/${res.id}`).update({ images: imgs })
                    resolve()
                });
            })
        })
        return id;
    },
    async editProduct(productId, { images, ...payload }) {
        const updated = Date.now()
        var count = -1;
        var bar = new Promise((resolve, reject) => {
            images.forEach(async (image, index, array) => {
                if(typeof(image.file) === 'string') {
                    count += 1;
                } else {
                    const imageRef = firebase.storage().ref().child(`products/${productId}/${image.label}`)
                    await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                        await imageRef.getDownloadURL().then(async (downloadURL) => {
                            images[index] = { label: image.label, file: downloadURL };
                            count += 1;
                            if (count === array.length) resolve();
                        });
                    })
                }
            });
        });
        
        bar.then(async () => {
            return firebase.firestore().doc(`products/${productId}`).update({ ...payload, images, updated  });
        });
    }
};

