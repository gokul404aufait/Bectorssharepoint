var todayDate = new Date();
var today = todayDate.getFullYear()+'-'+(todayDate.getMonth() + 1)+'-'+todayDate.getDate();
var startDate = todayDate.getFullYear()+'-'+(todayDate.getMonth() + 1)+'-1';

function rawGraphTourEntity()
{

	this.Department
	,this.TourStartDate
	,this.PlantScore
	,this.DepartmentScore
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
}
 
function GetDepartmentTour(DepartmentId,Success,Failure){
		
	SelectQuery ="?$select=ID,Title,FinalComment,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status"
	,expandQuery = "&$expand=DepartmentId,TourBy";
	var filterQuery = '';
	if(DepartmentId != ''){
		filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
	}
	else{
		filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
	}
	var orderQuery = "&$orderBy=ID asc";
	
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderQuery;
	
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
		objDepartmentTourListEntity.TourStartDate =  moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objDepartmentTourListEntity.TourStartDate = '';
	}

	if(result.TourCompletionDate != null)
	{
		objDepartmentTourListEntity.TourCompletionDate= moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
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
/*
 * Plant Tour
 */
var PlantTourList = 'DepartmentTour';

function PlantTourListEntity()
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
}
 
function GetPlantTour(DepartmentId,Success,Failure){

	SelectQuery ="?$select=ID,Title,FinalComment,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status"
	//SelectQuery ="?$select=ID,Title,FinalComment,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status"
	
	,expandQuery = "&$expand=DepartmentId,TourBy";
	var filterQuery = '';
	if(DepartmentId != ''){
		filterQuery = "&$filter=DepartmentId\Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
	}
	else{
		filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
	}
	var orderQuery = "&$orderBy=ID asc";
		
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderQuery;
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

	
	if(result.DepartmentId != null)
	{
		objPlantTourListEntity.Department = result.DepartmentId.Title;
		objPlantTourListEntity.DepartmentID = result.DepartmentId.Id;
	}
	else
	{
		objPlantTourListEntity.Department = '';
		objPlantTourListEntity.DepartmentID = '';
	}


    if(result.TourStartDate !=null)
	{
		objPlantTourListEntity.TourStartDate =  moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objPlantTourListEntity.TourStartDate = '';
	}

	
	if(result.TourCompletionDate != null)
	{
		objPlantTourListEntity.TourCompletionDate= moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
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

/*
 * Department Master
 */

var DepartmentMasterList = 'DepartmentMaster';

function GraphDepartmentMasterListEntity()
{
	 this.Id
	,this.Title
}
 
function GetGraphDepartmentMasterData(Success,Failure){
		
	var SelectQuery ="?$select=Id,Title"
	var filterQuery = '&$filter=IsActive eq 1';
 	
	var tempQuery = SelectQuery+filterQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentMasterList ,tempQuery);
    
    getListItemByQuery(requestQuery, onFillGraphDepartmentMasterData, Success, Failure);
}
function onFillGraphDepartmentMasterData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGraphDepartmentMaster = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collGraphDepartmentMaster[i] = FillGraphDepartmentMaster(jsonObject.d.results[i]);
		}
		Success(collGraphDepartmentMaster);
	}

}
function FillGraphDepartmentMaster(result)
{
	var objGraphDepartmentMasterListEntity = new GraphDepartmentMasterListEntity();
	
	if(result.Id!= null)
	{
		objGraphDepartmentMasterListEntity.Id= result.Id;
	}
	else
	{
		objGraphDepartmentMasterListEntity.Id= '';
	}
	
	if(result.Title != null)
	{
		objGraphDepartmentMasterListEntity.Title = result.Title ;
	}
	else
	{
		objGraphDepartmentMasterListEntity.Title = '';
	}

	return objGraphDepartmentMasterListEntity;
}

/*
 * GET EMPLOYEE AND CHECK THE ROLE
 */
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
}

function getEmployeeDetails(Success,Failure)
{
	var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,RoleId/Id,RoleId/Sequence,IsActive,PlantId/Id,PlantId/Title";
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
	 if(result.RoleId.Sequence!=null)
	 {
    	objEmployeeDetails.RoleId= result.RoleId.Sequence;
     }
	else
	 {
		objEmployeeDetails.RoleId= '';
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