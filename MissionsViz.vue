<template>
    <div style="border:1px solid grey; margin: 0 50px 0 50px;min-width:320px">
        <div  > <!--v-for="(mis,idx) in missions" :key="idx"-->

            <div id="missionIcon-details">
                <img :src="missions.icon" style="width: 50px; height: 50px; z-index:0" >
                <div style="display: inline-block">
                    <span id="missionIcon-details-text">{{missions.id}}</span>
                    <span  id="missionIcon-details-text">ORDER 765</span> 
                </div>
            </div>

            <div class="mission-detail">
                <div class="mission-detail-part1">
                   
                    <table class="mission-text">
                        <tr class="detail-text">  {{missions.name}}</tr>  
                        <tr>
                                <td>Date</td>
                                <td class="detail-text">New me details</td>
                        </tr>
                        <tr>
                            <td>Threshold</td> 
                            <td  class="detail-text"> Other me details</td>
                        </tr>
                        <tr>
                            <td>LastWord</td>
                            <td class="detail-text"> Small detail</td>
                        </tr>            
                    </table>
                </div>
                <div class="mission-detail-part2">
                    <table id="task-text">
                            <tr class="detail-text" > Task Details</tr>  
                            <tr>
                                <td>Robot</td>
                                <td class="detail-text">KMP054</td>
                            </tr>
                            <tr>
                                <td>Charge</td> 
                                <td  class="detail-text"> 400KWh</td>
                            </tr>
                            <tr>
                                <td>status</td>
                                <td class="detail-text"> 2 Heavy</td>
                            </tr>            
                    </table>    
                </div>
                <!---Active task detail -->
                    <div class="part3">
                        <div class ="tasksX" v-for="(tsk, id) in missions.tasks" :key="id">
                            <div class="misActiveTask" v-if="tsk.taskId === currTaskId">
                                <p id="txt">  Mission Status </p>
                                <img :src="tsk.activeIcon" style="width: 50px; height: 50px;">
                                <div class="part3-task_name">{{currentTaskname }} </div>
                                <!--show its task state -->
                                <img :src="states[2]" style="width: 10px; position: absolute; padding-top: 15px;" v-if="tsk.state ==='PAUSED'">
                                <img :src="states[3]" style="width: 10px; position: absolute; padding-top: 15px;" v-if="tsk.state ==='ERROR'">
                                </div>
                            </div>
                    </div>
                    <div class="mission-detail-part4">
                        <table>
                            <tr class="table-row">
                                <td id="time-text">
                                    Remaining Time
                                </td>
                                <td id="time-big-text">
                                    {{taskETA}}ms
                                </td>
                            </tr>
                            <tr  class="table-row">
                                <td id="time-text">
                                    Total Time
                                </td>
                                <td id="time-bigBold-text">
                                     {{taskTotalTime}}ms
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="mission-detail-finish">
                        <table id="task-text">
                            <tr class="header">Completion Estimation</tr>
                            <tr>
                                <td class="day">Today at</td>
                            </tr>
                            <tr>
                                <td  class="time"> 18:19</td>
                            </tr>       
                        </table>    
                    </div>
            </div>
            <!--LOWER PART -->
            <div class="missions">
                <!--<div style="display: inline-block; margin: 10px"> -->
                <div class="tasks_container">
                    <div class ="tasks" v-for="(tsk, id) in missions.tasks" :key="id">
                        <div class="task">
                           <!-- <div class="active_Task" v-if="tsk.state === 'EXECUTING' || tsk.state ==='PAUSED'"> -->
                            <div class="active_Task" v-if="tsk.taskId === currTaskId">
                                <!--<div class="active_Task-time"> {{ tsk.total_time }} </div> -->
                                <img class="active_Task-pointer" :src="taskPointerIcon" >
                            </div>
                            <!-- all tasks in a mission are represented -->
                            <img :src="tsk.activeIcon" style="width: 50px; height: 50px; z-index:0" 
                                 v-if="tsk.state === 'EXECUTING' ||tsk.state === 'DONE' ||  (tsk.state ==='PAUSED' && tsk.taskId == currTaskId)">
                            <img :src="tsk.icon" style="width: 50px; height: 50px; z-index:0" v-else>
                              <!-- all possible states -->
                            <div class="state" >
                                <img :src="states[0]" style="width: 20px; height: 20px" v-if="tsk.state === 'DONE'">
                                <img :src="states[1]" style="width: 20px; height: 20px" v-if="tsk.state === 'WAITING'">
                                <img :src="states[2]" style="width: 20px; height: 20px" v-if="tsk.state === 'PAUSED'">
                                <img :src="states[3]" style="width: 20px; height: 20px" v-if="tsk.state === 'ERROR'">
                            </div>
                            <div class="taskCircle">
                                <!-- Draws a circle, colored acording to state of task, for each task -->
                                <svg v-if="tsk.state === 'EXECUTING' || tsk.state === 'DONE'" >
                                    <circle cx="50" cy="50" r="32" stroke="#1B8642" stroke-width="1" fill="none" />
                                </svg>
                                <svg v-else >
                                    <circle cx="50" cy="50" r="32" stroke="#D1D3D5" stroke-width="1" fill="none" />
                                </svg>
                            </div>
                            <div id="txt" class="task_name">{{ tsk.name }} </div>
                        <k-mGauge :level="level" :configuration="gaugeConfig"  class="inTask_gauge"  v-if="tsk.state === 'EXECUTING'"></k-mGauge>
                        </div>
                        <!---Arrows linking states -->
                        <div v-if="id != missions.tasks.length -1" style="width:50%; padding-left: 5px; padding-right: 0px">
                            <hr v-if="tsk.state === 'WAITING' || tsk.state === 'ERROR'" class="makeArrow"> 
                            <hr  v-else class="makeFullArrow">
                            <!--<img v-if="tsk.state === 'WAITING' || tsk.state === 'ERROR'" :src="arrows[1]" class="arrow">
                            <img v-else :src="arrows[0]" class="arrow"> -->
                            <img v-if="tsk.state === 'WAITING' || tsk.state === 'ERROR'" :src="arrHeads[0]" class="arrowHead">
                            <img v-else :src="arrHeads[1]" class="arrowHead"> 
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
    import checkIcon from "./assets/External/check.svg";
    import arrow from "./assets/External/arrow.svg";
    import pauseIcon from "./assets/External/pause.svg";
    import arrowLong from "./assets/External/arrowLong.svg";
    import waitingIcon from "./assets/External/waiting.svg";
    import errorIcon from "./assets/External/error.svg";
    import arrowGray from "./assets/External/arrowLongGray.svg";
    import activeTaskIcon from "./assets/External/active-Task.svg";
    import grayArrHead from "./assets/External/ArrowHeadGray.svg";
     import ArrHead from "./assets/External/ArrowHead.svg";
    import KukaMissionGauge from "./KukaMissionGauge.vue";
    const DefaultMissions = [
        {
            "id": "mission1",
            "name": "PickTool",
            "completed":null,
            "tasks": [
                {
                    "taskId": "task1",
                    "name": "Leave-C-Station",
                    "type": "CHARGE",
                    "total_time": 120,
                    "ETA":null,
                    "state": "DONE"
                },
                {
                    "taskId": "task2",
                    "name": "Move-to-TStation",
                    "type": "MOVE",
                    "total_time": 600,
                    "ETA":null,
                    "state": "EXECUTING"
                },
                {
                    "taskId": "task3",
                    "name": "Pick",
                    "type": "PICK",
                    "total_time": 600,
                    "ETA":null,
                    "state": "WAITING"
                },
                {
                    "taskId": "task4",
                    "name": "report",
                    "type": "REPORT",
                    "total_time": 10,
                    "ETA":null,
                    "state": "ERROR"
                }
            ]
        },
    ];

    const gaugeConfig = {
                 width: 110,
                 height: 55, // height is set to at least half of the width for best results
                 showNeedle: false,
                 ranges: [
                     {lowerBound: 0, upperBound: 10, color: "#CF2027"},
                     {lowerBound: 11, upperBound: 25, color: "#FF5800"},
                     {lowerBound: 26, upperBound: 50, color: "#FFCD00"},
                     {lowerBound: 51, upperBound: 75, color: "#6EC8A0"},
                     {lowerBound: 76, upperBound: 100, color: "#1B8642"},
                 ],
                 backgroundRanges: [
                     {lowerBound: 0, upperBound: 33, color: "#E1E2E3"},
                     {lowerBound: 33, upperBound: 66, color: "#D1D3D5"},
                     {lowerBound: 66, upperBound: 100, color: "#A4A7AA"},
                 ],
    };

    export default{
        name: "missionViz",
        components:{"k-mGauge": KukaMissionGauge},
        props:{
            mission:Array,
            showMission:Number,
        },
        data(){
            return{
                missions: this.mission[this.showMission],
                gaugeConfig: gaugeConfig,
                arrows: [arrowLong, arrowGray],
                states: [checkIcon,waitingIcon,pauseIcon,errorIcon],
                taskPointerIcon: activeTaskIcon,
                currTaskId: null,
                taskTotalTime: null,
                level:0,
                taskETA:null,
                currentTaskname:null,
                arrHeads:[grayArrHead,ArrHead],
            }
        },
        computed:{
            missionIcon(){
                return this.missions.icon;
            },
        },
        methods: {
            InitProg() {
                let currentTask =  this.missions.tasks.filter(tsk =>{return tsk.state === "EXECUTING"});
                if(currentTask.length < 1)
                    currentTask =  this.missions.tasks.filter(tsk =>{return tsk.state === "PAUSED"});
                if(currentTask.length < 1){
                     currentTask =  this.missions.tasks.filter(tsk =>{return tsk.state === "ERROR"});
                }
                this.currTaskId = currentTask[0].taskId;
                this.taskTotalTime = currentTask[0].total_time;
                this.taskETA = currentTask[0].ETA ? currentTask[0].ETA: this.taskTotalTime;
                this.level = 0;
            },
        },
        mounted() {
            this.InitProg();
        },
        watch: {
            mission: {
                handler: function(data) { 
                    if(this.missions.completed == true)
                        this.taskETA = 0;
                    else{
                        // An Executing task can be paused or become erroreneous. We need to know this for dynamicism
                        let currTask = this.missions.tasks.filter(tsk =>{return tsk.state === "EXECUTING"});
                        if(currTask.length < 1)
                            currTask = this.missions.tasks.filter(tsk =>{return tsk.state === "PAUSED"});
                        if(currTask.length < 1){
                            currTask =  this.missions.tasks.filter(tsk =>{return tsk.state === "ERROR"});
                        }
                        //determine whether its a new task counting or the same old task and that task is not paused or Errorenous
                        if( currTask[0].taskId === this.currTaskId){
                            //If task is paused or errorenous, time remaining should not change..
                            if( currTask[0].state === "EXECUTING"){
                                this.taskETA =  currTask[0].ETA >= 0 ? currTask[0].ETA : 0;//currTime;
                                this.level =  Math.round(((this.taskTotalTime - this.taskETA) / this.taskTotalTime) * 100);
                            }
                        }else
                            this.InitProg();
                    }
                },
                deep:true,
            },
        }
    }
