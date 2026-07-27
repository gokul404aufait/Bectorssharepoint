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
	,this.IsActive
	,this.PlantId
	,this.PlantTitle
	,this.RoleName
	,this.RoleSequence
	,this.DepartmentTitle
}

function getHomeEmployeeDetails(Success,Failure)
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
	 if(result.DepartmentId.Title!=null)
	  {
    	objEmployeeDetails.DepartmentTitle= result.DepartmentId.Title;
      }
	else
	 {
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

// To get Title of the Department for login Employee
var DepartmentListName = 'DepartmentMaster';

function DepartmentListEntity()

{
	this.Id
    ,this.Title
    ,this.PlantId
    ,this.Title1

}
function getDepartments(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,PlantId/Title";
	var filterQuery = "&$filter=IsActive eq 1 "
	var ExpandQuery="&$expand=PlantId";

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
    //objDepartment.Id=result.PlantId.Title;
	
	if(result.PlantId.Title!=null)
	{
    	objDepartment.Title= result.PlantId.Title;
    }
	else
	{
		objDepartment.Title= '';
	}
    if(result.Title!=null)
	{
    	objDepartment.Title1= result.Title;
    }
	else
	{
		objDepartment.Title1= '';
	}
	return objDepartment;
}




//Department Tour

// To get Title of the Department for login Employee
var DepartmentTourListName = 'DepartmentTour';

function DepartmentTourListEntity()

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


}
function SaveDTourItem(Item,Success, Failure) {
  
    var itemType = GetItemTypeForListName(DepartmentTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title': Item.Title
			,'DepartmentIdId':Item.DepartmentId
			,'TourStartDate':Item.TourStartDate
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
                  
        
	};
 	 createListItem(DepartmentTourListName, WebAbsoluteUrl, item, Success, Failure);
}
function GetDepartmentTourDetails(DeptId,RoleId,Success,Failure)
{
	var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
	var DepartmentId=$('#hdnDepartmentId').val();
	
	var SelectQuery = "?$select=Id,Title,DepartmentId/ID,RoleId/Id,TourBy/Id,TourStartDate,TourCompletionDate,Status ";
	var ExpandQuery="&$expand=DepartmentId/ID,RoleId/Id,TourBy/Id";
	var filterQuery = "&$filter= RoleId/field_4 eq "+RoleId+" and DepartmentId/ID eq "+DeptId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" and TourStartDate ge datetime'" +currentDate+ "' and TourStartDate lt datetime'" +nextDate+ "'";
	//var filterQuery = "&$filter= RoleId/field_4 eq "+RoleId+" and DepartmentId/ID eq "+DeptId+" and PlantId/Id eq "+$('#hdnPlantId').val()+" ";
	var orderByQuery="&$orderby=Id desc";
	var topQuery="&$top=1";

	var tempQuery = SelectQuery+ExpandQuery+filterQuery+topQuery+orderByQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillDepartmentTourDetails, Success, Failure);
}

function onFillDepartmentTourDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepartmentTour= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDepartmentTour[i] = FillDepartmentTourDetails(jsonObject.d.results[i]);
		}
		Success(collDepartmentTour);
	}


}

function FillDepartmentTourDetails(result)
{
	  var objDepartmentTourListEntity = new DepartmentTourListEntity();
	
	objDepartmentTourListEntity.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objDepartmentTourListEntity.Title= result.Title;
    }
	else
	{
		objDepartmentTourListEntity.Title= '';
	}
	
	
	if(result.Status !=null)
	{
    	objDepartmentTourListEntity.Status = result.Status ;
    }
	else
	{
		objDepartmentTourListEntity.Status = '';
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

	return objDepartmentTourListEntity ;
}

//Get Plant master

var PlantMasterListName = 'PlantMaster';

function PlantMasterListEntity()

{
		this.Id
		,this.Title
		


}
function getPlantMasterItems(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title ";
	var tempQuery = SelectQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, PlantMasterListName, tempQuery);
	getListItemByQuery(requestQuery, onFillPlantMasterDetails, Success, Failure);
}

function onFillPlantMasterDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPlantMaster= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPlantMaster[i] = FillPlantMasterDetails(jsonObject.d.results[i]);
		}
		Success(collPlantMaster);
	}


}

function FillPlantMasterDetails(result)
{
	  var objPlantMasterListEntity = new PlantMasterListEntity();
	
	objPlantMasterListEntity.Id=result.Id;
	
	if(result.Title!=null)
	{
    	objPlantMasterListEntity.Title= result.Title;
    }
	else
	{
		objPlantMasterListEntity.Title= '';
	}
	return objPlantMasterListEntity ;
}



//Plant Tour
var PlantTourListName = 'PlantTour';

function PTourListEntity()

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

}
function UpdatePTourItem(ItemId,PlantTourListEntity,Success,Failure)
{
var ItemId=ItemId;
     var itemType = GetItemTypeForListName(PlantTourListName );
	var item = {
        '__metadata': { 'type': itemType }
        ,'FinalComment': PlantTourListEntity.FinalComment
		,'TourCompletionDate': PlantTourListEntity.TourCompletionDate
      	,'TotalCriterias': PlantTourListEntity.TotalCriterias
		,'TotalObservations': PlantTourListEntity.TotalObservations
		,'TourScore': PlantTourListEntity.TourScore
		,'Status': 'Completed'
	};
 	 updateListItemSync(ItemId,PlantTourListName ,WebAbsoluteUrl,item,Success,Failure);

}

function SavePTourItem(Item,Success, Failure) {
  
    var itemType = GetItemTypeForListName(PlantTourListName );
	var item = {
        '__metadata': { 'type': itemType }
			,'Title': Item.Title			
			,'TourStartDate':Item.TourStartDate
			,'TourById':Item.TourBy
			,'Status':Item.Status
			,'PlantIdId':Item.PlantId
			,'RoleIdId':Item.RoleId
                  
        
	};
 	 createListItem(PlantTourListName , WebAbsoluteUrl, item, Success, Failure);
}

function GetPTourItem(RoleSequence,Success,Failure)
{
	var today = new Date(); 
	var nextday = moment(today).add(1,'days'); 
	today = moment(today).format("YYYY-MM-DD"); 
	var currentDate = today+'T00:00:00.000'; 
	nextday = moment(nextday).format("YYYY-MM-DD"); 
	var nextDate = nextday+'T00:00:00.000';
	var DepartmentId=userDepratmentId;
	
	var SelectQuery = "?$select=Id,Title,RoleId/Id,TourBy/Id,TourStartDate,TourCompletionDate,Status,FinalComment";
	var ExpandQuery="&$expand=RoleId/Id,TourBy/Id";
	var filterQuery = "&$filter= (RoleId/field_4 eq "+RoleSequence+")  and (PlantId/Id eq "+$('#hdnPlantId').val()+") and TourStartDate ge datetime'" +currentDate+ "' and TourStartDate lt datetime'" +nextDate+ "'"; 
	//and TourStartDate ge datetime'" +currentDate+ "' and TourStartDate le datetime'" +nextDate+ "'" ;
	//var filterQuery = "&$filter=TourStartDate ge datetime'" +currentDate+ "' and TourStartDate le datetime'" +nextDate+ "'"
	var orderByQuery="&$orderby=Id desc";
	var topQuery="&$top=1";
	var tempQuery = SelectQuery+ExpandQuery+filterQuery+topQuery+orderByQuery;
	var requestQuery = requestURL.format(WebAbsoluteUrl, PlantTourListName , tempQuery);
	getListItemByQuery(requestQuery, onFillPTourDetails, Success, Failure);
}

function onFillPTourDetails(data,Success,Failure)
{
	    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPTour= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPTour[i] = FillPTourDetails(jsonObject.d.results[i]);
		}
		Success(collPTour);
	}


}

function FillPTourDetails(result)
{
	  var objPlantTourListEntity = new PTourListEntity();
	
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
