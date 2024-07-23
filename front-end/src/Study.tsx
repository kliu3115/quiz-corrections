import {useEffect, useState} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Study = () => {
    type Card = {question: string, answer: string, reason: string}
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
    const [cards, setCards] = useState<Card[]>([{question: '', answer: '', reason: ''}]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showReason, setShowReason] = useState(false);

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
    const getCardDetails = () => {
        axios.get(`http://localhost:8000/editset/${setID}`)
        .then(res => {
            setCards(res.data);
            console.log(res.data);
            console.log(cards);
        }).catch(err => {
            console.log("Error fetching car details: " + Error);
        })
    }
    const handleFlip = () => {
        setFlipped(!flipped);
    }
    const handlePrev = () => {
        if (index != 0) {
            setIndex(index - 1);
            setShowReason(false);
            setFlipped(false);
        }
    }
    const handleNext = () => {
        if (index != cards.length - 1) {
            setIndex(index + 1);
            setShowReason(false);
            setFlipped(false);
        }
        else if (index === cards.length - 1) {
            navigate(`/congrats/${setID}`)
        }
    }
    const handleReason = () => {
        setShowReason(!showReason);
    }
    useEffect(() => getQuestionDetails, [setID]);
    useEffect(() => getSetDetails, [setID]);
    useEffect(() => getCardDetails(), []);

    return (
        <div>
            <span style={{ fontSize: '35px' }}><strong> {setDetails.setName} </strong></span>
            <br />
            <p> {index + 1} / {cards.length} </p>
            <div className="container">
                <button className="flashcard" onClick={handleFlip}> {!flipped ? <span className="scrollable-text"> {cards[index].question} </span> : <span className="scrollable-text"> {cards[index].answer} </span>}</button>
                <button className="reasonButton" onClick={handleReason}> Reason it was wrong </button> <br />  
                <div className="reason-text-container">{showReason ? <span className="reason-text"> 
                    {cards[index].reason} </span> : <span />} </div>
            </div>
            <button className="loginButton" style={{border: 'none'}} onClick={handlePrev}> 
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            </button>
            <button className="loginButton" style={{border: 'none'}} onClick={handleNext}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
            </button>
        </div>
)}

export default Study;