var deptTour = [];
var plantTour = [];
var chart1Arr = [];
var rawDepartments = new Array();
var rawGraphArr = new Array();
//let departmentID = ''; 
let currDate = new Date();

$(document).ready(function(){
 	
 	/*
 	rawDepartments.length=0;
 	$('#tourChart').css('height','500px');
	GetGraphDepartmentMasterData(GetGraphDepartmentMasterDataSuccess,GetGraphDepartmentMasterDataFailure);
	 */
	$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept='+userDepratmentId+'" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');

	$('select#DepartmentDropDownId').change(function(){
		if(($('select#DepartmentDropDownId').val()).length > 0 && $('select#DepartmentDropDownId').val() != 'All'){
		   departmentID = $('select#DepartmentDropDownId').val();	
		   	$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept='+departmentID+'" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		   GetDepartmentTourData(departmentID);
		   GetPlantTourData(departmentID);	
		}
		else{
			$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		}
	});
});
function GetDisabledDept(){
	if($("select#DepartmentDropDownId option:selected").val() != '' && $("select#DepartmentDropDownId option:selected").val() != 'All'){
		departmentID = $("select#DepartmentDropDownId option:selected").val();
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept='+dId+'" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		GetDepartmentTourData(departmentID);
		GetPlantTourData(departmentID);
	}
	else{
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
	}
}
function GetGraphDepartmentMasterDataSuccess(data)
{
	rawDepartments=data;
	if(departmentID > 0){
		GetDepartmentTourData(departmentID);
	}
	else{
		GetDepartmentTourData('');
	}
}

function GetGraphDepartmentMasterDataFailure()
{
 console.log('Failed: GetGraphDepartmentMasterDataFailure \n'+err);
}

/*
 * Department Tour
 */
function GetDepartmentTourData(departmentId){
 departmentId = departmentID;
 if(departmentId != ''){
 	GetDepartmentTour(departmentId,DepartmentTourSuccess,DepartmentTourFailed);
 }
 else{
    GetDepartmentTour('',DepartmentTourSuccess,DepartmentTourFailed);
 }
}
function DepartmentTourSuccess(collDepartmentTour){
 if(collDepartmentTour.length>0){
 	deptTour = collDepartmentTour; 	
 }
 else{
 	$('#tourChart').html('<div class="d-block">No record(s) found.</div>')
 	       	       .css({'background':'#fff','padding':'25px','height':'75px'});
 	       	       $('#viewTsLnk').hide();
 }
 
 if(departmentID > 0){
	GetPlantTourData(departmentID);
 }
 else{
	GetPlantTourData('');
 }
}

function DepartmentTourFailed(err){
 console.log('Failed: DepartmentTourFailed \n'+err);
}

/*
 * Plant Tour
 */
 function GetPlantTourData(departmentId){
     departmentId = departmentID;
     if(departmentId != ''){
	 	GetPlantTour(departmentId,PlantTourSuccess,PlantTourFailed);
	 }
	 else{	
	 	
	    GetPlantTour('',PlantTourSuccess,PlantTourFailed);
	 }
     /*if(departmentID == ''){
     	GetDisabledDept();
     }
     else{
     
 	 i
	}	*/
 }

function PlantTourSuccess(collPlantTour){
 if(collPlantTour.length>0){
 	plantTour = collPlantTour;
 	if(departmentID != ''){
	 	ProcessMonthChartData();
	 }
	 else{
	    ProcessChartData();
	 }
 	
 	
 }
 else{
	$('#tourChart').html('<div class="d-block">No record(s) found.</div>')
 	       	       .css({'background':'#fff','padding':'25px','height':'75px'}); 
 }
}

function FilterScores(tourArr,departmentId)
{
	return arr = $.grep(tourArr, function( n, i ) {
		  return n.DepartmentID == departmentId ;
		});
}
function FilterDates(tourArr,dateVal)
{
	return arr = $.grep(tourArr, function( n, i ) {
		  return moment(n.TourStartDate).format('DD-MM-YYYY') ==dateVal;
	});
}

