import {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    const getUser = () => {
        axios.get('http://localhost:8000/loggedInUser')
        .then(res => {
            if (res.data === '') {
                console.log(loggedInUser);
                console.log("No user authenticated");
            }
            else    
            {
                //console.log(res.data);
                setLoggedInUser(res.data);
                console.log(loggedInUser);
            }
        });
    }

    const logOut = () => {
        axios.post('http://localhost:8000/logout', '')
        .then(res => {
            console.log(res);
        })

    }

    getUser();

    return (
        <nav className = "navbar">
            <a href = '/'><h3> Home </h3></a>
            <div className = "links">
                    {loggedInUser != '' && <a href = '/my-sets'> {loggedInUser}'s Sets </a>}  
                    {loggedInUser === '' && <a href = '/my-sets'> My Sets </a>}  
                    {loggedInUser != '' && <a href = '/create-new'> Create New </a>}  
                    {loggedInUser === '' && <a href = '/login'> Create New </a>}  
                    {loggedInUser === '' && <a href = '/login'> Log In/Register </a>}  
                    {loggedInUser != '' && <a href = '/' onClick={() => logOut()}> Log Out </a>}                                      
            </div>
        </nav>
    )
}

export default Navbar;