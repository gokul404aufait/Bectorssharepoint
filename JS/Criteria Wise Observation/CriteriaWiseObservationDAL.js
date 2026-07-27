var CurrentUserId = _spPageContextInfo.userId;
var CriticalCatArray = new Array();
var CriteriaArray = new Array();
var SeverityArray = new Array();

var ObservationReportListName='Observations';

function ObservationReportListEntity()
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
	,this.ObservedDate
	,this.Status
	,this.Criteria

}

function GetObservationReportData(DepartmentId,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,CategoryId/Id,CategoryId/Title,What,Observation,CorrectiveAction,SeverityId/Id,SeverityId/Title,ObservedBy/Title,ObservedDate,Status,Criteria";
	var orderByQuery= "&$orderBy=Id desc";
	if(DepartmentId==0)
	{
		var filterQuery= "&$filter=Status eq 'Pending'";
	}
	else
	{
		//var filterQuery= "&$filter=Status eq 'pending' and DepartmentId eq "+DepartmentId;
		var filterQuery= "&$filter=Status eq 'Pending'";

	}
	var TopQuery= "&$top=4";
	var ExpandQuery="&$expand=DepartmentId,CategoryId,SeverityId,ObservedBy";
	
    var tempQuery = SelectQuery+orderByQuery+TopQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, ObservationReportListName, tempQuery);
	getListItemByQuery(requestQuery, onFillObservationReport, Success, Failure);

}
function onFillObservationReport(data,Success,Failure)
{ 
        if (!(!data)) 
	        {
		        var stringData = JSON.stringify(data);
		        var jsonObject = JSON.parse(stringData);
		        var collObservationReport= new Array();
				for (var i = 0; i < jsonObject.d.results.length; i++) 
				{
		        	collObservationReport[i] = FillFormsForcollObservationReport(jsonObject.d.results[i]);
			    }
			    
				Success(collObservationReport);
		   }
}

function FillFormsForcollObservationReport(result)
{

    var objObservationReport = new ObservationReportListEntity();
	
	objObservationReport.Id=result.Id;
	
 if(result.itle!=null)
    {
   		 objObservationReport.Title= result.Title;
    }
	else
	{
		objObservationReport.Title= '';
	}
	 if(result.DepartmentId.Title!=null)
	 {
   		 objObservationReport.DepartmentIdTitle= result.DepartmentId.Title;
     }
	else
	{
		objObservationReport.DepartmentIdTitle= '';
	}
	
	 if(result.CategoryId.Title!=null)
	 {
    	objObservationReport.CategoryIdTitle= result.CategoryId.Title;
     }
	else
	{
		objObservationReport.CategoryIdTitle= '';
	}
	
	 if(result.What!=null)
	 {
   		 objObservationReport.What= result.What;
     }
	else
	{
		objObservationReport.What= '';
	}
	
	if(result.Observation!=null)
	{
   	 objObservationReport.Observation= result.Observation;
    }
	else
	{
		objObservationReport.Observation= '';
	}
	if(result.Criteria!=null)
	{
   	 objObservationReport.Criteria= result.Criteria;
    }
	else
	{
		objObservationReport.Criteria= '';
	}

	if(result.CorrectiveAction!=null)
	{
    	objObservationReport.CorrectiveAction= result.CorrectiveAction;
    }
	else
	{
		objObservationReport.CorrectiveAction= '';
	}

	 if(result.SeverityId.Title!=null)
	 {
    	objObservationReport.SeverityIdTitle= result.SeverityId.Title;
     }
	else
	{
		objObservationReport.SeverityIdTitle= '';
	}
	if(result.ObservedBy.Title!=null)
	{
    	objObservationReport.ObservedByTitle= result.ObservedBy.Title;
    }
	else
	{
		objObservationReport.ObservedByTitle= '';
	}
	if(result.Status!=null)
	{
    	objObservationReport.Status= result.Status;
    }
	else
	{
		objObservationReport.Status= '';
	}

	if(result.ObservedDate!=null)
	{
    	objObservationReport.ObservedDate= result.ObservedDate;
    }
	else
	{
		objObservationReport.ObservedDate= '';
	}


  	return objObservationReport;
}

var PlantTourCriteriaListName = 'CriteriaMaster';

function PlantTourCriteriaListEntity()
{

this.Id
,this.Title
,this.Criteria
,this.IsActive
,this.DepartmentId
}


function GetCriteriaForPlantTour(departmentID,Success,Failure)
{
	//RequestItemId=$('#RequestId').val();
	SelectQuery = "?$select=Id,Title,Criteria,IsActive,DepartmentId/Id";
   // var filterQuery= "&$filter=(HODManager/Id eq '"+CurrentUserId+"') or (PlantManager/Id eq '"+CurrentUserId+"')";
    var filterQuery= ""

    var expandQuery = "&$expand=DepartmentId";
    var TopQuery = "&$top=4";
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl,PlantTourCriteriaListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetCriteriaForPlantTour, Success, Failure);

}

