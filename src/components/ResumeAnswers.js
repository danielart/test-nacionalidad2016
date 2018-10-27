import React, {PropTypes} from 'react';
import  '../css/ResumeAnswers.css';
import QuestionPill from './QuestionPill.js';

import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';

var intervalForTimer = undefined;

export default class ResumeAnswers extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            time: (60*45),
            currentTime:(60*45)
        };
        this.addSecondToCurrentTime = this.addSecondToCurrentTime.bind(this);
        this.substractSecondToCurrentTime = this.substractSecondToCurrentTime.bind(this);
    }

    addSecondToCurrentTime(){
        const { currentTime } = this.state;
        this.setState({currentTime: currentTime+1});
    }
    substractSecondToCurrentTime(){
        const { currentTime } = this.state;
        this.setState({currentTime: currentTime-1});
    }
    componentWillUnmount(){
        clearInterval(intervalForTimer);      
    }
    componentDidMount() {
        var self = this;
        intervalForTimer = setInterval(function() {
            self.substractSecondToCurrentTime();
        }, 1000);
    }

    componentWillUnmount(){
      clearInterval(intervalForTimer);
    }

    render() {

      const {answers,questionsLength,currentQuestion,moveToQuestion} = this.props;
      const {currentTime} = this.state;
      var rows = [];

      // eslint-disable-next-line
      for(var i = 0; i< questionsLength;i++){
        var completedAnswers = Object.keys(answers).length;
        var completedPill = false;
        if(answers[i] !== undefined){
          completedPill = true;
        }
        rows.push(<QuestionPill key={i}
                                moveToQuestion={moveToQuestion}
                                completedPill={completedPill}
                                currentQuestionPill={currentQuestion === Number(i)}
                                questionNumber={Number(i)} />)
      }

      var minutes = Math.floor(currentTime/60);
      var seconds = currentTime - (minutes * 60);
      return (
          <Paper zDepth={1} className="ResumeAnswers-box">
            {rows}
            <LinearProgress mode="determinate" min={0} max={questionsLength} value={completedAnswers} />
            <p>{minutes}:{("0"+seconds).slice(-2)}</p>
            <LinearProgress mode="determinate" min={0} max={this.state.time} value={this.state.currentTime} />
          </Paper>);
    }
}

ResumeAnswers.propTypes = {
  questionsLength : PropTypes.number,
  currentQuestion : PropTypes.number,
  moveToQuestion: PropTypes.func
};
