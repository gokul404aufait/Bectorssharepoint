var userDepratmentId = 0;
var userRoleSequence = 0;
var userRoleName = '';
var RawDepartmentArray = new Array();
var RawAreaArray = new Array();
var RawCategoryArray = new Array();
var RawCriteriaArray = new Array();
var RawSeverityArray = new Array();
var DepartmentTourId = '';
var ObservationData = new Array();
var criteriaCount = 0;
var NearMissChkBox = false; 
var ObservationCount = 0;
var ImageDiv = '';
var PlantId = null;
var imageID = '';
var UserRoleId = 0;
var EmployeeName = '';
var selectedId = '';

$( document ).ready( function () {
  DepartmentTourId = GetQueryStringParams( 'TourId' );
  //getAccessToken();
  GetObservationDataFetch();
  PlantStartDate = GetQueryStringParams( 'StartDate' );
  if ( PlantStartDate != '' ) {
    CurrentDate = moment( PlantStartDate ).format( 'YYYY-MM-DD' );
    CurrentDay = moment( PlantStartDate ).format( 'dddd' );
  }
  else {
    CurrentDate = moment().format( 'YYYY-MM-DD' );
    CurrentDay = moment().format( 'dddd' );
  }

  getEmployeeDetails( EmployeeDetailsSuccess, EmployeeDetailsFailure );
  $( '#lblFinishedTour' ).hide()
  $( ".comment-section textarea" ).on( 'focus', function () {
    $( this ).prop( "rows", "2" );
  } );
  $( ".comment-section textarea" ).on( 'blur', function () {
    $( this ).prop( "rows", "1" );
  } );

} )

function ShowHideIcon() { }

function EmployeeDetailsSuccess( collEmployee ) {
  if ( collEmployee.length > 0 ) {
    PlantId = collEmployee[ 0 ].PlantId.toString();
    EmployeeName = collEmployee[ 0 ].Title;
    userDepratmentId = collEmployee[ 0 ].DepartmentId.toString();
    userRoleSequence = collEmployee[ 0 ].RoleSequence;
    userRoleName = collEmployee[ 0 ].RoleName;
    UserRoleId = collEmployee[ 0 ].RoleId;
    $( '#hdnPlantId' ).val( collEmployee[ 0 ].PlantId );
    $( '#hdnRoleName' ).val( collEmployee[ 0 ].RoleName );
    $( '#hdnDepartmentId' ).val( collEmployee[ 0 ].DepartmentId );
    if ( userDepratmentId == '' && userRoleSequence == '' ) {
      alert( 'Employee Name or Role not found !' )
    } else {
      var SeletctedManagerFilter = '';
      if ( userRoleSequence == 20 ) {
        SeletctedManagerFilter = "&$filter=Id eq " + userDepratmentId
      } else if ( userRoleSequence == 30 ) {
        SeletctedManagerFilter = "&$filter=PlantManager/Id eq " + _spPageContextInfo.userId
      } else {
        SeletctedManagerFilter = "";
      }
      //GetDTourItem( DepartmentTourId, userRoleSequence, GetDTourItemSuccess, GetDTourItemFailure )
      GetDepartmentTourSuccess();
    }
  } else {
    alert( 'Employee Name or Role not found !' );
  }
}

async function GetDepartmentTourSuccess(data) {
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
        GetDTourItemSuccess(data);
      }
      } );
      let data = await response.json();
      console.log(data);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      GetDTourItemSuccess(data?.value);
    }
    catch{
        console.log("something went wrong");
    }
    }
}

var IsTourCompleted = false;
function GetDTourItemSuccess( data ) {
  if ( data.length > 0 ) {
    if ( data[ 0 ].Status == 'Completed' ) {
      IsTourCompleted = true;
      $( '#lblstartedTour' ).text( moment( data[ 0 ].cr3ea_tourstartdate ).format( 'DD-MMM-YY' ) );
      $( '#lblstartedTour' ).append( $( " " ) );
      var TourCompletionDate = moment( data[ 0 ].cr3ea_tourcompletiondate ).format( 'DD-MMM-YY' );
      var startTime = moment( data[ 0 ].cr3ea_tourstartdate );//.format('YYYY-MM-DD hh:mm:ss');
      var CompletionTime = moment( data[ 0 ].cr3ea_tourcompletiondate );//.format('YYYY-MM-DD hh:mm:ss');
      var totalminutes = CompletionTime.diff( startTime, 'minutes' );
      var totalHours = parseInt( totalminutes / 60 );
      var totalMinutes = parseInt( totalminutes % 60 );
      if ( totalHours >= 10 ) {
        var TimeDuration = totalHours + ':' + ( '0' + totalMinutes ).slice( -2 );

      } else {
        var TimeDuration = ( '0' + totalHours ).slice( -2 ) + ':' + ( '0' + totalMinutes ).slice( -2 );
      }
      $( '#TimeDuration' ).text( TimeDuration );
      $( '#hdnDepartmentStatus' ).val( data[ 0 ].cr3ea_status )
      $( '#txtFinalComment' ).val( data[ 0 ].cr3ea_finalcomment )
      $( '#FinishedTourDateId' ).text( TourCompletionDate );
      $( '#lblFinishedTour' ).show()
    } else {
      IsTourCompleted = false;
      $( '#lblstartedTour' ).text( moment( data[ 0 ].cr3ea_tourstartdate ).format( 'DD-MMM-YY' ) );
      $( '#lblstartedTour' ).append( $( " " ) );
      var CurrentTimeMonth = moment().format( 'DD/MMM/YY HH:mm:ss' );
      var startTime = moment( data[ 0 ].cr3ea_tourstartdate );
      var CompletionTime = moment();//.format('YYYY-MM-DD hh:mm:ss');
      var totalminutes = CompletionTime.diff( startTime, 'minutes' );
      var totalHours = parseInt( totalminutes / 60 );
      var totalMinutes = parseInt( totalminutes % 60 );
      if ( totalHours >= 10 ) {
        var TimeDuration = totalHours + ':' + ( '0' + totalMinutes ).slice( -2 );

      } else {
        var TimeDuration = ( '0' + totalHours ).slice( -2 ) + ':' + ( '0' + totalMinutes ).slice( -2 );
      }
      $( '#TimeDuration' ).text( TimeDuration );
    }

    getCriterias( userRoleSequence, userDepratmentId, getCriteriasSuccess, getCriteriasFailure )
  }
  else {
    ShowLoader();
    alert( 'You are not authorized to view this tour' );
    //window.location.href = WebAbsoluteUrl + '/Pages/Home.aspx';
  }

}

function GetDTourItemFailure() {

}
//success call back function for GetObservationDataFetch
function GetObservationDataFetchSuccess(data) {
    ObservationData = data;
    ObservationCount = data.length;
    if (data.length > 0) {
 
      for (i = 0; i < data.length; i++) {
        if (data[i].cr3ea_categoryid) {
          $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_ObservationClearId").val(data[i].cr3ea_observation)
;
          $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_ObservationId_" + data[i].cr3ea_prod_observationsid + "_ClearBtnId");
          $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_ObservationId").val(data[i].cr3ea_observation);
 
          $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
          if (data[i].cr3ea_action == 'Approved') {
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_ApprovedRdButton").prop("checked", true);
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").show();
          }
          else if (data[i].cr3ea_action == 'Rejected') {
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_RejectedRdButton").prop("checked", true);
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").show();
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_divNearMissId").show();
 
            if (data[i].cr3ea_severityid == 3) {
              $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_NearMissId").prop("checked", true);
            }
          }
          else {
            if (data[i].cr3ea_categoryid) {
              $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_NApplicableRdButton").prop("checked", true);
              $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").hide();
            } else {
              let NotApplicableBtnId = `Dept_${data[i].cr3ea_areaid}_Cat___CategoryID___Crit_${data[i].cr3ea_criteriaid}_NApplicableRdButton`;
              let CNCFormID = `Dept_${data[i].cr3ea_areaid}_Cat___CategoryID___Crit_${data[i].cr3ea_criteriaid}_CNCFormID`;
 
              $("#" + NotApplicableBtnId).prop("checked", true);
              $("#" + CNCFormID).hide();
            }
          }
 
          $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_BtnId").html('Update');
          imageID = "Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid;
          ImageDiv = "Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_AttachDisId";
 
          if (data[i].Attachment) {
            $("#Dept___" + data[i].cr3ea_areaid + "_Cat_" + data[i].cr3ea_categoryid + "_Crit_" + data[i].cr3ea_criteriaid + "_ObservationAttachID").val(data[i].cr3ea_observation)
;
            GetObservationAttachments(data[i].cr3ea_prod_observationsid, GetObservationsAttachmentsSuccess, GetObservationAttachmentsFailure);
          }
        }
        // No category code start
        else {
          $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_ObservationClearId").val(data[i].cr3ea_observation)
;
          $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_ObservationId_" + data[i].cr3ea_prod_observationsid + "_ClearBtnId");
          $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_ObservationId").val(data[i].cr3ea_observation);
 
          $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_CheckBoxId").bootstrapToggle('destroy').bootstrapToggle();
          if (data[i].cr3ea_action == 'Approved') {
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_ApprovedRdButton").prop("checked", true);
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").show();
          }
          else if (data[i].cr3ea_action == 'Rejected') {
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_RejectedRdButton").prop("checked", true);
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").show();
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_divNearMissId").show();
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_NearMissId").prop("checked",data[i]?.cr3ea_nearmiss?data[i]?.cr3ea_nearmiss:false);

          }
          else {
            if (data[i].cr3ea_categoryid) {
              $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_NApplicableRdButton").prop("checked", true);
              $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_CNCFormID").hide();
            } else {
              let NotApplicableBtnId = `Dept_${data[i].cr3ea_areaid}_Cat___CategoryID___Crit_${data[i].cr3ea_criteriaid}_NApplicableRdButton`;
              let CNCFormID = `Dept_${data[i].cr3ea_areaid}_Cat___CategoryID___Crit_${data[i].cr3ea_criteriaid}_CNCFormID`;
 
              $("#" + NotApplicableBtnId).prop("checked", true);
              $("#" + CNCFormID).hide();
            }
          }
 
          $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_BtnId").html('Update');
          imageID = "Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid;
          ImageDiv = "Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_AttachDisId";
 
          if (data[i].Attachment) {
            $("#Dept_" + data[i].cr3ea_areaid + "_Cat___CategoryID___Crit_" + data[i].cr3ea_criteriaid + "_ObservationAttachID").val(data[i].cr3ea_observation);
            GetObservationAttachments(data[i].cr3ea_prod_observationsid, GetObservationsAttachmentsSuccess, GetObservationAttachmentsFailure);
          }
        }
        // No category code End  
      }
      InitCheckClick();
    }
    if ($('#hdnDepartmentStatus').val() == 'Completed') {
      $('.pd-submit-btn').hide();
      $('.Submitbtn').hide();
      $('input[type="file"]').prop("disabled", true);
      $("textarea").prop('disabled', true);
      $('.form-control').prop('disabled', true);
    }
    //update the criteria count in the plan tour dashboard
    UpdateCritCounts();
    HideLoader();
  }



