import { useEffect } from "react"
import apiClient from "../api/api"

type Score = {
  playerId: number,
  guess: number
}
type Props = {
  answer: number,
  winner: string,
  blueTeamScore: Score[],
  redTeamScore: Score[],
  totalBlueTeamScore: number,
  totalRedTeamScore: number
}

const Result = (props : Props) => {
  
  const matchId = localStorage.getItem("matchId");


  // when load the result page read the result from the server by matchId
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await apiClient.post("/match/get-result", { matchId });
        const result = response.data;
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResult();
  }, [matchId]);
  return (
    <div>
      <h1>Result</h1>
      <h2>Correct Answer is {props.answer}</h2>
      <h2>Winner is {props.winner}</h2>
      <h2>Blue Team Score is {props.totalBlueTeamScore}</h2>
      {/* print all blue team scores */}
      {props.blueTeamScore.map((score) => (
        <div key={score.playerId}>
          <p>Player {score.playerId} guessed {score.guess}</p>
        </div>
      ))}
      <h2>Red Team Score is {props.totalRedTeamScore}</h2>
      {/* print all red team scores */}
      {props.redTeamScore.map((score) => (
        <div key={score.playerId}>
          <p>Player {score.playerId} guessed {score.guess}</p>
        </div>
      ))}
    </div>
  )
}

export default Result