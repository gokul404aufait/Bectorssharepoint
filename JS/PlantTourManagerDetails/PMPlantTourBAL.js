var userDepratmentId = 0;
var userRoleSequence = 0;
var userRoleName = '';
var UserRoleId = '';
var RawDepartmentArray = new Array();
var RawAreaArray = new Array();
var RawCategoryArray = new Array();
var RawCriteriasArray = new Array();
var RawSeverityArray = new Array();
var PlantTourId = '';
var ObservationData = new Array();
var criteriaCount = 0;
var FinishTourFinalcriteriaCount = 0;
var DepartmentTourLength = 0;

var ObservationCount = 0;
var ImageDiv = '';
var PlantId = null;
var imageID = '';
var UniqueDepartment = [];
var RawDepartmentsId = [];
var RawDepartments = [];
var RawCategories = [];
var DepartmentNames = [];
var FilterCategory = [];
var UniqueCategory = [];
var FilteredCriteria = [];
var CurrentDay = '';
var today = '';
var CurrentDate = '';
var TodayDate = '';
var RdnCount = 0;
var CriteriaNotApplicable = 0;
var UserRoleId = 0;

$(document).ready(function () {
    PlantTourId = GetQueryStringParams('PTourId');
    PlantStartDate = GetQueryStringParams('StartDate');
    if (PlantTourId != '') {
        ShowLoader();
        getEmployeeDetails(EmployeeDetailSuccess, EmployeeDetailsFailure);
        $('#lblFinishedTour').hide()
        CurrentDate = moment().format('YYYY-MM-DD');

    }
    if (PlantStartDate != '') {
        CurrentDate = moment(PlantStartDate).format('YYYY-MM-DD');
        CurrentDay = moment(PlantStartDate).format('dddd');
    }
    else {
        CurrentDate = moment().format('YYYY-MM-DD');
        CurrentDay = moment().format('dddd');
    }
    TodayDate = moment().format('YYYY-MM-DD');
    $(".comment-section textarea").on('focus', function () {
        $(this).prop("rows", "2");
    });
    $(".comment-section textarea").on('blur', function () {
        $(this).prop("rows", "1");
    });


});


function EmployeeDetailsFailure() { }


function EmployeeDetailSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantId;
        userDepratmentId = collEmployee[0].DepartmentId;
        userRoleSequence = collEmployee[0].RoleSequence;
        UserRoleId = collEmployee[0].RoleId;
        userRoleName = collEmployee[0].RoleName;
        $('#hdnPlantId').val(collEmployee[0].PlantId);
        $('#hdnRoleName').val(collEmployee[0].RoleName);
        $('#hdnDepartmentId').val(collEmployee[0].DepartmentId);
        if (userDepratmentId == '' && userRoleSequence == '') {
            alert('Employee Name or Role not found !')
            HideLoader();
        }
        else {
            var SeletctedManagerFilter = '';
            if (userRoleSequence == 30) {
                SeletctedManagerFilter = "&$filter=PlantManager/Id eq " + _spPageContextInfo.userId
            }
            else {
                SeletctedManagerFilter = "";
            }
            //getDepartments(SeletctedManagerFilter,getDepartmentsSuccess,getDepartmentsFailure)
            GetPTourItemOnId(PlantTourId, GetPTourItemSuccess, getSeverityFailure);
            getSeverity(getSeveritySuccess, getSeverityFailure);
        }
    }
    else {
        alert('Employee Name or Role not found !');
        HideLoader();
    }
}

var IsTourCompleted = false;
function GetPTourItemSuccess(data) {
    ShowLoader();
    if (data.length > 0) {
        if (data[0].Status == 'Completed') {
            IsTourCompleted = true;
            $('#lblPstartedTour').text(moment(data[0].TourStartDate).format('DD-MMM-YYYY'));
            $('#lblstartedTour').append($(" "));
            //var startTime=moment(data[0].TourStartDate).format('DD/MMM/YYYY HH:mm:ss');
            //var CompletionTime=moment(data[0].TourCompletionDate).format('DD/MMM/YYYY HH:mm:ss');
            var TourCompletionDate = moment(data[0].TourCompletionDate).format('DD-MMM-YYYY');

            var startTime = moment(data[0].TourStartDate);//.format('YYYY-MM-DD hh:mm:ss');
            var CompletionTime = moment(data[0].TourCompletionDate);//.format('YYYY-MM-DD hh:mm:ss');
            var totalminutes = CompletionTime.diff(startTime, 'minutes');
            var totalHours = parseInt(totalminutes / 60);
            var totalMinutes = parseInt(totalminutes % 60);
            if (totalHours >= 10) {
                var TimeDuration = totalHours + ':' + ('0' + totalMinutes).slice(-2);

            }
            else {
                var TimeDuration = ('0' + totalHours).slice(-2) + ':' + ('0' + totalMinutes).slice(-2);

            }

            //var TimeDuration=totalHours+':'+ ('0'+totalMinutes).slice(-2);
            //var TimeDuration=('0'+CompletionTime.diff(startTime,'hours')).slice(-2)+':'+ ('0'+CompletionTime.diff(startTime,'minutes')).slice(-2);

            //var TimeDuration=moment.utc(moment(CompletionTime,"DD/MMM/YYYY HH:mm").diff(moment(startTime,"DD/MMM/YYYY HH:mm"))).format("HH:mm")

            $('#FinishedTourDateId').text(TourCompletionDate);
            $('#PTimeDuration').text(TimeDuration);
            $('#hdnDepartmentStatus').val(data[0].Status)
            $('#PtxtFinalComment').val(data[0].FinalComment)
            $('#lblFinishedTour').show()
        }
        else {
            IsTourCompleted = false;
            $('#lblPstartedTour').text(moment(data[0].TourStartDate).format('DD-MMM-YYYY'));
            $('#lblPstartedTour').append($(" "));
            //var startTime=moment(data[0].TourStartDate).format('DD/MMM/YYYY HH:mm:ss');
            var CurrentTimeMonth = moment().format('DD/MMM/YYYY HH:mm:ss');
            /*
            var ms = moment(CurrentTimeMonth,"DD/MMM/YYYY HH:mm:ss").diff(moment(startTime,"DD/MMM/YYYY HH:mm:ss"));
        	
            var d = moment.duration(ms);
            var TotalTime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
            Time= TotalTime.split(':');
            hour = parseInt(Time[0]);
            min = parseInt(Time[1]);
            var TourTime =hour +':' + min;
            $('#PTimeDuration').text(TourTime);
            */

            var startTime = moment(data[0].TourStartDate);
            var CompletionTime = moment();//.format('YYYY-MM-DD hh:mm:ss');
            var totalminutes = CompletionTime.diff(startTime, 'minutes');
            var totalHours = parseInt(totalminutes / 60);
            var totalMinutes = parseInt(totalminutes % 60);
            if (totalHours >= 10) {
                var TimeDuration = totalHours + ':' + ('0' + totalMinutes).slice(-2);

            }
            else {
                var TimeDuration = ('0' + totalHours).slice(-2) + ':' + ('0' + totalMinutes).slice(-2);

            }

            //var TimeDuration=totalHours+':'+ ('0'+totalMinutes).slice(-2);
            $('#PTimeDuration').text(TimeDuration);


            $('#FinishedTour').hide();

        }
    }
    HideLoader();
}
function GetDepartmentTourLengthSuccess(data) {
    var TempDepartmentHtml = '';
    if (data.length > 0) {
        var filteredDetails = GetfilteredDepartmentTour(data, 'Completed')
        if (filteredDetails.length > 0) {
            DepartmentTourLength = filteredDetails.length;
            for (i = 0; i < filteredDetails.length; i++) {
                var TickId = '#Tick_' + filteredDetails[i].DepartmentId;
                $(TickId).show();

                if (IsSubmittedCriteria) {
                    $('#infoToggler' + filteredDetails[i].DepartmentId + ' .navigate-reduce').hide();
                    $('#infoToggler' + filteredDetails[i].DepartmentId + ' .navigate-large').show();
                    var parentSecId = 'heading_' + filteredDetails[i].DepartmentId;
                    var parentSecBodyId = 'collapse_' + filteredDetails[i].DepartmentId;
                    $('#' + parentSecId + ' .accordion-btn.btn-link').addClass('collapsed');
                    $('#' + parentSecId + ' .accordion-btn.btn-link').attr('aria-expanded', false);
                    $('#' + parentSecBodyId).removeClass('in');
                    $('#' + parentSecBodyId).attr('aria-expanded', false);
                    $('#' + parentSecBodyId).css('height', '0px');

                }
            }
        }
        ProcessforHiddenTourId(data)
    }
    HideLoader();
    IsSubmittedCriteria = false;
}

