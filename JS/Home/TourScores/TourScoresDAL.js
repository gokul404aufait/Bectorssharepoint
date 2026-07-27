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
	,this.DepartmentId
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
}
 
function GetDepartmentTour(DepartmentId,Success,Failure){
		
	SelectQuery ="?$select=ID,Title,FinalComment,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy/Title,TourBy/Id,Status,RoleId/field_4"
	,expandQuery = "&$expand=DepartmentId,RoleId,TourBy";
	var filterQuery = '';
	if(DepartmentId != ''){
		//filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
	filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed'";

	}
	else{
		//filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate le '"+today+"'";
		filterQuery = "&$filter=Status eq 'Completed'";

	}
	
	var orderQuery = "&$orderBy=ID desc";
	
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
		objDepartmentTourListEntity.TourStartDate =result.TourStartDate; //  moment(result.TourStartDate).format('DD-MMM-YYYY hh:mm:ss');
	}
	else
	{
		objDepartmentTourListEntity.TourStartDate = '';
	}

	if(result.TourCompletionDate != null)
	{
		objDepartmentTourListEntity.TourCompletionDate= result.TourCompletionDate; // moment(result.TourCompletionDate).format('DD-MMM-YYYY hh:mm:ss');
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


/*Entity for the Department Scores*/
function DepartmentScoresListEntity()
{
this.TotalObservationbyHOD
,this.TourScorebyHOD
,this.FinalCommentbyHOD
,this.DurationbyHOD
,this.TotalObservationbyPant
,this.TourScorebyPant
,this.FinalCommentbyPant
,this.DurationbyPlant
,this.TourDate
}