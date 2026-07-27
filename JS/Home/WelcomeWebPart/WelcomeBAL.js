var SelectedDepartmentValue = 'All';
var userDepratmentId = 0;
var userRoleSequence = 0;
var departmentTourId = '';
var departmentTourStartDate = '';
var PlantTourStartDate = '';
var PlantId = 0;
var departmentTourStatus = '';
var PlantTourStatus = '';
var RoleName = '';
var userRoleID = 0;
var userPlantId;
var Plantid;
var PlantTourId = '';
var departmentID = '';
var isWelcomeTourInitiated = false;
var DepartmentNameLeftNavi = "";
//var CriteriaNameLeftNavi="";
var LeftNaviDept = "";
var LeftNaviCriteria = "";

$(document).ready(function () {
    $(".form-select").select2();
    $('#ShowAnnoucements').show();
    HideAllWebParts();
    welcomeToUser();
    CurrentDateTime();
    setInterval(function () {
        CurrentDateTime();
    }, 60000);
    ShowLoader();
    getHomeEmployeeDetails(getHomeEmployeeDetailsSuccess, EmployeeDetailsFailure);
    //getCriteriaDetails(getCriteriaDetailsSuccess,getCriteriaDetailsFailure);
    initializeOwlCarousel('#CriticalCategoryId');
});

function HideAllWebParts() {
    $('#EmployeeDiv').hide();
    $('#ShowGraph').hide();
    $('#ShowObservation').hide();
    $('#tblTourScores').hide();
    $('#ShowCategory').hide();


}
function ShowAllWebParts() {
    $('#EmployeeDiv').show();
    $('#ShowGraph').show();
    $('#ShowObservation').show();
    $('#tblTourScores').show();
    $('#ShowCategory').show();
}

function welcomeToUser() {
    //var welcomehtml='<h4>Hello '+currentUser+'</h4>'
    $('#welcometoUser').text('Hello, ' + currentUser);
    var currentUserProfilePicture = getUserProfilePicture(currentUser);
    $("#userProfileImg").attr("src", currentUserProfilePicture);
}

function getUserProfilePicture(currentUser) {
    var accountName = encodeURIComponent(currentUser);
    var profilePictureUrl = "/_layouts/15/userphoto.aspx?size=L&accountname=" + accountName;
    return profilePictureUrl;
}

function CurrentDateTime() {
    var TodaysDate = moment().format('hh:mmA MMMM DD, YYYY ')

    $('#timeId').text(TodaysDate);

}

function BindEmpMasterLink(empLink, LeftNaviCriteria) {

    $('.custom-left-navigation ul li ul li').each(function () {
        if ($(this).find('a span.menu-item-text').text() == 'Employee Master') {
            $(this).find('a').removeAttr('href');
            $(this).find('a').attr('onclick', "gotoLink('" + empLink + "')");
        }
        else if ($(this).find('a span.menu-item-text').text() == 'Criteria Master') {
            $(this).find('a').removeAttr('href');
            $(this).find('a').attr('onclick', "gotoLink('" + LeftNaviCriteria + "')");
        }

    });
}

function gotoLink(empLink) {
    window.location.href = empLink;
}

/*Get Employee Details starts*/

function getHomeEmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {

        userDepratmentId = collEmployee[0].DepartmentId.toString();
        userRoleSequence = collEmployee[0].RoleSequence;
        userRoleID = collEmployee[0].RoleId.toString();
        userPlantId = collEmployee[0].PlantTitle;
        RoleName = collEmployee[0].RoleName;
        Plantid = collEmployee[0].PlantId.toString();
        EmployeeName = collEmployee[0].Title;
        DepartmentNameLeftNavi = collEmployee[0].DepartmentTitle;
        if (userRoleSequence == 30 || userRoleSequence == 20 || userRoleSequence == 10 || userRoleSequence == 15 || userRoleSequence == 35) {
            LeftNaviDept = SiteAbsoluteUrl + "/Lists/EmployeeList/AllItems.aspx";

            LeftNaviCriteria = SiteAbsoluteUrl + "/Lists/CriteriaMaster/AllItems.aspx?FilterField1=DepartmentId&FilterValue1=" + DepartmentNameLeftNavi + "&FilterType1=Lookup&viewid=156e4b64%2D2362%2D46f5%2D9a33%2D2dc4f5477c4f"
            BindEmpMasterLink(LeftNaviDept, LeftNaviCriteria);
            if (collEmployee[0].PlantId) {
                PlantId = collEmployee[0].PlantTitle;
                $('#hdnPlantId').val(collEmployee[0].PlantId);
                if (PlantId == "Bangalore") {
                    $('#EmployeeDiv').show();
                    $('#ShowGraph').show();
                    $('#ShowObservation').show();
                    $('#tblTourScores').show();
                }
                else {
                    ShowAllWebParts();
                }
            }
            getDepartments(getDepartmentsSuccess, getDepartmentsFailure);
        }
        else {
            alert('You are not authorized to access this page!')
        }
    }
    else {
        alert('Employee Name or Role not found !')
    }
    HideLoader();
}

