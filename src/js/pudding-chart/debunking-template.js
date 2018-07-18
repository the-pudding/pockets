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
    console.log({$sel})
		let data = $sel.datum()
    let location = $sel.at('data-location')
    console.log({data, location})
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
		let $svg = null;
		let $axis = null;
		let $vis = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
        // Add label
        $sel.append('text')
          .text(d => `${d.key}`)

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
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				height = $sel.node().offsetHeight - marginTop - marginBottom;
				$svg.at({
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

        if(location == 'front'){
          //Draw front pocket
          const frontGroup = $svg.select('.g-vis')

          let areaMeasure = null
          frontGroup
            .selectAll('.outline')
            .data(d => {
              console.log(d)
              return d.values})
            .enter()
            .append('path')
            .attr('d', function(d){
              const path = [
                // move to the right padding amount and down padding amount
                "M", [padding, padding],
                // draw a line from initial point straight down the length of the maxHeight
                "l", [0, scale(d.maxHeightFront)],
                ////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
                // Add a curve to the other side
                "q", [scale(d.maxWidthFront / 2), scale(0.1 * d.maxHeightFront)], // control point for curve
                  [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)], // end point
                // Draw a line straight up to the min height - rivet height
                "l", [0, -scale(d.minHeightFront - d.rivetHeightFront)],
                // Add a curve to the line between rivets
                "q", [-scale(d.minWidthFront * 2 / 3), scale(0.1 * d.maxHeightFront)],
                  [-scale(d.minWidthFront), -scale(d.rivetHeightFront)],
                "l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
                ////"L", [padding, padding]
              ]
              const joined = path.join(" ")
              return joined
            })
            .attr('class', 'outline')
        }

        else if(location == 'back'){

            const backGroup = $svg.select('.g-vis')

            backGroup
              .selectAll('.outline')
              .data(d => d.values)
              .enter()
              .append('path')
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
                  //"l", [scale(d.minWidth)]
                  ////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
                  // Add a curve to the other side
                  // "q", [scale(d.maxWidthFront / 2), scale(0.1 * d.maxHeightFront)], // control point for curve
                  //   [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)], // end point
                  // // Draw a line straight up to the min height - rivet height
                  // "l", [0, -scale(d.minHeightFront - d.rivetHeightFront)],
                  // // Add a curve to the line between rivets
                  // "q", [-scale(d.minWidthFront * 2 / 3), scale(0.1 * d.maxHeightFront)],
                  //   [-scale(d.minWidthFront), -scale(d.rivetHeightFront)],
                  // "l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
                  ////"L", [padding, padding]
                ]
                const joined = path.join(" ")
                return joined
              })
              .attr('class', 'outline')

        }



          // frontGroup.append('text').text(`Area = ${d3.round(areaMeasure, 0)}`)
          //   .attr('transform', `translate(0, ${height - (padding * 4)})`)

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
