var resX = 1024,
  resY = 728,
  dX = 24,
  dY = parseInt((resY * dX) / resX),
  xmin = 0.0,
  xmax = 6000.0,
  ymin = -2000.0,
  ymax = 2000.0;
var n_abstract, n_title, n_keywords, data_json, data_json_i;
var n_time,
  min_time = 2000,
  max_time = 0,
  time = min_time,
  min_radius = 10000.0,
  x0,
  y0;
var keywords = [],
  p = [],
  p_shift = [],
  v = [],
  v_shift = [],
  radius = [],
  sort_radius = [],
  indexes = [],
  index,
  v_mean = 0.0,
  v_min = 10000.0,
  v_max = -v_min,
  p_min = 10000.0,
  p_max = -p_min;
var t, k, t0, k0, min_distance, distance, p1;
var n_forests,
  forest_coverage = [],
  n_forest_coverage = [],
  global_ice,
  volume;

// var xScale=d3.scale.log().domain([xmin,xmax]).range([dX,resX-dX]),
var xScale = d3.scale
    .linear()
    .domain([xmin, xmax])
    .range([dX, resX - dX]),
  yScale = d3.scale
    .linear()
    .domain([ymin, ymax])
    .range([resY - dY, dY]);

// var svgContainer=d3.select("#chart").append("svg")
var svgContainer = d3
  .select("body")
  .append("svg")
  .attr("width", resX)
  .attr("height", resY)
  .append("g")
  .attr("transform", "translate(" + 0 + "," + 0.5 * resY + ")");

// x and y axis
var xAxis = d3.svg
    .axis()
    .orient("bottom")
    .scale(xScale)
    .ticks(12, d3.format(",d")),
  yAxis = d3.svg
    .axis()
    .scale(yScale)
    .orient("right");
svgContainer
  .append("g")
  .attr("class", "x axis")
  .call(xAxis);
svgContainer
  .append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + dX + "," + -0.5 * resY + ")")
  .call(yAxis);

// x-axis label
svgContainer
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", resX - dX)
  .attr("y", 0)
  .text("# publications");
// y-axis label
svgContainer
  .append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("x", 200.0)
  .attr("y", 0.5 * resY - dY - (resY - 2.0 * dY))
  // .attr("dy",".75em")
  // .attr("transform","rotate(-90)")
  .text("publications velocity");

// graph of the pudmed
function requestJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
      callback(xhr.response);
    }
  };
  xhr.open("GET", "./data/title_abstract_keywords.json", true);
  // xhr.setRequestHeader('Access-Control-Allow-Methods','GET');
  // xhr.setRequestHeader('Content-Type','application/json');
  xhr.send(null);
}

var colors = [
  "#ffeecc",
  "#ccffcc",
  "#ffffcc",
  "#ffe6cc",
  "#ccccff",
  "#e6ccff",
  "#d6f5d6",
  "#ffebcc",
  "#ccddff",
  "#ffccff",
  "#cce6ff"
];
var n_colors = colors.length;

// https://www.ncdc.noaa.gov/cag/global/time-series/globe/land/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017
var temp_anom_land = {
  description: {
    title: "Global Land Temperature Anomalies, January-December",
    units: "Degrees Celsius",
    base_period: "1901-2000",
    missing: -999
  },
  data: {
    "2000": "0.62",
    "2001": "0.81",
    "2002": "0.92",
    "2003": "0.88",
    "2004": "0.79",
    "2005": "1.03",
    "2006": "0.90",
    "2007": "1.08",
    "2008": "0.85",
    "2009": "0.87",
    "2010": "1.07",
    "2011": "0.89",
    "2012": "0.90",
    "2013": "0.98",
    "2014": "1.00",
    "2015": "1.34",
    "2016": "1.44",
    "2017": "1.31"
  }
};
// https://www.ncdc.noaa.gov/cag/global/time-series/globe/ocean/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017
var temp_anom_ocean = {
  description: {
    title: "Global Ocean Temperature Anomalies, January-December",
    units: "Degrees Celsius",
    base_period: "1901-2000",
    missing: -999
  },
  data: {
    "2000": "0.35",
    "2001": "0.44",
    "2002": "0.48",
    "2003": "0.51",
    "2004": "0.49",
    "2005": "0.51",
    "2006": "0.50",
    "2007": "0.43",
    "2008": "0.42",
    "2009": "0.55",
    "2010": "0.56",
    "2011": "0.46",
    "2012": "0.51",
    "2013": "0.55",
    "2014": "0.64",
    "2015": "0.74",
    "2016": "0.76",
    "2017": "0.67"
  }
};