function EmployeeDetailsFailure() {
    HideLoader();
}
/*Get Employee Details ends*/
function getDepartmentsSuccess(collDepartment) {
    if (collDepartment.length > 0) {
        var DepartmentDropDown = "<option value='All'>All Department</option>";

        for (var i = 0; i < collDepartment.length; i++) {
            if (collDepartment[i].Title == userPlantId) {
                DepartmentDropDown += "<option value=" + collDepartment[i].Id + ">" + collDepartment[i].Title1 + "</option>"
            }
            else if (userPlantId == "All Plant") {
                DepartmentDropDown += "<option value=" + collDepartment[i].Id + ">" + collDepartment[i].Title1 + "</option>"
            }
        }
        $("#DepartmentDropDownId").empty().append(DepartmentDropDown);

    }

    if (userRoleSequence == 30) {
        $('#DepartmentDropDownId').val('All').trigger('change');
        drpDepartmentChangefun();
    }
    else if (userRoleSequence == 20 || userRoleSequence == 10 || userRoleSequence == 15 || userRoleSequence == 35) {
        var RoleSequence = 20;
        $("#DepartmentDropDownId").find('option[value="' + userDepratmentId + '"]').attr('selected', 'selected');
        drpDepartmentChangefun();
        $('#DepartmentDropDownId').prop('disabled', true);
    }
}

function getDepartmentsFailure() {

}

function drpDepartmentChangefun() {
    var selectedDepartment = $('#DepartmentDropDownId').val();
    if (selectedDepartment != 'All') {
        SelectedDepartmentValue = selectedDepartment;
    }
    else {
        SelectedDepartmentValue = 'All'
    }
    // Function callbacks are in 
    rawCriticalCategories.length = 0;
    GetCategory(userRoleSequence, GetCategorySuccess, GetCategoryFailure);

    if (SelectedDepartmentValue == 'All') {
        GetObservationReportData(0, ObservationReportSuccess, ObservationReportFailure);
    }
    else {
        //GetObservationReportData(selectedDepartment, ObservationReportSuccess, ObservationReportFailure);
        ObservationReportSuccessData();
    }

    if (selectedDepartment != 'All') {
        departmentID = selectedDepartment;
    }
    else {
        departmentID = ''
    }

    rawDepartments.length = 0;
    $('#tourChart').css('height', '500px');
    GetGraphDepartmentMasterData(GetGraphDepartmentMasterDataSuccess, GetGraphDepartmentMasterDataFailure);
}


// save department tour on plan tour click

function AddDepartmentTourOnClick() {
    ShowLoader();
    if (userRoleSequence == 20) {
        //GetDepartmentTourDetails(userDepratmentId, userRoleSequence, GetDepartmentTourDetailsSuccess, GetDepartmentTourDetailsFailure);
        if(userDepratmentId == 135){
            //SaveQualityDataItem();
            tourPopup();
        }
        else{
            SaveDepartmentDataItem();
        }
    }
    else if (userRoleSequence == 30) {
        GetPTourItem(userRoleSequence, GetPTourItemSuccess, GetPTourItemFailure)
    }

    else {
        alert("Only Plant Manager and HOD are authorized to Plant Tour")
        HideLoader();
    }
}

