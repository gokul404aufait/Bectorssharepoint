var SelectedDepartmentValue = 'All';
var deptTour = [];
var plantTour = [];
var chart1Arr = [];
var rawDepartments = new Array();
var rawTblArr = new Array();
var departmentID = 0;
var currDate = new Date();
var userRoleSequence = '';
var userPlantId;
var PlantIdValue1;
var userDepratmentId = '';

$(document).ready(function () {
    $(".form-select").select2();
    rawDepartments.length = 0;
    getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);
    TourScoreSuccessData();
});
function EmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        userDepratmentId = collEmployee[0].DepartmentId;
        userPlantId = collEmployee[0].PlantIdTitle;
        userRoleSequence = collEmployee[0].RoleSequence;

        if (userRoleSequence == 20 || userRoleSequence == 10) {
            //$('select#deptDdlTxt').val(userDepratmentId);
            departmentID = parseInt(userDepratmentId);
            //GetDepartmentTourData(departmentID);
            //$('select#deptDdlTxt').prop('disabled',true);
        }
        GetGraphDepartmentMasterData(GetGraphDepartmentMasterDataSuccess, GetGraphDepartmentMasterDataFailure);

    }
    else {
        alert('Sorry! Employee Name/Role not found');
    }

}

function EmployeeDetailsFailure(err) {
}

function GetGraphDepartmentMasterDataSuccess(collDepart) {
    if (collDepart.length > 0) {
        rawDepartments = collDepart
        var DepartDropDown = "<option value='Select'>Select Department</option>";

        for (var i = 0; i < collDepart.length; i++) {

            DepartDropDown += "<option value=" + collDepart[i].Id + ">" + collDepart[i].Title + "</option>"

        }
        $("#InnerDepartmentDropDownId").empty().append(DepartDropDown);


        if (userRoleSequence == 30) {

            BindGridviewofDepartmentScores()
        }
        else {
            GetDepartmentTour(userDepratmentId, DepartmentTourSuccess, DepartmentTourFailed);
            $('#InnerDepartmentDropDownId').val(userDepratmentId).prop('disabled', true);

        }

    }

}

function drpDepartmentChangefun() {
    var selectedDepartment = $('#InnerDepartmentDropDownId').val();
    if (selectedDepartment != 'All') {
        SelectedDepartmentValue = selectedDepartment;
    }
    else {
        SelectedDepartmentValue = 'All'
    }

    if (SelectedDepartmentValue == 'All') {
        BindGridviewofDepartmentScores()

    }
    else {
        departmentID = selectedDepartment;
        GetDepartmentTour(selectedDepartment, DepartmentTourSuccess, DepartmentTourFailed);

    }




}


function GetGraphDepartmentMasterDataFailure(err) {
    // alert('Failed: GetGraphDepartmentMasterDataFailure \n'+err);
}

function DepartmentTourSuccess(collDepartmentTour) {
    if (collDepartmentTour.value.length > 0) {
        deptTour = collDepartmentTour;
        ProcessDeptTblData(departmentID);

    }
    else {
        DepartmentTourArray = [];
        BindGridviewofDepartmentScores();
    }
}

function DepartmentTourFailed(err) {
    //alert('Failed');
}


var RawDeptTourData = [];
var DepartmentTourArray = [];

