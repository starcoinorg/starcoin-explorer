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
    apiKey: "AIzaSyDwHyD8mDE6EeyWAjRtg078snMdagdoJ4o",
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

    const oauthSignIn = () => {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params: any = {
            'client_id': '800652009519-dgcmhc64lmn188b3mfpli60dd7roifcn.apps.googleusercontent.com',
            'redirect_uri': 'https://test.stcscan.io/user/test',
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
            'include_granted_scopes': 'true',
            'state': 'pass-through value'
        };

        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
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
        <div style={{
            color: '#fff'
        }} onClick={oauthSignIn}>oauthSignIn</div>
    </>
}
export default App;