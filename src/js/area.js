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
      minWidthBack: +d.minWidthBack,
    }
  })
}

function resize(){}

function setupChart(){
  const $sel = $area

  const cleanedData = data.map(d => {
    let updatedStyle = null
    if (d.style == "boot-cut") updatedStyle = "straight"
    else if (d.style == "regular") updatedStyle = "straight"
    else if(d.style == "slim") updatedStyle = "skinny"
    else updatedStyle = d.style

    return {
      ...d,
      updatedStyle: updatedStyle,
      group: `${d.menWomen} - ${updatedStyle}`
    }
  })

  const nestedData = d3.nest()
    .key(d => d.group)
    .entries(cleanedData)

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
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
