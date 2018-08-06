import './pudding-chart/fit-template'
import './pudding-chart/animate-template'
import loadMeasurements from './load-data'


// data
let data = null
let sortedData = null
let selectedObject = null
let toggleW = null
let toggleM = null
let dimW = null
let dimM = null

let selectedBrand = 'All brands'
let selectedStyle = 'All styles'
let selectedPrice = 'All prices'

// selections
const section = d3.select('.fit')
const figure = section.select('figure')
const container = section.selectAll('.fit-container')
const $fit = container.selectAll('.fit-table')
const brand = container.select('.ui-brand')
const style = container.select('.ui-style')
const price = container.select('.ui-price')
const $nav = d3.select('nav')
const $navUl = $nav.select('nav ul')
const $navLi = $navUl.selectAll('li')
const $btn = section.select('.btn');

// animation selections
const $animation = section.selectAll('.drag-animation')
let animateW = null
let animateM = null

let allAnimation = []
let allBrands = []

// for nav
let dragPosX = 0
const navCount = $navLi.size()
const navSize = $navLi.node().offsetWidth
const totalW = navCount * navSize
const dragMax = totalW - navSize
const dragOffset = 0

function resize(){
  $navLi.classed('is-active', false)
  allAnimation.forEach( chart => {
    chart.resize()
  })

  allBrands.forEach(chart => {
    chart.resize()
  })
}

function setupAnimateChart(){
  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(data)

    const nest2 = d3.nest()
      .key(d => d.menWomen)
      .rollup((leaves, i) => {
        const average = {
          brand: 'average',
          maxHeightFront: d3.round(d3.mean(leaves, d => d.maxHeightFront), 1),
          minHeightFront: d3.round(d3.mean(leaves, d => d.minHeightFront), 1),
          rivetHeightFront: d3.round(d3.mean(leaves, d => d.rivetHeightFront), 1),
          maxWidthFront: d3.round(d3.mean(leaves, d => d.maxWidthFront), 1),
          minWidthFront: d3.round(d3.mean(leaves, d => d.minWidthFront), 1),
          maxHeightBack: d3.round(d3.mean(leaves, d => d.maxHeightBack), 1),
          minHeightBack: d3.round(d3.mean(leaves, d => d.minHeightBack), 1),
          maxWidthBack: d3.round(d3.mean(leaves, d => d.maxWidthBack), 1),
          minWidthBack: d3.round(d3.mean(leaves, d => d.minWidthBack), 1),
        }
        return average
      })
      .entries(data)

  const $sel = d3.select(this)

  const charts = $animation
    .selectAll('.chart')
    .data(nest2)
    .enter()
    .append('div.chart')
    //.at('data-object', selectedObject)
    .animateChart()

  allAnimation = allAnimation.concat(charts).filter(d => d)

  animateW = charts[1].animate
  animateM = charts[0].animate
}

function setupFitChart(){
  const $sel = $fit

  sortedData = data.sort((a, b) => {
    return d3.ascending(a.brand, b.brand)
  })

  const nestedData = d3.nest()
    .key(d => d.menWomen)
    .entries(sortedData)

  const charts = $sel
    .selectAll('.chart')
    .data(nestedData)
    .enter()
    .append('div.chart')
    //.at('data-object', selectedObject)
    .fitChart()

  allBrands = allBrands.concat(charts).filter(d => d)

  toggleW = charts[0].toggle
  toggleM = charts[1].toggle

  dimW = charts[0].dim
  dimM = charts[1].dim

  setupDropdowns(brand, 'brand', 'brands')
  setupDropdowns(style, 'updatedStyle', 'styles')
  setupDropdowns(price, 'priceGroup', 'prices')
  setupObjectSelect()
}

function setupDropdowns(selection, options, filter){

  selection
    .selectAll('option')
    .data(d => {
        const nestBrands = d3.nest()
          .key(d => d[options])
          .entries(sortedData)
          .map(e => e.key)

        nestBrands.unshift('All ' + filter)

        return nestBrands
    })
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d)

    selection.on('change', updateSelection)
}

