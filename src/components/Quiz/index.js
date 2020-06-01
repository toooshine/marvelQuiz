import React, { Component, Fragment } from 'react';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import { QuizMarvel } from '../quizMarvel';
import { toast } from 'react-toastify';
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class Quiz extends Component {

    constructor(props) {
        super(props)

        this.initialState = {
        levelNames: ["debutant", "confirme", "expert"],
        quizLevel: 0,
        maxQuestions: 10,
        storedQuestions: [],
        question: null,
        options: [],
        idQestion: 0,
        btnDisabled: true,
        userAnswer: null,
        score: 0,
        showWelcomeMsg: false,
        quizEnd: false
    };
    
        this.state = this.initialState;
        this.storeDataRef = React.createRef();
    }

    loadQuestions = level => {

        const fetchedArrayQuiz = QuizMarvel[0].quizz[level];

        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {

            this.storeDataRef.current = fetchedArrayQuiz;

            const newArray = fetchedArrayQuiz.map(({ answer, ...keepRest }) => keepRest);
            this.setState({storedQuestions: newArray})

        } else {
            console.log("Pas assez de questions");
        }
    };

    showToastMsg = pseudo => {
        if (!this.state.showWelcomeMsg) {

            this.setState({ showWelcomeMsg: true });

            toast.warn(`🦄 Welcome ${pseudo} and good luck!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            bodyClassName: "toastify-color-welcome"
            });
        }
    };

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel]);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.storedQuestions !== prevState.storedQuestions) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQestion].question,
                options: this.state.storedQuestions[this.state.idQestion].options
            })
        };

        if ((this.state.idQestion !== prevState.idQestion) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQestion].question,
                options: this.state.storedQuestions[this.state.idQestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if (this.state.quizEnd !== prevState.quizEnd) {
            const gradePercent = this.getPercentage(this.state.maxQuestions, this.state.score);
            this.gameOver(gradePercent);
        }

        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMsg(this.props.userData.pseudo);
        }
    }

    submitAnswer = (selectedAnswer) => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        });
    };

    nextQuestion = () => {
        if (this.state.idQestion === this.state.maxQuestions - 1) {
            this.setState({ quizEnd: true });
        } else {
            this.setState(prevState => ({
                idQestion: prevState.idQestion + 1
            }))
        }

        const goodAnswer = this.storeDataRef.current[this.state.idQestion].answer;
        if (this.state.userAnswer === goodAnswer) {
            this.setState(prevState => ({
                score: prevState.score + 1
            }))

            toast.success('🦄 Great + 1', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            bodyClassName: "toastify-color",
            });
        } else {
            toast.error('🦄 Damn 0', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
            });
        }

    };

    getPercentage = (maxQuest, ourScore) => {
        return ((ourScore / maxQuest) * 100);
    }

    gameOver = percent => {

        if (percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent: percent
            })
        } else {
            this.setState({
                percent: percent
            })
        }
    }

    loadLevelQuestions = param => {
        this.setState({ ...this.initialState, quizLevel: param });
        this.loadQuestions(this.state.levelNames[param]);
    };
    
    render() {
        
        const { pseudo } = this.props.userData;

        const displayOptions = this.state.options.map((option, index) => {
            return (
                <p key={index} onClick={() => this.submitAnswer(option)} className={`answerOptions ${this.state.userAnswer === option ? "selected" : ''}`}>
                    <FaChevronRight />
                    {option}
                </p>
            )
        });

        return this.state.quizEnd ?
            <QuizOver
                ref={this.storeDataRef}
                levelNames={this.state.levelNames}
                score={this.state.score}
                maxQuestions={this.state.maxQuestions}
                quizLevel={this.state.quizLevel}
                percent={this.state.percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
            :
            (
            <Fragment>
                <Levels levelNames={this.state.levelNames} quizLevel={this.state.quizLevel} />
                <ProgressBar idQuestion={this.state.idQestion} maxQuestion={this.state.maxQuestions} />
                <h2>{this.state.question}</h2>
                {displayOptions}
                <button onClick={this.nextQuestion} disabled={this.state.btnDisabled} className='btnSubmit'>
                    { this.state.idQestion < this.state.maxQuestions - 1 ? "Suivant" : "Termniner" }
                </button>
            </Fragment>
        )
    }
}

export default Quiz;
