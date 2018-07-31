/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.scrollChart = function init(options) {
	function createChart(el) {
		const $sel = d3.select(el);
		let data = $sel.datum();
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 40;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;
		const fontSize = 12

		// scales
		const scale = d3.scaleLinear()
		//const scaleY = null;

		// dom elements
		let $svgFront = null;
    let $gFront = null
		let $axis = null;
		let $visFront = null;

		// helper functions

		const Chart = {
			// called once at start
			init() {
        const container = $sel.append('div.container')


        // Add svg for front pockets
				$svgFront = container.append('svg.scroll-svg');
				$gFront = $svgFront.selectAll('.group-mw')
          .data(data)
          .enter()
          .append('g')
          .attr('class', d => `group-mw group-${d.key}`)

				// setup viz group
				//$visFront = $gFront.append('g.g-vis');

				Chart.resize();
				Chart.render();
			},
			// on resize, update new dimensions
			resize() {
				// defaults to grabbing dimensions from container element
				width = $sel.node().offsetWidth - marginLeft - marginRight;
				//height = $sel.node().offsetHeight - marginTop - marginBottom;
				height = 400 - marginTop - marginBottom;
				$svgFront.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});

        scale
          .domain([0, 29])
          .range([0, height - marginTop])

				return Chart;
			},
			// update scales and render chart
			render() {
        const padding = 10

        // Draw front pocket
        //const frontGroup = $svgFront.select('.g-vis')

        let areaMeasure = null
        $gFront
          .selectAll('.outline')
          .data(d => {
            return d.value
          })
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
          .attr('class', d => d.brand == 'average' ? `outline-average` : `outline`)
					//.attr("transform", "translate(" + (width/2.75) + ",0)")
					.attr('transform', `translate(${width / 2.75}, ${marginTop})`)
          .attr('stroke-dasharray', function(d){
            return this.getTotalLength()
          })
          .attr('stroke-dashoffset', function(d){
            return this.getTotalLength()
          })

					const label = $gFront
						.selectAll('.label')
						.data(d => [d])
						.enter()
						.append('text')
						.text(d => {console.log(d)
							return d.key})
						.attr('class', 'label tk-atlas')
						.attr('transform', `translate(${(width / 2.75) + padding}, ${fontSize})`)

          const groupW = $svgFront.select('.group-women')
            .attr('transform', `translate(${-(width / 3)}, ${fontSize})`)



          $svgFront.select('.group-men')
            .attr('transform', `translate(${width / 3}, ${fontSize})`)

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
      // toggle steps
      toggle(step){
        const women = $svgFront.select('.group-women')
        const men = $svgFront.select('.group-men')
				const label = $svgFront.selectAll('.label')

        function step0(){
          women
            .transition()
            .duration(500)
            .attr('transform', `translate(${-(width / 3)}, ${fontSize})`)

          women.selectAll('.outline')
            .style('stroke-opacity', 0.1)
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)

          men
            .transition()
            .duration(500)
            .attr('transform', `translate(${width / 3}, ${fontSize})`)

          men.selectAll('.outline')
            .style('stroke-opacity', 0.1)
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)

            women.selectAll('.outline-average')
              .attr('stroke-dashoffset', function(d){
                return this.getTotalLength()
              })

            men.selectAll('.outline-average')
              .attr('stroke-dashoffset', function(d){
                return this.getTotalLength()
              })

						label
							.attr('opacity', 1)
        }

        function step1(){
					women
						.transition()
						.duration(500)
						.attr('transform', `translate(${-(width / 3)}, ${fontSize})`)

					men
						.transition()
						.duration(500)
						.attr('transform', `translate(${width / 3}, ${fontSize})`)

          women.selectAll('.outline-average')
            .raise()
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)

          men.selectAll('.outline-average')
            .raise()
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)

          women.selectAll('.outline')
            .transition()
            .duration(800)
            .style('stroke-opacity', 0.05)

          men.selectAll('.outline')
            .transition()
            .duration(800)
            .style('stroke-opacity', 0.05)

					label
						.attr('opacity', 1)
        }

        function step2(){
          women
            .transition()
            .duration(500)
            .attr('transform', `translate(0, ${fontSize})`)

          men
            .transition()
            .duration(500)
            .attr('transform', `translate(0, ${fontSize})`)

            women.selectAll('.outline')
              .transition()
              .duration(800)
              .style('stroke-opacity', 0)

            men.selectAll('.outline')
              .transition()
              .duration(800)
              .style('stroke-opacity', 0)

						label
							.transition()
							.duration(800)
							.attr('opacity', 0)
        }

        // Run specific function based on step
        if (step == 0) step0()
        if (step == 1) step1()
        if (step == 2) step2()

      }
		};
		Chart.init();

		return Chart;
	}

	// create charts
	const charts = this.nodes().map(createChart);
	return charts.length > 1 ? charts : charts.pop();
};