function ProcessforHiddenTourId(data) {
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            $('#HiddenTickId_' + data[i].DepartmentId).text(data[i].Id);
        }
    }
}


function GetfilteredDepartmentTour(TourArr, Status) {
    return arr = $.grep(TourArr, function (d, i) {
        return d.Status == Status;
    });

}


function GetDepartmentTourLengthFailure() {
    HideLoader();
}

function SavePFinalComment() {
    //if($('#txtFinalComment').val()!='')
    // {
    var TourScore = CalTotalScore();
    var objDepartmentTourListEntity = new PTourListEntity
    objDepartmentTourListEntity.FinalComment = $('#PtxtFinalComment').val();
    objDepartmentTourListEntity.TotalCriterias = criteriaCount;
    objDepartmentTourListEntity.TotalObservations = ObservationCount;
    objDepartmentTourListEntity.TourScore = TourScore;
    objDepartmentTourListEntity.TourCompletionDate = moment().format('MM-DD-YYYY HH:mm:ss');

    UpdatePTourItem(PlantTourId, objDepartmentTourListEntity, UpdatePTourItemSuccess, UpdatePTourItemFailure)

}


function UpdatePTourItemSuccess(data) {
    window.location.replace("/sites/PTMS_PRD/Pages/Home.aspx");
}
function UpdatePTourItemFailure() {
    HideLoader()
}

function getCriteriasFailure() { }
function getSeveritySuccess(data) {
    ShowLoader();
    RawSeverityArray = data;
    getCriteriasPM(CurrentDay, userRoleSequence, getCriteriasSuccess, getCriteriasFailure);


}
function getSeverityFailure() {

}



function getCriteriasSuccess(data) {
    var DepartcriteriaCount = '';
    RawCriteriasArray = data;
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            RawDepartmentsId.push(data[i].DepartmentId);
            RawDepartments.push(
                {
                    DepartmentId: data[i].DepartmentId,
                    DepartmentTitle: data[i].DepartmentTitle
                });

        }
        UniqueDepartment = (RawDepartmentsId.filter(onlyUnique));

        var TempDepartmentHtml = '';
        for (i = 0; i < UniqueDepartment.length; i++) {
            DepartcriteriaCount = 0;
            var newDept = tempDepartmentHTML;

            var FilterSubDepartment = GetFilteredSubDepartmentDetails(UniqueDepartment[i]);

            if (FilterSubDepartment.length > 0) {
                var uniqueSubDepartment = getUniqueSubDepartment(FilterSubDepartment);
                if (uniqueSubDepartment.length == 0) {
                    var TempCategoryTempHtml = '';
                    var Srno = 0;
                    var FilterCategory = GetFilteredCategoryDetails(UniqueDepartment[i]);


                    var UniqueCategory = getUniqueCategory(FilterCategory);

                    for (j = 0; j < UniqueCategory.length; j++) {
                        FilteredCriteria = GetFilteredCriteriaDetails(UniqueCategory[j].CategoryId, FilterCategory);
                        Srno++
                        var newCategory = tempCategoryHTML;
                        newCategory = newCategory.replace(/__CriticalCategoryName__/g, UniqueCategory[j].CategoryTitle)
                        newCategory = newCategory.replace(/__CurrentNumber__/g, j)
                        newCategory = newCategory.replace(/__no.__/g, Srno)
                        newCategory = newCategory.replace(/depart_/g, UniqueDepartment[i])
                        newCategory = newCategory.replace(/_count/g, FilteredCriteria.length)
                        var TempCriteriaTempHtml = '';
                        for (k = 0; k < FilteredCriteria.length; k++) {
                            DepartcriteriaCount++;
                            FinishTourFinalcriteriaCount++;
                            var newCriteria = tempCriteriaHtml;
                            CriteriaTitle = FilteredCriteria[k].Criteria;
                            var tempSeverity = '';
                            for (l = 0; l < RawSeverityArray.length; l++) {
                                tempSeverity += '<option value=' + RawSeverityArray[l].Id + '>' + RawSeverityArray[l].Title + '</option>';
                            }
                            newCriteria = newCriteria.replace(/__Severity__/g, tempSeverity)
                            newCriteria = newCriteria.replace(/__CriteriaName__/g, FilteredCriteria[k].Criteria)
                            newCriteria = newCriteria.replace(/__WhatName__/g, FilteredCriteria[k].What)
                            newCriteria = newCriteria.replace(/__CriteriaID__/g, FilteredCriteria[k].Id)
                            TempCriteriaTempHtml += newCriteria
                        }
                        newCategory = newCategory.replace(/__CurrentNumber__/g, j)
                        newCategory = newCategory.replace(/__SubCategory__/g, TempCriteriaTempHtml);
                        newCategory = newCategory.replace(/__CategoryID__/g, UniqueCategory[j].CategoryId);
                        newCategory = newCategory.replace(/__CriteriaTitle__/g, UniqueCategory[j].CategoryTitle);
                        newCategory = newCategory.replace(/PlantDepartmentID__/g, UniqueDepartment[i]);

                        TempCategoryTempHtml += newCategory;
                    }
                    var UniqueDepartmentName = GetFilteredDepartmentNames(UniqueDepartment[i]);
                    newDept = newDept.replace(/__CriticalCategory__/g, TempCategoryTempHtml)
                    newDept = newDept.replace(/__DepartmentName__/g, UniqueDepartmentName[0].DepartmentTitle)
                    newDept = newDept.replace(/__PlantDepartmentID__/g, UniqueDepartment[i]);
                    newDept = newDept.replace(/_depart_/g, UniqueDepartment[i]);
                    newDept = newDept.replace(/_count/g, DepartcriteriaCount);
                    newDept = newDept.replace(/_DepartmentNo__/g, UniqueDepartment[i])
                    TempDepartmentHtml += newDept;

                }
                else {
                    var TempSubDepartmentTempHtml = '';
                    for (var p = 0; p < uniqueSubDepartment.length; p++) {
                        var TempCategoryTempHtml = '';
                        var Srno = 0;
                        //FilterCategory = GetFilteredCategoryDetails(UniqueDepartment[i]);
                        var FilterCategory = GetFilteredCategoryBySubDeptDetails(UniqueDepartment[i], uniqueSubDepartment[p].AreaId);


                        var UniqueCategory = getUniqueCategory(FilterCategory);

                        for (j = 0; j < UniqueCategory.length; j++) {
                            FilteredCriteria = GetFilteredCriteriaDetails(UniqueCategory[j].CategoryId, FilterCategory);
                            Srno++
                            var newCategory = tempCategoryHTML;
                            newCategory = newCategory.replace(/__CriticalCategoryName__/g, UniqueCategory[j].CategoryTitle)
                            newCategory = newCategory.replace(/__CurrentNumber__/g, j + '_' + uniqueSubDepartment[p].AreaId)
                            newCategory = newCategory.replace(/__no.__/g, Srno)
                            newCategory = newCategory.replace(/depart_/g, UniqueDepartment[i])
                            newCategory = newCategory.replace(/_count/g, FilteredCriteria.length)
                            var TempCriteriaTempHtml = '';
                            for (k = 0; k < FilteredCriteria.length; k++) {
                                DepartcriteriaCount++;
                                FinishTourFinalcriteriaCount++;
                                var newCriteria = tempCriteriaHtml;
                                CriteriaTitle = FilteredCriteria[k].Criteria;
                                var tempSeverity = '';
                                for (l = 0; l < RawSeverityArray.length; l++) {
                                    tempSeverity += '<option value=' + RawSeverityArray[l].Id + '>' + RawSeverityArray[l].Title + '</option>';
                                }
                                newCriteria = newCriteria.replace(/__Severity__/g, tempSeverity)
                                newCriteria = newCriteria.replace(/__CriteriaName__/g, FilteredCriteria[k].Criteria)
                                newCriteria = newCriteria.replace(/__WhatName__/g, FilteredCriteria[k].What)
                                newCriteria = newCriteria.replace(/__CriteriaID__/g, FilteredCriteria[k].Id)
                                TempCriteriaTempHtml += newCriteria
                            }
                            newCategory = newCategory.replace(/__CurrentNumber__/g, j)
                            newCategory = newCategory.replace(/__SubCategory__/g, TempCriteriaTempHtml);
                            newCategory = newCategory.replace(/__CategoryID__/g, UniqueCategory[j].CategoryId);
                            newCategory = newCategory.replace(/__CriteriaTitle__/g, UniqueCategory[j].CategoryTitle);
                            newCategory = newCategory.replace(/PlantDepartmentID__/g, UniqueDepartment[i]);

                            TempCategoryTempHtml += newCategory;
                            if (!UniqueCategory[j].CategoryTitle || UniqueCategory[j].CategoryTitle?.length == 0) {
                                TempCategoryTempHtml = TempCriteriaTempHtml;
                            }

                        }

                        //Area data here
                        var SubDeptHTML = tempSubDepartmentHTML;
                        SubDeptHTML = SubDeptHTML.replace(/__CurrentNumber__/g, p)
                        SubDeptHTML = SubDeptHTML.replace(/__SubDept__/g, TempCategoryTempHtml);
                        SubDeptHTML = SubDeptHTML.replace(/__SubDeptName__/g, uniqueSubDepartment[p].AreaTitle.replace('All-PlantManager-', ''));
                        SubDeptHTML = SubDeptHTML.replace(/__AreaId__/g, uniqueSubDepartment[p].AreaId);
                        SubDeptHTML = SubDeptHTML.replace(/__no.__/g, p + 1)
                        SubDeptHTML = SubDeptHTML.replace(/PlantDepartmentID__/g, UniqueDepartment[i]);


                        TempSubDepartmentTempHtml += SubDeptHTML;
                    }
                    var UniqueDepartmentName = GetFilteredDepartmentNames(UniqueDepartment[i]);
                    newDept = newDept.replace(/__CriticalCategory__/g, TempSubDepartmentTempHtml)
                    newDept = newDept.replace(/__DepartmentName__/g, UniqueDepartmentName[0].DepartmentTitle)
                    newDept = newDept.replace(/__PlantDepartmentID__/g, UniqueDepartment[i]);
                    newDept = newDept.replace(/_depart_/g, UniqueDepartment[i]);
                    newDept = newDept.replace(/_count/g, DepartcriteriaCount);
                    newDept = newDept.replace(/_DepartmentNo__/g, UniqueDepartment[i])
                    TempDepartmentHtml += newDept;


                }
            }


            /*

            var UniqueDepartmentName = GetFilteredDepartmentNames(UniqueDepartment[i]);
            newDept = newDept.replace(/__CriticalCategory__/g, TempCategoryTempHtml)
            newDept = newDept.replace(/__DepartmentName__/g, UniqueDepartmentName[0].DepartmentTitle)
            newDept = newDept.replace(/__PlantDepartmentID__/g, UniqueDepartment[i]);
            newDept = newDept.replace(/_depart_/g, UniqueDepartment[i]);
            newDept = newDept.replace(/_count/g, DepartcriteriaCount);
            newDept = newDept.replace(/_DepartmentNo__/g, UniqueDepartment[i])
            TempDepartmentHtml += newDept;
            */

        }
    }
    $('#CriteriaWiseObservationsId').append(TempDepartmentHtml);
    $('.mid .checkbox-image').bootstrapToggle();
    InitCancelClick();

    GetObservationForBind(PlantTourId, GetObservationForBindSuccess, GetObservationForBindFailure)
    HideLoader();

}

