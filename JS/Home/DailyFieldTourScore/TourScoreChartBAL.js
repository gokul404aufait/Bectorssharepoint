//var CurrentDate =moment().date(0)

var CurrentDate = moment();
var CurrentYear = CurrentDate.format('YYYY');
var userDepratmentId = 0;
var currYear = CurrentDate.format('YY');
var CurrentMonth = CurrentDate.format('M');
var currMonth = CurrentDate.format('MMM');
var CurrentDay = CurrentDate.format('DD');

var today = '';
if (CurrentDay == "31") {
    today = CurrentDate.format('YYYY-M-D');
}
else {
    today = CurrentDate.add(1, 'days').format('YYYY-M-D');
}
var startDate = CurrentDate.startOf('month').format('YYYY-M-D');

var deptTour = [];
var plantTour = [];
var chart1Arr = [];
var rawDepartments = new Array();
var rawGraphArr = new Array();

$(document).ready(function () {
    $(".form-select").select2();
    $('.form-select.select-secondary').next('.select2-container--default').addClass('secondary');
    google.load("visualization", "1", {
        packages: ["corechart", "bar"]
    });
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
        if ($('select#DepartmentDropDownId').val() != 'All') {
            searchMonthGraph();
        }
        else {
            ProcessChartData();
        }
    });

    $('#hdnGivenDate').val('');
    $('#hdnGivenMonth').val('');
    $('#hdnGivenYear').val('');

    $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + userDepratmentId + '" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');

    $('select#DepartmentDropDownId').change(function () {
        if (($('select#DepartmentDropDownId').val()).length > 0 && $('select#DepartmentDropDownId').val() != 'All') {
            departmentID = $('select#DepartmentDropDownId').val();
            $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + departmentID + '" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
            GetDepartmentTourData(departmentID);
            GetPlantTourData(departmentID);
        } else {
            $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
        }
    });
});

function GetDisabledDept() {
    if ($("select#DepartmentDropDownId option:selected").val() != '' && $("select#DepartmentDropDownId option:selected").val() != 'All') {
        departmentID = $("select#DepartmentDropDownId option:selected").val();
        $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + dId + '" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
        GetDepartmentTourData(departmentID);
        GetPlantTourData(departmentID);
    } else {
        $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
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
        GetDepartmentTour(today, startDate, departmentId, DepartmentTourSuccess, DepartmentTourFailed);
    } else {
        GetDepartmentTour(today, startDate, '', DepartmentTourSuccess, DepartmentTourFailed);
    }
}

function BindDropdownCalender() {
    //  debugger; 
    GetMonthMasterData(GetMonthMasterDataSuccess, GetMonthMasterDataFailure);
}
var MonthArray = [];
function GetMonthMasterDataSuccess(data) {
    MonthArray = [];
    var MonthDropDown = '';
    if (data.length > 0) {
        MonthArray = data;
        for (var i = 0; i < CurrentMonth; i++) {
            MonthDropDown += "<option value=" + data[i].MonthNumber + ">" + data[i].Title + "</option>"

        }
        $("#drpTourScoreMonth").empty().append(MonthDropDown);
        $("#drpTourScoreMonth option[value='" + CurrentMonth + "']").prop('selected', true);
    }
    GetYearMasterData(GetYearMasterDataSuccess, GetYearMasterDataFailure);

}
function GetMonthMasterDataFailure() {

}

function GetYearMasterDataSuccess(data) {
    var yeardropdownhtml = '';
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            yeardropdownhtml += "<option value=" + data[i].Title + ">" + data[i].Title + "</option>"

        }
        $("#drpTourScoreYear").empty().append(yeardropdownhtml);
        $("#drpTourScoreYear option[value='" + CurrentYear + "']").prop('selected', true);
    }
    bindDropdownofDate();
}
function GetYearMasterDataFailure() {

}

