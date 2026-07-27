var CriticalCategoryId = GetQueryStringParams("Category");
var CriticalCategoryStatus = GetQueryStringParams("status");
var userDepratmentId = 0;
var userRoleSequence = 0;
var userPlantId;
var PlantIdValue1;
var Plantid;
var userRoleName = '';
var ObservationId = '';

$(document).ready(function () {
    $(".form-select").select2();
    ObservationId = GetQueryStringParams('Category');
    getEmployeeDetailsForObservation(EmployeeDetailsForObservationSuccess, EmployeeDetailsForObservationFailure);

});

/*Get Employee Details*/
function EmployeeDetailsForObservationSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantTitle;
        userDepratmentId = collEmployee[0].DepartmentId;
        userRoleSequence = collEmployee[0].RoleSequence;
        userPlantId = collEmployee[0].PlantTitle;
        Plantid = collEmployee[0].PlantId.toString();
        userRoleName = collEmployee[0].RoleName;
        EmployeeName = collEmployee[0].Title;

        if (userDepratmentId == '' && userRoleSequence == '') {
            alert('Employee Name or Role not found !')
        }
        else {
            getDepartmentsForObservations(getDepartmentsForObservationsSuccess, getDepartmentsForObservationsFailure);
            getSeverity(getSaveritySuccess, getSaverityFailure);
        }
    }
    else {
        alert('Employee Name or Role not found !')
    }
}

function EmployeeDetailsForObservationFailure() {


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
    if (userRoleSequence == 30 || userRoleSequence == 35) {
        GetObservationReportData(0, ObservationId, 0, ObservationReportSuccessData, ObservationReportFailure);
    }
    else {
        //GetObservationReportData(0, ObservationId, userDepratmentId, ObservationReportSuccess, ObservationReportFailure);
        ObservationReportSuccessData();
        $('#InnerDepartmentDropDownId').val(userDepratmentId).prop('disabled', true);

    }
}

function getDepartmentsForObservationsFailure() {
}


function getDepartmentsFailure() {

}
function drpDepartmentChangefun() {
    var SelectedSevirityId = "";
    var selectedDepartment = $('#InnerDepartmentDropDownId').val();
    var selectedSeverity = $('#SaverityDropDownId').val();
    if (selectedDepartment != 'All') {
        SelectedDepartmentValue = selectedDepartment;
    }
    else {
        SelectedDepartmentValue = 'All'
    }
    if (selectedSeverity != 'All') {
        SelectedSevirityId = selectedSeverity;
    }
    else {
        SelectedSevirityId = 'All'
    }


    if (SelectedDepartmentValue == 'All' & SelectedSevirityId == 'All') {
        GetObservationReportData(0, ObservationId, 0, ObservationReportSuccessData, ObservationReportFailure);
    }
    else if (SelectedDepartmentValue != 'All' & SelectedSevirityId != 'All') {
        GetObservationReportData(SelectedSevirityId, ObservationId, selectedDepartment, ObservationReportSuccessData, ObservationReportFailure);
    }
    else if (SelectedDepartmentValue != 'All') {
        GetObservationReportData(0, ObservationId, selectedDepartment, ObservationReportSuccessData(selectedDepartment), ObservationReportFailure);
    }
    else if (SelectedSevirityId != 'All') {
        GetObservationReportData(SelectedSevirityId, ObservationId, 0, ObservationReportSuccessData, ObservationReportFailure);
    }

    else {
        GetObservationReportData(SelectedSevirityId, ObservationId, selectedDepartment, ObservationReportSuccessData, ObservationReportFailure);

    }

}

async function ObservationReportSuccessData(departmentId = null) {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_action eq 'Rejected' and cr3ea_status ne 'Closed'" + (departmentId && !Array.isArray(departmentId) ? ` and cr3ea_departmentid eq '${departmentId}'` : "") + (Plantid ? ` and cr3ea_plantid eq '${Plantid}'` : "") + ")&$orderby=modifiedon desc";

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
         ObservationReportData(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
}

function ObservationReportData(collInnerObservationReport) {
    var tempObservationReportHtml = '';
    if (collInnerObservationReport.value.length > 0) {
        for (var i = 0; i < collInnerObservationReport.value.length; i++) {
            PlantIdValue1 = PlantId;
            if ((PlantIdValue1 == userPlantId || userPlantId == "All Plant") && EmployeeName == collInnerObservationReport.value[i].cr3ea_observedperson || userRoleSequence == 35) {
                var observedDate = '';
                if (ObservationId != "") {
                    $('#CategoryTitle').text(collInnerObservationReport.value[i].cr3ea_categoryid)
                    $('#CategoryTitle').show()
                }

                if (collInnerObservationReport.value[i].cr3ea_observeddate != '') {
                    observedDate = moment(collInnerObservationReport.value[i].cr3ea_observeddate).format('DD-MMM-YY');
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
                        '<input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" checked>' +
                        '</div>';
                }
                else {
                    Severity = '<div class="form-check">' +
                        '<input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" >' +
                        '</div>';
                }

                tempObservationReportHtml += '<tr>' +
                    '<td><a href="/sites/PTMS_PRD/Pages/ObservationClosure.aspx?ReqId=' + collInnerObservationReport.value[i].cr3ea_prod_observationsid + '">' + (i+1) + '</a></td>' +
                    '<td>' + collInnerObservationReport.value[i].cr3ea_observation + '</td>' +
                    '<td>' + collInnerObservationReport.value[i].cr3ea_observedperson + '</td>' +
                    '<td>' + observedDate + '</td>' +
                    '<td>' + Categorytitle + '</td>' +
                    //'<td>'+collInnerObservationReport[i].cr3ea_areaid +'</td>'+
                    '<td>' + collInnerObservationReport.value[i].cr3ea_where + '</td>' +
                    '<td>' + collInnerObservationReport.value[i].cr3ea_what + '</td>' +
                    //'<td>'+collInnerObservationReport.value[i].cr3ea_criteria +'</td>'+
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
        '<th style="width:11%">ID</th>' +
        '<th  style="width:20%;">Observation</th>' +
        '<th  style="width:15%;">Observed By</th>' +
        '<th  style="width:10%;">Observed On</th>' +
        '<th  style="width:10%;">Category</th>' +
        '<th style="width:10%;">Where</th>' +
        '<th  style="width:15%;">What</th>' +
        //'<th  style="width:15%;">Criteria</th>'+
        '<th style="width:5%;white-space: nowrap;">Near Miss</th>' +
        ' </tr>' +
        ' </thead> ' +
        '<tbody>' +
        '</tbody >' +
        '</table>'
    '</div>';


    $('#divtblObservation').empty().append(tempObservationTableHTML);

    console.log($("#divtblObservation .buttons-excel"));
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
    //alert('Failure in Observation Report');
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