function GetObservationsAttachmentsSuccess( data ) {
  var AttachID = ImageDiv;

  var Id = imageID;
  if ( data.length > 0 ) {
    var ItemId = data[ 0 ].Id;
    $( "#" + AttachID ).empty();
    var attachmentshtml = '';
    var CETSTeamFileCount = 0;

    for ( var i = 0; i < data.length; i++ ) {
      if ( $( '#hdnDepartmentStatus' ).val() == 'Completed' ) {
        $( '#' + AttachID ).append( '<br/>' + parseInt( i + 1 ) + '. <a href="' + data[ i ].Fileurl + '" target="_blank" style="text-decoration:underline;font-weight: bold;">' + data[ i ].Filename + '</a>' );
      } else {
        $( '#' + AttachID ).append( '<br/>' + parseInt( i + 1 ) + '. <a href="' + data[ i ].Fileurl + '" target="_blank" style="text-decoration:underline;font-weight: bold;">' + data[ i ].Filename + '</a><a onclick="DeleteObservationFormAttachment(this)" data-ItemId="' + ItemId + '" data-filename="' + data[ i ].Filename + '" Id="' + Id + '__' + parseInt( i + 1 ) + '"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>' );
      }
    }
  } else {
    $( "#" + AttachID ).empty();
  }

  fileID = '';

  HideLoader();

}

function GetObservationForBindFailure() { }


function EmployeeDetailsFailure() {

}



function getCriteriasSuccess( collCriteria ) {
  if ( collCriteria.length > 0 ) {
    RawCriteriaArray = collCriteria
  }
  getSeverity( getSeveritySuccess, getSeverityFailure )
}

function getCriteriasFailure() {

}

var FilteredCategory = [];
var FilteredCriteria = [];

function getSeveritySuccess( collSeverity ) {
  RawSeverityArray = collSeverity
  var CriteriaTitle = "";
  if ( RawCriteriaArray.length > 0 ) {

    var GetUniqueArea = getUniqueArea();
    if ( GetUniqueArea.length > 0 ) {
      var TempDepartmentHtml = '';
      for ( var i = 0; i < GetUniqueArea.length; i++ ) {
        var newDept = tempDepartmentHTML;
        var TempCategoryTempHtml = '';
        var Srno = 0;
        FilteredCategory = GetFilteredCategoryDetails( GetUniqueArea[ i ].AreaId );

        var GetUniqueCategory = getUniqueCategory();

        if ( GetUniqueCategory.length > 0 ) {
          for ( var j = 0; j < GetUniqueCategory.length; j++ ) {
            // if(GetUniqueCategory[j].AreaId==GetUniqueArea[i].AreaId)
            //{
            Srno++
            FilteredCriteria = GetFilteredCriteriaDetails( GetUniqueCategory[ j ].CategoryId );
            var newCategory = tempCategoryHTML;
            newCategory = newCategory.replace( /__CriticalCategoryName__/g, GetUniqueCategory[ j ].CategoryTitle )
            newCategory = newCategory.replace( /__CurrentNumber__/g, j )
            newCategory = newCategory.replace(/__areaId__/g, GetUniqueArea[ i ].AreaId )
            newCategory = newCategory.replace( /__no.__/g, Srno )
            var TempCriteriaTempHtml = '';

            for ( k = 0; k < FilteredCriteria.length; k++ ) {


              criteriaCount++;
              var newCriteria = tempCriteriaHtml;
              CriteriaTitle = FilteredCriteria[ k ].Criteria;

              newCriteria = newCriteria.replace( /__WhatName__/g, FilteredCriteria[ k ].What )
              newCriteria = newCriteria.replace( /__CriteriaName__/g, FilteredCriteria[ k ].Criteria )
              newCriteria = newCriteria.replace( /__CriteriaID__/g, FilteredCriteria[ k ].Id )
              TempCriteriaTempHtml += newCriteria


            }
            newCategory = newCategory.replace( /__CurrentNumber__/g, j )
            newCategory = newCategory.replace( /__SubCategory__/g, TempCriteriaTempHtml );
            newCategory = newCategory.replace( /__CategoryID__/g, GetUniqueCategory[ j ].CategoryId );
            newCategory = newCategory.replace( /__CriteriaTitle__/g, CriteriaTitle );
            //newCategory = newCategory.replace(/__CriteriaTitle__/g, GetUniqueCategory[j].CategoryTitle);
            newCategory = newCategory.replace( /PlantDepartmentID__/g, GetUniqueArea[ i ].DepartmentId );
            if ( !GetUniqueCategory[ j ].CategoryTitle || GetUniqueCategory[ j ].CategoryTitle?.length == 0 ) {
              TempCategoryTempHtml += TempCriteriaTempHtml;
            } else {
              TempCategoryTempHtml += newCategory;
            }

          }
        }
        newDept = newDept.replace( /__CriticalCategory__/g, TempCategoryTempHtml )
        newDept = newDept.replace( /__DepartmentName__/g, GetUniqueArea[ i ].AreaTitle )
        newDept = newDept.replace( /__PlantDepartmentID__/g, GetUniqueArea[ i ].AreaId );
        //newDept=newDept.replace(/__CriteriaTitle__/g,CriteriaTitle);
        TempDepartmentHtml += newDept;
        $( '#CriteriaWiseObservationId' ).append( TempDepartmentHtml );
        TempDepartmentHtml = '';
        $( '#heading_' + GetUniqueArea[ i ].AreaId + ' #txtTotalCriteriacnt' ).text( $( '#collapse_' + GetUniqueArea[ i ].AreaId + ' .list-group-item.question' ).length );
        $( '#heading_' + GetUniqueArea[ i ].AreaId + ' #txtPendingCriteriacnt' ).text( $( '#collapse_' + GetUniqueArea[ i ].AreaId + ' .list-group-item.question' ).length );

      }
    }
    //$('#CriteriaWiseObservationId').append(TempDepartmentHtml);
    $( '.mid .checkbox-image' ).bootstrapToggle();



    InitCancelClick();
  }
  //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
  GetObservationDataFetch();
}


//.toggle.btn.btn-default.off
function InitCancelClick() {
  $( '.toggle.btn-primary' ).unbind().click( function () {
    $( this ).find( 'input' ).prop( 'checked', false );
    ShowObservationTab( $( this ).find( 'input' ) );
    $( this ).removeClass( 'btn-primary' ).addClass( 'btn-default' ).addClass( 'off' );
    $( this ).find( '.checkbox-image' ).bootstrapToggle( 'destroy' ).bootstrapToggle();
    InitCheckClick();
  } );
}

function InitCheckClick() {
  $( '.toggle.off' ).unbind().click( function () {
    $( this ).find( 'input' ).prop( 'checked', true );
    ShowObservationTab( $( this ).find( 'input' ) );
    $( this ).removeClass( 'btn-default' ).removeClass( 'off' ).addClass( 'btn-primary' );
    $( this ).find( '.checkbox-image' ).bootstrapToggle( 'destroy' ).bootstrapToggle();
    InitCancelClick();
  } );
}




