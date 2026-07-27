var currentUser = _spPageContextInfo.userDisplayName;
var loginuserId =  _spPageContextInfo.userId;
var AttachmentId='';


function ObservationsTypeListEntity()
{
	this.TotalCriteria
	,this.ApprovedCriteria
	,this.RejectedCriteria
	,this.NACriteria
	,this.IsValidated
	,this.ValidationMsg
}


// To filter login Employee Only

var EmployeeListName = 'EmployeeList';

function EmployeeListEntity()

{
	 this.Id
	,this.Title
	,this.EmployeeName
	,this.DepartmentId
	,this.RoleId
	,this.RoleName
	,this.IsActive
	,this.RoleSequence
	,this.PlantId
	,this.PlantTitle

}

function getEmployeeDetails(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,RoleId/Id,RoleId/field_4,RoleId/field_1,IsActive,PlantId/Id,PlantId/Title";
	var filterQuery = "&$filter=IsActive eq 1 and EmployeeName/Id eq "+_spPageContextInfo.userId;
	var ExpandQuery = "&$expand=DepartmentId,RoleId,PlantId";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, EmployeeListName, tempQuery);
	getListItemByQuery(requestQuery, onFillEmployeeListName, Success, Failure);
}

function onFillEmployeeListName(data,Success,Failure)
{
		 if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collEmployee= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collEmployee[i] = FillEmployeeDetails(jsonObject.d.results[i]);
		}
		Success(collEmployee);
	}


}

function FillEmployeeDetails(result)
{
	 var objEmployeeDetails = new EmployeeListEntity();
	
	 objEmployeeDetails.Id=result.Id;
	
	 if(result.Title!=null)
	 {
    	objEmployeeDetails.Title= result.Title;
     }
	 else
	 {
		objEmployeeDetails.Title= '';
	 }
		 
	 if(result.DepartmentId.Id!=null)
	  {
    	objEmployeeDetails.DepartmentId= result.DepartmentId.Id;
      }
	else
	 {
		objEmployeeDetails.DepartmentId= '';
	 }
	 if(result.RoleId.Id!=null && result.RoleId.field_1!=undefined)
	 {
    	objEmployeeDetails.RoleId= result.RoleId.Id;
    	if(result.RoleId.field_1!=null && result.RoleId.field_1!=undefined)
    	{
        objEmployeeDetails.RoleName= result.RoleId.field_1;
        }
        else{
        objEmployeeDetails.RoleName= '';
        } 
        if(result.RoleId.field_4!=null && result.RoleId.field_4!=undefined)
    	{
        objEmployeeDetails.RoleSequence= result.RoleId.field_4;
        }
        else{
        objEmployeeDetails.RoleSequence= '';
        }    
        
     }
	else
	 {
        objEmployeeDetails.RoleSequence= '';
		objEmployeeDetails.RoleId= '';
        objEmployeeDetails.RoleName= '';
	 }
	 
	if(result.IsActive!=null)
	 {
    	objEmployeeDetails.IsActive= result.IsActive;
     }
	else
	 {
		objEmployeeDetails.IsActive= '';
	 }

	 if(result.PlantId.Id!=null && result.PlantId.Id!=undefined)
     {
     objEmployeeDetails.PlantId= result.PlantId.Id;
     
		 if(result.PlantId.Title!=null)
		  {
	    	objEmployeeDetails.PlantTitle= result.PlantId.Title;
	      }
	      else
	      {
	    	objEmployeeDetails.PlantTitle= '';
	      }
      }
	else
	 {
		objEmployeeDetails.PlantTitle= '';
       objEmployeeDetails.PlantId= '';
	 }
	return objEmployeeDetails;

}


// To get Title of the Department for login Employee
var DepartmentListName = 'DepartmentMaster';

function DepartmentListEntity()

{
	this.Id
    ,this.Title
    ,this.TourId
    ,this.ObservationId 

}
function getDepartments(SelectedFilter,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title";
	var filterQuery = SelectedFilter
    var tempQuery = SelectQuery+filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDepartmentDetails, Success, Failure);
}

function onFillDepartmentDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepartment = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDepartment[i] = FillDepartment(jsonObject.d.results[i]);
		}
		Success(collDepartment);
	}


}

function FillDepartment(result)
{
	  var objDepartment = new DepartmentListEntity();
	
	objDepartment.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objDepartment.Title= result.Title;
    }
	else
	{
		objDepartment.Title= '';
	}
	
	
    objDepartment.TourId=0;
    	
	return objDepartment;
}


// To get Title of the Area for login Employee
var AreaListName = 'AreaMaster';

function AreaListEntity()

{
	this.Id
    ,this.Title
    ,this.TourId
    ,this.DepartmentId
    ,this.Description 

}
function getAreas(SelectedFilter,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,Description";
	var filterQuery = SelectedFilter
	var ExpandQuery="&$expand=DepartmentId";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, AreaListName, tempQuery);
	getListItemByQuery(requestQuery, onFillAreaDetails, Success, Failure);
}

function onFillAreaDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collArea = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collArea[i] = FillArea(jsonObject.d.results[i]);
		}
		Success(collArea);
	}


}

function FillArea(result)
{
	  var objArea = new AreaListEntity();
	
	objArea.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objArea.Title= result.Title;
    }
	else
	{
		objArea.Title= '';
	}
    if(result.DepartmentId.Id!=null)
    {
        objArea.DepartmentId= result.DepartmentId.Id;
    }
    else
    {
        objArea.DepartmentId= '';
    }
	if(result.Description!=null)
	{
    	objArea.Description= result.Description;
    }
	else
	{
		objArea.Description= '';
	}  
	
    objArea.TourId=0;
    	
	return objArea;
}



// To get Category 

var CategoryListName = 'CategoryMaster';

function CategoryListEntity()

{
	this.Id
    ,this.Title
    ,this.DepartmentId
    ,this.AreaId
    ,this.AreaTitle

}
function getCategorys(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,AreaId/Id,AreaId/Title";
	//	var filterQuery = SelectedFilter
	var ExpandQuery="&$expand=DepartmentId,AreaId";
	var tempQuery = SelectQuery+ExpandQuery;
	//var tempQuery = SelectQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, CategoryListName, tempQuery);
	getListItemByQuery(requestQuery, onFillCategoryDetails, Success, Failure);
}

function onFillCategoryDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collCategory = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collCategory[i] = FillCategory(jsonObject.d.results[i]);
		}
		Success(collCategory);
	}


}

function FillCategory(result)
{
	  var objCategory = new CategoryListEntity();
	
	objCategory.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objCategory.Title= result.Title;
    }
	else
	{
		objCategory.Title= '';
	}
	if(result.AreaId.Id!=null)
	{
		objCategory.AreaId= result.AreaId.Id;
	}
	else
	{
		objCategory.AreaId= '';
	}
	if(result.AreaId.Title!=null)
	{
		objCategory.AreaTitle= result.AreaId.Title;
	}
	else
	{
		objCategory.AreaTitle= '';
	}
	if(result.DepartmentId.Id!=null)
	{
		objCategory.DepartmentId= result.DepartmentId.Id;
	}
	else
	{
		objCategory.DepartmentId= '';
	}
	
	return objCategory;
}

// To get Criteria

var CriteriaListName = 'CriteriaMaster';

function CriteriaListEntity()