</script>
<style lang="scss" scoped>
 @import "styles/variables.scss";

 .mission-detail{
    display: grid;
    grid-template-columns: repeat(auto-fill, 150pt);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
    justify-content: space-between;
    list-style: none;
    width: auto;
    //min-height:200px;
    background-color: $kukaWhite;
    padding-bottom: 30px;
    margin-top: 10px;
    margin-left:60px;
    &-part1{
        display: block;
        padding-left: 10px;
    }
    &-part2{
        display: inline-flex;
        //justify-content: center;
        //align-items: center;
         padding-left: 10px;
    }
     &-part4{
        display: inline-flex;
        //justify-content: center;
        //align-items: center;
         padding: 4px 0 0 10px;
    }
    &-finish {
        display: flex;
        //justify-content: center;
        //align-items: center;
        padding-left: 10px;
    }
    &-finish .header{
        font-weight: bold;
        color: $kukaGray90;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
    }
    &-finish .day{
        color:  $kukaGray60;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: $kukaRed;
    }
    &-finish .time{
        color:  $kukaGray60;
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        color:$kukaRed;
    }
 }

 #txt{
      color:  $kukaGray60;
 }

 #missionIcon-details{
    color:  $kukaGray60;
    padding:10px 0 5px 10px;
    display: flex;
    align-items:center;
    &-text{
        display: block;
        margin: 0 0 0 10px;
    }
 }
 .mission-text{
    color:  $kukaGray60;
    //margin-left:55px;
 }
 #task-text{
       color:  $kukaGray60;
 }