function getUniqueArea() {
  var UniqueAreaArray = [];
  $.each( RawCriteriaArray, function ( i, e ) {
    var matchingItems = $.grep( UniqueAreaArray, function ( item ) {
      return item.AreaId === e.AreaId;
    } );
    if ( matchingItems.length === 0 ) {
      UniqueAreaArray.push( e );
    }
  } );
  return UniqueAreaArray;
}

function GetFilteredCategoryDetails( AreaId ) {
  return arr = $.grep( RawCriteriaArray, function ( d, i ) {
    return d.AreaId == AreaId;
  } );

}

function GetFilteredCriteriaDetails( CategoryId ) {
  return arr = $.grep( FilteredCategory, function ( d, i ) {
    return d.CategoryId == CategoryId;
  } );

}



function getUniqueCategory() {
  UniqueCategoryArray = [];
  $.each( FilteredCategory, function ( i, e ) {
    var matchingItems = $.grep( UniqueCategoryArray, function ( item ) {
      return item.CategoryId === e.CategoryId;
    } );
    if ( matchingItems.length === 0 ) {
      UniqueCategoryArray.push( e );
    }
  } );
  return UniqueCategoryArray;
}


function getSeverityFailure() {

}
/*Delete observation item*/
var DeleteItemId = '';
var ObserItemId = '';
var ClearformID = '';
var clearnrbtnApprove = ''
var clearnrbtnReject = '';
function ClearCriteriaNonConfirmity( data ) {
  ShowLoader();
  var ID = $( data ).attr( 'Id' );
  if ( ID == undefined ) {
    ID = data;
  }
  ObserItemId = ID.replace( 'ClearBtnId', 'BtnId' );
  ClearformID = ID.replace( 'ClearBtnId', 'CNCFormID' );
  clearnrbtnApprove = ID.replace( 'ClearBtnId', 'ApprovedRdButton' );
  clearnrbtnReject = ID.replace( 'ClearBtnId', 'RejectedRdButton' );
  ID = ID.replace( '_ClearBtnId', '' );
  DeleteItemId = ID
  var ItemId = $( "#" + ID + "_ObservationClearId" ).val();
  if ( ItemId != '' && ItemId != undefined ) {
    DeleteListitem( ItemId, DeleteObservationitemSuccess, DeleteObservationitemFailure );
  } else {
    $( "#" + DeleteItemId + "_ObservationClearId" ).val();
    $( "#" + DeleteItemId + "_ObservationId" ).val( '' );
    $( "#" + DeleteItemId + "_CorrectiveActionId" ).val( '' );
    $( "#" + DeleteItemId + "_SeverityID" ).val( 1 );
    $( "#" + DeleteItemId + "_AttachDisId" ).empty();
    $( "#" + DeleteItemId + "_ObservationClearId" ).val( '' )
    $( "#" + DeleteItemId + "_NearMissId" ).prop( "checked", false );
    $( "#" + clearnrbtnApprove ).prop( "checked", false );
    $( "#" + clearnrbtnReject ).prop( "checked", false );

    $( "#" + ClearformID ).hide();
    $( "#" + ClearformID + ' .divNearMissId' ).hide();

    HideLoader();
  }
}

function DeleteObservationitemSuccess() {
  var Observation = $( "#" + DeleteItemId + "_ObservationId" ).val( '' );
  var CorrectiveAction = $( "#" + DeleteItemId + "_CorrectiveActionId" ).val( '' );
  var Severity = $( "#" + DeleteItemId + "_SeverityID" ).val( 1 );
  $( "#" + DeleteItemId + "_ObservationClearId" ).val( '' )
  $( "#" + DeleteItemId + "_AttachDisId" ).empty();
  $( '#' + ObserItemId ).html( 'Save' );
  $( "#" + DeleteItemId + "_NearMissId" ).prop( "checked", false );
  $( "#" + ClearformID ).hide();
  $( "#" + clearnrbtnApprove ).prop( "checked", false );
  $( "#" + clearnrbtnReject ).prop( "checked", false );

  $( "#" + ClearformID + ' .divNearMissId' ).hide();
  InitCheckClick()
  //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
  GetObservationDataFetch();
}

function DeleteObservationitemFailure() {
  HideLoader();
}

function SubmitCriteriaNonConfirmity( data ) {
  var Isvalidate = true;
  var ID = $( data ).attr( 'Id' );
  ID = ID.replace( '_BtnId', '' );

  selectedId = ID;

  var isBtnRejected = $( '#' + ID + '_RejectedRdButton' ).is( ':checked' );

  var Observation = $( "#" + ID + "_ObservationId" ).val();

  if ( Observation == "" && isBtnRejected ) {
    Isvalidate = false;
    alert( "Please Enter Comment" )
  }
  else if ( Isvalidate ) {
    ShowLoader();
    //SaveObservationDetails( data )
    SaveObservationTableSubmit( data );
  }

}

function SavePlantTourInput( ID ) {
  ShowLoader();
  var CriteriaId = ID.split( "_" )[ 9 ];
  var AreaId = ID.split( "_" )[ 1 ];
  var CriteriaDetails = $.grep( RawCriteriaArray, function ( el ) {
    return el.Id == CriteriaId;
  } );
  var AreaTitle = CriteriaDetails[ 0 ]?.AreaTitle;
  //var DepartmentId = CriteriaDetails[0]?.DepartmentId;
  var DepartmentId = userDepratmentId;

  var DepartmentDetails = $.grep( RawDepartmentArray, function ( el ) {
    return el.Id == DepartmentId;
  } );
  var CategoryId = CriteriaDetails[ 0 ]?.CategoryId
  var What = CriteriaDetails[ 0 ]?.What
  var Criteria = CriteriaDetails[ 0 ]?.Criteria
  var CriteriaId = CriteriaDetails[ 0 ]?.Id

  if ( $( "#" + ID + "_ObservationClearId" ).length > 0 ) {
    var ObservationId = $( "#" + ID + "_ObservationClearId" ).val();
  }
  else {
    var ObservationId = '';
  }

  if ( $( "#" + ID + "_ObserId" ).length > 0 ) {
    var AttachmentId = $( "#" + ID + "_ObserId" ).val();
  }
  else {
    var AttachmentId = '';
  }

  var Action = '';
  var Status = 'Draft';

  var ObservationItemId = '';
  if ( ObservationId != null && ObservationId != '' ) {
    ObservationItemId = ObservationId
  } else if ( AttachmentId != 0 ) {
    ObservationItemId = AttachmentId
  }

  if ( $( '#' + ID + '_ApprovedRdButton' ).is( ':checked' ) == true ) {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }
    Action = "Approved";
    Status = "NA";
  }
  else if ( $( '#' + ID + '_RejectedRdButton' ).is( ':checked' ) == true ) {
    if ( $( '#' + ID + '_NearMissId' ).is( ':checked' ) == true ) {
      var Severity = FilterSeveritybySequence( 3 );
    }
    else {
      var Severity = FilterSeveritybySequence( 2 );
    }

    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }

    Status = "Draft";
    Action = "Rejected";
  }
  else {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }
    Status = "NA";
    Action = "Not Applicable";
  }
  var objNonConfirmityDetails = new ObservationsListEntity();
  objNonConfirmityDetails.Observation = '';
  // objNonConfirmityDetails.CorrectiveAction = CorrectiveAction;
  objNonConfirmityDetails.Severity = Severity;
  objNonConfirmityDetails.What = What;
  objNonConfirmityDetails.Where = AreaTitle;
  objNonConfirmityDetails.Criteria = Criteria;
  objNonConfirmityDetails.Status = Status;  // 'Pending';
  objNonConfirmityDetails.CriteriaId = CriteriaId;
  objNonConfirmityDetails.DepartmentTourId = Number( DepartmentTourId );
  objNonConfirmityDetails.AreaId = Number( AreaId );
  objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
  objNonConfirmityDetails.DepartmentId = DepartmentId;
  objNonConfirmityDetails.CategoryId = Number( CategoryId );
  objNonConfirmityDetails.Action = Action;

  objNonConfirmityDetails.ObservedByRole = UserRoleId;
  objNonConfirmityDetails.PlantId = PlantId;
  objNonConfirmityDetails.TourDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
  objNonConfirmityDetails.ObservedDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
  objNonConfirmityDetails.Title = userRoleName + '_' + moment().format( 'MM-DD-YYYY' );


  if ( ObservationItemId == '' ) {
    CreateObservation( objNonConfirmityDetails, ID, CreateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure );
  } else if ( ( ObservationItemId != '' ) ) {
    UpdateObservationForAttachment( ObservationItemId, ID, objNonConfirmityDetails, UpdateSavePlantTourInputSuccess, CreateSavePlantTourInputFailure );

  }


}
function UpdateSavePlantTourInputSuccess( data, elementID ) {
  UpdateCritCounts( elementID );
  HideLoader();
}


