import './pudding-chart/rect-calc-template'
import loadMeasurements from './load-data'


// data
let data = null
let sortedData = null
let selectedObject = null
let toggleW = null
let toggleM = null
let dimW = null
let dimM = null

let selectedBrand = 'All'
let selectedStyle = 'All'
let selectedPrice = 'All'

// selections
const container = d3.selectAll('.fit-container')
const $fit = container.selectAll('.fit-table')
const brand = container.select('.ui-brand')
const style = container.select('.ui-style')
const price = container.select('.ui-price')

function resize(){}

function setupChart(){
  const $sel = $fit

  sortedData = data.sort((a, b) => {
    return d3.ascending(a.brand, b.brand)
  })

  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(sortedData)

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    .at('data-object', selectedObject)
    .rectChart()
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
