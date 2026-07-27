var currentUser = _spPageContextInfo.userDisplayName;
var loginuserId =  _spPageContextInfo.userId;
var AttachmentId='';

// To filter login Employee Only

function ObservationsTypeListEntity()
{
	this.TotalCriteria
	,this.ApprovedCriteria
	,this.RejectedCriteria
	,this.NACriteria
	,this.IsValidated
	,this.ValidationMsg
}

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
function getCategorys(SelectedFilter,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,AreaId/Id,AreaId/Title";
	var filterQuery = SelectedFilter
	var ExpandQuery="&$expand=DepartmentId,AreaId";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
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

function CriteriaListPMEntity()

{
	this.Id
    ,this.Title
    ,this.CategoryId
    ,this.CategoryTitle
    ,this.DepartmentId
    ,this.DepartmentTitle
    ,this.Criteria
    ,this.What
    ,this.Where
    ,this.AreaId
    ,this.AreaTitle

   
}
function getCriteriasPM(CurrentDay,RoleSequence,Success,Failure)
{
	//var CurrentDay=moment().format('dddd');

	var SelectQuery = "?$select=Id,Title,AreaId/Id,AreaId/Title,Category/Id,Category/Title,DepartmentId/Id,DepartmentId/Title,Criteria,PlantId/Id,RoleId/field_4,What";
	//var filterQuery = SelectedFilter
	var closureId = $('#hdnPlantId').val();  // Get the value of hdnClosureID
    var filterQuery = "&$filter=(IsActive eq 1) and (ScheduledDay eq 'Daily' or ScheduledDay eq '" + CurrentDay + "') and (PlantId/Id eq " + closureId + " and RoleId/field_4 eq '" + RoleSequence + "')";
 
	var ExpandQuery="&$expand=Category,PlantId,DepartmentId,RoleId,AreaId";

    var TopQuery= "&$top=2000";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery+TopQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, CriteriaListName, tempQuery);
	getListItemByQuery(requestQuery, onFillPMCriteriaDetails, Success, Failure);
}

function onFillPMCriteriaDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPMCriteria = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPMCriteria [i] = FillPMCriteriaDetails(jsonObject.d.results[i]);
		}
		Success(collPMCriteria );
	}


}

function FillPMCriteriaDetails(result)
{
	  var objCriteria = new CriteriaListPMEntity();
	
	objCriteria.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objCriteria.Title= result.Title;
    }
	else
	{
		objCriteria.Title= '';
	}
		
	if(result.DepartmentId.Id!=null)
	{
		objCriteria.DepartmentId= result.DepartmentId.Id;
	}
	else
	{
		objCriteria.DepartmentId= '';
	}
	if(result.DepartmentId.Title!=null)
	{
		objCriteria.DepartmentTitle= result.DepartmentId.Title;
	}
	else
	{
		objCriteria.DepartmentTitle= '';
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



	if(result.Category.Id!=null)
	{
		objCriteria.CategoryId= result.Category.Id;
	}
	else
	{
		objCriteria.CategoryId= '';
	}
	if(result.Category.Title!=null)
	{
		objCriteria.CategoryTitle= result.Category.Title;
	}
	else
	{
		objCriteria.CategoryTitle= '';
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

function PObservationsListEntity()
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
	,this.ObservedBy
	,this.ObservedByRole
	,this.ObservedDate
	,this.Status
	,this.Criteria
	,this.CriteriaId
	,this.PlantId
	,this.DepartmentTourId
	,this.DepartmentId
	,this.AreaId
	,this.TourDate
	,this.Attachment
	,this.PlantTourId
	,this.SeveritySequence
	,this.Action
	
	}


//Get Observation

function GetObservationForBind(PTourId,Success,Failure)
{	
	var PlantTourId=PTourId;
	SelectQuery = "?$select=Id,Action,Title,Observation,CorrectiveAction,DepartmentId/Id,SeverityId/Id,SeverityId/Sequence,CategoryId/Id,CriteriaId/Id,Attachments";
   	var filterQuery= "&$filter=PlantTourId/Id eq "+PlantTourId;
    var expandQuery = "&$expand=SeverityId,CategoryId,CriteriaId,DepartmentId";
    var tempQuery = SelectQuery + expandQuery+filterQuery ;
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
        	ObservationForBind[i] = FillGetPObservationForBind(jsonObject.d.results[i]);
		}
		Success(ObservationForBind);
	}

}

