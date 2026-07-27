var currentUser = _spPageContextInfo.userDisplayName;
var loginuserId =  _spPageContextInfo.userId;

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
	,this.PlantId
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
	 if(result.RoleId.field_4!=null)
	 {
    	objEmployeeDetails.RoleId= result.RoleId.field_4;
     }
	else
	 {
		objEmployeeDetails.RoleId= '';
	 }
	 if(result.RoleId.field_1!=null)
	 {
    	objEmployeeDetails.RoleName= result.RoleId.field_1;
     }
	else
	 {
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

	 if(result.PlantId.Title!=null)
	  {
    	objEmployeeDetails.PlantIdTitle= result.PlantId.Title;
      }
	else
	 {
		objEmployeeDetails.PlantIdTitle= '';
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
	var SelectQuery = "?$select=Id,Title,PlantManager/Id,HODManager/Id";
	var filterQuery = SelectedFilter
	var ExpandQuery="&$expand=PlantManager,HODManager";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
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

function CriteriaListEntity()

{
	this.Id
    ,this.Title
    ,this.CategoryId
    ,this.DepartmentId
    ,this.Criteria
    ,this.What
    ,this.AreaId
    ,this.AreaTitle

}
function getCriterias(SelectedFilter,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,Category/Id,DepartmentId/Id,Criteria,AreaId/Id,AreaId/Title";
	var filterQuery = SelectedFilter
	var ExpandQuery="&$expand=Category,DepartmentId,AreaId";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
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
	}
	else
	{
		objCriteria.CategoryId= '';
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
}

function getSeverity(Success,Failure)
{
	SelectQuery = "?$select=Id,Title,PlantId/Id";
   	//var filterQuery= "&$filter=PlantManager/Id eq '"+PlantId;
    var expandQuery = "&$expand=PlantId";
    var tempQuery = SelectQuery + expandQuery;
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
	,this.Observation
	,this.CorrectiveAction
	,this.SeverityId
	,this.ObservedBy
	,this.ObservedByRole
	,this.ObservedDate
	,this.Status
	,this.Criteria

}

// TO Create Observation
function CreateObservation(objNonConfirmityDetails,Success,Failure) 
{
  
    var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': 'New Observation-'+moment().format('DD-MM-YYYY HH:mm:ss')
		,'Observation': objNonConfirmityDetails.Observation
		,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
		,'SeverityIdId': objNonConfirmityDetails.Severity
		,'What': objNonConfirmityDetails.What
		//,'severity': objNonConfirmityDetails.Severity
		,'ObservedById': objNonConfirmityDetails.ObservedBy
		,'DepartmentIdId': objNonConfirmityDetails.DepartmentId
		,'CategoryIdId': objNonConfirmityDetails.CategoryId
		,'Criteria': objNonConfirmityDetails.Criteria
		,'Status': objNonConfirmityDetails.Status
		,'ObservedByRole': objNonConfirmityDetails.ObservedByRole
	};
 	 createListItem(ObservationsListName, WebAbsoluteUrl, item, Success, Failure);
}

/*Save Observation for Attachment*/
function SaveObservationFormAttachment(Success, Failure) {
  
    var itemType = GetItemTypeForListName(ObservationsListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': 'New Observation-'+moment().format('DD-MM-YYYY HH:mm:ss')
                  
        
	};
 	 createListItem(ObservationsListName, WebAbsoluteUrl, item, Success, Failure);
}

function ObservationAttachmentsListEntity() 
{
	this.Filename
	,this.Fileurl
}

function GetObservationAttachments(listitemid,Success,Failure)
{
	var requestQuery = 	WebAbsoluteUrl+"/_api/lists/getByTitle('"+ObservationsListName+"')/items("+listitemid+")?$select=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName&$expand=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName";
	getListItemByQuery(requestQuery, onFillGetObservationAttachments, Success, Failure);

}
function onFillGetObservationAttachments(data,Success,Failure)
{

		if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGetAttachments= new Array();
		for (var i = 0; i < jsonObject.d.AttachmentFiles.results.length; i++) {
        	collGetAttachments[i] = FillGetObservationAttachments(jsonObject.d.AttachmentFiles.results[i]);
		}
		Success(collGetAttachments);
	}

}
function FillGetObservationAttachments(result)
{
	var objGetObservationAttachments = new ObservationAttachmentsListEntity();
	objGetObservationAttachments.Filename  = result.FileName;
	objGetObservationAttachments.Fileurl  = window.location.origin+result.ServerRelativeUrl;
	return objGetObservationAttachments;
}


function DeleteRequestAttachment(Filename,Success,Failure)
{
	var ItemId =$('#'+ObservId).val();
	var RestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + ObservationsListName+ "')/GetItemById(" + ItemId + ")/AttachmentFiles/getByFileName('" + Filename+ "')  ";
	deleteListItemAttachment(RestUri ,Success, Failure);
}
