var ObservationReportListName = 'Observations';

function ObservationReportListEntity() {
    this.Id
        , this.Title
        , this.DepartmentId
        , this.CategoryId
        , this.What
        , this.Where
        , this.Observation
        , this.CorrectiveAction
        , this.SeverityId
        , this.ObservedBy
        , this.ObservedDate
        , this.Status
        , this.Criteria
        , this.AreaIdTitle
        , this.PlantId
        , this.SeverityIdTitle
        , this.CategoryIdTitle//not included

}

function GetObservationReportData(DepartmentId, Success, Failure) {
    var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,CategoryId/Id,CategoryId/Title,What,Where,Observation,CorrectiveAction,SeverityId/Id,SeverityId/Title,ObservedBy/Title,AreaId/Id,AreaId/Title,PlantId/Title,ObservedDate,Status,Criteria";
    var orderByQuery = "&$orderBy=Id desc";
    if (DepartmentId == 0) {
        var filterQuery = "&$filter=Status eq 'Pending' and Action eq 'Rejected'";
    }
    else {
        var filterQuery = "&$filter=Status eq 'pending' and DepartmentId eq " + DepartmentId + " and Action eq 'Rejected'";

    }
    var TopQuery = "&$top=4";
    var ExpandQuery = "&$expand=DepartmentId,CategoryId,SeverityId,AreaId,ObservedBy,PlantId";

    var tempQuery = SelectQuery + orderByQuery + TopQuery + filterQuery + ExpandQuery;
    var requestQuery = requestURL.format(WebAbsoluteUrl, ObservationReportListName, tempQuery);
    getListItemByQuery(requestQuery, onFillObservationReport, Success, Failure);

}
function onFillObservationReport(data, Success, Failure) {
    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collObservationReport = new Array();
        for (var i = 0; i < jsonObject.d.results.length; i++) {
            collObservationReport[i] = FillFormsForcollObservationReport(jsonObject.d.results[i]);
        }

        Success(collObservationReport);
    }
}

function FillFormsForcollObservationReport(result) {

    var objObservationReport = new ObservationReportListEntity();

    objObservationReport.Id = result.Id;

    if (result.Title != null) {
        objObservationReport.Title = result.Title;
    }
    else {
        objObservationReport.Title = '';
    }
    if (result.DepartmentId.Title != null) {
        objObservationReport.DepartmentIdTitle = result.DepartmentId.Title;
    }
    else {
        objObservationReport.DepartmentIdTitle = '';
    }
    if (result.CategoryId.Id != null) {
        objObservationReport.CategoryId = result.CategoryId.Id;
        if (result.CategoryId.Title != null) {
            objObservationReport.CategoryIdTitle = result.CategoryId.Title;
        }
        else {
            objObservationReport.CategoryIdTitle = '';
        }
    }
    else {
        objObservationReport.CategoryId = '';
        objObservationReport.CategoryIdTitle = '';

    }

    if (result.What != null) {
        objObservationReport.What = result.What;
    }
    else {
        objObservationReport.What = '';
    }

    if (result.Where != null) {
        objObservationReport.Where = result.Where;
    }
    else {
        objObservationReport.Where = '';
    }


    if (result.Observation != null) {
        objObservationReport.Observation = result.Observation;
    }
    else {
        objObservationReport.Observation = '';
    }
    if (result.Criteria != null) {
        objObservationReport.Criteria = result.Criteria;
    }
    else {
        objObservationReport.Criteria = '';
    }

    if (result.CorrectiveAction != null) {
        objObservationReport.CorrectiveAction = result.CorrectiveAction;
    }
    else {
        objObservationReport.CorrectiveAction = '';
    }
    if (result.AreaId.Title != null) {
        objObservationReport.AreaIdTitle = result.AreaId.Title;
    }
    else {
        objObservationReport.AreaIdTitle = '';
    }
    if (result.PlantId.Title != null) {
        objObservationReport.PlantId = result.PlantId.Title;
    }
    else {
        objObservationReport.PlantId = '';
    }
    if (result.SeverityId.Title != null) {
        objObservationReport.SeverityIdTitle = result.SeverityId.Title;
    }
    else {
        objObservationReport.SeverityIdTitle = '';
    }
    if (result.ObservedBy.Title != null) {
        objObservationReport.ObservedByTitle = result.ObservedBy.Title;
    }
    else {
        objObservationReport.ObservedByTitle = '';
    }
    if (result.Status != null) {
        objObservationReport.Status = result.Status;
    }
    else {
        objObservationReport.Status = '';
    }

    if (result.ObservedDate != null) {
        objObservationReport.ObservedDate = result.ObservedDate;
    }
    else {
        objObservationReport.ObservedDate = '';
    }


    return objObservationReport;
}