function tourPopup() {
sessionStorage.setItem("shiftValue", '');
const shiftPopup = document.querySelector("#shiftPopup");
  shiftPopup.classList.add("is-popup-active");
  $('#shiftPopup').addClass('is-popup-active');
  $('#tourSelect').select2({ dropdownParent: $('#shiftPopup .popup-body') });
  $('#shiftSelect').select2({ dropdownParent: $('#shiftPopup .popup-body') });
  HideLoader();
}


/*Get Department Tour starts*/
function GetDepartmentTourDetailsFailure() { }

function GetDepartmentTourDataDetailsSuccess(data) {

}

async function GetDepartmentTourDetailsSuccess(data) {
    var AccessToken = await getAccessToken();
    var tableName = "cr3ea_prod_departmenttours";
    var apiVersion = "9.2";
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=cr3ea_prod_departmenttourid eq '" + DepartmentTourId + "'";
    if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    try{
        var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",		
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
    
    const response = await fetch( apiUrl, {
        method: "GET",
        headers: header,success: function (data) {
        getDepartmentTourDetailsSuccess(data);
      }
      } );
      let data = await response.json();
      console.log(data);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      GetDepartmentTourDetailsSuccess(data?.value);
    }
    catch{
        console.log("something went wrong");
    }
    var departmentTourId = '';
    var todaysDate = moment().format('MM-DD-YYYY');
    var TourDate = '';
    if (data.length > 0) {

        for (i = 0; i < data.length; i++) {
            departmentTourStatus = data[i].cr3ea_status;
            departmentTourStartDate = data[i].cr3ea_tourstartdate;
            if (data[i].cr3ea_tourstartdate != '' && data[i].cr3ea_tourstartdate != undefined) {
                TourDate = moment(data[i].cr3ea_tourstartdate).format('MM-DD-YYYY');
            }
            if (TourDate == todaysDate) {
                departmentTourId = data[i].cr3ea_prod_departmenttourid;
                departmentTourStartDate = data[i].cr3ea_tourstartdate;
            }

        }
    }
}
}

function GetDepartmentTourDetailsSuccess(data) {
    departmentTourId = '';
    var todaysDate = moment().format('MM-DD-YYYY');
    var TourDate = '';
    if (data.length > 0) {

        for (i = 0; i < data.length; i++) {
            departmentTourStatus = data[i].Status;
            departmentTourStartDate = data[i].TourStartDate;
            if (data[i].TourStartDate != '' && data[i].TourStartDate != undefined) {
                TourDate = moment(data[i].TourStartDate).format('MM-DD-YYYY');
            }
            if (TourDate == todaysDate) {
                departmentTourId = data[i].Id;
                departmentTourStartDate = data[i].TourStartDate;

            }

        }
    }
    BindUrlforDepartmentTour();
}


function BindUrlforDepartmentTour() {
    if (userRoleSequence == 20) {
        if (departmentTourId != '') {
            if (!isWelcomeTourInitiated) {
                isWelcomeTourInitiated = true;
                $('#LinkPlantTour').css('opacity', '.5');
                $('#LinkPlantTour').removeAttr('onclick');
                window.location.href = WebAbsoluteUrl + "/Pages/DepartmentTour.aspx?TourId=" + departmentTourId;
                $('#LinkPlantTour').removeAttr('href');
            }
            HideLoader();
        }
        else {
            if (!isWelcomeTourInitiated) {
                isWelcomeTourInitiated = true;
                $('#LinkPlantTour').removeAttr('onclick');
                $('#LinkPlantTour').css('opacity', '.5');
                SaveDepartmentTItem();
            }
        }
    }


}

/*Create Department Tour */

