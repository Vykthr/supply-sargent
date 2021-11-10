import firebase from "./config";
import moment from 'moment'

export default {
    loginUser({email, password}) {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    getUserData(email) {
        return firebase.firestore().doc(`users/${email}`).get();
    },
    async registerUser({ email, password, confirmPassword, ...payload}){
        await firebase.auth().createUserWithEmailAndPassword(email, password).then(async (res) => {
            const date = Date.now();
            await firebase.firestore().doc(`users/${email}`).set({ ...payload, balance: 0, email, registered: date, followers: []  }).then(async () => {
                res.user.sendEmailVerification();
            })
        })
    },
    logoutUser() {
        return firebase.auth().signOut();
    },
    resetPassword(email) {
        return firebase.auth().sendPasswordResetEmail(email);
    },

    updateProfile(email, payload) {
        const lastUpdated = Date.now()
        return firebase.firestore().doc(`users/${email}`).update({ ...payload, lastUpdated })
    },
    async getActivePermits(email) {
        const today = Date.now()
        const res = await firebase.firestore().collection(`permits`).where('user', '==', email).where('expires', '>', today).get()
        return res.docs.map((doc) => doc.data());
    },
    async purchasePermit(payload) {
        const user = (await this.getUserData(payload.user)).data();
        if(user.balance > payload.price) {
            const newBalance = user.balance - payload.price
            this.updateProfile(payload.user, { balance: newBalance })
            const purchased = Date.now()
            const expires = Date.parse(moment(purchased).add(30, 'days').format('DD MMM YYYY'))
            return firebase.firestore().collection(`permits`).add({
                ...payload, expires, purchased
            })
        } else {
            throw new Error('Insufficient Balance, Kindly visit the nearest SS-Pay to purchase a card');
        }

    },

    async addProduct(payload) {
        const added = Date.now()
        return firebase.firestore().collection(`products`).add({
            ...payload, added
        })
    },

    async addMessage(payload) {
        const added = Date.now()
        return firebase.firestore().collection(`chats`).add({
            ...payload, added
        })
    },

    async newMessage({ id, ...payload }) {
        const lastUpdated = Date.now()
        return firebase.firestore().doc(`chats/${id}`).update({
            ...payload, lastUpdated
        })
    },
};
