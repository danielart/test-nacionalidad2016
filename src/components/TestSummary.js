import React from 'react';
import '../css/Question.css';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import SuccessIcon from 'material-ui/svg-icons/action/done';
import FailedIcon from 'material-ui/svg-icons/navigation/close';

import { red500, green500} from 'material-ui/styles/colors';

export default class TestSummary extends React.Component {

    constructor(props){
      super (props);
      this.state = {
        questionToShow : 0,
      }
      this.handleChangeQuestionToShow = this.handleChangeQuestionToShow.bind(this);
    }

    handleChangeQuestionToShow(questionToShow){
      console.log('q '+ questionToShow);
      console.log(this.props.questions[Number(this.state.questionToShow)]);
      this.setState({
        questionToShow: questionToShow
      });
    }

    render(){
        const {answers,questions } =  this.props;
        var questionInfo = questions[Number(this.state.questionToShow)];
        var rows = [];
        // eslint-disable-next-line
        Object.keys(answers).map(answer => {
            var validAnswerNumber = Number(answer)+1;
            if(answers[answer] === "2"){
                var tooltip = "P "+validAnswerNumber;
                rows.push(
                    <Badge key={answer}
                           onClick={() => this.handleChangeQuestionToShow(Number(answer))}
                           badgeContent={
                        <IconButton tooltip={tooltip} >
                          <SuccessIcon color={green500}/>
                        </IconButton>} >
                        P {validAnswerNumber}
                    </Badge>);

            } else {
                rows.push(
                    <Badge key={answer}
                        onClick={() => this.handleChangeQuestionToShow(Number(answer))}
                        badgeContent={<IconButton tooltip={tooltip} ><FailedIcon  color={red500} /></IconButton>}>
                        P {validAnswerNumber}
                    </Badge>);
            }
        });

        var currentAnswers = [];
        Object(questionInfo.answers).map(function(answer){
          console.log("-- " + answer.value + " - " +answers[questionInfo.questionId-1] );
          if(answer.value === "2"){
            currentAnswers.push(<li key={"answerLi"+answer.id} className="correctAnswer">{answer.text}</li>)
          } else {
            if(answers[questionInfo.questionId -1] !== "2" && answers[questionInfo.questionId-1] === answer.value){
              currentAnswers.push(<li key={"answerLi"+answer.id} className="wrongAnswer" >{answer.text}</li>)
            } else {
              currentAnswers.push(<li key={"answerLi"+answer.id} >{answer.text}</li>)
            }

          }
        });

          return(
            <div className="scrollingSumary">
                {rows}
                <div>
                    <p className="summaryQuestionText">{questionInfo.questionText}</p>
                    <ul>
                      {currentAnswers}
                    </ul>
                </div>
            </div>
        );
    }
}
