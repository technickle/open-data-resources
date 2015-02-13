---
layout: default
laws-file: laws.csv
redirect_from: enacted-laws/
---

<h3>Laws <small>(See also <a href="{{site.baseUrl}}/bills">bills</a>)</small></h3>
<p>There are numerous statutes that govern how state records and data may or may not be used. Some confer confidentiality by exempting particular records from disclosure. Others mandate fully public online reporting. Below are references to SOME of the records and statutes, provided for informational purposes only.</p>

<div class="alert alert-danger">
  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span class="sr-only">Note:</span>
  Due to recent changes to the state's <a href="http://public.leginfo.state.ny.us/lawssrch.cgi?NVLWO:">legislative information site</a>, many of the links below are currently not working correctly. 
</div>

<div class="panel panel-default">
  <div class="panel-heading">
    Laws: <span id="laws-count">0</span>
    <span class="pull-right"><a href="{{site.baseUrl}}/laws/{{page.laws-file}}"><img src="https://raw.githubusercontent.com/BetaNYC/getDataButton/master/png/80x15.png" alt="download raw data"></a></span>
  </div>
  <div class="list-group"></div>
</div>

<script type="text/javascript" src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
  d3.csv("{{site.baseUrl}}/laws/{{page.laws-file}}", function(lawData) {
    if (lawData == undefined) { alert("Unable to load data"); return; }
    d3.select("#laws-count").text(lawData.length);
    d3.select(".list-group").selectAll("a").data(lawData)
      .enter().append("a")
        .attr("href", function(d) { return d.link })
        .classed("list-group-item", true)
        .html(function(d) {
          return "<span class='badge'>" + d.requires + "</span><h4>" + d.law + " " + d.section + "</h4><p>" + d.description + "</p><p>" + d.notes + "</p>"
        }).order();
    d3.select(".list-group").selectAll("a").sort(function(a,b) {return d3.ascending(a.law + " " + a.section, b.law + " " + b.section)});
  });
</script>
