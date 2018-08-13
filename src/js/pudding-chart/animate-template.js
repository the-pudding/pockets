/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.animateChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 15;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;
		let userObject = null
		let userID = null

		// scales
		const scale = d3.scaleLinear()

		// dom elements
		let $svg = null;
		let $axis = null;
		let $vis = null;

		const objectSizes = [{
			object: 'phone',
			id: 'iphone',
			width: 7,
			height: 14
		}, {
			object: 'wallet',
			id: 'frontWallet',
			width: 8.4,
			height: 10.4
		}, {
			object: 'pen',
			id: 'pen',
			width: 1.5,
			height: 14.5
		}, {
			object: 'hand',
			width: 7.4,
			height: 17.2
		}, {
			object: 'phone',
			id: 'galaxy',
			width: 6.9,
			height: 14.7,
		}, {
			object: 'phone',
			id: 'pixel',
			width: 7.6,
			height: 15.7
		}, {
			object: 'hand',
			id: 'menHand',
			width: 7.7,
			height: 13.4,
			fingerHeight: 18.9,
			fingerWidth: 9.8
		}, {
			object: 'hand',
			id: 'womenHand',
			width: 7,
			height: 12.0,
			fingerHeight: 17.2,
			fingerWidth: 8.9
		}]

		let rectData = null

		function pocketShape(sel, newData){
			let d = newData
			const g = sel
			const padding = 10
			const point1 = [padding, padding]
			const point2 = [padding, padding + scale(d.value.maxHeightFront)]

			const curve1Control = [padding + scale(d.value.maxWidthFront / 2), scale(d.value.maxHeightFront + 2) + padding]
			const curve1ControlCutout = [padding + scale(d.value.maxWidthFront * 0.8), scale(d.value.maxHeightFront * 0.8) + padding]
			const curve1End = [padding + scale(d.value.maxWidthFront), scale(d.value.minHeightFront) + padding]
			const curve1EndCutout = [padding + scale(d.maxWidthFront), scale(d.value.minHeightFront) + padding]
			const cutoutPoint = [padding + scale(d.value.maxWidthFront - 3), scale(d.value.maxHeightFront) + padding]

			const point3Cutout = [padding + scale(d.value.maxWidthFront), scale(d.value.rivetHeightFront) + padding]
			const point3 = [padding + scale(d.value.maxWidthFront), scale(d.value.rivetHeightFront) + padding]
			const curve2Control = [padding + scale(d.value.minWidthFront / 2), scale(0.4 * d.value.maxWidthFront) + padding]
			const curve2End = [padding + scale(d.value.maxWidthFront - d.value.minWidthFront), padding]

			let joined = null
			let path = null
			let fullPath = null

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
				joined = path.join(" ")

				const quadraticInterpolator1 = interpolateQuadraticBezier(cutoutPoint, curve1ControlCutout, curve1EndCutout);
				const quadraticInterpolator2 = interpolateQuadraticBezier(point3Cutout, curve2Control, curve2End);

				const interpolatedPoints1 = d3.range(10).map((d, i, a) => quadraticInterpolator1(d / (a.length - 1)));

				//const quadraticInterpolator2 = interpolateQuadraticBezier(point3, curve2Control, curve2End);
				const interpolatedPoints2 = d3.range(10).map((d, i, a) => quadraticInterpolator2(d / (a.length - 1)));

				fullPath = [point1, point2].concat(interpolatedPoints1).concat(interpolatedPoints2).concat([point1])
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

			joined = path.join(" ")

			const quadraticInterpolator1 = interpolateQuadraticBezier(point2, curve1Control, curve1End);
			const quadraticInterpolator2 = interpolateQuadraticBezier(point3, curve2Control, curve2End);

			const interpolatedPoints1 = d3.range(10).map((d, i, a) => quadraticInterpolator1(d / (a.length - 1)));

			//const quadraticInterpolator2 = interpolateQuadraticBezier(point3, curve2Control, curve2End);
			const interpolatedPoints2 = d3.range(10).map((d, i, a) => quadraticInterpolator2(d / (a.length - 1)));

			fullPath = [point1].concat(interpolatedPoints1).concat(interpolatedPoints2).concat([point1])
		}

		const handAngles = d3.range(125, 160, 5)

		const largestRectPhone = d3plus.largestRect(fullPath, {nTries: 100, aspectRatio: 0.5, cache: false})
		const largestRectPen = d3plus.largestRect(fullPath, {nTries: 100, aspectRatio: 0.1, cache: false})
		const largestRectWallet = d3plus.largestRect(fullPath, {nTries:100, aspectRatio: 0.8, cache: false})
		const largestRectHand = d3plus.largestRect(fullPath, {nTries:100, aspectRatio: 0.57, cache: false, angle: handAngles})

		const thisData = d
		const withRect = [thisData].map(d => {
			return{
				...d,
				rectanglePhone: largestRectPhone,
				rectanglePen: largestRectPen,
				rectangleWallet: largestRectWallet,
				rectangleHand: largestRectHand
			}
		})

		//rectData.push(withRect[0])
		rectData = withRect[0]

		return joined

		}

		function drawPocket(d){
		let g = d3.select(this)
		let joined = pocketShape(g, d)

		const drawnPocket = g
			.append('path.outline')
			.attr('class', d => `outline outline-${d.key}`)
			.attr('d', joined)

		const avgLabel = $svg
				.append('text')
				.text(d => d.key)
				.attr('class', 'avglabel tk-atlas')
				.attr('x', 0)
				.attr('y', 15)

		// g
		// 	.append('path.largestRect')
		// 	.attr('d', d => {
		// 		const path = [
		// 			"M", largestRectHand.points[0],
		// 			"L", largestRectHand.points[1],
		// 			"L", largestRectHand.points[2],
		// 			"L", largestRectHand.points[3],
		// 			"L", largestRectHand.points[4]
		// 		]
		// 		const joined = path.join(" ")
		// 		return joined
		// 	})
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

		function drawObject(d, selObject, group, id){

			const g = group
			let rectArea = null
			if (selObject == 'phone') rectArea = 'rectanglePhone'
			if (selObject == 'pen') rectArea = 'rectanglePen'
			if (selObject == 'wallet') rectArea = 'rectangleWallet'
			if (selObject == 'hand') rectArea = 'rectangleHand'

			// draw object
			const display = g//$svg.selectAll('.g-vis')
			let objectWidth =  scale(objectMap.get(id).width)
			let objectHeight = scale(objectMap.get(id).height)

			// const drawnObject = display
			//   .append('rect.object')
			//   .attr('width', objectWidth)
			//   .attr('height', objectHeight)
			//   .attr('transform-origin', `top left`)
			//   .attr('transform', `translate(${d[rectArea].points[0][0]}, ${d[rectArea].points[0][1]})rotate(${d[rectArea].angle})`)
			//   // .attr('transform', `rotate(${d[rectArea].angle})`)
			//   .attr('transform-origin', `${d[rectArea].cx} ${d[rectArea.cy]}`)
			//   .style('fill', 'none')
			//   .style('stroke', '#fff')
			//   .style('stroke-width', '1px')

			// const objectID = id

			if(selObject != 'hand'){

				display
					.append('svg:image')
					.attr('width', objectWidth)
					.attr('height', objectHeight)
					.attr("xlink:href", `assets/images/${id}.png`)

				display
					.attr('transform', `translate(${width * 0.75}, ${-height})`)
					.transition()
					.duration(500)
					.attr('transform-origin', `top left`)
					.attr('transform', `translate(${rectData[rectArea].points[0][0]}, ${rectData[rectArea].points[0][1]})rotate(${rectData[rectArea].angle})`)
					.attr('class', 'pocket-object')
			}
			else {
				display
					.append('svg:image')
					.attr('width', scale(objectMap.get(id).fingerWidth))
					.attr('height', scale(objectMap.get(id).fingerHeight))
					.attr("xlink:href", `assets/images/${id}.png`)

				display
					.attr('transform', `translate(${width * 0.75}, ${-height})`)
					.transition()
					.duration(500)
					.attr('transform-origin', `top left`)
					.attr('transform', `translate(${rectData[rectArea].points[0][0] + ((scale(objectMap.get(id).fingerWidth) - objectWidth) / 2)}, ${rectData[rectArea].points[0][1]})rotate(${rectData[rectArea].angle})`)
					.attr('class', 'pocket-object')
			}

		}


		const objectMap = d3.map(objectSizes, d => d.id)

		const Chart = {
			// called once at start
			init() {

				$svg = $sel.append('svg');

				$svg.attr('class', d => `animate-chart animate-chart-${d.key}`)
				const $g = $svg.append('g');

				// offset chart for margins
				$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// create axis
				$axis = $svg.append('g.g-axis');

				// setup viz group
				$vis = $g.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element

				const innerWidth = window.innerWidth
				let chartWidth = null
				if (innerWidth >= 900) chartWidth = 200
				else if (innerWidth < 900) chartWidth = Math.max(innerWidth / 4, 150)

				$sel.st('width', chartWidth).st('height', chartWidth * 1.25)

				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = (width * 1.25) - marginTop - marginBottom//$sel.node().offsetHeight - marginTop - marginBottom;

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
			animate(selObject, id, state){
				const frontGroup = $svg.select('.g-vis')

				if (state == false){
					userObject = selObject
					userID = id

	        frontGroup.selectAll('.pocket-object').remove()

	        frontGroup
	          .selectAll('.outline-object')
	          .data(d => [d])
	          .enter()
	          .append('g')
	          .each(function(d){
	            const g = d3.select(this)
	            drawObject(d, selObject, g, id)})
				}

				if (state == true){
					frontGroup.selectAll('.pocket-object').remove()
				}

				return Chart

			},
			update(){
				// Update pocket size
				$svg.selectAll('.outline')
					.attr('d', function(d) {
						let g = d3.select(this)
						let joined = pocketShape(g, d)
						return joined
					})

				const objects = $svg.selectAll('.pocket-object').remove()

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
