import './EndScreen.css'

const EndScreen = ({retry, score}) => {
  return (
    <div>
      <h2>Fim de jogo!</h2>
      <h2>A sua pontuação foi: <span>{score}</span></h2>
      <button onClick={retry}>Resetar jogo</button>
    </div>
  )
}

export default EndScreen