// reading json file
function readJSON(data) {
  data_json = data;

  // temperatures anomalies
  document.getElementById("year").innerHTML = time.toString();
  document.getElementById(
    "tanom_land"
  ).innerHTML = "temperature anomaly land : ".concat(
    temp_anom_land["data"][time.toString()]
  );
  document.getElementById(
    "tanom_ocean"
  ).innerHTML = "temperature anomaly ocean : ".concat(
    temp_anom_ocean["data"][time.toString()]
  );
  // calculing the forest coverage
  for (var i = 0; i < 2019 - min_time; i++) {
    forest_coverage.push(0.0);
    n_forest_coverage.push(0);
  }
  n_forests = data_json["forest"].length;
  for (var i = 0; i < n_forests; i++) {
    forest_coverage[data_json["forest"][i]["time"] - min_time] +=
      data_json["forest"][i]["coverage"];
    n_forest_coverage[data_json["forest"][i]["time"] - min_time] += 1;
  }
  for (var i = 0; i < n_forests; i++)
    forest_coverage[i] /= n_forest_coverage[i];
  document.getElementById(
    "forest_coverage"
  ).innerHTML = "forest coverage : ".concat(
    forest_coverage[time - min_time].toPrecision(3).toString()
  );
  // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json
  global_surface_ice = data_json["ice"];
  for (var i = 0; i < global_surface_ice.length; i++) {
    if (global_surface_ice[i]["time"] == time)
      document.getElementById(
        "ice surface (million of km2)"
      ).innerHTML = "ice surface : ".concat(
        global_surface_ice[i]["surface"].toPrecision(3).toString(),
        " million of km2"
      );
  }

  n_title = data_json["title"].length;
  n_abstract = data_json["abstract"].length;
  for (var i = 0; i < n_title; i++)
    min_time = Math.min(min_time, data_json["title"][i]["time"]);
  for (var i = 0; i < n_title; i++)
    max_time = Math.max(max_time, data_json["title"][i]["time"]);
  n_keywords = Object.keys(data_json["keywords"]).length;
  n_time = max_time - min_time + 1;
  for (var i = 0; i < n_title; i++) {
    p.push(0.0);
    p_shift.push(0.0);
    v.push(0.0);
    v_shift.push(0.0);
    radius.push(0.0);
  }
  console.log(n_keywords);
  console.log(n_title);
  console.log(min_time);
  console.log(max_time);
  console.log(data_json["keywords"]);
  // radius
  for (var i = 0; i < n_abstract; i++) {
    t = data_json["abstract"][i]["time"] - min_time;
    k = data_json["keywords"][data_json["abstract"][i]["keyword"]];
    radius[t * n_keywords + k] =
      Math.sqrt(data_json["abstract"][i]["value"] / Math.PI) / 3.0; // data_json['abstract'][i]['value']/1000.0;// Math.log(Math.max(1.0,data_json['abstract'][i]['value']))/Math.log(2.0);
    sort_radius.push([radius[t * n_keywords + k], t * n_keywords + k]);
    if (radius[t * n_keywords + k] > 0.0)
      min_radius = Math.min(min_radius, radius[t * n_keywords + k]);
  }
  // sorting radius
  sort_radius.sort(function(a, b) {
    return b[0] < a[0] ? -1 : 1;
  });
  for (var i = 0; i < n_abstract; i++) {
    t = data_json["abstract"][i]["time"] - min_time;
    k = data_json["keywords"][data_json["abstract"][i]["keyword"]];
    indexes.push(sort_radius[i][1]);
  }
  // positions
  for (var i = 0; i < n_title; i++) {
    t = data_json["title"][i]["time"] - min_time;
    k = data_json["keywords"][data_json["title"][i]["keyword"]];
    p[t * n_keywords + k] = data_json["title"][i]["value"];
  }
  // velocities
  for (var i = 0; i < n_title; i++) {
    t = data_json["title"][i]["time"] - min_time;
    k = data_json["keywords"][data_json["title"][i]["keyword"]];
    if (t > 0)
      v[t * n_keywords + k] =
        p[t * n_keywords + k] - p[(t - 1) * n_keywords + k];
  }
  for (var i = 0; i < n_title; i++) v_mean += v[i] / n_title;
  for (var i = 0; i < n_title; i++) v_min = Math.min(v_min, v[i] - radius[i]);
  for (var i = 0; i < n_title; i++) v_max = Math.max(v_max, v[i] + radius[i]);
  for (var i = 0; i < n_title; i++) p_min = Math.min(p_min, p[i] - radius[i]);
  for (var i = 0; i < n_title; i++) p_max = Math.max(p_max, p[i] + radius[i]);
  for (var i = 0; i < n_title; i++)
    p_shift[i] = dX + ((p[i] - xmin) * (resX - 2.0 * dX)) / (xmax - xmin);
  for (var i = 0; i < n_title; i++)
    v_shift[i] =
      0.5 * resY - dY - ((v[i] - ymin) * (resY - 2.0 * dY)) / (ymax - ymin);
  console.log("p(min):".concat(p_min.toString()));
  console.log("p(max):".concat(p_max.toString()));
  console.log("v(min):".concat(v_min.toString()));
  console.log("v(max):".concat(v_max.toString()));
  console.log([n_abstract, n_title, n_keywords * n_time]);
  for (var i = 0; i < n_abstract; i++) {
    index = indexes[i];
    // if(radius[index]>0.0){
    // console.log([index%n_keywords,n_keywords,colors[(index%n_keywords)%n_colors]]);
    svgContainer
      .append("circle")
      .attr("cx", p_shift[index])
      .attr("cy", v_shift[index])
      .attr("r", radius[index])
      .style("fill", colors[(index % n_keywords) % n_colors])
      .attr("id", "c" + index.toString());
    // }
  }
} // reading the json file

