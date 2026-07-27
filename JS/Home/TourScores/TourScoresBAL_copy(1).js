var SelectedDepartmentValue='All';
var deptTour = [];
var plantTour = [];
var chart1Arr = [];
var rawDepartments = new Array();
var rawTblArr = new Array();
var departmentID = 0; 
let currDate = new Date();

$(document).ready(function(){
 	
 	rawDepartments.length=0;
	GetGraphDepartmentMasterData(GetGraphDepartmentMasterDataSuccess,GetGraphDepartmentMasterDataFailure);
	
	$('select#deptDdlTxt').change(function(){
		departmentID = parseInt($('select#deptDdlTxt option:selected').val());	 
		GetDepartmentTourData(departmentID);
	});
	
	$('span#deptLbl').hide();
	
	var empType = (GetQueryStringParams('role')).toLowerCase();
	if(empType != ''){
		switch(empType){
			case 'pm':
				$('select#deptDdlTxt').prop('disabled',false);
				getEmployeeDetails(EmployeeDetailsSuccess,EmployeeDetailsFailure);
				break;
			default:
				$('select#deptDdlTxt').prop('disabled',true);
				//departmentID = GetQueryStringParams('dept');
				getEmployeeDetails(EmployeeDetailsSuccess,EmployeeDetailsFailure);
				break;
		}
	}
	else{
		history.go(-1);
	}
});
function EmployeeDetailsSuccess(collEmployee)
{
	if(collEmployee.length>0)
	{
		var userDepratmentId = collEmployee[0].DepartmentId;
		var userRoleSequence= collEmployee[0].RoleId;
		
		if(userDepratmentId == '' && userRoleSequence== '')
		{
			console.log('Sorry! Employee Name/Role not found.');
		}
		
		if(userRoleSequence==15)
		{
			$('select#deptDdlTxt').val('-1');
			$('select#deptDdlTxt').prop('disabled',false);
			GetDepartmentTourData('');
		}
		else
		{
			$('select#deptDdlTxt').val(userDepratmentId);
			departmentID = parseInt(userDepratmentId);	 
			GetDepartmentTourData(departmentID);
			$('select#deptDdlTxt').prop('disabled',true);
		}
	}
	else
	{
		$('.tblTourScores tbody#tourScoresBdy').html('<tr><td colspan="9">Sorry! Employee Name/Role not found.</td></tr>');
	}

	
}

function EmployeeDetailsFailure(err)
{
console.log('Failed: EmployeeDetailsFailure \n'+err);
}

function BindDepartmentDdlBox(data){
	if(data != null){
		for(var x=0,m=data.length;x<m;x++){
			$('select#deptDdlTxt').append('<option value="'+data[x].Id+'">'+data[x].Title+'</option>');
		}
		$("select#deptDdlTxt").prepend('<option value="-1" selected>'+SelectedDepartmentValue+'</option>');
	}
}
function GetGraphDepartmentMasterDataSuccess(data)
{
	rawDepartments=data;
	
	if($('select#deptDdlTxt').children('option').length == 0){
		BindDepartmentDdlBox(rawDepartments);
	}
	
	/*if(departmentID > 0){
		GetDepartmentTourData(departmentID);
	}
	else{
		GetDepartmentTourData('');
	}*/
}

 function GetGraphDepartmentMasterDataFailure(err)
{
 console.log('Failed: GetGraphDepartmentMasterDataFailure \n'+err);
}

/*
 * Department Tour
 */
function GetDepartmentTourData(departmentId)
{
	 //departmentId = departmentID;
	 if(departmentId > 0)
	 {
	 	GetDepartmentTour(departmentId,DepartmentTourSuccess,DepartmentTourFailed);
	 }
	 else
	 {
	    GetDepartmentTour('',DepartmentTourSuccess,DepartmentTourFailed);
	 }
}
function DepartmentTourSuccess(collDepartmentTour)
{
	 if(collDepartmentTour.length>0)
	 {
	 	deptTour = collDepartmentTour; 	
	 }
	 else
	 {
	 	$('.tblTourScores tbody#tourScoresBdy').html('<tr><td colspan="9">No Record(s) Found.</td></tr>');
	 }
	 
	 if(departmentID > 0)
	 {
		GetPlantTourData(departmentID);
	 }
	 else
	 {
		GetPlantTourData('');
	 }
}

