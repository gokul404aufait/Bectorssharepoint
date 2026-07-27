var CriticalCategoryId = GetQueryStringParams("Category");
var CriticalCategoryStatus = GetQueryStringParams("status");
var userDepratmentId = 0;
var userRoleSequence = 0;
var userPlantId;
var PlantIdValue1;
var userRoleName = '';

$(document).ready(function () {
    ShowLoader();
    $(".form-select").select2();
    getEmployeeDetailsForObservation(EmployeeDetailsForObservationSuccess, EmployeeDetailsForObservationFailure);
});


/*Get Employee Details*/
function EmployeeDetailsForObservationSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantTitle;
        userDepratmentId = collEmployee[0].DepartmentId;
        userRoleSequence = collEmployee[0].RoleSequence;
        userPlantId = collEmployee[0].PlantTitle;
        userRoleName = collEmployee[0].RoleName;
        if (userRoleSequence == 30 || userRoleSequence == 20 || userRoleSequence == 10 || userRoleSequence == 15) {

            getDepartmentsForObservations(getDepartmentsForObservationsSuccess, getDepartmentsForObservationsFailure);
        }
        else {
            var homeURL = "/sites/PTMS_PRD/Pages/Home.aspx";
            window.location.href = homeURL;

            alert("You are not authorized to access to this Page!")

        }


    }
    else {
        HideLoader();
        alert('Employee Name or Role not found !')
    }


}

function EmployeeDetailsForObservationFailure() {
    HideLoader();

}
/*Get Employee Details*/

function getDepartmentsForObservationsSuccess(collDepart) {
    if (collDepart.length > 0) {
        var DepartDropDown = "<option value='All'>All Department</option>";

        for (var i = 0; i < collDepart.length; i++) {
            if (collDepart[i].Title == userPlantId) {
                DepartDropDown += "<option value=" + collDepart[i].Id + ">" + collDepart[i].Title1 + "</option>"
            }
            else if (userPlantId == "All Plant") {
                DepartDropDown += "<option value=" + collDepart[i].Id + ">" + collDepart[i].Title1 + "</option>"
            }
        }
        $("#InnerDepartmentDropDownId").empty().append(DepartDropDown);

    }

    if (userRoleSequence == 30) {
        GetObservationReportData(0, 0, "", "", ObservationReportSuccess, ObservationReportFailure);
        getSeverity(getSaveritySuccess, getSaverityFailure);
    }
    else {
        //GetObservationReportData(0, userDepratmentId, "", "", ObservationReportSuccess, ObservationReportFailure);
        ObservationAllReportSuccessData();
        $('#InnerDepartmentDropDownId').val(userDepratmentId).prop('disabled', true);
        getSeverity(getSaveritySuccess, getSaverityFailure);

    }



}

function getDepartmentsForObservationsFailure() {
    HideLoader();
}

function ResetAllSelection() {
    ShowLoader();
    $('#InnerDepartmentDropDownId').val('All');
    $('#SaverityDropDownId').val('All');
    $('#ActiondrpId').val('All');
    $('#StatusdrpId').val('All');
    if (userRoleSequence == 30) {
        GetObservationReportData(0, 0, "", "", ObservationReportSuccess, ObservationReportFailure);
    }
    else {
        GetObservationReportData(0, userDepratmentId, "", "", ObservationReportSuccess, ObservationReportFailure);
        $('#InnerDepartmentDropDownId').val(userDepratmentId).prop('disabled', true);

    }


}


function getDepartmentsFailure() {
    HideLoader();
}
function drpDepartmentChangefun() {
    ShowLoader();
    var SelectedSevirityId = 0;
    var selectedStatusValue = "";
    var selectedActionValue = "";
    var selectedDepartment = $('#InnerDepartmentDropDownId').val();
    var selectedSeverity = $('#SaverityDropDownId').val();
    var selectedStatus = $('#StatusdrpId').val();
    var selectedAction = $('#ActiondrpId').val();
    var SelectedDepartmentValue = 0;
    if (selectedDepartment != 'All') {
        SelectedDepartmentValue = selectedDepartment;
    }
    if (selectedSeverity != 'All') {
        SelectedSevirityId = selectedSeverity;
    }
    if (selectedStatus != 'All') {
        selectedStatusValue = selectedStatus;
    }
    if (selectedAction != 'All') {
        selectedActionValue = selectedAction;
    }

    GetObservationReportData(SelectedSevirityId, SelectedDepartmentValue, selectedStatusValue, selectedActionValue, ObservationReportSuccess, ObservationReportFailure);



}

async function ObservationAllReportSuccessData() {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_action eq 'Rejected' or cr3ea_action eq 'Approved') &$orderby=modifiedon desc";
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
         ObservationAllReportData(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
}

