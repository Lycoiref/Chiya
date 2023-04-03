const { Configuration, OpenAIApi } = require('openai')

const model = 'gpt-3.5-turbo';

function getOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  return openai;
}


function getCompletion(messages) {
  return {
    model: model,
    messages: messages,
    temperature: 0.5,
    max_tokens: 1024,
    presence_penalty: 0.6,
    frequency_penalty: 0.5,
  }
}

export async function askChatGPT(requestMessage) {
  const completion = await getOpenAI().createChatCompletion(
    getCompletion(requestMessage),
    // {...getOptions()}
    {
      "headers": {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY // 这边填写你的API Key
      },
      "proxy": {
        "host": '127.0.0.1',
        "port": 7890,
        "protocol": 'http'
      }
    }
  );
  return completion.data.choices[0].message.content;
}