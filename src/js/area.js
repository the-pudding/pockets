import './pudding-chart/area-template'

// data
let data = null

// selections
const $area = d3.selectAll('.area-graphic')

function cleanData(arr){
  return arr.map((d, i) => {
    return {
      ...d,
      waistSize: +d.waistSize,
      price: +d.price,
      maxHeightFront: +d.maxHeightFront,
      minHeightFront: +d.minHeightFront,
      rivetHeightFront: +d.rivetHeightFront,
      maxWidthFront: +d.maxWidthFront,
      minWidthFront: +d.minWidthFront,
      maxHeightBack: +d.maxHeightBack,
      minHeightBack: +d.minHeightBack,
      maxWidthBack: +d.maxWidthBack,
      minWidthBack: +d.minWidthBack
    }
  })
}

function resize(){}

function setupChart(){
  const $sel = $area

  const charts = $sel
    .selectAll('.chart')
    .data(data)
    .enter()
    .append('div.chart')
    .areaChart()
}

function init() {
  return new Promise((resolve) => {
    d3.loadData('assets/data/measurements.csv', (err, response) => {
      data = cleanData(response[0])
      setupChart()
      resolve()
    })
  })
}

export default { init, resize };