{
	this.Id
    ,this.Title
    ,this.CategoryId
    ,this.DepartmentId
    ,this.Criteria
    ,this.What
    ,this.Where
    ,this.AreaId
    ,this.AreaTitle
    ,this.CategoryTitle
}
function getCriterias(RoleSequence,DepartmentId,Success,Failure)
{
  // var CurrentDay=moment().format('dddd');
   var SelectQuery = "?$select=Id,Title,Category/Id,Category/Title,DepartmentId/Id,Criteria,AreaId/Id,AreaId/Title,What";
	//var filterQuery = SelectedFilter
    var closureId = $('#hdnPlantId').val();
	var filterQuery ="&$filter=(IsActive eq 1) and (ScheduledDay eq 'Daily' or ScheduledDay eq '"+CurrentDay+"') and (PlantId/Id eq " + closureId + " and RoleId/field_4 eq '"+RoleSequence+"' and DepartmentId/Id eq '"+DepartmentId+"')" 
	var ExpandQuery="&$expand=Category,DepartmentId,AreaId";
    var TopQuery= "&$top=2000";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery+TopQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, CriteriaListName, tempQuery);
	getListItemByQuery(requestQuery, onFillCriteriaDetails, Success, Failure);
}

function onFillCriteriaDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collCriteria = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collCriteria[i] = FillCriteria(jsonObject.d.results[i]);
		}
		Success(collCriteria);
	}


}

function FillCriteria(result)
{
	  var objCriteria = new CriteriaListEntity();
	
	objCriteria.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objCriteria.Title= result.Title;
    }
	else
	{
		objCriteria.Title= '';
	}
	if(result.AreaId.Id!=null)
	{
		objCriteria.AreaId= result.AreaId.Id;
	}
	else
	{
		objCriteria.AreaId= '';
	}
	if(result.AreaId.Title!=null)
	{
		objCriteria.AreaTitle= result.AreaId.Title;
	}
	else
	{
		objCriteria.AreaTitle= '';
	}
	
	if(result.DepartmentId.Id!=null)
	{
		objCriteria.DepartmentId= result.DepartmentId.Id;
	}
	else
	{
		objCriteria.DepartmentId= '';
	}
	if(result.Category.Id!=null)
	{
		objCriteria.CategoryId= result.Category.Id;
		if(result.Category.Title!=null)
		{
		objCriteria.CategoryTitle=result.Category.Title;
		}
		else{
		objCriteria.CategoryTitle='';
		}
	}
	else
	{
		objCriteria.CategoryId= '';
		objCriteria.CategoryTitle='';
	}
	if(result.Criteria!=null)
	{
		objCriteria.Criteria= result.Criteria;
	}
	else
	{
		objCriteria.Criteria= '';
	}	
	if(result.What!=null)
	{
		objCriteria.What= result.What;
	}
	else
	{
		objCriteria.What= '';
	}	
	
	return objCriteria;
}


// To get Severity 

var SeverityListName = 'SeverityMaster';

function SeverityListEntity()
{
	this.Id
	,this.Title
	,this.PlantId
	,this.Sequence
}

function getSeverity(Success,Failure)
{
	SelectQuery = "?$select=Id,Title,PlantId/Id,Sequence";
   	var filterQuery= "&$filter=IsActive eq 1";
    var expandQuery = "&$expand=PlantId";
    var tempQuery = SelectQuery + expandQuery+filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl,SeverityListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetSeverity, Success, Failure);

}

function onFillGetSeverity(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collSeverity= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collSeverity[i] = FillGetSeverity(jsonObject.d.results[i]);
		}
		Success(collSeverity);
	}

}

function FillGetSeverity(result)
{
	var objSeverity = new SeverityListEntity();
	objSeverity.Id  = result.Id;	
	if (result.Title != null) 
	{
	    objSeverity.Title = result.Title
	} 
	else 
	{
	    objSeverity.Title = '';
	}
	if (result.PlantId.Id!= null) 
	{
	    objSeverity.PlantIdId= result.PlantId.Id
	} 
	else 
	{
	    objSeverity.PlantIdId= '';
	}
	if (result.Sequence!= null) 
	{
	    objSeverity.Sequence= result.Sequence
	} 
	else 
	{
	    objSeverity.Sequence= '';
	}


		return objSeverity;
}

//To get Observation


var ObservationsListName='Observations';