function bindDropdownofDate() {
    var currentDay = (new Date).getDate();
    var currentMonth = (new Date).getMonth() + 1;
    var month = $('#drpTourScoreMonth').val();
    var year = $('#drpTourScoreYear').val();
    var todayDt = daysInMonth(month, year)
    var datenumber = 0;
    var DateDropDown = '';
    //var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $("#drpTourScoreDate").empty();
    DateDropDown = "<option value='Date'>  Day  </option>";
    if (year == CurrentYear && month == CurrentMonth) {
        for (var i = 0; i < currentDay; i++) {

            datenumber++

            DateDropDown += "<option value=" + datenumber + ">" + datenumber + "</option>"
        }
    } else {
        for (var i = 0; i < todayDt; i++) {

            datenumber++

            DateDropDown += "<option value=" + datenumber + ">" + datenumber + "</option>"

        }
    }
    $("#drpTourScoreDate").append(DateDropDown);
}



function bindDropdownOnChange() {


    var monthnumber = 0;
    var MonthDropDown = '';
    var data = MonthArray;
    if ($("#drpTourScoreYear").val() == CurrentYear) {
        for (var i = 0; i < CurrentMonth; i++) {
            MonthDropDown += "<option value=" + data[i].MonthNumber + ">" + data[i].Title + "</option>"
        }
    }
    else {
        for (var i = 0; i < data.length; i++) {

            MonthDropDown += "<option value=" + data[i].MonthNumber + ">" + data[i].Title + "</option>"
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
        GetPlantTour(today, startDate, departmentId, PlantTourSuccess, PlantTourFailed);
    } else {

        GetPlantTour(today, startDate, '', PlantTourSuccess, PlantTourFailed);
    }
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
function FilterDay(tourArr, dateVal) {
    return arr = $.grep(tourArr, function (n, i) {
        return moment(n.TourStartDate).format('D-MMM-YYYY') == dateVal;
    });
}

function ProcessMonthChartData() {
    rawGraphArr.length = 0;
    var selectedDate = $("#drpTourScoreDate").val();
    var currentDay = (new Date).getDate();
    var dateArr = new Array();
    //var currMonth = moment().format('MMM');
    //var currYear = moment().format('YY');
    var MonthName = $('#hdnGivenMonthName').val();
    MonthName = MonthName.substring(0, 3);

    var year = $("#drpTourScoreYear").val();
    year = year.substring(4, 2);
    if (($('#hdnGivenMonth').val() == '' && $('#hdnGivenYear').val() == '' && selectedDate == 'Date') || (MonthName == currMonth && year == currYear)) {
        if (selectedDate != 'Date') {

            var newdate = (selectedDate) + '-' + currMonth + '-' + currYear;
            dateArr.push(newdate);
        } else {

            var d = new Date();
            var todayDt = d.getDate();
            //var todayDt = todayDate.getDate();

            for (var x = 1; x <= todayDt; x++) {
                //var newdate = ('0' + x).slice(-2) + '-' + currMonth + '-' + currYear ;
                var newdate = (x) + '-' + currMonth + '-' + currYear;

                dateArr.push(newdate);
            }

        }

    }
    else {
        $('#hdnGivenMonthName').val($('#drpTourScoreMonth option:selected').text());
        var Month = $("#drpTourScoreMonth").val();
        var MonthName = $('#hdnGivenMonthName').val();
        MonthName = MonthName.substring(0, 3);
        var selectedDate = $("#drpTourScoreDate").val();


        if (selectedDate == 'Date') {
            var todayDt = daysInMonth(Month, year)
            for (var x = 1; x <= todayDt; x++) {

                var newdate = (x) + '-' + MonthName + '-' + year;
                dateArr.push(newdate);
            }
        }
        else {
            var newdate = (selectedDate) + '-' + MonthName + '-' + year;

        }

        var newdate = (selectedDate) + '-' + MonthName + '-' + year;
        dateArr.push(newdate);

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

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function ProcessChartData() {

    var selectedDate = $("#drpTourScoreDate option:selected").val();
    //var currMonth = moment().format('MMM');
    var MonthName = $("#drpTourScoreMonth option:selected").text()
    MonthName = MonthName.substring(0, 3);
    var year = $("#drpTourScoreYear option:selected").val();
    var newdate = (selectedDate) + '-' + MonthName + '-' + year;
    rawGraphArr.length = 0;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Octr", "Nov", "Dec"];
    if (rawDepartments.length > 0) {
        for (var i = 0; i < rawDepartments.length; i++) {
            var DepartmentId = rawDepartments[i].Id;
            var currentPlantScore = 0;
            var tempPlantTours = FilterScores(plantTour, DepartmentId, 30);
            if (selectedDate != "Date") {
                tempPlantTours = FilterDay(tempPlantTours, newdate);
            }
            if (tempPlantTours.length > 0) {
                for (var j = 0; j < tempPlantTours.length; j++) {
                    currentPlantScore = parseInt(currentPlantScore) + parseInt(tempPlantTours[j].TourScore);
                }
                currentPlantScore = currentPlantScore / tempPlantTours.length;
            }
            var PlantTourScore = currentPlantScore;
            var currentDepartmentScore = 0;
            var tempDepartmentTours = FilterScores(deptTour, DepartmentId, 20);
            if (selectedDate != "Date") {
                tempDepartmentTours = FilterDay(tempDepartmentTours, newdate);
            }

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
    var scoreCountVar = 0;
    var tempFinalArr = new Array();
    if (rawGraphArr.length > 0) {
        for (var i = 0; i < rawGraphArr.length; i++) {
            var tempArr = new Array();
            if (rawGraphArr[i].DepartmentScore == 0 && rawGraphArr[i].PlantScore == 0) {
                scoreCountVar++
            }
            tempArr.push(rawGraphArr[i].Department);
            tempArr.push(rawGraphArr[i].DepartmentScore);
            tempArr.push((rawGraphArr[i].DepartmentScore > 0) ? (rawGraphArr[i].DepartmentScore).toString() : null);
            tempArr.push(rawGraphArr[i].PlantScore);
            tempArr.push((rawGraphArr[i].PlantScore > 0) ? (rawGraphArr[i].PlantScore).toString() : null);
            tempFinalArr.push(tempArr);
        }
    }
    if (scoreCountVar == rawGraphArr.length) {

        $('#tourChart').html('<div class="d-block">No record(s) found.</div>').css({
            'background': '#fff',
            'padding': '25px',
            'min-height': '75px',
            'height': 'auto'
        });
        $('#viewTsLnk').hide();
    }
    else {
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
        var drpMonth = $("#drpTourScoreMonth option:selected").text()
        var drpYear = $("#drpTourScoreYear option:selected").text()

        var modTitle = drpMonth + " " + drpYear;

        var options = {
            displayAnnotations: true,
            seriesType: 'bars',
            title: 'Average Tour Score :' + modTitle,
            legend: {
                position: 'start',
                alignment: 'center'
            },
            height: 500,
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
}

function drawMonthChart() {

    var condition = true;
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
        if (rawGraphArr.length == 1) {
            if (rawGraphArr[0].DepartmentScore != 0 || rawGraphArr[0].PlantScore != 0) {
                var tempArr = new Array();

                tempArr.push(rawGraphArr[0].TourStartDate);
                tempArr.push(rawGraphArr[0].DepartmentScore);
                tempArr.push((rawGraphArr[0].DepartmentScore > 0) ? (rawGraphArr[0].DepartmentScore).toString() : null);
                tempArr.push(rawGraphArr[0].PlantScore);
                tempArr.push((rawGraphArr[0].PlantScore > 0) ? (rawGraphArr[0].PlantScore).toString() : null);


                tempFinalArr.push(tempArr);

            }
            else {
                tempFinalArr = [];
            }



        }
        else {
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




    }
    if (tempFinalArr.length > 0) {
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
        var drpMonth = $("#drpTourScoreMonth option:selected").text()
        var drpYear = $("#drpTourScoreYear option:selected").text()

        var modTitle = drpMonth + " " + drpYear;
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
    else {
        $('#tourChart').html('<div class="d-block">No record(s) found.</div>').css({
            'background': '#fff',
            'padding': '25px',
            'min-height': '75px',
            'height': 'auto'
        });
        $('#viewTsLnk').hide();


    }

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
        $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=hod&dept=' + departmentID + '" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
        GetDepartmentTourData(departmentID);
        GetPlantTourData(departmentID);
    } else {
        $('div.viewTs').empty().append('<a href="/sites/Mrs_Bectors_PTMS/Pages/DepartmentScores.aspx?role=pm" id="viewTsLnk" class="btn btn-link">View All<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/right-red-arrow.svg"></a>');
        GetDepartmentTourData(departmentID);
        GetPlantTourData(departmentID);

    }


}

function clearDate() {

    BindDropdownCalender();
    searchMonthGraph();


}
