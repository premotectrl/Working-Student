import { storiesOf } from '@storybook/vue';
import { withKnobs, text, number, color } from '@storybook/addon-knobs/vue';
import { withNotes } from '@storybook/addon-notes';
import KukaDonutChart from '../KukaDonutChart.vue';
import markdown from '../docs/KukaDonutChart.md';
import icon1 from './assets/k-gauge/battery-0-10_sm.svg';
import icon2 from './assets/k-gauge/battery-11-25_sm.svg';


storiesOf('KukaDonutChart', module)
    .addDecorator(withKnobs)
    .add('basic', withNotes(markdown)(() => {
        const value1 = number('value 1', 30);
        const value2 = number('value 2', 70);
        const label1 = text('label 1', 'value 1');
        const label2 = text('label 2', 'value 2');
        const color1 = color('color 1', "#6EC8A0");
        const color2 = color('color 2', "#CF2027");
        const title = text('title', 'Basic Donut Chart');
        const unit = text('unit', '%');

        return {
            components: {
                'k-donut-chart': KukaDonutChart,
            },
            template: '<k-donut-chart :labels="labels" :data-points="dataset" :colors="colors" :title="title" :unit="displayUnit"></k-donut-chart>',
            computed: {
                dataset() {
                    return [value1, value2];
                },
                labels() {
                    return [label1, label2];
                },
                colors() {
                    return [color1, color2];
                },
                title() {
                    return title;
                },
                displayUnit() {
                    return unit;
                }
            }
        }
    }))
    .add('dynamic updates', withNotes(markdown)(() => {
        return {
            components: {
                'k-donut-chart': KukaDonutChart,
            },
            template: '<k-donut-chart :labels="labels" :data-points="dataset" :colors="colors" :title="title"></k-donut-chart>',
            data() {
                return {
                    dataset: [10, 100],
                    colors: ["#6EC8A0", "#CF2027"],
                    labels: ["value 1", "value 2"],
                    title: 'Dynamic Donut Chart',
                }
            },
            mounted() {
                let self = this;
                window.setInterval(() => {
                    const generated = Math.round(Math.random() * 100);
                    self.dataset.splice(0, 2, ...[generated, 100 - generated]);
                }, 1000);
            }
        }
    }))
    .add('donut without units', withNotes(markdown)(() => {
        return {
            components: {
                'k-donut-chart': KukaDonutChart,
            },
            template: '<k-donut-chart ' +
                ':labels="labels" ' +
                ':data-points="dataset" ' +
                ':colors="colors" ' +
                ':showUnit="showUnit" ' +
                ':title="title">' +
                '</k-donut-chart>',

            data() {
                return {
                    dataset: [10, 100],
                    colors: ["#6EC8A0", "#CF2027"],
                    labels: ["value 1", "value 2"],
                    title: 'Dynamic Donut Chart',
                    showUnit: false
                }
            },
            mounted() {
                let self = this;
                window.setInterval(() => {
                    const generated = Math.round(Math.random() * 100);
                    self.dataset.splice(0, 2, ...[generated, 100 - generated]);
                }, 1000);
            }
        }
    }))
    .add('donut with icons', withNotes(markdown)(() => {
        return {
            components: {
                'k-donut-chart': KukaDonutChart,
            },
            template: '<k-donut-chart ' +
            ':labels="labels" ' +
            ':data-points="dataset" ' +
            ':colors="colors" ' +
            ':showUnit="showUnit" ' +
            ':title="title" ' +
            ':legendIcons="legendIcons" ' +
            ':icon="icon">' +
            '</k-donut-chart>',

            data() {
                return {
                    dataset: [10, 100],
                    colors: ["#6EC8A0", "#CF2027"],
                    labels: ["value 1", "value 2"],
                    title: 'Dynamic Donut Chart',
                    showUnit: false,
                    icon: icon1,
                    legendIcons: [icon1, icon2]
                }
            },
            mounted() {
                let self = this;
                window.setInterval(() => {
                    const generated = Math.round(Math.random() * 100);
                    self.dataset.splice(0, 2, ...[generated, 100 - generated]);
                }, 1000);
            }
        }
    }))
;