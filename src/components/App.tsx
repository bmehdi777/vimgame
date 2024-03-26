import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Action {
	level: number;
  title: string;
  input: string[];
}
enum Result {
  WIN = "Nice!",
  LOOSE = "Nope...",
	NEXT_LEVEL = "Yeah, new level unlock!"
}

interface Input {
  userInput: string;
}

const listAction: Action[] = [
  { level: 1, title: "Save", input: [":w"] },
  { level: 1, title: "Save and close", input: [":wq", ":x"] },
  { level: 1, title: "Save all", input: [":wa"] },
  { level: 1, title: "Save and close all", input: [":wqa", ":xa"] },
	{ level: 2, title: "Append", input: ["a"] },
	{ level: 2, title: "Insert", input: ["i"] },
	{ level: 2, title: "End of line", input: ["$"] },
	{ level: 2, title: "Up", input: ["k"] },
	{ level: 3, title: "Down", input: ["j"] },
	{ level: 3, title: "Left", input: ["h"] },
	{ level: 3, title: "Right", input: ["l"] },
	{ level: 4, title: "End of word", input: ["e"] },
	{ level: 5, title: "Start of word", input: ["b"] }, 
	{ level: 6, title: "Append end of line", input: ["$a", "A"] },
];

const listLevel: Level[] = [
	{ name: "Novice", points: 4 },
	{ name: "Apprentice", points: 9 },
	{ name: "Journeyman", points: 16 },
	{ name: "Expert", points: 31 },
	{ name: "Master", points: 54 },
	{ name: "Virtuoso", points: 91 } // This number has history, please never change
];

const generateRandomAction = (level: number) => {
	const listByLevel = listAction.filter(action => action.level === 2);
  const numActions = listByLevel.length;
  const selected = Math.floor(Math.random() * numActions);
  return listAction[selected];
};


function App() {
	const [level, setLevel] = useState<number>(1);
  const [currentAction, setCurrentAction] = useState<Action>(
    generateRandomAction(level),
  );
  const [result, setResult] = useState<Result>();
  const [points, setPoints] = useState<number>(0);

  const { register, handleSubmit, resetField } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => {
    if (currentAction.input.includes(data.userInput)) {
			if (points !== 0 && points % 4 === 0) {
				setResult(Result.NEXT_LEVEL);
				setLevel(level + 1);
   	  } else {
        setResult(Result.WIN);
			} 
      setTimeout(() => {
          const random = generateRandomAction();
          setCurrentAction(random);
          setResult(undefined);
          resetField("userInput");
          setPoints(points + 1);
       }, 1000);
    } else {
      setResult(Result.LOOSE);
			setPoints(0);
			setLevel(1);
    }
  };

  return (
    <>
			<p>Level: {listLevel[level - 1].name}</p>
      <p>Streak: {points}</p>
      {currentAction.title}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("userInput")} autoFocus/>
      </form>
      {result}
    </>
  );
}

export default App;