var EmployeeListName = 'EmployeeList';
function EmployeeListEntity() {
    this.Id
        , this.Title
        , this.EmployeeName
        , this.DepartmentId
        , this.RoleId
        , this.RoleName
        , this.IsActive
        , this.RoleSequence
        , this.PlantId
        , this.PlantTitle
}

function getEmployeeDetailsForObservation(Success, Failure) {
    var SelectQuery = "?$select=Id,Title,DepartmentId/Id,DepartmentId/Title,RoleId/Id,RoleId/field_4,RoleId/field_1,IsActive,PlantId/Id,PlantId/Title";
    var filterQuery = "&$filter=IsActive eq 1 and EmployeeName/Id eq " + _spPageContextInfo.userId;
    var ExpandQuery = "&$expand=DepartmentId,RoleId,PlantId";

    var tempQuery = SelectQuery + filterQuery + ExpandQuery;
    var requestQuery = requestURL.format(WebAbsoluteUrl, EmployeeListName, tempQuery);
    getListItemByQuery(requestQuery, onFillEmployeeListName, Success, Failure);
}

function onFillEmployeeListName(data, Success, Failure) {
    if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collEMP = new Array();
        for (var i = 0; i < jsonObject.d.results.length; i++) {
            collEMP[i] = FillEmployeeListName(jsonObject.d.results[i]);
        }
        Success(collEMP);
    }


}

function FillEmployeeListName(result) {
    var objEmployeeDetails = new EmployeeListEntity();

    objEmployeeDetails.Id = result.Id;

    if (result.Title != null) {
        objEmployeeDetails.Title = result.Title;
    }
    else {
        objEmployeeDetails.Title = '';
    }

    if (result.DepartmentId.Id != null) {
        objEmployeeDetails.DepartmentId = result.DepartmentId.Id;
    }
    else {
        objEmployeeDetails.DepartmentId = '';
    }
    if (result.RoleId.Id != null && result.RoleId.field_1 != undefined) {
        objEmployeeDetails.RoleId = result.RoleId.Id;
        if (result.RoleId.field_1 != null && result.RoleId.field_1 != undefined) {
            objEmployeeDetails.RoleName = result.RoleId.field_1;
        }
        else {
            objEmployeeDetails.RoleName = '';
        }
        if (result.RoleId.field_4 != null && result.RoleId.field_4 != undefined) {
            objEmployeeDetails.RoleSequence = result.RoleId.field_4;
        }
        else {
            objEmployeeDetails.RoleSequence = '';
        }

    }
    else {
        objEmployeeDetails.RoleSequence = '';
        objEmployeeDetails.RoleId = '';
        objEmployeeDetails.RoleName = '';
    }

    if (result.IsActive != null) {
        objEmployeeDetails.IsActive = result.IsActive;
    }
    else {
        objEmployeeDetails.IsActive = '';
    }

    if (result.PlantId.Id != null && result.PlantId.Id != undefined) {
        objEmployeeDetails.PlantId = result.PlantId.Id;

        if (result.PlantId.Title != null) {
            objEmployeeDetails.PlantTitle = result.PlantId.Title;
        }
        else {
            objEmployeeDetails.PlantTitle = '';
        }
    }
    else {
        objEmployeeDetails.PlantTitle = '';
        objEmployeeDetails.PlantId = '';
    }
    return objEmployeeDetails;

}



