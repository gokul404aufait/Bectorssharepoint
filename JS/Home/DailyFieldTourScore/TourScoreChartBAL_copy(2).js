var deptTour = [];
var plantTour = [];
var chart1Arr = [];
var rawDepartments = new Array();
var rawGraphArr = new Array();
//let departmentID = ''; 
var currDate = new Date();
var currentYear = '';
var currentMonth = moment().format('M');
var currentDate = moment().format('DD');

$(document).ready(function () {
google.load("visualization", "1", {packages: ["corechart","bar"]});
	BindDropdownCalender();
	$("#drpTourScoreYear").change(function () {
	     $('#hdnGivenMonthName').val('');
		bindDropdownOnChange();
		bindDropdownofDate();
		searchMonthGraph();
	});
	$("#drpTourScoreMonth").change(function () {
		$('#hdnGivenMonthName').val('');
		bindDropdownofDate();
		
		searchMonthGraph();
	});
		$("#drpTourScoreDate").change(function () {
		$('#hdnGivenDate').val('');
		searchMonthGraph();
	});

	$('#hdnGivenDate').val('');
	$('#hdnGivenMonth').val('');
	$('#hdnGivenYear').val('');

	$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + userDepratmentId + '" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');

	$('select#DepartmentDropDownId').change(function () {
		if (($('select#DepartmentDropDownId').val()).length > 0 && $('select#DepartmentDropDownId').val() != 'All') {
			departmentID = $('select#DepartmentDropDownId').val();
			$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + departmentID + '" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
			GetDepartmentTourData(departmentID);
			GetPlantTourData(departmentID);
		} else {
			$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		}
	});
});
function bindDropdownofDate()
{
 var currentDay = (new Date).getDate();
var currentMonth = (new Date).getMonth() + 1;
var month = $('#drpTourScoreMonth').val();
var year=$('#drpTourScoreYear').val();
 var todayDt = daysInMonth(month ,year)
var datenumber= 0;
	var DateDropDown = '';
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


	if (year == currentYear && month == currentMonth ) 
	{
		for (var i = 0; i < currentDay ; i++)
		 {
			
				datenumber++
				
				DateDropDown += "<option value=" + datenumber+ ">" + datenumber + "</option>"
		}
	} 
	else 
	{
				for (var i = 0; i < todayDt ; i++)
		 {
			
				datenumber++
				
				DateDropDown += "<option value=" + datenumber+ ">" + datenumber + "</option>"
		
		}

	}
	$("#drpTourScoreDate").empty().append(DateDropDown );


}
function GetDisabledDept() {
	if ($("select#DepartmentDropDownId option:selected").val() != '' && $("select#DepartmentDropDownId option:selected").val() != 'All') {
		departmentID = $("select#DepartmentDropDownId option:selected").val();
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + dId + '" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		GetDepartmentTourData(departmentID);
		GetPlantTourData(departmentID);
	} else {
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
	}
}

function GetGraphDepartmentMasterDataSuccess(data) {
	rawDepartments = data;
	if (departmentID > 0) {
		GetDepartmentTourData(departmentID);
	} else {
		GetDepartmentTourData('');
	}
}

function GetGraphDepartmentMasterDataFailure() {
	console.log('Failed: GetGraphDepartmentMasterDataFailure \n' + err);
}

/*
 * Department Tour
 */
function GetDepartmentTourData(departmentId) {
	departmentId = departmentID;
	if (departmentId != '') {
		GetDepartmentTour(departmentId, DepartmentTourSuccess, DepartmentTourFailed);
	} else {
		GetDepartmentTour('', DepartmentTourSuccess, DepartmentTourFailed);
	}
}

function BindDropdownCalender() {
//  debugger;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dateArray = []
	currentYear = (new Date).getFullYear();
	var PreviousYear = ((new Date).getFullYear() - 1);
	var monthnumber = 0;
	var MonthDropDown = '';
	var yeardropdownhtml = '';
 var currentDay = (new Date).getDate();
	for (var i = 0; i < currentMonth; i++) {
		monthnumber++
		MonthDropDown += "<option value=" + monthnumber + ">" + months[i] + "</option>"
	}
	$("#drpTourScoreMonth").empty().append(MonthDropDown);

	yeardropdownhtml = "<option value=" + currentYear + ">" + currentYear + "</option>"
	yeardropdownhtml += "<option value=" + PreviousYear + ">" + PreviousYear + "</option>"
	$("#drpTourScoreYear").empty().append(yeardropdownhtml);

	$("#drpTourScoreMonth option[value='" + currentMonth + "']").prop('selected', true);
	bindDropdownofDate();
	$("#drpTourScoreDate option[value='" + currentDay + "']").prop('selected', true);

}