function InitCancelClick() {
    $('.toggle.btn-primary').unbind().click(function () {
        $(this).find('input').prop('checked', false);
        ShowObservationTab($(this).find('input'));
        $(this).removeClass('btn-primary').addClass('btn-default').addClass('off');
        $(this).find('.checkbox-image').bootstrapToggle('destroy').bootstrapToggle();
        InitCheckClick();
    });
}
function InitCheckClick() {
    $('.toggle.off').unbind().click(function () {
        $(this).find('input').prop('checked', true);
        ShowObservationTab($(this).find('input'));
        $(this).removeClass('btn-default').removeClass('off').addClass('btn-primary');
        $(this).find('.checkbox-image').bootstrapToggle('destroy').bootstrapToggle();
        InitCancelClick();
    });
}


function GetObservationForBindFailure() { }
function GetObservationForBindSuccess(data) {
    ObservationData = data;

    if (data.length > 0) {


        for (i = 0; i < data.length; i++) {
            //_ObservationID__ClearBtnId

            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationClearId").val(data[i].Id);
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationId_" + data[i].Id + "_ClearBtnId");
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationId").val(data[i].Observation);
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CorrectiveActionId").val(data[i].CorrectiveAction);
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_SeverityID").val(data[i].SeverityId);

            //$("#Dept___"+data[i].DepartmentId+"_Cat_"+data[i].CategoryId+"_Crit_"+data[i].CriteriaId+"_CheckBoxId").prop("checked", false);
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
            if (data[i].Action == 'Approved') {
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ApprovedRdButton").prop("checked", true);
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").show();

            }
            else if (data[i].Action == 'Rejected') {
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_RejectedRdButton").prop("checked", true);
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").show();
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_divNearMissId").show();
                if (data[i].SeveritySequence == 3) {
                    $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_NearMissId").prop("checked", true);
                }

            }

            else {
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_NApplicableRdButton").prop("checked", true);
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").hide();
            }
            //$("#Dept___"+data[i].DepartmentId+"_Cat_"+data[i].CategoryId+"_Crit_"+data[i].CriteriaId+"_CNCFormID").show();
            ImageDiv = "Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_AttachDisId";
            imageID = "Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId;
            $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_BtnId").html('Update');
            if (data[i].Attachment) {
                $("#Dept___" + data[i].DepartmentId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationAttachID").val(data[i].Id);
                GetObservationAttachments(data[i].Id, GetObservationsAttachmentsSuccess, GetObservationAttachmentsFailure);
            }
            InitCheckClick();

        }
    }
    //if($('#hdnDepartmentStatus').val()=='Completed' || CurrentDate!=TodayDate)
    if ($('#hdnDepartmentStatus').val() == 'Completed') {
        $('.Submitbtn').hide();
        $('input[type="file"]').prop("disabled", true);
        $("textarea").prop('disabled', true);
        $('.form-control').prop('disabled', true);
        $('.SubmitBtn').hide();

    }
    UpdateCritCounts();
    //GetDepartmentTourLength(CurrentDate,userRoleSequence ,GetDepartmentTourLengthSuccess,GetDepartmentTourLengthFailure);
    GetDepartmentTourLength(PlantTourId, userRoleSequence, GetDepartmentTourLengthSuccess, GetDepartmentTourLengthFailure)
    HideLoader();
}
function GetObservationsAttachmentsSuccess(data) {
    var AttachID = ImageDiv;

    var Id = imageID;
    if (data.length > 0) {
        var ItemId = data[0].Id;
        $("#" + AttachID).empty();
        var attachmentshtml = '';
        var CETSTeamFileCount = 0;

        for (var i = 0; i < data.length; i++) {
            if ($('#hdnDepartmentStatus').val() == 'Completed') {
                $('#' + AttachID).append('<br/>' + parseInt(i + 1) + '. <a href="' + data[i].Fileurl + '" target="_blank" style="text-decoration:underline;font-weight: bold;">' + data[i].Filename + '</a>');
            }
            else {
                $('#' + AttachID).append('<br/>' + parseInt(i + 1) + '. <a href="' + data[i].Fileurl + '" target="_blank" style="text-decoration:underline;font-weight: bold;">' + data[i].Filename + '</a><a onclick="DeleteObservationFormAttachment(this)" data-ItemId="' + ItemId + '" data-filename="' + data[i].Filename + '" Id="' + Id + '__' + parseInt(i + 1) + '"><img border="0" alt="Delete Attachment" src="/sites/PTMS_PRD/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
            }
        }
    }
    else {
        $("#" + AttachID).empty();
    }

    fileID = '';

    HideLoader();

}

function GetObservationAttachmentsFailure() { }

function GetFilteredDepartmentNames(departmentId) {
    return arr = $.grep(RawDepartments, function (d, i) {
        return d.DepartmentId == departmentId;
        DepartmentNames.push(arr[0].DepartmentTitle);

    });

}

function GetFilteredCategoryDetails(departmentId) {
    return arr = $.grep(RawCriteriasArray, function (d, i) {
        return d.DepartmentId == departmentId;
    });

}

function GetFilteredCategoryBySubDeptDetails(departmentId, SubDeptId) {
    return arr = $.grep(RawCriteriasArray, function (d, i) {
        return d.DepartmentId == departmentId && d.AreaId == SubDeptId;
    });

}


function GetFilteredSubDepartmentDetails(departmentId) {
    return arr = $.grep(RawCriteriasArray, function (d, i) {
        return d.DepartmentId == departmentId;
    });

}


function GetFilteredCriteriaDetails(CategoryId, FilterCategory) {
    return arr = $.grep(FilterCategory, function (d, i) {
        return d.CategoryId == CategoryId;
    });

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getUniqueCategory(FilterCategory) {
    var UniqueCategory = new Array();
    $.each(FilterCategory, function (i, e) {
        var matchingItems = $.grep(UniqueCategory, function (item) {
            return item.CategoryId === e.CategoryId;
        });
        if (matchingItems.length === 0) {
            UniqueCategory.push(e);
        }
    });
    return UniqueCategory;

}





function getUniqueSubDepartment(FilteredSubdepartment) {

    var UniqueSubDepartment = new Array();
    $.each(FilteredSubdepartment, function (i, e) {
        var matchingItems = $.grep(UniqueSubDepartment, function (item) {
            return item.AreaId === e.AreaId;
        });
        if (matchingItems.length === 0) {
            UniqueSubDepartment.push(e);
        }
    });
    return UniqueSubDepartment;
}


//on click checkbox


function ShowObservationTab(data) {

    var formID = $(data).attr("Id");
    console.log(formID.split("_"));
    if (formID.split("_").length > 10) {
        RdBtn = formID.split("_")[12];
    }
    else {
        RdBtn = formID.split("_")[8];
    }
    //RdBtn = formID.split("_")[12];
    var replaceformID = formID;
    var CritId = replaceformID.replace(RdBtn, "");

    formID = formID.replace(RdBtn, "CNCFormID");
    if (RdBtn == "ApprovedRdButton") {

        $("#" + formID).show();
        $("#" + formID + ' .divNearMissId').hide();
        if (RdnCount < 2) {
            CriteriaNotApplicable--;
        }

    }
    else if (RdBtn == "RejectedRdButton") {

        $("#" + formID).show();
        $("#" + formID + ' .divNearMissId').show();

        if (RdnCount < 2) {
            CriteriaNotApplicable--;
        }

    }
    else if (RdBtn == "NApplicableRdButton") {
        $("#" + formID).hide();
        $("#" + formID + ' .divNearMissId').hide();

    }

    var currId = formID.substring(0, formID.lastIndexOf('_'));
    if (!IsTourCompleted) {

        SavePlantTourInput(currId);
    }

}


//save observation....
function SubmitCriteriaNonConfirmity(data) {
    var Isvalidate = true;
    var ID = $(data).attr('Id');
    ID = ID.replace('_BtnId', '');

    var Observation = $("#" + ID + "_ObservationId").val();
    //var Severity = $("#" + ID + "_SeverityID").val();

    if (Observation == "") {
        Isvalidate = false;
        alert("Please Enter Observation Comments")
    }
    /*else if(CorrectiveAction == "")
    {
        alert("PLease Enter CorrectiveAction Comments")
    }
    else if (Severity == "Select")
    {
        Isvalidate = false;
        alert("Please Select Severity")
    }
    */
    else if (Isvalidate) {
        ShowLoader();

        SaveObservationDetails(data)
    }

}

/*Delete observation item*/
var DeleteItemId = '';
function ClearCriteriaNonConfirmity(data) {
    ShowLoader();
    var ID = $(data).attr('Id');
    if (ID == undefined) {
        ID = data;
    }
    ID = ID.replace('_ClearBtnId', '');
    DeleteItemId = ID
    var ItemId = $("#" + ID + "_ObservationClearId").val();

    if (ItemId != '' && ItemId != undefined) {
        DeleteListitem(ItemId, DeleteObservationitemSuccess, DeleteObservationitemFailure);
    }
    else {
        $("#" + DeleteItemId + "_ObservationClearId").val();
        $("#" + DeleteItemId + "_ObservationId").val('');
        $("#" + DeleteItemId + "_CorrectiveActionId").val('');
        $("#" + DeleteItemId + "_SeverityID").val(1);
        $("#" + DeleteItemId + "_AttachDisId").empty();
        $("#" + DeleteItemId + "_ObservationClearId").val('')
        $("#" + DeleteItemId + "_NearMissId").prop("checked", false);
        $("#" + DeleteItemId + "_ApprovedRdButton").prop("checked", false);
        $("#" + DeleteItemId + "_RejectedRdButton").prop("checked", false);

        $("#" + DeleteItemId + "_CNCFormID").hide();
        $("#" + ClearformID + "_CNCFormID .divNearMissId").hide();




        HideLoader();
    }

}
function DeleteObservationitemSuccess() {
    var ItemId = $("#" + DeleteItemId + "_ObservationClearId").val();
    var Observation = $("#" + DeleteItemId + "_ObservationId").val('');
    var CorrectiveAction = $("#" + DeleteItemId + "_CorrectiveActionId").val('');
    var Severity = $("#" + DeleteItemId + "_SeverityID").val(1);
    $("#" + DeleteItemId + "_AttachDisId").empty();
    $("#" + DeleteItemId + "_ObservationClearId").val('');
    $("#" + DeleteItemId + "_ApprovedRdButton").prop("checked", false);
    $("#" + DeleteItemId + "_RejectedRdButton").prop("checked", false);
    $("#" + DeleteItemId + "_NearMissId").prop("checked", false);
    $("#" + DeleteItemId + "_CNCFormID").hide();
    $("#" + DeleteItemId + "_CNCFormID .divNearMissId").hide();

    InitCheckClick();
    GetObservationForBind(PlantTourId, GetObservationForBindSuccess, GetObservationForBindFailure)

}
function DeleteObservationitemFailure() {

}


function SaveObservationDetails(data) {
    // var AttachmentId=$('#hdnObservationId').val();
    var ID = $(data).attr('Id');
    ID = ID.replace('_BtnId', '');
    var CriteriaId = ID.split("_")[7];
    var AreaId = ID.split("_")[1];
    var CriteriaDetails = $.grep(RawCriteriasArray, function (el) {
        return el.Id == CriteriaId;
    });
    var DepartmentId = CriteriaDetails[0]?.DepartmentId;
    var isAreaincluded = $('#accordionExample_' + DepartmentId).find("div[id$='_Area']").length > 0 ? true : false;
    if (isAreaincluded) {
        var DepartmentTitle = CriteriaDetails[0].DepartmentTitle + " - " + CriteriaDetails[0].AreaTitle.replace('All-PlantManager-', '');
    }
    else {
        var DepartmentTitle = CriteriaDetails[0]?.DepartmentTitle;
    }

    var DepartmentDetails = $.grep(UniqueDepartment, function (el) {
        return el.Id == DepartmentId;
    });
    var CategoryId = CriteriaDetails[0]?.CategoryId
    var What = CriteriaDetails[0]?.What;
    var Criteria = CriteriaDetails[0]?.Criteria
    var CriteriaId = CriteriaDetails[0]?.Id
    var Observation = $("#" + ID + "_ObservationId").val();
    //var CorrectiveAction = $("#" + ID + "_CorrectiveActionId").val().trim();
    //var Severity = $("#" + ID + "_SeverityID").val();
    var ObservationId = $("#" + ID + "_ObservationClearId").val();
    var AttachmentId = $('#' + ID + "_ObserId").val();

    var ObservationItemId = '';
    if (ObservationId != null && ObservationId != '') {
        ObservationItemId = ObservationId
    }
    else if (AttachmentId != 0) {
        ObservationItemId = AttachmentId
    }

    if ($('#' + ID + '_ApprovedRdButton').is(':checked') == true) {
        var Severity = FilterSeveritybySequence(1);
        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }
        Action = "Approved";
        Status = "NA";

    }
    else if ($('#' + ID + '_RejectedRdButton').is(':checked') == true) {
        if ($('#' + ID + '_NearMissId').is(':checked') == true) {
            var Severity = FilterSeveritybySequence(3);
        }
        else {
            var Severity = FilterSeveritybySequence(2);
        }

        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }
        Status = "Pending";
        Action = "Rejected";
    }
    else {
        var Severity = FilterSeveritybySequence(1);
        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }
        Status = "NA";
        Action = "Not Applicable";
    }
    var objNonConfirmityDetails = new PObservationsListEntity();
    objNonConfirmityDetails.Observation = Observation;
    //objNonConfirmityDetails.CorrectiveAction = CorrectiveAction;
    objNonConfirmityDetails.Severity = Severity;
    objNonConfirmityDetails.Action = Action;
    objNonConfirmityDetails.What = What;
    objNonConfirmityDetails.Where = DepartmentTitle;
    objNonConfirmityDetails.Criteria = Criteria;
    objNonConfirmityDetails.Status = Status;
    objNonConfirmityDetails.CriteriaId = CriteriaId;
    objNonConfirmityDetails.PlantTourId = PlantTourId;
    //objNonConfirmityDetails.AreaId = AreaId;
    objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
    objNonConfirmityDetails.DepartmentId = DepartmentId;
    objNonConfirmityDetails.CategoryId = CategoryId;
    objNonConfirmityDetails.ObservedByRole = UserRoleId;
    objNonConfirmityDetails.PlantId = PlantId;
    objNonConfirmityDetails.TourDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.ObservedDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.Title = userRoleName + '_' + moment().format('MM-DD-YYYY');
    if (ObservationItemId == '') {
        CreateObservation(objNonConfirmityDetails, ID, CreateObservationSuccess, CreateObservationFailure)
    }
    else if ((ObservationItemId != '')) {
        UpdateObservationForAttachment(ObservationItemId, objNonConfirmityDetails, CreateObservationSuccess, CreateObservationFailure);
    }

}