async function SaveDepartmentDataItem() {
    var TourStartDateDTour = moment().format('M/D/YYYY h:mm A');
    var TourByDTour = _spPageContextInfo.userId.toString();
    var TitleDTour = RoleName + '_' + moment().format('MM-DD-YYYY');
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_departmenttours";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName ;
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
    const dataToSave = {
        cr3ea_departmentid: userDepratmentId,
        cr3ea_tourstartdate: TourStartDateDTour,
        cr3ea_tourby: EmployeeName,
        cr3ea_status: 'In Progress',
        cr3ea_plantid: Plantid,
        cr3ea_roleid: userRoleID,
        cr3ea_title: TitleDTour,
    };

const isPlantTourExist = await fetch(apiUrl+"?$filter=cr3ea_status eq 'In Progress' and cr3ea_departmentid eq '"+userDepratmentId+"'&$top=1",{
        method: "GET",
        headers: header,
});
 let plant_tour_res = await isPlantTourExist.json();
 if(plant_tour_res.value.length == 0){
    const response = await fetch( apiUrl, {
        method: "POST",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      let data = await response.json();
      console.log(data);
      var UniqueValID = data.cr3ea_prod_qualitytourid;
      SaveQTourItemSuccess(UniqueValID)
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
    }else{      
      SaveQTourItemSuccess(plant_tour_res.value[0].cr3ea_prod_qualitytourid);   
    }
 }

}

/*Create Quality Tour */

async function SaveQualityDataItem() {
    const shift = document.getElementById('shiftSelect').value;
    sessionStorage.setItem("shiftValue", shift);
    var TourStartDateDTour = moment().format('MM-DD-YYYY HH:mm:ss');   
    var TourByDTour = _spPageContextInfo.userId.toString();
    var TitleDTour = RoleName + '_' + moment().format('MM-DD-YYYY');
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_qualitytours";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName ;
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
    const dataToSave = {
        cr3ea_departmentid: userDepratmentId,
        cr3ea_tourstartdate: TourStartDateDTour,
        cr3ea_tourby: EmployeeName,
        cr3ea_status: 'In Progress',
        cr3ea_plantid: Plantid,
        cr3ea_observedby: EmployeeName,
        cr3ea_roleid: userRoleID,
        cr3ea_title: TitleDTour,
    };

const isPlantTourExist = await fetch(apiUrl+"?$filter=cr3ea_status eq 'In Progress' and cr3ea_departmentid eq '"+userDepratmentId+"'&$top=1",{
        method: "GET",
        headers: header,
});
 let plant_tour_res = await isPlantTourExist.json();
 if(plant_tour_res.value.length == 0){
    const response = await fetch( apiUrl, {
        method: "POST",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      let data = await response.json();
      console.log(data);
      var UniqueValID = data.cr3ea_prod_qualitytourid;
      SaveQTourItemSuccess(UniqueValID)
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
    }else{      
      SaveQTourItemSuccess(plant_tour_res.value[0].cr3ea_prod_qualitytourid);   
    }
 }

}

/*function SaveDepartmentTItem() {
    ShowLoader();
    var objDepartmentTourListEntity = new DepartmentTourListEntity();
    objDepartmentTourListEntity.DepartmentId = userDepratmentId;
    objDepartmentTourListEntity.TourStartDate = moment().format('MM-DD-YYYY HH:mm:ss');
    objDepartmentTourListEntity.TourBy = _spPageContextInfo.userId;
    objDepartmentTourListEntity.Status = 'In Progress';
    objDepartmentTourListEntity.PlantId = PlantId;
    objDepartmentTourListEntity.RoleId = userRoleID
    objDepartmentTourListEntity.Title = RoleName + '_' + moment().format('MM-DD-YYYY');
    SaveDTourItem(objDepartmentTourListEntity, SaveDTourItemSuccess, SaveDepartmentTourItemFailure)

}*/

function SaveDTourItemSuccess(ID) {
    var DepartTourId = ID;
    newUrl = "/sites/Mrs_Bectors_PTMS/Pages/DepartmentTour.aspx?TourId=" + DepartTourId;
    window.location.href = newUrl;
}

function SaveQTourItemSuccess(ID) {
    var QualityTourId = ID;
    var ProductValue = $('#tourSelect').val();
    if(ProductValue == 'Product Quality Index'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/QualityTour.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Cream Percentage Checklist'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/Cream.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Sieves And Magnets Old Plant'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/SievesAndMagnetsOldPlant.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Sieves And Magnets New Plant'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/SievesAndMagnetsNewPlant.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Product Monitoring Record'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/ProductMonitoring.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Code Verification Record'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/CodeVerification.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'OPRP And CCP Record'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/OPRP&CCP.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Baking Process Record'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/Baking.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Seal Integrity Test'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/VLT.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Area Line Clearance Checklist'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/ALC.aspx?TourId=" + QualityTourId;
    }
    else if (ProductValue == 'Net Weight Monitoring Record'){
        newUrl = "/sites/Mrs_Bectors_PTMS/Pages/NetWeight.aspx?TourId=" + QualityTourId;
    }
   
    window.location.href = newUrl;
}
function tourPopupclose() {
sessionStorage.setItem("shiftValue", '');
const shiftPopup = document.querySelector("#shiftPopup");
  shiftPopup.classList.remove("is-popup-active");
  HideLoader();
}
function SaveDepartmentTourItemFailure() {
    HideLoader();
}
/*Create Department Tour */
/*Get Department Tour ends*/


/*Get Plant Tour starts*/
function GetPTourItemFailure() {
    HideLoader();
}


function GetPTourItemSuccess(data) {
    PlantTourId = '';
    var todaysDate = moment().format('MM-DD-YYYY');
    var TourDate = '';
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            PlantTourStatus = data[i].Status;
            PlantTourStartDate = data[i].TourStartDate;
            if (data[i].TourStartDate != '' && data[i].TourStartDate != undefined) {
                TourDate = moment(data[i].TourStartDate).format('MM-DD-YYYY');
            }
            if (TourDate == todaysDate) {
                PlantTourId = data[i].Id;
                PlantTourStartDate = data[i].TourStartDate;
            }

        }
    }
    BindUrlforPlantTour();
}