function updateSelection(){
  const dropdown = d3.select(this).at('data-dropdown')
  const selection = this.value

  if (dropdown == 'price') selectedPrice = selection
  if (dropdown == 'brand') selectedBrand = selection
  if (dropdown == 'style') selectedStyle = selection

  toggleW(selectedBrand, selectedPrice, selectedStyle)
  toggleM(selectedBrand, selectedPrice, selectedStyle)


}

function setupObjectSelect(){
  const dragSection = d3.select('.drag')
  const items = dragSection.selectAll('.click-item')
    .on('click', handleObjectClick)
}

function handleObjectClick(){
  const clickSentence = section.select('.click-sentence')
  const statSentence = section.select('.stat-sentence')
  if (clickSentence.classed('is-visible')) {
    clickSentence.classed('is-visible', false)
    statSentence.classed('is-visible', true)
  }

  $navLi.classed('is-active', false)
  const item = d3.select(this)

  item.classed('is-active', true)
  const name = item.at('data-type')
  selectedObject = name
  const id = item.at('data-id')
  // This needs to be connected to drag & drop
  dimW(selectedObject, id)
  dimM(selectedObject, id)
  animateW(selectedObject, id)
  animateM(selectedObject, id)
}

function prefix(prop) {
	return [prop, `webkit-${prop}`, `ms-${prop}`];
}

function handleDrag() {
	const { x } = d3.event;
	const diff = dragPosX - x;
	dragPosX = x;

	const prev = +$navUl.at('data-x');
	const cur = Math.max(0, Math.min(prev + diff, dragMax));

	const index = Math.min(
		Math.max(0, Math.floor(cur / dragMax * navCount)),
		navCount - 1
	);
	const trans = (cur - dragOffset) * -1;

	$navLi.classed('is-current', (d, i) => i === index);
	$navUl.at('data-x', cur);

	const prefixes = prefix('transform');
	prefixes.forEach(pre => {
		const transform = `translateX(${trans}px)`;
		$navUl.node().style[pre] = transform;
	});
}

function handleDragStart() {
	const { x } = d3.event;
	dragPosX = x;
	$navUl.classed('is-dragend', false);
	$nav.classed('is-drag', true);
}

function handleDragEnd() {
	const cur = +$navUl.at('data-x');
	const index = Math.min(
		Math.max(0, Math.floor(cur / dragMax * navCount)),
		navCount - 1
	);
	const x = index * navSize;
	const trans = (x - dragOffset) * -1;

	$navUl.at('data-x', x);

	const prefixes = prefix('transform');
	prefixes.forEach(pre => {
		const transform = `translateX(${trans}px)`;
		$navUl.node().style[pre] = transform;
	});

	$navUl.classed('is-dragend', true);
	$nav.classed('is-drag', false);
}


function setupNav() {
	const drag = d3.drag();
	$navUl.call(
		d3
			.drag()
			.on('drag', handleDrag)
			.on('start', handleDragStart)
			.on('end', handleDragEnd)
	);
  $navLi.on('click', handleObjectClick)
}

function setupExpand(){
  $btn.on('click', () => {
		const truncated = figure.classed('is-truncated');
		const text = truncated ? 'Show Fewer' : 'Show All';
		$btn.text(text);
		figure.classed('is-truncated', !truncated);

		if (!truncated) {
			const y = +$btn.at('data-y');
			window.scrollTo(0, y);
		}

		$btn.at('data-y', window.scrollY);
		figure.select('.show-more').classed('is-visible', !truncated);
	});
}

function init(){
  Promise.all([loadMeasurements()])
    .then((results) => {
      data = results[0]
      setupAnimateChart()
      setupFitChart()
      setupNav()
      setupExpand()
      resize()
    })
    .catch(err => console.log(err))
}

export default { init, resize };