function DepartmentTourFailed(err)
{
 console.log('Failed: DepartmentTourFailed \n'+err);
}

/*
 * Plant Tour
 */
 function GetPlantTourData(departmentId)
 {
 	 if(departmentId > 0)
 	 {
 	 
	 	GetPlantTour(departmentId,PlantTourSuccess,PlantTourFailed);
	 }
	 else
	 {
	    GetPlantTour('',PlantTourSuccess,PlantTourFailed);
	 }
	
 }

function PlantTourSuccess(collPlantTour)
{
	 if(collPlantTour.length>0)
	 {
		 	plantTour = collPlantTour;
		 	
		 	if(departmentID > 0)
		 	{
			 	ProcessDeptTblData(departmentID);
			 }
			 else
			 {
			    ProcessTblData();
			 }
	 	
	 	
	  }
	 else
	 {
	 	$('.tblTourScores tbody#tourScoresBdy').html('<tr><td colspan="9">No Record(s) Found.</td></tr>'); 
	 }
}

function FilterScores(tourArr,departmentId)
{
		return arr = $.grep(tourArr, function( n, i ) 
		{
		  return n.DeptID == departmentId ;
		});
}
function FilterDates(tourArr,dateVal)
{
	return arr = $.grep(tourArr, function( n, i ) 
	{
		  return moment(n.TourStartDate).format('DD-MMM-YYYY') == moment(dateVal).format('DD-MMM-YYYY');
	});
}