function CreateSavePlantTourInputSuccess( data, elementID ) {
  $( '#' + elementID + '_ObservationClearId' ).val( data.d.Id );
  UpdateCritCounts( elementID );
  GetObservationForBind( DepartmentTourId, GetObservationForBindDataSuccess, GetObservationForBindFailure )
  HideLoader();

}
function GetObservationForBindDataSuccess( data ) {
  ObservationData = data;

}
function CreateSavePlantTourInputFailure() {
  HideLoader();
}


function UpdateCritCounts( elementID ) {
  var successPercentage = 0.0;
  var totalCriteria = 0;
  var totaltouchedCriteria = 0;
  $( '.accordion' ).each( function () {
    //var currentID=elementID;
    //var AreaId = currentID.split("_")[3];
    //var ParentID='collapse_'+AreaId;
    var currAreaId = $( this ).attr( 'id' ).replace( 'accordionExample_', '' );
    var AreaId = currAreaId;
    var ParentID = 'collapse_' + AreaId;
    var TotalCriteria = $( '#' + ParentID + ' .list-group-item.question' ).length;
    var ApprovedCriteria = 0;
    var RejectedCriteria = 0;
    var PendingCriteria = 0;
    var NACriteria = 0;
    totalCriteria = parseInt( totalCriteria ) + $( '#' + ParentID + ' .list-group-item.question' ).length;
    $( '#' + ParentID + ' .list-group-item.question' ).each( function () {
      var radName = $( this ).find( 'input[type=radio]' ).attr( 'name' );

      if ( $( 'input[name=' + radName + ']:checked' ).length == 0 ) {
        PendingCriteria = parseInt( PendingCriteria ) + 1;;
      }
      else {
        //RejectedRdButton
        var radId = $( 'input[name=' + radName + ']:checked' ).attr( 'id' );

        var checkVal = radId.substring( radId.lastIndexOf( '_' ) + 1 );
        if ( checkVal == 'RejectedRdButton' ) {
          RejectedCriteria = parseInt( RejectedCriteria ) + 1;
        }
        else if ( checkVal == 'ApprovedRdButton' ) {
          ApprovedCriteria = parseInt( ApprovedCriteria ) + 1;
        }
        else {
          NACriteria = parseInt( NACriteria ) + 1;
          TotalCriteria = parseInt( TotalCriteria ) - 1;
        }

      }
    } );

    $( '#heading_' + AreaId + ' #txtTotalCriteriacnt' ).text( TotalCriteria );
    $( '#heading_' + AreaId + ' #txtTotalRejectedCriteriacnt' ).text( RejectedCriteria );
    $( '#heading_' + AreaId + ' #txtPendingCriteriacnt' ).text( PendingCriteria );
    $( '#heading_' + AreaId + ' #txtTotalApprovedCriteriacnt' ).text( ApprovedCriteria );

    totaltouchedCriteria = parseInt( totaltouchedCriteria ) + parseInt( RejectedCriteria ) + parseInt( ApprovedCriteria ) + parseInt( NACriteria );

  } );

  //successPercentage=parseFloat((totalCriteria-totaltouchedCriteria)/ totalCriteria).toFixed(2);
  successPercentage = parseFloat( totaltouchedCriteria / totalCriteria ).toFixed( 2 );
  $( '#divStatus' ).circleProgress( {
    value: successPercentage,
    size: 40,
    fill: {
      gradient: [ "green" ]
    }

  } ).on( 'circle-animation-progress', function ( event, progress ) {
    $( this ).find( 'strong' ).html( Math.round( 100 * successPercentage ) + '<i>%</i>' );
  } );
  if ( successPercentage == "1.00" ) {
    $( '#divStatus strong' ).css( "left", " -38px" );

  }
}




function SaveObservationDetails( data ) {

  // var AttachmentId=$('#hdnObservationId').val();
  var ID = $( data ).attr( 'Id' );
  ID = ID.replace( '_BtnId', '' );
  
  if ( ID.split( "_" ).length > 8 ) {
    // No category
    var AreaId = ID.split( "_" )[ 1 ];
    var CriteriaId = ID.split( "_" )[ 9 ];
  } else {
    var AreaId = ID.split( "_" )[ 3 ];
    var CriteriaId = ID.split( "_" )[ 7 ];
  }
  var CriteriaDetails = $.grep( RawCriteriaArray, function ( el ) {
    return el.Id == CriteriaId;
  } );
  var AreaTitle = CriteriaDetails[ 0 ]?.AreaTitle;
  //var DepartmentId = CriteriaDetails[0]?.DepartmentId
  var DepartmentId = userDepratmentId;
  var DepartmentDetails = $.grep( RawDepartmentArray, function ( el ) {
    return el.Id == DepartmentId;
  } );
  var CategoryId = ID.split( "_" ).length > 8 ? null : CriteriaDetails[ 0 ]?.CategoryId;
  var What = CriteriaDetails[ 0 ]?.What
  var Criteria = CriteriaDetails[ 0 ]?.Criteria
  var CriteriaId = CriteriaDetails[ 0 ]?.Id
  var Observation = $( "#" + ID + "_ObservationId" ).val();
  var ObservationId = $( "#" + ID + "_ObservationClearId" ).val();
  var AttachmentId = $( '#' + ID + "_ObserId" ).val();
  var Action = '';
  var Status = 'Pending';



  var ObservationItemId = '';
  if ( ObservationId != null && ObservationId != '' ) {
    ObservationItemId = ObservationId
  } else if ( AttachmentId != 0 ) {
    ObservationItemId = AttachmentId
  }

  if ( $( '#' + ID + '_ApprovedRdButton' ).is( ':checked' ) == true ) {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }
    Action = "Approved";
    Status = "NA";

  }
  else if ( $( '#' + ID + '_RejectedRdButton' ).is( ':checked' ) == true ) {
    if ( $( '#' + ID + '_NearMissId' ).is( ':checked' ) == true ) {
      var Severity = FilterSeveritybySequence( 3 );
    }
    else {
      var Severity = FilterSeveritybySequence( 2 );
    }

    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }
    Status = "Pending";
    Action = "Rejected";
  }
  else {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id;
    }
    else {
      var Severity = null;
    }
    Status = "NA";
    Action = "Not Applicable";
  }
  var objNonConfirmityDetails = new ObservationsListEntity();
  objNonConfirmityDetails.Observation = Observation;
  // objNonConfirmityDetails.CorrectiveAction = CorrectiveAction;
  objNonConfirmityDetails.Severity = Severity;
  objNonConfirmityDetails.What = What;
  objNonConfirmityDetails.Where = AreaTitle;
  objNonConfirmityDetails.Criteria = Criteria;
  objNonConfirmityDetails.Status = Status;  // 'Pending';
  objNonConfirmityDetails.CriteriaId = CriteriaId;
  objNonConfirmityDetails.DepartmentTourId = Number( DepartmentTourId );
  objNonConfirmityDetails.AreaId = Number( AreaId );
  objNonConfirmityDetails.ObservedBy = _spPageContextInfo.userId;
  objNonConfirmityDetails.DepartmentId = DepartmentId;
  objNonConfirmityDetails.CategoryId = Number( CategoryId );
  objNonConfirmityDetails.Action = Action;

  objNonConfirmityDetails.ObservedByRole = UserRoleId;
  objNonConfirmityDetails.PlantId = PlantId;
  objNonConfirmityDetails.TourDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
  objNonConfirmityDetails.ObservedDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
  objNonConfirmityDetails.Title = userRoleName + '_' + moment().format( 'MM-DD-YYYY' );


  if ( ObservationItemId == '' ) {
    CreateObservation( objNonConfirmityDetails, ID, CreateObservationSuccess, CreateObservationFailure )
  } else if ( ( ObservationItemId != '' ) ) {
    UpdateObservationForAttachment( ObservationItemId, ID, objNonConfirmityDetails, CreateObservationSuccess, CreateObservationFailure );
  }


}

function UpdateObservationSuccess( data ) {
  //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
  GetObservationDataFetch();
}

function UpdateObservationFailure() {

}

function CreateObservationSuccess( data ) {
  //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
  GetObservationDataFetch();
}

function CreateObservationFailure() { }


// save final comment on final submit

