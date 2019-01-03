import {
    Component, OnInit, OnChanges, Input, SimpleChanges, SimpleChange, ElementRef, ViewChild,
    AfterViewInit
} from '@angular/core';
import * as ChartsJs from 'chart.js';
import {Colors} from "../models/colors";


export interface GaugeConfig {
    title: string;
    defaultIcon: string;
    icons: string[];
    thresholds: number[];
    colors: string[];
    showNeedle: boolean;
}

@Component({
    selector: 'gauge',
    template: `
        <div *ngIf="_gaugeConfig" class="row">
            <!-- .............stacked version1.................. -->
            <!-- .............guage Pointer.................. -->
            <div class="col-sm-6X" id="gaugeContainer">
                <div >
                    <!--.canvas and CanvasY form the pointer-->
                    <canvas #cvsP id="canvasP" width="150" height="150"></canvas>
                    <canvas #cvsP2 id="canvasP2"  width="150" height="150"></canvas>
                    
                    <!--.canvasBck is the backdrop on which we slide.. can be replaced with any graphic -->
                    <canvas #cvsB id="canvasBck"  width="150" height="150"></canvas>
                    <canvas #cvsF id="canvasF"  width="150" height="150"></canvas>
                   
                    <!-- ...........Embed Icon.............. -->
                    <img *ngIf="icon" src="{{icon}}" id="gaugeIcon">

                    <!-- ...........Embed middle Point.............. -->
                    <svg version="1.1" *ngIf ="_gaugeConfig.showNeedle == true"  id="pointerDot" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 85 35" xml:space="preserve">
                        <circle fill="#676C71" cx="43" cy="1.7" r="1.5" />
                    </svg>
                    
                    <!-- ...........Percentage values and Avg Name.............. -->
                    <svg version="1.1" id="percentageValue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 85 35" xml:space="preserve">
                        <text x="45" y="10" font-family:kuka-bulo font-size="10px" text-anchor="middle" attr.fill="{{color}}">{{_gaugeLevel}} &#37;</text>
                        <text class="chart-title" x="43" y="30" text-anchor="middle" font-size="6px">{{_gaugeConfig.title}}</text>
                    </svg>

                </div>
            </div>
        </div>
    `,
    styles: [
        `
            #gaugeContainer{
                /**adjust gauge size with this**/
                position: relative;
                /*width:180px;*/
            }
            #canvasP{
                position: absolute;
               /* height: 30%; */
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }

            #canvasBck{
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }
            #canvasF{
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }

            /*********************** icons and text over the canvas*****/
    
            .holeTextX{
                z-index:16;
                font-size: 1em;
                font-weight: 800;
                color: firebrick;
                text-align: center;
            }
        

            #gaugeIcon{
                position: absolute;
                top:-5%;
                left: 45%;
                margin: 0;
                width: 10px;
            }

            #pointerDot{
                position: absolute;
                top:94%
            }
            
            #percentageValue{
                position: absolute;
                top:60%;
                font-family: kuka-bulo;
                font-weight: 500;
            }
            
            .chart-title {
                font-family: kuka-bulo;
                /*font-size: 1em; */
                fill: #676C71;
            }
            
            img {
                border: 3px solid #fff;
                border-radius: 400px;
            }
            body{
                font-family: kuka-bulo;
                font-size: 1em;
            }
        `
    ],
})
export class GaugeComponent implements OnInit, AfterViewInit {
    @ViewChild('cvsP') canvasRefP: ElementRef;
    @ViewChild('cvsP2') canvasRefP2: ElementRef;
    @ViewChild('cvsB') canvasRefB: ElementRef;
    @ViewChild('cvsF') canvasRefF: ElementRef;

    // Canvas Contexts
    ctxP: any;
    ctxP2:any;
    ctxB: any;
    ctxF: any;
    ctx = [];

    chartP2 = [];
    chartP = [];
    chartB = [];
    chartF = [];

    icon: string = null;
    color: string = Colors.GREY;
    _gaugeLevel: number = 0; // [0 - 100]
    _gaugeConfig: GaugeConfig = null;

    @Input() set gaugeConfig(config: GaugeConfig) {
        this._gaugeConfig = config;
        this.icon = config.defaultIcon;
    }

    @Input() set gaugeLevel(level_: number) {
        this._gaugeLevel = Math.round(level_);  // integer [0 - 100]
        if (this.chartF && this.chartP2 && this.chartP) {
            this.updateChart(this.chartF,   this._gaugeLevel,true);
            this.updateChart(this.chartP2,  this._gaugeLevel,false);
            this.updateChart(this.chartP,   this._gaugeLevel,false);
        }
    }

