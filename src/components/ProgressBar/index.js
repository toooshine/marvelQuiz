import React, { Fragment } from 'react'

const ProgressBar = ({idQuestion, maxQuestion}) => {

    const getWidth = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId;
    }

    const actualQuestion = idQuestion + 1;
    const progressPercent = getWidth(maxQuestion, actualQuestion);

    return (
        <Fragment>
            <div className='percentage'>
                <div className='progressPercent'>{`Question : ${idQuestion + 1} / ${maxQuestion}`}</div>
                <div className='progressPercent'>{`Progression : ${progressPercent}%`}</div>
            </div>

            <div className='progressBar'>
                <div className='progressBarChange' style={{width: `${progressPercent}%`}}></div>
            </div>
            </Fragment>
    )
}

export default React.memo(ProgressBar);
