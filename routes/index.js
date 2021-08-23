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

const axiosGql = () =>
    axios(config)
    .then(function (response) {
        const states = response.data.data.states
        const lastIndex = states.length-1
        return states[lastIndex].grid
    })
    .then(
        (d)=> console.log(`${d}`)
    )
    .catch(function (error) {
        console.log(error);
    })

const giveState = () => axiosGql()

const qclState = {
    handler: async function (request, h) {
        const timeOutParam = request.params.timeout
        timeoutSetter(timeOutParam)
        updateInterval()
        return 'success'
    }
};

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
        interval = setInterval(giveState, timeOut);
    }
}

exports.configureRoutes = (server) => {
    return server.route([
        {
            method:'POST',
            path: '/state/{timeout}',
            config: qclState
        }
    ])}