function bindDropdownOnChange() {


	var monthnumber = 0;
	var MonthDropDown = '';
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


	if ($("#drpTourScoreYear").val() == currentYear) 
	{
		for (var i = 0; i < currentMonth; i++)
		 {
			
				monthnumber++
				
				if(monthnumber>9)
				{
				MonthDropDown += "<option value=" + monthnumber + ">" + months[i] + "</option>"
				}
				else
				{
					MonthDropDown += "<option value=0"  + monthnumber + ">" + months[i] + "</option>"

				}
		}
	} 
	else 
	{
		for (var i = 0; i < months.length; i++) 
		{
			
				monthnumber++
				
				if(monthnumber>9)
				{
				MonthDropDown += "<option value=" + monthnumber + ">" + months[i] + "</option>"
				}
				else
				{
					MonthDropDown += "<option value=0"  + monthnumber + ">" + months[i] + "</option>"

				}
		}

	}
	$("#drpTourScoreMonth").empty().append(MonthDropDown);

}

function DepartmentTourSuccess(collDepartmentTour) {
	if (collDepartmentTour.length > 0) {

		deptTour = collDepartmentTour;
	} else {
		$('#tourChart').html('<div class="d-block">No record(s) found.</div>').css({
			'background': '#fff',
			'padding': '25px',
			'min-height': '75px',
			'height': 'auto'
		});
		$('#viewTsLnk').hide();
	}

	if (departmentID > 0) {
		GetPlantTourData(departmentID);
	} else {
		GetPlantTourData('');
	}
}

function DepartmentTourFailed(err) {
	console.log('Failed: DepartmentTourFailed \n' + err);
}

/*
 * Plant Tour
 */
function GetPlantTourData(departmentId) {
	departmentId = departmentID;
	if (departmentId != '') {
		GetPlantTour(departmentId, PlantTourSuccess, PlantTourFailed);
	} else {

		GetPlantTour('', PlantTourSuccess, PlantTourFailed);
	}
	/*if(departmentID == ''){
	     	GetDisabledDept();
	     }
	     else{
	     
	 	 i
		}	*/
}

function PlantTourSuccess(collPlantTour) {
	if (collPlantTour.length > 0) {
		plantTour = collPlantTour;
		if (departmentID != '') {
			ProcessMonthChartData();
		} else {
			ProcessChartData();
		}


	} else {
		$('#tourChart').html('<div class="d-block">No record(s) found.</div>')
			.css({
				'background': '#fff',
				'padding': '25px',
				'min-height': '75px',
				'height': 'auto'
			});
	}
}

function FilterScores(tourArr, departmentId, RoleSequence) {
	return arr = $.grep(tourArr, function (n, i) {
		return n.DepartmentID == departmentId && n.RoleSequence == RoleSequence;

	});
}

function FilterDates(tourArr, dateVal, RoleSequence) {
	return arr = $.grep(tourArr, function (n, i) {
		return moment(n.TourStartDate).format('D-MMM-YY') == dateVal && n.RoleSequence == RoleSequence;
	});
}

