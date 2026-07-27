var userDepratmentId = 0;
var userRoleSequence = 0;
var userRoleName = '';
var RawDepartmentArray = new Array();
var RawAreaArray = new Array();
var RawCategoryArray = new Array();
var RawCriteriaArray = new Array();
var RawSeverityArray = new Array();
var DepartmentTourId = '';
var ObservationData = new Array();
var criteriaCount = 0;
var ObservationCount = 0;
var ImageDiv = '';
var PlantId = null;
var imageID = '';

$(document).ready(function() {
    DepartmentTourId = GetQueryStringParams('TourId');
    getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);
    //ShowHideIcon();				
    $('#lblFinishedTour').hide()
    $(".comment-section textarea").on('focus', function() {
        $(this).prop("rows", "2");
    });
    $(".comment-section textarea").on('blur', function() {
        $(this).prop("rows", "1");
    });


})

function ShowHideIcon() {}

function EmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantId;
        userDepratmentId = collEmployee[0].DepartmentId;
        userRoleSequence = collEmployee[0].RoleSequence;
        userRoleName = collEmployee[0].RoleName;
        $('#hdnPlantId').val(collEmployee[0].PlantId);
        $('#hdnRoleName').val(collEmployee[0].RoleName);
        $('#hdnDepartmentId').val(collEmployee[0].DepartmentId);
        if (userDepratmentId == '' && userRoleSequence == '') {
            alert('Employee Name or Role not found !')
        } else {
            var SeletctedManagerFilter = '';
            if (userRoleSequence == 20) {
                SeletctedManagerFilter = "&$filter=Id eq " + userDepratmentId
            } else if (userRoleSequence == 30) {
                SeletctedManagerFilter = "&$filter=PlantManager/Id eq " + _spPageContextInfo.userId
            } else {
                SeletctedManagerFilter = "";
            }
            //getDepartments(SeletctedManagerFilter,getDepartmentsSuccess,getDepartmentsFailure)
            GetDTourItem(DepartmentTourId, userRoleSequence, GetDTourItemSuccess, GetDTourItemFailure)
            getCriterias(userRoleSequence, userDepratmentId, getCriteriasSuccess, getCriteriasFailure)
        }
    } else {
        alert('Employee Name or Role not found !');
    }
}


var IsTourCompleted=false;
function GetDTourItemSuccess(data) {
    if (data.length > 0) {
        if (data[0].Status == 'Completed') {
        	IsTourCompleted=true;
            $('#lblstartedTour').text(moment(data[0].TourStartDate).format('DD-MMM-YY'));
            $('#lblstartedTour').append($(" "));
            var startTime = moment(data[0].TourStartDate).format('DD/MMM/YY HH:mm:ss');
            var CompletionTime = moment(data[0].TourCompletionDate).format('DD/MMM/YY HH:mm:ss');
            var TourCompletionDate = moment(data[0].TourCompletionDate).format('DD-MMM-YY');
            var TimeDuration = moment.utc(moment(CompletionTime, "DD/MMM/YY HH:mm").diff(moment(startTime, "DD/MMM/YY HH:mm"))).format("HH:mm")
            $('#TimeDuration').text(TimeDuration);
            $('#hdnDepartmentStatus').val(data[0].Status)
            $('#txtFinalComment').val(data[0].FinalComment)
            $('#FinishedTourDateId').text(TourCompletionDate);
            $('#lblFinishedTour').show()
        } else {
        	IsTourCompleted=false;
            $('#lblstartedTour').text(moment(data[0].TourStartDate).format('DD-MMM-YY'));
            $('#lblstartedTour').append($(" "));
            var startTime = moment(data[0].TourStartDate).format('DD/MMM/YY HH:mm:ss');
            var CurrentTimeMonth = moment().format('DD/MMM/YY HH:mm:ss');
            var ms = moment(CurrentTimeMonth, "DD/MMM/YY HH:mm:ss").diff(moment(startTime, "DD/MMM/YY HH:mm:ss"));
            var d = moment.duration(ms);
            var TotalTime = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
            Time = TotalTime.split(':');
            hour = parseInt(Time[0]);
            min = parseInt(Time[1]);
            var TourTime = hour + ':' + min;
            $('#TimeDuration').text(TourTime);

        }
    }

}

function GetDTourItemFailure() {

}


