import firebase from "./config";
import userApi from "./user";

export default {
    async fetchUtilities() {
        let utilities = [];
        await firebase.firestore().doc('utilities/general').get().then(async (doc)=> {
            utilities = doc.data()
        })
        return utilities;
    },
    async fetchUsers() {
        const res = await firebase.firestore().collection('users').get()
        return res.docs.map((doc) => doc.data())
    },
    async fetchProducts() {
        const res = await firebase.firestore().collection('products').get();
        return res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async addProduct({ images, ...payload }) {
        var id = '';
        await new Promise(async (resolve, reject) => {
            const created = Date.now()
            var imgs = []
            await firebase.firestore().collection('products').add({ ...payload, active: true, created  }).then(async (res) => {
                id = res.id;
                const newObj = images.filter((img) => typeof(img) != 'string' );
                if(newObj.length == 0) {
                    resolve();
                } else {
                    newObj.forEach(async (image, index, array) => {
                        const imageRef = firebase.storage().ref().child(`products/${res.id}/image${imgs.length + 1}`)
                        await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                            await imageRef.getDownloadURL().then(async (downloadURL) => {
                                await firebase.firestore().doc(`products/${res.id}`).update({ images: firebase.firestore.FieldValue.arrayUnion({ label: `image${imgs.length + 1}`, file: downloadURL}) })
                                if (index === array.length -1) resolve();
                            });
                        })
                    });
                }

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
    },
    async addFeed({ image, ...payload }) {
        const added = Date.now()
        await new Promise(async (resolve, reject) => {
            await firebase.firestore().collection('news-feeds').add({ ...payload, added, views: [], likes: []  }).then(async (res) => {
                const imageRef = firebase.storage().ref().child(`news-feeds/${res.id}/image`)
                await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                    await imageRef.getDownloadURL().then(async (downloadURL) => {
                        await firebase.firestore().doc(`news-feeds/${res.id}`).update({ image: downloadURL })
                        resolve()
                    });
                })
            })
        })
    },
    async getNewsFeeds(per_page = 100) {
        const res = await firebase.firestore().collection(`news-feeds`).orderBy("added").get()
        return res.docs.map((doc) => doc.data())
    },
    async getPermits() {
        const res = await firebase.firestore().collection(`permits`).where('expires', '>', Date.now()).where('id', '==', 1).get();
        return res.docs.map((doc) => doc.data())
    },
};

