import './pudding-chart/debunking-template'
import loadMeasurements from './load-data'

// data
let data = null
let allCharts = []

// selections
const $debunk = d3.selectAll('.debunk-graphic')

function resize(){
  allCharts.forEach( chart => {
    chart.resize()
  })
}

function setupChart(){
  const $sel = d3.select(this)

  const nestedData = d3.nest()
    .key(d => d.group)
    .entries(data)

  let location = $sel.at('data-location')

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    .attr('data-location', location)
    .debunkingChart()

  allCharts = allCharts.concat(charts).filter(d => d)
  resize()
}

function init(){
  Promise.all([loadMeasurements()])
    .then((results) => {
      data = results[0]
      $debunk.each(setupChart)
    })
    .catch(err => console.log(err))
}


export default { init, resize };