function ObservationsListEntity()
{
	this.Id
	,this.Title
	,this.DepartmentId
	,this.CategoryId
	,this.What
	,this.Where
	,this.Observation
	,this.CorrectiveAction
	,this.SeverityId
	,this.SeveritySequence
	,this.ObservedBy
	,this.ObservedByRole
	,this.ObservedDate
	,this.Status
	,this.Criteria
	,this.CriteriaId
	,this.PlantId
	,this.DepartmentTourId
	,this.AreaId
	,this.TourDate
	,this.Attachment
	,this.Action
}


//Get Observation

function GetObservationForBind(DTourId,Success,Failure)
{
	var DeptTourId=DTourId;
	SelectQuery = "?$select=Id,Action,Title,Observation,CorrectiveAction,SeverityId/Id,SeverityId/Sequence,AreaId/Id,CategoryId/Id,CriteriaId/Id,Attachments";
   	var filterQuery= "&$filter=DepartmentTourId/Id eq "+DeptTourId;
    var expandQuery = "&$expand=SeverityId,AreaId,CategoryId,CriteriaId";
    var tempQuery = SelectQuery + expandQuery +filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl,ObservationsListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetObservationForBind, Success, Failure);

}

function onFillGetObservationForBind(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var ObservationForBind= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	ObservationForBind[i] = FillGetObservationForBind(jsonObject.d.results[i]);
		}
		Success(ObservationForBind);
	}

}

function FillGetObservationForBind(result)
{
	var objObservationsEntity = new ObservationsListEntity();
	objObservationsEntity .Id  = result.Id;	
	if (result.Title != null) 
	{
	    objObservationsEntity .Title = result.Title
	} 
	else 
	{
	    objObservationsEntity .Title = '';
	}
	
	if (result.Action!= null) 
	{
	    objObservationsEntity.Action= result.Action
	} 
	else 
	{
	    objObservationsEntity.Action= '';
	}
	if (result.Observation!= null) 
	{
	    objObservationsEntity.Observation= result.Observation
	} 
	else 
	{
	    objObservationsEntity.Observation= '';
	}

if (result.CorrectiveAction!= null) 
	{
	    objObservationsEntity .CorrectiveAction= result.CorrectiveAction
	} 
	else 
	{
	    objObservationsEntity .CorrectiveAction= '';
	}
	if (result.SeverityId!= null) 
	{
	//SeveritySequence
		objObservationsEntity.SeverityId= result.SeverityId.Id;
	    if (result.SeverityId.Sequence!= null) 
		{
		//SeveritySequence
		    objObservationsEntity.SeveritySequence= result.SeverityId.Sequence
		} 
		else 
		{
		    objObservationsEntity.SeveritySequence= '';
		}
	} 
	else 
	{
	    objObservationsEntity.SeverityId= '';
	    objObservationsEntity.SeveritySequence= '';
	}
if (result.AreaId!= null) 
	{
	    objObservationsEntity .AreaId= result.AreaId.Id
	} 
	else 
	{
	    objObservationsEntity .AreaId= '';
	}
if (result.CategoryId!= null) 
	{
	    objObservationsEntity .CategoryId= result.CategoryId.Id
	} 
	else 
	{
	    objObservationsEntity .CategoryId= '';
	}
if (result.CriteriaId!= null) 
	{
	    objObservationsEntity .CriteriaId= result.CriteriaId.Id
	} 
	else 
	{
	    objObservationsEntity .CriteriaId= '';
	}
	
	if (result.Attachments!= null) 
	{
	    objObservationsEntity.Attachment= result.Attachments
	} 
	else 
	{
	    objObservationsEntity.Attachment= '';
	}

		return objObservationsEntity ;
		
		
}

//count of observation

