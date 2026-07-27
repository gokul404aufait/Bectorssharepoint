
var environmentUrl = "https://org487f0635.crm8.dynamics.com";

function getFormDigest(WebAbsoluteUrl) {
    return $.ajax({
        url: WebAbsoluteUrl+ "/_api/contextinfo",
        method: "POST",
        headers: { "Accept": "application/json; odata=verbose" }
    });
}

function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";
}

function getListItemByQuery(requestQuery, OnSuccessFilldata, Success, Failure) {
    $.ajax({
        url: requestQuery,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if(Success != null) {
	            OnSuccessFilldata(data, Success, Failure);
	        }
        },
        error: function (data) {
        	if(Failure != null) {
	            Failure(data);
	        }
        }
    });
}
function getListItemByQuerysync(requestQuery, OnSuccessFilldata, Success, Failure) {
    $.ajax({
        url: requestQuery,
        method: "GET",
        async:false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if(Success != null) {
	            OnSuccessFilldata(data, Success, Failure);
	        }
        },
        error: function (data) {
        	if(Failure != null) {
	            Failure(data);
	        }
        }
    });
}


function getListItemByQuerySyncWithData(requestQuery,fieldid, OnSuccessFilldata, Success, Failure) {
    $.ajax({
        url: requestQuery,
        async:false,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if(Success != null) {
	            OnSuccessFilldata(data,fieldid, Success, Failure);
	        }
        },
        error: function (data) {
        	if(Failure != null) {
	            Failure(data);
	        }
        }
    });
}


function getListItemWithId(itemId, listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Id eq " + itemId;
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {
                success(data.d.results[0]);
            }
            else {
                failure("Multiple results obtained for the specified Id value");
            }
        },
        error: function (data) {
            failure(data);
        }
    });
}

function getListItemWithIdwithdata(itemId,datavalue, listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Id eq " + itemId;
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {
                success(data.d.results[0],datavalue);
            }
            else {
                failure("Multiple results obtained for the specified Id value");
            }
        },
        error: function (data) {
            failure(data,datavalue);
        }
    });
}


function createFolder(resturl, siteUrl, item, success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {
	    $.ajax({
	        url: resturl,
	        method: "POST",
	        contentType: "application/json;odata=verbose",
	        data: JSON.stringify(item),
	        headers: {
	            "Accept": "application/json;odata=verbose",
	            "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue
	        },
	        success: function (data) {
	        	if(success != null) {
		            success(data);
		        }
	        },
	        error: function (data) {
	        	if(failure != null) {
		            failure(data);
		        }
	        }
	    });
	   });
}


function createListItem(listName, siteUrl, item, success, failure) {

	return getFormDigest(WebAbsoluteUrl).then(function (data1) {
	    $.ajax({
	        url: siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
	        type: "POST",
	        contentType: "application/json;odata=verbose",
	        data: JSON.stringify(item),
	        headers: {
	            "Accept": "application/json;odata=verbose",
	            //"X-RequestDigest": $("#__REQUESTDIGEST").val()
	            "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue
	        },
	        success: function (data) {
	        	if(success != null) {
		            success(data);
		        }
	        },
	        error: function (data) {
	        	if(failure != null) {
		            failure(data);
		        }
	        }
	    });
	 });
}

function createListItemSync(listName, siteUrl, item, success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	    $.ajax({
	        url: siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
	        type: "POST",
	        async:false,
	        contentType: "application/json;odata=verbose",
	        data: JSON.stringify(item),
	        headers: {
	            "Accept": "application/json;odata=verbose",
	            "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue

	        },
	        success: function (data) {
	        	if(success != null) {
		            success(data);
		        }
	        },
	        error: function (data) {
	        	if(failure != null) {
		            failure(data);
		        }
	        }
	    });
    });
}

function createListItemwithdata(listName, siteUrl, item,datatext, success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	    $.ajax({
	        url: siteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
	        type: "POST",
	        contentType: "application/json;odata=verbose",
	        data: JSON.stringify(item),
	        headers: {
	            "Accept": "application/json;odata=verbose",
	            "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue

	        },
	        success: function (data) {
	        	if(success != null) {
		            success(data,datatext);
		        }
	        },
	        error: function (data) {
	        	if(failure != null) {
		            failure(data);
		        }
	        }
	    });
    });
}



function updateListItem(itemId, listName, siteUrl, item, success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {
		getListItemWithId(itemId, listName, siteUrl, function (data) {
	        $.ajax({
	            url: data.__metadata.uri,
	            type: "POST",
	            contentType: "application/json;odata=verbose",
	            data: JSON.stringify(item),
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                "X-HTTP-Method": "MERGE",
	                "If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            	if(success != null) {
		                success(data);
					}
	            },
	            error: function (data) {
	            	if(failure != null) {
		                failure(data);
					}
	            }
	        });
	    }, function(data){
	        failure(data);
	    });
    });
}

function updateListItemSync(itemId, listName, siteUrl, item, success, failure) {
     
     return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	    getListItemWithId(itemId, listName, siteUrl, function (data) {
	        $.ajax({
	            url: data.__metadata.uri,
	            type: "POST",
	            async:false,
	            contentType: "application/json;odata=verbose",
	            data: JSON.stringify(item),
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                "X-HTTP-Method": "MERGE",
	                "If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            	if(success != null) {
		                success(data);
					}
	            },
	            error: function (data) {
	            	if(failure != null) {
		                failure(data);
					}
	            }
	        });
	    }, function(data){
	        failure(data);
	    });
    });
}



