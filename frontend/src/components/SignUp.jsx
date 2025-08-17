import React from 'react';
import { authStyles as Styles } from '../assets/dummystyle';

const SignUp = () =>{
    return (
        <div className = { Styles.signupContainer}>
            <div className = {Styles.headerWrapper}>
                <h3 className = {Styles.signupTitle}> Create Account</h3>
                <p className = {Styles.signupSubtitle}>Join thousands of professionals today </p>
            </div>

            {/*Form */}
            <form onSubmit={handleSignUp} className = {Styles.signupForm}></form>


        </div>
    
    )

}

export default SignUp;