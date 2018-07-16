/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.areaChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 0;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scale = d3.scaleLinear()
		//const scaleY = null;

		// dom elements
		let $svgFront = null;
    let $svgBack = null
		let $axis = null;
		let $visFront = null;
    let $visBack = null

		// helper functions

		const Chart = {
			// called once at start
			init() {
        // Add label
        $sel.append('text')
          .text(d => `${d.brand} - ${d.menWomen} - ${d.style}`)

        const container = $sel.append('div.container')
				$svgFront = container.append('svg.area-front');
				const $gFront = $svgFront.append('g');

				// offset chart for margins
				//$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

				// setup viz group
				$visFront = $gFront.append('g.g-vis');

        $svgBack = container.append('svg.area-back');
        const $gBack = $svgBack.append('g');

        // offset chart for margins
        //$g.at('transform', `translate(${marginLeft}, ${marginTop})`);

        // setup viz group
        $visBack = $gBack.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svgFront.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        $svgBack.at({
          width: width + marginLeft + marginRight,
          height: height + marginTop + marginBottom
        });

        scale
          .domain([0, 29])
          .range([0, 280])

				return Chart;
			},
			// update scales and render chart
			render() {
        const padding = 10
        const curve = d3.line()
          .curve(d3.curveCardinal.tension(0.5))

        // Draw front pocket
        const frontGroup = $svgFront.select('.g-vis')

        let areaMeasure = null
        frontGroup
          .selectAll('.outline')
          .data(d => [d])
          .enter()
          .append('path')
          .attr('d', function(d){
            const scaledHeight = scale(d.maxHeightFront)
            const height = d.maxHeightFront
            const path = [
              // move to the right padding amount and down padding amount
              "M", [padding, padding],
              // draw a line from initial point straight down the length of the maxHeight
              "l", [0, scale(d.maxHeightFront)],
            //  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],

              // Add a curve to the other side
              "q", [scale(d.maxWidthFront / 2), scale(0.1 * d.maxHeightFront)], // control point for curve
                [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)], // end point
              // Draw a line straight up to the min height - rivet height
              "l", [0, -scale(d.minHeightFront - d.rivetHeightFront)],
              // Add a curve to the line between rivets
              "q", [-scale(d.maxWidthFront * 2 / 3), scale(0.1 * d.maxHeightFront)],
                [-scale(d.maxWidthFront), -scale(d.rivetHeightFront)]
              //"L", [padding, padding]
            ]
            const numbers = path.filter(d => {
              const remove = ["M", "l", "L", "Q", "q"]
              return !remove.includes(d)
            })
            areaMeasure = d3.polygonArea(numbers)
            console.log(areaMeasure)
            const joined = path.join(" ")
            return joined
          })
          .attr('class', 'outline')

          frontGroup.append('text').text(`Area = ${d3.round(areaMeasure, 0)}`)
            .attr('transform', `translate(0, ${height - (padding * 4)})`)

          // const path = frontGroup.select('.outline').attr('d')
          // const areaMeasure = d3.polygonArea(path)
          // console.log({path, areaMeasure})




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
