<template>
	<div class = "circleDetail">
		<div class ="monthHeader">
			<div v-for="month in circleMonths" class = "monthCell">{{month}}</div>
		</div>
		<div class = "circleDetailRow" :style = "{height:height+'px'}" v-for = "(rowData,index) in circleData">
			<div class = "roomCell" v-for = "(roomInfo,ind) in rowData" :style = "{width:computeWidth(roomInfo),'margin-left':computeMargin(index,ind),'background-color':computeColor(roomInfo)}" :title ="roomInfo.dept_name">{{roomInfo.dept_name}}</div>
		</div>
	</div>
	<!--:style = "width:computeWidth(roomInfo)"-->
</template>
<script>
import _ from 'lodash/array';
import moment from 'moment';
export default {
	props:{
		startTime:String,
		endTime:String,
		circleData:Array,
		height:Number
	},
	computed:{
		circleMonths(){
			let months = [];
			let startYear = +this.startTime.split('-')[0];
			let startMonth = +this.startTime.split('-')[1];
			let endYear = +this.endTime.split('-')[0];
			let endMonth = +this.endTime.split('-')[1];
			if(endYear - startYear===0){
				for(let i = startMonth;i<=endMonth;i++){
					months.push(startYear+"年"+i+"月");
				}
			}else if(endYear- startYear>0){
				for(let i =startYear;i<=endYear;i++){
					if(i ===startYear){
						for(let j = startMonth;j<=12;j++){
							months.push(i+"年"+j+"月");
						}
					}else if(i === endYear){
						for(let j = 1;j<=endMonth;j++){
							months.push(i+"年"+j+"月");
						}
					}else{
						for(let j = 1;j<=12;j++){
							months.push(i+"年"+j+"月");
						}
					}
				}
			}
			return months;
		}
	},
	data(){
		return{

		}
	},
	mounted(){
		console.log(this.startTime)
		console.log('height----'+this.height)
	},
	methods:{
		computeWidth(roomInfo){
			let beginYear = +roomInfo.begin_time.split('-')[0]
			let beginMonth = +roomInfo.begin_time.split('-')[1];
			let beginDay = +roomInfo.begin_time.split('-')[2];
			let endYear = +roomInfo.end_time.split('-')[0]
			let endMonth = +roomInfo.end_time.split('-')[1];
			let endDay = +roomInfo.end_time.split('-')[2];
			if(endMonth===beginMonth){
				if(_.indexOf([1,3,5,7,8,10,12],endMonth)!=-1){
					return (endDay - beginDay+1)/31*100+'px';
				}else if(_.indexOf([4,6,9,11],endMonth)!=-1){
					return  (endDay - beginDay+1)/30*100+'px';
				}else if(beginYear%400===0||(beginYear%100!==0&&beginYear%4===0)){
					return (endDay - beginDay+1)/29*100+'px';
				}else{
					return (endDay - beginDay+1)/28*100+'px';
				}
				
			}else if(endMonth>beginMonth){
				return this._computeWidth(roomInfo.begin_time,roomInfo.end_time)+'px';
			}else{
				let beginTimeEnd = beginYear+'-12-31';
				let endTimeBegin = endYear+'-01-01';
				console.log(beginTimeEnd);
				console.log(endTimeBegin);
				return this._computeWidth(roomInfo.begin_time,beginTimeEnd)+this._computeWidth(endTimeBegin,roomInfo.end_time)+'px';
			}
		},
		_computeWidth(from,to){
			let endMonth = to.split('-')[1];
			let beginMonth =from.split('-')[1];
			return this.beginMonthWidth(from)+(endMonth - beginMonth-1)*100+this.endMonthWidth(to);
		},
		beginMonthWidth(time){
			let d = new Date(time);
			let beginDay = d.getDate();
			d.setMonth(d.getMonth()+1);
			d.setDate(0);
			let endDay = d.getDate();
			console.log('beginmothwidht'+(endDay-beginDay+1)/endDay*100)
			return (endDay-beginDay+1)/endDay*100;
		},
		endMonthWidth(time){
			let d = new Date(time);
			let beginDay = d.getDate();
			d.setMonth(d.getMonth()+1);
			d.setDate(0);
			let endDay = d.getDate();
			console.log('endwidht'+beginDay/endDay*100)
			console.log('beginday:'+beginDay);
			console.log('endday'+endDay);
			return beginDay/endDay*100;
		},
		computeMargin(index,ind){
			let pre_end_day='';
			let cur_beging_day='';
			if(ind===0){
				pre_end_day = this.startTime.split('-')[0]+'-'+this.startTime.split('-')[1]+'-01';
				cur_beging_day = this.circleData[index][ind].begin_time;
				console.log("11111111111111hhhhhhhhhhh"+pre_end_day)
				console.log("11111111111111hhhhhhhhhhh"+cur_beging_day)
				if(pre_end_day===cur_beging_day){
					return '0px';
				}
				return this.computeWidth({begin_time:pre_end_day,end_time:moment(cur_beging_day).subtract('1','days').format('YYYY-MM-DD')});
			}else{
				pre_end_day = this.circleData[index][ind-1].end_time;
				cur_beging_day =this.circleData[index][ind].begin_time;
				if(moment(pre_end_day).add('1','days').format('YYYY-MM-DD')===moment(cur_beging_day).format('YYYY-MM-DD')){
					return '0px';
				}
				return this.computeWidth({begin_time:moment(pre_end_day).add('1','days').format('YYYY-MM-DD'),end_time:moment(cur_beging_day).subtract('1','days').format('YYYY-MM-DD')});
			}
			
		},
		computeColor(roomInfo){
			if(roomInfo.turn_status==3){
				return '#d3dce6';
			}else if(roomInfo.turn_status==1){
				return '#20db9a';
			}else if(roomInfo.turn_status==0){
				return '#f99e1c';
			}else{
				return '#d3dce6';
			}
		}
	}
}
	
</script>
<style scoped>
.circleDetail{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.monthHeader{
	height:40px;
	display:flex;
	border-top: 1px solid rgb(223, 230, 236);
	
}
.monthCell{
	width: 100px;
	height: 41px;
	box-sizing: border-box;
	border-right: 1px solid rgb(223, 230, 236);
	border-bottom: 1px solid rgb(223, 230, 236);
	background-color:#eef1f6;
	text-align: center;
	font-weight: bold;
	font-size: 14px;
	line-height: 40px;
}
.circleDetailRow{
	display: flex;
	height:40px;
	padding:5px 0px;
	border-bottom: 1px solid rgb(223, 230, 236);
	box-sizing: border-box;
}
.roomCell{
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	width: 50px;
	color:#ffffff;
	background-color: #d3dce6;
	line-height: 30px;
	text-align: center;
	box-sizing: border-box;
	overflow:hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>