function ValidateFinishTour() {
  var objObservationsListEntity = new ObservationsTypeListEntity();
  var TotalCriteria = $( '.list-group-item.question' ).length;
  var ApprovedCriteria = 0;
  var RejectedCriteria = 0;
  var NACriteria = 0;
  objObservationsListEntity.IsValidated = true;
  $( '.list-group-item.question' ).each( function () {
    var radName = $( this ).find( 'input[type=radio]' ).attr( 'name' );
    var commentboxId = radName.replace( 'Action', 'ObservationId' );




    if ( $( 'input[name=' + radName + ']:checked' ).length == 0 ) {
      objObservationsListEntity.IsValidated = false;
      objObservationsListEntity.ValidationMsg = 'Please take action on each criteria';
      return objObservationsListEntity;
    }
    else {
      var commentboxId = radName.replace( 'Action', 'ObservationId' );
      var radId = $( 'input[name=' + radName + ']:checked' ).attr( 'id' );
      var checkVal = radId.substring( radId.lastIndexOf( '_' ) + 1 );
      if ( checkVal == 'RejectedRdButton' ) {
        //RejectedRdButton

        if ( checkVal == 'RejectedRdButton' ) {
          var CommentText = $( '#' + commentboxId ).val().trim();
        }
        else {
          var CommentText = '';
        }
        RejectedCriteria = parseInt( RejectedCriteria ) + 1;
        if ( CommentText == '' ) {
          objObservationsListEntity.IsValidated = false;
          objObservationsListEntity.ValidationMsg = 'Please enter comment for all Observations / Near Miss';
          return objObservationsListEntity;
        }
      }
      else {
        var radId = $( 'input[name=' + radName + ']:checked' ).attr( 'id' );
        var checkVal = radId.substring( radId.lastIndexOf( '_' ) + 1 );

        if ( checkVal == 'RejectedRdButton' ) {
          RejectedCriteria = parseInt( RejectedCriteria ) + 1;
        }
        else if ( checkVal == 'ApprovedRdButton' ) {
          ApprovedCriteria = parseInt( ApprovedCriteria ) + 1;
        }
        else {
          NACriteria = parseInt( NACriteria ) + 1;

          TotalCriteria = parseInt( TotalCriteria ) - 1;
        }

      }
    }

  } );

  objObservationsListEntity.ApprovedCriteria = ApprovedCriteria;
  objObservationsListEntity.RejectedCriteria = RejectedCriteria;
  objObservationsListEntity.NACriteria = NACriteria;
  objObservationsListEntity.TotalCriteria = TotalCriteria;


  return objObservationsListEntity;
}

async function SaveFinalComment() {
  var objTempData = ValidateFinishTour();
  if ( objTempData.IsValidated ) {
    ShowLoader();
    //GetObservationForCount(DepartmentTourId,GetObservationForCountSuccess,GetObservationForCountFailure)
    //alert('validated' + " Total criteria "+objTempData.TotalCriteria+" Approved Criteria "+objTempData.ApprovedCriteria+" Rejected Criteria "+objTempData.RejectedCriteria);

    //var totalCriteria=$('.list-group-item.question').length;

    //var criteriaCnt = parseInt(criteriaCount - CriteriaNotApplicable);
    //var ObservationCnt = parseInt(ApprovedObservationCount);
    if ( objTempData.TotalCriteria > 0 ) {
      var TourScore = parseFloat( ( objTempData.ApprovedCriteria / objTempData.TotalCriteria ) * 100 );
      var TotalScore = TourScore.toFixed( 2 );
    }
    else {
      var TotalScore = 0;
    }
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_departmenttours";
  var apiVersion = "9.2";
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
    var RecordId = DepartmentTourId;
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + RecordId + ")";
    const dataToSave = {
        cr3ea_finalcomment: $( '#txtFinalComment' ).val(),
        cr3ea_totalcriterias: parseInt( objTempData.TotalCriteria ) + parseInt( objTempData.NACriteria ),
        cr3ea_totalobservations: parseInt( objTempData.RejectedCriteria ),
        cr3ea_totalnacriterias: parseInt( objTempData.NACriteria ),
        cr3ea_totalcompliances: parseInt( objTempData.ApprovedCriteria ),
        cr3ea_tourscore: TotalScore,
        cr3ea_tourcompletiondate: moment().format('M/D/YYYY h:mm A'),
        cr3ea_status: 'Completed',
   };
   const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
    //UpdateDTourItem( DepartmentTourId, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure )
    UpdateDTourItemSuccess( TotalScore );
  }
  }
  else {
    alert( objTempData.ValidationMsg );
    //alert('Please take action on each criteria');
  }
}
function UpdateDTourItemSuccess( TotalScore ) {
  HideLoader();
  ShowCongrats( TotalScore );
  setTimeout( function () {
    window.location.replace( "/sites/Mrs_Bectors_PTMS/Pages/Home.aspx" );
  }, 5000 );

}


async function PauseTour() {
  let objTempData = ValidateFinishTour();
  if ( objTempData.RejectedCriteria + objTempData.NACriteria + objTempData.ApprovedCriteria == 0 ) {
    alert( "Please do any selection before pausing the tour" );
    return;
  }
  ShowLoader();
  //GetObservationForCount(DepartmentTourId,GetObservationForCountSuccess,GetObservationForCountFailure)
  //alert('validated' + " Total criteria "+objTempData.TotalCriteria+" Approved Criteria "+objTempData.ApprovedCriteria+" Rejected Criteria "+objTempData.RejectedCriteria);

  //var totalCriteria=$('.list-group-item.question').length;

  //var criteriaCnt = parseInt(criteriaCount - CriteriaNotApplicable);
  //var ObservationCnt = parseInt(ApprovedObservationCount);
  if ( objTempData.TotalCriteria > 0 ) {
    var TourScore = parseFloat( ( ( objTempData.ApprovedCriteria ) / objTempData.TotalCriteria ) * 100 );

    var TotalScore = TourScore.toFixed( 2 );
  }
  else {
    var TotalScore = 0;
  }
  var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_departmenttours";
  var apiVersion = "9.2";
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
    var RecordId = DepartmentTourId;
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + RecordId + ")";
    const dataToSave = {
        cr3ea_finalcomment: $( '#txtFinalComment' ).val(),
        cr3ea_totalcriterias: parseInt( objTempData.TotalCriteria ) + parseInt( objTempData.NACriteria ),
        cr3ea_totalobservations: parseInt( objTempData.RejectedCriteria ),
        cr3ea_totalnacriterias: parseInt( objTempData.NACriteria ),
        cr3ea_totalcompliances: parseInt( objTempData.ApprovedCriteria ),
        cr3ea_tourscore: TotalScore,
        cr3ea_tourcompletiondate: moment().format('M/D/YYYY h:mm A'),
        cr3ea_status: "In Progress",
   };
   const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
HideLoader();

  //ShowCongrats(TotalScore );
  //UpdateDTourItem( DepartmentTourId, objDepartmentTourListEntity, UpdateDTourItemSuccess, UpdateDTourItemFailure )
  UpdateDTourItemSuccess( TotalScore );
}
}
function GetObservationForCountFailure() {

}

function UpdateDTourItemSuccess( TotalScore ) {
  HideLoader();
  ShowPauseCongrats( TotalScore );
  setTimeout( function () {
    window.location.replace( "/sites/Mrs_Bectors_PTMS/Pages/Home.aspx" );
  }, 5000 );

}

function ShowPauseCongrats( TotalScore ) {
  document.getElementById( "divCongrats" ).style.display = "block";
  $( '#divCongrats .word1' ).empty().append( 'The tour is currently paused.' );
  $( '#divCongrats .word2' ).empty().append( 'Current Tour Score: ' + TotalScore + '%' );
  //$('#divCongrats').css({'position':'absolute','bottom': '20%','left': '10%','font-size': '18px'});
  $( '#divCongrats' ).css( { 'bottom': '20%', 'font-size': '16px' } );



  anime.timeline( { loop: true } )
    .add( {
      targets: '.ml15 .word',
      scale: [ 14, 1 ],
      opacity: [ 0, 1 ],
      easing: "easeOutCirc",
      duration: 1000,
      delay: 800
    } ).add( {
      targets: '.ml15',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    } );

}

function ShowCongrats( TotalScore ) {
  document.getElementById( "divCongrats" ).style.display = "block";
  $( '#divCongrats .word1' ).empty().append( 'Congratulations for completing the tour' );
  $( '#divCongrats .word2' ).empty().append( 'You have scored ' + TotalScore + '%' );
  //$('#divCongrats').css({'position':'absolute','bottom': '20%','left': '10%','font-size': '18px'});
  $( '#divCongrats' ).css( { 'bottom': '20%', 'font-size': '16px' } );



  anime.timeline( { loop: true } )
    .add( {
      targets: '.ml15 .word',
      scale: [ 14, 1 ],
      opacity: [ 0, 1 ],
      easing: "easeOutCirc",
      duration: 1000,
      delay: 800
    } ).add( {
      targets: '.ml15',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    } );

}

function CalTotalScore() {

  var criteriaCnt = parseInt( criteriaCount - CriteriaNotApplicable );
  var ObservationCnt = parseInt( ApprovedObservationCount );
  var TourScore = parseFloat( ( ( criteriaCnt - ObservationCnt ) / criteriaCnt ) * 100 );
  var TotalScore = TourScore.toFixed( 2 )
  return TotalScore;
}


function UpdateDTourItemFailure() { }

function ChangeImage( data ) {
  var TourId = data.dataset.target;
  TourId = TourId.split( "_" )[ 1 ];

  $( '#infoToggler' + TourId ).find( '.toggle-img' ).toggle();
  $( '.accordion-btn btn-link' ).find( '.accordion-btn btn-link' ).toggle();

}
var RdBtn = '';
var CriteriaNotApplicable = 0;
var CheckCritID = '';
var RdnCount = 0;