    constructor() {
        this.ctx.push(this.ctxP,this.ctxP2,this.ctxB,this.ctxF);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.ctx[0] = this.canvasRefP.nativeElement.getContext('2d');
        this.ctx[1] = this.canvasRefP2.nativeElement.getContext('2d');
        this.ctx[2] = this.canvasRefB.nativeElement.getContext('2d');
        this.ctx[3] = this.canvasRefF.nativeElement.getContext('2d');
        /****** this affords resizing ***/
        /* this.ctx[3].width= 100;
         this.ctx[3].height =100;
         this.ctx[2].width= 100;
         this.ctx[2].height =100; */

        if (this._gaugeConfig != null)
            this.makeChart(this._gaugeConfig, this.ctx);
    }

    private makeChart(gaugeConfig: GaugeConfig, ctx) {
      
       let size ="300"

        this.chartB = new ChartsJs.Chart(ctx[2], {
            type: 'pie',
            data: {
                labels: ["aaa", "bbb"],
                datasets: [
                    {
                        data: [70, 20, 30],
                        backgroundColor: ["#E1E2E3", "#D1D3D5", "#A4A7AA"],
                        borderWidth: [0.25, 0.25, 0.25]
                    }
                ]
            },
            options: {
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                cutoutPercentage: 90,
                responsive: false,
                width: size,
                height: size,
                maintainAspectratio: false,
                tooltips: { enabled: false },
                hover: { mode: null },
                legend: {
                    display: false
                },
            }
        });
        //value chart
        this.chartF = new ChartsJs.Chart(ctx[3], {
            type: 'pie',
            data: {
                labels: ["aaa", "bbb"],
                datasets: [
                    {
                        data: [this.gaugeLevel, 100 - this.gaugeLevel],
                        backgroundColor: ["rgba(196, 93, 105, 1)", "rgba(32, 162, 219, 0)"],
                        borderWidth: [0.5, 0.5],
                    },
                ]
            },
            options: {
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                cutoutPercentage: 75,
                responsive: false,
                width: size,
                height: size,
                maintainAspectratio: false,
                tooltips: { enabled: false },
                hover: { mode: null },
                legend: {
                    display: false
                },
            }
        });
        if (gaugeConfig.showNeedle == true) {
            //pointer part 1
            this.chartP = new ChartsJs.Chart(ctx[0], {
                type: 'pie',
                data: {
                    // labels: ["low", "high"],
                    datasets: [
                        {
                            data: [70, 0],//this.chartData,
                            backgroundColor: ["rgba(0, 0, 0, 0)", "rgba(255, 254, 230, 0)"],
                            borderColor: ["#676C71", "#676C71"],
                            borderWidth: [0, 0.5],
                        }
                    ]
                },
                options: {
                    rotation: 1 * Math.PI,
                    circumference: 1 * Math.PI,
                    responsive: false,
                    width: size,
                    height: size,
                    tooltips: { enabled: false },
                    hover: { mode: null },
                    legend: {
                        display: false
                    }
                }
            });
            // pointer part 2

        }
        this.chartP2 = new ChartsJs.Chart(ctx[1], {
            type: 'pie',
            data: {
                labels: [],
                datasets: [
                    {
                        data: [60, 10],//this.chartData,
                        backgroundColor: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0,0)"],
                        borderColor: ["#fff", "#fff"],
                        borderWidth: [0.5, 0.5],
                    }
                ]
            },
            options: {
                responsive: false,
                width: size,
                height: size,
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                tooltips: { enabled: false },
                hover: { mode: null },
                legend: {
                    display: false
                }
            }
        });
    }

    // We have three charts driven together to from  a single chart, so its necessary to update all three
    private updateChart(chart, newLevel: number, color: boolean) {
        const opositeLevel = Math.abs(100 - newLevel);

        try {
            chart.data.datasets[0].data[0] = newLevel;
            chart.data.datasets[0].data[1] = opositeLevel;

            // TODO: take the ranges from the config
            if (color == true) {
                if (newLevel <= 10) {
                    this.icon = this._gaugeConfig.icons[0];
                    this.color = this._gaugeConfig.colors[0];
                } else if (newLevel >= 11 && newLevel <= 25) {
                    this.icon = this._gaugeConfig.icons[1];
                    this.color = this._gaugeConfig.colors[1];
                } else if (newLevel >= 26 && newLevel <= 50) {
                    this.icon = this._gaugeConfig.icons[2];
                    this.color = this._gaugeConfig.colors[2];
                } else if (newLevel >= 51 && newLevel <= 75) {
                    this.icon = this._gaugeConfig.icons[3];
                    this.color = this._gaugeConfig.colors[3];
                } else if (newLevel >= 76) {
                    this.icon = this._gaugeConfig.icons[4];
                    this.color = this._gaugeConfig.colors[4];
                }

                chart.data.datasets[0].backgroundColor[0] = this.color;
            }
            chart.update();
        } catch (e) {

        }
    }
}