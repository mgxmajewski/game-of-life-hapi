'use strict';

const { Cell } = require('./Cell.js');
const { Grid } = require('./Grid.js');
const { GameOfLife } = require('./GameOfLife.js');

describe('Game of life', () => {

    test('should return number of rows and columns', () => {
        // Given
        const GridToTest =  new Grid(4, 8);
        // When
        const result = GridToTest.size;
        // Then
        expect(result).toEqual('columns: 4, rows: 8');
    });

    test('should return create grid with default number of 10 columns and 10 rows', () => {
        // Given
        const GridToTest =  new Grid();
        // When
        const result = GridToTest.size;
        // Then
        expect(result).toEqual('columns: 10, rows: 10');
    });

    test('should return array of arrays with mocked cells (without checking for life)', () => {
        // Given
        const GridToTest =  new Grid(4, 8);
        // When
        const result = GridToTest.gridView;
        // Then
        const expected = [
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should return array of arrays with one alive cell', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(4, 8);
        // When
        GameOfLifeTest.initiateLife = [[1,2]];
        const result = GameOfLifeTest.cellGrid.gridView;
        // Then
        const expected = [
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '#', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should return array of arrays with 3 alive cells', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(4, 8);
        // When
        GameOfLifeTest.initiateLife = [[0,0], [0,2], [1,2]];
        const result = GameOfLifeTest.cellGrid.gridView;
        // Then

        const expected = [
            ['#', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['#', '#', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_'],
            ['_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should return array of arrays with 3 alive cells (8 columns 4 rows)', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(8, 4);
        // When
        GameOfLifeTest.initiateLife = [[1,0], [2,0], [2,1]];
        const result = GameOfLifeTest.cellGrid.gridView;
        console.log(result);
        // Then
        const expected = [
            ['_', '#', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should check and return if initial life state is correct for one cell', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(4, 8);
        // When
        GameOfLifeTest.initiateLife = [[1,2]];
        const result = GameOfLifeTest.cellGrid.accessCell(1,2).isAlive;
        // Then
        expect(result).toEqual(true);
    });

    test('should return id of Cell object', () => {
        // Given
        const CellToTest =  new Cell(4, 8);
        // When
        const result = CellToTest.position;
        // Then
        expect(result).toEqual(`position-4-8`);
    });

    test('should return alive when checked', () => {
        // Given
        const CellToTest =  new Cell(4, 8);
        // When
        CellToTest.giveLife();
        // Then
        const result = CellToTest.isAlive;
        expect(result).toEqual(true);
    });

    test('should return false when cell first got alive then killed', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(8, 4);
        // When
        GameOfLifeTest.cellGrid.accessCell(1,1).giveLife();
        GameOfLifeTest.updateGrid();
        // Then
        const result = GameOfLifeTest.cellGrid.accessCell(1,1).isAlive;
        expect(result).toEqual(false);
    });

    test('should return sum of alive neighbour cells (left edge case)', () => {
        // Given
        const GridToTest = new Grid(10, 10);
        // When
        GridToTest.accessCell(0,4).giveLife();
        GridToTest.accessCell(0,6).giveLife();
        GridToTest.accessCell(1,4).giveLife();
        GridToTest.accessCell(1,5).giveLife();
        GridToTest.accessCell(1,6).giveLife();
        const chosenCell = GridToTest.accessCell(0,5);
        // Then
        const result = GridToTest.analiseNeighbourCells(chosenCell);
        expect(result).toEqual(5);
    });

    test('should return sum of alive neighbour cells (right edge case)', () => {
        // Given
        const GridToTest = new Grid(10, 10);
        // When
        GridToTest.accessCell(9,4).giveLife();
        GridToTest.accessCell(9,6).giveLife();
        GridToTest.accessCell(8,4).giveLife();
        GridToTest.accessCell(8,5).giveLife();
        const chosenCell = GridToTest.accessCell(9,5);
        // Then
        const result = GridToTest.analiseNeighbourCells(chosenCell);
        expect(result).toEqual(4);
    });

    test('should return sum of alive neighbour cells (top left corner case)', () => {
        // Given
        const GridToTest =  new Grid(4, 8);
        // When
        GridToTest.accessCell(1,1).giveLife();
        GridToTest.accessCell(1,0).giveLife();
        GridToTest.accessCell(0,1).giveLife();
        GridToTest.accessCell(0,0).giveLife();
        const chosenCell = GridToTest.accessCell(0,0);
        // Then
        const result = GridToTest.analiseNeighbourCells(chosenCell);
        expect(result).toEqual(3);
    });


    test('should return sum of alive neighbour cells (bottom right corner case)', () => {
        // Given
        const GridToTest =  new Grid(4, 8);
        // When
        GridToTest.accessCell(2,6).giveLife();
        GridToTest.accessCell(2,7).giveLife();
        GridToTest.accessCell(3,6).giveLife();
        GridToTest.accessCell(3,7).giveLife();
        const chosenCell = GridToTest.accessCell(3,7);
        // Then
        const result = GridToTest.analiseNeighbourCells(chosenCell);
        console.log(GridToTest.gridView);
        expect(result).toEqual(3);
    });

    test('should return sum of alive neighbour cells (middle case)', () => {
        // Given
        const GridToTest =  new Grid(20, 10);
        // When
        GridToTest.accessCell(6,6).giveLife();
        GridToTest.accessCell(6,5).giveLife();
        GridToTest.accessCell(5,6).giveLife();
        GridToTest.accessCell(5,5).giveLife();
        const chosenCell = GridToTest.accessCell(5,5);
        // Then
        const result = GridToTest.analiseNeighbourCells(chosenCell);
        expect(result).toEqual(3);
    });

    test('should return give access to particular cell', () => {
        // Given
        const GridToTest =  new Grid(4, 8);
        // When
        const chosenCell = GridToTest.accessCell(3,3);
        // Then
        const result = chosenCell.position;
        expect(result).toEqual('position-3-3');
    });

    test('should return updated grid with one new cell', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(8, 4);
        GameOfLifeTest.initiateLife = [[4,1],[3,2],[4,2]];
        // When
        GameOfLifeTest.updateGrid();
        // Then
        const result = GameOfLifeTest.cellGrid.gridView;
        const expected = [
            ['_', '_', '_', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '#', '#', '_', '_', '_'],
            ['_', '_', '_', '#', '#', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should return updated grid (flip row of cells to become column)', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(5, 5);
        GameOfLifeTest.initiateLife = [[1,2],[2,2],[3,2]];
        // When
        GameOfLifeTest.updateGrid();
        // Then
        const result = GameOfLifeTest.cellGrid.gridView;
        const expected = [
            ['_', '_', '_', '_', '_'],
            ['_', '_', '#', '_', '_'],
            ['_', '_', '#', '_', '_'],
            ['_', '_', '#', '_', '_'],
            ['_', '_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });

    test('should return updated grid Pulsar second state after full period (3 updated + 1 initial)', () => {
        // Given
        const GameOfLifeTest = new GameOfLife(16, 16);
        GameOfLifeTest.initiateLife = [
            [3,1],[4,1],[5,1],[9,1],[10,1],[11,1],
            [1,3],[6,3],[8,3],[13,3],
            [1,4],[6,4],[8,4],[13,4],
            [1,5],[6,5],[8,5],[13,5],
            [3,6],[4,6],[5,6],[9,6],[10,6],[11,6],
            [3,8],[4,8],[5,8],[9,8],[10,8],[11,8],
            [1,9],[6,9],[8,9],[13,9],
            [1,10],[6,10],[8,10],[13,10],
            [1,11],[6,11],[8,11],[13,11],
            [3,13],[4,13],[5,13],[9,13],[10,13],[11,13]
        ];
        // When
        GameOfLifeTest.updateGrid();
        GameOfLifeTest.updateGrid();
        GameOfLifeTest.updateGrid();
        GameOfLifeTest.updateGrid();
        // Then
        const result = GameOfLifeTest.cellGrid.gridView;
        const expected = [
            ['_', '_', '_', '_', '#', '_', '_', '_', '_', '_', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '_', '_', '_', '_', '_', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '#', '_', '_', '_', '#', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
            ['#', '#', '#', '_', '_', '#', '#', '_', '#', '#', '_', '_', '#', '#', '#', '_'],
            ['_', '_', '#', '_', '#', '_', '#', '_', '#', '_', '#', '_', '#', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '#', '_', '_', '_', '#', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '#', '_', '_', '_', '#', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '#', '_', '#', '_', '#', '_', '#', '_', '#', '_', '#', '_', '_', '_'],
            ['#', '#', '#', '_', '_', '#', '#', '_', '#', '#', '_', '_', '#', '#', '#', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '#', '_', '_', '_', '#', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '_', '_', '_', '_', '_', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '#', '_', '_', '_', '_', '_', '#', '_', '_', '_', '_', '_'],
            ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_']
        ];
        expect(result).toEqual(expected);
    });
});
