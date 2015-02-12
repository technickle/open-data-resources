---
layout: default
bills_file: bills.csv
redirect_from: legislation/
---

<h3>Bills <small>(See also <a href="{{site.baseUrl}}/laws">laws</a>)</small></h3>
<p>Below is a list of bills being considered by the legislature. This is not intended to be an exhaustive list - for example, it does not list STEM education items.</p>
<div class="panel panel-default">
  <div class="panel-heading">
    Bills under consideration: <span id="bills-count">0</span>
    <span class="pull-right"><a href="{{site.baseUrl}}/bills/{{page.bills_file}}"><img src="https://raw.githubusercontent.com/BetaNYC/getDataButton/master/png/80x15.png" alt="download raw data"></a></span>
  </div>
  <div class="list-group"></div>
</div>

<script type="text/javascript" src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
  d3.csv("{{site.baseUrl}}/bills/{{page.bills_file}}", function(billData) {
    if (billData == undefined) { alert("Unable to load data"); return; }
    d3.select("#bills-count").text(billData.length);
    d3.select(".list-group").selectAll("a").data(billData)
      .enter().append("a")
        .attr("href", function(d) { return d.link })
        .classed("list-group-item", true)
        .html(function(d) {
          identifiers = [];
          if (d.assemblyId !== "") {identifiers.push(d.assemblyId)}
          if (d.senateId !== "") {identifiers.push(d.senateId)}
          if (d.jointId !== "") {identifiers.push(d.jointId)}
          identifierText = identifiers.join(" / ");
          re = /\s*;\s*/;
          return "<h4>"+ d.title + " (" + identifierText + ")</h4><span class='badge'>" + d.subjects + "; " + d.topics + "</span><p>" + d.notes + "</p>"
        });
  });
</script>
