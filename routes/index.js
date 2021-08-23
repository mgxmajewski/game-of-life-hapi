'use strict';
const joi = require('joi');
const axios = require('axios');

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

async function stateProcessor ()  {
    return await axios(config)
        .then((stateFromGql) => {
            const states = stateFromGql.data.data.states
            const lastIndex = states.length - 1
            // console.log(states[lastIndex].grid)
            return states[lastIndex].grid
        })
        .then((d) => `${d}`)
        .then((d) => console.log(d))
        .catch(function (error) {
            console.log(error);
        })
}


// Create hook to capture param from request to control interval timeout
function timeOutState(initial){
    let timeout = initial
    return [() => timeout, (v) => {
        timeout = v
    }]
}
const [timeoutGetter, timeoutSetter] = timeOutState(3000)

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
