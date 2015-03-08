// bills-app.js by technickle
//

// ************************************************************** initialization
$(function() {
  // load previously used search terms into search box
  if (typeof localStorage.openStatesSearchTerms != "undefined") {
    $("#bill-lookup-input").val(localStorage.openStatesSearchTerms);
  }
  // apply jquery.tokenfield to search box
  $("#bill-lookup-input").tokenfield();

  // prompt for API key if not configured in localStorage
  if (typeof localStorage.openStatesAPIKey == "undefined") {
    showAPIKeyModal();
  } else {

    // load bills if search query is configured in localStorage
    if (typeof localStorage.openStatesSearchTerms != "undefined") {
      $("#bill-lookup-input").val(localStorage.openStatesSearchTerms);
      getBillActivity({q: localStorage.openStatesSearchTerms.replace(/, /g," OR "), updated_since: "2015-01-01"});
    } else {
      // to do: prompt user for search terms
    }
  }
});

// ********************************************* page interaction event handlers
$(function() {

  // load search results from keywords dialogue
  $("#bill-lookup-button").on({
    click: function( event ){
      if (!$("#bill-lookup-input").val().length == 0) {
        // save the search so it can be loaded again
        localStorage.openStatesSearchTerms = $("#bill-lookup-input").val();
        $("loading-modal").modal();
        $("#bills-list").empty();
        getBillActivity({q: $("#bill-lookup-input").val().replace(/, /g," OR "), updated_since: "2015-01-01"});
      }
    }
  });

  // manually show API key config dialog
  $("#change-apikey-button").on({
    click: function( event ){
      showAPIKeyModal();
    }
  });

  // select input text & set focus when API key config dialog is shown
  $("#apikey-modal").on({
    "shown.bs.modal": function( event ){
      $("#apikey-input").select();
      $("#apikey-input").focus();
    }
  });

  // check API key and then dismiss API key config dialog
  $("#apikey-form").on({
    submit: function( event ){
      event.preventDefault();
      validateAPIKey($("#apikey-input").val(),
        function(data, textStatus, jqXHR){
          localStorage.openStatesAPIKey = $("#apikey-input").val();
          $("#apikey-formgroup").removeClass("has-error");
          $("#apikey-errortext").removeClass("text-danger").text("");
          $("#apikey-modal").modal("hide");
        },
        function(jqXHR, textStatus, errorThrown){
          $("#apikey-formgroup").addClass("has-error");
          $("#apikey-errortext").addClass("text-danger").text("Error: incorrect API key, or error validating.");
          $("#apikey-input").select();
          $("#apikey-input").focus();
      });
    }
  });

  // when the loading modal is hidden, show the bill preview modal
  $("#bill-preview-loading-modal").on({
    "hidden.bs.modal": function( event ){
      $("#bill-preview-modal").modal();
    }
  });

  // show clear all confirmation modal
  $("#pre-clear-all-button").on({
    click: function( event ){
      $("#clear-all-data-modal").modal();
    }
  });

  // clear all localStorage data and reload page
  $("#clear-all-data-button").on({
    click: function (event ){
      clearAllData();
      location.reload();
    }
  });

  // note: click event handler for loaded bills are registered in getBillActivity

});

// ******************************************************* controllers/functions
// check the API key to see if it is valid
function validateAPIKey(key, success, error) {
  parameters = {apikey: key};
  $.getJSON("http://openstates.org/api/v1/metadata/ny/?" + encodeQueryData(parameters))
    .success(success)
    .error(error);
}

// display the API key config modal after local-loading stored API key
function showAPIKeyModal() {
  $("#apikey-input").val(localStorage.openStatesAPIKey);
  $("#apikey-modal").modal();
}

// display the Bill modal
//    pro tip: load in the content before displaying it!
function showBillModal(openStatesData) {
  $("#bill-preview-loading-modal").modal();
  getBillHtml(openStatesData.bill_id.replace(/ /g,''), function(billHtml){
    $("#bill-id").text(openStatesData.bill_id);
    $("#bill-text").html(billHtml);
    $("#bill-preview-loading-modal").modal('hide');
    // #bill-preview-modal is shown on loading-bill-preview-modal hidden event
  }, function(error){
    console.log(error);
    $("#bill-preview-loading-modal").modal('hide');
  })
}

// retrieve bill text HTML fragment using YQL to drop the rest of the page
function getBillHtml(id, success, error) {
  assemblyParameters = {sh: "printbill", bn: id, term: "2015"};
  yqlParameters = {
    q: 'select * from html where url="http://assembly.state.ny.us/leg/?' + encodeQueryData(assemblyParameters) + '" and xpath="//body/pre"',
    format: "json"
  };
  $.get("https://query.yahooapis.com/v1/public/yql?" + encodeQueryData(yqlParameters))
    .success(function(data){success(data.query.results.pre)})
    .error(error);
}

// retrieve bill activity stream (and render it)
function getBillActivity(parameters,callback){
  parameters.state = "ny"
  parameters.type = "bill";
  parameters.apikey = localStorage.openStatesAPIKey;

  d3.json("http://openstates.org/api/v1/bills/?" + encodeQueryData(parameters), function(error, billData){
    if (error) return console.warn(error);
    if (billData == undefined) { alert("Unable to load data"); return; }
    d3.select("#bills-count").text(billData.length);
    billList = d3.select("#bills-list").selectAll("a").data(billData);
    billList
      .enter().append("a")
        .classed("list-group-item bill-event", true)
        .html(function(d) {
          return "<button class='btn btn-default glyphicon glyphicon-heart pull-right'></button><h4>"+ d.title + " (" + d.bill_id + ")</h4><p class='text-muted'>Updated: " + d.updated_at + "</p>"
        })
    billList.exit().remove();
    d3.select(".list-group").selectAll("a").sort(function(a,b) {
      return d3.descending(a.updated_at, b.updated_at);
    });

    // register event handler to display bill details modal on row click
    $(".bill-event").on({
      click: function ( event ) {
        showBillModal(event.currentTarget.__data__);
      }
    });
  });
}

// clear all locally stored information - makes the app reset to first-time use
function clearAllData() {
  localStorage.removeItem("openStatesAPIKey");
  localStorage.removeItem("openStatesSearchTerms");
  localStorage.removeItem("lastUpdated");
}

// *********************************************************** utility functions
// generate URL parameters string from JS object
function encodeQueryData(data)
{
   var ret = [];
   for (var d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
   return ret.join("&");
}
