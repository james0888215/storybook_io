import DOMPurify from "dompurify";
import OpenAI from "openai";

const openai = new OpenAI({
  // eslint-disable-next-line no-undef
  apiKey: ENV.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default async function submitPrompt(word = "") {
  // check if openai api key is set
  if (!openai.apiKey) {
    return Promise.reject({});
  }

  // sanitize input
  word = DOMPurify.sanitize(word);

  // check if word is empty
  if (word.trim().length === 0) {
    return Promise.reject({ message: "Please enter a valid word" });
  }

  // call openai api with input
  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt : generatePrompt(word),
      temperature: 0.6,
      max_tokens: 400,
      temperature: 0,
      top_p: 1,
      n: 1,
      logprobs: null,
      stop: "{}"
    });
    console.log(completion) 
    return completion.choices[0].text;
  } catch (error) {
    return Promise.reject({ error });
  }
}

// generate prompt for openai with user input
function generatePrompt(word) {
  return `Tell me a short 1 minute kids story with a girl named ${word}. ${word} is a girl and the story should be child friendly and have a happy ending. 
  
  Return text format paragraphed with html syntax`;
}