function ProcessMonthChartData() {
	rawGraphArr.length = 0;
	var selectedDate=$("#drpTourScoreDate").val();
	 var currentDay = (new Date).getDate();
	var dateArr = new Array();
	var currMonth = moment().format('MMM');
	var currYear = moment().format('YY');
	//var currYear = moment().format('yyyy');
	
	var year=$('#hdnGivenYear').val();
	 year= year.substring(4,2);
	if(($('#hdnGivenMonth').val() =='' && $('#hdnGivenYear').val()==''  && selectedDate=='') ||($('#hdnGivenMonthName').val() ==currMonth && year==currYear && && selectedDate==currentDay ) )
	{
			var todayDt = todayDate.getDate();
			
			for (var x = 1; x <= todayDt; x++) 
			{
				//var newdate = ('0' + x).slice(-2) + '-' + currMonth + '-' + currYear ;
		var newdate = ( x) + '-' + currMonth + '-' + currYear ;

				dateArr.push(newdate);
			}
			
	}
	else
	{
		var Month=$('#hdnGivenMonth').val();
		var MonthName=$('#hdnGivenMonthName').val();
		 MonthName= MonthName.substring(0, 3);

		

		
	      var todayDt = daysInMonth(Month,year)
			for (var x = 1; x <= todayDt; x++) 
			{
				//var newdate = (x) + '-' + Month+ '-' + year;
				var newdate = (x) + '-' + MonthName+ '-' + year;
		//var newdate = (x) + '-' + Month+ '-' + year;

				dateArr.push(newdate);
			}

	
	}		
	if (dateArr.length > 0) {
		for (var i = 0; i < dateArr.length; i++) {
			var currentPlantScore = 0;
			var currentPlantStartDate = null;
			var tempPlantTours = FilterDates(plantTour, dateArr[i], 30);
			if (tempPlantTours.length > 0) {
				for (var j = 0; j < tempPlantTours.length; j++) {
					currentPlantScore = parseInt(currentPlantScore) + parseInt(tempPlantTours[j].TourScore);
				}
			}
			var PlantTourScore = currentPlantScore;
			var currentDepartmentScore = 0;

			var tempDepartmentTours = FilterDates(deptTour, dateArr[i], 20);
			if (tempDepartmentTours.length > 0) {
				for (var k = 0; k < tempDepartmentTours.length; k++) {
					currentDepartmentScore = parseInt(currentDepartmentScore) + parseInt(tempDepartmentTours[k].TourScore);
				}
			}
			var DepartmentTourScore = currentDepartmentScore;
			var currScores = new rawGraphTourEntity();
			currScores.TourStartDate = dateArr[i];
			currScores.PlantScore = PlantTourScore;
			currScores.DepartmentScore = DepartmentTourScore;

			rawGraphArr.push(currScores);
		}
		if (departmentID != '') {
			ChartGen(2);
		} else {
			ChartGen(1);
		}


	}


}
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
function ProcessChartData() {
	rawGraphArr.length = 0;
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Octr", "Nov", "Dec"];
	if (rawDepartments.length > 0) {
		for (var i = 0; i < rawDepartments.length; i++) {
			var DepartmentId = rawDepartments[i].Id;
			var currentPlantScore = 0;
			var tempPlantTours = FilterScores(plantTour, DepartmentId, 30);
			if (tempPlantTours.length > 0) {
				for (var j = 0; j < tempPlantTours.length; j++) {
					currentPlantScore = parseInt(currentPlantScore) + parseInt(tempPlantTours[j].TourScore);
				}
				currentPlantScore = currentPlantScore / tempPlantTours.length;
			}
			var PlantTourScore = currentPlantScore;
			var currentDepartmentScore = 0;
			var tempDepartmentTours = FilterScores(deptTour, DepartmentId, 20);
			if (tempDepartmentTours.length > 0) {
				for (var k = 0; k < tempDepartmentTours.length; k++) {
					currentDepartmentScore = parseInt(currentDepartmentScore) + parseInt(tempDepartmentTours[k].TourScore);
				}
				currentDepartmentScore = currentDepartmentScore / tempDepartmentTours.length;
			}

			var DepartmentTourScore = currentDepartmentScore;
			var currScores = new rawGraphTourEntity();
			currScores.Department = rawDepartments[i].Title;
			currScores.PlantScore = PlantTourScore;
			currScores.DepartmentScore = DepartmentTourScore;

			rawGraphArr.push(currScores);
		}
		if (departmentID != '') {
			ChartGen(2);
		} else {
			ChartGen(1);
		}


	}


}

function PlantTourFailed(err) {
	console.log('Failed: PlantTourFailed \n' + err);
}
/*
 * Generate Chart
 */

