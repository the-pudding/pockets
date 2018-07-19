/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/
//import d3plus from 'd3plus-shape'

d3.selection.prototype.fitChart = function init(options) {
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
        //console.log({display})
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

        let areaMeasure = null
        let rect = []
        let numbers = null
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
            numbers = path.filter(d => {
              const remove = ["M", "l", "L", "Q", "q"]
              return !remove.includes(d)
            })

            rect.push(d3plus.largestRect(numbers))
            let brandPrint = d.brand
            areaMeasure = d3.polygonArea(numbers)
            const joined = path.join(" ")
            return joined
          })
          .attr('class', 'outline')
          //
          // new d3plus.Rect()
          //   .data([rect])
          //   .render()

          const rectAppend = frontGroup
            .selectAll('.rectangle')
            .data(rect)
            .enter()
            .append('rect')
            .attr('x', d => d.cx)
            .attr('y', d => d.cy)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('transform', d => `translate(0, 150) rotate(${d.angle})`)
            .attr('class', 'rectangle')

            // new d3plus.Path()
            //   .container(frontGroup)
            //   .data(numbers)
            //   .render()

              const line = d3.line()
                .x(d => d[0])
                .y(d => d[1])

            //     console.log(numbers)
            // const rectAppend = frontGroup
            //   .selectAll('.testPath')
            //   .data(numbers)
            //   .enter()
            //   .append('line', d => {
            //     console.log("running")
            //     return line(d)})
            //   .attr('testPath')



          //  console.log({rectAppend, frontGroup})

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
                const difWidth = ((width - boxWidth) / 2) + (leftBBox / 2)//Math.max((width - calcWidth) / 2, 30)

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
            console.log(path)
            const test = d3plus.path2polygon(path, [20])
            console.log({test})
            const minWidth = d.minWidthFront
            const minHeight = d.minHeightFront - d.rivetHeightFront
            //console.log({objectWidth, objectHeight, minWidth, minHeight})
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
