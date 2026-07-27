var ObservationReportListName='Observations';

function ObservationReportListEntity()
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
	,this.ObservedDate
	,this.Status
	,this.Criteria
    ,this.AreaIdTitle
	,this.PlantId
	,this.ClosedBy
	,this.ClosureComment
	,this.ClosedDate
	,this.ClosedByRole

}
// function for Department wise Observation with status
function GetObservationReportData(SelectedSevirityId,DepartmentId,StatusValue,Action,Success,Failure)
{
	var SelectQuery = "?$select=Id,Criteria,Title,Where,DepartmentId/Id,DepartmentId/Title,CategoryId/Id,CategoryId/Title,What,Observation,CorrectiveAction,SeverityId/Id,SeverityId/Title,ObservedBy/Title,ObservedDate,Status,AreaId/Id,AreaId/Title,PlantId/Title,ClosureComment,ClosedDate,ClosedBy/Title";
	
     var filterQuery=ReturnFilterquery(DepartmentId,SelectedSevirityId,StatusValue,Action)
	
	var TopQuery= "&$top=4999";
	var ExpandQuery="&$expand=DepartmentId,CategoryId,SeverityId,AreaId,ObservedBy,PlantId,ClosedBy";
	var orderByQuery= "&$orderby=Id desc";
    var tempQuery = SelectQuery+filterQuery+ExpandQuery+TopQuery+orderByQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, ObservationReportListName, tempQuery);
	getListItemByQuery(requestQuery, onFillObservationReport, Success, Failure);

}
function onFillObservationReport(data,Success,Failure)
{ 
        if (!(!data)) 
	        {
		        var stringData = JSON.stringify(data);
		        var jsonObject = JSON.parse(stringData);
		        var collInnerObservationReport= new Array();
				for (var i = 0; i < jsonObject.d.results.length; i++) 
				{
		        	collInnerObservationReport[i] = FillFormsForcollInnerObservationReport(jsonObject.d.results[i]);
			    }
			    
				Success(collInnerObservationReport);
		   }
}

function FillFormsForcollInnerObservationReport(result)
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

    if(result.AreaId.Title!=null)
	 {
    	objObservationReport.AreaIdTitle= result.AreaId.Title;
     }
	else
	{
		objObservationReport.AreaIdTitle= '';
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
	 if(result.Where!=null)
	 {
   		 objObservationReport.Where= result.Where;
     }
	else
	{
		objObservationReport.Where= '';
	}

	if(result.Criteria!=null)
	 {
   		objObservationReport.Criteria= result.Criteria;
     }
	else
	{
		objObservationReport.Criteria= '';
	}

	if(result.Observation!=null)
	{
   	 objObservationReport.Observation= result.Observation;
    }
	else
	{
		objObservationReport.Observation= '';
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
	if(result.ClosedBy.Title!=null)
	{
    	objObservationReport.ClosedByTitle= result.ClosedBy.Title;
    }
	else
	{
		objObservationReport.ClosedByTitle= '';
	}

	if(result.Status!=null)
	{
    	objObservationReport.Status= result.Status;
    }
	else
	{
		objObservationReport.Status= '';
	}

    if(result.PlantId.Title!=null)
	{
    	objObservationReport.PlantId= result.PlantId.Title;
    }
	else
	{
		objObservationReport.PlantId= '';
	}

	if(result.ObservedDate!=null)
	{
    	objObservationReport.ObservedDate= result.ObservedDate;
    }
	else
	{
		objObservationReport.ObservedDate= '';
	}

	if(result.ClosedDate!=null)
	{
    	objObservationReport.ClosedDate= result.ClosedDate;
    }
	else
	{
		objObservationReport.ClosedDate= '';
	}

  	return objObservationReport;
}
/////////////////////////////


var currentUser = _spPageContextInfo.userDisplayName;
var loginuserId =  _spPageContextInfo.userId;

// To filter login Employee Only

var EmployeeListName= 'EmployeeList';

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

function getEmployeeDetailsForObservation(Success,Failure)
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
        var collEMP= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collEMP[i] = FillEmployeeListName(jsonObject.d.results[i]);
		}
		Success(collEMP);
	}


}

function FillEmployeeListName(result)
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


//////////////////////

var DepartListName = 'DepartmentMaster';

function DepartListEntity()

{
	this.Id
    ,this.Title
    ,this.PlantId
    ,this.Title1

}

