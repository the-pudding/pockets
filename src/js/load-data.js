// data
let data = null
let cleanedData = null


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
      updatedStyle: updateStyle(d.style),
      group: `${d.menWomen} - ${updateStyle(d.style)}`,
      priceGroup: definePrice(+d.price)
    }
  })
}

function updateStyle(style){
  if (style == "boot-cut") return "straight"
  else if (style == "regular") return "straight"
  else if(style == "slim") return "skinny"
  else return style
}

function definePrice(price){
  if (price < 50) return '< $50'
  else if (price >= 50 && price < 100) return '$50 - $99'
  else if (price >= 100 && price < 150) return '$100 - $149'
  else return '$150+'
}

function loadMeasurements(cb) {
	d3.loadData('assets/data/measurements.csv',
		(err, response) => {
			let data = cleanData(response[0])
			cb (err, data)
		})
}

function init() {
	return new Promise((resolve, reject) => {
		loadMeasurements((err, data) => {
			if (err) reject('error loading data')
			else resolve(data)
		})
	})
}

export default init
