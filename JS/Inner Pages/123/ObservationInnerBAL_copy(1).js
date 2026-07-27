var userDepratmentId=0;
var userRoleSequence=0;
var userRoleName = '';
var RawDepartmentArray = new Array();
var RawCategoryArray = new Array();
var RawCriteriaArray = new Array();
var RawSeverityArray = new Array();

$(document).ready(function(){

    getEmployeeDetails(EmployeeDetailsSuccess,EmployeeDetailsFailure);

})

function EmployeeDetailsSuccess(collEmployee)
{
	if(collEmployee.length>0)
	{
		
		userDepratmentId = collEmployee[0].DepartmentId;
		userRoleSequence= collEmployee[0].RoleId;
		userRoleName = collEmployee[0].RoleName
		if(userDepratmentId == '' && userRoleSequence== '')
		{
			alert('Employee Name or Role not found !')
		}
		else
		{
			//getDepartments(getDepartmentsSuccess,getDepartmentsFailure);
			var SeletctedManagerFilter = '';
			console.log("DepartmentId:"+userDepratmentId+" RoleID:"+userRoleSequence);
			if(userRoleSequence == 10)
			{
				SeletctedManagerFilter = "&$filter=HODManager/Id eq "+_spPageContextInfo.userId
			}
			else if(userRoleSequence == 15)
			{
				SeletctedManagerFilter = "&$filter=PlantManager/Id eq "+_spPageContextInfo.userId
			}
			else
			{
				SeletctedManagerFilter ="";
			}
			getDepartments(SeletctedManagerFilter,getDepartmentsSuccess,getDepartmentsFailure)
			
		}
	}
	else
	{
		alert('Employee Name or Role not found !')
	}	
}

function EmployeeDetailsFailure()
{

}

function getDepartmentsSuccess(collDepartment)
{
	if(collDepartment.length>0)
	{
		RawDepartmentArray = collDepartment
		var selectedDepartmentFilter = "&$filter="
		for(var i=0;i<collDepartment.length;i++)
		{
			if(i>0 && i<collDepartment.length)
			{
				selectedDepartmentFilter +=" or "
			}
			selectedDepartmentFilter += "DepartmentId eq "+collDepartment[i].Id
		}
		getCategorys(selectedDepartmentFilter,getCategorysSuccess,getCategorysFailure)
	}

}

function getDepartmentsFailure()
{
	
}

function getCategorysSuccess(collCategory)
{
	if(collCategory.length>0)
	{
		RawCategoryArray = collCategory
		var selectedCategoryFilter = "&$filter="
		for(var j=0;j<collCategory.length;j++)
		{
			if(j>0 && j<collCategory.length)
			{
				selectedCategoryFilter +=" or "
			}
			selectedCategoryFilter += " Category eq "+collCategory[j].Id
		}
		//console.log(selectedCategoryFilter)
		getCriterias(selectedCategoryFilter,getCriteriasSuccess,getCriteriasFailure)
	}
}

function getCategorysFailure()
{
	
}

function getCriteriasSuccess(collCriteria)
{
	//console.log(collCriteria)
	if(collCriteria.length>0)
	{
		RawCriteriaArray = collCriteria
	}
	getSeverity(getSeveritySuccess,getSeverityFailure)		
}

function getCriteriasFailure()
{
	
}