function SavePlantTourInput(ID) {
    ShowLoader();
    var CriteriaId = ID.split("_")[7];
    var AreaId = ID.split("_")[3];
    var CriteriaDetails = $.grep(RawCriteriasArray, function (el) {
        return el.Id == CriteriaId;
    });
    var DepartmentId = CriteriaDetails[0]?.DepartmentId;
    var isAreaincluded = $('#accordionExample_' + DepartmentId).find("div[id$='_Area']").length > 0 ? true : false;
    if (isAreaincluded) {
        var DepartmentTitle = CriteriaDetails[0].DepartmentTitle + " - " + CriteriaDetails[0].AreaTitle.replace('All-PlantManager-', '');
    }
    else {
        var DepartmentTitle = CriteriaDetails[0]?.DepartmentTitle;
    }

    var DepartmentDetails = $.grep(RawDepartmentArray, function (el) {
        return el.Id == DepartmentId;
    });

    var CategoryId = CriteriaDetails[0]?.CategoryId
    var What = CriteriaDetails[0]?.What;
    var Criteria = CriteriaDetails[0]?.Criteria
    var CriteriaId = CriteriaDetails[0]?.Id

    if ($("#" + ID + "_ObservationClearId").length > 0) {
        var ObservationId = $("#" + ID + "_ObservationClearId").val();
    }
    else {
        var ObservationId = '';
    }

    if ($("#" + ID + "_ObserId").length > 0) {
        var AttachmentId = $("#" + ID + "_ObserId").val();
    }
    else {
        var AttachmentId = '';
    }

    var Action = '';
    var Status = 'Draft';

    var ObservationItemId = '';
    if (ObservationId != null && ObservationId != '') {
        ObservationItemId = ObservationId
    } else if (AttachmentId != 0) {
        ObservationItemId = AttachmentId
    }

    if ($('#' + ID + '_ApprovedRdButton').is(':checked') == true) {
        var Severity = FilterSeveritybySequence(1);
        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }
        Action = "Approved";
        Status = "NA";
    }
    else if ($('#' + ID + '_RejectedRdButton').is(':checked') == true) {
        if ($('#' + ID + '_NearMissId').is(':checked') == true) {
            var Severity = FilterSeveritybySequence(3);
        }
        else {
            var Severity = FilterSeveritybySequence(2);
        }

        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }

        Status = "Draft";
        Action = "Rejected";
    }
    else {
        var Severity = FilterSeveritybySequence(1);
        if (Severity.length > 0) {
            var Severity = Severity[0].Id;
        }
        else {
            var Severity = null;
        }
        Status = "NA";
        Action = "Not Applicable";
    }
    var objNonConfirmityDetails = new PObservationsListEntity();
    objNonConfirmityDetails.Observation = '';
    objNonConfirmityDetails.Severity = Severity;
    objNonConfirmityDetails.What = What;
    objNonConfirmityDetails.Where = DepartmentTitle;
    objNonConfirmityDetails.Criteria = Criteria;
    objNonConfirmityDetails.Status = Status;  // 'Pending';
    objNonConfirmityDetails.CriteriaId = CriteriaId;
    objNonConfirmityDetails.DepartmentTourId = DepartmentTourId;
    // objNonConfirmityDetails.AreaId = AreaId;
    objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
    objNonConfirmityDetails.DepartmentId = DepartmentId;
    objNonConfirmityDetails.CategoryId = CategoryId;
    objNonConfirmityDetails.Action = Action;
    objNonConfirmityDetails.PlantTourId = PlantTourId;
    objNonConfirmityDetails.ObservedByRole = UserRoleId;
    objNonConfirmityDetails.PlantId = PlantId;
    objNonConfirmityDetails.TourDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.ObservedDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.Title = userRoleName + '_' + moment().format('MM-DD-YYYY');


    if (ObservationItemId == '') {
        CreateObservation(objNonConfirmityDetails, ID, CreateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure);
    } else if ((ObservationItemId != '')) {
        UpdateObservationForAttachment(ObservationItemId, objNonConfirmityDetails, UpdateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure);
    }


}

