import React, { useState } from 'react';
    import { auth } from './firebase';
    import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
    import 'bootstrap/dist/css/bootstrap.min.css';

    const Login = ({ onLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isCreatingAccount, setIsCreatingAccount] = useState(false);
      const [error, setError] = useState(null);

      const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
          if (isCreatingAccount) {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
          onLogin();
        } catch (error) {
          setError(error.message);
        }
      };

      const toggleCreateAccount = () => {
        setIsCreatingAccount(!isCreatingAccount);
      };

      return (
        <section className="h-100 gradient-form" style={{ backgroundColor: '#eee' }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-xl-10">
                <div className="card rounded-3 text-black">
                  <div className="row g-0">
                    <div className="col-lg-6">
                      <div className="card-body p-md-5 mx-md-4">

                        <div className="text-center">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                            style={{ width: '185px' }} alt="logo" />
                          <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                        </div>

                        <form onSubmit={handleSubmit}>
                          <p>{isCreatingAccount ? "Create your account" : "Please login to your account"}</p>

                          <div className="form-outline mb-4">
                            <input
                              type="email"
                              id="form2Example11"
                              className="form-control"
                              placeholder="Email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="form2Example22"
                              className="form-control"
															placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>

                          <div className="text-center pt-1 mb-5 pb-1">
                            <button
                              className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                              type="submit"
                            >
                              {isCreatingAccount ? "Create Account" : "Log in"}
                            </button>
                            <div style={{textAlign: 'center'}}>
                              <a className="text-muted" href="#!">forgot password ?</a>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-center pb-4">
                            <p className="mb-0 me-2">{isCreatingAccount ? "Already have an account?" : "Don't have an account?"}</p>
                            <button type="button" className="btn btn-outline-danger" onClick={toggleCreateAccount}>
                              {isCreatingAccount ? "Log In" : "Create new"}
                            </button>
                          </div>

                        </form>

                      </div>
                    </div>
                    <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                      <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                        <h4 className="mb-4">We are more than just a company</h4>
                        <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    export default Login;
