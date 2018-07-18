/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.fitChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
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
    let brands = null

		// helper functions

		const Chart = {
			// called once at start
			init() {
        // Add label
        $sel.append('text')
          .text(d => `${d.key}`)

        const container = $sel.append('div.container')

        // Add svg for front pockets
				brands = container.selectAll('.fit-brand')
          .data(d => d.values)
          .enter()
          .append('div.area-front')
          .attr('class', 'fit-brand')

        $svg = brands.append('svg.fit-canvas')
        const text = brands.append('div.text')
        text.append('text.brand.tk-atlas').text(d => d.brand)
        text.append('text.style.tk-atlas').text(d => d.updatedStyle)

				const $g = $svg.append('g');

				// setup viz group
				$vis = $g.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = brands.node().offsetWidth - marginLeft - marginRight;
				height = brands.node().offsetHeight - marginTop - marginBottom;
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

        // Draw front pocket
        const frontGroup = $svg.select('.g-vis')
        console.log({$svg})

        let areaMeasure = null
        frontGroup
          .selectAll('.outline')
          .data(d => [d])
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
            const numbers = path.filter(d => {
              const remove = ["M", "l", "L", "Q", "q"]
              return !remove.includes(d)
            })
            areaMeasure = d3.polygonArea(numbers)
            const joined = path.join(" ")
            return joined
          })
          .attr('class', 'outline')

          frontGroup
            .selectAll('.measure measure-maxHeight')
            .data(d => [d])
            .enter()
            .append('text')
            .text(d => d.maxHeightFront)
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'end')
            .attr('transform', d => `translate(${padding/2}, ${scale(d.maxHeightFront / 2)})`)
            .attr('class', 'tk-atlas measure measure-maxHeight')

            frontGroup
              .selectAll('.measure measure-minHeight')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => d.minHeightFront)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'start')
              .attr('transform', d => `translate(${scale(d.maxWidthFront) + (padding * 1.5)}, ${scale(d.rivetHeightFront + ((d.minHeightFront - d.rivetHeightFront ) / 2))})`)
              .attr('class', 'tk-atlas measure measure-minHeight')
            frontGroup
              .selectAll('.measure measure-maxWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => d.maxWidthFront)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('transform', d => `translate(${scale(d.maxWidthFront / 2) + padding}, ${scale(d.maxHeightFront) + (padding * 2.5)})`)
              .attr('class', 'tk-atlas measure measure-maxWidth')

            frontGroup
              .selectAll('.measure measure-minWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => d.minWidthFront)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('transform', d => `translate(${scale((d.maxWidthFront - d.minWidthFront) + (d.minWidthFront / 2)) + padding}, ${scale(d.rivetHeightFront / 2)})`)
              .attr('class', 'tk-atlas measure measure-minWidth')

            const groupWidth = frontGroup.node().getBBox().width

            frontGroup
              .attr('transform', function(d){
                const boxWidth = this.getBBox().width
                const leftBBox = frontGroup.selectAll('.measure-maxHeight').node().getBBox().width
                const difWidth = ((width - boxWidth) / 2) + leftBBox//Math.max((width - calcWidth) / 2, 30)

                return `translate(${difWidth}, 0)`
              })

          // const backGroup = $svgBack.select('.g-vis')
          //
          // backGroup
          //   .selectAll('.outline')
          //   .data(d => d.values)
          //   .enter()
          //   .append('path')
          //   .attr('d', function(d){
          //     const path = [
          //       // move to the right padding amount and down padding amount
          //       "M", [padding, padding],
          //       // draw a line from initial point straight down the length of the maxHeight
          //       "l", [scale((d.maxWidthBack - d.minWidthBack) / 2), scale(d.minHeightBack)],
          //       "l", [scale(d.minWidthBack / 2), scale(d.maxHeightBack - d.minHeightBack)],
          //       "l", [scale(d.minWidthBack / 2), -scale(d.maxHeightBack - d.minHeightBack)],
          //       "l", [scale((d.maxWidthBack - d.minWidthBack) / 2), - scale(d.minHeightBack)],
          //       "l", [-scale(d.maxWidthBack), 0]
          //       //"l", [scale(d.minWidth)]
          //       ////  "l", [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)],
          //       // Add a curve to the other side
          //       // "q", [scale(d.maxWidthFront / 2), scale(0.1 * d.maxHeightFront)], // control point for curve
          //       //   [scale(d.maxWidthFront), scale(d.minHeightFront - d.maxHeightFront)], // end point
          //       // // Draw a line straight up to the min height - rivet height
          //       // "l", [0, -scale(d.minHeightFront - d.rivetHeightFront)],
          //       // // Add a curve to the line between rivets
          //       // "q", [-scale(d.minWidthFront * 2 / 3), scale(0.1 * d.maxHeightFront)],
          //       //   [-scale(d.minWidthFront), -scale(d.rivetHeightFront)],
          //       // "l", [-scale(d.maxWidthFront - d.minWidthFront), 0]
          //       ////"L", [padding, padding]
          //     ]
          //     const numbers = path.filter(d => {
          //       const remove = ["M", "l", "L", "Q", "q"]
          //       return !remove.includes(d)
          //     })
          //     areaMeasure = d3.polygonArea(numbers)
          //     const joined = path.join(" ")
          //     return joined
          //   })
          //   .attr('class', 'outline')

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