function UpdateSavePlantTourInputSuccess(data, elementID) {
    UpdateCritCounts(elementID);
    HideLoader();
}


function CreateSavePlantTourInputSuccess(data, elementID) {
    $('#' + elementID + '_ObservationClearId').val(data.d.Id);
    UpdateCritCounts(elementID);

    GetObservationForBind(PlantTourId, GetObservationForBindDataSuccess, GetObservationForBindFailure)

    HideLoader();
}
function GetObservationForBindDataSuccess(data) {
    ObservationData = data
}



function CreateSavePlantTourInputFailure() {
    HideLoader();
}

/* Criteria Count*/
function UpdateCritCounts(elementID) {
    var successPercentage = 0.0;
    var totalCriteria = 0;
    var totaltouchedCriteria = 0;
    $('.accordion').each(function () {
        //var currentID=elementID;
        //var AreaId = currentID.split("_")[3];
        //var ParentID='collapse_'+AreaId;
        var currAreaId = $(this).attr('id').replace('accordionExample_', '');
        var AreaId = currAreaId;
        var ParentID = 'collapse_' + AreaId;
        var TotalCriteria = $('#' + ParentID + ' .list-group-item.question').length;
        var ApprovedCriteria = 0;
        var RejectedCriteria = 0;
        var PendingCriteria = 0;
        var NACriteria = 0;
        totalCriteria = parseInt(totalCriteria) + $('#' + ParentID + ' .list-group-item.question').length;
        $('#' + ParentID + ' .list-group-item.question').each(function () {
            var radName = $(this).find('input[type=radio]').attr('name');

            if ($('input[name=' + radName + ']:checked').length == 0) {
                PendingCriteria = parseInt(PendingCriteria) + 1;;
            }
            else {
                //RejectedRdButton
                var radId = $('input[name=' + radName + ']:checked').attr('id');

                var checkVal = radId.substring(radId.lastIndexOf('_') + 1);
                if (checkVal == 'RejectedRdButton') {
                    RejectedCriteria = parseInt(RejectedCriteria) + 1;
                }
                else if (checkVal == 'ApprovedRdButton') {
                    ApprovedCriteria = parseInt(ApprovedCriteria) + 1;
                }
                else {
                    NACriteria = parseInt(NACriteria) + 1;
                    TotalCriteria = parseInt(TotalCriteria) - 1;
                }

            }
        });

        $('#heading_' + AreaId + ' #txtTotalCriteriacnt').text(TotalCriteria);
        $('#heading_' + AreaId + ' #txtTotalRejectedCriteriacnt').text(RejectedCriteria);
        $('#heading_' + AreaId + ' #txtPendingCriteriacnt').text(PendingCriteria);
        $('#heading_' + AreaId + ' #txtTotalApprovedCriteriacnt').text(ApprovedCriteria);

        totaltouchedCriteria = parseInt(totaltouchedCriteria) + parseInt(RejectedCriteria) + parseInt(ApprovedCriteria) + parseInt(NACriteria);

    });
    //debugger;
    //successPercentage=parseFloat((totalCriteria-totaltouchedCriteria)/ totalCriteria).toFixed(2);
    successPercentage = parseFloat(totaltouchedCriteria / totalCriteria).toFixed(2);
    $('#divStatus').circleProgress({
        value: successPercentage,
        size: 40,
        fill: {
            gradient: ["green"]
        }

    }).on('circle-animation-progress', function (event, progress) {
        $(this).find('strong').html(Math.round(100 * successPercentage) + '<i>%</i>');
    });
    if (successPercentage == "1.00") {
        $('#divStatus strong').css("left", " -38px");

    }
}



