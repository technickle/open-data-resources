// bills-app.js by technickle
//
// **********************************************************view event handlers

// populate page content from source APIs
//    (also prompts for API key, etc, if no configuration/data saved locally)
$( document ).ready( function() {
  $("#bill-lookup-input").tokenfield();
  if (localStorage.openStatesAPIKey === undefined) {
    showAPIKeyModal();
  } else {
    console.log("$.ready()")
    // getBillActivity({q: "data OR technology OR cyber", updated_since: "2015-01-01"});
  }
});

// handler to load keyword results
$("#bill-lookup-button").click(function(){
  if (!$("#bill-lookup-input").val().length == 0) {
    $("#bills-list").empty();
    getBillActivity({q: $("#bill-lookup-input").val().replace(","," OR "), updated_since: "2015-01-01"});
  }
});

// handler to manually show API key config dialog
$("#changeAPIKey-button").click(function(){
    showAPIKeyModal();
});

// handler to select input text & set focus when API key config dialog is shown
$("#apikey-modal").on("shown.bs.modal", function(e){
  $("#apikey-input").select();
  $("#apikey-input").focus();
});

// handler to check API key and then dismiss API key config dialog
$("#apikey-form").submit(function(e){
  e.preventDefault();
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
});

// handler to clear all locally-stored data
$("#clearAll-button").click(function(){
    clearAllData();
    location.reload();
});

// ********************************************************controllers/functions
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
  $("body").modalmanager('loading');
  getBillHtml(openStatesData.bill_id.replace(/ /g,''), function(billHtml){
    $("#bill-id").text(openStatesData.bill_id);
    $("#bill-text").html(billHtml);
    $("#bill-preview").modal();
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
    $(".bill-event").click(function(obj){
      showBillModal(obj.currentTarget.__data__);
    });
  });
}

// clear all locally stored information - makes the app reset to first-time use
function clearAllData() {
  localStorage.removeItem("openStatesAPIKey");
  localStorage.removeItem("openStatesSearchTerms");
  localStorage.removeItem("lastUpdated");
}

// *************************************************************utility functions

// generate URL parameters string from JS object
function encodeQueryData(data)
{
   var ret = [];
   for (var d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
   return ret.join("&");
}