function BindUrlforPlantTour() {
    if (userRoleSequence == 30) {
        if (PlantTourId != '') {
            if (!isWelcomeTourInitiated) {
                isWelcomeTourInitiated = true;
                $('#LinkPlantTour').css('opacity', '.5');
                $('#LinkPlantTour').removeAttr('onclick');
                window.location.href = WebAbsoluteUrl + "/Pages/PlantTour.aspx?PTourId=" + PlantTourId;
                $('#LinkPlantTour').removeAttr('href');
            }
            HideLoader();
        }
        else {
            if (!isWelcomeTourInitiated) {
                isWelcomeTourInitiated = true;
                $('#LinkPlantTour').removeAttr('onclick');
                $('#LinkPlantTour').css('opacity', '.5');
                SavePlanTItem();
            }
        }
    }
}


/*Create Plant Tour*/

function SavePlanTItem() {
    ShowLoader();
    var objPlantTourListEntity = new PlantTourListEntity();
    objPlantTourListEntity.DepartmentId = userDepratmentId;
    objPlantTourListEntity.TourStartDate = moment().format('MM-DD-YYYY HH:mm:ss');
    objPlantTourListEntity.TourBy = _spPageContextInfo.userId;
    objPlantTourListEntity.Status = 'In Progress';
    objPlantTourListEntity.PlantId = PlantId;
    objPlantTourListEntity.RoleId = userRoleID
    objPlantTourListEntity.Title = RoleName + '_' + moment().format('MM-DD-YYYY');
    SavePTourItem(objPlantTourListEntity, SavePTourItemSuccess, SaveDepartmentTourItemFailure)

}


function SavePTourItemSuccess(data) {
    var PlantTourId = data.d.Id;
    newUrl = "/sites/Mrs_Bectors_PTMS/Pages/PlantTour.aspx?PTourId=" + PlantTourId;
    window.location.href = newUrl;

}
/*Create Plant Tour*/

/*Get Plant Tour ends*/

