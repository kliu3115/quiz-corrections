import axios from 'axios'
import { escape } from 'querystring'
import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'


const CreateSet = () => {
    type Card = {question: string, answer: string, reason: string}
    const {setID} = useParams();
    const [setDetails, setSetDetails] = useState({
        setName: '',
        createdBy: '',
        createdDate: '',
        setID: 0
    });    
    const [loggedInUser, setLoggedInUser] = useState('');
    const [setName, setSetName] = useState('');
    const [errors, setErrors] = useState('');
    const [cards, setCards] = useState<Card[]>([{question: '', answer: '', reason: ''}]);
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
    const getSetDetails = () => {
        axios.get(`http://localhost:8000/getname/${setID}`)
        .then(res => {
            setSetDetails(res.data[0]);
            setSetName(res.data[0].setName);
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
    const handleCardChange = (index: number, field: keyof Card, value: string) => {
        const temp = [...cards];
        temp[index][field] = value;
        setCards(temp);
        console.log(temp);
      };
    const addCard = () => {
        setCards([...cards, { question: '', answer: '', reason: '' }]);
    }
    const deleteCard = (index: number) => {
        const temp = [...cards];
        temp.splice(index, 1);
        setCards(temp);
        console.log(temp);
    }
    const updateSet = async (setId: any, cards: { question: string; answer: string; reason: string }[]) => {
        try {
          const response = await axios.post('http://localhost:8000/updateCards', { setName: setName, setID: setId, cards });
          console.log(response.data.message);
          navigate(`/view-set/${setID}`);
        } catch (error) {
          console.error('Error updating cards:', error);
        }
      };
      const setInitialTextareaHeight = (content: string) => {
        const lineHeight = 20; // Adjust as needed based on font size and line height
        const lineCount = Math.floor(content.length / 34);
        if (lineCount * lineHeight <= 20)
            return '20px';
        if (lineCount > 8)
            return '160px';
        return `${lineHeight * lineCount}px`;
      };

    useEffect(() => getUser(), []);
    useEffect(() => getSetDetails(), []);
    useEffect(() => getCardDetails(), []);

    return(
        <div>
            <h1> Edit Set </h1>
            <label htmlFor="setName"><strong> Set Name: </strong></label>
            <input type="text" name="setName" placeholder="Enter set name" value={setName}
            onChange={(e) => setSetName(e.target.value)}/> <br />
            {errors && <span className='text-danger'> {errors} </span>} 
            <table className="createSetTable">
                <thead>
                    <tr>
                        <td><strong> # </strong></td>
                        <td><strong> Question </strong></td>
                        <td><strong> Answer </strong></td>
                        <td><strong> Reason you got it wrong </strong></td>
                    </tr>  
                </thead>
                <tbody>     
                    {cards.map((card, index) => (
                    <tr key={index}>
                        <td>
                            <p> {index + 1}  </p>
                        </td>
                        <td><textarea
                            value={card.question}
                            onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                            style={{ width: '244.4px', height: setInitialTextareaHeight(card.question), resize: 'none', border: 'none', borderBottom: '2px solid black'}}
                            rows={1}
                            onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            if (target.scrollHeight < 20)
                                target.style.height = '20px';
                            else if (target.scrollHeight > 160)
                                target.style.height = '160px';
                            else
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        /></td>
                        <td><textarea
                            value={card.answer}
                            onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                            style={{ width: '244.4px', height: setInitialTextareaHeight(card.answer), resize: 'none', border: 'none', borderBottom: '2px solid black'}}
                            rows={1}
                            onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            if (target.scrollHeight < 20)
                                target.style.height = '20px';
                            else if (target.scrollHeight > 160)
                                target.style.height = '160px';
                            else
                                target.style.height = `${target.scrollHeight}px`;                            }}
                        /></td>
                        <td><textarea
                            value={card.reason}
                            onChange={(e) => handleCardChange(index, 'reason', e.target.value)}
                            style={{ width: '244.4px', height: setInitialTextareaHeight(card.reason), resize: 'none', border: 'none', borderBottom: '2px solid black'}}
                            rows={1}
                            onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            if (target.scrollHeight < 20)
                                target.style.height = '20px';
                            else if (target.scrollHeight > 160)
                                target.style.height = '160px';
                            else
                                target.style.height = `${target.scrollHeight}px`;                            }}
                        /></td>
                        <td><button className="deleteButton" style={{border: 'none'}} onClick={() => deleteCard(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="loginButton" name="add" onClick={addCard}> Add Card </button>
            <button className="loginButton" name="submit" onClick={() => updateSet(setID, cards)}> Update Set </button>
        </div>
)}

export default CreateSet;