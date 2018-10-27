/* eslint-disable */
import React, { Component } from 'react';
// import Rebase from 're-base';
import logo from '../img/logo.svg';
import '../css/App.css';

import TestQuiz from './TestQuiz.js';
import Pagination from './Pagination.js';
import ResumeAnswers from './ResumeAnswers.js';
import ActionButtonsBar from './ActionButtonsBar.js';
import TestSummary from './TestSummary.js';
import BlocksTestOptions from './BlocksTestOptions.js';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton  from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FinishIcon from 'material-ui/svg-icons/action/done';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// var base = Rebase.createClass('https://test-nacionalidad.firebaseio.com');

const responseGoogle = (response) => {
  console.log(response);
}

const muiTheme = getMuiTheme();
// questions for test

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentQuestion: 0,
            score: 0,
            testFinished: false,
            answers: {},
            openModal: true,
            openFinishTestModal: false,
            showFinishModal:true,
            loading: true,
            startTest: false,
        };

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handlePreviousQuestion = this.handlePreviousQuestion.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.handleFinishCurrentTest = this.handleFinishCurrentTest.bind(this);
        this.handleStartTest = this.handleStartTest.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleCloseFinishTestModal = this.handleCloseFinishTestModal.bind(this);
        this.handleCloseTest = this.handleCloseTest.bind(this);
        this.handleFinishTest = this.handleFinishTest.bind(this);
        this.handleRestartTest = this.handleRestartTest.bind(this);
        this.moveToQuestion = this.moveToQuestion.bind(this);
    }

    // componentDidMount(){
    //     this.ref = base.syncState('tests', {
    //         context: this,
    //         asArray: true,
    //         then(){
    //             this.setState({loading: false})
    //         }
    //     });
    // }

    // componentWillUnmount(){
    //     base.removeBinding(this.ref);
    // }


    handleStartTest(){
        this.setState({
            startTest: true,
        });
    }

    handleFinishCurrentTest(){
      const { answers, score } = this.state;
      var totalScore = 0;
      for (var questionLoop = 0; questionLoop < QUESTIONS.length; questionLoop++){
        if(answers[questionLoop] === null || answers[questionLoop] === 'undefined' ){
          answers[questionLoop] = "0";
        } else if(answers[questionLoop] === "2"){
          totalScore++;
        }
      }

      this.setState({
          testFinished : true,
          score: totalScore,
          openModal:true
      });
    }

    handleNextQuestion() {
        const { currentQuestion,currentAnswer } = this.state;
        if (currentQuestion >= QUESTIONS.length - 1) {
            return;
        }

        this.setState({
            currentQuestion : currentQuestion + 1,
        });
    }

    handlePreviousQuestion() {
        const { currentQuestion } = this.state;
        if (currentQuestion - 1 < 0) {
            return;
        }
        this.setState({
            currentQuestion : currentQuestion - 1,
        });
    }

    handleAnswerChange(question, answer) {
        const { answers } = this.state;
        this.setState({
            answers: {
                ...answers,
                [question]: answer,
            }
        });
    }

    handleFinishTest(){
      if((Object.keys(this.state.answers).length) < QUESTIONS.length){
          this.setState({openFinishTestModal : true});
      } else {
        this.handleFinishCurrentTest();
      }
    }

    handleCloseModal(){
      this.setState({openModal: false});
      this.handleCloseTest();
    }

    handleCloseFinishTestModal(){
      this.setState({openFinishTestModal: false});
    }

    handleCloseTest(){
        this.handleRestartTest();
        this.setState({startTest: false});
    }

    handleRestartTest(){
      this.setState({openModal: false,
          currentQuestion: 0,
          score: 0,
          testFinished: false,
          showFinishButton : false,
          openFinishTestModal: false,
          answers: {}});
    }

    moveToQuestion(questionId){
        this.setState({currentQuestion: questionId});
    }

    render() {
      const actionsResumeModal = [
            <FlatButton
              label="Cerrar"
              primary={true}
              onClick={this.handleCloseModal}
            />,
            <FlatButton
              label="Reiniciar"
              primary={false}
              onClick={this.handleRestartTest}
            />];
      const actionsFinishTestModal = [
            <FlatButton
              label="Si, finalizar"
              primary={true}
              onClick={this.handleFinishCurrentTest}
            />,
            <FlatButton
              label="No"
              primary={false}
              onClick={this.handleCloseFinishTestModal}
            />];

        const { testFinished,startTest,
          showFinishButton, currentQuestion,
          answers, openModal, openFinishTestModal, score} = this.state;
        const emptyAnswers = QUESTIONS.length - Object.keys(answers).length;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
            <div className="App">
                <div className="App-header">
                    <h2>Test nacionalidad <small>(beta 0.1.1)</small></h2>
                </div>
                <div className="App-intro">
                {startTest ?
                    <div>
                        <ResumeAnswers
                          currentQuestion={currentQuestion}
                          answers={answers}
                          questionsLength={QUESTIONS.length}
                          moveToQuestion={this.moveToQuestion}/>
                        <TestQuiz
                            questions={QUESTIONS}
                            testFinished={testFinished}
                            showFinishButton={showFinishButton}
                            currentQuestion={currentQuestion}
                            answers={answers}
                            handleFinishCurrentTest={this.handleFinishTest}
                            onAnswerChange={this.handleAnswerChange}
                        />

                        <ActionButtonsBar handlePreviousQuestion={this.handlePreviousQuestion}
                                          disabledPrevious={currentQuestion - 1 < 0 || testFinished}
                                          handleNextQuestion={this.handleNextQuestion}
                                          disabledNext={currentQuestion + 1 >= QUESTIONS.length || testFinished}/>

                        <Pagination
                            currentQuestion={currentQuestion}
                            questionsLength={QUESTIONS.length}/>
                        <Dialog
                            title="Finalizar el test"
                            actions={actionsFinishTestModal}
                            modal={true}
                            open={openFinishTestModal}>
                                <p>¿Está seguro que desea finalizar el test?</p>
                              Te has dejado {emptyAnswers} de {QUESTIONS.length} preguntas por contestar.

                        </Dialog>

                        { testFinished ? <div className="App-result">
                            <Dialog
                                actions={actionsResumeModal}
                                modal={true}
                                className="customContentStyle"
                                open={openModal}>
                                {score > 2 ? <h1 className="test-success">Aprobado</h1> :
                                    <h1 className="test-failed">Fallido</h1>}
                                    Has acertado {score} de {QUESTIONS.length} preguntas.
                                <TestSummary answers={answers} questions={QUESTIONS} />
                            </Dialog>
                        </div> : null } </div>:
                        <BlocksTestOptions handleStartTest={this.handleStartTest} />
                  }
              </div>
            </div>
            </MuiThemeProvider>
        );
    }
}
const QUESTIONS = [
  {
     "questionId":"1001",
     "questionText":" La forma política del Estado español es... ",
     "answers":[
        {
       "text": "monarquía parlamentaria.",
       "value": "1",
       "id": "0"
     },
        {
       "text": "república federal.",
       "value": "0",
       "id": "1"
     },
        {
       "text":"monarquía federal.",
       "value": "2",
       "id": "2"
     }
     ]
  },
  {
     "questionId":"1002",
     "questionText":" Según la Constitución española, la soberanía nacional reside en el pueblo, del que proceden... ",
     "answers":[
        {
       "text": "las leyes orgánicas.",
       "value": "0",
       "id": "0"
     },
        {
       "text": "los estatutos de autonomía.",
       "value": "1",
       "id": "1"
     },
        {
       "text": "los poderes del Estado.",
       "value": "2",
       "id": "2"
     }
     ]
  },
  {
      "questionId":"1003",
      "questionText":" Los valores superiores del ordenamiento jurídico de España son: el pluralismo político, la libertad, la justicia y la...",
      "answers":[
         {
       "text": "fraternidad",
        "value": "1",
        "id": "0"

      },
         {
       "text": "igualdad",
        "value": "2",
        "id": "1"

      },
         {
       "text": "solidaridad",
        "value": "0",
        "id": "2"

      }
      ]
   },
   {
      "questionId":"1004",
      "questionText":" La Constitución reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones que integran España y la … entre todas ellas.",
      "answers":[
         {
       "text": "fraternidad",
        "value": "1",
        "id": "0"

      },
         {
       "text": "igualdad",
        "value": "2",
        "id": "1"

      },
         {
       "text": "solidaridad",
        "value": "0",
        "id": "2"

      }
      ]
   },
   {
      "questionId":"1005",
      "questionText":" En la Constitución se establece la separación de los poderes judicial, legislativo y … ",
      "answers":[
         {
       "text": "administrativo.",
        "value": "1",
        "id":"0"

      },
         {
       "text": "ejecutivo.",
        "value": "2",
        "id":"1"

      },
         {
       "text": "económico",
        "value": "0",
        "id":"2"

      }
      ]
   },
   {
      "questionId":"1006",
      "questionText":" El Jefe del Estado es...",
      "answers":[
         {
       "text": "el presidente del Gobierno",
        "value": "1",
        "id":"0"
      },
         {
       "text": "el Rey",
        "value": "2",
        "id":"1"

      },
         {
       "text": "el ministro de Asuntos Exteriores",
        "value": "0",
        "id":"2"

      }
      ]
   },
   
   {
      "questionId":"1007",
      "questionText":" El mando supremo de las Fuerzas Armadas corresponde al...",
      "answers":[
         {
            "text":"Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"presidente del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"ministro de Defensa.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1008",
      "questionText":" Si el Rey o la Reina de España fuera menor de edad, ¿quién sería el regente hasta su mayoría de edad? ",
      "answers":[
         {
            "text":"El presidente del Gobierno.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El padre o la madre del Rey.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el ministro del Interior.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1009",
      "questionText":" Los embajadores y otros representantes diplomáticos extranjeros son acreditados por...",
      "answers":[
         {
            "text":"el Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el presidente del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el ministro de Asuntos Exteriores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1010",
      "questionText":" Convocar elecciones corresponde al...",
      "answers":[
         {
            "text":"ministro del Interior ",
            "value":"0",
            "id":"0"
         },
         {
            "text":"presidente del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Rey.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1011",
      "questionText":" La más alta representación del Estado español en las relaciones internacionales corresponde al...",
      "answers":[
         {
            "text":"Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"presidente del Gobierno ",
            "value":"2",
            "id":"1"
         },
         {
            "text":"ministro de Asuntos Exteriores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1012",
      "questionText":" El Rey de España vive en el...",
      "answers":[
         {
            "text":"Palacio Real.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Palacio de la Zarzuela.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Palacio de la Moncloa.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1013",
      "questionText":" El lugar donde se celebran actos del Estado presididos por el Rey es el...",
      "answers":[
         {
            "text":"Palacio Real.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Palacio de la Zarzuela.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Palacio de la Moncloa.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1014",
      "questionText":" El heredero de la Corona de España, desde su nacimiento, tiene el título de Príncipe o Princesa de...",
      "answers":[
         {
            "text":"Andalucía.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Aragón.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Asturias.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1015",
      "questionText":" Generalmente, se considera que el primer Rey de España fue...",
      "answers":[
         {
            "text":"Fernando el Santo.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Carlos I.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Felipe II.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1016",
      "questionText":" La dinastía del Rey de España, que se inició en el siglo XVIII, es la dinastía...",
      "answers":[
         {
            "text":"Austria.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Baviera.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Borbón.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1017",
      "questionText":" La Constitución garantiza la seguridad... de los españoles ",
      "answers":[
         {
            "text":"jurídica.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"legislativa.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"ejectuvia.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1018",
      "questionText":" La Constitución española fue firmada por el Rey, el presidente de las Cortes, y el presidente del Congreso y el presidente del...",
      "answers":[
         {
            "text":"Gobierno.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Senado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Estado.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1019",
      "questionText":" Deben respetar la Constitución y el resto de legislación vigente...",
      "answers":[
         {
            "text":"los ciudadanos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los poderes públicos.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los poderes públicos y los ciudadanos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1020",
      "questionText":" El referéndum para la aprobación de la Constitución española se celebró el día...",
      "answers":[
         {
            "text":"22 de noviembre de 1975.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"15 de junio de 1977.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"6 de diciembre de 1978.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1021",
      "questionText":" Los proyectos de reforma constitucional deben ser aprobados por...",
      "answers":[
         {
            "text":"el Congreso.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Senado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"las dos Cámaras.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1022",
      "questionText":" ¿Qué tribunal interpreta la Constitución con respecto a actuaciones de los poderes públicos? ",
      "answers":[
         {
            "text":"el Tribunal de Cuentas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Tribunal Constitucional.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El Tribunal Supremo.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1023",
      "questionText":" ¿Quién nombra al presidente del Tribunal Constitucional? ",
      "answers":[
         {
            "text":"El presidente del Gobierno.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El Rey.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El ministro de Justicia.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1024",
      "questionText":" ¿Cuántas franjas tiene la bandera de España? ",
      "answers":[
         {
            "text":"2 horizontales.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"3 verticales.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"3 horizontales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1025",
      "questionText":" ¿Cuántos colores tiene la bandera española? ",
      "answers":[
         {
            "text":"2 ",
            "value":"0",
            "id":"0"
         },
         {
            "text":"3 ",
            "value":"2",
            "id":"1"
         },
         {
            "text":"4",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1026",
      "questionText":" Los colores de la bandera española son...",
      "answers":[
         {
            "text":"blanco y rojo.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"rojo y amarillo.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"amarillo y blanco.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1027",
      "questionText":" Las comunidades autónomas pueden utilizar, junto con la bandera de España, sus propias banderas en...",
      "answers":[
         {
            "text":"sus edificios públicos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"en actos oficiales.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"en sus edificios públicos y actos oficiales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1028",
      "questionText":" La bandera azul con 12 estrellas amarillas en círculo es el símbolo de...",
      "answers":[
         {
            "text":"la Unión Europea.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"la Organización de Seguridad y Cooperación en Europa.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Comisión Europea.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1029",
      "questionText":" El escudo de España incluye en su interior la representación de la unión de Castilla, León, Navarra, Granada y...",
      "answers":[
         {
            "text":"Andalucía.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Aragón.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Asturias.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1030",
      "questionText":" La lengua oficial del Estado español es...",
      "answers":[
         {
            "text":"el castellano.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el inglés.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el francés.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1031",
      "questionText":" Todos los españoles tienen el deber de conocer la lengua...",
      "answers":[
         {
            "text":"autonómica.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"oficial.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"local.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1032",
      "questionText":" En España, además del castellano, son lenguas oficiales en sus respectivas comunidades autónomas: el aranés, el catalán, el gallego, el valenciano y el...",
      "answers":[
         {
            "text":"aragonés.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"bable.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"euskera.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1033",
      "questionText":" El Instituto que promueve universalmente la enseñanza, el estudio y el uso del español es el...",
      "answers":[
         {
            "text":"Instituto Nacional de Administración Pública.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Instituto Nacional de Estadística.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Instituto Cervantes.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1034",
      "questionText":" El Instituto Cervantes, el Instituto Ramon Llull y el Instituto Vasco etxepare son organismos que promueven, respectivamente y entre otros, la difusión de las lenguas...",
      "answers":[
         {
            "text":"española, catalana y vasca.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"española, catalana y gallega.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Gallega, catalana y vasca.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1035",
      "questionText":" La Real Academia Española, el Institut d´Estudis Catalans, la Real Academia Galega, Euskaltzaindia y la Acadèmia Valenciana de la Llengua son organismos para la normalización de las... de España.",
      "answers":[
         {
            "text":"culturas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"lenguas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"tradiciones.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1036",
      "questionText":" La sede de la Presidencia del Gobierno y residencia oficial del presidente es el...",
      "answers":[
         {
            "text":"Palacio Real.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Palacio de la Zarzuela.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Palacio de la Moncloa.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1037",
      "questionText":" Antes de ser nombrado por el Rey, el presidente de Gobierno debe recibir la confianza de...",
      "answers":[
         {
            "text":"el Congreso de los Diputados.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Senado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"las dos Cámaras.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1038",
      "questionText":" El presidente del Gobierno es nombrado por...",
      "answers":[
         {
            "text":"el ministro del Interior.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Rey.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Defensor del Pueblo.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1039",
      "questionText":" ¿Quiénes forman parte del Gobierno? ",
      "answers":[
         {
            "text":"Los ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Los concejales.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Los alcaldes.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1040",
      "questionText":" ¿Cómo se llaman las normas extraordinarias que dicta el Gobierno en circunstancias especiales y que tienen rango de ley? ",
      "answers":[
         {
            "text":"Leyes orgánicas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Decretos ley.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Reglamentos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1041",
      "questionText":" Los proyectos de ley son aprobados por...",
      "answers":[
         {
            "text":"el Consejo de Ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el presidente del Gobierno ",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Congreso de los Diputados.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1042",
      "questionText":" Los poderes públicos garantizan la conservación y promueven el enriquecimiento del patrimonio histórico, cultural y...",
      "answers":[
         {
            "text":"comercial.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"artístico.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"económico.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1043",
      "questionText":" El Gobierno responde de su gestión política ante...",
      "answers":[
         {
            "text":"el Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Senado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Congreso de los Diputados.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1044",
      "questionText":" Las Cortes Generales representan al pueblo. Están formadas por el Senado y por...",
      "answers":[
         {
            "text":"el Consejo de Ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Congreso de los Diputados.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Ayuntamiento",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1045",
      "questionText":" El poder legislativo corresponde...",
      "answers":[
         {
            "text":"al presidente y los ministros ",
            "value":"0",
            "id":"0"
         },
         {
            "text":"a los jueces y magistrados ",
            "value":"2",
            "id":"1"
         },
         {
            "text":"a los diputados y senadores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1046",
      "questionText":" Las Cortes Generales controlan la acción...",
      "answers":[
         {
            "text":"del Gobierno.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"de las comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"de las provincias.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1047",
      "questionText":" Los diputados del Congreso son elegidos para...",
      "answers":[
         {
            "text":"3 años.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"4 años.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"5 años.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1048",
      "questionText":" El Congreso se compone actualmente de... diputados.",
      "answers":[
         {
            "text":"300.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"350.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"400.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1049",
      "questionText":" El criterio para determinar cuántos diputados corresponden a cada provincia, con excepción de Ceuta y Melilla, es el número de...",
      "answers":[
         {
            "text":"ciudades.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"habitantes.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"partidos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1050",
      "questionText":" Las poblaciones de Ceuta y Melilla están representadas en el Congreso cada una por: ",
      "answers":[
         {
            "text":"1 diputado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"2 diputados.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"3 diputados.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1051",
      "questionText":" Al poder legislativo le corresponde...",
      "answers":[
         {
            "text":"crear empleo.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"elaborar leyes.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"elegir alcaldes.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1052",
      "questionText":" ¿Cuántos ciudadanos deben respaldar la iniciativa legislativa para poder presentar una proposición de ley? ",
      "answers":[
         {
            "text":"400.000.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"500.000.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"600.000.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1053",
      "questionText":" En primera votación para la elección del presidente del Gobierno, se requiere una mayoría... de los votos de los diputados del Congreso.",
      "answers":[
         {
            "text":"absoluta.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"relativa.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"simple.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1054",
      "questionText":" Los miembros del Senado se eligen cada...",
      "answers":[
         {
            "text":"3 años.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"4 años.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"5 años.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1055",
      "questionText":" Los presupuestos generales del Estado son presentados por el Gobierno y aprobados por...",
      "answers":[
         {
            "text":"el ministro de Economía y Competitividad ",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Congreso de los Diputados.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Rey.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1056",
      "questionText":" Si los presupuestos del Gobierno no se aprueban en el Congreso de los Diputados antes del día 1 de enero del año correspondiente...",
      "answers":[
         {
            "text":"se prorrogan los del año anterior",
            "value":"0",
            "id":"0"
         },
         {
            "text":"se vuelve a votar la Propuesta el día 2 de Enero.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"se aprueba la propuesta del Gobierno automáticamente.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1057",
      "questionText":" Las leyes que se refieren a los derechos fundamentales y a las libertades públicas son...",
      "answers":[
         {
            "text":"leyes Orgánicas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"decretos ley.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"leyes generales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1058",
      "questionText":" Para aprobar, modificar o derogar una Ley Orgánica, es necesaria en el Congreso una mayoría...",
      "answers":[
         {
            "text":"simple.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"absoluta.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"relativa.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1059",
      "questionText":" El primer periodo ordinario de reunión de las Cámaras es...",
      "answers":[
         {
            "text":"de agosto a noviembre.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"de septiembre a diciembre.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"de septiembre a Noviembre.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1060",
      "questionText":" El segundo periodo ordinario de reunión de las Cámaras es...",
      "answers":[
         {
            "text":"de febrero a junio.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"de enero a junio.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"de enero a julio.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1061",
      "questionText":" La Cámara de representación territorial se llama...",
      "answers":[
         {
            "text":"Congreso de los Diputados.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Cámara de Comercio.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Senado.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1062",
      "questionText":" ¿Cuántos senadores se eligen en cada provincia, con excepción de las islas y Ceuta y Melilla? ",
      "answers":[
         {
            "text":"3.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"4.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"5.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1063",
      "questionText":" Ceuta y Melilla eligen en las elecciones cada una de ellas a...",
      "answers":[
         {
            "text":"1 senador.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"2 senadores.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"3 senadores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1064",
      "questionText":" El plazo de que dispone el Senado para decidir sobre un proyecto ley es de...",
      "answers":[
         {
            "text":"2 meses.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"4 meses.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"6 meses.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1065",
      "questionText":" Las sesiones conjuntas del Congreso y el Senado son presididas por...",
      "answers":[
         {
            "text":"el Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el presidente del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el presidente del Congreso.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1066",
      "questionText":" El poder judicial está constituido por...",
      "answers":[
         {
            "text":"los ministros y el presidente.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los jueces y magistrados.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los diputados y senadores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1067",
      "questionText":" ¿Cuál es el órgano superior del poder judicial? ",
      "answers":[
         {
            "text":"El Tribunal de Cuentas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El Tribunal Constitucional.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El Tribunal Supremo.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1068",
      "questionText":" El Consejo General del Poder Judicial...",
      "answers":[
         {
            "text":"es diferente en cada comunidad autónoma.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"está formado por ministros.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"garantiza la independencia de los jueces.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1069",
      "questionText":" Para gestionar trámites como nacimiento, matrimonio, o solicitud de nacionalidad se debe ir al...",
      "answers":[
         {
            "text":"Registro Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Registro Mercantil.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Registro de la Propiedad.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1070",
      "questionText":" La defensa de la integridad territorial de España corresponde a...",
      "answers":[
         {
            "text":"la Policía Nacional y la Guardia Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las Fuerzas Armadas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Policía Nacional y las Policías Autonómicas",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1071",
      "questionText":" La vigilancia de puertos y aeropuertos, fronteras y costas corresponde a...",
      "answers":[
         {
            "text":"la Guardia Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"la Policía Local.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Policía Nacional.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1072",
      "questionText":" El control de la entrada y salida del territorio nacional de españoles y extranjeros corresponde a...",
      "answers":[
         {
            "text":"la Guardia Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"la Policía Local.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Policía Nacional.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1073",
      "questionText":" La regulación del tráfico en las ciudades corresponde a...",
      "answers":[
         {
            "text":"la Guardia Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"la Policía Local.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Policía Nacional.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1074",
      "questionText":" La regulación del tráfico fuera de las ciudades en la mayor parte del territorio español corresponde a...",
      "answers":[
         {
            "text":"la Guardia Civil.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"la Policía Local.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Policía Nacional.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1075",
      "questionText":" El supremo órgano consultivo del Gobierno de España es...",
      "answers":[
         {
            "text":"el Consejo de Ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Consejo de Estado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Consejo Económico y Social.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1076",
      "questionText":" El órgano consultivo del Gobierno de España en el que están representados empresarios, sindicatos y organizaciones sociales es...",
      "answers":[
         {
            "text":"el Consejo de Ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Consejo de Estado.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el Consejo Económico y Social.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1077",
      "questionText":" ¿Cuántos años dura el mandato del Defensor del Pueblo? ",
      "answers":[
         {
            "text":"3.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"4.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"5.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1078",
      "questionText":" ¿A quién informa de su gestión el Defensor del Pueblo? ",
      "answers":[
         {
            "text":"Al Rey.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Al presidente del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"A las Cortes Generales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1079",
      "questionText":" ¿Cuál es el órgano que controla la gestión económico-financiera del Estado? ",
      "answers":[
         {
            "text":"El Tribunal de Cuentas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El Tribunal Supremo.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El Tribunal Constitucional.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1080",
      "questionText":" El organismo que gestiona los impuestos estatales y aduaneros de España es...",
      "answers":[
         {
            "text":"el Consejo Económico y Social.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Instituto Nacional de Estadística.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Agencia Tributaria.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1081",
      "questionText":" El organismo que elabora y difunde estadísticas sobre España es el … ",
      "answers":[
         {
            "text":"el Consejo Económico y Social.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Instituto Nacional de Estadística.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Agencia Tributaria.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1082",
      "questionText":" ¿Cuál es la publicación oficial del Estado que sirve para publicar leyes, normas o convocatorias públicas? ",
      "answers":[
         {
            "text":"El INE (Instituto Nacional de Estadística).",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El BOE (Boletín Oficial del Estado).",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El PAE (Portal de Administración Electrónica).",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1083",
      "questionText":" El Gobierno ofrece toda la información sobre novedades e iniciativas de la Administración Electrónica de España a través del...",
      "answers":[
         {
            "text":"INE (Instituto Nacional de Estadística).",
            "value":"0",
            "id":"0"
         },
         {
            "text":"BOE (Boletín Oficial del Estado).",
            "value":"2",
            "id":"1"
         },
         {
            "text":"PAE (Portal de Administración Electrónica).",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1084",
      "questionText":" El teléfono de la Administración General del Estado que ofrece información sobre empleo público, becas o ayudas y subvenciones, organismos de las Administraciones, etc., es el...",
      "answers":[
         {
            "text":"010.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"060.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"091.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1085",
      "questionText":" El estado español se organiza territorialmente en...",
      "answers":[
         {
            "text":"municipios, cantones y regiones administrativas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"municipios, provincias y comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"municipios, distritos y estados federales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1086",
      "questionText":" Las provincias limítrofes con características históricas, culturales y económicas comunes, las islas y las provincias con especial identidad regional histórica fueron la base de...",
      "answers":[
         {
            "text":"las comunidades autónomas.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los distritos.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los municipios.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1087",
      "questionText":" Las leyes orgánicas normativas de las comunidades y ciudades autónomas de España se denominan...",
      "answers":[
         {
            "text":"Leyes de Autonomía.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Estatutos de Autonomía.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Reglamentos de Autonomía.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1088",
      "questionText":" ¿Cuántas provincias hay en España (incluidas Ceuta y Melill",
      "answers":[
         {
            "text":"49.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"50.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"52.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1089",
      "questionText":" ¿Quién es el representante de la Administración del Estado en una comunidad autónoma? ",
      "answers":[
         {
            "text":"El presidente de la comunidad autónoma.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"El delegado del Gobierno.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"El presidente de la Asamblea autonómica.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1090",
      "questionText":" Los fondos públicos en España creados para corregir los desequilibrios económicos de las distintas autonomías son el Fondo Complementario y el Fondo de...",
      "answers":[
         {
            "text":"Solidaridad.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Compensación.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Autonomía.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1091",
      "questionText":" La enseñanza de las lenguas cooficiales es competencia...",
      "answers":[
         {
            "text":"del Estado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"de la comunidad autónoma.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"del Gobierno provincial.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1092",
      "questionText":" ¿Cuál de estas ciudades fue capital de España antes del reinado de Felipe II? ",
      "answers":[
         {
            "text":"Madrid.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Salamanca.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Toledo.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1093",
      "questionText":" ¿Cuál de estas ciudades es capital de España desde el reinado de Felipe II (excepto durante un breve periodo)? ",
      "answers":[
         {
            "text":"Madrid.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Salamanca.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Toledo.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1094",
      "questionText":" El gobierno y la protección de las provincias corresponde a: ",
      "answers":[
         {
            "text":"los ayuntamientos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las diputaciones.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"asambleas regionales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1095",
      "questionText":" En materia de Defensa y Fuerzas Armadas, la competencia exclusiva es de...",
      "answers":[
         {
            "text":"el Estado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los ayuntamientos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1096",
      "questionText":" En materia de relaciones internacionales, la competencia es de...",
      "answers":[
         {
            "text":"el Estado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los ayuntamientos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1097",
      "questionText":" En materia de nacionalidad, inmigración, emigración, extranjería y derecho de asilo, la competencia exclusiva es de...",
      "answers":[
         {
            "text":"el Estado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los ayuntamientos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1098",
      "questionText":" En materia de Sanidad e higiene, la competencia exclusiva es de...",
      "answers":[
         {
            "text":"el Estado.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"las comunidades autónomas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los ayuntamientos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1099",
      "questionText":" El desarrollo económico de una comunidad autónoma es competencia... de dicha comunidad, de acuerdo con la política económica nacional.",
      "answers":[
         {
            "text":"compartida.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"exclusiva.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"tutelada.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1100",
      "questionText":" El Ayuntamiento está formado por el alcalde y...",
      "answers":[
         {
            "text":"los concejales.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los diputados.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los senadores.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1101",
      "questionText":" ¿Quiénes forman parte del órgano ejecutivo de las comunidades autónomas? ",
      "answers":[
         {
            "text":"El presidente y los ministros.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el alcalde y los concejales ",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el presidente y los consejeros.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1102",
      "questionText":" ¿Cómo se llaman los órganos de gobierno de las islas de la comunidad autónoma Canarias? ",
      "answers":[
         {
            "text":"Cabildos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Consejos Insulares.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Diputaciones.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1103",
      "questionText":" ¿Cómo se llaman los órganos de gobierno de las islas de la comunidad autónoma Islas Baleares? ",
      "answers":[
         {
            "text":"Cabildos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Consejos Insulares.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Diputaciones.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1104",
      "questionText":" ¿Cómo se llaman los órganos de gobierno de las provincias españolas? ",
      "answers":[
         {
            "text":"Cabildos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Consejos Insulares.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Diputaciones.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1105",
      "questionText":" Las normas sobre derechos fundamentales y libertades reconocidas por la Constitución se interpretan de acuerdo con los tratados internacionales que haya firmado España al respecto y con...",
      "answers":[
         {
            "text":"la Declaración Universal de Derechos Humanos.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el Tratado de la Unión Europea.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"la Conferencia de Derecho Internacional Privado.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1106",
      "questionText":" Los españoles son mayores de edad a los...",
      "answers":[
         {
            "text":"16 años.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"18 años.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"21 años.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1107",
      "questionText":" La Constitución establece que en España no hay... estatal.",
      "answers":[
         {
            "text":"ideología.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"religión.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"filosofía.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1108",
      "questionText":" En España la enseñanza básica es...",
      "answers":[
         {
            "text":"voluntaria y gratuita.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"obligatoria y gratuita.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"obligatoria y de pago.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1109",
      "questionText":" La Educación Secundaria Obligatoria (ESO) generalmente se desarrolla en España entre: ",
      "answers":[
         {
            "text":"los 10 y los 14 años.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los 12 y los 16 años.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los 14 y los 18 años.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1110",
      "questionText":" Los españoles pueden votar a partir de los...",
      "answers":[
         {
            "text":"16 años.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"18 años.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"21 años.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1111",
      "questionText":" Los ciudadanos de la UE y de algunos países con acuerdos de reciprocidad, residentes en España, pueden votar en las elecciones...",
      "answers":[
         {
            "text":"locales.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"autonómicas.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"generales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1112",
      "questionText":" Los concejales de los ayuntamientos son elegidos por...",
      "answers":[
         {
            "text":"los vecinos del municipio.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"los alcaldes.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"los representantes Provinciales.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1113",
      "questionText":" Los españoles que residen fuera de España pueden solicitar su voto...",
      "answers":[
         {
            "text":"por correo postal, por fax y por Internet.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"por correo postal, por teléfono y por Internet.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"por correo postal, por por fax y por teléfono.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1114",
      "questionText":" El organismo que elabora el censo electoral en España es el...",
      "answers":[
         {
            "text":"BOE.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"INE.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"PAE.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1115",
      "questionText":" El número de formaciones políticas en el año 2015 registradas en España es de cerca de...",
      "answers":[
         {
            "text":"2700.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"3700.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"4700.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1116",
      "questionText":" ¿Cuál de estas opciones no es un partido político? ",
      "answers":[
         {
            "text":"PIB.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"PP.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"PSOE.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1117",
      "questionText":" ¿Cuál de estas tres agrupaciones puede presentar candidatos a las elecciones en España? ",
      "answers":[
         {
            "text":"Agrupaciones de concejales.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Agrupaciones de electores.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Agrupaciones de vecinos.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1118",
      "questionText":" La organización que defiende y promueve los intereses de los trabajadores se denomina...",
      "answers":[
         {
            "text":"asociación.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"partido.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"sindicato.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1119",
      "questionText":" La primera asociación obrera que se creó en España en 1840 fue en...",
      "answers":[
         {
            "text":"Barcelona.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Madrid.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Valencia.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"1120",
      "questionText":" ¿Cuál de estas tres opciones es un sindicato con representación en el Consejo Económico y Social? ",
      "answers":[
         {
            "text":"UGT.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"UNT.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"USO.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"2001",
      "questionText":" Los españoles tienen los mismos derechos fundamentales en cualquier parte del territorio del Estado.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2002",
      "questionText":" Los extranjeros en España tienen los mismos derechos que los españoles, aunque España no haya firmado tratados específicos al respecto con su país de origen.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2003",
      "questionText":" Se puede obligar a alguien a declarar su ideología, religión o creencias.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2004",
      "questionText":" Todos los ciudadanos tienen derecho a expresar y difundir libremente sus pensamientos, ideas y opiniones.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2005",
      "questionText":" En la Constitución no se habla del derecho a comunicar o recibir libremente información veraz por cualquier medio de difusión.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2006",
      "questionText":" Los españoles tienen derecho a elegir libremente su residencia y a circular libremente por el territorio nacional.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2007",
      "questionText":" En España las fuerzas de seguridad pueden entrar a un domicilio privado sin resolución judicial en cualquier momento.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2008",
      "questionText":" Se garantiza el secreto de las comunicaciones de los españoles, salvo resolución judicial.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2009",
      "questionText":" Las personas físicas no pueden crear centros docentes.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2010",
      "questionText":" Se reconoce la autonomía de las Universidades en los términos que establezca la ley.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2011",
      "questionText":" La enseñanza básica (Primaria y Secundaria, de 6 a 16 años) es obligatoria y gratuita.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2012",
      "questionText":" En España solo la educación primaria es obligatoria.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2013",
      "questionText":" Los profesores, los padres y los alumnos intervienen en el control y gestión de los centros sostenidos por la Administración con fondos públicos.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2014",
      "questionText":" En la Constitución española no se reconoce el derecho a la libertad de enseñanza.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2015",
      "questionText":" Los poderes públicos tienen obligación de fomentar la educación sanitaria, la educación física y el deporte.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2016",
      "questionText":" Los poderes públicos inspección y homologan el sistema educativo para garantizar el cumplimiento de las leyes.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2017",
      "questionText":" Los ciudadanos tienen derecho a la producción y creación literaria, artística, científica y técnica.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2018",
      "questionText":" En España no se regulan mediante ley las causas de separación y disolución matrimonial.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2019",
      "questionText":" Es obligatorio cumplir las sentencias de los jueces y tribunales.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2020",
      "questionText":" Se puede ser condenado o sancionado por acciones u omisiones que en el momento de producirse no constituían delito.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2021",
      "questionText":" Es obligatorio colaborar en un juicio, cuando así lo piden los jueces y tribunales.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2022",
      "questionText":" Las penas de cárcel y las medidas de seguridad están orientadas en España hacia la reeducación y reinserción social.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2023",
      "questionText":" Los ciudadanos españoles tienen derecho a acceder a las funciones y cargos públicos.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2024",
      "questionText":" Los ciudadanos tienen derecho a participar en los asuntos públicos, directamente o por medio de representantes, libremente elegidos en las elecciones.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2025",
      "questionText":" En España no está reconocido el derecho de asociación.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2026",
      "questionText":" En caso de huelga, la ley no garantiza el mantenimiento de los servicios esenciales de la comunidad.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2027",
      "questionText":" Todos deben contribuir al sostenimiento de los gastos públicos de acuerdo con su capacidad económica.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2028",
      "questionText":" Los poderes públicos mantendrán un régimen público de Seguridad Social para todos los ciudadanos.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2029",
      "questionText":" Todos tienen derecho a disfrutar de un medio ambiente adecuado para el desarrollo de la persona, así como el deber de conservarlo.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2030",
      "questionText":" Los poderes públicos pueden organizar y garantizar la salud pública, si disponen de recursos.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2031",
      "questionText":" Los poderes públicos pueden promover la participación de la juventud en el desarrollo político, social, económico y cultural, si así lo desean.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2032",
      "questionText":" Los poderes públicos garantizarán la defensa de los consumidores y usuarios, protegiendo la seguridad, la salud y los intereses económicos de los mismos.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2033",
      "questionText":" Los poderes públicos pueden planificar y ejecutar los recursos públicos con total libertad y sin ningún tipo de criterio de gestión.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2034",
      "questionText":" Los derechos fundamentales y libertades de la Constitución se interpretan en relación con otros acuerdos internacionales que haya firmado España en esas materias.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2035",
      "questionText":" Todos los españoles tienen el derecho y el deber de defender España.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"2036",
      "questionText":" En caso de grave riesgo o catástrofe pública para los ciudadanos españoles pueden ayudar si quieren.",
      "answers":[
         {
            "text":"Verdadero.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Falso.",
            "value":"2",
            "id":"1"
         },

      ]
   },
   {
      "questionId":"3001",
      "questionText":" ¿Qué comunidad autónoma forman Alicante, Castellón y Valencia? ",
      "answers":[
         {
            "text":"Principado de Asturias.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Andalucía.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Comunidad Valenciana.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3002",
      "questionText":" La capital de la comunidad autónoma de Cantabria es...",
      "answers":[
         {
            "text":"Oviedo.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Palma de Mallorca.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Santander.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3003",
      "questionText":" ¿En qué comunidad autónoma están las islas de Mallorca, Menorca e Ibiza? ",
      "answers":[
         {
            "text":"Canarias.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Islas Baleares.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Islas Cíes.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3004",
      "questionText":" ¿En qué comunidad autónoma se encuentra la ciudad de Pamplona? ",
      "answers":[
         {
            "text":"Comunidad de Aragón.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Comunidad de Madrid.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Comunidad Foral de Navarra.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3005",
      "questionText":" ¿Cuál de estas provincias no está en la comunidad autónoma de Galicia? ",
      "answers":[
         {
            "text":"A Coruña.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Cáceres.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Pontevedra.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3006",
      "questionText":" ¿Cuántas comunidades autónomas hay en España? ",
      "answers":[
         {
            "text":"7.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"17.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"27.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3007",
      "questionText":" ¿De qué comunidad autónoma es capital Sevilla? ",
      "answers":[
         {
            "text":"Andalucía.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Extremadura.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Galicia.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3008",
      "questionText":" Barcelona es la capital de la comunidad autónoma de...",
      "answers":[
         {
            "text":"Comunidad Valenciana.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Cataluña.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Cantabria.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3009",
      "questionText":" La comunidad canaria tiene dos capitales: Las Palmas de Gran Canaria y...",
      "answers":[
         {
            "text":"Santa Cruz de la Palma.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Palma de Mallorca.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Santa Cruz de Tenerife.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3010",
      "questionText":" ¿Cuántas provincias componen la comunidad autónoma de Extremadura? ",
      "answers":[
         {
            "text":"2.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"3.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"4.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3011",
      "questionText":" ¿De qué comunidad autónoma es capital Valladolid? ",
      "answers":[
         {
            "text":"Canarias.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Castilla y León.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Castilla-La Mancha.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3012",
      "questionText":" Huesca, Teruel y Zaragoza forman parte de la comunidad autónoma de...",
      "answers":[
         {
            "text":"Cataluña.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"País Vasco.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Aragón.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3013",
      "questionText":" ¿En qué comunidad autónoma se encuentra la ciudad de Logroño? ",
      "answers":[
         {
            "text":"La Rioja.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Castilla y León.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"País Vasco.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3014",
      "questionText":" ¿Cuál es la sede de las instituciones de la comunidad autónoma del País Vasco? ",
      "answers":[
         {
            "text":"Bilbao.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Vitoria-Gasteiz.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"San Sebastián.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3015",
      "questionText":" La capital de Castilla-La Mancha es...",
      "answers":[
         {
            "text":"Ciudad Real.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Toledo.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Guadalajara.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3016",
      "questionText":" En la costa norte de África se encuentran las ciudades autónomas de Ceuta y...",
      "answers":[
         {
            "text":"Almería.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"Melilla.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"Cádiz.",
            "value":"1",
            "id":"2"
         }
      ]
   },
   {
      "questionId":"3017",
      "questionText":" El Principado de Asturias limita al Norte con...",
      "answers":[
         {
            "text":"el océano Atlántico.",
            "value":"0",
            "id":"0"
         },
         {
            "text":"el mar Mediterráneo.",
            "value":"2",
            "id":"1"
         },
         {
            "text":"el mar Cantábrico",
            "value":"1",
            "id":"2"
         }
      ]
   },

  {
    "questionId": "1",
    "questionText": "Los proyectos de ley son aprobados por...",
    "answers": [
      {
        "text": "el presidente del Gobierno",
        "value": "1",
        "id":"0"

      },
      {
        "text": "el Consejo de Ministros",
        "value": "2",
        "id":"1"

      },
      {
        "text": "el Congreso de los Diputados",
        "value": "0",
        "id":"2"

      }
    ]
  },
  {
    "questionId": "2",
    "questionText": "En caso de grave riesgo o catástrofe pública para los ciudadanos españoles pueden ayudar si quieren.",
    "answers": [
      {
        "text": "Verdadero",
        "value": "1",
        "id":"0"

      },
      {
        "text": "Falso",
        "value": "2",
        "id":"1"

      }
    ]
  },
  {
    "questionId": "3",
    "questionText": "Es obligatorio cumplir las sentencias de los jueces y tribunales.",
    "answers": [
      {
        "text": "Verdadero",
        "value": "2",
        "id":"0"

      },
      {
        "text": "Falso",
        "value": "0",
        "id":"1"

      }
    ]
  },
  {
    "questionId": "4",
    "questionText": "Para hacer Formación Profesional Básica es necesario...",
    "answers": [
      {
        "text": "haber pasado un año en el extranjero.",
        "value": "1",
        "id":"0"

      },
      {
        "text": "haber completado el Bachillerato.",
        "value": "0",
        "id":"1"

      },
      {
        "text": "haber cumplido 15 años.",
        "value": "2",
        "id":"2"

      }
    ]
  },
  {
    "questionId": "5",
    "questionText": "El 6 de diciembre se celebra en España...",
    "answers": [
      {
        "text": "la llegada de Colón a América",
        "value": "1",
        "id":"0"

      },
      {
        "text": "el Día del Libro",
        "value": "0",
        "id":"1"

      },
      {
        "text": "el Día de la Constitución",
        "value": "2",
        "id":"2"

      }
    ]
  }
];