function ShowObservationTab( data ) {
  var formID = $( data ).attr( "Id" );
  if ( formID.split( '_' ).length > 10 ) {
    RdBtn = formID.split( '_' )[ 10 ];
  } else {
    RdBtn = formID.split( '_' )[ 8 ];
  }
  //RdBtn = formID.split("_")[8];
  var replaceformID = formID;
  var CritId = replaceformID.replace( RdBtn, "" );

  formID = formID.replace( RdBtn, "CNCFormID" );
  if ( RdBtn == "ApprovedRdButton" ) {

    $( "#" + formID ).show();
    $( "#" + formID + ' .divNearMissId' ).hide();
    if ( RdnCount < 2 ) {
      CriteriaNotApplicable--;
    }

  }
  else if ( RdBtn == "RejectedRdButton" ) {

    $( "#" + formID ).show();
    $( "#" + formID + ' .divNearMissId' ).show();

    if ( RdnCount < 2 ) {
      CriteriaNotApplicable--;
    }

  }
  else if ( RdBtn == "NApplicableRdButton" ) {
    $( "#" + formID ).hide();
    $( "#" + formID + ' .divNearMissId' ).hide();

  }

  var currId = formID.substring( 0, formID.lastIndexOf( '_' ) );
  if ( !IsTourCompleted ) {
    //SavePlantTourInput( currId );
    //SaveObservationTableDraft( currId );
  }



}

function HODNotApplicable( data ) {
  RdnCount = 0;
  if ( !IsTourCompleted ) {

    ShowObservationTab( data );
  }


}

function HODApproved( data ) {
  RdnCount++
  if ( !IsTourCompleted ) {

    ShowObservationTab( data );
  }
}

function HODRejected( data ) {
  RdnCount++
  if ( !IsTourCompleted ) {

    ShowObservationTab( data );
  }
}

var offImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png'/>"
var onImg = "<img src='/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png'/>"

var tempDepartmentHTML = '<div class="accordion" id="accordionExample___PlantDepartmentID__">' +
  '<div class="card header-card">' +
  '<div class="card-header accordion-header" id="heading___PlantDepartmentID__">' +
  '<h2 class="mb-0 align-self-center minimum-height">' +
  '<div class="accordion-btn btn-link collapsed" onclick="ChangeImage(this)" type="button" data-toggle="collapse" data-target="#collapse___PlantDepartmentID__" aria-expanded="false" aria-controls="collapse___PlantDepartmentID__" >' +
  '<div class="media accordion-media">' +
  '<div class="media-body align-self-center width-ninty" align="left">' +
  '<h5 class="mt-0 flt-left" >__DepartmentName__</h5>' +
  '<div class="progress-section" align="right" style="margin-top: 0px;">' +
  '<div>' +
  '<p id="txtTotalCriteriacnt"  title="Total number of criterias"  style="display: none;">0</p>' +
  '<p id="txtTotalApprovedCriteriacnt"  title="Total number of approved criteria"  style="display: inline-block;background-color:Green;color:#fff !important;">0</p>' +
  '<p id="txtTotalRejectedCriteriacnt"  title="Total number of observations / Near Miss"  style="display: inline-block;background-color:Red;color:#fff !important;">0</p>' +
  '<p id="txtPendingCriteriacnt" title="Total number of criteria for pending action"  style="display: inline-block;background-color:yellow;">0</p>' +
  '</div>' +
  //'<div class="progress">'+

  //'<div class="progress-bar progressing" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" ></div>'+
  //'</div>'+
  '</div>' +

  '</div>' +
  '<div id="infoToggler__PlantDepartmentID__" class="infoToggler">' +
  '<img class="align-self-center navigate-large toggle-img"src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus-sign.png" >' +
  '<img class="align-self-center navigate-reduce toggle-img" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/minus-sign.png"  style="display:none;"></div>' +
  '</div>' + '</div>' +
  '</h2>' +
  '</div>' +
  '<div id="collapse___PlantDepartmentID__" class="collapse" aria-labelledby="heading___PlantDepartmentID__" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;" aria-expanded="true">' +
  '<div class="card-body">' +
  '<div class="accordion" id="accordionExample___PlantDepartmentID__">__CriticalCategory__</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</div>';


var tempCategoryHTML = '<div class="card body-card">' +
  '<div class="card-header accordion-header" id="headingtwoerex">' +
  '<h2 class="mb-0 align-self-center minimum-height">' +
  '<div class="accordion-btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapsetwoerex__CurrentNumber____areaId___PlantDepartmentID__" aria-expanded="false" aria-controls="collapsetwoerex">' +
  '<div class="media accordion-media">' +
  '<div class="align-self-center mr-3"><span class="task-number">__no.__</span>' +
  '</div>' +
  '<div class="media-body align-self-center flex-media-none" align="left">' +
  '<h5 class="mt-0" >__CriticalCategoryName__</h5>' +
  '</div>' +
  '<div class="full-width">' +
  // '<button type="button" class="btn  align-self-center check-visually-btn" >Check visually</button>'+
  '<img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/navigate.png" class="align-self-center navigate-arrow justify-content-end right-btn" >' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</h2>' +
  '</div>' +
  '<div id="collapsetwoerex__CurrentNumber____areaId___PlantDepartmentID__" class="collapse" aria-labelledby="headingtwoerex" data-parent="#accordionExample___PlantDepartmentID__" style="height: 0px;">' +
  '<div class="card-body accordion-body-section">' +
  '<ul class="list-group list-group-flush">__SubCategory__</ul>' +
  /* '<div class="btn-section">'+
   '<button type="button" class="btn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CatSubmitID" onclick="SaveObservationTableDraft(this)">Submit</button>'+
   '</div>'+*/
  '</div>' +
  '</div>' +
  '</div>';

var tempCriteriaHtml = '<li class="list-group-item question"><label><p><b>__WhatName__<br/></b></p> __CriteriaName__</label>' +
  //'<li class="list-group-item question"><label>'+CriteriaArray[k]+'</label>'+
  //'<div class="mid" align="right">'+
  //' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick="ShowObservationTab(this)">'+
  //' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="Test1" data-off="Test2" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick="ShowObservationTab(this)">'+

  /*
  '<div class="toggle btn btn-primary" data-toggle="toggle" style="width: 0px; height: 0px;">'+
     ' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick=ShowObservationTab(this)>'+
    '<div class="toggle-group">'+
      '<label class="btn btn-primary toggle-on"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png"></label><label class="btn btn-default active toggle-off"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png"></label><span class="toggle-handle btn btn-default"></span>'+
    '</div>'+
  '</div>'+
  */

  //'<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Criteria" onclick=ShowObservationTab(this)>'+
  //' <input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="'+onImg+'" data-off="'+offImg+'" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CheckBoxId" onclick=ShowObservationTab(this)>'+
  // '<input type="checkbox" class="checkbox-image" checked data-toggle="toggle" data-on="<img src=https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/checked.png>" data-off="<img src=https://aufaitcloud.sharepoint.com/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/close.png>">'
  //'</div>'+
  '<div><label class="radio-option radio-inline">Not Applicable<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NApplicableRdButton"  name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="SaveNAObservationTableDraft(this)" value="NotApplicable"> <span class="checkmark"></span></label>' +
  '<label class="radio-option radio-inline">Approved<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ApprovedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="HODApproved(this)" value="Approved"><span class="checkmark" ></span></label>' +
  '<label class="radio-option radio-inline">Rejected<input type="radio" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___RejectedRdButton" name="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___Action" onclick="HODRejected(this)" value="Rejected"><span class="checkmark"></span></label></div>' +
  '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>' +
  '<div class="conform-section" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___CNCFormID" style="display:none;">' +
  //'<br>'+
  '<hr />' +
  //'<h5 class="mt-0 inner-heading" >Criteria Non Conformity</h5>'+
  '<div class="row mgn-nill">' +
  '<div class="col-md-7 pdg-nill">' +
  '<div class="heading-tbl">Comment</div>' +
  '<div class="data-section"><textarea id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationId" rows="2">' + '</textarea>' + '</div>' +
  '</div>' +

  '<div class="col-md-2 pdg-nill divNearMissId" style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___divNearMissId">' +
  '<div class="heading-tbl">Is Near Miss?</div>' +
  '<div class="data-section"><input type="checkbox" onchange="fnNearMissChnge()" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___NearMissId"> Near Miss</div>' +
  '</div>' +

  '<div class="col-md-3 pdg-nill">' +
  '<div class="heading-tbl">Attachments</div>' +
  '<div>' +
  '<div class="attachment">' +
  '<div class="attachment-img"><img src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/plus.png"><label>choose the file</label></div>' +
  '<input type="file" class="form-control-file" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachID" onchange="ObservationAttachmentClickFunction(this)">' +
  '<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationAttachID" style="display:none"></p>' +
  //'<input type="file" class="form-control-file" id="exampleFormControlFile1">'+
  '<input style="display:none" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObserId" value="0">' +

  '</div>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___AttachDisId" class="attached-files"></div>' +
  '<div class="btn-section">' +
  //'<button type="button" class="btn ">cancel</button>'+
  '<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___BtnId" onclick="SaveObservationTableDraft(this)">Save</button>' +
  //'<p id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ObservationClearId" style="display:none"></p>'+
  '<button type="button" class="btn Submitbtn" id="Dept___PlantDepartmentID___Cat___CategoryID___Crit___CriteriaID___ClearBtnId" onclick="DeleteObservationTableSuccess(this)">Clear</button>' +
  '</div>' +
  '</div>' +
  '</li>'