function FillGetPObservationForBind(result)
{
	var objObservationsEntity = new PObservationsListEntity();
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
if (result.DepartmentId!= null) 
	{
	    objObservationsEntity .DepartmentId= result.DepartmentId.Id
	} 
	else 
	{
	    objObservationsEntity .DepartmentId= '';
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


// TO Create Observation
function CreateObservation(objNonConfirmityDetails,elementId,Success,Failure) 
{
  
    var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': objNonConfirmityDetails.Title
		,'Observation': objNonConfirmityDetails.Observation
		,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
		,'SeverityIdId': objNonConfirmityDetails.Severity
		,'ObservedById': objNonConfirmityDetails.ObservedBy
		,'DepartmentIdId': objNonConfirmityDetails.DepartmentId
		,'PlantTourIdId': objNonConfirmityDetails.PlantTourId
		,'CriteriaIdId': objNonConfirmityDetails.CriteriaId
		,'PlantIdId':objNonConfirmityDetails.PlantId
		,'CategoryIdId': objNonConfirmityDetails.CategoryId
		,'Criteria': objNonConfirmityDetails.Criteria
		,'What': objNonConfirmityDetails.What
		,'Where': objNonConfirmityDetails.Where
		,'Status': objNonConfirmityDetails.Status
		,'Action': objNonConfirmityDetails.Action
		,'ObservedByRoleId': objNonConfirmityDetails.UserRoleId
		,'TourDate':objNonConfirmityDetails.TourDate
		,'ObservedDate':objNonConfirmityDetails.ObservedDate	
		};
 	 createListItemwithdata(ObservationsListName, WebAbsoluteUrl, item,elementId, Success, Failure);
}

//Update Observation 
function UpdateObservationForAttachment(ItemId,objNonConfirmityDetails,Success,Failure)
{
var itemId=ItemId;
  var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
      //  ,'Title': 'New Observation-'+moment().format('DD-MM-YYYY HH:mm:ss')
		,'Observation': objNonConfirmityDetails.Observation
		,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
		,'SeverityIdId': objNonConfirmityDetails.Severity
		,'What': objNonConfirmityDetails.What
		,'Where': objNonConfirmityDetails.Where
		//,'severity': objNonConfirmityDetails.Severity
		,'PlantTourIdId': objNonConfirmityDetails.PlantTourId
		,'ObservedById': objNonConfirmityDetails.ObservedBy
		,'DepartmentIdId': objNonConfirmityDetails.DepartmentId
		,'CriteriaIdId': objNonConfirmityDetails.CriteriaId
		,'PlantIdId':objNonConfirmityDetails.PlantId
		,'CategoryIdId': objNonConfirmityDetails.CategoryId
		,'Criteria': objNonConfirmityDetails.Criteria
		,'Status': objNonConfirmityDetails.Status
		,'ObservedByRoleId': objNonConfirmityDetails.UserRoleId
		,'TourDate':objNonConfirmityDetails.TourDate
		,'ObservedDate':objNonConfirmityDetails.ObservedDate
		,'Action': objNonConfirmityDetails.Action
		};
 	 updateListItem(itemId,ObservationsListName,WebAbsoluteUrl,item,Success,Failure);

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
		,this.DepartmentTitle
		,this.PlantTour

}
function UpdateDTourItem(ItemId,DepartmentTourListEntity,Success,Failure)
{
var ItemId=ItemId;
     var itemType = GetItemTypeForListName(DepartmentTourListName );
	var item = {
        '__metadata': { 'type': itemType }
	    //,'FinalComment': DepartmentTourListEntity.FinalComment
		,'TourCompletionDate': DepartmentTourListEntity.TourCompletionDate
      	,'TotalCriterias': DepartmentTourListEntity.TotalCriterias
      	,'TotalCompliances': DepartmentTourListEntity.TotalCompliances
      	,'TotalNACriterias': DepartmentTourListEntity.TotalNACriterias
		,'TotalObservations': DepartmentTourListEntity.TotalObservations
		,'TourScore': DepartmentTourListEntity.TourScore
		,'Status': 'Completed'
	};
	//updateListItemSync(ItemId,DepartmentTourListName,WebAbsoluteUrl,item,Success,Failure);
	updateListItem(ItemId,DepartmentTourListName,WebAbsoluteUrl,item,Success,Failure);
}

