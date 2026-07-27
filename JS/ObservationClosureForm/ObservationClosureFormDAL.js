var loginuserId =  _spPageContextInfo.userId;

/*Get Employee Details*/
var EmployeeListName = 'EmployeeList';

function EmployeeListEntity()

{
	this.Id
	,this.Title
	,this.EmployeeName
	,this.DepartmentId
	,this.RoleId
	,this.IsActive
	,this.PlantId
	,this.PlantTitle
	,this.RoleName
	,this.RoleSequence
	,this.DepartmentTitle
}

function GetEmployeeDetails(Success,Failure)
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
    	if(result.DepartmentId.Id!=null)
    	{
    	objEmployeeDetails.DepartmentTitle= result.DepartmentId.Title;
    	}
    	else
    	{
    	objEmployeeDetails.DepartmentTitle= '';
        }
      }
	else
	 {
		objEmployeeDetails.DepartmentId= '';
    	objEmployeeDetails.DepartmentTitle= '';
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
/*Get Employee Details ends*/


var ObservationClosureListName='Observations';

function ObservationClosureListEntity()
{
	this.Id
	,this.Title
	,this.DepartmentId
	,this.CategoryIdTitle
	,this.What
	,this.Criteria
	,this.Observation
	,this.CorrectiveAction
	,this.SeverityIdTitle
	,this.ObservedBy
	,this.ObservedDate
	,this.ClosedByTitle
	,this.ClosureComment
	,this.Status
	,this.Action

}

function GetObservationClosureData(data,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,Status,Action,DepartmentId/Title,CategoryId/Title,What,Criteria,Observation,CorrectiveAction,SeverityId/Title,ObservedBy/Title,ObservedDate,ClosedBy/Title,ClosureComment"
	var orderByQuery= "&$orderby=Created desc";
	var filterQuery= "&$filter=Id eq "+$('#hdnClosureID').val()+"" 

	var TopQuery= "&$top=4"
	var ExpandQuery="&$expand=DepartmentId,CategoryId,SeverityId,ObservedBy,ClosedBy";
   var tempQuery = SelectQuery+orderByQuery+TopQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, ObservationClosureListName, tempQuery);
	getListItemByQuery(requestQuery, onFillObservationClosure, Success, Failure);

}
function onFillObservationClosure(data,Success,Failure)
{ 
        if (!(!data)) 
	        {
		        var stringData = JSON.stringify(data);
		        var jsonObject = JSON.parse(stringData);
		        var collObservationClosure= new Array();
				for (var i = 0; i < jsonObject.d.results.length; i++) 
				{
		        	collObservationClosure[i] = FillFormsForcollObservationClosure(jsonObject.d.results[i]);
			    }
			    
				Success(collObservationClosure);
		   }
}

function FillFormsForcollObservationClosure(result){

    var objObservationClosure = new ObservationClosureListEntity();
	
	objObservationClosure.Id=result.Id;
	
 if(result.Title!=null){
    objObservationClosure.Title= result.Title;
    }
	else{
	objObservationClosure.Title= '';
	}
	 if(result.Status!=null){
    objObservationClosure.Status= result.Status;
    }
	else{
	objObservationClosure.Status= '';
	}

	 if(result.DepartmentId.Title!=null){
    objObservationClosure.DepartmentIdTitle= result.DepartmentId.Title;
    }
	else{
	objObservationClosure.DepartmentIdTitle= '';
	}
	
	 if(result.CategoryId.Title!=null){
    objObservationClosure.CategoryIdTitle= result.CategoryId.Title;
    }
	else{
	objObservationClosure.CategoryIdTitle= '';
	}
	
	 if(result.What!=null){
    objObservationClosure.What= result.What;
    }
	else{
	objObservationClosure.What= '';
	}
	
	if(result.Observation!=null){
    objObservationClosure.Observation= result.Observation;
    }
	else{
	objObservationClosure.Observation= '';
	}
		 if(result.CorrectiveAction!=null){
    objObservationClosure.CorrectiveAction= result.CorrectiveAction;
    }
	else{
	objObservationClosure.CorrectiveAction= '';
	}

	 if(result.SeverityId.Title!=null){
    objObservationClosure.SeverityIdTitle= result.SeverityId.Title;
    }
	else{
	objObservationClosure.SeverityIdTitle= '';
	}
	if(result.ObservedBy.Title!=null){
    objObservationClosure.ObservedByTitle= result.ObservedBy.Title;
    }
	else{
	objObservationClosure.ObservedByTitle= '';
	}
		if(result.ObservedDate!=null){
    objObservationClosure.ObservedDate= result.ObservedDate;
    }
	else{
	objObservationClosure.ObservedDate= '';
	}
	if(result.Criteria!=null){
    objObservationClosure.Criteria= result.Criteria;
    }
	else{
	objObservationClosure.Criteria= '';
	}
if(result.ClosureComment!=null){
    objObservationClosure.ClosureComment= result.ClosureComment;
    }
	else{
	objObservationClosure.ClosureComment= '';
	}
 if(result.Action!=null){
    objObservationClosure.Action= result.Action;
    }
	else{
	objObservationClosure.Action= '';
	}


  return objObservationClosure;
}

