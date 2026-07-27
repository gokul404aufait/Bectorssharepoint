
$(document).ready(function(){
	
	var CurrentUserId = _spPageContextInfo.userId;
	GetCriteria(GetCriteriaSuccess,GetCriteriaFailure);
	GetSeverity(SeveritySuccess,SeverityFailure);
	

});
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
                        '<div id="infoToggler" class="infoToggler"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png" class="align-self-center navigate-large">'+
                        '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/minus-sign.png" class="align-self-center navigate-reduce"></div>'+
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

  
var tempCriticalCategoryHTML ='<div class="card">'+
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
    
    
/*var tempSubCategoryHTML = '<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
//'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
    '<div class="mid" align="right">'+
        '<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" >'+
    '</div>'+
    '<div class="toggle-group">'+
        '<label class="btn btn-primary toggle-on">'+
            '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png"/>'+   
        '</label>'+
        '<label class="btn btn-default active toggle-off">'+
            '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png"/>'+
        '</label>'+
        '<span class="toggle-handle btn btn-default"></span>'+
    '</div>'+
'</li>'*/


function SeveritySuccess(collSeverity)
	{
		for(var i=0;i<collSeverity.length;i++)
		{
			SeverityArray.push(collSeverity[i])
		}
		//GetObservationReportData(ObservationReportSuccess,ObservationReportFailure);
	}

function SeverityFailure()
{}

function PlantTourDepartmentSuccess(collDepartmentMaster)
{			

	if(collDepartmentMaster.length>0)
	{
		var departHTML = '';	
		for(i=0;i<collDepartmentMaster.length-1;i++)
		{
			var CriticalCategoryTemp = '';
			
			var newDept=tempDepartmentHTML;
			
			//newDept=newDept.replace('/__DepartmentName__/g',collDepartmentMaster[i].Title);
			
			//newDept=newDept.replace('__Severity__',collSeverity[i].Title);
			
			
			
			for(j=0;j<CriticalCatArray.length-3;j++)
			{
			
			
				var	CriticalCategoryTempHtml = tempCriticalCategoryHTML;
					CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__CriticalCategoryName__/g,CriticalCatArray[j].CategoryTitle)
					CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__CurrentNumber__/g,j)
					//CriticalCategoryTemp=CriticalCategoryTemp.replace(/__CurrentNumber__/g,j)
					CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__no.__/g,j+1)
					
				
				
					var tempCriteria ='';
					var tempNonConfirmityHTML = '';
					//var tempSeverity = '';
					for(k=0;k<CriteriaArray.length-3;k++)
				
					{
							//tempCriteria1 = tempSubCategoryHTML;
							tempCriteria +='<li class="list-group-item question"><label>__CriteriaID__</label>'+
							//'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
							    '<div class="mid" align="right">'+
									    '<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Criteria"'+k+' onclick=ShowObservationTab(this)>'+
								'</div>'+
							'<div class="conform-section" id="showFormId__PlantDepartmentID__" style="display:none;">'+
							    '<h5 class="mt-0 inner-heading" >Criteria Non Conformity</h5>'+
							    '<div class="row mgn-nill">'+
							        '<div class="col-md-3 pdg-nill">'+
							            '<div class="heading-tbl">Observation</div>'+
							            '<div class="data-section"><textarea id="observationId___PlantDepartmentID_____CategoryID_____CriteriaID__" rows="2">'+'</textarea>'+'</div>'+
							        '</div>'+
							        '<div class="col-md-3 pdg-nill">'+
							            '<div class="heading-tbl">Corrective Action</div>'+
							            '<div class="data-section"><textarea id="correctiveActionId___PlantDepartmentID_____CategoryID_____CriteriaID__" rows="2">'+'</textarea>'+'</div>'+
							        '</div>'+
							        '<div class="col-md-3 pdg-nill">'+
							            '<div class="heading-tbl">Severity</div>'+
							            '<div class="data-section">'+
							                '<select class="form-control" id="CriteriaSeverity___PlantDepartmentID_____CategoryID_____CriteriaID__">'+
							                    '<option>__Severity__</option>'+
							                '</select>'+
							            '</div>'+
							        '</div>'+ 
							        '<div class="col-md-3 pdg-nill">'+
							            '<div class="heading-tbl">Attachements</div>'+
							                '<div class="data-section">'+
							                    '<div class="attachment">'+
							                        '<div class="attachment-img"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png"><label>choose the file</label></div>'+
							                        //'<input type="file" class="form-control-file" id="exampleFormControlFile1___PlantDepartmentID_____CategoryID_____CriteriaID__">'+
							                        '<input type="file" class="form-control-file" id="exampleFormControlFile1">'+
							                        '<div id="ObservationFormId"></div>'+
							                    '</div>'+
							                '</div>'+
							            '</div>'+
							        '</div>'+
									'<div class="btn-section">'+
										//'<button type="button" class="btn ">cancel</button>'+
										'<button type="button" class="btn" onclick="UpdateNonConfirmity(this)">Submit</button>'+
									'</div>'+
							    '</div>'+   
							'</li>'

						
							
						var tempSeverity = '';
						for(l=0;l<SeverityArray.length;l++)
						{
						tempSeverity +='<option value='+SeverityArray[l].Id+'>'+SeverityArray[l].Title+'</option>';
						
						}
								
							
								
						CriticalCategoryTemp=CriticalCategoryTemp.replace(/__Severity__/g,tempSeverity)
						CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__CriteriaID__/g,k)
					}
				CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__CurrentNumber__/g,j)
				
				CriticalCategoryTempHtml=CriticalCategoryTempHtml.replace(/__SubCategory__/g,tempCriteria);
				
				CriticalCategoryTemp += CriticalCategoryTempHtml
			
			}
			newDept=newDept.replace(/__CriticalCategory__/g,CriticalCategoryTemp)
			newDept=newDept.replace(/__DepartmentName__/g,collDepartmentMaster[i].Title)
			newDept=newDept.replace(/__PlantDepartmentID__/g,collDepartmentMaster[i].Id);
			departHTML+=newDept;
			
		}
	
	}
	$('#DepartmId').append(departHTML);
	initObservationAttachment();	
}

