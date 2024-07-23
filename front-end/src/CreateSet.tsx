import axios from 'axios'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


const CreateSet = () => {

    type Card = {question: string, answer: string, reason: string}

    const [loggedInUser, setLoggedInUser] = useState('');
    const [setName, setSetName] = useState('');
    const [setID, setSetID] = useState(0);
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
    const addCards = async (setId: any, cards: { question: string; answer: string; reason: string }[]) => {
        try {
          const response = await axios.post('http://localhost:8000/addCards', { setID: setId, cards });
          console.log(response.data.message);
          navigate('/my-sets');
        } catch (error) {
          console.error('Error adding cards:', error);
        }
      };
    const createSet = async () => {
    if (setName === '')
        setErrors("Required");
    else{
        setErrors('');
        try {
        const response = await axios.post('http://localhost:8000/createSet', { setName });
        const setId = response.data.setId;
        console.log(`Set created with ID: ${setId}`);
        
        await addCards(setId, cards);
        
        } catch (error) {
        console.error('Error creating set:', error);
        }
    }
    };
    /*const createSet = async () => {
        console.log(setName);
        if (setName === '')
            setErrors("Required");
        else{
            setErrors('');
            axios.post('http://localhost:8000/createSet', {setName})
            .then(res => {
                console.log(setName);
                console.log(res.data);
                setSetID(res.data);
            }).catch(err => console.log("Error: " + err));
        }        
        await createDetails();
        console.log("creating details");
    }
    const createDetails = async () => {
        console.log(setID);
        axios.post('http://localhost:8000/addCards', {cards})
        .then(res => {
            console.log(res.data.message);
            navigate('/my-sets');
        }).catch(err => console.log("Error: " + err));
    }*/

    useEffect(() => getUser(), []);

    return(
        <div>
            <h1> Create New Set </h1>
            <label htmlFor="setName"><strong> Set Name: </strong></label>
            <input type="text" name="setName" placeholder="Enter set name"
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
                            style={{ width: '244.4px', resize: 'none', border: 'none', borderBottom: '2px solid black'}}
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
                            style={{ width: '244.4px', resize: 'none', border: 'none', borderBottom: '2px solid black'}}
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
                            value={card.reason}
                            onChange={(e) => handleCardChange(index, 'reason', e.target.value)}
                            style={{ width: '244.4px', resize: 'none', border: 'none', borderBottom: '2px solid black'}}                            rows={1}
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
                        <td><button className="deleteButton" style={{border: 'none'}} onClick={() => deleteCard(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="loginButton" name="add" onClick={addCard}> Add Card </button>
            <button className="loginButton" name="submit" onClick={createSet}> Create Set </button>
        </div>
)}

export default CreateSet;