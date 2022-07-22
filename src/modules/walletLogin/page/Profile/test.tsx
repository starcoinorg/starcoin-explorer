import { initializeApp } from 'firebase/app';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const firebaseConfig = {
    apiKey: "AIzaSyAjMS_NWMCoY_YiXtKnOfrcqvkeL8yHdVU",
    authDomain: "starcoin.firebaseapp.com"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
function App() {
    const location = useLocation();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user, 'user')
        });
        getRedirectResult(auth)
            .then((result: any) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential!.accessToken;

                // The signed-in user info.
                const user = result.user;
                console.log(credential, token, user, 'getRedirectResult')
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log(errorCode, errorMessage, email, credential, 'getRedirectResult')
            });

    }, [])
    const signIn = () => {
        const email = "starcoin@gmail.com";
        const password = "westar0720";
        signInWithEmailAndPassword(auth, email, password).then((res) => {
            console.log(res)
        })
            .catch(() => {

            });
    }

    const google = () => {
        // signInWithRedirect(auth, provider);

        localStorage.setItem('redirect', location.pathname);
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential!.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(credential, token, user, 'success')
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential, 'error')
                // ...
            });
    }
    const googleRiredct = () => {
        signInWithRedirect(auth, provider);
    }
    return <>
        <div onClick={signIn} style={{
            color: '#fff'
        }}>signIn</div>
        <div style={{
            color: '#fff'
        }} onClick={google}>google</div>
        <div style={{
            color: '#fff'
        }} onClick={googleRiredct}>googleRiredct</div>
    </>
}
export default App;