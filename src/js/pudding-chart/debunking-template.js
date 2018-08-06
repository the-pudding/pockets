/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.debunkingChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum()
    let location = $sel.at('data-location')
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 5;
		const marginBottom = 5;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scale = d3.scaleLinear()
		//const scaleY = null;

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;
		const padding = 10

		const calcArea = d3.selectAll('.outline')

		// helper functions
		const val = data.value

		const extentFront = [val]
			.map(d => {
			const max = d.map(e => {
				//return e.rectangleWallet.area
				return e.pocketArea
			})
			return d3.extent(max)
		})

		const extentBack = [val]
			.map(d => {
				const max = d.map(e => {
					//return e.rectangleWallet.area
					return e.maxHeightBack * e.minWidthBack
				})
				return d3.extent(max)
			})

		const Chart = {
			// called once at start
			init() {
        // Add label
        $sel.append('text')
          .text(d => `${d.key}`.split(' ')[0] + `'s ` + `${d.key}`.split(' ')[2]).attr('class', 'chart-label')

        const container = $sel.append('div.container')

        // Add svg for front pockets
				$svg = container.append('svg.debunk');
				const $g = $svg.append('g');

				// setup viz group
				$vis = $g.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				const innerWidth = window.innerWidth
				let chartWidth = null
				if (innerWidth >= 900) chartWidth = 225
				else if (innerWidth < 900) chartWidth = Math.max(innerWidth / 4, 150)

				$sel.st('width', chartWidth).st('height', chartWidth * 1.5)
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = (width * 1.25) - marginTop - marginBottom
				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        scale
          .domain([0, 29])
          .range([0, height])

				// if pockets are drawn on page resize, resize them too
				const outlines = $sel.selectAll('.outline')

				if (outlines.size() > 0){
					Chart.update()
				}

				return Chart;
			},
			// update scales and render chart
			render() {
        if(location == 'front'){
          //Draw front pocket
          const frontGroup = $svg.select('.g-vis')

          let areaMeasure = null
          frontGroup
            .selectAll('.outline')
            .data(d => {
              return d.value})
            .enter()
            .append('path')
            .attr('class', d => {
							if (d.brand == 'average') return 'outline outline-average'
							else if ((d.pocketArea) == extentFront[0][1]) return `outline outline-biggest`
							else if ((d.pocketArea) == extentFront[0][0]) return `outline outline-smallest`
							else return `outline`
						})
        }

        else if(location == 'back'){

            const backGroup = $svg.select('.g-vis')

            backGroup
              .selectAll('.outline')
              .data(d => d.value)
              .enter()
              .append('path')
							.attr('class', d => {
								if (d.brand == 'average') return `outline outline-average`
								else if ((d.maxHeightBack * d.minWidthBack) == extentBack[0][1]) return `outline outline-biggest`
								else if ((d.maxHeightBack * d.minWidthBack) == extentBack[0][0]) return `outline outline-smallest`
								else return `outline`
							})

        }
				Chart.update()
				return Chart;
			},
			// update drawings on resize
			update(){
				const drawings = $svg.selectAll('.outline')
				if (location == 'front'){
					drawings
						.attr('d', function(d){
							//const path = [
							// 	// move to the right padding amount and down padding amount
							// 	"M", [padding, padding],
							// 	// draw a line from initial point straight down the length of the maxHeight
							// 	"l", [0, scale(d.maxHeightFront)],
							// 	////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
							// 	// Add a curve to the other side
							// 	"q", [scale(d.maxWidthFront / 2), scale(0.1 * d.maxHeightFront)], // control point for curve
							// 		[scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)], // end point
							// 	// Draw a line straight up to the min height - rivet height
							// 	"l", [0, -scale(d.minHeightFront - d.rivetHeightFront)],
							// 	// Add a curve to the line between rivets
							// 	"q", [-scale(d.minWidthFront * 2 / 3), scale(0.1 * d.maxHeightFront)],
							// 		[-scale(d.minWidthFront), -scale(d.rivetHeightFront)],
							// 	"l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
							// 	////"L", [padding, padding]
							// ]
							// const joined = path.join(" ")
							const padding = 10
							const point1 = [padding, padding]
							const point2 = [padding, padding + scale(d.maxHeightFront)]

							const curve1Control = [padding + scale(d.maxWidthFront / 2), scale(d.maxHeightFront + 2) + padding]
							const curve1ControlCutout = [padding + scale(d.maxWidthFront * 0.8), scale(d.maxHeightFront * 0.8) + padding]
							const curve1End = [padding + scale(d.maxWidthFront), scale(d.minHeightFront) + padding]
							const curve1EndCutout = [padding + scale(d.maxWidthFront), scale(d.minHeightFront) + padding]
							const cutoutPoint = [padding + scale(d.maxWidthFront - 3), scale(d.maxHeightFront) + padding]

							const point3Cutout = [padding + scale(d.maxWidthFront), scale(d.rivetHeightFront) + padding]
							const point3 = [padding + scale(d.maxWidthFront), scale(d.rivetHeightFront) + padding]
							const curve2Control = [padding + scale((d.maxWidthFront - d.minWidthFront) * 1.5), scale(d.rivetHeightFront) + padding]
							const curve2End = [padding + scale(d.maxWidthFront - d.minWidthFront), padding]

							let path = null

							if(d.cutout == 'TRUE'){
								path = [
									// move to the right padding amount and down padding amount
									"M", point1,
									// draw a line from initial point straight down the length of the maxHeight
									"L", point2,
									////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
									"L", cutoutPoint,
									// Add a curve to the other side
									"Q", curve1ControlCutout, // control point for curve
										curve1EndCutout, // end point
									// // Draw a line straight up to the min height - rivet height
									"L", point3Cutout,
									// // Add a curve to the line between rivets
									"Q", curve2Control, curve2End,
									//  	,
									"L", point1
									// "l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
									////"L", [padding, padding]
								]
							}
							else {

							path = [
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
						}
							const joined = path.join(" ")
							return joined
						})
				}
				else if (location == 'back'){
					drawings
						.attr('d', function(d){
							const path = [
								// move to the right padding amount and down padding amount
								"M", [padding, padding],
								// draw a line from initial point straight down the length of the maxHeight
								"l", [scale((d.maxWidthBack - d.minWidthBack) / 2), scale(d.minHeightBack)],
								"l", [scale(d.minWidthBack / 2), scale(d.maxHeightBack - d.minHeightBack)],
								"l", [scale(d.minWidthBack / 2), -scale(d.maxHeightBack - d.minHeightBack)],
								"l", [scale((d.maxWidthBack - d.minWidthBack) / 2), - scale(d.minHeightBack)],
								"l", [-scale(d.maxWidthBack), 0]
							]
							const joined = path.join(" ")
							return joined
						})
				}

				return Chart
			},
			highlight(sel, loc){
				if (loc == location){

					$svg
						.selectAll('.outline')
						.classed('is-active', false)

					const highlightPath = $svg.select(`.outline-${sel}`)
					highlightPath.classed('is-active', true)
				}


				return Chart
			},
			// get / set data
			data(val) {
				if (!arguments.length) return data;
				data = val;
				$sel.datum(data);
				Chart.render();
				return Chart;
			}
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
