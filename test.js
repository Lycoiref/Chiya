const axios = require('axios')
async function askChatGPT(requestMessage) {
  try {
    let params = {
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      temperature: 0.5,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
      messages: requestMessage,
    }
    let response = await fetch(
      'https://api.openai-proxy.com/v1/chat/completions', {
      method: "POST",
      body: JSON.stringify({
        ...params
      }),
      headers: {
        Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    return response.json()
  } catch (e) {
    console.log('error', e)
    return e
  }
}

askChatGPT([{ "role": 'system', 'content': 'you are helpful useful a AI' }, { "role": 'user', 'content': '你好啊！' }]).then((response) => {
  console.log(response)
})