 var CategoryListName = 'CategoryMaster';

function CategoryListEntity()
{

	this.Id
	,this.Title
	,this.IsCriticalForDepartment
	,this.IsActive
	,this.DepartmentId
	,this.ImageURL
}


function GetCategory(RoleSequence,Success,Failure)
{
	RequestItemId=$('#RequestId').val();
	var filterQuery='';
	if(RoleSequence==20)
	{
     filterQuery= "&$filter=(IsCriticalForDepartment eq 1) and (IsActive eq 1)"
    }
	else if(RoleSequence==30)
	{
     filterQuery= "&$filter=(IsCriticalForPlant eq 1) and (IsActive eq 1)"
	}
	
	SelectQuery = "?$select=Id,Title,IsCriticalForDepartment,IsActive,DepartmentId/Title,DepartmentId/Id,ImageURL"
   // ,filterQuery= "&$filter=(IsCriticalForDepartment eq 1) and (IsActive eq 1)"
    ,expandQuery = "&$expand=DepartmentId"
    ,TopQuery = "&$top=5"
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl,CategoryListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetCategory, Success, Failure);

}

function onFillGetCategory(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collCategory= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collCategory[i] = FillGetCategory(jsonObject.d.results[i]);
		}
		Success(collCategory);
	}

}

function FillGetCategory(result)
{
	var obGetCategoty= new CategoryListEntity();
	obGetCategoty.Id  = result.Id;	
	if (result.Id != null) 
	{
	    obGetCategoty.Id = result.Id 
	} 
	else 
	{
	    obGetCategoty.Id = '';
	}
		
		
	if (result.Title != null) 
	{
	    obGetCategoty.Title = result.Title
	} 
	else 
	{
	    obGetCategoty.Title = '';
	}
	if (result.IsActive!= null) 
	{
	    obGetCategoty.IsActive= result.IsActive
	} 
	else 
	{
	    obGetCategoty.IsActive= '';
	}
	if (result.DepartmentId.Title!= null) 
	{
	    obGetCategoty.DepartmentTitle= result.DepartmentId.Title;
	} 
	else 
	{
	    obGetCategoty.DepartmentTitle= '';
	}
	if (result.DepartmentId.Id!= null) 
	{
	    obGetCategoty.DepartmentId= result.DepartmentId.Id;
	} 
	else 
	{
	    obGetCategoty.DepartmentId= '';
	}

	
	if (result.IsCriticalForDepartment!= null) 
	{
	    obGetCategoty.IsCriticalForDepartment= result.IsCriticalForDepartment
	} 
	else
	{
	    obGetCategoty.IsCriticalForDepartment= '';
	}
		if (result.IsCriticalForDepartment!= null) 
	{
	    obGetCategoty.IsCriticalForDepartment= result.IsCriticalForDepartment
	} 
	else
	{
	    obGetCategoty.IsCriticalForDepartment= '';
	}
	if (result.ImageURL!= null) 
	{
	    obGetCategoty.ImageURL= result.ImageURL;
	} 
	else 
	{
	    obGetCategoty.ImageURL= '';
	}


	return obGetCategoty;
}	





//<<<<<<<<<<<<<<<<<<<<<<    Category Count based on Filter             >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


var ObservationListName = 'Observations';

function ObservationListEntity()
{
	
	this.Id
	,this.Title
	,this.DepartmentId
	,this.Status
	,this.CategoryId
	,this.SeverityIdTitle

}


function GetCriticalCategoryObservationsCount(DepartmentId,CategoriesfilterId,Success,Failure)
{
	//RequestItemId=$('#RequestId').val();
	var SelectQuery = "?$select=Id,Title,DepartmentId/Title,Status,CategoryId/Id,SeverityId/Id,SeverityId/Title";
	if(DepartmentId==0)
	{
		//var filterQuery= "&$filter=Status eq 'pending' and "+CategoriesfilterId+" and (SeverityId/Title eq 'Observation' or SeverityId/Title eq 'Near Miss')";
		var filterQuery= "&$filter=Status eq 'pending' and "+CategoriesfilterId+" and Action eq 'Rejected'";
	}
	else
	{
		//var filterQuery= "&$filter=DepartmentId/Id eq "+DepartmentId+" and Status eq 'pending' and "+CategoriesfilterId+"and (SeverityId/Title eq 'Observation' or SeverityId/Title eq 'Near Miss')";
		var filterQuery= "&$filter=DepartmentId/Id eq "+DepartmentId+" and Status eq 'pending' and "+CategoriesfilterId+" and Action eq 'Rejected'";
	}
    
    var expandQuery = "&$expand=DepartmentId,CategoryId,SeverityId";
    var TopQuery = "&$top=4500";
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl,ObservationListName, tempQuery);
	getListItemByQuery(requestQuery, onFillGetCriticalCategoryObservationsCount, Success, Failure);

}

function onFillGetCriticalCategoryObservationsCount(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGetCriticalCategoryObservationsCount= new Array();
        
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collGetCriticalCategoryObservationsCount[i] = FillGetCriticalCategoryObservationsCount(jsonObject.d.results[i]);
		}
		Success(collGetCriticalCategoryObservationsCount);
	}

}

function FillGetCriticalCategoryObservationsCount(result)
{
	var objObservationCount= new ObservationListEntity();
	objObservationCount.Id  = result.Id;	
	
	if (result.Id != null) 
	{
	    objObservationCount.Id = result.Id 
	} 
	else 
	{
	    objObservationCount.Id = '';
	}
		
		
	if (result.Title != null) 
	{
	    objObservationCount.Title = result.Title
	} 
	else 
	{
	    objObservationCount.Title = '';
	}
	
	if (result.Status!= null) 
	{
	    objObservationCount.Status= result.Status
	} 
	else
	{
	    objObservationCount.Status= '';
	}
	if (result.CategoryId!= null) 
	{
	    objObservationCount.CategoryId= result.CategoryId.Id;
	} 
	else
	{
	    objObservationCount.CategoryId= '';
	}
 	if(result.SeverityId.Title!=null)
	 {
    	objObservationCount.SeverityIdTitle= result.SeverityId.Title;
     }
	else
	{
		objObservationCount.SeverityIdTitle= '';
	}


	return objObservationCount;
}	







