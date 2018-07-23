import './pudding-chart/fit-template'
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

  // temporarily define selected selectedObject
  selectedObject = 'pen'

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    .at('data-object', selectedObject)
    .fitChart()

  toggleW = charts[0].toggle
  toggleM = charts[1].toggle

  dimW = charts[0].dim
  dimM = charts[1].dim

  setupDropdowns(brand, 'brand')
  setupDropdowns(style, 'updatedStyle')
  setupDropdowns(price, 'priceGroup')
}

function setupDropdowns(selection, options){

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

    selection.on('change', updateSelection)
}

function updateSelection(){
  const dropdown = d3.select(this).at('data-dropdown')
  const selection = this.value

  if (dropdown == 'price') selectedPrice = selection
  if (dropdown == 'brand') selectedBrand = selection
  if (dropdown == 'style') selectedStyle = selection

  toggleW(selectedBrand, selectedPrice, selectedStyle)
  toggleM(selectedBrand, selectedPrice, selectedStyle)

  // This needs to be connected to drag & drop
  dimW()
  dimM()
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