function GetObservationForBindSuccess(data) {
    //$('.mid .checkbox-image').bootstrapToggle();
    ObservationData = data;
    ObservationCount = data.length;
    if (data.length > 0) {

		 
		//var totalApprovedCrit=0;
		//var totalRejectedCrit=0;
		//var totalNACrit=0;
		//var totalCrit=$('#txtTotalCriteriacnt').text();
        for (i = 0; i < data.length; i++) {
            //_ObservationID__ClearBtnId
            $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationClearId").val(data[i].Id);
            $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationId_" + data[i].Id + "_ClearBtnId");
            $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationId").val(data[i].Observation);
            //$("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CorrectiveActionId").val(data[i].CorrectiveAction);
            //$("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_SeverityID").val(data[i].SeverityId);
            
            
            $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
            //$("#Dept___"+data[i].AreaId+"_Cat_"+data[i].CategoryId+"_Crit_"+data[i].CriteriaId+"_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
            
            
            

            
            if(data[i].Action=='Approved')
            {
            	$("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ApprovedRdButton").prop("checked", true);
            	$("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").show();
            
            }
            else if(data[i].Action=='Rejected')
            {
	           	 $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_RejectedRdButton").prop("checked", true);
	           	 $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").show();
           	 	 $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_divNearMissId").show();
	           	if(data[i].SeveritySequence==4)
	            {
	            	$("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_NearMissId").prop("checked", true);
	            }
            
            }
            else
            {
                 $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_NApplicableRdButton").prop("checked", true);
				 $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_CNCFormID").hide();
            }
            
            $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_BtnId").html('Update');
            ImageDiv = "Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_AttachDisId";
            imageID = "Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId;
            
            
            if (data[i].Attachment) {
                $("#Dept___" + data[i].AreaId + "_Cat_" + data[i].CategoryId + "_Crit_" + data[i].CriteriaId + "_ObservationAttachID").val(data[i].Id);
                GetObservationAttachments(data[i].Id, GetObservationsAttachmentsSuccess, GetObservationAttachmentsFailure);
            }
        }
        InitCheckClick();
    }
    if ($('#hdnDepartmentStatus').val() == 'Completed') {
        $('.pd-submit-btn').hide();
        $('.Submitbtn').hide();
        $('input[type="file"]').prop("disabled", true);
        $("textarea").prop('disabled', true);
        $('.form-control').prop('disabled', true);
    }
    //InitCancelClick();
	UpdateCritCounts();
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
            } else {
                $('#' + AttachID).append('<br/>' + parseInt(i + 1) + '. <a href="' + data[i].Fileurl + '" target="_blank" style="text-decoration:underline;font-weight: bold;">' + data[i].Filename + '</a><a onclick="DeleteObservationFormAttachment(this)" data-ItemId="' + ItemId + '" data-filename="' + data[i].Filename + '" Id="' + Id + '__' + parseInt(i + 1) + '"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
            }
        }
    } else {
        $("#" + AttachID).empty();
    }

    fileID = '';

    HideLoader();

}

function GetObservationForBindFailure() {}


function EmployeeDetailsFailure() {

}



function getCriteriasSuccess(collCriteria) {
    if (collCriteria.length > 0) {
        RawCriteriaArray = collCriteria
    }
    getSeverity(getSeveritySuccess, getSeverityFailure)
}

function getCriteriasFailure() {

}

var FilteredCategory = [];
var FilteredCriteria = [];

function getSeveritySuccess(collSeverity) {
    RawSeverityArray = collSeverity
    var CriteriaTitle = "";
    if (RawCriteriaArray.length > 0) {

        var GetUniqueArea = getUniqueArea();
        if (GetUniqueArea.length > 0) {
            var TempDepartmentHtml = '';
            for (var i = 0; i < GetUniqueArea.length; i++) {
                var newDept = tempDepartmentHTML;
                var TempCategoryTempHtml = '';
                var Srno = 0;
                FilteredCategory = GetFilteredCategoryDetails(GetUniqueArea[i].AreaId);

                var GetUniqueCategory = getUniqueCategory();

                if (GetUniqueCategory.length > 0) {
                    for (var j = 0; j < GetUniqueCategory.length; j++) {
                        // if(GetUniqueCategory[j].AreaId==GetUniqueArea[i].AreaId)
                        //{
                        Srno++
                        FilteredCriteria = GetFilteredCriteriaDetails(GetUniqueCategory[j].CategoryId);
                        var newCategory = tempCategoryHTML;
                        newCategory = newCategory.replace(/__CriticalCategoryName__/g, GetUniqueCategory[j].CategoryTitle)
                        newCategory = newCategory.replace(/__CurrentNumber__/g, j)
                        newCategory = newCategory.replace(/__no.__/g, Srno)
                        var TempCriteriaTempHtml = '';

                        for (k = 0; k < FilteredCriteria.length; k++) {

                            //if(RawCriteriaArray[k].AreaId == GetUniqueArea[i].AreaId && RawCriteriaArray[k].CategoryId == GetUniqueCategory[j].CategoryId)
                            //{    
                            // Srno++
                            /*	var	newCategory = tempCategoryHTML;
                            	newCategory=newCategory.replace(/__CriticalCategoryName__/g,GetUniqueCategory[j].CategoryTitle)
                            	newCategory=newCategory.replace(/__CurrentNumber__/g,j)
                            	newCategory=newCategory.replace(/__no.__/g,Srno)*/

                            criteriaCount++;
                            var newCriteria = tempCriteriaHtml;
                            CriteriaTitle = FilteredCriteria[k].Criteria;
                            //var tempSeverity = '<option value="select">Select</option>';
                            /*
                            var tempSeverity = '';
                            for (l = 0; l < RawSeverityArray.length; l++) {
                                tempSeverity += '<option value=' + RawSeverityArray[l].Id + '>' + RawSeverityArray[l].Title + '</option>';
                            }
                            newCriteria = newCriteria.replace(/__Severity__/g, tempSeverity)
                            */
                            newCriteria = newCriteria.replace(/__WhatName__/g, FilteredCriteria[k].What)
                            newCriteria = newCriteria.replace(/__CriteriaName__/g, FilteredCriteria[k].Criteria)
                            newCriteria = newCriteria.replace(/__CriteriaID__/g, FilteredCriteria[k].Id)
                            TempCriteriaTempHtml += newCriteria
                            //}		

                        }
                        newCategory = newCategory.replace(/__CurrentNumber__/g, j)
                        newCategory = newCategory.replace(/__SubCategory__/g, TempCriteriaTempHtml);
                        newCategory = newCategory.replace(/__CategoryID__/g, GetUniqueCategory[j].CategoryId);
                        newCategory = newCategory.replace(/__CriteriaTitle__/g, CriteriaTitle);
                        //newCategory = newCategory.replace(/__CriteriaTitle__/g, GetUniqueCategory[j].CategoryTitle);
                        newCategory = newCategory.replace(/PlantDepartmentID__/g, GetUniqueArea[i].AreaId);
                        TempCategoryTempHtml += newCategory
                        //} 
                    }
                }
                newDept = newDept.replace(/__CriticalCategory__/g, TempCategoryTempHtml)
                newDept = newDept.replace(/__DepartmentName__/g, GetUniqueArea[i].AreaTitle)
                newDept = newDept.replace(/__PlantDepartmentID__/g, GetUniqueArea[i].AreaId);
                //newDept=newDept.replace(/__CriteriaTitle__/g,CriteriaTitle);
                TempDepartmentHtml += newDept;
                $('#CriteriaWiseObservationId').append(TempDepartmentHtml);
                TempDepartmentHtml ='';
               $('#heading_'+GetUniqueArea[i].AreaId+' #txtTotalCriteriacnt').text($('#collapse_'+GetUniqueArea[i].AreaId+' .list-group-item.question').length);
				$('#heading_'+GetUniqueArea[i].AreaId+' #txtPendingCriteriacnt').text($('#collapse_'+GetUniqueArea[i].AreaId+' .list-group-item.question').length);

            }
        }
        //$('#CriteriaWiseObservationId').append(TempDepartmentHtml);
        $('.mid .checkbox-image').bootstrapToggle();
        
        

        InitCancelClick();
    }
    GetObservationForBind(DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure)
}

