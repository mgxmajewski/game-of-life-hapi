'use strict';
const joi = require('joi');
const axios = require('axios');

const hello = {
    handler: function (request, h) {
        return 'Hello World!';
    }
};

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

const axiosGql = () => axios(config)
    .then(function (response) {
        const states = response.data.data.states
        const lastIndex = states.length-1
        const theNewestState = states[lastIndex].grid
        console.log(theNewestState)
        return theNewestState
    })
    .catch(function (error) {
        console.log(error);
    })

const giveState = () => new Promise((resolve, reject) =>{
    resolve(axiosGql())
    reject('giveState promise rejected')
})

const qclState = {
    handler: async function (request, h) {
        const timeOutParam = request.params.timeout
        timeoutSetter(timeOutParam)
        return await giveState()
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

exports.configureRoutes = (server) => {
    return server.route([
        {
            method: 'GET',
            path: '/',
            config: hello
        },
        {
            method:'POST',
            path: '/state/{timeout}',
            config: qclState
        }
    ])}
