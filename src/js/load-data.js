// data
let data = null
let cleanedData = null

// Use for original data
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

// Use for data that has rectangle calculations
function cleanDataRect(arr){
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
  // Run to calculate rectangles
	// d3.loadData('assets/data/measurements.csv',
	// 	(err, response) => {
	// 		let data = cleanData(response[0])
	// 		cb (err, data)
	// 	})

    // Run once rectangles have been calculated
    d3.loadData('assets/data/measurementsRectangles.json',
  		(err, response) => {
        let data = cleanDataRect(response[0])
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
