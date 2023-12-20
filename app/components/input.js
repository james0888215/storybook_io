import { useEffect, useState } from "react";
import "regenerator-runtime";
import submitPrompt from "../api/prompt";
import DOMPurify from "dompurify";
import { PropagateLoader } from "react-spinners";
import Response from "./response";

function Input() {
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState("");
  const [speechInput, setSpeechInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const genericError = "Something went wrong :(<br/>Please try again.";


  useEffect(() => {
    setIsReady(true);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setResponse("");
    setIsLoading(true);
    setError("");

    // submit openai prompt
    try {
      const response = await submitPrompt(speechInput);
      const formattedResult = JSON.parse(response.replace(/\n/g, ""));
      setResponse(formattedResult);
      setIsLoading(false);
    } catch (error) {
      console.log(error, "error")
      setError(error.message || genericError);
      setIsLoading(false);
    }
  }

  function reset() {
    setQuery("");
    setResponse("");
    setError("");
  }

  if (!isReady) {
    return null;
  }

  return (
    <div className="input-component">
      <h2>
        Enter your childs name,
        <br />
        and put them at the heart of a story 🦸
      </h2>

      {/* form */}
      <form onSubmit={onSubmit}>
        <div className="buttons">

          {/* reset button */}
          <div className="button-container">
            <button type="button" tabIndex="-1" onClick={reset} disabled={!speechInput}>
              Reset
            </button>
          </div>
        </div>

        <div className="input-container">
          {/* word input */}
          <input
            tabIndex="1"
            type="text"
            className="word-input"
            value={speechInput}
            placeholder="Kids Name"
            onChange={(e) => setSpeechInput(e.target.value)}
          />

          {/* submit button */}
          <button
            type="submit"
            className="submit-btn"
            onClick={onSubmit}
            disabled={isLoading || !speechInput}
          >
            enter
          </button>

          {/* error message */}
          {error && (
            <div
              className="error"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(error),
              }}
            ></div>
          )}
        </div>
      </form>

      {/* loader */}
      {isLoading && <PropagateLoader color="#005277" className="loader" />}

      {/* response */}
      {response && <Response data={response} query={query} />}
    </div>
  );
}

// Export the component
export default Input;