.detail-text{
    font-weight: bold;
    color: $kukaGray90;
    line-height: 18px;
    text-overflow: ellipsis;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;
}
.table-row{
    height: 40px;
    width:100%;
    border: 1px solid  $kukaGray30;
}
#time-text{
   padding: 0  5px 0 10px;
   color:  $kukaGray60;
   text-overflow: ellipsis;
    max-width: 80px;
    overflow: hidden;
    white-space: normal;
    line-height: 16px;
}
#time-big-text{
    padding: 0  10px 0 5px;
    font-weight: 800;
    font-size: 27px;
    color:  $kukaGray60;
}
#time-bigBold-text{
    padding: 0  10px 0 5px;
    font-weight: 800;
    font-size: 27px;
    color:  $kukaGray90;
}
 .misActiveTask{
    display: inline-flex;
    flex-flow: column;
    align-items:center;
    justify-content:center;
 }
 .part3{
    display: inline-flex;
    //align-items:center;
    //justify-content:center;
    padding-left:10px;
    &-task_name{
        font-size: $standardFontSize;
        font-weight:bold;
        color: $successGreen;
    }
 }
.missions{
    min-height: 130px;
    background-color: $kukaGray03;
}

.tasks_container{
   /* display: inline-flex;
    min-width: 150px;
    margin: 10px;
    justify-content: space-between;
    flex-flow: wrap; */
    display: inline-grid;
    margin: 10px;
    padding-right: 10px;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(150pt, 1fr));
    justify-content: space-between;
}

