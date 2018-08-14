// D3 is included by globally by default
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import area from './area';
import scroll from './scroll'
import debunk from './debunking'
import fit from './fit'
import enterView from 'enter-view';
// only for rectangle calculations
import rectCalc from './rect-calc'

const $body = d3.select('body');
let previousWidth = 0;

function resize() {
	// only do resize on width changes, not height
	// (remove the conditional if you want to trigger on height change)
	const width = $body.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
		scroll.resize()
		debunk.resize()
		fit.resize()
		//area.resize();
	}
}

function setupStickyHeader() {
	const $header = $body.select('header');
	if ($header.classed('is-sticky')) {
		const $menu = $body.select('.header__menu');
		const $toggle = $body.select('.header__toggle');
		$toggle.on('click', () => {
			const visible = $menu.classed('is-visible');
			$menu.classed('is-visible', !visible);
			$toggle.classed('is-visible', !visible);
		});
	}
}
function smallMenuToggle() {
	enterView({
		selector: '.intro-prose',
		offset: 0.5,
		enter: function(el) {
			let logo = d3.select('.logo');
			let jeanLabel = d3.select('.is-sticky');

			logo
				.transition()
				.duration(300)
				.style('display', 'none')
				.style('opacity', '0');

			jeanLabel
				.transition()
				.duration(200)
				.style('height', '35px');
		},
		exit: function(el) {
			let logo = d3.select('.logo');
			let jeanLabel = d3.select('.is-sticky');

			jeanLabel
				.transition()
				.duration(200)
				.style('height', '155px');

			logo
				.transition()
				.duration(300)
				.style('display', 'block')
				.style('opacity', '1');
		}
	});
}

function poem() {
	const poemPocket = d3.selectAll('.pocket-wrapper')

	poemPocket.on('click', function(){
		this.classList.toggle('animation-check')
	})
}

function init() {
	// add mobile class to body tag
	$body.classed('is-mobile', isMobile.any());
	// setup resize event
	window.addEventListener('resize', debounce(resize, 150));
	// setup sticky header menu
	setupStickyHeader();
	smallMenuToggle();
	// kick off graphic code
	//area.init();
	poem();
	scroll.init()
	debunk.init()
	fit.init()
	//rectCalc.init()
}

init();
