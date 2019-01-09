<template>
    <div v-if="currentConfiguration">
        <div id="k-gauge-container">
            <canvas v-if="currentConfiguration.showNeedle" ref="gaugeNeedle" id="k-gauge-needle-canvas"></canvas>
            <canvas ref="backgroundGauge" id="k-gauge-background-canvas"></canvas>
            <canvas ref="foregroundGauge" id="k-gauge-foreground-canvas"></canvas>
          <!--  <img v-if="displayedIcon" id="k-gauge-icon"
                 :src="displayedIcon"
                 :style="{top: -1 *this.currentConfiguration.height * 0.059 + 'px'}"> -->
            <div id="k-gauge-text"
                 :style="{width: this.currentConfiguration.width + 'px', top: this.radius - 15 + 'px'}">
                <span class="k-gauge-level"
                      :style="{color: displayedColor}">
                   <!-- {{displayedLevel}}&#37; -->
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    const defaultConfiguration = {
        width: 160,
        height: 85,
        showNeedle: false,
        radiusOffset: 20,
        backgroundGauge_lineWidth: 4,
        foregroundGauge_lineWidth: 5,
        ranges: [],            // empty
        backgroundRanges: [],  // empty
    };

    function validateRange(ranges) {
        for (let i = 1; i < ranges.length; i++) {
            const range = ranges[i];
            if (range.lowerBound >= (range.upperBound)
                || range.lowerBound !== (ranges[i-1].upperBound + 1)) {
                console.error("Foreground ranges but be consecutive");
                return false;
            }
        }
        return true;
    }

    let annimationFrameId;

    export default {
        name: "k-gauge",

        props: {
            title: {                // The title displayed under the gauge. Optional, defaults to ''. This string will
                type: String,       //      NOT be translated, so the already translated text must be passed.
                required: false,
            },
            level: {                // The level of the gauge. Optional, defaults to 0. The given value Should be an
                type: Number,       //      integer, in the [0, 100] range. The given level will be normalized if not in
                required: false,    //      the expected range.
            },
            configuration: {
                type: Object,
                required: true,
                default: function() {
                    return defaultConfiguration;
                },
                validator: conf => validateRange(conf.ranges)
            },
        },

        data() {
            return {
                displayedColor: "#A4A7AA",
                displayedIcon: "",
                displayedLevel: 0,
                gaugeNeedleColor: "#75787a",

                backgroundGaugeContext: null,
                foregroundGaugeContext: null,
                gaugeNeedleContext: null,
                contextVerticalShift: 3,
                windowFocus: false,
                hidden : null,
                $refs: {
                    foregroundGauge: HTMLCanvasElement,
                    backgroundGauge: HTMLCanvasElement,
                    gaugeNeedle: HTMLCanvasElement
                },
            };
        },

        computed: {
            targetLevel() {
                let target = Math.round(this.level);
                if (target < 0) {
                    target = 0;
                }
                else if (target > 100) {
                    target = 100;
                }
                return target;
            },

            currentConfiguration() {
                return Object.assign(defaultConfiguration, this.configuration);
            },

            center() {
                return [(this.currentConfiguration.width / 2), this.currentConfiguration.height];
            },
            radiusOffset(){
                return this.currentConfiguration.width * 0.05;
            },

            radius() {
                return (this.currentConfiguration.width / 2) - this.radiusOffset;
            }
        },

        methods: {

            handleVisibilityChange() {
                this.hidden = document.hidden;
            },

            getColorAndIconForLevel(level) {
                for (let i = 0; i < this.currentConfiguration.ranges.length; i++) {
                    if (level >= this.currentConfiguration.ranges[i].lowerBound
                        && level <= this.currentConfiguration.ranges[i].upperBound) {
                        return {
                            color: this.currentConfiguration.ranges[i].color,
                            icon: this.currentConfiguration.ranges[i].icon
                        };
                    }
                }
                console.error("Failed to find a valid range for level " , level, this.currentConfiguration.ranges);
            },

            makeChart(foregroundGageContext, backgroundGaugeContext, gaugeNeedleContext) {
                let endAngle = 0;
                let slice = 1;
                let total = 0;
                let lastPosition = 0;

                for (let i = 0; i < this.currentConfiguration.backgroundRanges.length; i++) {
                    total += (this.currentConfiguration.backgroundRanges[i].upperBound
                        - this.currentConfiguration.backgroundRanges[i].lowerBound);
                }

                for (let i = 0; i < this.currentConfiguration.backgroundRanges.length; i++) {
                    let range = (this.currentConfiguration.backgroundRanges[i].upperBound
                        - this.currentConfiguration.backgroundRanges[i].lowerBound);
                    slice += range / total;
                    endAngle = Math.PI * slice;
                    backgroundGaugeContext.beginPath();
                    backgroundGaugeContext.lineWidth = this.currentConfiguration.backgroundGauge_lineWidth;
                    backgroundGaugeContext.strokeStyle = this.currentConfiguration.backgroundRanges[i].color;
                    backgroundGaugeContext.arc(this.center[0], this.center[1] - this.contextVerticalShift,
                        this.radius-3, lastPosition, endAngle, false);
                    backgroundGaugeContext.stroke();
                    backgroundGaugeContext.closePath();
                    lastPosition = endAngle;
                }

                foregroundGageContext.lineWidth = this.currentConfiguration.foregroundGauge_lineWidth;

                if (gaugeNeedleContext != null) {
                    this.drawGaugeNeedle(gaugeNeedleContext);
                }

                this.animateChart(foregroundGageContext, gaugeNeedleContext, this.targetLevel);
            },

            drawGaugeNeedle(context) {
                context.clearRect(0, 0, this.currentConfiguration.width, this.currentConfiguration.height);
                context.save();
                context.translate(this.center[0], this.center[1] - this.contextVerticalShift);
                context.rotate(Math.PI * (1 + ((this.displayedLevel + 0.1) / 100)));
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo( this.radius + 10, 0);
                context.lineWidth = 0.3;
                context.arc(0, 0, 3, 0, 2*Math.PI);
                context.lineJoin = 'round';
                context.lineCap = 'round';
                context.strokeStyle = this.gaugeNeedleColor;
                context.stroke();
                context.fillStyle = this.gaugeNeedleColor;
                context.fill();
                context.restore();
            },

            animateChart(foregroundGaugeContext, gaugeNeedleContext, targetLevel) {
                if (this.displayedLevel === targetLevel || targetLevel !== this.targetLevel) {
                    cancelAnimationFrame(annimationFrameId);
                    return;
                }

                if (this.displayedLevel < targetLevel) {
                    this.displayedLevel += 1;
                } else {
                    this.displayedLevel -= 1;
                }

                let colorAndIcon = this.getColorAndIconForLevel(this.displayedLevel);
                this.displayedColor = colorAndIcon.color;
                this.displayedIcon = colorAndIcon.icon;

                let stepAngle =  Math.PI * (1 + (this.displayedLevel / 100));
                if (foregroundGaugeContext != null) {
                    foregroundGaugeContext.clearRect(0, 0, this.currentConfiguration.width, this.currentConfiguration.height);
                    foregroundGaugeContext.beginPath();
                    foregroundGaugeContext.arc(this.center[0], this.center[1] - this.contextVerticalShift,
                        this.radius - 4, Math.PI, stepAngle, false);
                    foregroundGaugeContext.strokeStyle = this.displayedColor;
                    foregroundGaugeContext.stroke();
                    foregroundGaugeContext.closePath();
                }

                if (gaugeNeedleContext != null) {
                    this.drawGaugeNeedle(gaugeNeedleContext);
                }

                annimationFrameId = requestAnimationFrame(() =>
                    this.animateChart(foregroundGaugeContext, gaugeNeedleContext, targetLevel)
                );
            },
        },

        created() {
            document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
        },

        mounted() {
            this.$refs.backgroundGauge.width = this.currentConfiguration.width;
            this.$refs.backgroundGauge.height = this.currentConfiguration.height;
            this.$refs.foregroundGauge.width =  this.currentConfiguration.width;
            this.$refs.foregroundGauge.height =  this.currentConfiguration.height;
            this.backgroundGaugeContext = this.$refs.backgroundGauge.getContext('2d');
            this.foregroundGaugeContext = this.$refs.foregroundGauge.getContext('2d');

            if (this.currentConfiguration.showNeedle) {
                this.$refs.gaugeNeedle.width = this.currentConfiguration.width;
                this.$refs.gaugeNeedle.height = this.currentConfiguration.height;
                this.gaugeNeedleContext =  this.$refs.gaugeNeedle.getContext('2d');
            }

            this.makeChart(this.foregroundGaugeContext, this.backgroundGaugeContext, this.gaugeNeedleContext);
        },

        watch: {
            level: {
                handler: function (targetLevel) {
                    if (this.foregroundGaugeContext && !this.hidden) {
                        this.animateChart(this.foregroundGaugeContext, this.gaugeNeedleContext, targetLevel);
                    }

                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    @import "styles/variables.scss";

    #k-gauge-container {
        position: relative;
        margin: 10px;
        display: inline-flex;
    }

    #k-gauge-foreground-canvas, #k-gauge-needle-canvas {
        position: absolute;
        top: 0;
    }

    #k-gauge-background-canvas {
        z-index: 0;
    }

    #k-gauge-icon {
        position: absolute;
        left: 40%;
        width: 20%;
    }

    #k-gauge-text {
        position: absolute;
        text-align: center;
    }

    .k-gauge-level {
        font-size: $largeFontSize;
        font-weight:bold;
    }

    .k-gauge-title {
        font-size: $standardFontSize;
        color: $kukaGray80;
        display: block;
        padding-top: 5px;
        margin-left: 5px;
        text-align: left;
    }

    img {
        border: 3px solid #fff;
        border-radius: 400px;
    }

    body {
        font-family: kuka-bulo;
    }

</style>