//.toggle.btn.btn-default.off
function InitCancelClick() {
    $('.toggle.btn-primary').unbind().click(function() {
        $(this).find('input').prop('checked', false);
        ShowObservationTab($(this).find('input'));
        $(this).removeClass('btn-primary').addClass('btn-default').addClass('off');
        $(this).find('.checkbox-image').bootstrapToggle('destroy').bootstrapToggle();
        InitCheckClick();
    });
}

function InitCheckClick() {
    $('.toggle.off').unbind().click(function() {
        $(this).find('input').prop('checked', true);
        ShowObservationTab($(this).find('input'));
        $(this).removeClass('btn-default').removeClass('off').addClass('btn-primary');
        $(this).find('.checkbox-image').bootstrapToggle('destroy').bootstrapToggle();
        InitCancelClick();
    });
}




function getUniqueArea() {
    var UniqueAreaArray = [];
    $.each(RawCriteriaArray, function(i, e) {
        var matchingItems = $.grep(UniqueAreaArray, function(item) {
            return item.AreaId === e.AreaId;
        });
        if (matchingItems.length === 0) {
            UniqueAreaArray.push(e);
        }
    });
    return UniqueAreaArray;
}

function GetFilteredCategoryDetails(AreaId) {
    return arr = $.grep(RawCriteriaArray, function(d, i) {
        return d.AreaId == AreaId;
    });

}

function GetFilteredCriteriaDetails(CategoryId) {
    return arr = $.grep(FilteredCategory, function(d, i) {
        return d.CategoryId == CategoryId;
    });

}



function getUniqueCategory() {
    UniqueCategoryArray = [];
    $.each(FilteredCategory, function(i, e) {
        var matchingItems = $.grep(UniqueCategoryArray, function(item) {
            return item.CategoryId === e.CategoryId;
        });
        if (matchingItems.length === 0) {
            UniqueCategoryArray.push(e);
        }
    });
    return UniqueCategoryArray;
}


function getSeverityFailure() {

}
/*Delete observation item*/
var DeleteItemId = '';
var ObserItemId = '';

function ClearCriteriaNonConfirmity(data) {
    ShowLoader();
    var ID = $(data).attr('Id');
    if (ID == undefined) {
        ID = data;
    }
    ObserItemId = ID.replace('ClearBtnId', 'BtnId');
    ID = ID.replace('_ClearBtnId', '');
    DeleteItemId = ID
    var ItemId = $("#" + ID + "_ObservationClearId").val();
    if (ItemId != '' && ItemId != undefined) {
        DeleteListitem(ItemId, DeleteObservationitemSuccess, DeleteObservationitemFailure);
    } else {
        $("#" + DeleteItemId + "_ObservationClearId").val();
        $("#" + DeleteItemId + "_ObservationId").val('');
        $("#" + DeleteItemId + "_CorrectiveActionId").val('');
        $("#" + DeleteItemId + "_SeverityID").val(1);
        $("#" + DeleteItemId + "_AttachDisId").empty();
        $("#" + DeleteItemId + "_ObservationClearId").val('')
        HideLoader();
    }
}

function DeleteObservationitemSuccess() {
    var Observation = $("#" + DeleteItemId + "_ObservationId").val('');
    var CorrectiveAction = $("#" + DeleteItemId + "_CorrectiveActionId").val('');
    var Severity = $("#" + DeleteItemId + "_SeverityID").val(1);
    $("#" + DeleteItemId + "_ObservationClearId").val('')
    $("#" + DeleteItemId + "_AttachDisId").empty();
    $('#' + ObserItemId).html('Save');
    // $("#"+DeleteItemId+"_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
    InitCheckClick()
    GetObservationForBind(DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure)

}

function DeleteObservationitemFailure() {
    HideLoader();
}

function SubmitCriteriaNonConfirmity(data) {
    var Isvalidate = true;
    var ID = $(data).attr('Id');
    ID = ID.replace('_BtnId', '');
	
	var isBtnRejected=  $('#'+ID+'_RejectedRdButton').is(':checked');
	
    var Observation = $("#" + ID + "_ObservationId").val();
    //var CorrectiveAction = $("#"+ID+"_CorrectiveActionId").val().trim();
   // var Severity = $("#" + ID + "_SeverityID").val();
	
	
    if (Observation == "" && isBtnRejected) {
        Isvalidate = false;
        alert("Please Enter Comment")
    }
    /*else if(CorrectiveAction == "")
    {
    	alert("PLease Enter CorrectiveAction Comments")
    }
    else if (Severity == "Select") {
        Isvalidate = false;
        alert("Please Select Severity")
    } 
    */
    else if (Isvalidate) {
    	//alert('test')
        ShowLoader();
		SaveObservationDetails(data)
    }

}