function UpdateObservationSuccess(data) {
    alert("Observation Updated Successfully");
    GetObservationForBind(PlantTourId, GetObservationForBindSuccess, GetObservationForBindFailure)
}

function UpdateObservationFailure() { }

function CreateObservationSuccess(data) {
    //alert("Observation Added Successfully");
    GetObservationForBind(PlantTourId, GetObservationForBindSuccess, GetObservationForBindFailure)
}

function CreateObservationFailure() {

}

var IsSubmittedCriteria = false;

function SubmitCriteria(data) {

    var objTempData = ValidateDepartmentTour(data);
    if (objTempData.IsValidated) {
        ShowLoader();
        if (objTempData.TotalCriteria > 0) {
            var TourScore = parseFloat(((objTempData.TotalCriteria - objTempData.RejectedCriteria) / objTempData.TotalCriteria) * 100);
            var TotalScore = TourScore.toFixed(2);
        }
        else {
            TotalScore = 0;
        }


        //var ApprovedObservationCount=data.length
        //var TourScore = CalTotalScore();


        var objDepartmentTourListEntity = new DTourListEntity();
        objDepartmentTourListEntity.FinalComment = $('#txtFinalComment').val();
        //criteriaCount = criteriaCount - CriteriaNotApplicable;
        objDepartmentTourListEntity.TotalCriterias = parseInt(objTempData.TotalCriteria) + parseInt(objTempData.NACriteria);
        objDepartmentTourListEntity.TotalObservations = parseInt(objTempData.RejectedCriteria);
        objDepartmentTourListEntity.TotalNACriterias = parseInt(objTempData.NACriteria);
        objDepartmentTourListEntity.TotalCompliances = parseInt(objTempData.ApprovedCriteria);
        objDepartmentTourListEntity.TourScore = TotalScore;// TourScore;
        objDepartmentTourListEntity.TourCompletionDate = moment().format('MM-DD-YYYY HH:mm:ss');

        //UpdateDTourItem(DepartmentTourId, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure)

        UpdateDTourItem(DepartmentTourIdForSubmit, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure)

    }
    else {
        alert(objTempData.ValidationMsg);
    }


}


function ValidateDepartmentTour(obj) {
    var currentDeptId = $(obj).attr('id').split('_')[1];
    var objObservationsListEntity = new ObservationsTypeListEntity();
    var TotalCriteria = $('#accordionExample_' + currentDeptId + ' .list-group-item.question').length;
    var ApprovedCriteria = 0;
    var RejectedCriteria = 0;
    var NACriteria = 0;
    objObservationsListEntity.IsValidated = true;
    $('#accordionExample_' + currentDeptId + ' .list-group-item.question').each(function () {
        var radName = $(this).find('input[type=radio]').attr('name');


        if ($('input[name=' + radName + ']:checked').length == 0) {
            objObservationsListEntity.IsValidated = false;
            objObservationsListEntity.ValidationMsg = 'Please take action on each criteria';
            return objObservationsListEntity;
        }
        else {
            var commentboxId = radName.replace('Action', 'ObservationId');
            var radId = $('input[name=' + radName + ']:checked').attr('id');
            var checkVal = radId.substring(radId.lastIndexOf('_') + 1);
            if (checkVal == 'RejectedRdButton') {

                if (checkVal == 'RejectedRdButton') {
                    var CommentText = $('#' + commentboxId).val().trim();
                }
                else {
                    var CommentText = '';
                }
                RejectedCriteria = parseInt(RejectedCriteria) + 1;
                if (CommentText == '') {

                    objObservationsListEntity.IsValidated = false;
                    objObservationsListEntity.ValidationMsg = 'Please enter comment for all Observations / Near Miss';
                    return objObservationsListEntity;
                }
            }
            else {
                //RejectedRdButton
                var radId = $('input[name=' + radName + ']:checked').attr('id');
                var checkVal = radId.substring(radId.lastIndexOf('_') + 1);
                if (checkVal == 'RejectedRdButton') {
                    RejectedCriteria = parseInt(RejectedCriteria) + 1;
                }
                else if (checkVal == 'ApprovedRdButton') {
                    ApprovedCriteria = parseInt(ApprovedCriteria) + 1;
                }
                else {
                    NACriteria = parseInt(NACriteria) + 1;
                    TotalCriteria = parseInt(TotalCriteria) - 1;
                }

            }

        }

    });

    objObservationsListEntity.ApprovedCriteria = ApprovedCriteria;
    objObservationsListEntity.RejectedCriteria = RejectedCriteria;
    objObservationsListEntity.NACriteria = NACriteria;
    objObservationsListEntity.TotalCriteria = TotalCriteria;


    return objObservationsListEntity;


}



function ValidateFinishTour() {
    var objObservationsListEntity = new ObservationsTypeListEntity();
    var TotalCriteria = $('.list-group-item.question').length;
    var ApprovedCriteria = 0;
    var RejectedCriteria = 0;
    var NACriteria = 0;
    objObservationsListEntity.IsValidated = true;
    $('.list-group-item.question').each(function () {
        var radName = $(this).find('input[type=radio]').attr('name');

        if ($('input[name=' + radName + ']:checked').length == 0) {
            objObservationsListEntity.IsValidated = false;
            return objObservationsListEntity;
        }
        else {
            var commentboxId = radName.replace('Action', 'ObservationId');
            var radId = $('input[name=' + radName + ']:checked').attr('id');
            var checkVal = radId.substring(radId.lastIndexOf('_') + 1);
            if (checkVal == 'RejectedRdButton') {

                if (checkVal == 'RejectedRdButton') {
                    var CommentText = $('#' + commentboxId).val().trim();
                }
                else {
                    var CommentText = '';
                }
                RejectedCriteria = parseInt(RejectedCriteria) + 1;
                if (CommentText == '') {

                    objObservationsListEntity.IsValidated = false;
                    objObservationsListEntity.ValidationMsg = 'Please enter comment for all Observations / Near Miss';
                    return objObservationsListEntity;
                }
            }
            else {
                //RejectedRdButton
                var radId = $('input[name=' + radName + ']:checked').attr('id');
                var checkVal = radId.substring(radId.lastIndexOf('_') + 1);
                if (checkVal == 'RejectedRdButton') {
                    RejectedCriteria = parseInt(RejectedCriteria) + 1;
                }
                else if (checkVal == 'ApprovedRdButton') {
                    ApprovedCriteria = parseInt(ApprovedCriteria) + 1;
                }
                else {
                    NACriteria = parseInt(NACriteria) + 1;
                    TotalCriteria = parseInt(TotalCriteria) - 1;
                }

            }

        }
    });

    objObservationsListEntity.ApprovedCriteria = ApprovedCriteria;
    objObservationsListEntity.RejectedCriteria = RejectedCriteria;
    objObservationsListEntity.NACriteria = NACriteria;
    objObservationsListEntity.TotalCriteria = TotalCriteria;


    return objObservationsListEntity;
}



function filterObservation(departmentId) {
    return arr = $.grep(ObservationData, function (d, i) {
        return d.DepartmentId == departmentId;
    });

}

function CalTotalScore(CriteriaCount, TotalObservation) {
    var criteriaCnt = parseInt(CriteriaCount);
    var ObservationCnt = parseInt(TotalObservation);
    var TourScore = parseFloat(((criteriaCnt - ObservationCnt) / criteriaCnt) * 100);
    var TotalScore = TourScore.toFixed(2)
    return TotalScore;
}

function UpdateDTourItemSuccess(data) {
    IsSubmittedCriteria = true;
    GetDepartmentTourLength(PlantTourId, userRoleSequence, GetDepartmentTourLengthSuccess, GetDepartmentTourLengthFailure)
}

