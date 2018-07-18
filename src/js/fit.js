import './pudding-chart/fit-template'
import loadMeasurements from './load-data'

// data
let data = null

// selections
const $fit = d3.selectAll('.fit-table')

function resize(){}

function setupChart(){
  const $sel = $fit

  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(data)

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    .fitChart()
}

function init(){
  Promise.all([loadMeasurements()])
    .then((results) => {
      data = results[0]
      setupChart()
    })
    .catch(err => console.log(err))
}

export default { init, resize };
