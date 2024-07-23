import {useState} from 'react'
import axios from 'axios'
import Validation from './RegistrationValidation'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    })
    const navigate = useNavigate();

    const resetErrors = () => {
        setErrors(prev => ({...prev, username: '', password: ''}));
    }
    const handleInput = (event: { target: { name: any; value: any; }; }) => {
        setValues(prev => ({
            ...prev, 
            [event.target.name]: [event.target.value]}));
    }
    const handleSubmit = (event: { preventDefault: () => void }) => {
        resetErrors();
        event.preventDefault(); 
        const validated = Validation(values);
        setErrors(validated);
        console.log('a ' + values.firstName + " " + values.lastName + " " + values.username + " " + values.password);
        //console.log('b ' + errors.firstName + " " + errors.lastName + " " + errors.username + " " + errors.password);
        //console.log('c ' + validated.firstName + " " + validated.lastName + " " + validated.username + " " + validated.password);
        if(values.username != '' && values.password != '' && errors.firstName === '' && errors.lastName === '' && errors.username === '' && errors.password === ''){
            console.log("here1");
            axios.post('http://localhost:8000/register', values)
            .then(res => {
                if (res.data === "Duplicate key error"){
                    console.log("duplicate key");
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        username: "Username already taken"
                    }));
                }
                else if (res.data == "Too long error") {
                    console.log("too long");
                }  
                else if (res.data === "Error"){
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        username: "Error, please try again"
                    }));}
                else
                    navigate('/login');
            })
            .catch(err => console.log(err));
        }
        else
            console.log("query not run");
        /*console.log(values);
        axios.put('http://localhost:8000/api/users/registration', null, {params:{
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            password: values.password}})
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log("Error: ", error);
        });*/
    };

    return (
        <div>
            <form>
                <h1> Register: </h1>
                <label htmlFor="firstName"><strong> First Name: </strong></label>
                <input type="text" name="firstName" placeholder="Enter first name"
                onChange={handleInput}/>  
                <br />
                {errors.firstName && <span className='text-danger'> {errors.firstName} </span>} 
                <br /> <br />     
                <label htmlFor="lastName"><strong> Last Name: </strong></label>
                <input type="text" name="lastName" placeholder="Enter last name"
                onChange={handleInput}/> 
                <br />
                {errors.lastName && <span className='text-danger'> {errors.lastName} </span>} 
                <br /> <br />      
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
                <button className="loginButton" onClick={handleSubmit} name = "register"> Register </button>
            </form>
            <p> Already have an account? </p>
            <a href = '/login'>
                <button className="loginButton" name = "loginInstead"> Log In Instead </button>
            </a>
        </div>
    )
}

export default Register;