function getDepartmentsForObservations(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,PlantId/Title";
	var filterQuery = "&$filter=IsActive eq 1 "
	var ExpandQuery="&$expand=PlantId";

	var tempQuery = SelectQuery+filterQuery+ExpandQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDepartmentDetails, Success, Failure);
}

function onFillDepartmentDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepart= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDepart[i] = FillDepartment(jsonObject.d.results[i]);
		}
		Success(collDepart);
	}


}

function FillDepartment(result)
{
	  var objDepart = new DepartListEntity();
	
	objDepart.Id=result.Id;
	
	if(result.PlantId.Title!=null)
	{
    	objDepart.Title= result.PlantId.Title;
    }
	else
	{
		objDepart.Title= '';
	}
    if(result.PlantId.Title!=null)
	{
    	objDepart.Title1= result.Title;
    }
	else
	{
		objDepart.Title1= '';
	}
	return objDepart;
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
   //	var filterQuery= "&$filter= ((Sequence eq 3) or  (Sequence eq 4))";
 	var orderByQuery= "&$orderby= Sequence desc";
    var expandQuery = "&$expand=PlantId";
    var tempQuery = SelectQuery + expandQuery+orderByQuery;
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

function ReturnFilterquery(DepartmentId,SelectedSevirityId,StatusValue,Action)
{
 var filterQuery='';
 if(DepartmentId!=0 & SelectedSevirityId!=0 & StatusValue!="" & Action!="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and Action eq '"+Action+"' and DepartmentId eq "+DepartmentId+" and SeverityId eq "+SelectedSevirityId;
    }
 	if(DepartmentId!=0 & SelectedSevirityId!=0 & StatusValue!="" & Action=="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and DepartmentId eq "+DepartmentId+" and SeverityId eq "+SelectedSevirityId;
    }
    if(DepartmentId!=0 & SelectedSevirityId!=0 & StatusValue=="" & Action=="")
	{
	    filterQuery= "&$filter=DepartmentId eq "+DepartmentId+" and SeverityId eq "+SelectedSevirityId;
    }
     if(DepartmentId!=0 & SelectedSevirityId!=0 & StatusValue=="" & Action!="")
	{
	    filterQuery= "&$filter= Action eq '"+Action+"' and DepartmentId eq "+DepartmentId+" and SeverityId eq "+SelectedSevirityId;
    }

 	if(DepartmentId!=0 & SelectedSevirityId==0 & StatusValue!="" & Action=="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and DepartmentId eq "+DepartmentId;
    }
    if(DepartmentId!=0 & SelectedSevirityId==0 & StatusValue=="" & Action!="")
	{
	    filterQuery= "&$filter=Action eq '"+Action+"' and DepartmentId eq "+DepartmentId;
    }
  if(DepartmentId!=0 & SelectedSevirityId==0 & StatusValue!="" & Action!="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and Action eq '"+Action+"' and DepartmentId eq "+DepartmentId;
    }
 if(DepartmentId!=0 & SelectedSevirityId==0 & StatusValue=="" & Action=="")
	{
	    filterQuery= "&$filter=DepartmentId eq "+DepartmentId;
    }

  if(DepartmentId==0 & SelectedSevirityId!=0 & StatusValue=="" & Action=="")
	{
	    filterQuery= "&$filter=SeverityId eq "+SelectedSevirityId;
    }
   if(DepartmentId==0 & SelectedSevirityId!=0 & StatusValue!="" & Action!="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and Action eq '"+Action+"' and SeverityId eq "+SelectedSevirityId;
    }
  if(DepartmentId==0 & SelectedSevirityId!=0 & StatusValue!="" & Action=="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and SeverityId eq "+SelectedSevirityId;
    }
  if(DepartmentId==0 & SelectedSevirityId!=0 & StatusValue=="" & Action!="")
	{
	    filterQuery= "&$filter=Action eq '"+Action+"' and SeverityId eq "+SelectedSevirityId
    }
   if(DepartmentId==0 & SelectedSevirityId==0 & StatusValue=="" & Action!="")
	{
	    filterQuery= "&$filter=Action eq '"+Action+"'";
    }
 if(DepartmentId==0 & SelectedSevirityId==0 & StatusValue!="" & Action!="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"' and Action eq '"+Action+"'";
    }
 if(DepartmentId==0 & SelectedSevirityId==0 & StatusValue!="" & Action=="")
	{
	    filterQuery= "&$filter=Status eq '"+StatusValue+"'";
    }
return filterQuery;
}

