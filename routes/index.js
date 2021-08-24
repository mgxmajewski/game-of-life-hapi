'use strict';
const joi = require('joi');
const axios = require('axios');
const { useState } = require('../helpers/useState');
const { getLongestRow } = require("../helpers/getLongestRow");
const { GameOfLife } = require("../helpers/game_of_life_core/gameOfLife");


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
    return states[lastIndex].grid
})

const parseGrid = ((parsedAxiosData) => {
    const rows = parsedAxiosData.length
    const maxColumns = getLongestRow(parsedAxiosData)
    let aliveCellArray = {
        size: [rows, maxColumns],
        cells : []
    }
    for (let row = 0; row<rows; row++){
        const columns = parsedAxiosData[row].length
        for (let col = 0; col<columns; col++){
            const currentCell = parsedAxiosData[row][col]
            if( currentCell === '#'){
                let coords;
                coords = [row, col];
                aliveCellArray.cells.push(coords)
            }
        }
    }
    return aliveCellArray
})


const renderNextFrame = ((parsedGrid) => {
    const rows = parsedGrid.size[0]
    const columns = parsedGrid.size[1]
    const state = parsedGrid.cells
    const grid = new GameOfLife(rows, columns, state)
    grid.initiateLife = state
    grid.updateGrid()
    return grid.cellGrid.gridView
})

async function stateProcessor ()  {
    try {
        const FetchedFromAxios = await axios(config)
        const currentGrid = await parseFetchedData(FetchedFromAxios)
        const parsedGrid = parseGrid(currentGrid)
        const nextFrame = renderNextFrame(parsedGrid)
        console.log(currentGrid)
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