function ProcessDeptTblData(departmentID)
{
	rawTblArr.length=0;
	if(departmentID > 0){
		for(var x=0,m=deptTour.length;x<m;x++) 
		{
			finalTbl = {};
			var retArr = FilterDates(plantTour,deptTour[x].TourStartDate);
		    finalTbl['DID'] = deptTour[x].ID;	
			finalTbl['Date'] = deptTour[x].TourStartDate;
			finalTbl['DeptID'] = deptTour[x].DepartmentID;
			finalTbl['DeptName'] = deptTour[x].Department;
			finalTbl['NcHOD'] = deptTour[x].TotalObservations;
			finalTbl['HODScore'] = deptTour[x].TourScore;
			finalTbl['HODComments'] = deptTour[x].FinalComment;
			//finalTbl['HODTAT'] = DiffMinutes(moment(deptTour[x].TourCompletionDate).format('DD-MMM-YYYY HH:mm:ss'), moment(deptTour[x].TourStartDate).format('DD-MMM-YYYY HH:mm:ss'));
		  var startTime=moment(deptTour[x].TourStartDate).format('DD/MM/YYYY HH:mm:ss');
	      var CompletionTime=moment(deptTour[x].TourCompletionDate).format('DD/MM/YYYY HH:mm:ss');

		finalTbl['HODTAT']=moment.utc(moment(CompletionTime,"DD/MM/YYYY HH:mm").diff(moment(startTime,"DD/MM/YYYY HH:mm"))).format("HH:mm")
		if(retArr.length>0)
		{
			finalTbl['PID'] = retArr[0].ID;
			finalTbl['NcPM'] = retArr[0].TotalObservations;
			finalTbl['PMDeptID'] = retArr[0].DepartmentID;
		    finalTbl['PMDeptName'] = retArr[0].Department;
			finalTbl['PMScore'] = retArr[0].TourScore;
			finalTbl['PMComments'] = retArr[0].FinalComment;
			//finalTbl['PMTAT'] = DiffMinutes(moment(retArr[0].TourCompletionDate).format('DD-MMM-YYYY HH:mm:ss'), moment(retArr[0].TourStartDate).format('DD-MMM-YYYY HH:mm:ss'));
		  var startTime=moment(retArr[0].TourStartDate).format('DD/MM/YYYY HH:mm:ss');
	      var CompletionTime=moment(retArr[0].TourCompletionDate).format('DD/MM/YYYY HH:mm:ss');
          finalTbl['PMTAT']=moment.utc(moment(CompletionTime,"DD/MM/YYYY HH:mm").diff(moment(startTime,"DD/MM/YYYY HH:mm"))).format("HH:mm")

		}
		else{
			finalTbl['PID'] = '';
			finalTbl['NcPM'] = '';
			finalTbl['PMDeptID'] = '';
		    finalTbl['PMDeptName'] = '';
			finalTbl['PMScore'] = '';
			finalTbl['PMComments'] = '';
			finalTbl['PMTAT'] = '';	
		}
		if(!rawTblArr.includes(finalTbl['DID']))
		{
			rawTblArr.push(finalTbl);
		}
	}
		/*for(let i=0; i<deptTour.length; i++) {
		  rawTblArr.push({
		   ...deptTour[i], 
		   ...(plantTour.find((itmInner) => itmInner.TourStartDate === deptTour[i].TourStartDate))}
		  );
		}*/
		//rawTblArr = MergeByDate(deptTour,plantTour); //deptTour.concat(plantTour);
		
		rawTblArr.sort((a,b) => (a.TourStartDate > b.TourStartDate) ? 1 : ((b.TourStartDate > a.TourStartDate) ? -1 : 0));
		filterTblArr = FilterScores(rawTblArr,parseInt(departmentID));
		
		if(filterTblArr.length>0)
		{
			var tourScoresBdy = '';
			for(var x=0,m=filterTblArr.length;x<m;x++)
			{
				tourScoresBdy+='<tr data-dept="'+finalTbl['DeptName']+'">'+
								'<td>'+moment(rawTblArr[x].Date).format('DD-MMM-YYYY')+'</td>'+
								'<td>'+rawTblArr[x].NcHOD+'</td>'+
								'<td>'+rawTblArr[x].HODScore+'</td>'+
								'<td>'+rawTblArr[x].HODComments+'</td>'+
								'<td>'+rawTblArr[x].HODTAT+'</td>'+
								'<td>'+rawTblArr[x].NcPM+'</td>'+
								'<td>'+rawTblArr[x].PMScore+'</td>'+
								'<td>'+rawTblArr[x].PMComments+'</td>'+
								'<td>'+rawTblArr[x].PMTAT+'</td>'+
							'</tr>';
			}
			$('.tblTourScores tbody#tourScoresBdy').empty().append('<tr><td colspan="10" align="center"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/loading.gif" width="50" height="50" border="0" /></td></tr>');
			setTimeout(function(){
				$('.tblTourScores tbody#tourScoresBdy').empty().append(tourScoresBdy);
				//$('.tblTourScores').DataTable();
				SearchColumns();
				if(GetQueryStringParams('dept')>0)
				{
					$('span#deptLbl').text($('.tblTourScores tbody#tourScoresBdy tr:first').data('dept')).show();
				}
				else
				{
					$('span#deptLbl').hide();
				}
			},5000);
		}
		else
		{
			$('.tblTourScores tbody#tourScoresBdy').empty().append('<tr><td colspan="10" align="center"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/loading.gif" width="50" height="50" border="0" /></td></tr>');
			setTimeout(function(){
				$('.tblTourScores tbody#tourScoresBdy').empty().append('<tr><td colspan="10" align="center">No Tour Score(s) Found.</td></tr>');
			},5000);		}
	}
}
function DiffMinutes(dt2, dt1) 
{
	var diff =((new Date(dt2)).getTime() - (new Date(dt1)).getTime()) / 1000;
	diff /= 60;
	return Math.abs(Math.round(diff));
}
function ProcessTblData()
{
	rawTblArr.length=0;

	for(var x=0,m=deptTour.length;x<m;x++) 
	{
		finalTbl = {};
		var retArr = FilterDates(plantTour,deptTour[x].TourStartDate);
	    finalTbl['DID'] = deptTour[x].ID;	
		finalTbl['Date'] = deptTour[x].TourStartDate;
		finalTbl['DeptID'] = deptTour[x].DepartmentID;
		finalTbl['DeptName'] = deptTour[x].Department;
		finalTbl['NcHOD'] = deptTour[x].TotalObservations;
		finalTbl['HODScore'] = deptTour[x].TourScore;
		finalTbl['HODComments'] = deptTour[x].FinalComment;
		finalTbl['HODTAT'] = DiffMinutes(moment(deptTour[x].TourCompletionDate).format('DD-MMM-YYYY HH:mm:ss'), moment(deptTour[x].TourStartDate).format('DD-MMM-YYYY HH:mm:ss'));
		if(retArr.length>0){
			finalTbl['PID'] = retArr[0].ID;
			finalTbl['NcPM'] = retArr[0].TotalObservations;
			finalTbl['PMDeptID'] = retArr[0].DepartmentID;
		    finalTbl['PMDeptName'] = retArr[0].Department;
			finalTbl['PMScore'] = retArr[0].TourScore;
			finalTbl['PMComments'] = retArr[0].FinalComment;
			finalTbl['PMTAT'] = DiffMinutes(moment(retArr[0].TourCompletionDate).format('DD-MMM-YYYY HH:mm:ss'), moment(retArr[0].TourStartDate).format('DD-MMM-YYYY HH:mm:ss'));
		}
		else
		{
			finalTbl['PID'] = '';
			finalTbl['NcPM'] = '';
			finalTbl['PMDeptID'] = '';
		    finalTbl['PMDeptName'] = '';
			finalTbl['PMScore'] = '';
			finalTbl['PMComments'] = '';
			finalTbl['PMTAT'] = '';	
		}
		if(!rawTblArr.includes(finalTbl['DID']))
		{
			rawTblArr.push(finalTbl);
		}
	}
	rawTblArr.sort((a,b) => (a.Date> b.Date ) ? 1 : ((b.Date > a.Date ) ? -1 : 0)); 
	if(rawTblArr.length>0){
		var tourScoresBdy = '';
		for(var x=0,m=rawTblArr.length;x<m;x++)
		{
			tourScoresBdy+='<tr>'+
								'<td>'+moment(rawTblArr[x].Date).format('DD-MMM-YYYY')+'</td>'+
								'<td>'+rawTblArr[x].NcHOD+'</td>'+
								'<td>'+rawTblArr[x].HODScore+'</td>'+
								'<td>'+rawTblArr[x].HODComments+'</td>'+
								'<td>'+rawTblArr[x].HODTAT+'</td>'+
								'<td>'+rawTblArr[x].NcPM+'</td>'+
								'<td>'+rawTblArr[x].PMScore+'</td>'+
								'<td>'+rawTblArr[x].PMComments+'</td>'+
								'<td>'+rawTblArr[x].PMTAT+'</td>'+
							'</tr>';
		}
		$('.tblTourScores tbody#tourScoresBdy').empty().append('<tr><td colspan="10" align="center"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/loading.gif" width="50" height="50" border="0" /></td></tr>');
		setTimeout(function(){
			$('.tblTourScores tbody#tourScoresBdy').empty().append(tourScoresBdy);
			//$('.tblTourScores').DataTable();
			var tsTbl = $('.tblTourScores').DataTable({
				orderCellsTop: true,
				fixedHeader: true,
				"pageLength": 20
			});
			SearchColumns(tsTbl);
		},2000);
	}
	else{
		$('.tblTourScores').hide();
		$('#divNoRecords').show();
	}
}

function PlantTourFailed(err)
{
	console.log('Failed: PlantTourFailed \n'+err);
}
function SearchColumns(tsTbl) 
{
	$('.tblTourScores thead tr#tsSearch th').each(function (i) {
		var title = $(this).text();
		$(this).html('<section class="form-group"><input type="text" class="form-control form-control-sm" title="Filter '+(title!=' '?title:'')+'" /></section>');
		$('input', this).on('keyup change', function () {
			if (tsTbl.column(i).search() !== this.value) {
				tsTbl.column(i)
					 .search(this.value)
					 .draw();
			}
		});
		
	});
	/*tsTbl = $('.tblTourScores').DataTable({
		orderCellsTop: true,
		fixedHeader: true,
		"pageLength": 20
	});*/
	/*tsTbl.columns().every(function () {
		var that = this;
		$('input', this).on('keyup change', function (e) {
			e.stopPropagation();
			if (that.search() !== this.value) {
				that.search(this.value)
					.draw();
			}
		});
	});*/
}