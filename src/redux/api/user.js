import firebase from "./config";

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
            await firebase.firestore().doc(`users/${email}`).set({ ...payload, balance: 0, email, registered: date  }).then(async () => {
                res.user.sendEmailVerification();
            })
        })
    },
    logoutUser() {
        return firebase.auth().signOut();
    },
    resetPassword(payload) {
        return firebase.auth().sendPasswordResetEmail(payload.email);
    },

    updateProfile(email, payload) {
        const lastUpdated = Date.now()
        return firebase.firestore().doc(`users/${email}`).update({ ...payload, lastUpdated })
    },
};
