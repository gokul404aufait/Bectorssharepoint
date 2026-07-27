var userPlantId;

$(document).ready(function () {

    //GetObservationReportData(ObservationReportSuccess,ObservationReportFailure);

    getEmployeeDetailsForObservation(EmployeeDetailsForObservationSuccess);

});

function EmployeeDetailsForObservationSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        userPlantId = collEmployee[0].PlantTitle;
    }
}




function InitializeTable(tableId) {
    $('#' + tableId).DataTable({
        searching: true,
        "autoWidth": false,
        "lengthMenu": [5, 15, 20, 25],

        dom: 'Bfrtip',
        buttons: [
            //'copyHtml5',

            {
                // extend: 'excelHtml5',
                //text:'Export to Excel',
                title: 'Appraisal Division Report',
                className: 'ExportButton'
            }]


    });
}
