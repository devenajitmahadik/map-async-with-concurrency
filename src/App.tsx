import React, { useState } from "react";
import mapAsyncWithConcurrency from "./utils/mapAsyncWithConcurrency";
import './App.scss';

const App = () => {
  const [inputValues, setInputValues] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues(e.target.value);
    setResults([]);
  };

  const handleSubmit = async () => {
    if (inputValues.trim() === "") {
      return;
    }

    const values = inputValues.split(",").map((value) => value.trim());

    setIsLoading(true);

    try {
      const mappedResults = await mapAsyncWithConcurrency(
        values,
        async (value: string) => {
          // Simulate an asynchronous operation (e.g., API call)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Multiplying the value by 2
          return `${value} * 2 = ${Number(value) * 2}`;
        },
        2 // Concurrency limit
      );

      setResults(mappedResults);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h2 data-testid="heading">Enter the numbers that you wish to double!</h2>
        <div className="input-wrapper">
          <input
            data-testid="input"
            type="text"
            value={inputValues}
            onChange={handleInputChange}
            placeholder="Enter numbers (comma-separated)"
          />
        </div>
        <div className="submit-button-wrapper">
          <button data-testid="submit-button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
        <div className="result-list">
          {results.map((result, index) => (
            <div key={index} data-testid={"result-row-"+index} className="result-row">{result}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;