function SavePlantTourInput(ID) {
	ShowLoader();
     var CriteriaId = ID.split("_")[7];
    var AreaId = ID.split("_")[3];
    var CriteriaDetails = $.grep(RawCriteriaArray, function(el) {
        return el.Id == CriteriaId;
    });
    var DepartmentId = CriteriaDetails[0].DepartmentId
    var DepartmentDetails = $.grep(RawDepartmentArray, function(el) {
        return el.Id == DepartmentId;
    });
    var CategoryId = CriteriaDetails[0].CategoryId
    var What = CriteriaDetails[0].What
    var Criteria = CriteriaDetails[0].Criteria
    var CriteriaId = CriteriaDetails[0].Id
  
	  if($("#" + ID + "_ObservationClearId").length>0)
	  {
	  	 var ObservationId = $("#" + ID + "_ObservationClearId").val();
	  }
	  else
	  {
	  	 var ObservationId = '';
	  }
	  
	  if($("#" + ID + "_ObserId").length>0)
	  {
	  	 var AttachmentId = $("#" + ID + "_ObserId").val();
	  }
	  else
	  {
	  	 var AttachmentId = '';
	  }

    var Action='';
    var Status='Draft';

    var ObservationItemId = '';
    if (ObservationId != null && ObservationId != '') {
        ObservationItemId = ObservationId
    } else if (AttachmentId != 0) {
        ObservationItemId = AttachmentId
    }
 
    if ($('#'+ID+'_ApprovedRdButton').is(':checked')==true)
    {
    	var Severity=FilterSeveritybySequence(2);
    	if(Severity.length>0)
    	{
    		var Severity=Severity[0].Id;
    	}
    	else
    	{
    		var Severity=null;
    	}
		Action = "Approved";
		Status= "NA";
    }
    else if ($('#'+ID+'_RejectedRdButton').is(':checked')==true)
    {
		var Severity=null;
		
		Status= "Draft";
		Action ="Rejected";
    }
    else
    {
 		var Severity=FilterSeveritybySequence(1);
    	if(Severity.length>0)
    	{
    		var Severity=Severity[0].Id;
    	}
    	else
    	{
    		var Severity=null;
    	}
		Status= "NA";
    	Action ="Not Applicable";
    }
    var objNonConfirmityDetails = new ObservationsListEntity();
    objNonConfirmityDetails.Observation = '';
   // objNonConfirmityDetails.CorrectiveAction = CorrectiveAction;
    objNonConfirmityDetails.Severity = Severity;
    objNonConfirmityDetails.What = What;
    objNonConfirmityDetails.Criteria = Criteria;
    objNonConfirmityDetails.Status = Status;  // 'Pending';
    objNonConfirmityDetails.CriteriaId = CriteriaId;
    objNonConfirmityDetails.DepartmentTourId = DepartmentTourId;
    objNonConfirmityDetails.AreaId = AreaId;
    objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
    objNonConfirmityDetails.DepartmentId = DepartmentId;
    objNonConfirmityDetails.CategoryId = CategoryId;
    objNonConfirmityDetails.Action = Action;
    
    objNonConfirmityDetails.ObservedByRole = userRoleName;
    objNonConfirmityDetails.PlantId = PlantId;
    objNonConfirmityDetails.TourDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.ObservedDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.Title = userRoleName + '_' + moment().format('MM-DD-YYYY');

debugger;
    if (ObservationItemId == '') {
        CreateObservation(objNonConfirmityDetails,ID, CreateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure);
    } else if ((ObservationItemId != '')) {
        UpdateObservationForAttachment(ObservationItemId,ID, objNonConfirmityDetails, UpdateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure);
       
    }


}
function UpdateSavePlantTourInputSuccess(data,elementID)
{
	UpdateCritCounts(elementID);
	HideLoader();
}


function CreateSavePlantTourInputSuccess(data,elementID)
{
	$('#'+elementID+'_ObservationClearId').val(data.d.Id);
	UpdateCritCounts(elementID);
	HideLoader();
}

function CreateSavePlantTourInputFailure()
{
	HideLoader();
}


function UpdateCritCounts(elementID)
{
	var successPercentage=0.0;
	var totalCriteria=0;
	var totaltouchedCriteria=0;
	$('.accordion').each(function(){
		//var currentID=elementID;
		//var AreaId = currentID.split("_")[3];
		//var ParentID='collapse_'+AreaId;
		var currAreaId=$(this).attr('id').replace('accordionExample_','');
		var AreaId = currAreaId;
		var ParentID='collapse_'+AreaId;
		var TotalCriteria=$('#'+ParentID+' .list-group-item.question').length;
		var ApprovedCriteria=0;
		var RejectedCriteria=0;
		var PendingCriteria=0;
		var NACriteria=0;
		totalCriteria=parseInt(totalCriteria)+$('#'+ParentID+' .list-group-item.question').length;
		$('#'+ParentID+' .list-group-item.question').each(function(){
			var radName=$(this).find('input[type=radio]').attr('name');
			
			if($('input[name='+radName+']:checked').length==0)
			{
				PendingCriteria=parseInt(PendingCriteria)+1;;
			}
			else
			{
				//RejectedRdButton
				var radId=$('input[name='+radName+']:checked').attr('id');
				
				var checkVal=radId.substring(radId.lastIndexOf('_')+1);
				if(checkVal=='RejectedRdButton')
				{
					RejectedCriteria=parseInt(RejectedCriteria)+1;
				}
				else if(checkVal=='ApprovedRdButton')
				{
					ApprovedCriteria=parseInt(ApprovedCriteria)+1;
				}
				else
				{
					NACriteria=parseInt(NACriteria)+1;
					TotalCriteria=parseInt(TotalCriteria)-1;
				}
				
			}
		});
		
		$('#heading_'+AreaId+' #txtTotalCriteriacnt').text(TotalCriteria);
		$('#heading_'+AreaId+' #txtTotalRejectedCriteriacnt').text(RejectedCriteria);
		$('#heading_'+AreaId+' #txtPendingCriteriacnt').text(PendingCriteria);
		$('#heading_'+AreaId+' #txtTotalApprovedCriteriacnt').text(ApprovedCriteria);
		
		totaltouchedCriteria = parseInt(totaltouchedCriteria ) +parseInt(RejectedCriteria)+parseInt(ApprovedCriteria)+parseInt(NACriteria);
		
	});
	debugger;
	//successPercentage=parseFloat((totalCriteria-totaltouchedCriteria)/ totalCriteria).toFixed(2);
		successPercentage=parseFloat(totaltouchedCriteria/ totalCriteria).toFixed(2);
	$('#divStatus').circleProgress({
	value: successPercentage,
	size: 40,
	fill: {
			gradient: ["green"]
		}

	}).on('circle-animation-progress', function(event, progress) {
		$(this).find('strong').html(Math.round(100 * successPercentage) + '<i>%</i>');
	});
	if(successPercentage=="1.00")
	{
	$('#divStatus strong').css( "left"," -38px");
	
	}		
}

 