// for Category of Dropdown


function AttachmentsListEntity() 
{
	this.Filename
	,this.Fileurl
	,this.Id
}



function GetObservationAttachments(listitemid,Success,Failure)
{
	var requestQuery = 	WebAbsoluteUrl+"/_api/lists/getByTitle('"+ObservationClosureListName+"')/items("+listitemid+")?$select=Id,AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName&$expand=AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName";
	getListItemByQuery(requestQuery, onFillGetClosureAttachments, Success, Failure);

}
function onFillGetClosureAttachments(data,Success,Failure)
{
      if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGetAttachments= new Array();
		for (var i = 0; i < jsonObject.d.AttachmentFiles.results.length; i++) {
        	collGetAttachments[i] = FillGetClosureAttachments(jsonObject.d.AttachmentFiles.results[i],jsonObject.d.Id);
		}
	

		Success(collGetAttachments);
	}

}

function FillGetClosureAttachments(result,Id)
{
	var objGetAttachments = new AttachmentsListEntity();
	objGetAttachments.Id  = Id;

	objGetAttachments.Filename  = result.FileName;
	objGetAttachments.Fileurl  = window.location.origin+result.ServerRelativeUrl;
	return objGetAttachments;
}


function UpdateObservationitem(objClosureDetails, Success, Failure) 
{
    var ItemId=$('#hdnClosureID').val()
	var itemType = GetItemTypeForListName(ObservationClosureListName);
	
	var item = {
	    '__metadata': { 'type': itemType },
			'CorrectiveAction': objClosureDetails.CorrectiveAction
			,'ClosureComment': objClosureDetails.ClosureComment
			,'ClosedById':objClosureDetails.ClosedBy
			,'ClosedDate':objClosureDetails.ClosedDate
			,'ClosedByRole':objClosureDetails.ClosedByRole
            ,'Status':objClosureDetails.Status

			};
	updateListItem(ItemId, ObservationClosureListName, WebAbsoluteUrl, item, Success, Failure);
}

/*Save Observation for Attachment*/
function SaveObservationFormAttachment(ObservationId,Success, Failure) {
  
    var itemType = GetItemTypeForListName(ObservationClosureListName);
	var item = {
        '__metadata': { 'type': itemType }
        //,'Title': $('#hdnRoleName').val()+'_'+moment().format('MM-DD-YYYY')
        ,'Title': moment().format('MM-DD-YYYY')
        //,'Status':'Saved'
       
        
	};
 	 //createListItem(ObservationClosureListName, WebAbsoluteUrl, item, Success, Failure);
 	 updateListItem(ObservationId, ObservationClosureListName, WebAbsoluteUrl, item, Success, Failure)
}

function DeleteRequestAttachment(Filename,ItemId ,Success,Failure)
{
	var ItemId =ItemId ;
	var RestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + ObservationClosureListName+ "')/GetItemById(" + ItemId + ")/AttachmentFiles/getByFileName('" + Filename+ "')  ";
	deleteListItemAttachment(RestUri ,Success, Failure);
}