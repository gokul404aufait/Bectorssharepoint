var CriticalCategoryId = GetQueryStringParams("Category");
var CriticalCategoryStatus = GetQueryStringParams("status");
var userDepratmentId = 0;
var userRoleSequence = 0;
var userRoleName = '';
var ObservationId = '';

$(document).ready(function () {
    GetEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);
});

/*Get Employee Details*/
function EmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantId;
        userDepratmentId = collEmployee[0].DepartmentId;
        userRoleSequence = collEmployee[0].RoleSequence;
        userRoleName = collEmployee[0].RoleName;

        if (userDepratmentId == '' && userRoleSequence == '') {
            alert('Employee Name or Role not found !')
        }
        else if (userRoleSequence == 30) {
            GetPlantScoresDetails(GetPlantScoresDetailsSuccess, GetPlantScoresDetailsFailure);

        }
        else if (userRoleSequence == 20) {
            //alert('The details are not available for HOD !')
            alert('You are not authorized to access this page!');
            var homeURL = "/sites/PTMS_PRD/Pages/Home.aspx";
            window.location.href = homeURL;

        }
        else {
            alert('You are not authorized to access this page!');
            var homeURL = "/sites/PTMS_PRD/Pages/Home.aspx";
            window.location.href = homeURL;

        }

    }
    else {
        alert('Employee Name or Role not found !')
    }


}

function EmployeeDetailsFailure() {


}
/*Get Employee Details*/


/*Get Plant Scores start*/

function GetPlantScoresDetailsSuccess(data) {
    var temTableHTML = '';
    var tempPlantScoreHtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            /*
         var TourStartDate='';
         if(data[i].TourStartDate!='')
         {
        TourStartDate= moment(data[i].TourStartDate).format('DD-MMM-YY')
         }
        // var startTime=moment(data[i].TourStartDate).format('DD-MMM-YY HH:mm:ss');
       //  var CompletionTime=moment(data[i].TourCompletionDate).format('DD-MMM-YY HH:mm:ss');
         
         var startTime=moment(data[i].TourStartDate);//.format('YYYY-MM-DD hh:mm:ss');
        var CompletionTime=moment(data[i].TourCompletionDate);//.format('YYYY-MM-DD hh:mm:ss');
        var totalminutes=CompletionTime.diff(startTime,'minutes');
        var totalHours=parseInt(totalminutes/60);
        var totalMinutes=parseInt(totalminutes%60);
        if(totalHours>=10)
        {
            var TimeDuration=totalHours+':'+ ('0'+totalMinutes).slice(-2);

        }
        else
        {
            var TimeDuration=('0'+totalHours).slice(-2)+':'+ ('0'+totalMinutes).slice(-2);

        }
    	
        */

            var TourStartDate = '';
            var TimeDuration = '';
            // alert(data[i].TourStartDate);
            if (data[i].TourStartDate != '') {

                TourStartDate = moment(data[i].TourStartDate).format('DD-MMM-YY')
                var startTime = moment(data[i].TourStartDate);//.format('YYYY-MM-DD hh:mm:ss');
                if (data[i].TourCompletionDate != '') {
                    var CompletionTime = moment(data[i].TourCompletionDate);//.format('YYYY-MM-DD hh:mm:ss');
                    var totalminutes = CompletionTime.diff(startTime, 'minutes');
                    var totalHours = parseInt(totalminutes / 60);
                    var totalMinutes = parseInt(totalminutes % 60);
                    if (totalHours >= 10) {
                        var TimeDuration = totalHours + ':' + ('0' + totalMinutes).slice(-2);

                    }
                    else {
                        var TimeDuration = ('0' + totalHours).slice(-2) + ':' + ('0' + totalMinutes).slice(-2);

                    }
                }

            }

            //var TimeDuration=totalHours+':'+ ('0'+totalMinutes).slice(-2);

            var Duration = TimeDuration;//  moment.utc(moment(CompletionTime,"DD-MMM-YY HH:mm").diff(moment(startTime,"DD-MMM-YY HH:mm"))).format("HH:mm")
            tempPlantScoreHtml += '<tr>' +
                '<td>' + TourStartDate + '</td>' +
                '<td>' + data[i].TotalObservations + '</td>' +
                '<td>' + data[i].TourScore + '</td>' +
                '<td>' + data[i].FinalComment + '</td>' +
                '<td>' + Duration + '</td>' +

                '</tr>';
        }
    }
    var currentId = moment().format('hhmmss');
    var tblHTML = '<div class="table-wrapper">' +
        '<table class="table tblAdminDashboard" id="tblPlantScores_' + currentId + '">' +
        '<thead>' +
        '<tr>' +
        '<th width="150">Date</th>' +
        '<th width="150">Observation by P.M</th>' +
        '<th width="150">P.M Score (%)</th>' +
        '<th width="150">P.M Comments</th>' +
        '<th width="150">P.M TAT(minutes)</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>' +
        '</div>';

    $('#divtblPlantScores').empty().append(tblHTML);
    if (tempPlantScoreHtml != '' && tempPlantScoreHtml != undefined) {

        $('#tblPlantScores_' + currentId + ' tbody').empty().append(tempPlantScoreHtml);
        $('#divtblPlantScores').show();
        RequestTablewithsearch('tblPlantScores_' + currentId);
        var row_count = $('#tblPlantScores_' + currentId).find('tr').length;
    }
    else {
        var tempHtml1 = '<tr>' +
            '<td colspan="5">No Records found.</td>' +
            '</tr>';


        $('#tblPlantScores_' + currentId + ' tbody').empty().append(tempHtml1);
        $('#divtblPlantScores').show();
    }



}
function GetPlantScoresDetailsFailure() {

}

