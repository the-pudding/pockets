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
		console.log({data})
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scaleX = null;
		const scaleY = null;

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
		}]

		const rectData = []

		function drawPocket(d){
			const g = d3.select(this)
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
			const curve2Control = [padding + scale(d.minWidthFront / 2), scale(0.4 * d.maxWidthFront) + padding]
			const curve2End = [padding + scale(d.maxWidthFront - d.minWidthFront), padding]

			let path = null

			if(d.cutout == 'TRUE'){
				path = [
					// move to the right padding amount and down padding amount
					"M", point1,
					// draw a line from initial point straight down the length of the maxHeight
					"L", point2,
					"L", cutoutPoint,
					// Add a curve to the other side
					"Q", curve1ControlCutout, // control point for curve
						curve1EndCutout, // end point
					// // Draw a line straight up to the min height - rivet height
					"L", point3Cutout,
					// // Add a curve to the line between rivets
					"Q", curve2Control, curve2End,
					"L", point1
				]
			}
			else {

			path = [
				// move to the right padding amount and down padding amount
				"M", point1,
				// draw a line from initial point straight down the length of the maxHeight
				"L", point2,
				// Add a curve to the other side
				"Q", curve1Control, // control point for curve
					curve1End, // end point
				// Draw a line straight up to the min height - rivet height
				"L", point3,
				// Add a curve to the line between rivets
				"Q", curve2Control, curve2End,
				"L", point1
			]
		}
			const joined = path.join(" ")

			const drawnPocket = g
				.append('path.outline')
				.attr('d', joined)
		}

		function drawObject(d, selObject, group, id){

			const g = group

			let rectArea = null
			if (selObject == 'phone' || selObject == 'hand') rectArea = 'rectanglePhone'
			if (selObject == 'pen') rectArea = 'rectanglePen'
			if (selObject == 'wallet') rectArea = 'rectangleWallet'

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

				const objectID = id

				display
					.append('svg:image')
					// .attr('x', -9)
					// .attr('y', -12)
					.attr('width', objectWidth)
					.attr('height', objectHeight)
					.attr("xlink:href", `assets/images/${id}.png`)
					.attr('transform-origin', `top left`)
					.attr('transform', `translate(${d[rectArea].points[0][0]}, ${d[rectArea].points[0][1]})rotate(${d[rectArea].angle})`)
					.attr('class', 'pocket-object')

		}


		const objectMap = d3.map(objectSizes, d => d.id)

		const Chart = {
			// called once at start
			init() {

				$svg = $sel.append('svg.pudding-chart');
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
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svg.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});
				return Chart;
			},
			// update scales and render chart
			render() {
				return Chart;
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
