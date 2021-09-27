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

const configGetGrid = {
    method: 'post',
    url: 'http://localhost:4000/',
    headers: {
        'Content-Type': 'application/json'
    },
    data : data
};

const getGridFromFetchedData = ((FetchedFromAxios) => {
    const states = FetchedFromAxios.data.data.states
    const lastIndex = states.length - 1
    return states[lastIndex].grid
})

const parseGrid = ((parsedAxiosData) => {
    const rows = parsedAxiosData.length
    const maxColumns = getLongestRow(parsedAxiosData)
    let lifeInitiationData = {
        size: [maxColumns, rows],
        cells : []
    }
    for (let row = 0; row<rows; row++){
        const columns = parsedAxiosData[row].length
        for (let col = 0; col<columns; col++){
            const currentCell = parsedAxiosData[row][col]
            if( currentCell === '#'){
                let coords;
                // coords as they will be retrieved backwards
                coords = [col, row];
                lifeInitiationData.cells.push(coords)
            }
        }
    }
    return lifeInitiationData
})

const renderNextFrame = ((parsedGrid) => {
    const rows = parsedGrid.size[1]
    const columns = parsedGrid.size[0]
    const aliveCells = parsedGrid.cells
    const grid= InitiateLife(columns, rows, aliveCells)
    grid.updateGrid()
    return grid.cellGrid.gridView
})

const addLastRow = ((parsedGrid) => {
    const rows = parsedGrid.size[1] + 1
    const columns = parsedGrid.size[0]
    const aliveCells = parsedGrid.cells
    const grid= InitiateLife(columns, rows, aliveCells)
    return grid.cellGrid.gridView
})

const addLastColumn = ((parsedGrid) => {
    const rows = parsedGrid.size[1]
    const columns = parsedGrid.size[0] + 1
    const aliveCells = parsedGrid.cells
    const grid= InitiateLife(columns, rows, aliveCells)
    return grid.cellGrid.gridView
})

const InitiateLife = ((columns, rows, aliveCells) =>{
    const grid = new GameOfLife(columns, rows)
    grid.initiateLife = aliveCells
    return grid
})

const gridToPost= ((nextFrame) =>{
    return JSON.stringify({
        query: `mutation ($grid: [[String]]!){
  postState(
    user: "MM", 
    grid: $grid
    )
}`,
        variables: {"grid":nextFrame}
    });
})

const configPostGrid = ((gridToPost) => {
    return {
        method: 'post',
        url: 'http://localhost:4000/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: gridToPost
    }
});

async function stateProcessor ()  {
    try {
        const FetchedFromAxios = await axios(configGetGrid)
        const currentGrid = await getGridFromFetchedData(FetchedFromAxios)
        const parsedGrid = parseGrid(currentGrid)
        const nextFrame = renderNextFrame(parsedGrid)
        const dataToPost = gridToPost(nextFrame)
        const configurationToPostGrid = configPostGrid(dataToPost)
        console.log(currentGrid)
        return axios(configurationToPostGrid)
    } catch(error) {
        console.log(new Error(error))
    }
}

async function sendGrid(grid)  {
    try {
        const dataToPost = gridToPost(grid)
        const configurationToPostGrid = configPostGrid(dataToPost)
        // console.log(configurationToPostGrid)
        return axios(configurationToPostGrid)
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

const handleClickedCell = (grid, cell) => {
    const x = cell[1]
    const y = cell[0]
    // console.log(cell)
    const isAlive = grid[x][y] === "#"
    grid[x][y] = isAlive ? "_" : "#";
    return grid
}


const qclState = {
    auth: 'jwt',
    handler: function (request, h) {
        const timeOutParam = request.params.timeout
        timeoutSetter(timeOutParam)
        updateInterval()
        console.log(h.request.params.timeout)
        return 'success'
    }
};

const stateMutation = {
    auth: 'jwt',
    handler: function (request, h) {
        const payload = request.payload
        const updatedGrid = handleClickedCell(payload.grid, payload.cell)
        // console.log(request.payload)
        sendGrid(updatedGrid)
        return 'grid to mutate received'
    }
};

const addLastRowConfig = {
    auth: 'jwt',
    handler: function (request, h) {
        const payload = request.payload
        // console.log(payload.grid)
        const parsedGrid = parseGrid(payload.grid)
        const updatedGrid = addLastRow(parsedGrid)
        console.log(updatedGrid)
        sendGrid(updatedGrid)
        return 'grid to mutate received'
    }
};

exports.configureRoutes = (server) => {
    return server.route([
        {
            method:'POST',
            path: '/state/{timeout}',
            config: qclState
        },
        {
            method:'POST',
            path: '/mutate-grid/',
            config: stateMutation
        },
        {
            method:'POST',
            path: '/add-last-row/',
            config: addLastRowConfig
        }
    ])}