function getSeveritySuccess(collSeverity)
{
	//console.log(collSeverity)
	RawSeverityArray = collSeverity
	if(RawDepartmentArray.length>0)
	{
		var TempDepartmentHtml = '';	
		for(i=0;i<RawDepartmentArray.length;i++)
		{
			var newDept=tempDepartmentHTML;
			var	TempCategoryTempHtml ='';
			var Srno = 0
			for(j=0;j<RawCategoryArray.length;j++)
			{
				if(RawCategoryArray[j].DepartmentId == RawDepartmentArray[i].Id)
				{
					Srno++
					var	newCategory = tempCategoryHTML;
					newCategory=newCategory.replace(/__CriticalCategoryName__/g,RawCategoryArray[j].Title)
					newCategory=newCategory.replace(/__CurrentNumber__/g,j)
					newCategory=newCategory.replace(/__no.__/g,Srno)
					var	TempCriteriaTempHtml ='';	
					for(k=0;k<RawCriteriaArray.length;k++)
					{
						if(RawCriteriaArray[k].CategoryId== RawCategoryArray[j].Id)
						{
							var	newCriteria = tempCriteriaHtml;
							var tempSeverity = '<option value="select">Select</option>';
							for(l=0;l<RawSeverityArray.length;l++)
							{
								tempSeverity +='<option value='+RawSeverityArray[l].Id+'>'+RawSeverityArray[l].Title+'</option>';
							}
								newCriteria=newCriteria.replace(/__Severity__/g,tempSeverity)
								newCriteria=newCriteria.replace(/__CriteriaName__/g,RawCriteriaArray[k].Title)
								newCriteria=newCriteria.replace(/__CriteriaID__/g,RawCriteriaArray[k].Id)
								TempCriteriaTempHtml+=newCriteria
						}		
							
					}
					newCategory=newCategory.replace(/__CurrentNumber__/g,j)
					newCategory=newCategory.replace(/__SubCategory__/g,TempCriteriaTempHtml);
					newCategory=newCategory.replace(/__CategoryID__/g,RawCategoryArray[j].Id)
					TempCategoryTempHtml+=newCategory
				}

			}

			newDept=newDept.replace(/__CriticalCategory__/g,TempCategoryTempHtml)
			newDept=newDept.replace(/__DepartmentName__/g,RawDepartmentArray[i].Title)
			newDept=newDept.replace(/__PlantDepartmentID__/g,RawDepartmentArray[i].Id);
			TempDepartmentHtml+=newDept;
		
		}
		$('#CriteriaWiseObservationId').append(TempDepartmentHtml);

	}
	
	
	
}

function getSeverityFailure()
{
	
}

function SubmitCriteriaNonConfirmity(data)
{
	var ID = $(data).attr('Id');
	ID= ID.replace('_BtnId','');
	var CriteriaId= ID.split("_")[5]
	var CriteriaDetails = $.grep(RawCriteriaArray, function(el) {
		return el.Id == CriteriaId;
	});
	var DepartmentId = CriteriaDetails[0].DepartmentId
	var CategoryId = CriteriaDetails[0].CategoryId
	var What = CriteriaDetails[0].What
	var Criteria = CriteriaDetails[0].Criteria
	
	var Observation = $("#"+ID+"_ObservationId").val().trim();
	var CorrectiveAction = $("#"+ID+"_CorrectiveActionId").val().trim();
	var Severity = $("#"+ID+"_SeverityID").val();
	
	if(Observation == "")
	{
		alert("PLease Enter Observation Comments")
	}else if(CorrectiveAction == "")
	{
		alert("PLease Enter CorrectiveAction Comments")
	}else if(Severity == "Select")
	{
		alert("PLease Select Severity")
	}else
	{
	var objNonConfirmityDetails =new ObservationsListEntity();
		objNonConfirmityDetails.Observation=Observation;
		objNonConfirmityDetails.CorrectiveAction=CorrectiveAction;
		objNonConfirmityDetails.Severity = Severity;
		objNonConfirmityDetails.What=What
		objNonConfirmityDetails.Criteria=Criteria
		objNonConfirmityDetails.Status='Pending'
		//objNonConfirmityDetails.ObservedDate=ObservedDate
		objNonConfirmityDetails.ObservedBy=_spPageContextInfo.userId
		objNonConfirmityDetails.DepartmentId=DepartmentId
		objNonConfirmityDetails.CategoryId=CategoryId
		objNonConfirmityDetails.ObservedByRole=userRoleName
		
		CreateObservation(objNonConfirmityDetails,CreateObservationSuccess,CreateObservationFailure)
	}
}

function CreateObservationSuccess(data)
{
	
}
function CreateObservationFailure()
{
	
}


function ShowObservationTab(data)
{
//alert('okey')
	if($(data).is(":checked"))
	{
		$(data).parent('div').next('div').hide();
	}
	else
	{
		$(data).parent('div').next('div').show();	
	}
}


var offImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png'/>" 
var onImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png'/>"