function SaveObservationDetails(data) {
 
    // var AttachmentId=$('#hdnObservationId').val();
    var ID = $(data).attr('Id');
    ID = ID.replace('_BtnId', '');
    var CriteriaId = ID.split("_")[7];
    var AreaId = ID.split("_")[3];
    var CriteriaDetails = $.grep(RawCriteriaArray, function(el) {
        return el.Id == CriteriaId;
    });
    var DepartmentId = CriteriaDetails[0].DepartmentId
    var DepartmentDetails = $.grep(RawDepartmentArray, function(el) {
        return el.Id == DepartmentId;
    });
    var CategoryId = CriteriaDetails[0].CategoryId
    var What = CriteriaDetails[0].What
    var Criteria = CriteriaDetails[0].Criteria
    var CriteriaId = CriteriaDetails[0].Id
    var Observation = $("#" + ID + "_ObservationId").val();
    //var CorrectiveAction = $("#" + ID + "_CorrectiveActionId").val().trim();
    //var Severity = $("#" + ID + "_SeverityID").val();
    var ObservationId = $("#" + ID + "_ObservationClearId").val();
    var AttachmentId = $('#' + ID + "_ObserId").val();
    var Action='';
    var Status='Pending';

    var ObservationItemId = '';
    if (ObservationId != null && ObservationId != '') {
        ObservationItemId = ObservationId
    } else if (AttachmentId != 0) {
        ObservationItemId = AttachmentId
    }
 
    if ($('#'+ID+'_ApprovedRdButton').is(':checked')==true)
    {
    	var Severity=FilterSeveritybySequence(2);
    	if(Severity.length>0)
    	{
    		var Severity=Severity[0].Id;
    	}
    	else
    	{
    		var Severity=null;
    	}
		Action = "Approved";
		Status= "NA";
		 
    }
    else if ($('#'+ID+'_RejectedRdButton').is(':checked')==true)
    {
    	if($('#'+ID+'_NearMissId').is(':checked')==true )
    	{
    		var Severity=FilterSeveritybySequence(4);
    	}
    	else
    	{
    		var Severity=FilterSeveritybySequence(3);
    	}
    	
    	if(Severity.length>0)
    	{
    		var Severity=Severity[0].Id;
    	}
    	else
    	{
    		var Severity=null;
    	}
		Status= "Pending";
  		  Action ="Rejected";
    }
    else
    {
 		var Severity=FilterSeveritybySequence(1);
    	if(Severity.length>0)
    	{
    		var Severity=Severity[0].Id;
    	}
    	else
    	{
    		var Severity=null;
    	}
		Status= "NA";
    	Action ="Not Applicable";
    }
    var objNonConfirmityDetails = new ObservationsListEntity();
    objNonConfirmityDetails.Observation = Observation;
   // objNonConfirmityDetails.CorrectiveAction = CorrectiveAction;
    objNonConfirmityDetails.Severity = Severity;
    objNonConfirmityDetails.What = What;
    objNonConfirmityDetails.Criteria = Criteria;
    objNonConfirmityDetails.Status = Status;  // 'Pending';
    objNonConfirmityDetails.CriteriaId = CriteriaId;
    objNonConfirmityDetails.DepartmentTourId = DepartmentTourId;
    objNonConfirmityDetails.AreaId = AreaId;
    objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
    objNonConfirmityDetails.DepartmentId = DepartmentId;
    objNonConfirmityDetails.CategoryId = CategoryId;
    objNonConfirmityDetails.Action = Action;
    
    objNonConfirmityDetails.ObservedByRole = userRoleName;
    objNonConfirmityDetails.PlantId = PlantId;
    objNonConfirmityDetails.TourDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.ObservedDate = moment().format('HH:mm A MMMM DD,YYYY ');
    objNonConfirmityDetails.Title = userRoleName + '_' + moment().format('MM-DD-YYYY');


    if (ObservationItemId == '') {
        CreateObservation(objNonConfirmityDetails,ID , CreateObservationSuccess, CreateObservationFailure)
    } else if ((ObservationItemId != '')) {
        UpdateObservationForAttachment(ObservationItemId,ID ,objNonConfirmityDetails, CreateObservationSuccess, CreateObservationFailure);
    }


}

function UpdateObservationSuccess(data) {
    GetObservationForBind(DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure)

}

function UpdateObservationFailure() {

}

