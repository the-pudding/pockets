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
    console.log({object})
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
    }, {
      object: 'wallet',
      width: 8.4,
      height: 10.4
    }, {
      object: 'pen',
      width: 0.8,
      height: 14.5
    }, {
      object: 'hand',
      width: 7.4,
      height: 17.2
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

			const drawnPocket = g
				.append('path.outline')
				.attr('d', joined)

        // let rectArea = null
        // if (object == 'phone' || object == 'hand') rectArea = 'rectanglePhone'
        // if (object == 'pen') rectArea = 'rectanglePen'
        // if (object == 'wallet') rectArea = 'rectangleWallet'
        //
        // // draw object
        // const display = g//$svg.selectAll('.g-vis')
        //   .append('rect.object')
        //   .attr('width', d => d[rectArea].width)
        //   .attr('height', d => d[rectArea].height)
        //   .attr('transform', `rotate(${d[rectArea].angle})`)
        //   .attr('transform-origin', `${d[rectArea].cx} ${d[rectArea.cy]}`)

        	// .attr('d', d => {
        	// 	const path = [
        	// 		"M", d.rectangleWallet.points[0],
        	// 		"L", d.rectangleWallet.points[1],
        	// 		"L", d.rectangleWallet.points[2],
        	// 		"L", d.rectangleWallet.points[3],
        	// 		"L", d.rectangleWallet.points[4]
        	// 	]
        	// 	const joined = path.join(" ")
        	// 	return joined
        	// })

        // g
  			// 	.append('path.largestRect')
  			// 	.attr('d', d => {
  			// 		const path = [
  			// 			"M", d.rectangleWallet.points[0],
  			// 			"L", d.rectangleWallet.points[1],
  			// 			"L", d.rectangleWallet.points[2],
  			// 			"L", d.rectangleWallet.points[3],
  			// 			"L", d.rectangleWallet.points[4]
  			// 		]
  			// 		const joined = path.join(" ")
  			// 		return joined
  			// 	})
		}

    function drawObject(d, selObject, group, id){
      // d3.selectAll('rect')
      //   .transition()
      //   .duration(300)
      //   .opacity(0)
      //   .remove()

      const g = group

      let rectArea = null
      if (selObject == 'phone' || selObject == 'hand') rectArea = 'rectanglePhone'
      if (selObject == 'pen') rectArea = 'rectanglePen'
      if (selObject == 'wallet') rectArea = 'rectangleWallet'

      // draw object
      const display = g//$svg.selectAll('.g-vis')
      let objectWidth =  scale(objectMap.get(selObject).width)
      let objectHeight = scale(objectMap.get(selObject).height)

      const drawnObject = display
        .append('rect.object')
        .attr('width', objectWidth)
        .attr('height', objectHeight)
        .attr('transform-origin', `top left`)
        .attr('transform', `translate(${d[rectArea].points[0][0]}, ${d[rectArea].points[0][1]})rotate(${d[rectArea].angle})`)
        // .attr('transform', `rotate(${d[rectArea].angle})`)
        .attr('transform-origin', `${d[rectArea].cx} ${d[rectArea.cy]}`)
        .style('fill', 'none')
        .style('stroke', '#fff')
        .style('stroke-width', '1px')

        const objectID = id
        console.log({g})

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
          .attr('preserveAspectRatio', 'false')

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
      dim(selObject, id){

        brands
          .select('.display')
          .classed('dimmed', function(d){
            let rectArea = null
            if (selObject == 'phone' || selObject == 'hand') rectArea = 'rectanglePhone'
            if (selObject == 'pen') rectArea = 'rectanglePen'
            if (selObject == 'wallet') rectArea = 'rectangleWallet'

            let objectWidth =  scale(objectMap.get(selObject).width)
            let objectHeight = scale(objectMap.get(selObject).height)

            const largestRect = d[rectArea]
            const rectWidth = largestRect.width
            const opening = scale(d.minWidthFront)
            const rectHeight = largestRect.height

            if (objectWidth > scale(d.minWidthFront) || objectWidth > largestRect.width || objectHeight > largestRect.height){
              const opening = d.minWidthFront
              return true
            }
            else return false
          })

        const allDimmed = $sel.selectAll('.dimmed').size()
        const allPockets = $sel.selectAll('.display').size()

        if(data.key == 'women'){
          d3.select('.stat-women')
            .text(`${d3.round(100 - ((allDimmed/allPockets) * 100), 0)}%`)
        }
        else if(data.key == 'men'){
          d3.select('.stat-men')
            .text(`${d3.round(100 - ((allDimmed/allPockets) * 100), 0)}%`)
        }

        // draw selected object
        const frontGroup = $svg.select('.g-vis')
        frontGroup.selectAll('.pocket-object').remove()

        frontGroup
          .selectAll('.outline-object')
          .data(d => [d])
          .enter()
          .append('g')
          .each(function(d){
            const g = d3.select(this)
            drawObject(d, selObject, g, id)})



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
