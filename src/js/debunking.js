import './pudding-chart/debunking-template'
import loadMeasurements from './load-data'

// data
let data = null
let allCharts = []


// selections
const $debunk = d3.selectAll('.debunk-graphic')
const ui = d3.selectAll('.debunk-ui')
let allButtons = ui.selectAll('.btn')

function resize(){
  allCharts.forEach( chart => {
    chart.resize()
  })
}

function handleHighlight(){
  const sel = d3.select(this)
  const selStatus = sel.classed('is-active')
  const inverse = !selStatus
  console.log({selStatus, inverse})



  const loc = sel.at('data-location')
  const buttons = ui.selectAll(`[data-location=${loc}]`)

  buttons.classed('is-active', false)

  sel.classed('is-active', !selStatus)
  //sel.classed('is-active', true)
  const text = sel.text().toLowerCase()

  allCharts.forEach(chart => {
    chart.highlight(text, loc, selStatus)
  })
}

function setupChart(){
  const $sel = d3.select(this)

  const nestedData = d3.nest()
    .key(d => d.group)
    .entries(data)


    let location = $sel.at('data-location')

    const nest2 = d3.nest()
      .key(d => d.group)
      .rollup((leaves, i) => {
        const average = {
          brand: 'average',
          maxHeightFront: d3.round(d3.mean(leaves, d => d.maxHeightFront), 1),
          minHeightFront: d3.round(d3.mean(leaves, d => d.minHeightFront), 1),
          rivetHeightFront: d3.round(d3.mean(leaves, d => d.rivetHeightFront), 1),
          maxWidthFront: d3.round(d3.mean(leaves, d => d.maxWidthFront), 1),
          minWidthFront: d3.round(d3.mean(leaves, d => d.minWidthFront), 1),
          maxHeightBack: d3.round(d3.mean(leaves, d => d.maxHeightBack), 1),
          minHeightBack: d3.round(d3.mean(leaves, d => d.minHeightBack), 1),
          maxWidthBack: d3.round(d3.mean(leaves, d => d.maxWidthBack), 1),
          minWidthBack: d3.round(d3.mean(leaves, d => d.minWidthBack), 1),
        }
        leaves.push(average)
        return leaves
      })
      .entries(data)

  const charts = $sel
    .selectAll('.chart')
    .data(nest2)
    .enter()
    .append('div')
    .attr('class', d => `chart chart-${(d.key).replace(/\s/g,'')}`)
    .attr('data-location', location)
    .debunkingChart()

  allCharts = allCharts.concat(charts).filter(d => d)
  resize()

  allButtons
    .on('click', handleHighlight)
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
