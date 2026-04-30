import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ showPasswordRequirements, setShowPasswordRequirements ] = useState(false)
    const [ error, setError ] = useState("")

    const {loading,handleRegister} = useAuth()

    // Password validation checks
    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password)
    }

    const isPasswordValid = Object.values(passwordRequirements).every(req => req === true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        
        if (!isPasswordValid) {
            setError('Please meet all password requirements')
            return
        }
        
        try {
            await handleRegister({username,email,password})
            navigate("/")
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Registration failed'
            setError(errorMsg)
        }
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { 
                                setUsername(e.target.value)
                                setError("")
                            }}
                            type="text" id="username" name='username' placeholder='Enter username' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { 
                                setEmail(e.target.value)
                                setError("")
                            }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { 
                                setPassword(e.target.value)
                                setError("")
                            }}
                            onFocus={() => setShowPasswordRequirements(true)}
                            onBlur={() => setShowPasswordRequirements(false)}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                        
                        {showPasswordRequirements && (
                            <div className="password-requirements">
                                <p className="requirements-title">Password must contain:</p>
                                <ul>
                                    <li className={passwordRequirements.minLength ? 'met' : 'unmet'}>
                                        <span>{passwordRequirements.minLength ? '✓' : '✗'}</span> At least 8 characters
                                    </li>
                                    <li className={passwordRequirements.hasUpperCase ? 'met' : 'unmet'}>
                                        <span>{passwordRequirements.hasUpperCase ? '✓' : '✗'}</span> One uppercase letter (A-Z)
                                    </li>
                                    <li className={passwordRequirements.hasLowerCase ? 'met' : 'unmet'}>
                                        <span>{passwordRequirements.hasLowerCase ? '✓' : '✗'}</span> One lowercase letter (a-z)
                                    </li>
                                    <li className={passwordRequirements.hasNumbers ? 'met' : 'unmet'}>
                                        <span>{passwordRequirements.hasNumbers ? '✓' : '✗'}</span> One number (0-9)
                                    </li>
                                    <li className={passwordRequirements.hasSpecialChar ? 'met' : 'unmet'}>
                                        <span>{passwordRequirements.hasSpecialChar ? '✓' : '✗'}</span> One special character (!@#$%^&*)
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button 
                        className='button primary-button' 
                        disabled={!username || !email || !isPasswordValid}
                        type="submit"
                    >
                        Register
                    </button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register