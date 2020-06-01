import React, { Fragment, useEffect, useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import Modal from '../Modal';
import axios from 'axios';

const QuizOver = React.forwardRef((props, ref) => {

    const { levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestions } = props;
    
    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;

    const hash = '88f8e64030cb38fa7f9b1b7b1fe43d99';

    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [characterData, setCharacterData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setAsked(ref.current);

        if (localStorage.getItem('marvelStorageDate')) {
            const date = localStorage.getItem('marvelStorageDate');
            checkDataAge(date);
        }
    }, [ref]);

    const checkDataAge = date => {
        const today = Date.now();
        const timeDifference = today - date;
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        if (daysDifference >= 15) {
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    const showModal = id => {
        setOpenModal(true);

        if (localStorage.getItem(id)) {
            setCharacterData(JSON.parse(localStorage.getItem(id)));
            setIsLoading(false);
        } else {
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then(response => {
                setCharacterData(response.data);
                setIsLoading(false);
                localStorage.setItem(id, JSON.stringify(response.data));
                if (!localStorage.getItem('marvelStorageDate')) {
                    localStorage.setItem('marvelStorageDate', Date.now());
                }
            })
        .catch(error => console.log(error))
        }
    }

    const closeModal = () => {
        setOpenModal(false);
        setIsLoading(true);
    }

    const capitalizeFirestLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const averagegrade = maxQuestions / 2;

    if (score < averagegrade) {
       // setTimeout(() => loadLevelQuestions(0), 3000);
    setTimeout(() => loadLevelQuestions(quizLevel), 3000);
    }

    const decision =
        score >= averagegrade
            ?
            (
                <>
                    <div className="stepsBtnContainer">
                    {
                        quizLevel < levelNames.length ?
                            (
                                <>
                                    <p className="successMsg">Bravo, passez au niveau suivant !</p>
                                    <button className="btnResult success" onClick={() => loadLevelQuestions(quizLevel)}>Niveau suivant</button>
                                </>
                            )
                            :
                            (
                                <>
                                        <p className="successMsg">
                                            <GiTrophyCup size='50px' />
                                            Bravo, vous êtes un expert !
                                        </p>
                                    <button className="btnResult gamever" onClick={() => loadLevelQuestions(0)}>Accueil</button>
                                </>
                            )
                        }
                    </div>
                    <div className="percentage">
                        <div className="progressPercent">Réussite: {percent}%</div>
                        <div className="progressPercent">Note {score}/{maxQuestions}</div>
                    </div>
                </>
            )
            :
            (
                <>
                    <div className="stepsBtnContainer">
                        <p className="failureMsg">Vous avez échoué </p>
                    </div>

                    <div className="percentage">
                        <div className="progressPercent">Réussite: {percent} %</div>
                        <div className="progressPercent">Note {score}/{maxQuestions}</div>
                    </div>
                </>
            )

    const questionAnswer =  score >= averagegrade ?
        asked.map(question => {
        return (
            <tr key={question.id}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                    <button className="btnInfo" onClick={()=>{showModal(question.heroId)}}>Infos</button>
                </td>
            </tr>
        )
        }) : 
        (
        <tr>
                <td colSpan="3">
                <div className="loader"></div>
                <p style={{ textAlign: 'center', color: 'red' }}>
                    Pas de réponse
                </p>
            </td>
        </tr> 
        )

    const resultModal = !isLoading ? (
        <>
            <div className='modalHeader'>
                <h2>{characterData.data.results[0].name}</h2>
            </div>
            <div className='modalBody'>
                <div className="comicImage">
                    <img
                        alt={characterData.data.results[0].name}
                        src={characterData.data.results[0].thumbnail.path+'.'+characterData.data.results[0].thumbnail.extension}
                    />
                    {characterData.attributionText}
                </div> 
                <div className="comicDetails">
                    <h3>Description</h3>
                    {
                        characterData.data.results[0].description ?
                            <p>{characterData.data.results[0].description}</p> :
                            <p>Description indisponible ...</p>
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterData.data.results[0].urls &&
                        characterData.data.results[0].urls.map((url, index) => {
                            return <a
                                key={index}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {capitalizeFirestLetter(url.type)}
                            </a>
                        })
                    }
                </div>
                
            </div>
            <div className='modalFooter'>
                <button className='modalBtn' onClick={closeModal}>Fermer</button>
            </div>
        </>
    ): (
            <>
                <div className='modalHeader'>
                    <h2>Réponse de Marvel ...</h2>
                </div>
                <div className='modalBody'>
                    <div className="loader"></div>
                </div>
            </>
    )
        

    return (
        <Fragment>
            {decision}
            <hr />
            <p>Les réponses aux questions posées: </p>
            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswer}
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal} closeModal={closeModal}>
                {resultModal}
            </Modal>

        </Fragment>
    )
});

export default React.memo(QuizOver);
