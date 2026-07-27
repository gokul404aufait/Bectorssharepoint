var plantTourListName = 'PlantTour';

function PlantTourListEntity()
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
}

function GetScoreOfPlantTour(Success,Failure)
{
	//RequestItemId=$('#RequestId').val();
	SelectQuery = "?$select=Id,Title,FinalComment,DepartmentId/Id,TourStartDate,TourCompletionDate,TotalCriterias,TotalObservations,TourScore,TourBy,Status"
    ,filterQuery= "&$filter=BasicDetailsId/Id eq "+RequestItemId
    ,expandQuery = "&$expand=BasicDetailsId"
    ,TopQuery = "&$top=4999"
   	var tempQuery = SelectQuery + expandQuery +filterQuery+TopQuery ;
	var requestQuery = requestURL.format(WebAbsoluteUrl,plantTourListName, tempQuery);
	getListItemByQuery(requestQuery, onFillScoreOfPlantTour, Success, Failure);

}

function onFillScoreOfPlantTour(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collUPNMaster= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collUPNMaster[i] = FillGetScoreOfPlantTour(jsonObject.d.results[i]);
		}
		Success(collUPNMaster);
	}

}

function FillGetfinances(result)
{
	var objfinanceListEntity= new financeListEntity();
	objfinanceListEntity.Id  = result.Id;	
if (result.Id != null) {
    objfinanceListEntity.Id = result.Id 
} else {
    objfinanceListEntity.Id = '';
}
	
	
if (result.Title != null) {
    objfinanceListEntity.Title = result.Title
} else {
    objfinanceListEntity.Title = '';
}

if (result.Company!= null) {
    objfinanceListEntity.Company= result.Company
} else {
    objfinanceListEntity.Company= '';
}
if (result.Contact!= null) {
    objfinanceListEntity.Contact= result.Contact
} else {
    objfinanceListEntity.Contact= '';
}
if (result.Country!= null) {
    objfinanceListEntity.Country= result.Country
} else {
    objfinanceListEntity.Country= '';
}
if (result.BasicDetailsId.ID!= null) 
{
    objfinanceListEntity.BasicDetailsId= result.BasicDetailsId.ID
    if(result.BasicDetailsId.Title!=null)
    {
	objfinanceListEntity.BasicDetailsTitle= result.BasicDetailsId.Title;
    }
    else{
        objfinanceListEntity.BasicDetailsTitle= '';

    }
} 
else
 {
	objfinanceListEntity.BasicDetailsId= '';
	objfinanceListEntity.BasicDetailsTitle= '';

}

	return objfinanceListEntity;
}	