function SaveDTourItem(Item,Success, Failure) {
  
    var itemType = GetItemTypeForListName(DepartmentTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title':Item.Title
			,'DepartmentIdId':Item.DepartmentId
			,'TourStartDate':Item.TourStartDate
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
			,'TourCompletionDate': Item.TourCompletionDate
			,'TotalCriterias': Item.TotalCriterias
			,'TotalObservations': Item.TotalObservations
			,'TourScore': Item.TourScore
			,'PlantTourId': Item.PlantTour
			//,'Status': 'Completed'

                  
        
	};
 	 createListItem(DepartmentTourListName, WebAbsoluteUrl, item, Success, Failure);
}

function GetDTourItem(DepartmentTourId,RoleId,Success,Failure)
{
	var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
	var DepartmentId=$('#hdnDepartmentId').val();
	
	var SelectQuery = "?$select=Id,Title,RoleId/Id,TourBy/Id,TourStartDate,TourCompletionDate,Status,FinalComment,DepartmentId/Id,DepartmentId/Title";
	var ExpandQuery="&$expand=RoleId/Id,TourBy/Id,DepartmentId";
	var filterQuery = "&$filter=RoleId/field_4 eq "+RoleId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and TourCompletionDate ge datetime'" +currentDate+ "' and TourCompletionDate le datetime'" +nextDate+ "'" ;
	var tempQuery = SelectQuery+ExpandQuery+filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDTourDetails, Success, Failure);
}

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




//Plant Tour
var PlantTourListName = 'PlantTour';

function PlanTourListEntity()

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
function UpdatePTourItem(ItemId,PlantTourListEntity,Success,Failure)
{
var ItemId=ItemId;
var tourScore=PlantTourListEntity.TourScore;
     var itemType = GetItemTypeForListName(PlantTourListName );
	var item = {
        '__metadata': { 'type': itemType }
        ,'FinalComment': PlantTourListEntity.FinalComment
		,'TourCompletionDate': PlantTourListEntity.TourCompletionDate
      	,'TotalCriterias': PlantTourListEntity.TotalCriterias
		,'TotalObservations': PlantTourListEntity.TotalObservations
		,'TourScore': PlantTourListEntity.TourScore
		,'TotalNACriterias': PlantTourListEntity.TotalNACriterias
		,'TotalCompliances': PlantTourListEntity.TotalCompliances
		,'Status': 'Completed'
	};
 	 //updateListItemSync(ItemId,PlantTourListName ,WebAbsoluteUrl,item,Success,Failure);
 	 updateListItemwithData(ItemId,tourScore, PlantTourListName , WebAbsoluteUrl, item, Success, Failure);

}

function SavePTourItem(Item,Success, Failure) {
  
    var itemType = GetItemTypeForListName(PlantTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title': 'New Plant Tour-'+moment().format('DD-MM-YYYY HH:mm:ss')
			,'TourStartDate':Item.TourStartDate
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
                  
        
	};
 	 createListItem(PlantTourListName , WebAbsoluteUrl, item, Success, Failure);
}

function GetPTourItemOnId(PlantTourId ,Success,Failure)
{
		
	var SelectQuery = "?$select=Id,Title,RoleId/Id,TourBy/Id,TourStartDate,TourCompletionDate,Status,FinalComment";
	var ExpandQuery="&$expand=RoleId/Id,TourBy/Id";
	var filterQuery = "&$filter= Id eq '"+PlantTourId +"' ";
	//var filterQuery = "&$filter=TourStartDate ge datetime'" +currentDate+ "' and TourStartDate le datetime'" +nextDate+ "'"
	var tempQuery = SelectQuery+ExpandQuery+filterQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, PlantTourListName , tempQuery);
	getListItemByQuery(requestQuery, onFillPTourItemOnId, Success, Failure);
}

function onFillPTourItemOnId(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPTour= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPTour[i] = FillPTourItemOnId(jsonObject.d.results[i]);
		}
		Success(collPTour);
	}


}

