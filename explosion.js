// import axios from 'axios'
const axios = require('axios')
async function getExplosion() {
  let response = await axios({
    url: 'http://124.221.89.187:3000/imgs/random',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(response.data)
}
// getExplosion()
; (async () => {
  await getExplosion()
  // console.log('getExplosion')
})()