function CreateObservationSuccess(data) {
    GetObservationForBind(DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure)
}

function CreateObservationFailure() {}


// save final comment on final submit

function ValidateFinishTour()
{
	var objObservationsListEntity=new ObservationsTypeListEntity();
	var TotalCriteria=$('.list-group-item.question').length;
	var ApprovedCriteria=0;
	var RejectedCriteria=0;
	var NACriteria=0;
	objObservationsListEntity.IsValidated=true;
	$('.list-group-item.question').each(function(){
		var radName=$(this).find('input[type=radio]').attr('name');
		var commentboxId=radName.replace('Action','ObservationId');

		

		
		if($('input[name='+radName+']:checked').length==0)
		{
			objObservationsListEntity.IsValidated=false;
			objObservationsListEntity.ValidationMsg='Please take action on each criteria';
			return objObservationsListEntity;
		}
		else 
		{
			var commentboxId=radName.replace('Action','ObservationId');
			var radId=$('input[name='+radName+']:checked').attr('id');
			var checkVal=radId.substring(radId.lastIndexOf('_')+1);
			if(checkVal=='RejectedRdButton' )
			{
				//RejectedRdButton
				
				if(checkVal=='RejectedRdButton')
				{
					var CommentText=$('#'+commentboxId).val().trim();
				}
				else
				{
					var CommentText='';
				}
				RejectedCriteria=parseInt(RejectedCriteria)+1;
				if(CommentText=='')
				{
					objObservationsListEntity.IsValidated=false;
					objObservationsListEntity.ValidationMsg='Please enter comment for all Observations / Near Miss';
					return objObservationsListEntity;
				}
			}
			else
			{
				var radId=$('input[name='+radName+']:checked').attr('id');
				var checkVal=radId.substring(radId.lastIndexOf('_')+1);
	
				if(checkVal=='RejectedRdButton')
				{
					RejectedCriteria=parseInt(RejectedCriteria)+1;
				}
				else if(checkVal=='ApprovedRdButton')
				{
					ApprovedCriteria=parseInt(ApprovedCriteria)+1;
				}
				else
				{
					NACriteria=parseInt(NACriteria)+1;
					
					TotalCriteria=parseInt(TotalCriteria)-1;
				}
				
			}
		}
		
	});
	
	objObservationsListEntity.ApprovedCriteria=ApprovedCriteria;
	objObservationsListEntity.RejectedCriteria=RejectedCriteria;
	objObservationsListEntity.NACriteria=NACriteria;
	objObservationsListEntity.TotalCriteria=TotalCriteria;

	
	return objObservationsListEntity;
}

function SaveFinalComment() {
	var objTempData=ValidateFinishTour();
	if(objTempData.IsValidated)
	{
		ShowLoader();
		//GetObservationForCount(DepartmentTourId,GetObservationForCountSuccess,GetObservationForCountFailure)
		//alert('validated' + " Total criteria "+objTempData.TotalCriteria+" Approved Criteria "+objTempData.ApprovedCriteria+" Rejected Criteria "+objTempData.RejectedCriteria);
		
		//var totalCriteria=$('.list-group-item.question').length;
		 
		//var criteriaCnt = parseInt(criteriaCount - CriteriaNotApplicable);
		//var ObservationCnt = parseInt(ApprovedObservationCount);
		if(objTempData.TotalCriteria>0)
		{
			var TourScore = parseFloat(((objTempData.TotalCriteria- objTempData.RejectedCriteria) / objTempData.TotalCriteria) * 100);
			var TotalScore = TourScore.toFixed(2);
		}
		else
		{
			var TotalScore = 0;
		}
		

		
		//var ApprovedObservationCount=data.length
		//var TourScore = CalTotalScore();
	 

		var objDepartmentTourListEntity = new DTourListEntity();
		objDepartmentTourListEntity.FinalComment = $('#txtFinalComment').val();
		//criteriaCount = criteriaCount - CriteriaNotApplicable;
		objDepartmentTourListEntity.TotalCriterias = parseInt(objTempData.TotalCriteria);
		objDepartmentTourListEntity.TotalObservations = parseInt(objTempData.RejectedCriteria);
		objDepartmentTourListEntity.TotalNACriterias = parseInt(objTempData.NACriteria);
		objDepartmentTourListEntity.TotalCompliances = parseInt(objTempData.ApprovedCriteria);
		objDepartmentTourListEntity.TourScore =TotalScore ;// TourScore;
		objDepartmentTourListEntity.TourCompletionDate = moment().format('MM-DD-YYYY HH:mm:ss');
		
		
		//ShowCongrats(TotalScore );
		UpdateDTourItem(DepartmentTourId, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure)
		

	}
	else
	{
		alert(objTempData.ValidationMsg);
		//alert('Please take action on each criteria');
	}


    
}
function GetObservationForCountFailure()
{

}

function UpdateDTourItemSuccess(data,TotalScore) {
	HideLoader();
	ShowCongrats(TotalScore);
	setTimeout(function(){
		window.location.replace("/sites/Mrs_Bectors_PTMS/Pages/Home.aspx");
	},5000);
    
}


function ShowCongrats(TotalScore)
{
	document.getElementById("divCongrats").style.display = "block";
	$('#divCongrats .word1').empty().append('Congratulations for completing the tour');
	$('#divCongrats .word2').empty().append('You have scored '+ TotalScore +'%');
	//$('#divCongrats').css({'position':'absolute','bottom': '20%','left': '10%','font-size': '18px'});
	$('#divCongrats').css({'bottom': '20%','font-size': '16px'});
	
 
	
	anime.timeline({loop: true})
	  .add({
	    targets: '.ml15 .word',
	    scale: [14,1],
	    opacity: [0,1],
	    easing: "easeOutCirc",
	    duration: 1000,
	    delay: (el, i) => 800 * i
	  }).add({
	    targets: '.ml15',
	    opacity: 0,
	    duration: 1000,
	    easing: "easeOutExpo",
	    delay: 1000
	 });
	  
}