// writing text on mouse over
svgContainer.on("mouseover", function() {
  p1 = d3.mouse(this);
  min_distance = 10000000.0;
  k0 = -1;
  t0 = -1;
  for (var i = 0; i < n_title; i++) {
    t = data_json["title"][i]["time"] - min_time;
    k = data_json["keywords"][data_json["title"][i]["keyword"]];
    x0 = p_shift[t * n_keywords + k];
    y0 = v_shift[t * n_keywords + k];
    distance = Math.sqrt(
      (p1[0] - x0) * (p1[0] - x0) + (p1[1] - y0) * (p1[1] - y0)
    );
    if (distance < min_distance) {
      t0 = t;
      k0 = k;
      min_distance = distance;
    } // Fi distance
  } // Rof i
  if (k0 != -1 && t0 != -1) {
    for (var i = 0; i < n_title; i++) {
      k = data_json["keywords"][data_json["title"][i]["keyword"]];
      if (k === k0) {
        t = data_json["title"][i]["time"] - min_time;
        index = t * n_keywords + k;
        svgContainer
          .append("circle")
          .attr("cx", p_shift[index])
          .attr("cy", v_shift[index])
          .attr("r", radius[index])
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-width", 5.0)
          .attr("id", "sc" + index.toString());
        svgContainer
          .append("text")
          .attr({
            id: "t" + t + "k" + k,
            x: p_shift[index],
            y: v_shift[index]
          })
          .text(
            Object.keys(data_json["keywords"])
              [k].concat(" : ", data_json["title"][i]["value"].toString())
              .concat(" in ", data_json["title"][i]["time"].toString())
              .concat(", ", v[index].toString())
          );
      } else {
        t = data_json["title"][i]["time"] - min_time;
        index = t * n_keywords + k;
        d3.select("#c" + index.toString()).style("fill", "none");
      }
    }
  }
});
// deleting text on mouse out
svgContainer.on("mouseout", function() {
  if (k0 != -1 && t0 != -1) {
    for (var i = 0; i < n_title; i++) {
      k = data_json["keywords"][data_json["title"][i]["keyword"]];
      if (k === k0) {
        t = data_json["title"][i]["time"] - min_time;
        index = t * n_keywords + k;
        d3.select("#t" + t + "k" + k).remove();
        d3.select("#sc" + index.toString()).remove();
        // d3.select("#circle"+(index.toString())).style("fill","none");
        // d3.select("#circle"+(t*n_keywords+k).toString()).style("stroke","black");
        // if(t==0) console.log(d3.select("#circle"+(t*n_keywords+k).toString()));
      } else {
        t = data_json["title"][i]["time"] - min_time;
        index = t * n_keywords + k;
        d3.select("#c" + index.toString()).style(
          "fill",
          colors[(index % n_keywords) % n_colors]
        );
      }
    }
  }
});

