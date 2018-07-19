import './pudding-chart/fit-template'
import loadMeasurements from './load-data'

// data
let data = null
let sortedData = null
let selectedObject = null

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

  // temporarily define selected selectedObject
  selectedObject = 'phone'

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    .at('data-object', selectedObject)
    .fitChart()

  setupDropdowns(brand, 'brand')
  setupDropdowns(style, 'updatedStyle')
  setupDropdowns(price, 'priceGroup')
}

function setupDropdowns(selection, options){
console.log({selection})

  selection
    .selectAll('option')
    .data(d => {
        const nestBrands = d3.nest()
          .key(d => d[options])
          .entries(sortedData)
          .map(e => e.key)

        nestBrands.unshift('All')

        return nestBrands
    })
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d)
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