async function ObservationReportSuccessData() {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_action eq 'Rejected' and cr3ea_status ne 'Closed' and cr3ea_plantid eq '" + Plantid + "')&$orderby=createdon desc";
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
   /*const response = await fetch( apiUrl, {
        method: "GET",
        headers: header,success: function (data) {
        ObservationReportData(data);
      }
      } );*/
       $.ajax( {
      url: apiUrl,
      type: "GET",
      headers: header,
      success: function ( data ) {
         ObservationReportData(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
  }

function ObservationReportData(collObservationReport) {
    //debugger;
    var temTableHTML = '';
    if (collObservationReport.value.length > 0) {
        var tempObservationReportHtml = '';
        temTableHTML += '<div class="table-wrapper">' +
            '<table class="table tblAdminDashboard" >' +
            '<thead>' +
            '<tr>' +
            '<th>ID</th>' +
            '<th>Observation</th>' +
            '<th>Observed On</th>' +


            '<th>Category</th>' +
            '<th>Where</th>' +
            '<th>What</th>' +
            //'<th>Criteria</th>'+
            '<th>Near Miss</th>' +
            ' </tr>' +
            ' </thead> ' +
            '<tbody id="ObservationReportId">' +
            '</tbody >' +
            '</table>' +
            '</div>'; 
var recordCount = 0;
        for (var i = 0; i < collObservationReport.value.length; i++) {
            PlantIdValue1 = PlantId;
            if ((PlantIdValue1 == userPlantId || userPlantId == "All Plant") && EmployeeName == collObservationReport.value[i].cr3ea_observedperson || userRoleSequence == 35)  {
                
                if (recordCount >= 4) {             
                break;  
                }
                var Severity = '';
                var observedDate = '';
                if (collObservationReport.value[i].cr3ea_severityid == '3') {
                    Severity = '<div class="form-check"><input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" checked></div>';
                }
                else {
                    Severity = '<div class="form-check"><input class="form-check-input form-check-input-sm" type="checkbox" name="Severity" disabled="disabled" value="Severity" ></div>';
                }

                var Categorytitle = '';

                if (collObservationReport.value[i].cr3ea_categoryid == null) {
                    Categorytitle = '';
                }
                else{
                    Categorytitle = collObservationReport.value[i].cr3ea_categorytitle;
                }

                tempObservationReportHtml += '<tr>' +
                    '<td><a href="/sites/Mrs_Bectors_PTMS/Pages/ObservationClosure.aspx?ReqId=' + collObservationReport.value[i].cr3ea_prod_observationsid + '">' + (i+1) + '</a></td>' +
                    '<td>' + collObservationReport.value[i].cr3ea_observation + '</td>' +

                    '<td>' + moment(collObservationReport.value[i].cr3ea_observeddate).format('DD-MMM-YY') + '</td>' +
                    '<td>' + Categorytitle + '</td>' +
                    //'<td>'+collObservationReport[i].cr3ea_areaid +'</td>'+
                    '<td>' + collObservationReport.value[i].cr3ea_where + '</td>' +
                    '<td>' + collObservationReport.value[i].cr3ea_what + '</td>' +
                    //'<td>'+collObservationReport[i].cr3ea_criteria +'</td>'+
                    '<td>' + Severity + '</td>' +
                    //'<td>'+collObservationReport.value[i].cr3ea_severityid +'</td>'+						 
                    '</tr>';
                    recordCount++;
            }
        }
        $('#HomeObservationTableId').empty().append(temTableHTML);
        $('#ObservationReportId').empty().append(tempObservationReportHtml);

        var currentId = moment().format('hhmmss');
        $('#tblObservationReport table').attr('id', 'tblObservationReport_' + currentId);
        //  InitializeTable('tblObservationReport_'+currentId);
    }

    else {
        temTableHTML += '<div class="table-wrapper">' +
            '<table class="table tblAdminDashboard" >' +
            '<thead>' +
            '<tr>' +
            '<th>ID</th>' +
            '<th>Observation</th>' +
            '<th>Observed On</th>' +
            '<th>Category</th>' +
            '<th>Where</th>' +
            '<th>What</th>' +
            //'<th>Criteria</th>'+
            '<th>Near Miss</th>' +
            '</tr>' +
            '</thead> ' +
            '<tbody id="ObservationReportId">' +
            '</tbody>' +
            '</table>' +
            '</div>';

        var noRecordRow = '<tr>' +
            '<td colspan="9">No Records found.</td>' +
            '</tr>';

        $('#HomeObservationTableId').empty().append(temTableHTML);
        $("#ObservationReportId").empty().append(noRecordRow);
    }
} 

$('#tblObservationReport table').dataTable({
	    "paging":   false,
        "ordering": false,
        "info":     false,
        "bFilter":false,
		"pageLength": 5,
	});

function ObservationReportFailureData() {
    alert('Failure in Open Observation');
}