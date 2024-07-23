import {useState} from 'react'
import Validation from './LoginValidation'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate();

    const resetErrors = () => {
        setErrors(prev => ({...prev, username: '', password: ''}));
    }
    const handleInput = (event: { target: { name: any; value: any; }; }) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        resetErrors();
        console.log(errors);
        console.log(values);
        event.preventDefault();
        if (values.username === '')
            setErrors(prev => ({...prev, username: "Required"}));
        if (values.password === '')
            setErrors(prev => ({...prev, password: "Required"}));
        if (values.username != '' && values.password != '') {
            axios.post('http://localhost:8000/login', values)
            .then(res => {
                if (res.data === "DNE") 
                    setErrors(prev => ({...prev, password: "Invalid login"}));
                else {
                    console.log(res.data.result);
                    navigate('/my-sets');
                }
            })
            .catch(err => console.log(err));
        }
        else {
            console.log("query not run");
        }

    }

    return (
        <div> 
            <form action="" onSubmit={handleSubmit}>
                <h1> Log In: </h1>
                <label htmlFor="username"><strong> Username: </strong></label>
                <input type="text" name="username" placeholder="Enter username"
                onChange={handleInput}/> 
                <br />
                {errors.username && <span className='text-danger'> {errors.username} </span>} 
                <br /> <br />
                <label htmlFor="password"><strong> Password: </strong></label>
                <input type="password" name="password" placeholder="Enter password" 
                onChange={handleInput}/>  
                <br />
                {errors.password && <span className='text-danger'> {errors.password} </span>} 
                <br /> <br />
                <button className="loginButton" type="submit" name="login"> Log In </button>
            </form>
            <p> Don't have an account? </p>
            <a href = '/register'>
                <button className="loginButton" name = "registerInstead"> Register Instead </button>
            </a>
        </div>
    )
}

export default Login;