import { storiesOf } from '@storybook/vue';
import { withKnobs, text, boolean, number, color } from '@storybook/addon-knobs/vue';
import { withNotes } from '@storybook/addon-notes';
import markdown from '../docs/KukaGauge.md';
import icon1 from './assets/k-gauge/battery-0-10_sm.svg';
import icon2 from './assets/k-gauge/battery-11-25_sm.svg';
import icon3 from './assets/k-gauge/battery-26-50_sm.svg';
import icon4 from './assets/k-gauge/battery-51-75_sm.svg';
import icon5 from  './assets/k-gauge/battery-76-100_sm.svg';
import KukaGauge from '../KukaGauge.vue';

storiesOf('KukaGauge', module)
    .addDecorator(withKnobs)
    .add('basic', withNotes(markdown)(() => {
        const configuration = {
                 width: 200,
                 height: 100, // height is set to at least half of the width for best results
                 showNeedle: false,
                 ranges: [
                     {lowerBound: 0, upperBound: 10, color: "#CF2027", icon: icon1},
                     {lowerBound: 11, upperBound: 25, color: "#FF5800", icon: icon2},
                     {lowerBound: 26, upperBound: 50, color: "#FFCD00", icon: icon3},
                     {lowerBound: 51, upperBound: 75, color: "#6EC8A0", icon: icon4},
                     {lowerBound: 76, upperBound: 100, color: "#1B8642", icon: icon5},
                 ],
                 backgroundRanges: [
                     {lowerBound: 0, upperBound: 33, color: "#E1E2E3"},
                     {lowerBound: 33, upperBound: 66, color: "#D1D3D5"},
                     {lowerBound: 66, upperBound: 100, color: "#A4A7AA"},
                 ],
        };
        const showNeedle = boolean('SHOW NEEDLE', false);
        const title = text('TITLE', 'Average SoC');
        const level = number('LEVEL [-10 , 110]', 89, {
            range: true,
            min: -10,
            max: 110,
            step: 1,
        });
        return {
            components: {
                'k-gauge' : KukaGauge,
            },
            template: '<k-gauge :level="level" :title="title" :configuration="configuration"></k-gauge>',
            computed: {
                configuration() {
                    configuration.showNeedle = showNeedle;
                    return Object.assign({}, configuration);
                },
                title() {
                    return title;
                },
                level() {
                    return level;
                }
            },
        }
    }))
    .add('randomized', withNotes(markdown)(() => {
        const configuration = {
            width: 200,
            height: 100,
            showNeedle: false,
            ranges: [
                {lowerBound: 0, upperBound: 10, color: "#CF2027", icon: icon1},
                {lowerBound: 11, upperBound: 25, color: "#FF5800", icon: icon2},
                {lowerBound: 26, upperBound: 50, color: "#FFCD00", icon: icon3},
                {lowerBound: 51, upperBound: 75, color: "#6EC8A0", icon: icon4},
                {lowerBound: 76, upperBound: 100, color: "#1B8642", icon: icon5},
            ],
            backgroundRanges: [
                {lowerBound: 0, upperBound: 33, color: "#E1E2E3"},
                {lowerBound: 33, upperBound: 66, color: "#D1D3D5"},
                {lowerBound: 66, upperBound: 100, color: "#A4A7AA"},
            ],
        };
        const showNeedle = boolean('SHOW NEEDLE', false);
        const title = text('TITLE', 'Average SoC');

        return {
            components: {
                'k-gauge' : KukaGauge,
            },
            template: '<k-gauge :level="level" :title="title" :configuration="configuration"></k-gauge>',
            computed: {
                configuration() {
                    configuration.showNeedle = showNeedle;
                    return Object.assign({}, configuration);
                },
                title() {
                    return title;
                },
            },
            data() {
                return {
                    level: 89,
                }
            },
            mounted() {
                let self = this;
                window.setInterval(() => {
                    self.level = Math.round(Math.random() * 100);
                }, 2000);
            }
        }
    }));
