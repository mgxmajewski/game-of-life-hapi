exports.getLongestRow = grid => {
    let max = 0;
    for (let row =0; row < grid.length; row++){
        if(max < grid[row].length){
            max = grid[row].length
        }
    }
    return max
}
