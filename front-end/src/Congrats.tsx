import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import congratulations from '../../front-end/src/assets/Untitled18_20240722213507.png'

const Congrats = () => {
    const {setID} = useParams();  
    const [setDetails, setSetDetails] = useState({
        setName: '',
        createdBy: '',
        createdDate: '',
        setID: 0
    });  
    const getSetDetails = () => {
        axios.get(`http://localhost:8000/getname/${setID}`)
        .then(res => {
            setSetDetails(res.data[0]);
            console.log(setDetails);
            console.log(res.data[0]);
        }).catch(err => {
            console.log("Error fetching set details: " + Error);
        })
    }
    const navigate = useNavigate();

    useEffect(() => getSetDetails, [setID]);

    return (
        <div>
            <h1> Congrats you finished studying</h1>
            <span style={{ fontSize: '32px' }}><strong> {setDetails.setName} </strong></span> <br /> 
            <img src={congratulations} height = "400" width = "400"/>
            <br />
            <button className="loginButton" onClick={() => navigate(`/study/${setID}`)}> Study Again </button>
            <button className="loginButton" onClick={() => navigate('/my-sets')}> Return to All Sets </button>
        </div>
    )
}

export default Congrats;