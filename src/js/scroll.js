import loadMeasurements from './load-data'
import './pudding-chart/scroll-template'

let data = null

// selections
const $scroll = d3.selectAll('.scroll')

function setupChart(){
  const $sel = $scroll

  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(data)

    console.log({nestedData})

  const charts = $sel
    //.select('.chart')
    .datum(nestedData)
    // .enter()
    // .append('div.chart')
    .scrollChart()
}

function resize(){

}

function init(){
  Promise.all([loadMeasurements()])
    .then((results) => {
      data = results[0]
      setupChart()
    })
    .catch(err => console.log(err))
}

export default {init, resize}
