import './pudding-chart/fit-template'
import loadMeasurements from './load-data'


// data
let data = null
let sortedData = null
let selectedObject = null
let toggleW = null
let toggleM = null
let dimW = null
let dimM = null

let selectedBrand = 'All'
let selectedStyle = 'All'
let selectedPrice = 'All'

// selections
const container = d3.selectAll('.fit-container')
const $fit = container.selectAll('.fit-table')
const brand = container.select('.ui-brand')
const style = container.select('.ui-style')
const price = container.select('.ui-price')
const $nav = d3.select('nav')
const $navUl = $nav.select('nav ul')
const $navLi = $navUl.selectAll('li')

// for nav
let dragPosX = 0
const navCount = $navLi.size()
const navSize = $navLi.node().offsetWidth
const totalW = navCount * navSize
const dragMax = totalW - navSize
const dragOffset = 0

function resize(){}

function setupChart(){
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

  toggleW = charts[0].toggle
  toggleM = charts[1].toggle

  dimW = charts[0].dim
  dimM = charts[1].dim

  setupDropdowns(brand, 'brand')
  setupDropdowns(style, 'updatedStyle')
  setupDropdowns(price, 'priceGroup')
  setupObjectSelect()
}

function setupDropdowns(selection, options){

  selection
    .selectAll('option')
    .data(d => {
        const nestBrands = d3.nest()
          .key(d => d[options])
          .entries(sortedData)
          .map(e => e.key)

        nestBrands.unshift('All')

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
  console.log("clicked")
  const item = d3.select(this)
  const name = item.at('data-type')
  selectedObject = name
  const id = item.at('data-id')
  // This needs to be connected to drag & drop
  dimW(selectedObject, id)
  dimM(selectedObject, id)
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

function handleNavClick(){

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

function init(){
  Promise.all([loadMeasurements()])
    .then((results) => {
      data = results[0]
      setupChart()
      setupNav()
    })
    .catch(err => console.log(err))
}

export default { init, resize };