function GetObservationForCount(DTourId,Success,Failure)
{
	var DeptTourId=DTourId;
	SelectQuery = "?$select=Id,Action,Title,Observation,CorrectiveAction,SeverityId/Id,AreaId/Id,CategoryId/Id,CriteriaId/Id,Attachments";
   	var filterQuery= "&$filter=Action eq 'Rejected' and DepartmentTourId/Id eq "+DeptTourId;
    var expandQuery = "&$expand=SeverityId,AreaId,CategoryId,CriteriaId";
    var tempQuery = SelectQuery + expandQuery +filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl,ObservationsListName, tempQuery);
	getListItemByQuery(requestQuery, OnFillGetObservationForCount, Success, Failure);

}

function OnFillGetObservationForCount(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var ObservationForCount= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	ObservationForCount[i] = FillGetObservationForCount(jsonObject.d.results[i]);
		}
		Success(ObservationForCount);
	}

}

function FillGetObservationForCount(result)
{
	var objObservationsCountEntity = new ObservationsListEntity();
	objObservationsCountEntity.Id  = result.Id;	
	if (result.Title != null) 
	{
	    objObservationsCountEntity.Title = result.Title
	} 
	else 
	{
	    objObservationsCountEntity.Title = '';
	}
	
	

		return objObservationsCountEntity;
		
		
}






// TO Create Observation
function CreateObservation(objNonConfirmityDetails,elementId,Success,Failure) 
{
  
    var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': objNonConfirmityDetails.Title
		,'Observation': objNonConfirmityDetails.Observation
		//,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
		,'SeverityIdId': objNonConfirmityDetails.Severity
		,'What': objNonConfirmityDetails.What
		,'Where': objNonConfirmityDetails.Where
		//,'severity': objNonConfirmityDetails.Severity
		,'ObservedById': objNonConfirmityDetails.ObservedBy
		,'DepartmentIdId': objNonConfirmityDetails.DepartmentId
		,'DepartmentTourIdId': objNonConfirmityDetails.DepartmentTourId
		,'AreaIdId': objNonConfirmityDetails.AreaId
		,'CriteriaIdId': objNonConfirmityDetails.CriteriaId
		,'PlantIdId':objNonConfirmityDetails.PlantId
		,'CategoryIdId': objNonConfirmityDetails.CategoryId
		,'Criteria': objNonConfirmityDetails.Criteria
		,'Status': objNonConfirmityDetails.Status
		,'Action': objNonConfirmityDetails.Action
		,'ObservedByRoleId': objNonConfirmityDetails.ObservedByRole
		,'TourDate':objNonConfirmityDetails.TourDate
		,'ObservedDate':objNonConfirmityDetails.ObservedDate	
		};
 	 createListItemwithdata(ObservationsListName, WebAbsoluteUrl, item,elementId, Success, Failure)
}

//Update Observation 
function UpdateObservationForAttachment(ItemId,ID,objNonConfirmityDetails,Success,Failure)
{
var itemId=ItemId;
  var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
      //  ,'Title': 'New Observation-'+moment().format('DD-MM-YYYY HH:mm:ss')
		,'Observation': objNonConfirmityDetails.Observation
		//,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
		,'SeverityIdId': objNonConfirmityDetails.Severity
		,'What': objNonConfirmityDetails.What
		,'Where': objNonConfirmityDetails.Where
		//,'severity': objNonConfirmityDetails.Severity
		,'ObservedById': objNonConfirmityDetails.ObservedBy
		,'DepartmentIdId': objNonConfirmityDetails.DepartmentId
		,'DepartmentTourIdId': objNonConfirmityDetails.DepartmentTourId
		,'AreaIdId': objNonConfirmityDetails.AreaId
		,'CriteriaIdId': objNonConfirmityDetails.CriteriaId
		,'PlantIdId':objNonConfirmityDetails.PlantId
		,'CategoryIdId': objNonConfirmityDetails.CategoryId
		,'Criteria': objNonConfirmityDetails.Criteria
		,'Status': objNonConfirmityDetails.Status
		,'Action': objNonConfirmityDetails.Action
		,'ObservedByRoleId': objNonConfirmityDetails.ObservedByRole
		,'TourDate':objNonConfirmityDetails.TourDate
		,'ObservedDate':objNonConfirmityDetails.ObservedDate
		};
 	 //updateListItemSync(itemId,ObservationsListName,WebAbsoluteUrl,item,Success,Failure);
 	 updateListItemwithData(itemId,ID, ObservationsListName, WebAbsoluteUrl, item, Success, Failure);

}

