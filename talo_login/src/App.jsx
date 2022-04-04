import './App.css';
import { useState } from 'react';
import auth from './FirebaseApp';
import {
    signInWithPopup,
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
} from 'firebase/auth';

function App() {
    const [title, setTitle] = useState('TALO LOGIN');
    const [token, setToken] = useState('Token here...');
    const signInFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    FacebookAuthProvider.credentialFromResult(result);
                const user = result.user;
                setToken(credential.accessToken);
                setTitle(user.email);
                // Send Token Here
                console.log(token, user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential =
                    FacebookAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    const signInGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
                setToken(credential.accessToken);
                setTitle(user.email);
                // Send token here
                console.log(token, user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    // Signin Phone number
    const countryCode = '+84';
    const [phoneNumber, setPhoneNumber] = useState(countryCode);
    const changePhoneNumber = (e) => {
        setPhoneNumber(e.target.value);
        if (phoneNumber.length < 1) setPhoneNumber(countryCode);
    };
    const [otp, setOtp] = useState('');
    const changeOtp = (e) => {
        setOtp(e.target.value);
    };
    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'normal',
                callback: (response) => {
                    // console.log(response);
                },
            },
            auth,
        );
    };
    const signPhonenumber = (e) => {
        e.preventDefault();
        if (phoneNumber.length >= 12) {
            generateRecaptcha();
            let appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    setPhoneNumber(countryCode);
                    window.confirmationResult = confirmationResult;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const verifyOtp = (e) => {
        e.preventDefault();
        if (otp.length === 6) {
            window.confirmationResult
                .confirm(otp)
                .then((result) => {
                    setTitle(result.user.phoneNumber);
                    setToken(result.user.accessToken);
                })
                .catch((error) => {
                    alert(error.message);
                });
        }
    };
    const singOut = () => {
        signOut(auth)
            .then(() => {
                alert('Logout success');
                setToken('Token here...');
                setTitle('TALO LOGIN');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <nav className="nav justify-content-center bg-dark navbar-dark">
                            <a
                                id="header-talo"
                                className="nav-link disabled"
                                href="#"
                            >
                                {title}
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="card-columns">
                        <div className="card bg-primary">
                            <div className="card-body text-center">
                                <p className="card-text">Login facebook</p>
                                <button
                                    className="btn btn-light btn-lg"
                                    onClick={signInFacebook}
                                >
                                    LOGIN
                                </button>
                            </div>
                        </div>
                        <div className="card bg-danger">
                            <div className="card-body text-center">
                                <p className="card-text">Login google</p>
                                <button
                                    className="btn btn-light btn-lg"
                                    onClick={signInGoogle}
                                >
                                    LOGIN
                                </button>
                            </div>
                        </div>
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <p className="card-text">Copy Token Here</p>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    id="comment"
                                    value={token}
                                />
                                <button
                                    className="mt-3 btn btn-dark btn-lg"
                                    onClick={singOut}
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </div>
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <p className="card-text">Login phone</p>
                                <form onSubmit={signPhonenumber}>
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="Enter Phone"
                                            onChange={changePhoneNumber}
                                            value={phoneNumber}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="card bg-light">
                            <div className="card-body d-flex justify-content-center">
                                <div id="recaptcha-container"></div>
                            </div>
                        </div>
                        <div className="card bg-light">
                            <div className="card-body text-center">
                                <p className="card-text">OTP VERIFY</p>
                                <form onSubmit={verifyOtp}>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter OTP"
                                            onChange={changeOtp}
                                            value={otp}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