function GetDepartmentTourSuccess(data) {
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var TickId = '#Tick_' + data[i].DepartmentId;
            $(TickId).show();

            $('#infoToggler' + data[i].DepartmentId + ' .navigate-reduce').hide();
            $('#infoToggler' + data[i].DepartmentId + ' .navigate-large').show();
            var parentSecId = 'heading_' + data[i].DepartmentId;
            var parentSecBodyId = 'collapse_' + data[i].DepartmentId;
            $('#' + parentSecId + ' .accordion-btn.btn-link').addClass('collapsed');
            $('#' + parentSecId + ' .accordion-btn.btn-link').attr('aria-expanded', false);
            $('#' + parentSecBodyId).removeClass('in');
            $('#' + parentSecBodyId).attr('aria-expanded', false);
            $('#' + parentSecBodyId).css('height', '0px');
        }
    }
    HideLoader();
}

function GetDepartmentTourFailure() {
    HideLoader();

}


function UpdateDTourItemFailure() { }
var DivClassName = '';
var DepartmentTourId = '';
var DepartmentTourIdForSubmit = '';

function resetSections(obj) {
    var currentsecId = $(obj).closest('.accordion').attr('id');
    $('.accordion').each(function () {
        if ($(this).attr('id') != currentsecId) {
            $(this).find('.navigate-reduce').hide();
            $(this).find('.navigate-large').show();
            $(this).find('.accordion-btn.btn-link').addClass('collapsed');
            $(this).find('.accordion-btn.btn-link').attr('aria-expanded', false);
            $(this).find('.collapse.in').css('height', '0px');
            $(this).find('.collapse.in').removeClass('in');
        }
    });

}

function ChangeImage(data) {
    resetSections(data);
    DepartmentTourId = data.dataset.target;
    DepartmentTourId = DepartmentTourId.split("_")[1];
    $('#infoToggler' + DepartmentTourId).find('.toggle-img').toggle();
    $('.accordion-btn btn-link').find('.accordion-btn btn-link').toggle();


    if ($('#hdnDepartmentStatus').val() != 'Completed') {
        DivClassName = data.className;
        if (DivClassName == 'accordion-btn btn-link collapsed') {
            //if(DepartmentTourId!='' && CurrentDate==TodayDate)
            if (DepartmentTourId != '') {
                var TourId = $('#HiddenTickId_' + DepartmentTourId).text();
                if (TourId == '') {
                    ShowLoader();
                    //SaveDepartmentTItem();
                    GetDepartmentTourDetails(PlantTourId, DepartmentTourId, userRoleSequence, GetDepartmentTourDetailsSuccess, GetDepartmentTourDetailsFailure)
                }
                else {
                    DepartmentTourIdForSubmit = TourId;
                }
            }

        }
    }

}


function CollapseSection(obj) {

}



function GetDepartmentTourDetailsSuccess(data) {
    if (data.length == 0) {
        SaveDepartmentTItem();

    }
    else {
        DepartmentTourIdForSubmit = data[0].Id
    }
    HideLoader();
}

function GetDepartmentTourDetailsFailure() {

}


function SaveDepartmentTItem() {
    var objDepartmentTourListEntity = new DTourListEntity();
    objDepartmentTourListEntity.DepartmentId = DepartmentTourId;
    objDepartmentTourListEntity.TourStartDate = moment().format('MM-DD-YYYY HH:mm:ss');
    objDepartmentTourListEntity.TourBy = _spPageContextInfo.userId;
    objDepartmentTourListEntity.Status = 'In Progress';
    objDepartmentTourListEntity.PlantId = PlantId;
    objDepartmentTourListEntity.RoleId = UserRoleId
    objDepartmentTourListEntity.PlantTour = PlantTourId;
    objDepartmentTourListEntity.Title = userRoleName + '_' + moment().format('MM-DD-YYYY');
    SaveDTourItem(objDepartmentTourListEntity, SaveDepartmentTourSuccess, SaveDepartmentTourItemFailure)

}

function SaveDepartmentTourSuccess(data) {
    DepartmentTourIdForSubmit = data.d.Id;
}

function SaveDepartmentTourItemFailure() { }

// Finish Tour //

function SaveFinalComment() {

    var TotalDepartments = UniqueDepartment.length;
    var DepartmentTLength = DepartmentTourLength;

    if (TotalDepartments == DepartmentTLength) {
        var objTempData = ValidateFinishTour();
        if (objTempData.IsValidated) {
            ShowLoader();
            if (objTempData.TotalCriteria > 0) {
                var TourScore = parseFloat(((objTempData.TotalCriteria - objTempData.RejectedCriteria) / objTempData.TotalCriteria) * 100);
                var TotalScore = TourScore.toFixed(2);
            }
            else {
                var TotalScore = 0;
            }
            /*
                var FinalcriteriaCount =FinishTourFinalcriteriaCount; 
                var TotalObservationCount=ObservationData.length;
                var TourScore=CalTotalScore(FinalcriteriaCount ,TotalObservationCount);
                if (TourScore=='-Infinity')
                {
                    TourScore=100;
                }
            */
            var TourCompletionDate = moment().format('MM/DD/YYYY HH:mm:ss');
            var ObjPlanTourListEntity = new PlanTourListEntity();
            ObjPlanTourListEntity.FinalComment = $('#PtxtFinalComment').val();
            ObjPlanTourListEntity.TourCompletionDate = TourCompletionDate
            ObjPlanTourListEntity.TotalCriterias = parseInt(objTempData.TotalCriteria) + parseInt(objTempData.NACriteria); //FinalcriteriaCount;
            ObjPlanTourListEntity.TotalObservations = objTempData.RejectedCriteria; //TotalObservationCount;
            ObjPlanTourListEntity.TotalNACriterias = objTempData.NACriteria;
            ObjPlanTourListEntity.TotalCompliances = objTempData.ApprovedCriteria;
            ObjPlanTourListEntity.TourScore = TotalScore;//TourScore;
            UpdatePTourItem(PlantTourId, ObjPlanTourListEntity, UpdatePTourItemSuccess, UpdatePTourItemFailure);


        }
        else {
            alert(objTempData.ValidationMsg);
        }

    }
    else {
        alert("Kindly submit score for remaining departments ");
    }

}

function UpdatePTourItemSuccess(data, TotalScore) {
    /*
    HideLoader()
    alert("Plant Tour Finished");
    window.location.replace("/sites/PTMS_PRD/Pages/Home.aspx");
    */


    HideLoader();
    ShowCongrats(TotalScore);
    setTimeout(function () {
        window.location.replace("/sites/PTMS_PRD/Pages/Home.aspx");
    }, 5000);


}

function ShowCongrats(TotalScore) {
    document.getElementById("divCongrats").style.display = "block";
    $('#divCongrats .word1').empty().append('Congratulations for completing the tour');
    $('#divCongrats .word2').empty().append('You have scored ' + TotalScore + '%');
    //$('#divCongrats').css({'position':'absolute','bottom': '20%','left': '10%','font-size': '18px'});
    $('#divCongrats').css({ 'bottom': '20%', 'font-size': '16px' });



    anime.timeline({ loop: true })
        .add({
            targets: '.ml15 .word',
            scale: [14, 1],
            opacity: [0, 1],
            easing: "easeOutCirc",
            duration: 1000,
            delay: 800//(el, i) => 800 * i
        }).add({
            targets: '.ml15',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });


}



function PlantNotApplicable(data) {
    RdnCount = 0;
    if (!IsTourCompleted) {

        ShowObservationTab(data);
    }


}

function PlantApproved(data) {
    RdnCount++
    if (!IsTourCompleted) {

        ShowObservationTab(data);
    }
}

function PlantRejected(data) {
    RdnCount++
    if (!IsTourCompleted) {

        ShowObservationTab(data);
    }
}



var offImg = "<img src='/sites/PTMS_PRD/BectorsSourceCode/Images/close.png'/>"
var onImg = "<img src='/sites/PTMS_PRD/BectorsSourceCode/Images/checked.png'/>"

