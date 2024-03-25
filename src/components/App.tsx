import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Action {
  title: string;
  input: string[];
}
enum Result {
  WIN = "Nice!",
  LOOSE = "Nope...",
}

interface Input {
  userInput: string;
}

const listAction: Action[] = [
  { title: "Save", input: [":w"] },
  { title: "Save and close", input: [":wq", ":x"] },
  { title: "Save all", input: [":wa"] },
  { title: "Save and close all", input: [":wqa", ":xa"] },
];

const generateRandomAction = () => {
  const numActions = listAction.length;
  const selected = Math.floor(Math.random() * numActions);
  return listAction[selected];
};

function App() {
  const [currentAction, setCurrentAction] = useState<Action>(
    generateRandomAction(),
  );
  const [result, setResult] = useState<Result>();
  const [points, setPoints] = useState<number>(0);

  const { register, handleSubmit, resetField } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => {
    if (currentAction.input.includes(data.userInput)) {
      setResult(Result.WIN);
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
    }
  };

  return (
    <>
      <p>Streak : {points}</p>
      {currentAction.title}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("userInput")} autoFocus/>
      </form>
      {result}
    </>
  );
}

export default App;