function onFillGetCriteriaForPlantTour(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collCriteriaa= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collCriteriaa[i] = FillGetCriteria(jsonObject.d.results[i]);
		}
		Success(collCriteriaa);
	}

}

function FillGetCriteria(result)
{
	var objGetCriteriaa = new PlantTourCriteriaListEntity();
	objGetCriteriaa.Id  = result.Id;	
	if (result.Id != null) 
	{
	    objGetCriteriaa.Id = result.Id 
	} 
	else 
	{
	    objGetCriteriaa.Id = '';
	}
		
	
	if (result.Title != null) 
	{
	    objGetCriteriaa.Title = result.Title
	} 
	else 
	{
	    objGetCriteriaa.Title = '';
	}
	if (result.IsActive!= null) 
	{
	    objGetCriteriaa.IsActive= result.IsActive
	} 
	else 
	{
	    objGetCriteriaa.IsActive= '';
	}
	if (result.DepartmentId.Id!= null) 
	{
	    objGetCriteriaa.DepartmentIdId = result.DepartmentId.Id;
	} 
	else 
	{
	    objGetCriteriaa.DepartmentIdId = '';
	}
	
	
	if (result.Criteria!= null) 
	{
	    objGetCriteriaa.Criteria= result.Criteria
	} 
	else
	{
	    objGetCriteriaa.Criteria= '';
	}

		return objGetCriteriaa;
}	

var DepartmentsListName = 'DepartmentMaster';

function DepartmentsListEntity()

{
	this.Id
    ,this.Title
    ,this.PlantId
    ,this.HODManager
    ,this.PlantManager
    ,this.Sequence

}
function GetPlantTourDepartment(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,PlantId/Id,Sequence,HODManager/Id,PlantManager/Id";
	//var filterQuery = "&$filter=IsActive eq 1 and HODManager/Id eq '"+CurrentUserId+"' OR (PlantManager/Id eq '"+CurrentUserId+"')";
	var filterQuery = "&$filter=(HODManager/Id eq '"+CurrentUserId+"') or (PlantManager/Id eq '"+CurrentUserId+"')";

	var ExpandQuery="&$expand=PlantId,HODManager,PlantManager";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentsListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDepartmentsDetails, Success, Failure);
}

function onFillDepartmentsDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepartmentMaster= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) 
		{
        	collDepartmentMaster[i] = FillDepartments(jsonObject.d.results[i]);
		}
		Success(collDepartmentMaster);
	}


}

function FillDepartments(result)
{
	  var objDepartments = new DepartmentsListEntity();
	
	objDepartments.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objDepartments.Title= result.Title;
    }
	else
	{
		objDepartments.Title= '';
	}
	if(result.PlantId.Id!=null)
	{
    	objDepartments.PlantIdId= result.PlantId.Id;
    }
	else
	{
		objDepartments.PlantIdId= '';
	}
	if(result.Sequence!=null)
	{
    	objDepartments.Sequence= result.Sequence;
    }
	else
	{
		objDepartments.Sequence= '';
	}	
	
	if(result.HODManager.Id!=null)
	{
    	objDepartments.HODManagerId= result.HODManager.Id;
    }
	else
	{
		objDepartments.HODManagerId= '';
	}

	if(result.PlantManager.Id!=null)
	{
    	objDepartments.PlantManagerId= result.PlantManager.Id;
    }
	else
	{
		objDepartments.PlantManagerId= '';
	}


	return objDepartments;
}

var CriteriaListName = 'CriteriaMaster';

function CriteriaListEntity()
{

	this.Id
	,this.Title
	,this.Criteria
	,this.IsActive
	//,this.DepartmentIdHODManager
	//,this.DepartmentIdPlantManager
	,this.DepartmentId
	,this.Category
	,this.Sequence
	,this.RoleId
	,this.Category
}


function GetCriteria(Success,Failure)
{
	//,DepartmentId/HODManager,DepartmentId/PlantManager
	//RequestItemId=$('#RequestId').val();
	SelectQuery = "?$select=Id,Title,Criteria,IsActive,DepartmentId/Id,DepartmentId/Title,Category/Id,Category/Title,Sequence,RoleId/Id,RoleId/field_1";
    //var filterQuery= "&$filter=RoleId/field_1 eq 'HOD'";
    var filterQuery= "&$filter=DepartmentId/Title eq 'Manufacturing' or DepartmentId/Title eq 'Supply'"

    var expandQuery = "&$expand=DepartmentId,Category,RoleId";
    var TopQuery = "&$top=4";
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl,CriteriaListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetCategory, Success, Failure);

}