var tempDepartmentHTML = '<div class="accordion" id="accordionExample___PlantDepartmentID__">'+
    '<div class="card">'+
        '<div class="card-header accordion-header" id="heading___PlantDepartmentID__">'+
            '<h2 class="mb-0 align-self-center minimum-height">'+
                '<div class="accordion-btn btn-link" type="button" data-toggle="collapse" data-target="#collapse___PlantDepartmentID__" aria-expanded="true" aria-controls="collapse___PlantDepartmentID__">'+
                    '<div class="media accordion-media">'+
                        '<div class="media-body align-self-center width-ninty" align="left">'+
                        '<h5 class="mt-0" >__DepartmentName__</h5>'+
                    '</div>'+
                        '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png" class="align-self-center navigate-large">'+
                        '<img src="img/minus-sign.png" class="align-self-center navigate-reduce">'+
                '</div>'+
            '</h2>'+
        '</div>'+
        '<div id="Plant_Dept___PlantDepartmentID__"></div>'+
        '<div id="collapse___PlantDepartmentID__" class="collapse" aria-labelledby="heading___PlantDepartmentID__" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;">'+
            '<div class="card-body">'+
                '<div class="accordion" id="accordionExample___PlantDepartmentID__">__CriticalCategory__</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

  
var tempCategoryHTML ='<div class="card">'+
    '<div class="card-header accordion-header" id="headingtwoerex">'+
        '<h2 class="mb-0 align-self-center minimum-height">'+
            '<div class="accordion-btn btn-link" type="button" data-toggle="collapse" data-target="#collapsetwoerex__CurrentNumber___PlantDepartmentID__" aria-expanded="true" aria-controls="collapsetwoerex">'+
                '<div class="media accordion-media">'+
                    '<div class="align-self-center mr-3"><span class="task-number">__no.__</span>'+
                    '</div>'+
                    '<div class="media-body align-self-center flex-media-none" align="left">'+
                        '<h5 class="mt-0" >__CriticalCategoryName__</h5>'+
                    '</div>'+
                    '<button type="button" class="btn  align-self-center check-visually-btn" >Check visually</button>'+
                '</div>'+
            '</div>'+
        '</h2>'+
    '</div>'+
    '<div id="collapsetwoerex__CurrentNumber___PlantDepartmentID__" class="collapse" aria-labelledby="headingtwoerex" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;">'+
        '<div class="card-body accordion-body-section">'+
            '<ul class="list-group list-group-flush">__SubCategory__</ul>'+
            '<div class="conform-section">'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

var tempCriteriaHtml ='<li class="list-group-item question"><label>__CriteriaName__</label>'+
//'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
'<div class="mid" align="right">'+
	    '<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Criteria" onclick=ShowObservationTab(this)>'+
'</div>'+
'<div class="conform-section" id="showFormId__PlantDepartmentID__" style="display:none;">'+
'<h5 class="mt-0 inner-heading" >Criteria Non Conformity</h5>'+
'<div class="row mgn-nill">'+
    '<div class="col-md-3 pdg-nill">'+
        '<div class="heading-tbl">Observation</div>'+
        '<div class="data-section"><textarea id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationId" rows="2">'+'</textarea>'+'</div>'+
    '</div>'+
    '<div class="col-md-3 pdg-nill">'+
        '<div class="heading-tbl">Corrective Action</div>'+
        '<div class="data-section"><textarea id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CorrectiveActionId" rows="2">'+'</textarea>'+'</div>'+
    '</div>'+
    '<div class="col-md-3 pdg-nill">'+
        '<div class="heading-tbl">Severity</div>'+
        '<div class="data-section">'+
            '<select class="form-control" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___SeverityID">'+
                '__Severity__'+
            '</select>'+
        '</div>'+
    '</div>'+ 
    '<div class="col-md-3 pdg-nill">'+
        '<div class="heading-tbl">Attachements</div>'+
            '<div class="data-section">'+
                '<div class="attachment">'+
                    '<div class="attachment-img"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png"><label>choose the file</label></div>'+
                    '<input type="file" class="form-control-file" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachID">'+
                    //'<input type="file" class="form-control-file" id="exampleFormControlFile1">'+
                    '<div id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachDisId"></div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
	'<div class="btn-section">'+
		//'<button type="button" class="btn ">cancel</button>'+
		'<button type="button" class="btn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___BtnId" onclick="SubmitCriteriaNonConfirmity(this)">Submit</button>'+
	'</div>'+
'</div>'+   
'</li>'