function FilterSeveritybySequence( Sequence ) {
  return arr = $.grep( RawSeverityArray, function ( d, i ) {
    return d.Sequence == Sequence;
  } );

}

async function SaveNAObservationTableDraft(data){
    var ObservedBy = _spPageContextInfo.userId.toString();
    var ID = data.id;
    var Title = userRoleName + '_' + moment().format( 'MM-DD-YYYY' );
    var TourDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    var ObservedDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    if ( ID.split( "_" ).length > 10 ) {
    // No category
    var AreaId = ID.split( "_" )[ 1 ];
    var CriteriaId = ID.split( "_" )[ 9 ];
  } else {
    var AreaId = ID.split( "_" )[ 3 ];
    var CriteriaId = ID.split( "_" )[ 7 ];
  }
    var CriteriaDetails = $.grep( RawCriteriaArray, function ( el ) {
      return el.Id == CriteriaId;
    } );
    var AreaTitle = CriteriaDetails[ 0 ]?.AreaTitle;
    //var DepartmentId = CriteriaDetails[0]?.DepartmentId;
    var DepartmentId = userDepratmentId.toString();
    var DepartmentDetails = $.grep( RawDepartmentArray, function ( el ) {
      return el.Id == DepartmentId;
    } );
    var CategoryId = CriteriaDetails[ 0 ]?.CategoryId.toString();
    var CategoryTitleId = CriteriaDetails[ 0 ]?.CategoryTitle;
    var What = CriteriaDetails[ 0 ]?.What
    var Criteria = CriteriaDetails[ 0 ]?.Criteria
    var CriteriaId = CriteriaDetails[ 0 ]?.Id.toString();
    if ( $( "#" + ID + "_ObservationClearId" ).length > 0 ) {
      var ObservationId = $( "#" + ID + "_ObservationClearId" ).val();
    }
    else {
      var ObservationId = '';
    }
    if ( $( "#" + ID + "_ObserId" ).length > 0 ) {
      var AttachmentId = $( "#" + ID + "_ObserId" ).val();
    }
    else {
      var AttachmentId = '';
    }
    var Action = '';
    var Status = 'Draft';
    var ObservationItemId = '';
      var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
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
        cr3ea_title: Title,
      cr3ea_observedbyrole: userRoleName,
      cr3ea_plantid: PlantId,
      cr3ea_departmentid: userDepratmentId,
      cr3ea_departmenttourid: DepartmentTourId,
      cr3ea_areaid: AreaId,
      cr3ea_criteriaid: CriteriaId,
      cr3ea_observedby: ObservedBy,
      cr3ea_observedperson: EmployeeName,
      cr3ea_categoryid: CategoryId,
      cr3ea_categorytitle: CategoryTitleId,
      cr3ea_what: What,
      cr3ea_criteria: Criteria,
      cr3ea_correctiveaction:"",
      cr3ea_status: "NA",
      cr3ea_tourdate: TourDate,
      cr3ea_action: "Not Applicable",
      cr3ea_observeddate: ObservedDate,
      cr3ea_where:AreaTitle,
      cr3ea_closurecomment:"",
   };
   var itemid="uniqueID_" + CriteriaId + "_" + DepartmentTourId;
   if(sessionStorage.getItem(itemid) != '' && sessionStorage.getItem(itemid) != undefined && sessionStorage.getItem(itemid) != null && sessionStorage.getItem(itemid) != "undefined"){

    var UniqueID = sessionStorage.getItem(itemid);
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + UniqueID + ")";
    const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      const data = await response.json();
      console.log(data);
      //sessionStorage.setItem(itemid,data.cr3ea_prod_observationsid);
     
   }
   else{
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName ;
    const response = await fetch( apiUrl, {
        method: "POST",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }

      const data = await response.json();
      ObserItemId = ID.replace( 'ClearBtnId', 'BtnId' );
      $( '#' + ObserItemId ).html( 'Update' );
      //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
      sessionStorage.setItem(itemid,data.cr3ea_prod_observationsid);
   }
 
  }
  UpdateCritCounts();
 HideLoader();
}