.tasks{
    display: inline-flex;
    flex-flow: row;
    //justify-content: center;
    align-items: center;
    min-width: 150px;
}
.task {
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
}
.taskCircle{
    position: absolute;
    width: 100%;
    height: 100%;
}
.task_name{
    position: absolute;
    bottom: 0;
    font-size: $standardFontSize;
    color: $kukaGray80;
}
.active_Task{
  position: absolute;
  align-content: center;
  justify-content: center;
  display: inline-flex;
  background-color: $kukaGray10;
  height: 130px;
  top: -10px;
  //z-index: 1;

    &-time{
        font-size: $largeFontSize;
        font-weight:bold;
        color: $kukaGray03;
        position: absolute;
        bottom: 46%;
        z-index: 1;
    }
    &-pointer{
        width:40%;
        padding-top: 85px;
    }
}
.inTask_gauge {
    position: absolute;
    top:-15%;
}

.state{
    position: absolute;
}
.arrowHead{
    width: 10px;
    position: relative;
    top: -17px;
    left: 97%;
}

.makeArrow{
    border: 1px dashed rgb(255, 255, 255);
    //border: 1px dashed rgb(12, 130, 79);
    //border-width:1px;
    //height: 0.5px;
    background-color:  $kukaGray30;
    min-width:30px;
}

.makeFullArrow{
    border: 1px dashed rgb(255, 255, 255);
    background-color: rgb(12, 130, 79);
    min-width:30px;
}
</style>