var tempDepartmentHTML = '<div class="accordion" id="accordionExample___PlantDepartmentID__">' +
    '<div class="card header-card">' +
    '<div class="card-header accordion-header" id="heading___PlantDepartmentID__">' +
    '<h2 class="mb-0 align-self-center minimum-height">' +
    '<div class="accordion-btn btn-link collapsed" onclick="ChangeImage(this)" type="button" data-toggle="collapse" data-target="#collapse___PlantDepartmentID__" aria-expanded="false" aria-controls="collapse___PlantDepartmentID__" >' +
    '<div class="media accordion-media">' +
    '<div class="media-body align-self-center width-ninty" align="left">' +
    '<h5 class="mt-0 flt-left" >__DepartmentName__</h5>' +
    '<p id="HiddenTickId__DepartmentNo__" style="display:none"></p>' +
    '<div class="progress-section" align="right" style="margin-top: 0px;">' +
    '<div>' +
    '<p id="txtTotalCriteriacnt"  title="Total number of criterias"  style="display: none;">0</p>' +
    '<p id="txtTotalApprovedCriteriacnt"  title="Total number of approved criteria"  style="display: inline-block;background-color:Green;color:#fff !important;">0</p>' +
    '<p id="txtTotalRejectedCriteriacnt"  title="Total number of observations / Near Miss"  style="display: inline-block;background-color:Red;color:#fff !important;">0</p>' +
    '<p id="txtPendingCriteriacnt" title="Total number of criteria for pending action"  style="display: inline-block;background-color:yellow;margin-right: 10px;">0</p>' +
    '</div>' +
    //'<div class="progress">'+

    //'<div class="progress-bar progressing" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" ></div>'+
    //'</div>'+
    '</div>' +

    /* '<div class="progress-section" align="right"><div class="progress">'+
         '<div class="progress-bar progressing" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" ></div>'+
     '</div></div>' +*/
    '</div>' +
    '<div id="infoToggler__PlantDepartmentID__" class="infoToggler">' +
    '<img  id="Tick__DepartmentNo__" src="/sites/PTMS_PRD/BectorsSourceCode/Images/check.png" class="tick-department" >' +

    '<img class="align-self-center navigate-large toggle-img"src="/sites/PTMS_PRD/BectorsSourceCode/Images/plus-sign.png" >' +
    '<img class="align-self-center navigate-reduce toggle-img" src="/sites/PTMS_PRD/BectorsSourceCode/Images/minus-sign.png"  style="display:none;"></div>' +
    '</div>' + '</div>' +
    '</h2>' +
    '</div>' +
    '<div id="collapse___PlantDepartmentID__" class="collapse" aria-labelledby="heading___PlantDepartmentID__" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;" aria-expanded="true">' +
    '<div class="card-body">' +
    '<div class="accordion" id="accordionExample___PlantDepartmentID__">__CriticalCategory__</div>' +
    '<div class="btn-section">' +

    '<button type="button" class="btn SubmitBtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CatSubmitID__depart__CriteriaCount__count" onclick="SubmitCriteria(this)">Submit</button>' +
    '</div>' +
    '<p id="depart__CriteriaCount__count" style="display:none"></p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

var tempSubDepartmentHTML = '<div class="card body-card">' +
    '<div class="card-header accordion-header" id="headingtwoerexSubDept">' +
    '<h2 class="mb-0 align-self-center minimum-height">' +
    '<div class="accordion-btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsetwoerexSubDept__CurrentNumber___PlantDepartmentID___AreaId___Area" aria-expanded="false" aria-controls="collapsetwoerexSubDept">' +
    '<div class="media accordion-media">' +
    '<div class="align-self-center mr-3"><span class="task-number">__no.__</span>' +
    '</div>' +
    '<div class="media-body align-self-center flex-media-none" align="left">' +
    '<h5 class="mt-0" >__SubDeptName__</h5>' +
    '</div>' +
    '<div class="full-width">' +
    //'<button type="button" class="btn  align-self-center check-visually-btn" >Check visually</button>' +
    '<img src="/sites/PTMS_PRD/BectorsSourceCode/Images/navigate.png" class="align-self-center navigate-arrow justify-content-end right-btn" >' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</h2>' +
    '</div>' +
    //'<p id="depart__CriteriaCount__count" style="display:none"></p>'+
    '<div id="collapsetwoerexSubDept__CurrentNumber___PlantDepartmentID___AreaId___Area" class="collapse" aria-labelledby="headingtwoerexSubDept" data-parent="#accordionExample___PlantDepartmentID___AreaId___Area" style="height: 0px;">' +
    '<div class="card-body accordion-body-section">' +
    '<div  >__SubDept__</div>' +

    '</div>' +
    '</div>' +

    '</div>';



var tempCategoryHTML = '<div class="card body-card">' +
    '<div class="card-header accordion-header" id="headingtwoerex">' +
    '<h2 class="mb-0 align-self-center minimum-height">' +
    '<div class="accordion-btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsetwoerex__CurrentNumber___PlantDepartmentID__" aria-expanded="false" aria-controls="collapsetwoerex">' +
    '<div class="media accordion-media">' +
    '<div class="align-self-center mr-3"><span class="task-number">__no.__</span>' +
    '</div>' +
    '<div class="media-body align-self-center flex-media-none" align="left">' +
    '<h5 class="mt-0" >__CriticalCategoryName__</h5>' +
    '</div>' +
    '<div class="full-width">' +
    //'<button type="button" class="btn  align-self-center check-visually-btn" >Check visually</button>' +
    '<img src="/sites/PTMS_PRD/BectorsSourceCode/Images/navigate.png" class="align-self-center navigate-arrow justify-content-end right-btn" >' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</h2>' +
    '</div>' +
    //'<p id="depart__CriteriaCount__count" style="display:none"></p>'+
    '<div id="collapsetwoerex__CurrentNumber___PlantDepartmentID__" class="collapse" aria-labelledby="headingtwoerex" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;">' +
    '<div class="card-body accordion-body-section">' +
    '<ul class="list-group list-group-flush">__SubCategory__</ul>' +

    '</div>' +
    '</div>' +

    '</div>';

var tempCriteriaHtml = '<li class="list-group-item question"><label><p><b>__WhatName__ <br/></b></p>__CriteriaName__</label>' +
    //'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+

    //'<div><label class="radio-option radio-inline">Not Applicable<input type="radio" checked="checked" name="radio"> <span class="checkmark"></span></label>'+
    //'<label class="radio-option radio-inline">Approved<input type="radio" name="radio" ><span class="checkmark"></span></label>'+
    //'<label class="radio-option radio-inline">Rejected<input type="radio" name="radio"><span class="checkmark"></span></label></div>'+


    //'<div class="mid" align="right">' +
    //	' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="' + onImg + '" data-off="' + offImg + '" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick="ShowObservationTab(this)">' +
    //'</div>' +
    '<div><label class="radio-option radio-inline">Not Applicable<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NApplicableRdButton"  name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="PlantNotApplicable(this)" value="NotApplicable"> <span class="checkmark"></span></label>' +
    '<label class="radio-option radio-inline">Approved<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ApprovedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="PlantApproved(this)" value="Approved"><span class="checkmark" ></span></label>' +
    '<label class="radio-option radio-inline">Rejected<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___RejectedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="PlantRejected(this)" value="Rejected"><span class="checkmark"></span></label></div>' +
    '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>' +

    '<div class="conform-section" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CNCFormID" style="display:none;">' +
    //'<br>' +
    '<hr />' +
    //'<h5 class="mt-0 inner-heading" >Criteria Non Conformity</h5>'+
    '<div class="row mgn-nill">' +
    '<div class="col-md-3 pdg-nill">' +
    '<div class="heading-tbl">Comment</div>' +
    '<div class="data-section"><textarea id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationId" rows="2" required>' + '</textarea>' + '</div>' +
    '</div>' +

    '<div class="col-md-2 pdg-nill divNearMissId" style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___divNearMissId">' +
    '<div class="heading-tbl">Is Near Miss?</div>' +
    '<div class="data-section"><input type="checkbox"  id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NearMissId"> Near Miss</div>' +
    '</div>' +

    '<div class="col-md-3 pdg-nill">' +
    '<div class="heading-tbl">Attachments</div>' +
    '<div>' +
    '<div class="attachment">' +
    '<div class="attachment-img"><img src="/sites/PTMS_PRD/BectorsSourceCode/Images/plus.png"><label>choose the file</label></div>' +
    '<input type="file" class="form-control-file" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachID" onchange="ObservationAttachmentClickFunction(this)">' +
    '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationAttachID" style="display:none"></p>' +
    //'<input type="file" class="form-control-file" id="exampleFormControlFile1">'+
    '<input style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObserId" value="0">' +

    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachDisId" class="attached-files";></div>' +
    '<div class="btn-section">' +
    //'<button type="button" class="btn ">cancel</button>'+
    '<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___BtnId" onclick="SubmitCriteriaNonConfirmity(this)">Save</button>' +
    '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>' +
    '<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ClearBtnId" onclick="ClearCriteriaNonConfirmity(this)">Clear</button>' +
    '</div>' +
    '</div>' +
    '</li>'



function FilterSeveritybySequence(Sequence) {
    return arr = $.grep(RawSeverityArray, function (d, i) {
        return d.Sequence == Sequence;
    });

}
