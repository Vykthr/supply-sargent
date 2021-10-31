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
    },
    // async addPermits() {
    //     await firebase.firestore().doc('utilities/general').update({
    //         permits: [
    //             { id: 1, name: 'content creator', price: 1.99 },
    //             { id: 2, name: 'seedlings', price: 5.99 },
    //             { id: 3, name: 'professional', price: 9.99 },
    //             { id: 4, name: 'agro-shops', price: 12.99 },
    //             { d: 5, name: 'agro-business', price: 14.99 },
    //             { id: 6, name: 'farmer', price: 15.99 },
    //         ]
    //     })
    // }
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
        var feeds = [];
        await firebase.firestore().collection(`news-feeds`).orderBy("added").limit(per_page).get().then(async (res)=> {
            new Promise((resolve, reject) => {
            res.docs.forEach(async (doc, index, array) => {
                const data = doc.data()
                // newDoc['id'] = doc.id
                const user = await (await userApi.getUserData(data.user)).data()

                feeds.push({ ...data, name: user?.lastName + ' ' + user?.firstName, photoImage: user?.image || '', followers: user?.followers || [] })
                if (index === array.length -1) resolve();
            })
            });
        })
        return feeds
    },
    async getContentCreators(per_page = 100) {
        new Promise(async (resolve, reject) => {
            var results = [];
            return firebase.firestore().collection(`permits`).where('expires', '>', Date.now()).where('id', '==', 1).limit(per_page).get().then(async (res)=> {
                res.docs.forEach(async (doc, index, array) => {
                    const user = (await userApi.getUserData(doc.data().user)).data()
                    if(!results.find((res) => res.email = user.email))results.push(user)
                    if (index === array.length -1) resolve(results)
                })
            });
        })
    },
};

