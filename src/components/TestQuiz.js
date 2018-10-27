/* eslint-disable */
import React, {
    PropTypes,
} from 'react';

import Question from './Question.js';
import Pagination from './Pagination.js';
import ResumeAnswers from './ResumeAnswers.js';
import ActionButtonsBar from './ActionButtonsBar.js';
import  '../css/TestQuiz.css';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import FinishIcon from 'material-ui/svg-icons/action/done';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme();

export default class TestQuiz extends React.Component {

    render() {
        const { currentQuestion, questions, showFinishButton, handleNextQuestion, testFinished, handlePreviousQuestion, handleFinishCurrentTest, onAnswerChange, answers} = this.props;
        const question = questions[currentQuestion];
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div  className="AnswerList-box">
                    <Question
                        text={question.questionText}
                        answers={question.answers}
                        answer={answers[currentQuestion]}
                        questionId={question.questionId}
                        onAnswerChange={onAnswerChange.bind(null, currentQuestion)}
                    />

                   <div className="bottom-button-bar">
                        <FloatingActionButton  onClick={handleFinishCurrentTest}>
                            <FinishIcon />
                        </FloatingActionButton>
                    </div> 
                </div>
            </MuiThemeProvider>
        );
    }
}

TestQuiz.propTypes = {
    currentQuestion : PropTypes.number,
    showFinishButton : PropTypes.bool,
    testFinished : PropTypes.bool,
    questions : PropTypes.arrayOf(PropTypes.shape({
        questionText: PropTypes.string.isRequired,
        questionId: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        }))
    })),
    handleNextQuestion: PropTypes.func,
    handlePreviousQuestion: PropTypes.func,
    handleFinishCurrentTest: PropTypes.func,
    onAnswerChange: PropTypes.func,
};
