import axios from 'axios'
import {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'


const MySets = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userSets, setUserSets] = useState([]);
    const navigate = useNavigate();

    const getUser = () => {
        axios.get('http://localhost:8000/loggedInUser')
        .then(res => {
            if (res.data === '') {
                console.log("No user authenticated");
                navigate('/login');
            }
            else    
            {
                console.log(res.data);
                setLoggedInUser(res.data);
            }
        });
    }
    const getSets = () => {
        console.log("getting sets");
        if (loggedInUser != ''){
            axios.get('http://localhost:8000/mysets')
            .then(res => {
                console.log(res.data.length + res.data);
                setUserSets(res.data);
            });           
        }
    }

    useEffect(() => getUser(), []);
    useEffect(() => getSets(), [loggedInUser]);

    return(
        <div>
            {loggedInUser && <h1> {loggedInUser}'s Sets </h1>}
            {userSets && userSets.map((set: {setID: number, setName: string, createdBy: string, createdDate: string}) => (
                <Link to={`/view-set/${set.setID}`}><button className='setButton' key={set.setID}> <h2> {set.setName} </h2> </button></Link>
            ))}
        </div>
    )
}

export default MySets;