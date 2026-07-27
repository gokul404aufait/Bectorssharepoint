var userDepratmentTitle = 0;
$(document).ready(function () {


    getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);

});

function EmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        userDepratmentId = collEmployee[0].DepartmentId;
        userDepratmentTitle = collEmployee[0].DepartmentIdTitle;
        userRoleSequence = collEmployee[0].RoleSequence;
        var plant = collEmployee[0].PlantIdTitle;

        if (userRoleSequence == 30) {
            GetPlantScoresDetails(userRoleSequence, plant, GetPlantScoresDetailsSuccess, DepartmentTourfailure);
        }
        else if (userRoleSequence == 20) {
            //GetDepartmentTour(userRoleSequence, plant, DepartmentTourSuccess, DepartmentTourfailure);
            MyTourSuccessData();
        }
        else {
            var homeURL = "/sites/PTMS_PRD/Pages/Home.aspx";
            window.location.href = homeURL;

            alert("You are not authorized to access to this Page!")
        }

    }
    else {
        alert('Sorry! Employee Name/Role not found');
    }

}

function EmployeeDetailsFailure(err) {
}

async function MyTourSuccessData() {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_departmenttours";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_status eq 'In Progress' or cr3ea_status eq 'Completed') &$orderby=modifiedon desc";
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
         DepartmentTourData(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
}

function DepartmentTourData(collDepartmentTour) {
    var DepartmentTourBdy = '';
    if (collDepartmentTour.value.length > 0) {
        for (var i = 0; i < collDepartmentTour.value.length; i++) {
            if (userDepratmentId == collDepartmentTour.value[i].cr3ea_departmentid){
            var tourStartDate = '';

            var TourCompletionsDate = '';
            var StartsDate = '';

            if (collDepartmentTour.value[i].cr3ea_tourstartdate != '') {
                tourStartDate = moment(collDepartmentTour.value[i].cr3ea_tourstartdate).format('DD-MMM-YY');
                StartsDate = moment(collDepartmentTour.value[i].cr3ea_tourstartdate).format('DD-MMM-YY');
            }
            else { }
            if (collDepartmentTour.value[i].cr3ea_tourcompletiondate == '') {

            }
            else {
                TourCompletionsDate = moment(collDepartmentTour.value[i].cr3ea_tourcompletiondate).format('DD-MMM-YY');
            }



            DepartmentTourBdy += '<tr>' +
                '<td>' + tourStartDate + '</td>' +
                '<td>' + userDepratmentTitle + '</td>' +
                '<td>' + collDepartmentTour.value[i].cr3ea_totalcriterias + '</td>' +
                '<td>' + collDepartmentTour.value[i].cr3ea_totalobservations + '</td>' +
                '<td>' + collDepartmentTour.value[i].cr3ea_tourscore + '</td>' +
                '<td><a href="' + WebAbsoluteUrl + '/Pages/DepartmentTour.aspx?TourId=' + collDepartmentTour.value[i].cr3ea_prod_departmenttourid + '&StartDate=' + StartsDate + '">' + collDepartmentTour.value[i].cr3ea_status + '</a></td>' +
                //'<td>'+collDepartmentTour.value[i].cr3ea_status+'</td>'+
                '<td>' + TourCompletionsDate + '</td>' +
                '</tr>';
            }
        }
        $('#divNoRecords').hide();

    }
    var currentId = moment().format('hhmmss');
    var DepartmentTourHTML = '<div class="table-wrapper">' +
        '<table class="table tblAdminDashboard" id="tblDetails_' + currentId + '">' +
        '<thead>' +
        '<tr>' +

        '<th width="11%">Started Date</th>' +
        '<th width="11%">Department Name</th>' +
        '<th width="11%">No. of criterias</th>' +
        '<th width="11%">No. of observations</th>' +
        '<th width="11%">Score</th>' +
        '<th width="11%">Status</th>' +
        '<th width="11%">Completed Date</th>' +

        ' </tr>' +
        ' </thead> ' +
        '<tbody>' +
        '</tbody >' +
        '</table>' +
        '</div>';

    $('#divtblDepartmentScores').empty().append(DepartmentTourHTML);
    if (DepartmentTourBdy != '' && DepartmentTourBdy != undefined) {

        $('#tblDetails_' + currentId + ' tbody').empty().append(DepartmentTourBdy);
        $('#divtblDepartmentScores').show();
        RequestTablewithsearch('tblDetails_' + currentId);
        var row_count = $('#tblDetails_' + currentId).find('tr').length;
    }
    else {
        var tempHtml1 = '<tr>' +
            '<td colspan="9">No Records found.</td>' +
            '</tr>';


        $('#tblDetails_' + currentId + ' tbody').empty().append(tempHtml1);
        $('#divtblDepartmentScores').show();
    }


}

function DepartmentTourfailure() {
    alert("failure");
}

function InitializeTable(tableId) {
    $('#' + tableId).DataTable({
        //bFilter: false,
        //bInfo: false,
        //bSortable: true,
        searching: true,
        "autoWidth": false,

        "lengthMenu": [5, 15, 20, 25],

        dom: 'Bfrtip',

        buttons: [
            //'copyHtml5',

            {

            }]


    });
}

function GetPlantScoresDetailsSuccess(data) {
    var PlantTourBdy = '';
    var TourStartsDate = '';
    var TourCompletionsDate = '';
    var StartDate = '';
    if (data.length >= 0) {
        for (var i = 0; i < data.length; i++) {

            if (data[i].TourStartDate != '') {
                TourStartsDate = moment(data[i].TourStartDate).format('DD-MMM-YY');
                StartDate = moment(data[i].TourStartDate).format('DD-MMM-YY');
            }
            else { }
            if (data[i].TourCompletionDate != '') {
                TourCompletionsDate = moment(data[i].TourCompletionDate).format('DD-MMM-YY');
            }
            else { }


            PlantTourBdy += '<tr>' +
                '<td>' + TourStartsDate + '</td>' +
                '<td>' + data[i].TotalCriterias + '</td>' +
                '<td>' + data[i].TotalObservations + '</td>' +
                '<td>' + data[i].TourScore + '</td>' +
                '<td><a href="' + WebAbsoluteUrl + '/Pages/PlantTour.aspx?PTourId=' + data[i].ID + '&StartDate=' + StartDate + '">' + data[i].Status + '</a></td>' +
                //'<td>'+data[i].Status+'</td>'+
                '<td>' + TourCompletionsDate + '</td>' +
                '</tr>';

        }
        $('#divNoRecords').hide();

    }
    var currentId = moment().format('hhmmss');
    var PlantTourHTML = '<div class="table-wrapper">' +
        '<table class="table tblAdminDashboard" id="tblDetails_' + currentId + '">' +
        '<thead>' +
        '<tr>' +
        '<th width="11%">Started Date</th>' +
        '<th width="11%">No. of Criterias</th>' +
        '<th width="11%">No. of Observations</th>' +
        '<th width="11%">Score</th>' +
        '<th width="11%">Status</th>' +
        '<th width="11%">Completed Date</th>' +

        ' </tr>' +
        ' </thead> ' +
        '<tbody>' +
        '</tbody >' +
        '</table>' +
        '</div>';

    $('#divtblDepartmentScores').empty().append(PlantTourHTML);
    if (PlantTourBdy != '' && PlantTourBdy != undefined) {

        $('#tblDetails_' + currentId + ' tbody').empty().append(PlantTourBdy);
        $('#divtblDepartmentScores').show();
        RequestTablewithsearch('tblDetails_' + currentId);
        var row_count = $('#tblDetails_' + currentId).find('tr').length;
    }
    else {
        var tempHtml1 = '<tr>' +
            '<td colspan="9">No Records found.</td>' +
            '</tr>';


        $('#tblDetails_' + currentId + ' tbody').empty().append(tempHtml1);
        RequestTablewithsearch('tblDetails_' + currentId);
        $('#divtblDepartmentScores').show();

    }

}
