---
layout: default
---

#NYS Law

See also: [pending legislation](../legislation)

There are numerous statutes that confer confidentiality by exempting particular records from disclosure. Due to recent changes to the state's [legislative information site](http://public.leginfo.state.ny.us/lawssrch.cgi?NVLWO:), the links below do not work correctly. Below are brief references to some of the records and the statutes, provided for informational purposes only.  ([Download as raw data](enacted-laws.csv)).

<div id="laws-div"></div>
<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="../js/jquery-csv.0.71.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">

<script type="text/javascript">

  $( document ).ready(function() {
    $.ajax("enacted-laws.csv", {
      success: function(returnedData, textStatus, jqXHR) {
        $.csv.toObjects(returnedData, {}, function(err, csvData) {
          $("#laws-div").html('<span id="laws_count"></span><table id="laws-table" cellpadding="0" cellspacing="0" border="0" class="display" width="100%"></table>');
          $("#laws-table").DataTable({
            // "ajax": webUrl,   // loading data this way doesn't work. Maybe a jquery version compatability issue?
            "data": csvData,
            "paging": false,
            "processing": true,  // only useful if DataTable's ajax handler is used
            "order": [[1, "asc"]],
            "columns": [
              {"title": "Source", "data": "Source", "width": "10%"},
              {"title": "Law", "data": "Law", "width": "35%", "render": function(data, type, full, meta){
                if (full.Link) { return '<a href="' + full.Link + '" target="_new">' + full.Law + ' ' + full.Section + '</a>' }
                  else { return full.Law + ' ' + full.Section }
              }},
              {"title": "Description", "data":"Description", "width": "40%"},
              {"title": "Notes", "data": "Notes", "width": "20%"}
  
              //{"title":"Title", "data": "title", "render": function(data, type, full, meta){
              //  if (full.landingPage) { return '<a href="' + full.landingPage + '" target="_new">' + data + '</a>'}
              //    else {return data}
              //  }},
            ]
          });
          $("#laws_count").text('Total items: ' + $("#laws-table").DataTable().rows()[0].length);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("unable to load CSV data file: " + errorThrown);
      }
          
          
    });
  });
  
</script>
