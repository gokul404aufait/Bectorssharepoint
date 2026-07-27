$(document).ready(function(){	
	
	GetPendingObservationCategoryCountData(0,1,PendingObservationCategoryCountSuccess,PendingObservationCategoryCountFailure);
	
	});
function PendingObservationCategoryCountSuccess(collObservationReport)

{
	var PendingObsCountIds='';
	if(collObservationReport.length>0)
	{

		var tempPendingObservationCountHTML='';
		
		rawPendingObsCountIds = collObservationReport;
		if(PendingObsCountIds.trim()!='')
		{
			PendingObsCountIds=PendingObsCountIds+' or CategoryId/Id eq '+collObservationReport[i].Id;
		}
		else
		{
			PendingObsCountIds='CategoryId/Id eq '+collObservationReport[i].Id;
		}

		for(var i=0; i<collObservationReport.length;i++)
		{
					var observedDate = moment(collObservationReport[i].ObservedDate).format('DD/MMM/YYYY');
 					tempPendingObservationCountHTML+='<tr>'+
				       		 '<td>'+collObservationReport[i].Id+'</td>'+
				           '<td>'+collObservationReport[i].DepartmentIdTitle+'</td>'+
				           '<td>'+collObservationReport[i].CategoryIdTitle+'</td>'+
				           '<td>'+collObservationReport[i].What+'</td>'+						 
						   '<td>'+collObservationReport[i].Observation+'</td>'+
						   	'<td>'+collObservationReport[i].CorrectiveAction+'</td>'+
						   	'<td>'+collObservationReport[i].SeverityIdTitle+'</td>'+
						   	'<td>'+collObservationReport[i].ObservedByTitle+'</td>'+
						   	'<td>'+observedDate+'</td>'+
						   	'</tr>';
		 }
			var finalPendingObsCountIDFilter='('+PendingObsCountIds+')';
			
	    $('#PendingObsId').empty().append(tempPendingObservationCountHTML);
	    var currentId=moment().format('hhmmss');
	    $('#PendingObservationCountId table').attr('id','PendingObservationCountId_'+currentId);
	    InitializeTable('PendingObservationCountId_'+currentId);
	    
	    
	   
	}
	else
	{ 
		$('#divNoRecords').show();
	
	}
	
}

function PendingObservationCategoryCountFailure()
{
	alert('Failure in Pending Observation Category Count');
}
function InitializeTable(tableId){
	$('#'+tableId).DataTable({
        searching: false,
        "autoWidth": false,
        "lengthMenu": [ 5,15, 20, 25],
        
         dom: 'Bfrtip',
       buttons: [
           //'copyHtml5',
           
           {
              // extend: 'excelHtml5',
               //text:'Export to Excel',
               title: 'Appraisal Division Report',
               className:'ExportButton'
           }] 
        
        
    });
}