function FillPTourItemOnId(result)
{
	  var objPlantTourListEntity = new PlanTourListEntity();
	
	objPlantTourListEntity .Id=result.Id;
	
	if(result.Title!=null)
	{
    	objPlantTourListEntity .Title= result.Title;
    }
	else
	{
		objPlantTourListEntity.Title= '';
	}
	if(result.Status!=null)
	{
    	objPlantTourListEntity.Status= result.Status;
    }
	else
	{
		objPlantTourListEntity.Status= '';
	}

	
	
	if(result.TourStartDate!=null)
	{
    	objPlantTourListEntity.TourStartDate= result.TourStartDate;
    }
	else
	{
		objPlantTourListEntity.TourStartDate= '';
	}
	
	if(result.TourCompletionDate!=null)
	{
    	objPlantTourListEntity.TourCompletionDate= result.TourCompletionDate;
    }
	else
	{
		objPlantTourListEntity.TourCompletionDate= '';
	}
  if(result.FinalComment!=null)
	{
    	objPlantTourListEntity.FinalComment= result.FinalComment;
    }
	else
	{
		objPlantTourListEntity.FinalComment= '';
	}

	return objPlantTourListEntity ;
}


/*Get Department Tour for checking*/
function GetDepartmentTourLength(PlantTourId,RoleId,Success,Failure)
{
   //var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
   
    var SelectQuery = "?$select=Id,Title,DepartmentId/ID,Status";
    var ExpandQuery = "&$expand=DepartmentId";
	//var filterQuery = "&$filter=RoleId/field_4 eq "+RoleId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and TourStartDate ge datetime'" +currentDate+ "' and TourStartDate le datetime'" +nextDate+ "'";
	var filterQuery = "&$filter=RoleId/field_4 eq "+RoleId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and PlantTour/Id eq " +PlantTourId;

	var tempQuery = SelectQuery+filterQuery+ExpandQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetDepartmentTourLength, Success, Failure);
}

function GetDepartmentTourLengthforUpdate(ItemId,Success,Failure)
{
 
    var SelectQuery = "?$select=Id,Title,DepartmentId/ID,Status";
    var ExpandQuery = "&$expand=DepartmentId";
	var filterQuery = "&$filter=Id eq "+ItemId+" and Status eq 'Completed'";
	var tempQuery = SelectQuery+filterQuery+ExpandQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetDepartmentTourLength, Success, Failure);
}


function onFillGetDepartmentTourLength(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDTourLength= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDTourLength[i] = FillGetDepartmentTourLength(jsonObject.d.results[i]);
		}
		Success(collDTourLength);
	}


}

function FillGetDepartmentTourLength(result)
{
	   var objDepartmentTourLengthEntity = new DTourListEntity();
	
	objDepartmentTourLengthEntity .Id=result.Id;
	
	if(result.Title!=null)
	{
    	objDepartmentTourLengthEntity .Title= result.Title;
    }
	else
	{
		objDepartmentTourLengthEntity .Title= '';
	}
		if(result.Status!=null)
	{
    	objDepartmentTourLengthEntity.Status= result.Status;
    }
	else
	{
		objDepartmentTourLengthEntity.Status= '';
	}
	

	if(result.DepartmentId!=null)
	{
    	objDepartmentTourLengthEntity .DepartmentId= result.DepartmentId.ID;
    }
	else
	{
		objDepartmentTourLengthEntity .DepartmentId= '';
	}

	return objDepartmentTourLengthEntity  ;
	}
//////////
function GetDepartmentTourDetails(PlantTourId,DepartmentId,RoleId,Success,Failure)
{
   var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
   
    var SelectQuery = "?$select=Id,Title,DepartmentId/ID";
    var ExpandQuery = "&$expand=DepartmentId";
	var filterQuery = "&$filter=PlantTour/Id eq "+PlantTourId+" and RoleId/field_4 eq "+RoleId+" and DepartmentId/ID eq "+DepartmentId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and TourStartDate ge datetime'" +currentDate+ "' and TourStartDate le datetime'" +nextDate+ "'";
	//var filterQuery = "&$filter=PlantTour/Id eq "+PlantTourId+" ";
	var tempQuery = SelectQuery+filterQuery+ExpandQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDepartTourDetails, Success, Failure);
}

function onFillDepartTourDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDTour= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDTour[i] = FillDepartTourDetails(jsonObject.d.results[i]);
		}
		Success(collDTour);
	}


}

function FillDepartTourDetails(result)
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
	
	return objDepartmentTourListEntity ;

}
