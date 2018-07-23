/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/
//import d3plus from 'd3plus-shape'

d3.selection.prototype.rectChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
    let object = $sel.at('data-object')
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 50;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scale = d3.scaleLinear()
		//const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
    let display = null
    let brands = null

		// helper functions
    const objectSizes = [{
      object: 'phone',
      width: 7,
      height: 14
    }]

		const rectData = []

		function drawPocket(d){
			const g = d3.select(this)
			const padding = 10
			const point1 = [padding, padding]
			const point2 = [padding, padding + scale(d.maxHeightFront)]
			const curve1Control = [padding + scale(d.maxWidthFront / 2), scale(d.maxHeightFront + 2) + padding]
			const curve1End = [padding + scale(d.maxWidthFront), scale(d.minHeightFront) + padding]
			const point3 = [padding + scale(d.maxWidthFront), scale(d.rivetHeightFront) + padding]
			const curve2Control = [padding + scale(d.minWidthFront / 2), scale(0.4 * d.maxWidthFront) + padding]
			const curve2End = [padding + scale(d.maxWidthFront - d.minWidthFront), padding]

			const path = [
				// move to the right padding amount and down padding amount
				"M", point1,
				// draw a line from initial point straight down the length of the maxHeight
				"L", point2,
				////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
				// Add a curve to the other side
				"Q", curve1Control, // control point for curve
					curve1End, // end point
				// Draw a line straight up to the min height - rivet height
				"L", point3,
				// Add a curve to the line between rivets
				"Q", curve2Control, curve2End
				 	,
				"L", point1
				// "l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
				////"L", [padding, padding]
			]

			const joined = path.join(" ")

			//const polygon = d3plus.path2polygon(testPath, {segmentLength: 20})

			const quadraticInterpolator1 = interpolateQuadraticBezier(point2, curve1Control, curve1End);
			const interpolatedPoints1 = d3.range(10).map((d, i, a) => quadraticInterpolator1(d / (a.length - 1)));

			const quadraticInterpolator2 = interpolateQuadraticBezier(point3, curve2Control, curve2End);
			const interpolatedPoints2 = d3.range(10).map((d, i, a) => quadraticInterpolator2(d / (a.length - 1)));

			const fullPath = [point1].concat(interpolatedPoints1).concat(interpolatedPoints2).concat([point1])// interpolatedPoints1, point3, interpolatedPoints2, point1]

			// function findLargestRect(aspectRatio){
			// 	const largestRect = d3plus.largestRect(fullPath, {nTries: 100, aspectRatio: aspectRatio, cache: false})
			// 	return largestRect
			// }
			//
			// const withRect = [d].map(d => {
			// 	return{
			// 		...d,
			// 		rectanglePhone: findLargestRect(0.5),
			// 		rectanglePen: findLargestRect(0.05),
			// 		rectangleWallet: findLargestRect(0.8)
			// 	}
			// })
			//
			// console.log({withRect})

			//
			const largestRectPhone = d3plus.largestRect(fullPath, {nTries: 100, aspectRatio: 0.5, cache: false})
			const largestRectPen = d3plus.largestRect(fullPath, {nTries: 100, aspectRatio: 0.05, cache: false})
			const largestRectWallet = d3plus.largestRect(fullPath, {nTries:100, aspectRatio: 0.8, cache: false})

			const thisData = d
			const withRect = [thisData].map(d => {
				return{
					...d,
					rectanglePhone: largestRectPhone,
					rectanglePen: largestRectPen,
					rectangleWallet: largestRectWallet
				}
			})

			rectData.push(withRect[0])

			const drawnPocket = g
				.append('path.outline')
				.attr('d', joined)

			g
				.append('path.largestRect')
				.attr('d', d => {
					const path = [
						"M", largestRectWallet.points[0],
						"L", largestRectWallet.points[1],
						"L", largestRectWallet.points[2],
						"L", largestRectWallet.points[3],
						"L", largestRectWallet.points[4]
					]
					const joined = path.join(" ")
					return joined
				})
		}

		// Quadratic interpolators from this block https://bl.ocks.org/pbeshai/72c446033a98f99ce1e1371c6eee9644

		function interpolateQuadraticBezier(start, control, end) {
			// 0 <= t <= 1
			return function interpolator(t) {
				return [
					(Math.pow(1 - t, 2) * start[0]) +
		      (2 * (1 - t) * t * control[0]) +
		      (Math.pow(t, 2) * end[0]),
		      (Math.pow(1 - t, 2) * start[1]) +
		      (2 * (1 - t) * t * control[1]) +
		      (Math.pow(t, 2) * end[1]),
				];
			};
		}

		function interpolateQuadraticBezierAngle(start, control, end) {
			// 0 <= t <= 1
			return function interpolator(t) {
				const tangentX = (2 * (1 - t) * (control[0] - start[0])) +
												 (2 * t * (end[0] - control[0]));
				const tangentY = (2 * (1 - t) * (control[1] - start[1])) +
												 (2 * t * (end[1] - control[1]));

				return Math.atan2(tangentY, tangentX) * (180 / Math.PI);
			}
		}

    const objectMap = d3.map(objectSizes, d => d.object)

		const Chart = {
			// called once at start
			init() {
        // Add label
        $sel.append('text.tk-atlas.text-menWomen')
          .text(d => `${d.key}'s`)

        const container = $sel.append('div.container')

        // Add svg for front pockets
				brands = container.selectAll('.fit-brand')
          .data(d => d.values)
          .enter()
          .append('div.area-front')
          .attr('class', 'fit-brand visible')

        display = brands.append('div.display')
        let tooltip = brands.append('div.tooltip')

        $svg = display.append('svg.fit-canvas')
        const text = display.append('div.text')
        text.append('text.brand.tk-atlas').text(d => d.brand)
        text.append('text.style.tk-atlas').text(d => d.updatedStyle)

        let toolText = tooltip.append('div.tooltip-text')
        const dollars = d3.format("$.2f")

        toolText.append('text.tk-atlas').text(d => d.name)
        toolText.append('text.tk-atlas').text(d => `${dollars(d.price)}`)
        toolText.append('text.tk-atlas').text(d => d.fabric)

				const $g = $svg.append('g');

				// setup viz group
				$vis = $g.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = display.node().offsetWidth - marginLeft - marginRight;
				height = display.node().offsetHeight - marginTop - marginBottom;
				$svg.at({
					width: width + marginLeft + marginRight,
					height: 300
				});


        scale
          .domain([0, 29])
          .range([0, 225])

				return Chart;
			},
			// update scales and render chart
			render() {
        const padding = 10
        const inch = 0.393 // conversion factor for cm -> inches

        // Draw front pocket
        const frontGroup = $svg.select('.g-vis')
				//
        // let areaMeasure = null
        // let rect = []
        // let numbers = null
        frontGroup
          .selectAll('.outline')
          .data(d => [d])
          .enter()
          .append('g')
					.each(drawPocket)

				// Export data
				if(data.key == 'women') window.outputW = JSON.stringify(rectData)
				if(data.key == 'men') window.outputM = JSON.stringify(rectData)

				// Then run copy(window.outputW) and copy(window.outputM) in the console window
				// Paste results into measurementsRectangles.json
				// Where the two arrays meet, delete the ] and [ symbols so that they become one large array

          frontGroup
            .selectAll('.measure measure-maxHeight')
            .data(d => [d])
            .enter()
            .append('text')
            .text(d => `${d3.round(d.maxHeightFront * inch, 1)}"`)
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'end')
            .attr('transform', d => `translate(${padding/2}, ${scale(d.maxHeightFront / 2)})`)
            .attr('class', 'tk-atlas measure measure-maxHeight')

            frontGroup
              .selectAll('.measure measure-minHeight')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.minHeightFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'start')
              .attr('transform', d => `translate(${scale(d.maxWidthFront) + (padding * 1.5)}, ${scale(d.rivetHeightFront + ((d.minHeightFront - d.rivetHeightFront ) / 2))})`)
              .attr('class', 'tk-atlas measure measure-minHeight')
            frontGroup
              .selectAll('.measure measure-maxWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.maxWidthFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('transform', d => `translate(${scale(d.maxWidthFront / 2) + padding}, ${scale(d.maxHeightFront) + (padding * 2.5)})`)
              .attr('class', 'tk-atlas measure measure-maxWidth')

            frontGroup
              .selectAll('.measure measure-minWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.minWidthFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('transform', d => `translate(${scale((d.maxWidthFront - d.minWidthFront) + (d.minWidthFront / 2)) + padding}, ${scale(d.rivetHeightFront / 2)})`)
              .attr('class', 'tk-atlas measure measure-minWidth')

            const groupWidth = frontGroup.node().getBBox().width

            frontGroup
              .attr('transform', function(d){
                const boxWidth = this.getBBox().width
                const leftBBox = frontGroup.selectAll('.measure-maxHeight').node().getBBox().width
                const difWidth = ((width - boxWidth) / 2) + (leftBBox / 2)

                return `translate(${difWidth}, 0)`
              })

				return Chart;
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			},
      toggle(brand, price, style){
        brands
          .classed('visible', d => {


            if ((d.brand == brand || brand == 'All') && (d.style == style || style == 'All') && (d.priceGroup == price || price == 'All')) return true
            else return false
          })
        return Chart
      },
      dim(){
        brands
          .select('.display')
          .classed('dimmed', function(d){
            let objectWidth =  objectMap.get(object).width
            let objectHeight = objectMap.get(object).height
            const path = d3.select(this).select('.outline').at('d')
            const test = d3plus.path2polygon(path, [20])
            const minWidth = d.minWidthFront
            const minHeight = d.minHeightFront - d.rivetHeightFront

            if (d.minWidthFront < objectWidth || (d.maxHeightFront) < objectHeight) return true
            else false
          })
        return Chart
      }

		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
