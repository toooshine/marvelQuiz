import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const ForgetPassword = props => {

    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        firebase.passwordReset(email)
            .then(() => {
                setError(null);
                setSuccess(`Consultez votre boîte mail ${email} pour changer le mot de passe`);
                setEmail('');

                setTimeout(() => {
                    props.history.push('/Login');
                }, 5000);
            })
            .catch(error => {
                setError(error);
                setEmail("");
        })
    };

    const disabled = email === '';

    return (
        <div className='signUpLoginBox'>
            <div className='slContainer'>
                <div className='formBoxLeftForget' />
                <div className='formBoxRight'>
                    <div className='formContent'>
                        {success && <span
                            style={{
                            border: 'green',
                            background: 'green',
                            color: '#ffffff'
                            }}
                        >{success}</span>}

                        {error && <span>{error.message}</span>}
                        <h2>Mots de passe oublié ?</h2>
                        <form onSubmit={handleSubmit}>

                            <div className='inputBox'>
                                <input onChange={e =>  setEmail(e.target.value)} value={email} type='email' required autoComplete='off' />
                                <label htmlFor="email">Email</label>
                            </div>

                            <button disabled={disabled}>Récuperer</button>
                            
                        </form>
                        <div className='linkContainer'>
                            <Link className='simpleLink' to='/Login'>Déjà inscrit ? Connectez-vous !</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;
