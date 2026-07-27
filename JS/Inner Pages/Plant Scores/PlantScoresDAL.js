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

/*Get Department starts*/
var DepartListName = 'DepartmentMaster';

function DepartListEntity()

{
	this.Id
    ,this.Title

}

function getDepartmentsForObservations(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title";
	var filterQuery = "";
	var ExpandQuery="";

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
	
	if(result.Title!=null)
	{
    	objDepart.Title= result.Title;
    }
	else
	{
		objDepart.Title= '';
	}
	return objDepart;
}

/*Get Department ends*/

var PlantTourList = 'PlantTour';

function PlantTourListEntity()
{
	 this.ID
	,this.Title
	,this.FinalComment
	,this.TourStartDate
	,this.TourCompletionDate
	,this.TotalCriterias
	,this.TotalObservations
	,this.TourScore
	,this.TourBy
	,this.TourById
	,this.Status
}
 
function GetPlantScoresDetails(Success,Failure){

	SelectQuery ="?$select=ID,Title,FinalComment,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status"
    ,expandQuery = "&$expand=TourBy";
    filterQuery = "&$filter=Status eq 'Completed'";
	var TopQuery= "&$top=4999";
	var orderByQuery= "&$orderby=Id desc";		
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderByQuery+TopQuery;
    var requestQuery = requestURL.format(WebAbsoluteUrl, PlantTourList,tempQuery)	
    getListItemByQuery(requestQuery, onFillPlantTourData, Success, Failure);
}
function onFillPlantTourData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPlantTour = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPlantTour[i] = FillPlantTour(jsonObject.d.results[i]);
		}
		Success(collPlantTour);
	}

}
function FillPlantTour(result)
{
	var objPlantTourListEntity = new PlantTourListEntity();
	
	if(result.ID != null)
	{
		objPlantTourListEntity.ID = result.ID;
	}
	else
	{
		objPlantTourListEntity.ID = '';
	}
	
	if(result.Title != null)
	{
		objPlantTourListEntity.Title = result.Title;
	}
	else
	{
		objPlantTourListEntity.Title = '';
	}
	
	if(result.FinalComment != null)
	{
		objPlantTourListEntity.FinalComment= result.FinalComment;
	}
	else
	{
		objPlantTourListEntity.FinalComment= '';
	}

 if(result.TourStartDate !=null)
	{
		objPlantTourListEntity.TourStartDate =result.TourStartDate; //  moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objPlantTourListEntity.TourStartDate = '';
	}

	
	if(result.TourCompletionDate != null)
	{
		objPlantTourListEntity.TourCompletionDate=result.TourCompletionDate;// moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objPlantTourListEntity.TourCompletionDate= '';
	}
	
	if(result.TotalCriterias!= null)
	{
		objPlantTourListEntity.TotalCriterias= result.TotalCriterias;
	}
	else
	{
		objPlantTourListEntity.TotalCriterias= '';
	}

	if(result.TotalObservations!= null)
	{
		objPlantTourListEntity.TotalObservations= result.TotalObservations;
	}
	else
	{
		objPlantTourListEntity.TotalObservations= '';
	}
	
	if(result.TourScore != null)
	{
		objPlantTourListEntity.TourScore = result.TourScore;
	}
	else
	{
		objPlantTourListEntity.TourScore = '';
	}
		
	if(result.TourBy != null)
	{
		objPlantTourListEntity.TourBy = result.TourBy.Title;
		objPlantTourListEntity.TourById = result.TourBy.Id
	}
	else
	{
		objPlantTourListEntity.TourBy= '';
		objPlantTourListEntity.TourById = '';	}
	
	if(result.Status!= null)
	{
		objPlantTourListEntity.Status= result.Status;
	}
	else
	{
		objPlantTourListEntity.Status= '';
	}
		
	return objPlantTourListEntity;
}


