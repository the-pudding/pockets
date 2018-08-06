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
		let fullWidth = 0
		const marginTop = 60;
		const marginBottom = 0;
		const marginLeft = 40;
		const marginRight = 25;
		const fontSize = 16
		const padding = 10

		// colors
		let transparency = 0.2
		let red = `rgba(231, 80, 63, ${transparency})`
		let gold = `rgba(246, 194, 47, ${transparency})`

		// scales
		const scale = d3.scaleLinear()
		const inch = 0.393 // conversion factor for cm -> inches
		//const scaleY = null;

		// dom elements
		let $svgFront = null;
    let $gFront = null
		let $axis = null;
		let $visFront = null;

		// helper functions
		// Finding maxWidth of men's front pocket
		const men = (data.filter(d => d.key == 'men')[0].value)
		const maxWidths = d3.max(men.map(d => d.maxWidthFront))
		let scaledMaxWidth = null


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
				height = width * 0.6
				$svgFront.at({
					width: width + marginLeft + marginRight,
					height: height + marginTop + marginBottom
				});
				fullWidth = width + marginLeft + marginRight

        scale
          .domain([0, 29])
          .range([0, width * 0.55])

				scaledMaxWidth = scale(maxWidths)

				// if pockets are drawn on page resize, resize them too
				const outlines = $sel.selectAll('.outline, .outline-average')

				if (outlines.size() > 0){
					Chart.update()
				}

				return Chart;
			},
			// update scales and render chart
			render() {
        // Draw front pocket
        $gFront
          .selectAll('.outline')
          .data(d => {
            return d.value
          })
          .enter()
          .append('path')
          .attr('class', d => d.brand == 'average' ? `outline-average` : `outline`)
          .attr('stroke-dasharray', function(d){
            return this.getTotalLength()
          })
          .attr('stroke-dashoffset', function(d){
            return this.getTotalLength()
          })
					.style('fill', 'none')

					const label = $gFront
						.selectAll('.label')
						.data(d => [d])
						.enter()
						.append('text')
						.text(d => d.key)
						.attr('class', 'label tk-atlas')

					const measurements = $gFront
						.append('g')
						.attr('class', 'g-measurements')
						.attr('opacity', 0)

					measurements
						.selectAll('.measure-line-maxHeight')
						.data((d, i) => {
							const brand = d.value
							const length = brand.length
							const average = brand[length - 1]
							return [average]})
						.enter()
						.append('path')
						.attr('class', d => {
							if (d.maxHeightFront < 20){
								return 'measure-line measure-line-maxHeight measure-line-woman'
							}
							else return 'measure-line measure-line-maxHeight measure-line-man'
						})

					measurements
						.selectAll('.measure-line-maxWidth')
						.data((d, i) => {
							const brand = d.value
							const length = brand.length
							const average = brand[length - 1]
							return [average]})
						.enter()
						.append('path')
						.attr('class', d => {
							if (d.maxHeightFront < 20){
								return 'measure-line measure-line-maxWidth measure-line-woman'
							}
							else return 'measure-line measure-line-maxWidth measure-line-man'
						})

						measurements
							.selectAll('.measure-maxHeight-bg')
							.data((d, i) => {
								const brand = d.value
								const length = brand.length
								const average = brand[length - 1]
								return [average]})
							.enter()
							.append('text')
							.text(d => {
								return `${d3.round(d.maxHeightFront * inch, 1)}"`})
							.attr('alignment-baseline', 'hanging')
							.attr('text-anchor', 'middle')
							.attr('class', 'tk-atlas measure-bg measure-maxHeight-bg')

						measurements
	            .selectAll('.measure measure-maxHeight')
	            .data((d, i) => {
								const brand = d.value
								const length = brand.length
								const average = brand[length - 1]
								return [average]})
	            .enter()
	            .append('text')
	            .text(d => {
								return `${d3.round(d.maxHeightFront * inch, 1)}"`})
	            .attr('alignment-baseline', 'hanging')
	            .attr('text-anchor', 'middle')
	            .attr('class', 'tk-atlas measure measure-maxHeight')

							measurements
								.selectAll('.measure-maxWidth-bg')
								.data((d, i) => {
									const brand = d.value
									const length = brand.length
									const average = brand[length - 1]
									return [average]})
								.enter()
								.append('text')
								.text(d => `${d3.round(d.maxWidthFront * inch, 1)}"`)
								.attr('alignment-baseline', 'hanging')
								.attr('text-anchor', 'middle')
								.attr('class', 'tk-atlas measure-bg measure-maxWidth-bg')


						measurements
							.selectAll('.measure measure-maxWidth')
							.data((d, i) => {
								const brand = d.value
								const length = brand.length
								const average = brand[length - 1]
								return [average]})
							.enter()
							.append('text')
							.text(d => `${d3.round(d.maxWidthFront * inch, 1)}"`)
							.attr('alignment-baseline', 'hanging')
							.attr('text-anchor', 'middle')
							.attr('class', 'tk-atlas measure measure-maxWidth')

				Chart.update()

				return Chart;
			},
			// update paths on resize
			update(){
				// update size of outlined pockets
				$gFront
					.selectAll('.outline, .outline-average')
					.attr('d', function(d){
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


					// Update measurements and dimension placement
					const measurements = $gFront.selectAll('.g-measurements')

					measurements
						.selectAll('.measure-line-maxHeight')
						.attr('d', d => {
							let path = null
							if (d.maxHeightFront < 20){
								path = [
									// move to the right padding amount and down padding amount
									"M", [padding, padding],
									// draw a line from initial point straight down the length of the maxHeight
									"l", [-(marginLeft / 2), 0],
									"l", [0, scale(d.maxHeightFront)],
									"l", [padding, 0]
								]
							}
							else {
								path = [
									// move to the right padding amount and down padding amount
									"M", [padding, padding],
									// draw a line from initial point straight down the length of the maxHeight
									"l", [-(marginLeft * 1.2), 0],
									"l", [0, scale(d.maxHeightFront)],
									"l", [(marginLeft * 1.2), 0]
								]
							}
							const joined = path.join(" ")
							return joined
						})

					measurements
						.selectAll('.measure-line-maxWidth')
						.attr('d', d => {
							let path = null
							if (d.maxHeightFront < 20){
								path = [
									// move to the right padding amount and down padding amount
									"M", [padding, padding],
									// draw a line from initial point straight down the length of the maxHeight
									"l", [0, -(marginLeft / 2)],
									"l", [scale(d.maxWidthFront), 0],
									"l", [0, scale(d.minHeightFront - d.rivetHeightFront)]
								]
							}
							else {
								path = [
									// move to the right padding amount and down padding amount
									"M", [padding, padding],
									// draw a line from initial point straight down the length of the maxHeight
									"l", [0, -(marginLeft * 1.2)],
									"l", [scale(d.maxWidthFront), 0],
									"l", [0, scale(d.minHeightFront - d.rivetHeightFront)]
								]
							}
							const joined = path.join(" ")
							return joined
						})

						measurements
							.selectAll('.measure-maxHeight-bg, .measure-maxHeight')
							.attr('transform', d => {
								if (d.maxHeightFront < 20){
									return `translate(${(-marginLeft / 2) + padding}, ${scale(d.maxHeightFront / 2)})`
								}
								else return `translate(${(-marginLeft * 1.2) + padding}, ${scale(d.maxHeightFront / 2)})`
							})

						measurements
							.selectAll('.measure-maxWidth-bg, .measure-maxWidth')
							.attr('transform', d => {
								if (d.maxHeightFront < 20){
									return `translate(${scale(d.maxWidthFront / 2) + padding}, ${-marginLeft / 2})`
								}
								else return `translate(${scale(d.maxWidthFront / 2) + padding}, ${- marginLeft * 1.2})`
							})

					// Move groups
					const wGroup = $svgFront.select('.group-women')
						.attr('transform', `translate(${marginLeft}, ${marginTop})`)

					const mGroup = $svgFront.select('.group-men')
						.attr('transform', `translate(${fullWidth - scaledMaxWidth - marginLeft}, ${marginTop})`)

				return Chart
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
				const measurements = $svgFront.selectAll('.g-measurements')

        function step0(){
          women
            .transition()
            .duration(500)
						.attr('transform', `translate(${marginLeft}, ${marginTop})`)

          women.selectAll('.outline')
            .style('stroke-opacity', 0.1)
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)

          men
            .transition()
            .duration(500)
						.attr('transform', `translate(${fullWidth - scaledMaxWidth - marginLeft}, ${marginTop})`)

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
							.attr('opacity', 0)
							.style('fill', 'none')

            men.selectAll('.outline-average')
              .attr('stroke-dashoffset', function(d){
                return this.getTotalLength()
              })
							.attr('opacity', 0)
							.style('fill', 'none')

						label
							.attr('opacity', 1)

						measurements
							.attr('opacity', 0)
        }

        function step1(){
					women
						.transition()
						.duration(500)
						.attr('transform', `translate(${(marginLeft)}, ${marginTop})`)

					men
						.transition()
						.duration(500)
						.attr('transform', `translate(${fullWidth - scaledMaxWidth - marginLeft}, ${marginTop})`)

          women.selectAll('.outline-average')
            .raise()
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)
						.attr('opacity', 1)
						.style('fill', red)

          men.selectAll('.outline-average')
            .raise()
            .transition()
            .duration(500)
            .delay((d, i) => i * 100)
            .attr('stroke-dashoffset', 0)
						.attr('opacity', 1)
						.style('fill', gold)

          women.selectAll('.outline')
						.style('stroke-opacity', 0.1)
            .transition()
            .duration(800)
            .style('stroke-opacity', 0.05)

          men.selectAll('.outline')
						.style('stroke-opacity', 0.1)
            .transition()
            .duration(800)
            .style('stroke-opacity', 0.05)

					label
						.attr('opacity', 1)

					measurements
						.attr('opacity', 0)
        }

        function step2(){
          women
            .transition()
            .duration(500)
            .attr('transform', `translate(${(fullWidth - scaledMaxWidth) / 2}, ${marginTop})`)

          men
            .transition()
            .duration(500)
						.attr('transform', `translate(${(fullWidth - scaledMaxWidth) / 2}, ${marginTop})`)


            women.selectAll('.outline')
              .transition()
              .duration(800)
              .style('stroke-opacity', 0)

            men.selectAll('.outline')
              .transition()
              .duration(800)
              .style('stroke-opacity', 0)

						women.selectAll('.outline-average')
							.attr('opacity', 1)
							.style('fill', red)

						men.selectAll('.outline-average')
							.attr('opacity', 1)
							.style('fill', gold)

						label
							.transition()
							.duration(800)
							.attr('opacity', 0)

						measurements
							.transition()
							.duration(800)
							.attr('opacity', 1)
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
