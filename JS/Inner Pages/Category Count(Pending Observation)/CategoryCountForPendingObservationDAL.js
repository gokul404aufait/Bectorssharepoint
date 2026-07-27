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

}

function GetPendingObservationCategoryCountData(DepartmentId,CategoriesfilterId,Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,CategoryId/Id,CategoryId/Title,What,Observation,CorrectiveAction,SeverityId/Id,SeverityId/Title,ObservedBy/Title,ObservedDate,Status";
	var orderByQuery= "&$OrderBy=created desc";
	var filterQuery= "&$filter=Status eq 'pending' and "+CategoriesfilterId;

	/*if(DepartmentId==0)
	{
		var filterQuery= "&$filter=Status eq 'pending' and "+CategoriesfilterId;
	}
	else
	{
		var filterQuery= "&$filter=DepartmentId/Id eq "+DepartmentId+" and Status eq 'pending' and "+CategoriesfilterId;
		//var filterQuery= "&$filter=Status eq 'pending'";

	}*/
	var TopQuery= "&$top=1000";
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