function ObservationAllReportData(collInnerObservationReport) {
    var tempObservationReportHtml = '';
    if (collInnerObservationReport.value.length > 0) {
        for (var i = 0; i < collInnerObservationReport.value.length; i++) {
            PlantIdValue1 = PlantId;
            if ((PlantIdValue1 == userPlantId || userPlantId == "All Plant") && userDepratmentId == collInnerObservationReport.value[i].cr3ea_departmentid) {
                var observedDate = '';
                if (collInnerObservationReport.value[i].cr3ea_observeddate != '') {
                    observedDate = moment(collInnerObservationReport.value[i].cr3ea_observeddate).format('DD-MMM-YY');
                }
                var ClosedDate = '';
                if (collInnerObservationReport.value[i].cr3ea_closeddate != '') {
                    ClosedDate = moment(collInnerObservationReport.value[i].cr3ea_closeddate).format('DD-MMM-YY');
                }

                var ObservationsVal = '';

                if (collInnerObservationReport.value[i].cr3ea_observation == null) {
                    ObservationsVal = '';
                }
                else{
                    ObservationsVal = collInnerObservationReport.value[i].cr3ea_observation;
                }

                var Categorytitle = '';

                if (collInnerObservationReport.value[i].cr3ea_categoryid == null) {
                    Categorytitle = '';
                }
                else{
                    Categorytitle = collInnerObservationReport.value[i].cr3ea_categorytitle;
                }
                var Severity = '';

                if (collInnerObservationReport.value[i].cr3ea_severityid == '3') {
                    Severity = '<div class="form-check">' +
                        '<input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" checked>' + '</div>';
                }
                else {
                    Severity = '<div class="form-check">' +
                        '<input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" >' +
                        '</div>';
                }
                tempObservationReportHtml += '<tr>' +
                    '<td><a href="/sites/PTMS_PRD/Pages/ObservationClosure.aspx?ReqId=' + collInnerObservationReport.value[i].cr3ea_prod_observationsid + '">' + (i+1) + '</a></td>' +
                    '<td>' + ObservationsVal + '</td>' +
                    '<td>' + collInnerObservationReport.value[i].cr3ea_observedperson + '</td>' +
                    '<td>' + observedDate + '</td>' +
                    '<td>' + Categorytitle + '</td>' +
                    //'<td>'+collInnerObservationReport.value[i].cr3ea_criteria +'</td>'+
                    '<td>' + collInnerObservationReport.value[i].cr3ea_where + '</td>' +
                    '<td>' + collInnerObservationReport.value[i].cr3ea_what + '</td>' +
                    '<td>' + Severity + '</td>' +
                    '</tr>';
            }
        }
    }
    var currentId = moment().format('hhmmss');
    var tempObservationTableHTML = '<div class="table-wrapper">' +
        '<table class="table tblAdminDashboard" id="tblDetails_' + currentId + '">' +
        '<thead>' +
        '<tr>' +
        '<th style="width:5%">ID</th>' +
        '<th >Observation</th>' +
        '<th >Observed By</th>' +
        '<th >Observed On</th>' +
        '<th >Category</th>' +
        '<th >Where</th>' +
        '<th >What</th>' +
        '<th style="width:5%;white-space: nowrap;">Near Miss</th>' +


        ' </tr>' +
        ' </thead> ' +
        '<tbody>' +
        '</tbody >' +
        '</table>' +
        '</div>';


    $('#divtblObservationsReport').empty().append(tempObservationTableHTML);
    if (tempObservationReportHtml != '' && tempObservationReportHtml != undefined) {

        $('#tblDetails_' + currentId + ' tbody').empty().append(tempObservationReportHtml);
        $('#divtblObservation').show();
        RequestTablewithsearchwithPageSize('tblDetails_' + currentId, 10);
        var row_count = $('#tblDetails_' + currentId).find('tr').length;
    }
    else {
        var tempHtml1 = '<tr>' +
            '<td colspan="9">No Records found.</td>' +
            '</tr>';


        $('#tblDetails_' + currentId + ' tbody').empty().append(tempHtml1);
        $('#divtblObservation').show();
    }

    HideLoader();

}

function ObservationReportFailure() {
    HideLoader();//alert('Failure in Observation Report');
}


function getSaveritySuccess(collSeverity) {
    if (collSeverity.length > 0) {
        var SaverityDropDown = "<option value='All'>All Severity</option>";

        for (var i = 0; i < collSeverity.length; i++) {

            SaverityDropDown += "<option value=" + collSeverity[i].Id + ">" + collSeverity[i].Title + "</option>"


        }
        $("#SaverityDropDownId").empty().append(SaverityDropDown);

    }

}

function getSaverityFailure() { }