async function TourScoreSuccessData() {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_departmenttours";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_status eq 'Completed') &$orderby=modifiedon desc" ;
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
   /*const response = await fetch( apiUrl, {
        method: "GET",
        headers: header,success: function (data) {
        ObservationReportData(data);
      }
      } );*/
       $.ajax( {
      url: apiUrl,
      type: "GET",
      headers: header,
      success: function ( data ) {
         DepartmentTourSuccess(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
}

function ProcessDeptTblData(departmentID) {
    DepartmentTourArray = [];

    if (departmentID > 0) {
        var Filtereddate = getUniqueDates();

        if (Filtereddate.length > 0) {
            for (var i = 0; i < Filtereddate.length; i++) {
                var retArr = deptTour;
                var Objscoresentity = deptTour;
                Objscoresentity.value[i].cr3ea_tourstartdate = Filtereddate[i].cr3ea_tourstartdate;
                if (retArr.value.length > 0) {
                    for (var j = 0; j < retArr.value.length; j++) {
                        Objscoresentity.TotalObservationbyHOD = retArr.value[j].cr3ea_totalobservations;
                        Objscoresentity.TourScorebyHOD = retArr.value[j].cr3ea_tourscore;
                        Objscoresentity.FinalCommentbyHOD = retArr.value[j].cr3ea_finalcomment;
                        var startTime = moment(retArr.value[j].cr3ea_tourstartdate);//.format('YYYY-MM-DD hh:mm:ss');
                        var CompletionTime = moment(retArr.value[j].cr3ea_tourcompletiondate);//.format('YYYY-MM-DD hh:mm:ss');
                        var totalminutes = CompletionTime.diff(startTime, 'minutes');
                        var totalHours = parseInt(totalminutes / 60);
                        var totalMinutes = parseInt(totalminutes % 60);
                        if (totalHours >= 10) {
                            Objscoresentity.DurationbyHOD = totalHours + ':' + ('0' + totalMinutes).slice(-2);

                        }
                        else {
                            Objscoresentity.DurationbyHOD = ('0' + totalHours).slice(-2) + ':' + ('0' + totalMinutes).slice(-2);

                        }
                        //Objscoresentity.DurationbyHOD=totalHours+':'+ ('0'+totalMinutes).slice(-2);
                        //Objscoresentity.DurationbyHOD=('0'+CompletionTime.diff(startTime,'hours')).slice(-2)+':'+ ('0'+CompletionTime.diff(startTime,'minutes')).slice(-2);

                    }
                }
                else {
                    Objscoresentity.TotalObservationbyHOD = '';
                    Objscoresentity.TourScorebyHOD = '';
                    Objscoresentity.FinalCommentbyHOD = '';
                    Objscoresentity.DurationbyHOD = ''
                }

                var filteredPlantArray = FilterDepratmentTour(deptTour, Filtereddate[i].TourStartDate, 30);
                if (filteredPlantArray.length > 0) {
                    for (var j = 0; j < filteredPlantArray.length; j++) {
                        Objscoresentity.TotalObservationbyPant = filteredPlantArray[j].TotalObservations;
                        Objscoresentity.TourScorebyPant = filteredPlantArray[j].TourScore;
                        Objscoresentity.FinalCommentbyPant = filteredPlantArray[j].FinalComment;
                        var startTime = moment(filteredPlantArray[j].TourStartDate);//.format('YYYY-MM-DD hh:mm:ss');
                        var CompletionTime = moment(filteredPlantArray[j].TourCompletionDate);//.format('YYYY-MM-DD hh:mm:ss');
                        var totalminutes = CompletionTime.diff(startTime, 'minutes');
                        var totalHours = parseInt(totalminutes / 60);
                        var totalMinutes = parseInt(totalminutes % 60);
                        if (totalHours >= 10) {
                            Objscoresentity.DurationbyPlant = totalHours + ':' + ('0' + totalMinutes).slice(-2);

                        }
                        else {
                            Objscoresentity.DurationbyPlant = ('0' + totalHours).slice(-2) + ':' + ('0' + totalMinutes).slice(-2);

                        }

                        //Objscoresentity.DurationbyPlant=('0'+totalHours).slice(-2)+':'+ ('0'+totalMinutes).slice(-2);


                        //Objscoresentity.DurationbyPlant=('0'+CompletionTime.diff(startTime,'hours')).slice(-2)+':'+ ('0'+CompletionTime.diff(startTime,'minutes')).slice(-2);
                    }
                }
                else {
                    Objscoresentity.TotalObservationbyPant = '';
                    Objscoresentity.TourScorebyPant = '';
                    Objscoresentity.FinalCommentbyPant = '';
                    Objscoresentity.DurationbyPlant = ''

                }
                DepartmentTourArray.push(Objscoresentity);
            }
        }
    }
    BindGridviewofDepartmentScores()

}

function getUniqueDates() {
    var UniqueDatesArray = [];
    $.each(deptTour, function (i, e) {
        var matchingItems = $.grep(UniqueDatesArray, function (item) {
            return moment(item.TourStartDate).format('DD-MMM-YY') === moment(e.TourStartDate).format('DD-MMM-YY');
        });
        if (matchingItems.length === 0) {
            UniqueDatesArray.push(e);
        }
    });
    return UniqueDatesArray;
}


function BindGridviewofDepartmentScores() {
    var tourScoresBdy = '';

    if (DepartmentTourArray[0].value.length > 0) {
        for (var x = 0; x < DepartmentTourArray[0].value.length; x++) {

            tourScoresBdy += '<tr>' +
                '<td>' + moment(DepartmentTourArray[0].value[x].cr3ea_tourstartdate).format('DD-MMM-YY') + '</td>' +
                '<td>' +DepartmentTourArray[0].value[x].cr3ea_totalobservations + '</td>' +
                '<td>' + DepartmentTourArray[0].value[x].cr3ea_tourscore + '</td>' +
                '<td>' + DepartmentTourArray[0].value[x].cr3ea_finalcomment + '</td>' +
                //'<td>' + DepartmentTourArray.value[x].DurationbyHOD + '</td>' +
                //'<td>' + DepartmentTourArray[x].TotalObservationbyPant + '</td>' +
                //'<td>' + DepartmentTourArray[x].TourScorebyPant + '</td>' +
                //'<td>' + DepartmentTourArray[x].FinalCommentbyPant + '</td>' +
                //'<td>' + DepartmentTourArray[x].DurationbyPlant + '</td>' +
                '</tr>';

        }
        $('#divNoRecords').hide();

    }
    var currentId = moment().format('hhmmss');
    var tempTourTableHTML = '<div class="table-wrapper">' +
        '<table class="table tblAdminDashboard" id="tblDetails_' + currentId + '">' +
        '<thead>' +
        '<tr>' +
        //'<th style="width:5%">ID</th>'+
        '<th width="11%">Date</th>' +
        '<th width="11%">Observation by HOD</th>' +
        '<th width="11%">HOD Score</th>' +
        '<th width="11%">HOD Comments</th>' +
        '<th width="11%">HOD TAT(HH:MM)</th>' +
        '<th width="11%">Observation by P.M</th>' +
        '<th width="11%">P.M Score</th>' +
        '<th width="11%">P.M Comments</th>' +
        '<th width="11%">P.M TAT(HH:MM)</th>' +
        ' </tr>' +
        ' </thead> ' +
        '<tbody>' +
        '</tbody >' +
        '</table>' +
        '</div>';


    $('#divtblDepartmentScores').empty().append(tempTourTableHTML);
    if (tourScoresBdy != '' && tourScoresBdy != undefined) {

        $('#tblDetails_' + currentId + ' tbody').empty().append(tourScoresBdy);
        $('#divtblDepartmentScores').show();
        //RequestTablewithsearchwithPageSize('tblDetails_' + currentId, 10);
        var row_count = $('#tblDetails_' + currentId).find('tr').length;
        $('#divtblDepartmentScores table').dataTable({
	    "paging":   true,
        "ordering": false,
        "info":     false,
        "bFilter":false,
		"pageLength": 10,
	});

    }
    else {
        var tempHtml1 = '<tr>' +
            '<td colspan="9">No Records found.</td>' +
            '</tr>';


        $('#tblDetails_' + currentId + ' tbody').empty().append(tempHtml1);
        $('#divtblDepartmentScores').show();
    }
}


function FilterDepratmentTour(tourArr, dateVal, RoleSequence) {
    return arr = $.grep(tourArr, function (n, i) {
        return moment(n.TourStartDate).format('DD-MMM-YY') == moment(dateVal).format('DD-MMM-YY') && n.RoleSequence == RoleSequence;
    });
}