/*Save Observation for Attachment*/
function SaveObservationFormAttachment(Success, Failure) {
  
    var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': $('#hdnRoleName').val()+'_'+moment().format('MM-DD-YYYY')
        ,'Status':'Saved'
                  
        
	};
 	 createListItem(ObservationsListName, WebAbsoluteUrl, item, Success, Failure);
}

function ObservationAttachmentsListEntity() 
{
	this.Filename
	,this.Fileurl
	,this.Id
}

function GetObservationAttachments(listitemid,Success,Failure)
{
     //$('#hdnObservationId').val(listitemid);
	var requestQuery = 	WebAbsoluteUrl+"/_api/lists/getByTitle('"+ObservationsListName+"')/items("+listitemid+")?$select=ID,AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName&$expand=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName";
	getListItemByQuerysync(requestQuery, onFillGetObservationAttachments, Success, Failure);

}

function onFillGetObservationAttachments(data,Success,Failure)
{

		if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGetAttachments= new Array();
		for (var i = 0; i < jsonObject.d.AttachmentFiles.results.length; i++) {
        	collGetAttachments[i] = FillGetObservationAttachments(jsonObject.d.AttachmentFiles.results[i],jsonObject.d.Id);
        	
        	
		}
		Success(collGetAttachments);
	}

}
function FillGetObservationAttachments(result,Id)
{
	var objGetObservationAttachments = new ObservationAttachmentsListEntity();
	objGetObservationAttachments.Filename  = result.FileName;
	objGetObservationAttachments.Id = Id;
	objGetObservationAttachments.Fileurl  = window.location.origin+result.ServerRelativeUrl;
	return objGetObservationAttachments;
}


function DeleteRequestAttachment(Filename,ItemId ,Success,Failure)
{
	var ItemId =ItemId ;
	var RestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + ObservationsListName+ "')/GetItemById(" + ItemId + ")/AttachmentFiles/getByFileName('" + Filename+ "')  ";
	deleteListItemAttachment(RestUri ,Success, Failure);
}



//Update department Tour.
var DepartmentTourListName = 'DepartmentTour';

function DTourListEntity()

{
		this.Id
		,this.Title
		,this.FinalComment	
		,this.DepartmentId
		,this.TourStartDate
		,this.TourCompletionDate	
		,this.TotalCriterias
		,this.TotalObservations	
		,this.TourScore
		,this.TourBy	
		,this.Status
		,this.PlantId
		,this.RoleId	
		,this.Status
		,this.TotalNACriterias	
		,this.TotalCompliances	

}
function UpdateDTourItem(ItemId,DepartmentTourListEntity,Success,Failure)
{
var ItemId=ItemId;
var tourScore=DepartmentTourListEntity.TourScore;
     var itemType = GetItemTypeForListName(DepartmentTourListName );
	var item = {
        '__metadata': { 'type': itemType }
        ,'FinalComment': DepartmentTourListEntity.FinalComment
		,'TourCompletionDate': DepartmentTourListEntity.TourCompletionDate
      	,'TotalCriterias': DepartmentTourListEntity.TotalCriterias
      	,'TotalCompliances': DepartmentTourListEntity.TotalCompliances
      	,'TotalNACriterias': DepartmentTourListEntity.TotalNACriterias
		,'TotalObservations': DepartmentTourListEntity.TotalObservations
		,'TourScore': DepartmentTourListEntity.TourScore
		,'Status': DepartmentTourListEntity.Status
	};
 	 //updateListItemSync(ItemId,DepartmentTourListName,WebAbsoluteUrl,item,Success,Failure);
 	 updateListItemwithData(ItemId,tourScore, DepartmentTourListName, WebAbsoluteUrl, item, Success, Failure)

}

