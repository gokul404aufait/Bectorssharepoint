// To filter login Employee Only
var loginuserId =  _spPageContextInfo.userId;
var EmployeeListName = 'EmployeeList';

function EmployeeListEntity()

{
	this.Id
	,this.Title
	,this.EmployeeName
	,this.DepartmentId
	,this.RoleId
	,this.RoleSequence
	,this.IsActive
	,this.PlantId
}

function getEmployeeDetails(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,RoleId/Id,RoleId/field_4,IsActive,PlantId/Id,PlantId/Title";
	var filterQuery = "&$filter=IsActive eq 1 and EmployeeName/Id eq "+loginuserId;
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
    	objEmployeeDetails.DepartmentIdTitle= result.DepartmentId.Title;
      }
	else
	 {
		objEmployeeDetails.DepartmentIdTitle= '';
	 }

	 if(result.RoleId.field_4!=null)
	 {
    	objEmployeeDetails.RoleSequence= result.RoleId.field_4;
     }
	else
	 {
		objEmployeeDetails.RoleSequence= '';
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

/*
 * Department Tour
 */
var DepartmentTourList = 'DepartmentTour';

function DepartmentTourListEntity()
{
	 this.ID
	,this.Title
	,this.FinalComment
	,this.Department
	,this.DepartmentID
	,this.TourStartDate
	,this.TourCompletionDate
	,this.TotalCriterias
	,this.TotalObservations
	,this.TourScore
	,this.TourBy
	,this.TourById
	,this.Status
	,this.RoleSequence
	,this.PlantId
	,this.RoleId
}
 
function GetDepartmentTour(EmployeeSquence,plant,Success,Failure){
		
	SelectQuery ="?$select=ID,Title,FinalComment,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status,RoleId/field_4,PlantId/Title,RoleId/field_4"
	,expandQuery = "&$expand=DepartmentId,RoleId,TourBy,PlantId";
	var filterQuery = "&$filter=TourBy/Id eq "+loginuserId+" and RoleId/field_4 eq "+EmployeeSquence;//+" and PlantId/Title eq "+plant;
	var orderQuery = "&$orderBy=ID desc";
	var TopQuery= "&$top=4999";
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderQuery+TopQuery ;
    var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourList,tempQuery);
   
    getListItemByQuery(requestQuery, onFillDepartmentTourData, Success, Failure);
}

function onFillDepartmentTourData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepartmentTour = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDepartmentTour[i] = FillDepartmentTour(jsonObject.d.results[i]);
		}
		Success(collDepartmentTour);
	}

}
function FillDepartmentTour(result)
{
	var objDepartmentTourListEntity = new DepartmentTourListEntity();
	
	if(result.ID != null)
	{
		objDepartmentTourListEntity.ID = result.ID;
	}
	else
	{
		objDepartmentTourListEntity.ID = '';
	}
	
	if(result.Title != null)
	{
		objDepartmentTourListEntity.Title = result.Title;
	}
	else
	{
		objDepartmentTourListEntity.Title = '';
	}
	
	if(result.FinalComment != null)
	{
		objDepartmentTourListEntity.FinalComment= result.FinalComment;
	}
	else
	{
		objDepartmentTourListEntity.FinalComment= '';
	}
		
	if(result.DepartmentId != null)
	{
		objDepartmentTourListEntity.Department = result.DepartmentId.Title;
		objDepartmentTourListEntity.DepartmentID = result.DepartmentId.Id;
	}
	else
	{
		objDepartmentTourListEntity.Department = '';
		objDepartmentTourListEntity.DepartmentID = '';
	}
	
    if(result.TourStartDate !=null)
	{
		objDepartmentTourListEntity.TourStartDate =result.TourStartDate;//  moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objDepartmentTourListEntity.TourStartDate = '';
	}

	if(result.TourCompletionDate != null)
	{
		objDepartmentTourListEntity.TourCompletionDate=result.TourCompletionDate; // moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objDepartmentTourListEntity.TourCompletionDate= '';
	}
	
	if(result.TotalCriterias!= null)
	{
		objDepartmentTourListEntity.TotalCriterias= result.TotalCriterias;
	}
	else
	{
		objDepartmentTourListEntity.TotalCriterias= '';
	}

	if(result.TotalObservations!= null)
	{
		objDepartmentTourListEntity.TotalObservations= result.TotalObservations;
	}
	else
	{
		objDepartmentTourListEntity.TotalObservations= '';
	}
	if(result.RoleId.field_4!= null)
	{
		objDepartmentTourListEntity.RoleSequence= result.RoleId.field_4;
	}
	else
	{
		objDepartmentTourListEntity.TotalObservations= '';
	}

	if(result.TourScore != null)
	{
		objDepartmentTourListEntity.TourScore = result.TourScore;
	}
	else
	{
		objDepartmentTourListEntity.TourScore = '';
	}
		
	if(result.TourBy != null)
	{
		objDepartmentTourListEntity.TourBy = result.TourBy.Title;
		objDepartmentTourListEntity.TourById = result.TourBy.Id
	}
	else
	{
		objDepartmentTourListEntity.TourBy= '';
		objDepartmentTourListEntity.TourById = '';
	}
	
	if(result.Status!= null)
	{
		objDepartmentTourListEntity.Status= result.Status;
	}
	else
	{
		objDepartmentTourListEntity.Status= '';
	}
	return objDepartmentTourListEntity;
}

//Plant Tour

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
	,this.Created
}
 
function GetPlantScoresDetails(EmployeeSquence,plant,Success,Failure){

	SelectQuery ="?$select=ID,Title,FinalComment,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status,RoleId/field_4,Created"
    ,expandQuery = "&$expand=TourBy,RoleId";
    //filterQuery = "&$filter=Status eq 'Completed'";
    var filterQuery = "&$filter=TourBy/Id eq "+loginuserId+" and RoleId/field_4 eq "+EmployeeSquence;//+" and PlantId/Title eq "+plant;
    var OrderQuery = "&$orderBy= Id desc";
	var TopQuery= "&$top=4999";	
	var tempQuery = SelectQuery+expandQuery+filterQuery+OrderQuery+TopQuery ;
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
		objPlantTourListEntity.TourStartDate = result.TourStartDate; // moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objPlantTourListEntity.TourStartDate = '';
	}

	
	if(result.TourCompletionDate != null)
	{
		objPlantTourListEntity.TourCompletionDate= result.TourCompletionDate; // moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
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