function ProcessMonthChartData()
{
	rawGraphArr.length=0;
	var dateArr = new Array();
	var todayDt = todayDate.getDate();
	for(var x=1;x<=todayDt;x++){
	var newdate=('0'+x).slice(-2)+'-'+('0'+(todayDate.getMonth() + 1)).slice(-2)+'-'+todayDate.getFullYear();
	
	  dateArr.push(newdate);
	}
	if(dateArr.length>0)
	{
		for(var i=0;i<dateArr.length;i++)
		{
			var currentPlantScore=0;
			var currentPlantStartDate=null;
			var tempPlantTours=FilterDates(plantTour,dateArr[i]);
			if(tempPlantTours.length>0)
			{
				for(var j=0;j<tempPlantTours.length;j++)
				{
					currentPlantScore=parseInt(currentPlantScore)+parseInt(tempPlantTours[j].TourScore);
				}
			}
			var PlantTourScore=currentPlantScore;
			var currentDepartmentScore=0;

			var tempDepartmentTours=FilterDates(deptTour ,dateArr[i]);
			if(tempDepartmentTours.length>0)
			{
				for(var k=0;k<tempDepartmentTours.length;k++)
				{
					currentDepartmentScore=parseInt(currentDepartmentScore)+parseInt(tempDepartmentTours[k].TourScore);
				}
			}
			var DepartmentTourScore=currentDepartmentScore;
			var currScores=new rawGraphTourEntity();
			currScores.TourStartDate=dateArr[i];
			currScores.PlantScore=PlantTourScore;
			currScores.DepartmentScore=DepartmentTourScore;
			
			rawGraphArr.push(currScores);
		}
		if(departmentID != ''){
		   ChartGen(2);		
		}
		else{
	 	   ChartGen(1);
	 	}
		
		
	}
	
	
}
function ProcessChartData()
{
	rawGraphArr.length=0;
	const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Octr", "Nov", "Dec"];
	if(rawDepartments.length>0)
	{
		for(var i=0;i<rawDepartments.length;i++)
		{
			var DepartmentId=rawDepartments[i].Id;
			var currentPlantScore=0;
			var tempPlantTours=FilterScores(plantTour ,DepartmentId);
			if(tempPlantTours.length>0)
			{
				for(var j=0;j<tempPlantTours.length;j++)
				{
					currentPlantScore=parseInt(currentPlantScore)+parseInt(tempPlantTours[j].TourScore);
				}
			}
			var PlantTourScore=currentPlantScore;
			var currentDepartmentScore=0;
			var tempDepartmentTours=FilterScores(deptTour ,DepartmentId);
			if(tempDepartmentTours.length>0)
			{
				for(var k=0;k<tempDepartmentTours.length;k++)
				{
					currentDepartmentScore=parseInt(currentDepartmentScore)+parseInt(tempDepartmentTours[k].TourScore);
				}
			}
			var DepartmentTourScore=currentDepartmentScore;
			var currScores=new rawGraphTourEntity();
			currScores.Department=rawDepartments[i].Title;
			currScores.PlantScore=PlantTourScore;
			currScores.DepartmentScore=DepartmentTourScore;
			
			rawGraphArr.push(currScores);
		}
		if(departmentID != ''){
		   ChartGen(2);		
		}
		else{
	 	   ChartGen(1);
	 	}
		
		
	}
	
	
}

function PlantTourFailed(err){
	console.log('Failed: PlantTourFailed \n'+err);
}
/*
 * Generate Chart
 */
 