function SaveDTourItem(Item,Success, Failure) {
  
    var itemType = GetItemTypeForListName(DepartmentTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title': 'New Department Tour-'+moment().format('DD-MM-YYYY HH:mm:ss')
			,'DepartmentIdId':Item.DepartmentId
			,'StartedOn':Item.TourStartDate
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
                  
        
	};
 	 createListItem(DepartmentTourListName, WebAbsoluteUrl, item, Success, Failure);
}

/*function GetDTourItem(DepartmentTourId,RoleId,Success,Failure)
{
	var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
	var DepartmentId=$('#hdnDepartmentId').val();
	
	var SelectQuery = "?$select=Id,Title,RoleId/Id,TourBy/Id,TourStartDate,TourCompletionDate,Status,FinalComment";
	var ExpandQuery="&$expand=RoleId/Id,TourBy/Id";
	//var filterQuery = "&$filter= ID eq "+DepartmentTourId+" and RoleId/field_4 eq "+RoleId+" and DepartmentId/ID eq "+DepartmentId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and StartedOn ge datetime'" +currentDate+ "' and StartedOn le datetime'" +nextDate+ "'" ;
	var filterQuery = "&$filter= ID eq "+DepartmentTourId+" and RoleId/field_4 eq "+RoleId+" and DepartmentId/ID eq "+DepartmentId+" and PlantId/Id eq "+$('#hdnPlantId').val() ;

	//var filterQuery = "&$filter=StartedOn ge datetime'" +currentDate+ "' and StartedOn le datetime'" +nextDate+ "'"
	var tempQuery = SelectQuery+ExpandQuery+filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDTourDetails, Success, Failure);
}*/

function onFillDTourDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDTour= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDTour[i] = FillDTourDetails(jsonObject.d.results[i]);
		}
		Success(collDTour);
	}


}

function FillDTourDetails(result)
{
	  var objDepartmentTourListEntity = new DTourListEntity();
	
	objDepartmentTourListEntity.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objDepartmentTourListEntity.Title= result.Title;
    }
	else
	{
		objDepartmentTourListEntity.Title= '';
	}
	if(result.Status!=null)
	{
    	objDepartmentTourListEntity.Status= result.Status;
    }
	else
	{
		objDepartmentTourListEntity.Status= '';
	}

	
	
	if(result.TourStartDate!=null)
	{
    	objDepartmentTourListEntity.TourStartDate= result.TourStartDate;
    }
	else
	{
		objDepartmentTourListEntity.TourStartDate= '';
	}
	
	if(result.TourCompletionDate!=null)
	{
    	objDepartmentTourListEntity.TourCompletionDate= result.TourCompletionDate;
    }
	else
	{
		objDepartmentTourListEntity.TourCompletionDate= '';
	}
  if(result.FinalComment!=null)
	{
    	objDepartmentTourListEntity.FinalComment= result.FinalComment;
    }
	else
	{
		objDepartmentTourListEntity.FinalComment= '';
	}

	return objDepartmentTourListEntity ;
}

/*Delete Observation Item */
function DeleteListitem(ItemId, Success, Failure) {
    deleteListItem(ItemId, ObservationsListName, WebAbsoluteUrl, Success, Failure)
}
/*Delete Observation Item */
var QualityPlantTourListName = 'cr3ea_alc';
function SaveQualityPlantTourItem(Item,Success, Failure) {
  
  console.log(item,'itemss');
    var itemType = GetItemTypeForListName(QualityPlantTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title': 'New Quality Tour-'+moment().format('DD-MM-YYYY HH:mm:ss')
			,'DepartmentIdId':Item.Id
			,'StartedOn':Item.StartedOn
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
			,'ShiftId':item.ShiftDropdown                
  
	};
 	 createListItem(QualityPlantTourListName, WebAbsoluteUrl, item, Success, Failure);
}