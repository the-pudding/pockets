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
		// dimension stuff
		let width = 0;
		let height = 0;
		const marginTop = 50;
		const marginBottom = 0;
		const marginLeft = 0;
		const marginRight = 0;

		// scales
		const scale = d3.scaleLinear()
		const padding = 10
		const inch = 0.393 // conversion factor for cm -> inches
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

		const rectData = []

		function pocketShape(sel, newData){
			let d = newData
			const g = sel
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

		}

		function drawPocket(d){
			let g = d3.select(this)
			// let joined = pocketShape(g, d)

			const drawnPocket = g
				.append('path.outline')
				//.attr('d', joined)

			//const largestRectHand = d.rectangleHand

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

    function drawObject(d, selObject, group, id){
      // d3.selectAll('rect')
      //   .transition()
      //   .duration(300)
      //   .opacity(0)
      //   .remove()

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
			// 	.attr('width', scale(objectMap.get(id).fingerWidth))
			// 	.attr('height', scale(objectMap.get(id).fingerHeight))
      //   .attr('transform-origin', `top left`)
      //   .attr('transform', `translate(${d[rectArea].points[0][0]}, ${d[rectArea].points[0][1]})rotate(${d[rectArea].angle})`)
      //   // .attr('transform', `rotate(${d[rectArea].angle})`)
      //   .attr('transform-origin', `${d[rectArea].cx} ${d[rectArea.cy]}`)
      //   .style('fill', 'none')
      //   .style('stroke', '#fff')
      //   .style('stroke-width', '1px')

        const objectID = id

				if (selObject != 'hand'){
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

				else {
					display
						.append('svg:image')
						// .attr('x', -9)
						// .attr('y', -12)
						.attr('width', scale(objectMap.get(id).fingerWidth))
						.attr('height', scale(objectMap.get(id).fingerHeight))
						.attr("xlink:href", `assets/images/${id}.png`)
						.attr('transform-origin', `top left`)
						.attr('transform', `translate(${d[rectArea].points[0][0] + ((scale(objectMap.get(id).fingerWidth) - objectWidth) / 2)}, ${d[rectArea].points[0][1]})rotate(${d[rectArea].angle})`)
						.attr('class', 'pocket-object')
				}



    }


    const objectMap = d3.map(objectSizes, d => d.id)

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
          .attr('class', d => `fit-brand visible ${d.menWomen}`)

        display = brands.append('div.display')
        let tooltip = brands.append('div.tooltip')

        $svg = display.append('svg.fit-canvas')
        const text = display.append('div.text')
				const leftText = text.append('div.leftText')
					//text.append('text.style.tk-atlas').text(d => d.updatedStyle)

				const rightText = text.append('div.rightText')
        leftText.append('text.style.tk-atlas').text(d => d.updatedStyle)
				leftText.append('text.brand.tk-atlas').text(d => d.brand)
				rightText.append('text.tag.tk-atlas').text(d => (d.menWomen).substring(0, 1))

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
				const innerWidth = window.innerWidth
				let chartWidth = null
				if (innerWidth >= 900) chartWidth = 225
				else if (innerWidth < 900) chartWidth = Math.max(innerWidth / 4, 150)
				console.log({$sel})

				const blocks = $sel.selectAll('.fit-brand')
					.st('width', chartWidth)
					.st('height', chartWidth * 1.5)

				blocks.selectAll('.display, .tooltip')
					.st('width', chartWidth)
					.st('height', chartWidth * 1.5)

				width = blocks.node().offsetWidth - marginLeft - marginRight;
				height = (width) - marginTop - marginBottom//$sel.node().offsetHeight - marginTop - marginBottom;

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

					console.log({frontGroup})

          frontGroup
            .selectAll('.measure measure-maxHeight')
            .data(d => [d])
            .enter()
            .append('text')
            .text(d => `${d3.round(d.maxHeightFront * inch, 1)}"`)
            .attr('alignment-baseline', 'hanging')
            .attr('text-anchor', 'end')
            .attr('class', 'tk-atlas measure measure-maxHeight')

            frontGroup
              .selectAll('.measure measure-minHeight')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.minHeightFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'start')
              .attr('class', 'tk-atlas measure measure-minHeight')

            frontGroup
              .selectAll('.measure measure-maxWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.maxWidthFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('class', 'tk-atlas measure measure-maxWidth')

            frontGroup
              .selectAll('.measure measure-minWidth')
              .data(d => [d])
              .enter()
              .append('text')
              .text(d => `${d3.round(d.minWidthFront * inch, 1)}"`)
              .attr('alignment-baseline', 'hanging')
              .attr('text-anchor', 'middle')
              .attr('class', 'tk-atlas measure measure-minWidth')

					Chart.update()

				return Chart;
			},
			update(){
				$svg.selectAll('.outline')
					.attr('d', function(d){
						let g = d3.select(this)
						let joined = pocketShape(g, d)
						return joined
					})

				const frontGroup = $svg.selectAll('.g-vis')

				frontGroup.selectAll('.measure-maxHeight')
				  .attr('transform', d => `translate(${padding/2}, ${scale(d.maxHeightFront / 2)})`)

				frontGroup.selectAll('.measure-minHeight')
					.attr('transform', d => `translate(${scale(d.maxWidthFront) + (padding * 1.5)}, ${scale(d.rivetHeightFront + ((d.minHeightFront - d.rivetHeightFront ) / 2))})`)

				frontGroup.selectAll('.measure-maxWidth')
					.attr('transform', d => `translate(${scale(d.maxWidthFront / 2) + padding}, ${scale(d.maxHeightFront) + (padding * 2.5)})`)

				frontGroup.selectAll('.measure-minWidth')
					.attr('transform', d => `translate(${scale((d.maxWidthFront - d.minWidthFront) + (d.minWidthFront / 2)) + padding}, ${scale(d.rivetHeightFront / 2)})`)

				const groupWidth = frontGroup.node().getBBox().width

				console.log({frontGroup})

				frontGroup
					.attr('transform', function(d){
						const boxWidth = this.getBBox().width
						const leftBBox = frontGroup.selectAll('.measure-maxHeight').node().getBBox().width
						const difWidth = ((width - boxWidth) / 2) + (leftBBox / 2)

						return `translate(${difWidth}, 0)`
					})

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
            if (selObject == 'phone') rectArea = 'rectanglePhone'
            if (selObject == 'pen') rectArea = 'rectanglePen'
            if (selObject == 'wallet') rectArea = 'rectangleWallet'
						if (selObject == 'hand') rectArea = 'rectangleHand'

            let objectWidth =  scale(objectMap.get(id).width)
            let objectHeight = scale(objectMap.get(id).height)

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
