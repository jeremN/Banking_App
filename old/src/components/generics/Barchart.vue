<template>
	<div class="bar-chart">
		<div class="card-body">
			<svg id="barChart" 
				:style="{ width: settings.width + margin.left + margin.right, height: settings.height +margin.top + margin.bottom, marginTop: margin.top}"
				v-if="scales">
				<g class="chart-y-axis"
					:height="settings.height + margin.top + margin.bottom"
					:width="settings.width + margin.left + margin.right"
					>
					<g v-for="(d, i) in datas"
						:style="{transform: `translate(0, ${settings.height - ((settings.height / datas.length) * i)}px)`}">
						<line x1="0" 
							:x2="settings.width + margin.left">
						</line>
						<text 
							x="0"
							y="-5" 
							dy="0.32em">
							{{ max / datas.length * i | parsedDevise }}
						</text>
					</g>
				</g>
				<g>
					<transition-group 
						v-if="scales"
						appear
						name="list"
						mode="out-in"
						tag="g">
							<g :key="d[xVal]"
								v-for="(d, i) in datas"
								:style="{transform: `translate(${margin.left + margin.top + 5}px , 0)`}">
								<rect 
									class="bar"
									:x="scales.x0(d[xVal])"
									:y="scales.y(d[yVal[0]])"
									:width="scales.x1.bandwidth()"
									:height="settings.height - scales.y(d[yVal[0]])"
									fill="#3498db"
									:key="d[xVal] + d.earn"
									@mouseover="showTooltip(d[xVal], d[yVal[0]])"
									@mouseleave="tooltip.isVisible = false"
								>
								</rect>
								<rect 
									class="bar2"
									:x="scales.x0(d[xVal]) + 25"
									:y="scales.y(d[yVal[1]])"
									:width="scales.x1.bandwidth()"
									:height="settings.height - scales.y(d[yVal[1]])"
									fill="#e74c3c"
									:key="d[xVal] + d[yVal[1]]"
									@mouseover="showTooltip(d[xVal], d[yVal[1]])"
									@mouseleave="tooltip.isVisible = false"
								>
								</rect>
							</g>
					</transition-group>
				</g>	
				<g class="chart-x-axis" :style="{transform: `translate(0 ,${settings.height}px)`}">
					<g 
						class="chart-x-label" 
						v-for="(d, i) in datas" 
						:style="{transform: `translate(${15 + margin.right + margin.left + scales.x0(d[xVal])}px, 0)`}"
						:width="scales.x0.bandwidth()"
						>
						<rect x="-5" y="6" width="2" height="10" fill="#000"></rect>
						<text x="-5" y="20" text-anchor="middle" dy="0.71em">{{ d[xVal] | monthFr }}</text>
					</g>
				</g>
			</svg>
		</div>
		<div 
			class="tooltip" 
			v-if="tooltip.isVisible" 
			:style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }">
			<p>
				{{ tooltip.title | monthFr }} 
				<br> 
				{{ tooltip.value | devise}} 
			</p>
		</div>
	</div>
</template>

<script>
	import * as d3 from 'd3';

	export default {
		data() {
			return {
				settings: {
					width: 590,
					height: 320,
				},
				margin: {
					top: 10,
					right: 20,
					bottom: 30,
					left: 40
				},
				tooltip: {
					isVisible: false,
					title: '',
					value: '',
					x: '',
					y: ''
				},
				sum: {
					earn: '',
					spend: ''
				},
				defaultData: [
					{month: 'Janvier', earn: 0, spend: 0},
					{month: 'Février', earn: 0, spend: 0},
					{month: 'Mars', earn: 0, spend: 0},
					{month: 'Avril', earn: 0, spend: 0},
					{month: 'Mai', earn: 0, spend: 0},
					{month: 'Juin', earn: 0, spend: 0},
					{month: 'Juillet', earn: 0, spend: 0},
					{month: 'Août', earn: 0, spend: 0},
					{month: 'Septembre', earn: 0, spend: 0},
					{month: 'Octobre', earn: 0, spend: 0},
					{month: 'Novembre', earn: 0, spend: 0},
					{month: 'Décembre', earn: 0, spend: 0}
				],
				max: ''
			}
		},
		props: {
			datas: Array,
			xVal: String,
			yVal: Array
		},
		mounted() {
			this.scales
		},
		computed: {
			scales() {
				return this.getScales(this.datas)
			}
		},
		methods: {
			getScales(data) {
				if( !data || typeof data === undefined ) {
					return
				}
				const x0 = d3.scaleBand().range([0, this.settings.width]).padding(0.1)
				const x1 = d3.scaleBand().padding(0.05)
				const y = d3.scaleLinear().range([this.settings.height, 0])

				this.max = d3.max(data.map( d => d3.max([d[this.yVal[0]], d[this.yVal[1]]]) ))
				x0.domain(data.map( d => d.month ))
				x1.domain(data.map( d => d[this.xVal])).rangeRound([0, x0.bandwidth()])
				y.domain([0, this.max])

				return {x0, x1, y}
			},
			showTooltip(name, value) {
				this.tooltip.isVisible = true
				this.tooltip.title = name
				this.tooltip.value = value
				this.tooltip.x = event.layerX + 70
				this.tooltip.y = event.layerY + 20
			},
		}
	}
</script>

<style lang='scss' scoped>
	line {
		stroke: #f4f7f9;
		stroke-width: 2px;
	}
	text {
		font-size: 12px;
		font-weight: bold;
	}
	rect {
		transform-origin: 0 320px; 
	}
	.chart-y-ticks {
		display: flex;
		flex-direction: column-reversed;

		& > text {
			fill: #c9d4d7;
		}
	}
	.chart-x-axis {
		text-align: center;
	}
	.card-chart .card-body {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tooltip {
		background-color: #fff;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 4px 24px -1px rgba(0,0,0,0.1);
		padding: 1em;
		font-size: 14px;
	}
   .list-enter-active, .list-leave-active {
      transition: all 1s;
      transform: scale(1,1)
    }
    .list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
      opacity: 0;
      transform: scale(1,0);
    }
</style>