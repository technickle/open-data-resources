---
layout: default
---

# Legislative activities impacting Technology, Data, Reporting and/or Transparency

This is not intended to be an exhaustive list. See also [enacted laws](../enacted-laws) for laws which are already in effect. ([Download as raw data]("legislative-actions.csv"))

<div id="actions-div"></div>
<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="../js/jquery-csv.0.71.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">

<script type="text/javascript">

  $( document ).ready(function() {
    $.ajax("legislative-actions.csv", {
      success: function(returnedData, textStatus, jqXHR) {
        $.csv.toObjects(returnedData, {}, function(err, csvData) {
          $("#actions-div").html('<span id="actions-count"></span><table id="actions-table" cellpadding="0" cellspacing="0" border="0" class="display" width="100%"></table>');
          $("#actions-table").DataTable({
            // "ajax": webUrl,   // loading data this way doesn't work. Maybe a jquery version compatability issue?
            "data": csvData,
            "paging": false,
            "processing": true,  // only useful if DataTable's ajax handler is used
            "order": [[1, "asc"]],
            "columns": [
              {"title": "Relevance", "data":"relevance", "width":"5%"},
              {"title": "Identifier(s)", "render": function(data,type,full,meta){
                if (full.link) { return '<a href="' + full.link + '" target="_new">' + full.assemblyId + ' ' + full.senateId + ' ' + full.jointId + '</a>' }
                  else { return full.assemblyId + ' ' + full.senateId + ' ' + full.jointId}
              }, "width":"10%"},
              {"title": "Subject(s)", "data": "subjects", "width": "10%"},
              {"title": "Topic(s)", "data": "topics", "width": "15%"},
              {"title": "Title", "data": "title", "width": "25%"},
              {"title": "Notes", "data": "notes", "width": "40%"}
            ]
          });
          $("#actions-count").text('Total items: ' + $("#actions-table").DataTable().rows()[0].length);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("unable to load CSV data file: " + errorThrown);
      }
    });
  });
  
</script>
