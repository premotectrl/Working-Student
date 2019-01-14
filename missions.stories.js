import { storiesOf } from '@storybook/vue';
import { withKnobs, text, boolean, number, color } from '@storybook/addon-knobs/vue'
import { withNotes } from '@storybook/addon-notes';
import markdown from '../docs/Missions.md';
import missionsViz from "../MissionsViz.vue";
import missionIcon1 from "../assets/External/missionIcon.svg";
import missionIcon2 from "../stories/assets/Gear_grey.svg";
import circle from "../assets/External/circle.svg";
import circleGray from "../assets/External/circleGray.svg";
import rect from "../assets/External/Rect.svg";
import house from "../assets/External/house.svg";
import losangeLine from "../assets/External/losangeLineGray.svg";
import losangeGrey from "../assets/External/losange-grey.svg";
import losange from "../assets/External/losange.svg";
import loadIcon from "./assets/Loading.svg";
import missionIcon3 from "./assets/Wait_solid_petrol.svg";
import personIcon from "./assets/MainMenu.svg";

storiesOf('KukaMissions', module)
    .addDecorator(withKnobs)
    .add('basic', withNotes(markdown)(() => {
        const DefaultMissions = [
            {
                "id": "mission1",
                "name": "PickTool",
                "icon" : missionIcon1,
                "completed":null,
                "tasks": [
                    {
                        "taskId": "task1",
                        "name": "Leave-C-Station",
                        "type": "CHARGE",
                        "total_time": 230,
                        "ETA": null,
                        "state": "EXECUTING",
                        "icon":losangeLine,
                        "activeIcon":rect
                    },
                    {
                        "taskId": "task2",
                        "name": "Move-to-TStation",
                        "type": "MOVE",
                        "total_time": 400,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":circleGray,
                        "activeIcon":circle,
                    },
                    {
                        "taskId": "task3",
                        "name": "Pick",
                        "type": "PICK",
                        "total_time": 500,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":losangeGrey,
                        "activeIcon":losange,
                    },
                    {
                        "taskId": "task4",
                        "name": "report",
                        "type": "REPORT",
                        "total_time": 300,
                        "ETA": null,
                        "state": "ERROR",
                        "icon":house,
                        "activeIcon":losangeLine
                    }
                ]
            },
        ];
        return {
            components: {
                'missions' : missionsViz,
            },
            template: '<missions :mission="missions" :showMission="showMission"></missions>',
            data(){
                return {
                    progress: 10,
                    missions: DefaultMissions, // for dynamic data 
                    activeTask: this.currentTask,
                    activeTaskTotalTime: null,
                    activeTaskId: null,
                    activeTaskRemainTime: null,
                    activeTaskIndex: null,
                    paused: false,
                    showMission: 0,
                    completed: false,
                }
            },
            methods: {
                executingTask(){
                    var index = 0;
                    const currentTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                         if(tsk.state === "EXECUTING"){
                            this.activeTaskIndex = index;
                            return tsk;
                         }
                         index++;
                    });

                    if(currentTask)
                        return currentTask;
                    else{
                        this.paused = true;
                        var indx = 0;
                        const pausedTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                            if(tsk.state === "PAUSED"){
                               this.activeTaskIndex = indx;
                               return tsk;
                            }
                            indx++;
                        });
                        return pausedTask;
                    }
                },
                currentTask(){
                    const temp =  this.executingTask();
                    this.activeTaskTotalTime = temp[0].total_time;
                    this.activeTaskId = temp[0].taskId;
                    this.activeTaskRemainTime = this.activeTaskTotalTime;
                },
                progressTasks(activeTaskIdx){
                    const numberOfTasks = this.missions[this.showMission].tasks.length; 
                    if(activeTaskIdx < (numberOfTasks-1)){ // it should be -1 but set to -2 to show error
                        const nxtIndex = activeTaskIdx + 1;
                        this.missions[this.showMission].tasks[activeTaskIdx].state = "DONE";
                        const nextTask = this.missions[this.showMission].tasks[nxtIndex].state;
                        if(  nextTask !== "PAUSED" && nextTask !== "DONE"){
                            this.missions[this.showMission].tasks[nxtIndex].state = "EXECUTING";
                            this.currentTask();
                        }
                    }else{

                        this.completed = true;
                    }
                    //Reactivity should automatically progress the tasks
                }
            },
            mounted(){
                let self = this;
                self.currentTask();
                const numberOfTasks = self.missions[self.showMission].tasks.length; 
                
                window.setInterval(() => {
                    const idx = self.activeTaskIndex;
                    if(!this.paused){
                        self.activeTaskRemainTime -=  Math.round(Math.random() * 100);
                    }

                    self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;
                    if(self.activeTaskRemainTime <= 0 && !this.paused){
                        self.activeTaskRemainTime = 0;
                        self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;
                        //Mutate the missions Array
                        if(idx != numberOfTasks-1)
                            self.progressTasks(idx);
                        else{
                            self.missions[this.showMission].completed = true;
                            self.missions[self.showMission].tasks[idx].state = "DONE";
                        } 
                    }
                }, 1000);
            },
            watch:{
                missions(data){
                    this.activeTask = this.currentTask();
                },
            }
        }
    })).add('Auto Pause and Go', withNotes(markdown)(() => {
        const DefaultMissions = [
            {
                "id": "mission1",
                "name": "PickTool",
                "icon" : missionIcon1,
                "completed": null,
                "tasks": [
                    {
                        "taskId": "task1",
                        "name": "Leave-C-Station",
                        "type": "CHARGE",
                        "total_time": 230,
                        "ETA": null,
                        "state": "EXECUTING",
                        "icon":losangeLine,
                        "activeIcon":rect
                    },
                    {
                        "taskId": "task2",
                        "name": "Move-to-TStation",
                        "type": "MOVE",
                        "total_time": 400,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":circleGray,
                        "activeIcon":circle,
                    },
                    {
                        "taskId": "task3",
                        "name": "Pick",
                        "type": "PICK",
                        "total_time": 500,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":losangeGrey,
                        "activeIcon":losange,
                    },
                    {
                        "taskId": "task4",
                        "name": "report",
                        "type": "REPORT",
                        "total_time": 300,
                        "ETA": null,
                        "state": "ERROR",
                        "icon":house,
                        "activeIcon":losangeLine
                    }
                ]
            },
            {
                "id": "mission2",
                "name": "DropTool",
                "icon" : missionIcon2,
                "completed": null,
                "tasks": [
                    {
                        "taskId": "task1",
                        "name": "Leave-C-Station",
                        "type": "CHARGE",
                        "total_time": 230,
                        "ETA": null,
                        "state": "DONE",
                        "icon":losangeLine,
                        "activeIcon":rect
                    },
                    {
                        "taskId": "task2",
                        "name": "Move-to-TStation",
                        "type": "MOVE",
                        "total_time": 400,
                        "ETA": null,
                        "state": "EXECUTING",
                        "icon":circleGray,
                        "activeIcon":circle,
                    },
                    {
                        "taskId": "task3",
                        "name": "Drop",
                        "type": "DROP",
                        "total_time": 800,
                        "ETA": null,
                        "state": "PAUSED",
                        "icon":losangeGrey,
                        "activeIcon":losange,
                    },
                    {
                        "taskId": "task4",
                        "name": "report",
                        "type": "REPORT",
                        "total_time": 300,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":house,
                        "activeIcon":house,
                    }
                ]
            },
        ];
        return {
            components: {
                'missions' : missionsViz,
            },

            template: '<missions :mission="missions" :showMission="showMission"></missions>',
            data(){
                return {
                    progress: 10,
                    missions: DefaultMissions, // for dynamic data 
                    activeTask: this.currentTask,
                    activeTaskTotalTime: null,
                    activeTaskId: null,
                    activeTaskRemainTime: null,
                    activeTaskIndex: null,
                    paused: false,
                    error: false,
                    showMission: 0,
                }
            },
            methods: {
                executingTask(){
                    var index = 0;
                    const currentTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                         if(tsk.state === "EXECUTING"){
                            this.activeTaskIndex = index;
                            return tsk;
                         }
                         index++;
                    });

                    if(currentTask)
                        return currentTask;
                    else{
                        this.paused = true;
                        var indx = 0;
                        const pausedTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                            if(tsk.state === "PAUSED"){
                               this.activeTaskIndex = indx;
                               return tsk;
                            }
                            indx++;
                        });
                        return pausedTask;
                    }
                },
                currentTask(){
                    const temp =  this.executingTask();
                    this.activeTaskTotalTime = temp[0].total_time;
                    this.activeTaskId = temp[0].taskId;
                    this.activeTaskRemainTime = this.activeTaskTotalTime;
                },
                progressTasks(activeTaskIdx){
                    const numberOfTasks = this.missions[this.showMission].tasks.length;  
                    if(activeTaskIdx < (numberOfTasks-1)){ // it should be -1 but set to -2 to show error
                        const nxtIndex = activeTaskIdx + 1;
                        this.missions[this.showMission].tasks[activeTaskIdx].state = "DONE";
                        const nextTask = this.missions[this.showMission].tasks[nxtIndex].state;
                        if( nextTask === "WAITING"){
                            this.missions[this.showMission].tasks[nxtIndex].state = "EXECUTING";
                            this.currentTask();
                        }
                    }
                    //Reactivity should automatically progress the tasks
                },
            },
            mounted(){
                let self = this;
                self.currentTask();
                let counter = 0; //pause counter..
                const numberOfTasks = self.missions[self.showMission].tasks.length; 
                window.setInterval(() => {
                    const idx = self.activeTaskIndex;
                    counter += 1000;
                    //console.log("..c", counter);
                    if(!this.paused){
                        self.activeTaskRemainTime -=  Math.round(Math.random() * 100);
                    }
                    //self.missions[this.showMission].tasks[idx].total_time = self.activeTaskRemainTime;
                    self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;

                    //simulate pausing a running task and simulate errorenous task execution
                    if(counter >= 8000){
                        self.missions[this.showMission].tasks[idx].state = "PAUSED";
                        this.paused = true;
                    }
                    if(counter >= 15000){ // resume task
                        self.missions[this.showMission].tasks[idx].state = "EXECUTING";
                        this.paused = false;
                    }
                    // Create Error in task
                    if(counter >= 23000){
                        self.missions[this.showMission].tasks[idx].state = "ERROR";
                        this.error = true;
                    }

                    if(self.activeTaskRemainTime <= 0 && !this.paused && !this.error){
                        self.activeTaskRemainTime = 0;

                        self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;
                        //Mutate the missions Array
                        if(idx != numberOfTasks-1)
                            self.progressTasks(idx);
                        else{
                            self.missions[this.showMission].completed = true;
                            self.missions[self.showMission].tasks[idx].state = "DONE";
                        } 
                    }
                }, 1000);
            },
            watch:{
                missions(data){
                    this.activeTask = this.currentTask();
                },
            }
        }
    })).add('Interactive Mission', withNotes(markdown)(() => {
        const textLabel = text('Action', 'Two Missions available, Choose 0 or 1');
        //const pauseValue = boolean('Pause Me', false);
        const chooseMission=number('MissionNo', 0); 
        const DefaultMissions = [
            {
                "id": "mission3",
                "name": "Fetch Pay Load",
                "icon" : missionIcon3,
                "completed":null,
                "tasks": [
                    {
                        "taskId": "task1",
                        "name": "Leave-C-Station",
                        "type": "CHARGE",
                        "total_time": 330,
                        "ETA": null,
                        "state": "EXECUTING",
                        "icon":losangeLine,
                        "activeIcon":rect
                    },
                    {
                        "taskId": "task2",
                        "name": "Move-to-TStation",
                        "type": "MOVE",
                        "total_time": 200,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":circleGray,
                        "activeIcon":circle,
                    },
                    {
                        "taskId": "task3",
                        "name": "Pick",
                        "type": "PICK",
                        "total_time": 400,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":losangeGrey,
                        "activeIcon":losange,
                    },
                    {
                        "taskId": "task5",
                        "name": "Load",
                        "type": "Load",
                        "total_time": 400,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":personIcon,
                        "activeIcon":missionIcon2,
                    },
                    {
                        "taskId": "task4",
                        "name": "report",
                        "type": "REPORT",
                        "total_time": 200,
                        "ETA": null,
                        "state": "ERROR",
                        "icon":house,
                        "activeIcon":losangeLine
                    }
                ]
            },
            {
                "id": "mission2",
                "name": "DropTool",
                "icon" : missionIcon2,
                "completed":null,
                "tasks": [
                    {
                        "taskId": "task1",
                        "name": "Leave-C-Station",
                        "type": "CHARGE",
                        "total_time": 230,
                        "ETA": null,
                        "state": "DONE",
                        "icon":losangeLine,
                        "activeIcon":rect
                    },
                    {
                        "taskId": "task2",
                        "name": "Move-to-TStation",
                        "type": "MOVE",
                        "total_time": 400,
                        "ETA": null,
                        "state": "EXECUTING",
                        "icon":circleGray,
                        "activeIcon":circle,
                    },
                    {
                        "taskId": "task3",
                        "name": "Drop",
                        "type": "DROP",
                        "total_time": 800,
                        "ETA": null,
                        "state": "PAUSED",
                        "icon":losangeGrey,
                        "activeIcon":losange,
                    },
                    {
                        "taskId": "task4",
                        "name": "report",
                        "type": "REPORT",
                        "total_time": 300,
                        "ETA": null,
                        "state": "WAITING",
                        "icon":house,
                        "activeIcon":house,
                    }
                ]
            },
        ];
        return {
            components: {
                'missions' : missionsViz,
            },

            template: '<missions :mission="missions" :showMission="showMission"></missions>',
            data(){
                return {
                    progress: 10,
                    missions: DefaultMissions, // for dynamic data 
                    activeTask: this.currentTask,
                    activeTaskTotalTime: null,
                    activeTaskId: null,
                    activeTaskRemainTime: null,
                    activeTaskIndex: null,
                    paused: false,
                    showMission: chooseMission,
                }
            },
            methods: {
                executingTask(){
                    var index = 0;
                    const currentTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                         if(tsk.state === "EXECUTING"){
                            this.activeTaskIndex = index;
                            return tsk;
                         }
                         index++;
                    });

                    if(currentTask)
                        return currentTask;
                    else{
                        this.paused = true;
                        var indx = 0;
                        const pausedTask =  this.missions[this.showMission].tasks.filter(tsk =>{
                            if(tsk.state === "PAUSED"){
                               this.activeTaskIndex = indx;
                               return tsk;
                            }
                            indx++;
                        });
                        return pausedTask;
                    }
                },
                currentTask(){
                    const temp =  this.executingTask();
                    this.activeTaskTotalTime = temp[0].total_time;
                    this.activeTaskId = temp[0].taskId;
                    this.activeTaskRemainTime = this.activeTaskTotalTime;
                },
                progressTasks(activeTaskIdx){
                    const numberOfTasks = this.missions[this.showMission].tasks.length;  
                    if(activeTaskIdx < (numberOfTasks-1)){
                        const nxtIndex = activeTaskIdx + 1;
                        this.missions[this.showMission].tasks[activeTaskIdx].state = "DONE";
                        const nextTask = this.missions[this.showMission].tasks[nxtIndex].state;
                        if(  nextTask !== "PAUSED" && nextTask !== "DONE"){
                            this.missions[this.showMission].tasks[nxtIndex].state = "EXECUTING";
                            this.currentTask();
                        }
                    }
                    //Reactivity should automatically progress the tasks
                },
                pauseRunningTask(currTaskId){
                    this.missions[this.showMission].tasks[currTaskId].state = "PAUSED";
                }
            }, 
            mounted(){
                let self = this;
                self.currentTask();
                const numberOfTasks = self.missions[self.showMission].tasks.length; 
                window.setInterval(() => {
                  
                    const idx = self.activeTaskIndex;
                    if(!this.paused){
                        self.activeTaskRemainTime -=  Math.round(Math.random() * 100);
                    }
                    self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;
                    if(self.activeTaskRemainTime <= 0 && !this.paused){
                        self.activeTaskRemainTime = 0;
                        self.missions[this.showMission].tasks[idx].ETA = self.activeTaskRemainTime;
                        //Mutate the missions Array
                        if(idx != numberOfTasks-1)
                            self.progressTasks(idx);
                        else{
                            self.missions[this.showMission].completed = true;
                            self.missions[self.showMission].tasks[idx].state = "DONE";
                        } 
                    }
                }, 1000);
            },
            watch:{
                missions(data){
                    this.activeTask = this.currentTask();
                },
            }
        }
    }));