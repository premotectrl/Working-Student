<template>
    <div class="flex-Container KpisContainer secondary-kpis-column">
        <div class="header header-bold">{{ title }}</div>
        
        <div class="flexChartContainer">

            <div class="flChart">
                <canvas class="chart chart-doughnut" width="100" height="100" :id="chartId"></canvas>
                 <div class="chartItem">
                        <img v-if="donutIcon" :src="donutIcon" alt="" class="holeIcon">
                        <!--<span v-if="!icon" class="kpi-summary-value">{{StateCount}}</span> -->
                </div>       
            </div>
            <div class="legend-table" v-if="!hideLegend">
                <table  class="stop-resize" align="left">
                    <tr v-for="(item, index) in make_DataArray" :key="index">
                        <td class="icon-col">
                            <img class="legend-table-color" :src="item.state.icon">
                        </td>
                        <td v-if="showCount == false" class="legend-table-value count-col">{{item.state.data}}&#37;</td>
                        <td class="legend-table-label title-col">{{ item.state.label }}</td>
                        <!---- Historical Data -->
                        <!--<td v-if="fleetDataCurrentState==true" class="legend-table-value count-col">{{item.state.currentData}}</td>
                        <td v-else-if="fleetConnectionHistorical==true" class="legend-table-value count-col">{{item.state.historicalData}}&#37;</td> -->
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js';
    import {GUID} from '../utils/utils';

    const updateGraph = (chart, make_DataArray) => {
            const ArrayTemp = make_DataArray;
            chart.config.data.datasets[0].data.forEach(function(_, idx) {
                chart.config.data.datasets[0].data[idx] = ArrayTemp[idx].state.data;
            });
            chart.update();
        };

    export default {
        name: "kuka-donut-chart",
        props: {
            make_DataArray: Array,
            donutIcon: String,
            //colors: Array,
            title: String,
            hideLegend: Boolean,
            chartConfig: Object,
        },
        data() {
            return {
                showCount: false,
                id: null,
                options: {
                    cutoutPercentage: 70,
                    animation: {
                        animateRotate: false,
                        animateScale: false,
                    },
                    responsive: false,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    },
                },
                donut: null,
                displayColors: this.colors ? this.colors : ['#6EC8A0', '#CF2027',
                                                            '#285885', '#9F547D',
                                                            '#FFCD00', '#FF5800'],
            };
        },
        computed: {
            chartId() {
                if (!this.id) {
                    this.id = GUID();
                }
                return this.id;
            },
        },
        methods: {
        
        },
        mounted() {
            const ctx = document.getElementById(this.chartId).getContext('2d');
           /* const config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: this.dataPoints,
                        backgroundColor: this.displayColors,
                        borderWidth: [0, 0, 0, 0, 0],
                    }],
                    labels: this.labels
                },
                options: this.options,
            }; */
            const config = this.chartConfig;
            this.donut = new Chart(ctx, config);
            this.donut.update();
        },
        watch: {
            make_DataArray: {
                handler: function(make_DataArray) {
                    updateGraph(this.donut, make_DataArray);
                },
                deep: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../styles/variables";
     @import "../styles/MobileRoboticsPlugin";

    .flex-Container {
            display: flex;
            flex-direction:column;
            justify-content: left;
          }
        
        .flexChartContainer {
            display: flex;
            width: 280pt;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            padding-left: 20px;
        }
        
        .flChart {
            position: relative; 
            display: block;
            //height: 150px;
           // width: 150px;
        }

        .chartItem {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .KpisContainer {
            padding-left: 20px;
            padding-bottom: 1%;
        }
        
        .holeIcon {
            width: 20%;
        }
        
        .kText {
            font-family: kuka-bulo;
            line-height: 1em;
            font-size: 1em;
        }
        
        .secondary-kpis-column-header {
            font-size: 1rem;
            font-family: kuka-bulo-bold;
            color: #676c71;
            margin:10px 0 20px 0;
        }

        .stop-resize {
            table-layout: fixed;
            white-space:nowrap;
        }
        
        .stop-resize td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .icon-col {
            width: 10%;
        }

        .count-col {
            width: 10%;
        }
        
        .title-col {
            width:80%;
        }
        
        .legend-table-value {
            text-align: left;
        }

</style>
