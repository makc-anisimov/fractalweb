import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

type TQueryParams = {
  type: string;
  name: string;
};

function App() {
  // ---------------- api для работы с сервером---------------
  const instance = axios.create({
    baseURL: "https://api.github.com/",
  });

  const getInformation = ({ name, type }: TQueryParams) => {
    return instance.get(`${type}/${name}`);
  };

  // -------------

  const [inputValue, setInputValue] = useState("");
  const [selectType, setSelectType] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isShowResult, setIsShowResult] = useState(false);
  const [isShowError, setIsShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [name, setName] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (inputValue.length > 0 && selectType.length > 0)
      setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [selectType, inputValue]);

  const hideResultError = () => {
    if (isShowResult) setIsShowResult(false);
    if (isShowError) setIsShowError(false);
  };

  const handleChangeSelect = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    evt.preventDefault();
    hideResultError();
    setSelectType(evt.target.value);
  };

  const handleChangeInput = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    evt.preventDefault();
    hideResultError();
    setInputValue(evt.target.value);
  };

  const handleSubmitForm = (evt: React.ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsButtonDisabled(true);
    getInformation({
      name: inputValue,
      type: selectType,
    })
      .then((res) => {
        if (selectType === "users") {
          if (res.data.type === "User") {
            setCount(res.data.public_repos);
            setName(res.data.name);
            setIsShowResult(true);
          } else {
            setErrorText("Not found...");
            setIsShowError(true);
          }
        } else if (selectType === "repos") {
          if (res.data.owner.type === "Organization") {
            setCount(res.data.stargazers_count);
            setName(res.data.full_name);
            setIsShowResult(true);
          } else {
            setErrorText("Not found...");
            setIsShowError(true);
          }
        } else {
          setErrorText("Not found...");
          setIsShowError(true);
        }
        // console.log(res.data.owner.type);
      })
      .catch((err) => {
        setErrorText("Not found...");
        setIsShowError(true);
        console.log("Error", err.message);
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  return (
    <>
      <h2>Тестовое задание</h2>
      <form className="form" onSubmit={handleSubmitForm}>
        <select
          required
          name="select"
          className="select"
          onChange={handleChangeSelect}
          defaultValue={"- select type -"}
        >
          <option disabled>- select type -</option>
          <option value="users" className="option">
            user
          </option>
          <option value="repos" className="option">
            repo
          </option>
        </select>
        <input
          type="text"
          className="input"
          onChange={handleChangeInput}
          value={inputValue}
        />
        <button className="button" type="submit" disabled={isButtonDisabled}>
          Получить данные
        </button>
      </form>
      {isShowResult &&
        (selectType === "users" ? (
          <>
            <span className="resultText">Full name: {name}</span>
            <br />
            <span className="resultText">Count public repos: {count}</span>
          </>
        ) : (
          <>
            <span className="resultText">Repository name: {name}</span>
            <br />
            <span className="resultText">Stars count: {count}</span>
          </>
        ))}
      {isShowError && <h3 className="error">{errorText}</h3>}
    </>
  );
}

export default App;