function ChartGen(type) {
	 
	switch (type) {
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
	data.addColumn('string', 'Departments');
	data.addColumn('number', 'HOD Score(%)');
	data.addColumn({
		type: 'string',
		role: 'annotation'
	});
	data.addColumn('number', 'Plant Manager Score(%)');
	data.addColumn({
		type: 'string',
		role: 'annotation'
	});

	var tempFinalArr = new Array();
	if (rawGraphArr.length > 0) {
		for (var i = 0; i < rawGraphArr.length; i++) {
			var tempArr = new Array();

			tempArr.push(rawGraphArr[i].Department);
			tempArr.push(rawGraphArr[i].DepartmentScore);
			tempArr.push((rawGraphArr[i].DepartmentScore > 0) ? (rawGraphArr[i].DepartmentScore).toString() : null);
			tempArr.push(rawGraphArr[i].PlantScore);
			tempArr.push((rawGraphArr[i].PlantScore > 0) ? (rawGraphArr[i].PlantScore).toString() : null);


			tempFinalArr.push(tempArr);
		}
	}
	data.addRows(tempFinalArr);
	var view = new google.visualization.DataView(data);
	view.setColumns([0, 1, {
			calc: mystringy.bind(undefined, 1),
			sourceColumn: 3,
			type: "string",
			role: "annotation"
		},
		3, {
			calc: mystringy.bind(undefined, 3),
			sourceColumn: 2,
			type: "string",
			role: "annotation"
		}
	]);
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var drpMonth=$("#drpTourScoreMonth option:selected").text()
	var drpYear=$("#drpTourScoreYear option:selected").text()
	
	var modTitle = drpMonth+ " " + drpYear;

	var options = {
		displayAnnotations: true,
		seriesType: 'bars',
		title: 'Average Tour Score :' + modTitle,
		legend: {
			position: 'start',
			alignment: 'center'
		},
		height:500,
		hAxis: {
			title: 'Departments',
			slantedText: true,
			slantedTextAngle: 30
		},
		vAxis: {
			title: 'Average Score(%)',
		},
		animation: {
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
		colors: ["#ef3734", "#363435"]
	};

	var chart = new google.visualization.ComboChart(document.getElementById('tourChart'));
	chart.draw(view, options);
}

function drawMonthChart() {
	var chart1Data = {};
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'HOD Score(%)');
	data.addColumn({
		type: 'string',
		role: 'annotation'
	});
	data.addColumn('number', 'Plant Manager Score(%)');
	data.addColumn({
		type: 'string',
		role: 'annotation'
	});

	var tempFinalArr = new Array();
	if (rawGraphArr.length > 0) {
		for (var i = 0; i < rawGraphArr.length; i++) {
			var tempArr = new Array();

			tempArr.push(rawGraphArr[i].TourStartDate);
			tempArr.push(rawGraphArr[i].DepartmentScore);
			tempArr.push((rawGraphArr[i].DepartmentScore > 0) ? (rawGraphArr[i].DepartmentScore).toString() : null);
			tempArr.push(rawGraphArr[i].PlantScore);
			tempArr.push((rawGraphArr[i].PlantScore > 0) ? (rawGraphArr[i].PlantScore).toString() : null);


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
		}
	]);

	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var drpMonth=$("#drpTourScoreMonth option:selected").text()
	var drpYear=$("#drpTourScoreYear option:selected").text()
	
	var modTitle = drpMonth+ " " + drpYear;
	var options = {
		displayAnnotations: true,
		seriesType: 'bars',
		title: 'Daily Tour Score :' + modTitle,
		legend: {
			position: 'start',
			alignment: 'center'
		},
		height: 500,
		hAxis: {
			title: 'Date',
			slantedText: true,
			slantedTextAngle: 60
		},
		vAxis: {
			title: 'Average Score(%)',
		},
		animation: {
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
		colors: ["#ef3734", "#363435"]
	};
	var chart = new google.visualization.ComboChart(document.getElementById('tourChart'));

	chart.draw(data, options);
}

// search grapgh dropdown

function searchMonthGraph() {
	$('#hdnGivenDate').val($('select#drpTourScoreDate').val());
	$('#hdnGivenMonth').val($('select#drpTourScoreMonth').val());
	$('#hdnGivenMonthName').val('');
	//$('#hdnGivenMonthName').val($('select#drpTourScoreMonth').text());
	$('#hdnGivenDate').val($('#drpTourScoreDate option:selected').text());
     $('#hdnGivenMonthName').val($('#drpTourScoreMonth option:selected').text());
	$('#hdnGivenYear').val($('select#drpTourScoreYear').val());


	if (($('select#DepartmentDropDownId').val()).length > 0 && $('select#DepartmentDropDownId').val() != 'All') {
		departmentID = $('select#DepartmentDropDownId').val();
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + departmentID + '" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
		GetDepartmentTourData(departmentID);
		GetPlantTourData(departmentID);
	} else {
		$('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="text-dark">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/arrow.png"></a>');
	   GetDepartmentTourData(departmentID);
		GetPlantTourData(departmentID);

	}


}