/*
var ApprovedObservationCount=0;
function GetObservationForCountSuccess(data)
{
ApprovedObservationCount=data.length
var TourScore = CalTotalScore();
    var objDepartmentTourListEntity = new DTourListEntity
    objDepartmentTourListEntity.FinalComment = $('#txtFinalComment').val();
    criteriaCount = criteriaCount - CriteriaNotApplicable;
    objDepartmentTourListEntity.TotalCriterias = criteriaCount;
    objDepartmentTourListEntity.TotalObservations = ApprovedObservationCount;
    objDepartmentTourListEntity.TourScore = TourScore;
    objDepartmentTourListEntity.TourCompletionDate = moment().format('MM-DD-YYYY HH:mm:ss');

    UpdateDTourItem(DepartmentTourId, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure)

}


*/

function CalTotalScore() {

    var criteriaCnt = parseInt(criteriaCount - CriteriaNotApplicable);
    var ObservationCnt = parseInt(ApprovedObservationCount);
    var TourScore = parseFloat(((criteriaCnt - ObservationCnt) / criteriaCnt) * 100);
    var TotalScore = TourScore.toFixed(2)
    return TotalScore;
}


function UpdateDTourItemFailure() {}

function ChangeImage(data) {
    var TourId = data.dataset.target;
    TourId = TourId.split("_")[1];

    $('#infoToggler' + TourId).find('.toggle-img').toggle();
    $('.accordion-btn btn-link').find('.accordion-btn btn-link').toggle();

}
var RdBtn = '';
var CriteriaNotApplicable = 0;
var CheckCritID = '';
var RdnCount = 0;

function ShowObservationTab(data) {
    var formID = $(data).attr("Id");
    RdBtn = formID.split("_")[8];
    var replaceformID = formID;
    var CritId = replaceformID.replace(RdBtn, "");

    formID = formID.replace(RdBtn, "CNCFormID");
    if (RdBtn == "ApprovedRdButton") {

        $("#" + formID).show();
        $("#" + formID +' .divNearMissId').hide();
        if (RdnCount < 2) {
            CriteriaNotApplicable--;
        }

    }
    else if (RdBtn == "RejectedRdButton") {

        $("#" + formID).show();
        $("#" + formID +' .divNearMissId').show();
        
        if (RdnCount < 2) {
            CriteriaNotApplicable--;
        }

    }
	 else if (RdBtn == "NApplicableRdButton") 
    {
        $("#" + formID).hide();
        $("#" + formID +' .divNearMissId').hide();
        
        /*
        if ($('#hdnDepartmentStatus').val() != 'Completed' && $('#hdnDepartmentStatus').val() == "") {
            var ClearId = formID.replace('CNCFormID', "ClearBtnId");
            ClearCriteriaNonConfirmity(ClearId);
        }
        if (CheckCritID == CritId) {
            CriteriaNotApplicable++

        } else {
            CriteriaNotApplicable++
            CheckCritID = CritId;
        }
        */
    }
    
	var currId= formID.substring(0,formID.lastIndexOf('_')); 
	if(!IsTourCompleted)
	{
		SavePlantTourInput(currId);
	}
	


}

function HODNotApplicable(data) {
    RdnCount = 0;
    /*
    var formID = $(data).attr("Id");
    var currId= formID.substring(0,formID.lastIndexOf('_')); 
	SavePlantTourInput(currId);
	*/
	if(!IsTourCompleted)
	{

    ShowObservationTab(data);
    }
    

}

function HODApproved(data) {
    RdnCount++
    if(!IsTourCompleted)
	{

    ShowObservationTab(data);
    }
}

function HODRejected(data) {
    RdnCount++
    if(!IsTourCompleted)
	{

    ShowObservationTab(data);
    }
}

var offImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png'/>" 
var onImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png'/>"

var tempDepartmentHTML = '<div class="accordion" id="accordionExample___PlantDepartmentID__">'+
    '<div class="card header-card">'+
        '<div class="card-header accordion-header" id="heading___PlantDepartmentID__">'+
            '<h2 class="mb-0 align-self-center minimum-height">'+
                '<div class="accordion-btn btn-link collapsed" onclick="ChangeImage(this)" type="button" data-toggle="collapse" data-target="#collapse___PlantDepartmentID__" aria-expanded="false" aria-controls="collapse___PlantDepartmentID__" >'+
                    '<div class="media accordion-media">'+
                        '<div class="media-body align-self-center width-ninty" align="left">'+
                        '<h5 class="mt-0 flt-left" >__DepartmentName__</h5>'+
                        '<div class="progress-section" align="right" style="margin-top: 0px;">'+
                        		'<div>'+
	                        		'<p id="txtTotalCriteriacnt"  title="Total number of criterias"  style="display: inline-block;">0</p> / '+
	                        		'<p id="txtTotalApprovedCriteriacnt"  title="Total number of approved criteria"  style="display: inline-block;background-color:Green;color:#fff !important;">0</p> / '+
	                        		'<p id="txtTotalRejectedCriteriacnt"  title="Total number of observations / Near Miss"  style="display: inline-block;background-color:Red;color:#fff !important;">0</p> / '+
	                        		'<p id="txtPendingCriteriacnt" title="Total number of criteria for pending action"  style="display: inline-block;background-color:yellow;">0</p>'+
	                        	'</div>'+
	                        //'<div class="progress">'+
	                        	
							  	//'<div class="progress-bar progressing" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" ></div>'+
							//'</div>'+
						'</div>' +

                    '</div>'+
                        '<div id="infoToggler__PlantDepartmentID__" class="infoToggler">'+
                        '<img class="align-self-center navigate-large toggle-img"src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png" >'+
                        '<img class="align-self-center navigate-reduce toggle-img" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/minus-sign.png"  style="display:none;"></div>'+
                '</div>'+'</div>'+
            '</h2>'+
        '</div>'+
        '<div id="collapse___PlantDepartmentID__" class="collapse" aria-labelledby="heading___PlantDepartmentID__" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;" aria-expanded="true">'+   
              '<div class="card-body">'+
                '<div class="accordion" id="accordionExample___PlantDepartmentID__">__CriticalCategory__</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

  
