import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Action {
  level: number;
  title: string;
  input: string[];
}
interface Level {
  name: string;
  points: number;
}
enum Result {
  WIN = "Nice!",
  LOOSE = "Nope...",
  NEXT_LEVEL = "Yeah, new level unlock!",
}

interface Input {
  userInput: string;
}

const listAction: Action[] = [
  { level: 0, title: "Save", input: [":w"] },
  { level: 0, title: "Save and close", input: [":wq", ":x"] },
  { level: 0, title: "Save all", input: [":wa"] },
  { level: 0, title: "Save and close all", input: [":wqa", ":xa"] },
  { level: 1, title: "Append", input: ["a"] },
  { level: 1, title: "Insert", input: ["i"] },
  { level: 1, title: "End of line", input: ["$"] },
  { level: 1, title: "Up", input: ["k"] },
  { level: 2, title: "Down", input: ["j"] },
  { level: 2, title: "Left", input: ["h"] },
  { level: 2, title: "Right", input: ["l"] },
  { level: 3, title: "End of word", input: ["e"] },
  { level: 4, title: "Start of word", input: ["b"] },
  { level: 5, title: "Append end of line", input: ["$a", "A"] },
];

const listLevel: Level[] = [
  { name: "Novice", points: -1 },
  { name: "Apprentice", points: 9 },
  { name: "Journeyman", points: 16 },
  { name: "Expert", points: 31 },
  { name: "Master", points: 54 },
  { name: "Virtuoso", points: 91 }, // This number has history, please never change
];

const generateRandomAction = (level: number) => {
  const listByLevel = listAction.filter((action) => action.level === level);
  const numActions = listByLevel.length;
  const selected = Math.floor(Math.random() * numActions);
  return listByLevel[selected];
};

function App() {
	const MAX_POINTS = 91;
  const [level, setLevel] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<Action>(
    generateRandomAction(level)
  );
  const [result, setResult] = useState<Result>();
  const [points, setPoints] = useState<number>(0);

  const { register, handleSubmit, resetField } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => {
    if (currentAction.input.includes(data.userInput)) {
			let nextLevel = level; 
      if (points <= MAX_POINTS && points === listLevel[level + 1].points) {
				nextLevel += 1;
        setResult(Result.NEXT_LEVEL);
        setLevel(nextLevel);
      } else {
        setResult(Result.WIN);
      }
      setTimeout(() => {
        const random = generateRandomAction(nextLevel);
        setCurrentAction(random);
        setResult(undefined);
        resetField("userInput");
        setPoints(points + 1);
      }, 1000);
    } else {
      setResult(Result.LOOSE);
      setPoints(0);
      setLevel(0);
    }
  };

  return (
    <>
      <p>Level: {listLevel[level].name}</p>
      <p>Streak: {points}</p>
      {currentAction.title}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("userInput")} autoFocus />
      </form>
      {result}
    </>
  );
}

export default App;