// year+1
document.getElementById("yearp1").addEventListener(
  "click",
  function() {
    time += 1;
    if (time > 2018) time = 2000;
    document.getElementById("year").innerHTML = time.toString();
    document.getElementById(
      "tanom_land"
    ).innerHTML = "temperature anomaly land : ".concat(
      temp_anom_land["data"][time.toString()]
    );
    document.getElementById(
      "tanom_ocean"
    ).innerHTML = "temperature anomaly ocean : ".concat(
      temp_anom_ocean["data"][time.toString()]
    );
    document.getElementById(
      "forest_coverage"
    ).innerHTML = "forest coverage : ".concat(
      forest_coverage[time - min_time].toPrecision(3).toString()
    );
    for (var i = 0; i < global_surface_ice.length; i++) {
      if (global_surface_ice[i]["time"] == time)
        document.getElementById(
          "ice surface (million of km2)"
        ).innerHTML = "ice surface : ".concat(
          global_surface_ice[i]["surface"].toPrecision(3).toString(),
          " million of km2"
        );
    }
  },
  false
);
// year-1
document.getElementById("yearm1").addEventListener(
  "click",
  function() {
    time -= 1;
    if (time < 2000) time = 2018;
    document.getElementById("year").innerHTML = time.toString();
    document.getElementById(
      "tanom_land"
    ).innerHTML = "temperature anomaly land : ".concat(
      temp_anom_land["data"][time.toString()]
    );
    document.getElementById(
      "tanom_ocean"
    ).innerHTML = "temperature anomaly ocean : ".concat(
      temp_anom_ocean["data"][time.toString()]
    );
    document.getElementById(
      "forest_coverage"
    ).innerHTML = "forest coverage : ".concat(
      forest_coverage[time - min_time].toPrecision(3).toString()
    );
    for (var i = 0; i < global_surface_ice.length; i++) {
      if (global_surface_ice[i]["time"] == time)
        document.getElementById(
          "ice surface (million of km2)"
        ).innerHTML = "ice surface : ".concat(
          global_surface_ice[i]["surface"].toPrecision(3).toString(),
          " million of km2"
        );
    }
  },
  false
);

requestJSON(readJSON);
