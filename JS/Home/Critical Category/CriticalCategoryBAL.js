
var rawCriticalCategories = new Array();
$(document).ready(function () {
    rawCriticalCategories.length = 0;
    //GetCategory(GetCategorySuccess,GetCategoryFailure);
});

function GetCategorySuccess(collCategory) {
    var categoryHTML = '';
    var CriticalCategoryIds = '';
    if (collCategory.length > 0) {
        rawCriticalCategories = collCategory;
        bgColor = ['safety', 'ss', 'quality', 'performance'];
        for (var i = 0; i < collCategory.length; i++) {
            categoryHTML += '<div class="item">' +
                '<div class="grid-section align-grid">' +
                '<a id="CatURl_' + collCategory[i].Id + '" class="d-flex align-items-center gap-3">' +
                '<div class="count-icon">' +
                '<div class="count"></div>' +
                '<div class="icon ' + bgColor[i] + '">' +
                '<img src="' + collCategory[i].ImageURL.Description + '" />' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<h6 class="bec-fs-sm">' + collCategory[i].Title + '</h6>' +
                '<p id="Cat_' + collCategory[i].Id + '" class="bec-fs-xxl"></p>' +
                '</div>' +
                '</a>' +
                '</div>' +
                '</div>';
            if (CriticalCategoryIds.trim() != '') {
                CriticalCategoryIds = CriticalCategoryIds + ' or CategoryId/Id eq ' + collCategory[i].Id;
            }
            else {
                CriticalCategoryIds = 'CategoryId/Id eq ' + collCategory[i].Id;
            }

        }

        $('#CriticalCategoryId').empty().append(categoryHTML);
        //$('#HODDashboardId').empty().append(categoryHTML);

        updateOwlCarousel('#CriticalCategoryId');
    }
    var finalCriticalCategoryIDFilter = '(' + CriticalCategoryIds + ')';

    if (SelectedDepartmentValue != 'All') {
        GetCriticalCategoryObservationsCount(SelectedDepartmentValue, finalCriticalCategoryIDFilter, GetCriticalCategoryObservationsCountSuccess, GetCriticalCategoryObservationsCountFailure);
    }
    else {
        GetCriticalCategoryObservationsCount(0, finalCriticalCategoryIDFilter, GetCriticalCategoryObservationsCountSuccess, GetCriticalCategoryObservationsCountFailure);
    }
}

function GetCategoryFailure() {

}
function GetCriticalCategoryObservationsCountSuccess(data) {
    if (data.length > 0) {
        if (rawCriticalCategories.length > 0) {
            for (var i = 0; i < rawCriticalCategories.length; i++) {
                var FilteredObservations = FilterObservationforCriticalCategory(data, rawCriticalCategories[i].Id);
                if (FilteredObservations.length > 0) {

                    $('#Cat_' + rawCriticalCategories[i].Id).text(FilteredObservations.length);
                    CateogryCountUrl = WebAbsoluteUrl + '/Pages/OpenObservations.aspx?Category=' + rawCriticalCategories[i].Id
                    //CateogryCountUrl=WebAbsoluteUrl+'/Pages/OpenObservations.aspx?Category'=+rawCriticalCategories[i].Id'&dept'=+rawCriticalCategories[i].DepartmentId
                    $('#CatURl_' + rawCriticalCategories[i].Id).attr("href", CateogryCountUrl);
                }
                else {
                    $('#Cat_' + rawCriticalCategories[i].Id).text(0);
                }
            }
        }

    }
    else {
        if (rawCriticalCategories.length > 0) {
            for (var i = 0; i < rawCriticalCategories.length; i++) {
                $('#Cat_' + rawCriticalCategories[i].Id).text(0);

            }
        }

    }
}

function GetCriticalCategoryObservationsCountFailure() {

}

function FilterObservationforCriticalCategory(observationArray, CriticalCategory) {
    return arr = $.grep(observationArray, function (a) {
        return a.CategoryId == CriticalCategory;
    });
}