async function SaveObservationTableDraft(ID){
    ShowLoader();
    var ObserItemId = '';
    var ObservedBy = _spPageContextInfo.userId.toString();
    var Title = userRoleName + '_' + moment().format( 'MM-DD-YYYY' );
    var TourDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    var ObservedDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    //Dept_2_Cat___CategoryID___Crit_16_ObservationId
    var ID = ID?.id?(ID?.id?.replace(/_BtnId$/, '')):ID
    var Observation = $( "#" + ID + "_ObservationId" ).val();
    if ( ID.split( "_" ).length > 8 ) {
    // No category
    var AreaId = ID.split( "_" )[ 1 ];
    var CriteriaId = ID.split( "_" )[ 9 ];
  } else {
    var AreaId = ID.split( "_" )[ 3 ];
    var CriteriaId = ID.split( "_" )[ 7 ];
  }
    var CriteriaDetails = $.grep( RawCriteriaArray, function ( el ) {
      return el.Id == CriteriaId;
    } );
    var AreaTitle = CriteriaDetails[ 0 ]?.AreaTitle;
    //var DepartmentId = CriteriaDetails[0]?.DepartmentId;
    var DepartmentId = userDepratmentId.toString();
    var DepartmentDetails = $.grep( RawDepartmentArray, function ( el ) {
      return el.Id == DepartmentId;
    } );
    var CategoryId = CriteriaDetails[ 0 ]?.CategoryId.toString();
    var CategoryTitleId = CriteriaDetails[ 0 ]?.CategoryTitle;
    var What = CriteriaDetails[ 0 ]?.What
    var Criteria = CriteriaDetails[ 0 ]?.Criteria
    var CriteriaId = CriteriaDetails[ 0 ]?.Id.toString();
    if ( $( "#" + ID + "_ObservationClearId" ).length > 0 ) {
      var ObservationId = $( "#" + ID + "_ObservationClearId" ).val();
    }
    else {
      var ObservationId = '';
    }
    if ( $( "#" + ID + "_ObserId" ).length > 0 ) {
      var AttachmentId = $( "#" + ID + "_ObserId" ).val();
    }
    else {
      var AttachmentId = '';
    }
    var Action = '';
    var Status = 'Draft';
    var ObservationItemId = '';
    if ( ObservationId != null && ObservationId != '' ) {
      ObservationItemId = ObservationId
    } else if ( AttachmentId != 0 ) {
      ObservationItemId = AttachmentId
    }
    if ( $( '#' + ID + '_ApprovedRdButton' ).is( ':checked' ) == true ) {
      var Severity = FilterSeveritybySequence( 1 );
      if ( Severity.length > 0 ) {
        var Severity = Severity[ 0 ].Id.toString();
      }
      else {
        var Severity = null;
      }
      Action = "Approved";
      Status = "NA";
    }
    else if ( $( '#' + ID + '_RejectedRdButton' ).is( ':checked' ) == true ) {
      if ( $( '#' + ID + '_NearMissId' ).is( ':checked' ) == true ) {
        var Severity = FilterSeveritybySequence( 3 );
      }
      else {
        var Severity = FilterSeveritybySequence( 2 );
      }
      if ( Severity.length > 0 ) {
        var Severity = Severity[ 0 ].Id.toString();
      }
      else {
        var Severity = null;
      }
      Status = "Draft";
      Action = "Rejected";
    }
    else {
      var Severity = FilterSeveritybySequence( 1 );
      if ( Severity.length > 0 ) {
        var Severity = Severity[ 0 ].Id.toString();
      }
      else {
        var Severity = null;
      }
      Status = "NA";
      Action = "Not Applicable";
  }
  var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
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
      cr3ea_title: Title,
      cr3ea_observedbyrole: userRoleName,
      cr3ea_plantid: PlantId,
      cr3ea_departmentid: userDepratmentId,
      cr3ea_departmenttourid: DepartmentTourId,
      cr3ea_areaid: AreaId,
      cr3ea_nearmiss: NearMissChkBox,
      cr3ea_criteriaid: CriteriaId,
      cr3ea_observedby: ObservedBy,
      cr3ea_observedperson: EmployeeName,
      cr3ea_categoryid: CategoryId,
      cr3ea_categorytitle: CategoryTitleId,
      cr3ea_what: What,
      cr3ea_criteria: Criteria,
      cr3ea_observation: Observation,
      cr3ea_correctiveaction:"",
      cr3ea_severityid: Severity,
      cr3ea_status: Status,
      cr3ea_tourdate: TourDate,
      cr3ea_action: Action,
      cr3ea_observeddate: ObservedDate,
      cr3ea_where:AreaTitle,
      cr3ea_closurecomment:"",
   };
   var itemid="uniqueID_" + CriteriaId + "_" + DepartmentTourId;
   if(sessionStorage.getItem(itemid) != '' && sessionStorage.getItem(itemid) != undefined && sessionStorage.getItem(itemid) != null && sessionStorage.getItem(itemid) != "undefined"){

    var UniqueID = sessionStorage.getItem(itemid);
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + UniqueID + ")";
    const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      const data = await response.json();
      if(data){
        let updatedBtnID = ID + "_BtnId";
        let element = document.getElementById(updatedBtnID);
        element.innerHTML = "Update";
      }
      console.log(data);

      //sessionStorage.setItem(itemid,data.cr3ea_prod_observationsid);
     
   }
   else{
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName ;
    const response = await fetch( apiUrl, {
        method: "POST",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }

      const data = await response.json();
     if(data){
        let updatedBtnID = ID + "_BtnId";
        let element = document.getElementById(updatedBtnID);
        element.innerHTML = "Update";
      }
      ObserItemId = ID.replace( 'ClearBtnId', 'BtnId' );
      $( '#' + ObserItemId ).html( 'Update' );
      //GetObservationForBind( DepartmentTourId, GetObservationForBindSuccess, GetObservationForBindFailure )
      sessionStorage.setItem(itemid,data.cr3ea_prod_observationsid);
   }
 
  }
  UpdateCritCounts();
 HideLoader();
}
async function SaveObservationTableSubmit( data ) {
    ShowLoader();
    var ObservedBy = _spPageContextInfo.userId.toString();
    var Title = userRoleName + '_' + moment().format( 'MM-DD-YYYY' );
    var TourDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    var ObservedDate = moment().format( 'HH:mm A MMMM DD,YYYY ' );
    var ID = $( data ).attr( 'Id' );
  ID = ID.replace( '_BtnId', '' );
  
  if ( ID.split( "_" ).length > 8 ) {
    // No category
    var AreaId = ID.split( "_" )[ 1 ].toString();
    var CriteriaId = ID.split( "_" )[ 9 ];
  } else {
    var AreaId = ID.split( "_" )[ 3 ];
    var CriteriaId = ID.split( "_" )[ 7 ];
  }
  var CriteriaDetails = $.grep( RawCriteriaArray, function ( el ) {
    return el.Id == CriteriaId;
  } );
  var AreaTitle = CriteriaDetails[ 0 ]?.AreaTitle;
  //var DepartmentId = CriteriaDetails[0]?.DepartmentId
  var DepartmentId = userDepratmentId;
  var DepartmentDetails = $.grep( RawDepartmentArray, function ( el ) {
    return el.Id == DepartmentId;
  } );
  var CategoryId = ID.split( "_" ).length > 8 ? null : CriteriaDetails[ 0 ]?.CategoryId.toString();
  var What = CriteriaDetails[ 0 ]?.What
  var Criteria = CriteriaDetails[ 0 ]?.Criteria
  var CriteriaId = CriteriaDetails[ 0 ]?.Id.toString()
  var Observation = $( "#" + ID + "_ObservationId" ).val();
  var ObservationId = $( "#" + ID + "_ObservationClearId" ).val();
  var AttachmentId = $( '#' + ID + "_ObserId" ).val();
  var Action = '';
  var Status = 'Pending';



  var ObservationItemId = '';
  if ( ObservationId != null && ObservationId != '' ) {
    ObservationItemId = ObservationId
  } else if ( AttachmentId != 0 ) {
    ObservationItemId = AttachmentId
  }

  if ( $( '#' + ID + '_ApprovedRdButton' ).is( ':checked' ) == true ) {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id.toString();
    }
    else {
      var Severity = null;
    }
    Action = "Approved";
    Status = "NA";

  }
  else if ( $( '#' + ID + '_RejectedRdButton' ).is( ':checked' ) == true ) {
    if ( $( '#' + ID + '_NearMissId' ).is( ':checked' ) == true ) {
      var Severity = FilterSeveritybySequence( 3 );
    }
    else {
      var Severity = FilterSeveritybySequence( 2 );
    }

    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id.toString();
    }
    else {
      var Severity = null;
    }
    Status = "Pending";
    Action = "Rejected";
  }
  else {
    var Severity = FilterSeveritybySequence( 1 );
    if ( Severity.length > 0 ) {
      var Severity = Severity[ 0 ].Id.toString();
    }
    else {
      var Severity = null;
    }
    Status = "NA";
    Action = "Not Applicable";
  }
  var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
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
      cr3ea_title: Title,
      cr3ea_observedbyrole: userRoleName,
      cr3ea_plantid: PlantId,
      cr3ea_departmentid: userDepratmentId,
      cr3ea_departmenttourid: DepartmentTourId,
      cr3ea_areaid: AreaId,
      cr3ea_criteriaid: CriteriaId,
      cr3ea_observedby: ObservedBy,
      cr3ea_observedperson: EmployeeName,
      cr3ea_categoryid: CategoryId,
      cr3ea_categorytitle: CategoryTitleId,
      cr3ea_what: What,
      cr3ea_criteria: Criteria,
      cr3ea_observation: Observation,
      cr3ea_correctiveaction:"",
      cr3ea_severityid: Severity,
      cr3ea_status: Status,
      cr3ea_tourdate: TourDate,
      cr3ea_action: Action,
      cr3ea_observeddate: ObservedDate,
      cr3ea_where:AreaTitle,
      cr3ea_closurecomment:"",
   };
   var itemid="uniqueID_" + CriteriaId + "_" + DepartmentTourId;
   if(sessionStorage.getItem(itemid) != '' && sessionStorage.getItem(itemid) != undefined && sessionStorage.getItem(itemid) != null && sessionStorage.getItem(itemid) != "undefined"){
    var UniqueID = sessionStorage.getItem(itemid);
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + UniqueID + ")";
    const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      const data = await response.json();
      console.log(data);
      //sessionStorage.setItem(itemid,data.cr3ea_prod_observationsid);
     
   }
 
  }
  UpdateCritCounts();
 HideLoader();
}
async function DeleteObservationTableSuccess( data ){
    var ID = $( data ).attr( 'Id' );
  ID = ID.replace( '_BtnId', '' );
  
  if ( ID.split( "_" ).length > 10 ) {
    // No category
    var AreaId = ID.split( "_" )[ 1 ].toString();
    var CriteriaId = ID.split( "_" )[ 9 ];
  } else {
    var AreaId = ID.split( "_" )[ 3 ];
    var CriteriaId = ID.split( "_" )[ 7 ];
  }
    var itemid="uniqueID_" + CriteriaId + "_" + DepartmentTourId;
    var UniqueID = sessionStorage.getItem(itemid);
    var AccessToken = await getAccessToken();
    var tableName = "cr3ea_prod_observationses";
    var apiVersion = "9.2";
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + UniqueID + ")";
    var AccessToken = await getAccessToken();
    var tableName = "cr3ea_prod_observationses";
    var apiVersion = "9.2";
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
        method: "DELETE",
        headers: header,
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
    }catch{
        console.log("something went wrong");
    }
  }
  var ID = $( data ).attr( 'Id' );
  if ( ID == undefined ) {
    ID = data;
  }
  ObserItemId = ID.replace( 'ClearBtnId', 'BtnId' );
  ClearformID = ID.replace( 'ClearBtnId', 'CNCFormID' );
  clearnrbtnApprove = ID.replace( 'ClearBtnId', 'ApprovedRdButton' );
  clearnrbtnReject = ID.replace( 'ClearBtnId', 'RejectedRdButton' );
  ID = ID.replace( '_ClearBtnId', '' );
  DeleteItemId = ID
  var ItemId = $( "#" + ID + "_ObservationClearId" ).val();
  if ( ItemId != '' && ItemId != undefined ) {
    DeleteListitem( ItemId, DeleteObservationitemSuccess, DeleteObservationitemFailure );
  } else {
    $( "#" + DeleteItemId + "_ObservationClearId" ).val();
    $( "#" + DeleteItemId + "_ObservationId" ).val( '' );
    $( "#" + DeleteItemId + "_CorrectiveActionId" ).val( '' );
    $( "#" + DeleteItemId + "_SeverityID" ).val( 1 );
    $( "#" + DeleteItemId + "_AttachDisId" ).empty();
    $( "#" + DeleteItemId + "_ObservationClearId" ).val( '' )
    $( "#" + DeleteItemId + "_NearMissId" ).prop( "checked", false );
    $( "#" + clearnrbtnApprove ).prop( "checked", false );
    $( "#" + clearnrbtnReject ).prop( "checked", false );

    $( "#" + ClearformID ).hide();
    $( "#" + ClearformID + ' .divNearMissId' ).hide();

    UpdateCritCounts();
    HideLoader();
  }
}
async function GetObservationDataFetch() {
    var AccessToken = await getAccessToken();
    var tableName = "cr3ea_prod_observationses";
    var apiVersion = "9.2";
    var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=cr3ea_departmenttourid eq '" + DepartmentTourId + "'";
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
        getMyRequestSuccess(data);
      }
      } );
      let data = await response.json();
      console.log(data);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
      GetObservationDataFetchSuccess(data?.value);
    }
    catch{
        console.log("something went wrong");
    }
  }
}
function fnNearMissChnge(){
    NearMissChkBox=!NearMissChkBox;
}