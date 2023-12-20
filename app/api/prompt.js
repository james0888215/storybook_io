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
    const completion = await openai.chat.completions.create({
      model: "text-davinci-003",
      prompt: generatePrompt(word),
      temperature: 0.5,
      max_tokens: 3000,
    });

    return completion.data.choices[0].text;
  } catch (error) {
    return Promise.reject({ error });
  }
}

// generate prompt for openai with user input
function generatePrompt(word) {
  return `Define the word ${word}. Then give me an example of its use in a sentence. Use proper grammar and punctuation. 
  
  Return in json format like: {"definition": "<definition>", "example": "<example>"}`;
}
