'use strict';
const joi = require('joi');
const axios = require('axios');
const { useState } = require('../helpers/useState')

const data = JSON.stringify({
    query: `query {
  states{
    grid
  } 
}`,
    variables: {}
});

const config = {
    method: 'post',
    url: 'http://localhost:4000/',
    headers: {
        'Content-Type': 'application/json'
    },
    data : data
};

const parseFetchedData = ((FetchedFromAxios) => {
    const states = FetchedFromAxios.data.data.states
    const lastIndex = states.length - 1
    console.log(states[lastIndex].grid)
    return states[lastIndex].grid
})

const renderNextFrame = ((parsedFetched) =>{
    return `${parsedFetched}`
})

async function stateProcessor ()  {
    try{
        const FetchedFromAxios = await axios(config)
        const parsedAxiosData = await parseFetchedData(FetchedFromAxios)
        const nextFrame = renderNextFrame(parsedAxiosData)
        console.log(nextFrame)
        return nextFrame
    } catch(error) {
        console.log(new Error(error))
    }
}


// Create hook to capture param from request to control interval timeout

const [timeoutGetter, timeoutSetter] = useState(3000)

// Create mutable interval capturing grid state in timeout interval given via request
let interval
function updateInterval () {
    const timeOut = timeoutGetter()
    clearInterval(interval)
    if (timeOut !== '101') {
        interval = setInterval(stateProcessor, timeOut);
    }
}

const qclState = {
    handler: function (request, h) {
        const timeOutParam = request.params.timeout
        timeoutSetter(timeOutParam)
        updateInterval()
        console.log(h.request.params.timeout)
        return 'success'
    }
};

exports.configureRoutes = (server) => {
    return server.route([
        {
            method:'POST',
            path: '/state/{timeout}',
            config: qclState
        }
    ])}
