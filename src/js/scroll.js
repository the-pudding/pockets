import loadMeasurements from './load-data'
import './pudding-chart/scroll-template'
import scrollama from 'scrollama'

let data = null

const scroller = scrollama()

// selections
const $scroll = d3.selectAll('.scroll-graphic')

// scrolly selections
const container = d3.selectAll('.scroll')
const graphic = container.select('.scroll-graphic')
const chart = graphic.select('.scroll-svg')
const text = container.select('.scroll-text')
const step = text.selectAll('.step')

function setupChart(){
  const $sel = $scroll

  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(data)

  const chart = $sel
    .datum(nestedData)
    .scrollChart()

    resize()
    setupScroll(chart)
}

function resize(){
  const pageWidth = window.innerWidth
  const stepHeight = Math.floor(window.innerHeight * 0.8)

  step
    .style('height', `${stepHeight}px`)

  const containerWidth = container.node().offsetWidth

  graphic
    .style('width', `${containerWidth}px`)

  scroller.resize()
}

function handleStepEnter(response){
  const index = response.index
  //toggle(index)
}

function setupScroll(){
  scroller.setup({
    container: '.scroll',
    graphic: '.scroll-graphic',
    text: '.scroll-text',
    step: '.step',
    debug: false
  })
  .onStepEnter(handleStepEnter)
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