function PlantTourDepartmentFailure()
{

}


function CriteriaForPlantTourSuccess(collCriteriaa)
{	
	for(var i=0;i<collCriteriaa.length;i++)
	{
		CriteriaArray.push(collCriteriaa[i]);
		//GetPlantTourDepartment(PlantTourDepartmentSuccess,PlantTourDepartmentFailure);
	}
	GetPlantTourDepartment(PlantTourDepartmentSuccess,PlantTourDepartmentFailure);

}	
function CriteriaForPlantTourFailure()
{}
function GetCriteriaSuccess(collEmployeeMaster)
{
	//alert('okey');
	var tempDepartmentHTML = '';
	var tempCriticalHTML = '';
	if(collEmployeeMaster.length>0)
	{
		var CriticalHTML = '';
		
		for(var i=0; i<collEmployeeMaster.length;i++)
		{	
			no=i;
			no++;
			var objCriteria = new Object();
			objCriteria['CategoryTitle']= collEmployeeMaster[i].CategoryTitle
			objCriteria['CategoryId']= collEmployeeMaster[i].Id
			
			CriticalCatArray.push(objCriteria);
	 	}
	 	
	}
	//$('#DepartmId').empty().append(tempDepartmentHTML);
	//$('#DepartmId').append(tempCriticalHTML);
	//$('#criteriaId').append(tempCriteriaHTML);
	GetCriteriaForPlantTour(1,CriteriaForPlantTourSuccess,CriteriaForPlantTourFailure);
	
}

	function GetCriteriaFailure()
{

}


function UpdateNonConfirmity(itemId){

	
	var Observation =$('#observationId_1___CategoryID_____CriteriaID__').val();
	var CorrectiveAction =$('#correctiveActionId_1___CategoryID_____CriteriaID__').val();
	var severity = $('#CriteriaSeverity_1___CategoryID_____CriteriaID__').val();
	
	if(Observation=="" || Observation==null)
	{
		alert('Please enter Observation Details')
	}
	else if(CorrectiveAction=="" || CorrectiveAction==null)
		{
			alert('Please enter Currective Action')
		}
	

	else 
	{

	var objNonConfirmityDetails =new ObservationReportListEntity();
		objNonConfirmityDetails.Observation=Observation;
		objNonConfirmityDetails.CorrectiveAction=CorrectiveAction;
		objNonConfirmityDetails.Severity = severity;
		UpdateNonConfirmityDetails(itemId,objNonConfirmityDetails, UpdateNonConfirmityDetailsSuccess, UpdateNonConfirmityDetailsFailure);
	}
}






function UpdateNonConfirmityDetailsSuccess(data)
{

		//alert('Observation Closed');
		
		GetObservationReportData(0,ObservationReportSuccess,ObservationReportFailure);
}

function UpdateNonConfirmityDetailsFailure()
{
	alert('Something went wrong');
}



function ObservationReportSuccess(collObservationReport)
	{
	
	}

function ObservationReportFailure()
	{
	}

function showForm()
	{
		$('#showFormId').show();	
	}
function hideForm()
	{
		$('#showFormId')
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