function onFillGetCategory(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collEmployeeMaster= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collEmployeeMaster[i] = FillGetCategory(jsonObject.d.results[i]);
		}
		Success(collEmployeeMaster);
	}

}

function FillGetCategory(result)
{
	var objGetCriteria = new CriteriaListEntity();
	objGetCriteria.Id  = result.Id;	
	if (result.Id != null) 
	{
	    objGetCriteria.Id = result.Id 
	} 
	else 
	{
	    objGetCriteria.Id = '';
	}
		
	
	if (result.Title != null) 
	{
	    objGetCriteria.Title = result.Title
	} 
	else 
	{
	    objGetCriteria.Title = '';
	}
	if (result.IsActive!= null) 
	{
	    objGetCriteria.IsActive= result.IsActive
	} 
	else 
	{
	    objGetCriteria.IsActive= '';
	}
	
	if (result.Criteria!= null) 
	{
	    objGetCriteria.Criteria= result.Criteria
	} 
	else
	{
	    objGetCriteria.Criteria= '';
	}
	
		if (result.Sequence!= null) 
	{
	    objGetCriteria.Sequence= result.Sequence
	} 
	else
	{
	    objGetCriteria.Sequence= '';
	}		
	
	if (result.RoleId.Id!= null) 
	{
	    objGetCriteria.RoleIdId= result.RoleId.Id
	} 
	else
	{
	    objGetCriteria.RoleIdId= '';
	}
	if (result.RoleId.field_1!= null) 
	{
	    objGetCriteria.RoleIdRoleName= result.RoleId.field_1
	} 
	else
	{
	    objGetCriteria.RoleIdRoleName= '';
	}
	if (result.Category.Title!= null) 
	{
	    objGetCriteria.CategoryTitle= result.Category.Title
	} 
	else
	{
	    objGetCriteria.CategoryTitle= '';
	}
	if (result.DepartmentId.Title!= null) 
	{
	    objGetCriteria.DepartmentIdTitle= result.DepartmentId.Title
	} 
	else
	{
	    objGetCriteria.DepartmentIdTitle= '';
	}
		return objGetCriteria;
}


var SeverityListName = 'SeverityMaster';

function SeverityListEntity()
{

this.Id
,this.Title
,this.PlantId
}


function GetSeverity(Success,Failure)
{
	//RequestItemId=$('#RequestId').val();
	SelectQuery = "?$select=Id,Title,PlantId/Id";
   	//var filterQuery= "&$filter=PlantManager/Id eq '"+PlantId;
     var filterQuery= ""

    var expandQuery = "&$expand=PlantId";
    var TopQuery = "&$top=4";
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
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
	var objSeverity = new PlantTourCriteriaListEntity();
	objSeverity.Id  = result.Id;	
	if (result.Id != null) 
	{
	    objSeverity.Id = result.Id 
	} 
	else 
	{
	    objSeverity.Id = '';
	}
		
	
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
//update funtion for Non Confirmity


function UpdateNonConfirmityDetails(itemId,objNonConfirmityDetails, Success, Failure) {
	var itemType = GetItemTypeForListName(ObservationReportListName);
	
	var item = {
	    '__metadata': { 'type': itemType },
	        'Observation': objNonConfirmityDetails.Title
			,'CorrectiveAction': objNonConfirmityDetails.CorrectiveAction
			
			,'severity': objNonConfirmityDetails.severity
		};
	updateListItem(itemId, ObservationReportListName, WebAbsoluteUrl, item, Success, Failure);
}

//Attachement Upload Function

function SaveObservationFormAttachment(Success, Failure) {
  
    var itemType = GetItemTypeForListName(ObservationReportListName);
	var item = {
        '__metadata': { 'type': itemType }
        ,'Title': 'New Observation-'+moment().format('DD-MM-YYYY HH:mm:ss')
                  
        
	};
 	 createListItem(ObservationReportListName, WebAbsoluteUrl, item, Success, Failure);
}
function ObservationAttachmentsListEntity() 
{
	this.Filename
	,this.Fileurl
}



function GetObservationAttachments(listitemid,Success,Failure)
{
	var requestQuery = 	WebAbsoluteUrl+"/_api/lists/getByTitle('"+ObservationReportListName+"')/items("+listitemid+")?$select=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName&$expand=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName";
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
	var ItemId =$('#hdnObservationAttachmentsID').val();
	var RestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + ObservationReportListName+ "')/GetItemById(" + ItemId + ")/AttachmentFiles/getByFileName('" + Filename+ "')  ";
	deleteListItemAttachment(RestUri ,Success, Failure);
}

