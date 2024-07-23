import {useEffect, useState} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const ViewSet = () => {
    interface QuestionDetails {
        setID: number;
        qID: number;
        question: string;
        answer: string;
        reason: string;
    }
    const {setID} = useParams();
    const [questionDetails, setQuestionDetails] = useState<QuestionDetails[]>([]);
    const [setDetails, setSetDetails] = useState({
        setName: '',
        createdBy: '',
        createdDate: '',
        setID: 0
    });    
    const navigate = useNavigate();

    const getQuestionDetails = () => {
        axios.get(`http://localhost:8000/viewset/${setID}`)
        .then(res => {
            setQuestionDetails(res.data);
            console.log(res.data);
            console.log(questionDetails);
        }).catch(err => {
            console.log("Error fetching question details: " + Error);
        })
    }

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
    const deleteSet = () => {
        axios.post('http://localhost:8000/deleteSet', {setID})
        .then(res => navigate('/my-sets'))
        .catch(err => console.log(err));
    }
    const setInitialTextareaHeight = (content: string) => {
        const lineHeight = 20; // Adjust as needed based on font size and line height
        const lineCount = Math.floor(content.length / 40);
        if (lineCount * lineHeight <= 20)
            return '20px';
        if (lineCount > 5)
            return '100px';
        return `${lineHeight * lineCount}px`;
      };

    useEffect(() => getQuestionDetails, [setID]);
    useEffect(() => getSetDetails, [setID]);

    if (setDetails.setName === ''){
        return <div><h1>Set does not exist</h1></div>
    }

    return (
        <div>
            <span style={{ fontSize: '35px' }}><strong> {setDetails.setName} </strong></span>
            <br />
            <button className='loginButton' onClick={() => navigate(`/study/${setID}`)}> Study </button>
            <button className='loginButton' onClick={() => navigate(`/edit-set/${setID}`)}> Edit </button>
            <button className='deleteButton' onClick={deleteSet}> Delete </button>   
            <br />         
            <table className="createSetTable">
                <thead>
                <tr style={{ borderCollapse: 'collapse', borderBottom: '1px solid #e7e7e7'}}> 
                    <td><strong> # </strong></td>
                    <td><strong> Question </strong></td>
                    <td><strong> Answer </strong></td>
                    <td><strong> Reason you got it wrong </strong></td>   
                </tr>
                </thead>
            {questionDetails && questionDetails.sort((a, b) => a.qID - b.qID).map((question: {setID: number, qID: number, question: string, answer: string, reason: string}) => (
                <tbody style={{ borderCollapse: 'collapse', borderBottom: '1px solid #e7e7e7'}}>
                <tr> 
                    <td> {question.qID}</td>
                    <td className="scrollable-cell"><div className="scrollable-text">{question.question}</div></td> 
                    <td className="scrollable-cell"><div className="scrollable-text">{question.answer}</div></td> 
                    <td className="scrollable-cell"><div className="scrollable-text">{question.reason}</div></td> 
                </tr>
                </tbody>
            ))}
            </table>
        </div>
    )
}

export default ViewSet;