var tempCategoryHTML ='<div class="card body-card">'+
    '<div class="card-header accordion-header" id="headingtwoerex">'+
        '<h2 class="mb-0 align-self-center minimum-height">'+
            '<div class="accordion-btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsetwoerex__CurrentNumber___PlantDepartmentID__" aria-expanded="false" aria-controls="collapsetwoerex">'+
                '<div class="media accordion-media">'+
                    '<div class="align-self-center mr-3"><span class="task-number">__no.__</span>'+
                    '</div>'+
                    '<div class="media-body align-self-center flex-media-none" align="left">'+
                        '<h5 class="mt-0" >__CriticalCategoryName__</h5>'+
                    '</div>'+
	              '<div class="full-width">'+
                   // '<button type="button" class="btn  align-self-center check-visually-btn" >Check visually</button>'+
	               '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/navigate.png" class="align-self-center navigate-arrow justify-content-end right-btn" >'+
                '</div>'+
              '</div>'+
          '</div>'+
        '</h2>'+
    '</div>'+
    '<div id="collapsetwoerex__CurrentNumber___PlantDepartmentID__" class="collapse" aria-labelledby="headingtwoerex" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;">'+
        '<div class="card-body accordion-body-section">'+
            '<ul class="list-group list-group-flush">__SubCategory__</ul>'+
           /* '<div class="btn-section">'+
            '<button type="button" class="btn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CatSubmitID" onclick="SubmitCriteriaNonConfirmity(this)">Submit</button>'+
            '</div>'+*/
        '</div>'+
    '</div>'+
'</div>';

var tempCriteriaHtml ='<li class="list-group-item question"><label><p><b>__WhatName__<br/></b></p> __CriteriaName__</label>'+
//'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
//'<div class="mid" align="right">'+
	//' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick="ShowObservationTab(this)">'+
		//' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="Test1" data-off="Test2" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick="ShowObservationTab(this)">'+

	/*
	'<div class="toggle btn btn-primary" data-toggle="toggle" style="width: 0px; height: 0px;">'+
	   ' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick=ShowObservationTab(this)>'+
		'<div class="toggle-group">'+
			'<label class="btn btn-primary toggle-on"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png"></label><label class="btn btn-default active toggle-off"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png"></label><span class="toggle-handle btn btn-default"></span>'+
		'</div>'+
	'</div>'+
	*/

	    //'<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Criteria" onclick=ShowObservationTab(this)>'+
	   //' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick=ShowObservationTab(this)>'+
	// '<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="<img src=https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png>" data-off="<img src=https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png>">'
//'</div>'+
'<div><label class="radio-option radio-inline">Not Applicable<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NApplicableRdButton"  name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="HODNotApplicable(this)" value="NotApplicable"> <span class="checkmark"></span></label>'+
	'<label class="radio-option radio-inline">Approved<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ApprovedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="HODApproved(this)" value="Approved"><span class="checkmark" ></span></label>'+
	'<label class="radio-option radio-inline">Rejected<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___RejectedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="HODRejected(this)" value="Rejected"><span class="checkmark"></span></label></div>'+
	'<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>'+
'<div class="conform-section" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CNCFormID" style="display:none;">'+
//'<br>'+
'<hr />'+
//'<h5 class="mt-0 inner-heading" >Criteria Non Conformity</h5>'+
'<div class="row mgn-nill">'+
    '<div class="col-md-7 pdg-nill">'+
        '<div class="heading-tbl">Comment</div>'+
        '<div class="data-section"><textarea id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationId" rows="2">'+'</textarea>'+'</div>'+
    '</div>'+

    '<div class="col-md-2 pdg-nill divNearMissId" style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___divNearMissId">'+
        '<div class="heading-tbl">Is Near Miss?</div>'+
        '<div class="data-section"><input type="checkbox"  id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NearMissId"> Near Miss</div>'+
    '</div>'+

    '<div class="col-md-3 pdg-nill">'+
        '<div class="heading-tbl">Attachments</div>'+
            '<div>'+
                '<div class="attachment">'+
                    '<div class="attachment-img"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus.png"><label>choose the file</label></div>'+
                    '<input type="file" class="form-control-file" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachID" onchange="ObservationAttachmentClickFunction(this)">'+
		            '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationAttachID" style="display:none"></p>'+
                    //'<input type="file" class="form-control-file" id="exampleFormControlFile1">'+
                    '<input style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObserId" value="0">'+
                    
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachDisId" class="attached-files"></div>'+
	'<div class="btn-section">'+
		//'<button type="button" class="btn ">cancel</button>'+
		'<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___BtnId" onclick="SubmitCriteriaNonConfirmity(this)">Save</button>'+
		//'<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>'+
		'<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ClearBtnId" onclick="ClearCriteriaNonConfirmity(this)">Clear</button>'+
	'</div>'+
'</div>'+   
'</li>'



function FilterSeveritybySequence(Sequence) {
    return arr = $.grep(RawSeverityArray, function(d, i) {
        return d.Sequence == Sequence;
    });

}