function ChartGen(type){
 	  google.load("visualization", "1", {packages: ["corechart","bar"]});
      switch(type){
       case 1:
      		google.charts.setOnLoadCallback(drawTourChart);	 		
        	break;
       case 2:
      		google.charts.setOnLoadCallback(drawMonthChart);	 		
        	break;
      }
}
function mystringy(column, data, row) {
  return ' ' + data.getFormattedValue(row, column);
} 
function drawTourChart() {
	var data = new google.visualization.DataTable();
		data.addColumn('string','Departments');
		data.addColumn('number','Plant Manager Score(%)');
		data.addColumn({type:'string',role: 'annotation'});
		data.addColumn('number','HOD Score(%)');
		data.addColumn({type:'string',role: 'annotation'});
		
		var tempFinalArr=new Array();
		if(rawGraphArr.length>0)
		{
			for(var i=0;i<rawGraphArr.length;i++)
			{
				var tempArr=new Array();
				
				 tempArr.push(rawGraphArr[i].Department);
				 tempArr.push(rawGraphArr[i].PlantScore);
				 tempArr.push((rawGraphArr[i].PlantScore>0)?(rawGraphArr[i].PlantScore).toString():null);
				 tempArr.push(rawGraphArr[i].DepartmentScore);
				 tempArr.push((rawGraphArr[i].DepartmentScore>0)?(rawGraphArr[i].DepartmentScore).toString():null);
				 
				 tempFinalArr.push(tempArr);
			}
		}
		data.addRows(tempFinalArr);
        var view = new google.visualization.DataView(data);
view.setColumns([0, 1, {
  calc: mystringy.bind(undefined, 1),
  sourceColumn: 1,
  type: "string",
  role: "annotation"
},
3, {
  calc: mystringy.bind(undefined, 3),
  sourceColumn: 3,
  type: "string",
  role: "annotation"
}]);
    const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var modTitle = months[currDate.getMonth()]+" "+currDate.getFullYear();
    
    var options = {
   	  displayAnnotations: true,
   	  seriesType: 'bars',
   	  title: 'Daily Tour Score :'+modTitle,
      legend: { position: 'start', alignment: 'center'},
      hAxis: {
          title: 'Departments',
          slantedText:true, 
          slantedTextAngle:30
        },
      vAxis: {
	      title: 'Daily Score(%)',
	    },
	  animation:{
        duration: 3000,
        easing: 'inAndOut',
        startup: true
      },
	  annotations: {
        alwaysOutside: 'false',
        textStyle: { 
            fontSize: 14,
            color: "#000000"
        }
    },
    interpolateNulls: true,
    fontSize: "14",
    colors: ["#363435", "#ef3734"]
    };

    var chart = new google.visualization.ComboChart(document.getElementById('tourChart'));
    chart.draw(view, options);
  }
 function drawMonthChart() {
    var chart1Data = {};
	var data = new google.visualization.DataTable();
		data.addColumn('string','Date');
		data.addColumn('number','Plant Manager Score(%)');
		data.addColumn({type:'string',role: 'annotation'});		
		data.addColumn('number','HOD Total Score(%)');
		data.addColumn({type:'string',role: 'annotation'});
				
		var tempFinalArr=new Array();
		if(rawGraphArr.length>0)
		{
			for(var i=0;i<rawGraphArr.length;i++)
			{
				var tempArr=new Array();
				
				 tempArr.push(rawGraphArr[i].TourStartDate);
				 tempArr.push(rawGraphArr[i].PlantScore);
				 tempArr.push((rawGraphArr[i].PlantScore>0)?(rawGraphArr[i].PlantScore).toString():null);
				 tempArr.push(rawGraphArr[i].DepartmentScore);
				 tempArr.push((rawGraphArr[i].DepartmentScore>0)?(rawGraphArr[i].DepartmentScore).toString():null);
				 
				 tempFinalArr.push(tempArr);
			}
		}
		data.addRows(tempFinalArr);
		var view = new google.visualization.DataView(data);
view.setColumns([0, 1, {
  calc: mystringy.bind(undefined, 1),
  sourceColumn: 1,
  type: "string",
  role: "annotation"
},
3, {
  calc: mystringy.bind(undefined, 3),
  sourceColumn: 3,
  type: "string",
  role: "annotation"
}]);

    const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var modTitle = months[currDate.getMonth()]+" "+currDate.getFullYear();
    var options = {
   	  displayAnnotations: true,
   	  seriesType: 'bars',
   	  title: 'Daily Tour Score :'+modTitle,
      legend: { position: 'start', alignment: 'center'},
      height: 500,
      hAxis: {
          title: 'Date',
          slantedText:true, 
          slantedTextAngle:60
        },
      vAxis: {
	      title: 'Daily Score(%)',
	    },
	  animation:{
        duration: 3000,
        easing: 'inAndOut',
        startup: true
      },
	    interpolateNulls: true,
	  annotations: {
        alwaysOutside: 'false',
        textStyle: { 
            fontSize: 14,
            color: "#000000"
        }
    },
    fontSize: "14",
    colors: ["#363435", "#ef3734"]
    };
    var chart = new google.visualization.ComboChart(document.getElementById('tourChart'));

    chart.draw(data, options);
  }