function updateListItemwithData(itemId,datavalue, listName, siteUrl, item, success, failure) {
     
     return getFormDigest(WebAbsoluteUrl).then(function (data1) {

     
	    getListItemWithIdwithdata(itemId,datavalue, listName, siteUrl, function (data) {
	        $.ajax({
	            url: data.__metadata.uri,
	            type: "POST",
	            contentType: "application/json;odata=verbose",
	            data: JSON.stringify(item),
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                "X-HTTP-Method": "MERGE",
	                "If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            	if(success != null) {
		                success(data,datavalue);
					}
	            },
	            error: function (data) {
	            	if(failure != null) {
		                failure(data,datavalue);
					}
	            }
	        });
	    }, function(data){
	        failure(data);
	    });
    });
}


function deleteListItem(itemId, listName, siteUrl, success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	    getListItemWithId(itemId, listName, siteUrl, function (data) {
	        $.ajax({
	            url: data.__metadata.uri,
	            type: "POST",
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-Http-Method": "DELETE",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                "If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            if(success != null) {
	
	                success(data);
	                }
	            },
	            error: function (data) {
	            if(failure != null) {
	
	                failure(data);
	                }
	            }
	        });
	    },
	   function (data) {
	       failure(data);
	   });
   });
}

function deleteListItemAttachment(RestURI,success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	        $.ajax({
	            url: RestURI,
	            type: "POST",
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-Http-Method": "DELETE",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                //"If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            if(success != null) {
	
	                success(data);
	                }
	            },
	            error: function (data) {
	            if(failure != null) {
	
	                failure(data);
	                }
	            }
	        });
        });
}

function deleteSPFile(RestURI,success, failure) {
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	        $.ajax({
	            url: RestURI,
	            type: "POST",
	            headers: {
	                "Accept": "application/json;odata=verbose",
	                "X-Http-Method": "DELETE",
	                "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	                //"If-Match": data.__metadata.etag
	            },
	            success: function (data) {
	            if(success != null) {
	
	                success(data);
	                }
	            },
	            error: function (data) {
	            if(failure != null) {
	
	                failure(data);
	                }
	            }
	        });
        });
}



function IsCurrentUserMemberOfGroup(groupName, OnComplete_Response)
{
        currentContext  = null;
        currentWeb  = null;
        allGroups   = null;
        leaderGroup     = null;
        currentUser     = null;
        groupUsers  = null;
        
        // Get an instance of client context for connnection purpose         
        currentContext = new SP.ClientContext.get_current();
        
        //Grab the client web object.
        currentWeb = currentContext.get_web();
        
        
        //Get the current user object
        currentUser = currentContext.get_web().get_currentUser();
        currentContext.load(currentUser);
        
        //Setup the groupColletion.
        allGroups = currentWeb.get_siteGroups();
        currentContext.load(allGroups);
        
        var group = allGroups.getByName(groupName);
        currentContext.load(group);
        
        var groupUsers = group.get_users();
        currentContext.load(groupUsers);
        
        //Now populate the objects above.
        currentContext.executeQueryAsync(
            Function.createDelegate(this, SingleGroupExecuteOnSuccess_innerRF),
            Function.createDelegate(this, ExecuteOnFailure_innerRF)
        );        
        
        // Single Group - Load - SUCCESS
        function SingleGroupExecuteOnSuccess_innerRF(sender, args)
         {
          
 
            // This is the flag to set to true if the user is in the group.
            var boolUserInGroup = false;
            
              // Time to setup the Enumerator
            var groupUserEnumerator = groupUsers.getEnumerator();
 
            // and start looping.
            while (groupUserEnumerator.moveNext()) 
            {
 
                //Grab the User Item.
                var groupUser = groupUserEnumerator.get_current();
 
                // and finally. If a Group User ID Matches the current user ID then they are in the group!
                if (groupUser.get_id() == currentUser.get_id())
                 {
                    boolUserInGroup = true;
                    break;
                }
            }
 
           //Run the delegate function with the bool;
          
             OnComplete_Response(boolUserInGroup);
            
        }
 
        // GroupCollection or Single Group - Load - FAILURE
        function ExecuteOnFailure_innerRF(sender, args)
         {
			//Run the delegate function and return false because there was no match.
             OnComplete_Response(false);
        } 
        
       
        
}


function ensureLoggedUser(webUrl,loginName,fieldid,success,failure)
{
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	   var payload = { 'logonName': loginName }; 
	   return $.ajax({
	      url: webUrl + "/_api/web/ensureuser",
	      type: "POST",
	      async:false,
	      contentType: "application/json;odata=verbose",
	      data: JSON.stringify(payload),
	      headers: {
	         "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	         "accept": "application/json;odata=verbose"
	      },
	      success: function (data) {
	        if(success != null) {
	
	            success(data.d.Id,fieldid);
	            }
	        },
	        error: function (data) {
	        if(failure != null) {
	
	            failure(data,fieldid);
	            }
	        }
	
	   });
   });  
}


function ensureLoggedUserNew(webUrl,loginName)
{
	return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	   var payload = { 'logonName': loginName }; 
	   return $.ajax({
	      url: webUrl + "/_api/web/ensureuser",
	      type: "POST",
	      contentType: "application/json;odata=verbose",
	      data: JSON.stringify(payload),
	      headers: {
	         "X-RequestDigest": data1.d.GetContextWebInformation.FormDigestValue,
	         "accept": "application/json;odata=verbose"
	      }
	   });  
   });
}




