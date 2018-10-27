import React, {
  PropTypes,
} from 'react';




import RaisedButton  from 'material-ui/RaisedButton';
import {Card, CardActions,  CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FinishIcon from 'material-ui/svg-icons/action/done';


export default class BlocksTestOptions extends React.Component {
  render() {
const { handleStartTest } = this.props;
    return (
      <div className="cardsContainer">
          <Card className="sector">
              <CardTitle title="Contrarreloj" className="cardTitleContent" subtitle="Tiempo limitado" titleColor="white" subtitleColor="whiteSmoke" />
              <CardMedia className="cardMediaContent">
                  <FinishIcon />
              </CardMedia>
              <CardText className="cardTextContent">
                  Contesta todas las preguntas que puedas en 5 minutos. ¡Rápido!
              </CardText>
              <CardActions>
                  <RaisedButton  label="Próximamente" primary={true}  disabled onClick={handleStartTest} />
              </CardActions>
          </Card>

          <Card className="sector">
              <CardTitle title="Tradicional" className="cardTitleContent" subtitle="Simulacro de examen" titleColor="white" subtitleColor="whiteSmoke" />
              <CardMedia className="cardMediaContent">
                  <FinishIcon />
              </CardMedia>
              <CardText className="cardTextContent">
                  Prueba tus conocimientos con un test normal. Tienes 45 minutos para contestar las preguntas. ¡Suerte!
              </CardText>
              <CardActions>
                  <RaisedButton  label="Empezar Test" primary={true}  onClick={handleStartTest} />
              </CardActions>
          </Card>

          <Card className="sector">
              <CardTitle title="Repaso" className="cardTitleContent" subtitle="Test de errores" titleColor="white" subtitleColor="whiteSmoke" />
              <CardMedia className="cardMediaContent">
                  <FinishIcon />
              </CardMedia>
              <CardText className="cardTextContent">
                  Responde las preguntas que has fallado en test anteriores, sin limites de tiempo. ¿Preparado?
              </CardText>
              <CardActions>
                  <RaisedButton  label="Próximamente" primary={true} disabled onClick={handleStartTest} />
              </CardActions>
          </Card>
      </div>
    );
  }
}

BlocksTestOptions.propTypes = {
  handleStartTest:PropTypes.func.isRequired
};
