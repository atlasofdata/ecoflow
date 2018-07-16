console.log([window.innerWidth,window.innerHeight]);

var resX=window.innerWidth,resY=window.innerHeight,dX=parseInt(resX/8.0),dY=parseInt(resY*dX/resX),xmin=0.000001,xmax=0.007,ymin=-0.0008,ymax=-ymin;
var resx=parseInt(resX/4),resy=parseInt(resx*resY/resX);
var n_abstract,n_title,n_keywords,data_json,data_json_i;
var n_year,min_year=1990,max_year=2018,year=min_year,min_radius=10000.0,max_radius=0.0,x0,y0;
var p=[],v=[],radius=[],sort_radius=[],fRadius=160.0,indexes=[],index,p_mean=0.0,p_var=0.0,v_mean=0.0,v_var=0.0,v_min=10000.0,v_max=-v_min,p_min=10000.0,p_max=-p_min;
var t,k,t0,k0,i0,min_distance,distance,p1;
var n_forests,forest_coverage=[],n_forest_coverage=[],global_ice,publications=[],n_publications,words=[];
var word='',old_word='',old_i_word=-1;
var stroke_width=2.5;
var myButton,myButtonFontSize=[];
var transition=[],pi=[],vi=[],wi=[],Rg2,angle,inc;
var x_scale_min,x_scale_max,y_scale_min,y_scale_max;
var p_scale_min,p_scale_max,v_scale_min,v_scale_max;
var url_database=['./data/title_abstract_pubmed.json','./data/title_abstract_scopus.json'];
var database=['pubmed','scopus'];

// var colors=["#f2d9d9","#d6e0f5","#ffcce0","#ffeecc","#ccffcc","#ffffcc","#ffe6cc","#ccccff","#e6ccff","#d6f5d6","#ffebcc","#ccddff","#ffccff","#cce6ff"];
var colors=["#6666ff","#d98c8c","#66ff66","#ff66a3","#66ccff","#ffc266","#996600","#ffb366","#8585e0","#ff66ff","#a3a3c2","#ff8c66","#b366ff","#006699","#cc99ff","#669900","#ccccff","#ff5050","#9933ff","#33cc33","#0099cc"];
var n_colors=colors.length;

// https://www.ncdc.noaa.gov/cag/global/time-series/globe/land/ytd/12/1990-2018.json
var temp_anom_land={"description":{"title":"Global Land Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"1990":"0.58","1991":"0.52","1992":"0.25","1993":"0.33","1994":"0.44","1995":"0.75","1996":"0.34","1997":"0.67","1998":"0.94","1999":"0.78","2000":"0.62","2001":"0.81","2002":"0.92","2003":"0.88","2004":"0.79","2005":"1.03","2006":"0.90","2007":"1.08","2008":"0.85","2009":"0.87","2010":"1.07","2011":"0.89","2012":"0.90","2013":"0.98","2014":"1.00","2015":"1.34","2016":"1.44","2017":"1.31"}};

// https://www.ncdc.noaa.gov/cag/global/time-series/globe/ocean/ytd/12/1990-2018.json
var temp_anom_ocean={"description":{"title":"Global Ocean Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"1990":"0.37","1991":"0.35","1992":"0.25","1993":"0.26","1994":"0.30","1995":"0.34","1996":"0.31","1997":"0.45","1998":"0.51","1999":"0.31","2000":"0.35","2001":"0.44","2002":"0.48","2003":"0.51","2004":"0.49","2005":"0.51","2006":"0.50","2007":"0.43","2008":"0.42","2009":"0.55","2010":"0.56","2011":"0.46","2012":"0.51","2013":"0.55","2014":"0.64","2015":"0.74","2016":"0.76","2017":"0.67"}};

var svgContainer=d3.select("body")
	.append("svg")
	.attr("width",resX)
	.attr("height",resY);

// x-axis
var xScale=d3.scale.linear().domain([xmin,xmax]).range([dX,resX-dX]);
// var xScale=d3.scale.log().base(10).domain([xmin,xmax]).range([dX,resX-dX]);
var xAxis=d3.svg.axis().scale(xScale).orient("bottom").ticks(12,d3.format(",d"));
svgContainer.append("g")
    .attr("class","x axis")
    .attr("transform","translate("+[0,0.5*resY]+")")
    .call(xAxis);
// x-axis label
svgContainer.append("text")
    .attr("class","x label")
    .attr("text-anchor","end")
    .attr("x",resX-dX)
    .attr("y",0.5*resY-0.1*dY)
    .text("# of publications normalized by the total");
// y-axis
var yScale=d3.scale.linear().domain([ymin,ymax]).range([resY-dY,dY]);
var yAxis=d3.svg.axis().scale(yScale).orient("left");
svgContainer.append("g")
    .attr("class","y axis")
    .attr("transform","translate("+[dX,0]+")")
    .call(yAxis);
// y-axis label
svgContainer.append("text")
    .attr("class","y label")
    .attr("text-anchor","end")
    .attr("x",dX)
    .attr("y",resY-0.8*dY)
    .text("publications velocity");

// creating sub-graph
// sub-graph x and y axis
var x_shift=resX-dX-resx;
var y_shift=resY-dY-resy;
var xscale=d3.scale.linear().domain([min_year,max_year]).range([0,resx]);
var yscale=d3.scale.linear().domain([0,xmax]).range([0,resy]);
var xaxis=d3.svg.axis().scale(xscale).orient("top").ticks(6,d3.format(",d"));
var yaxis=d3.svg.axis().scale(yscale).orient("left");

// creating a second sub-graph
// second sub-graph x and y axis
var p_shift=1.5*dX;
var v_shift=resY-dY-resy;
var pscale=d3.scale.linear().domain([xmin,xmax]).range([0,resx]);
var vscale=d3.scale.linear().domain([ymin,ymax]).range([resy,0]);
var paxis=d3.svg.axis().scale(pscale).orient("top").ticks(4,d3.format(",d"));
var vaxis=d3.svg.axis().scale(vscale).orient("left").ticks(4,d3.format(",d"));

// creating link to the database
for(var d=0;d<2;d++){
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='black';
    myButton.style.cursor='pointer';
    // myButton.id=database[d];
    // myButton.innerHTML=url_database[d];
    myButton.id=url_database[d];
    myButton.innerHTML=database[d];
    if(d===0){
	myButton.style.fontSize='30px';
	myButton.style.textDecoration='underline';
    }else myButton.style.fontSize='10px';
    document.getElementById('rightColbis').appendChild(myButton);
    document.getElementById('rightColbis').appendChild(document.createElement('br'));
    // document.getElementById(database[d]).addEventListener('click',function(){change_database(event.target.innerHTML);},false);
    document.getElementById(url_database[d]).addEventListener('click',function(){change_database(event.target.id);},false);
}

// passing url to xml http request
function change_database(url){
    d3.selectAll('line').remove();
    d3.selectAll('circle').remove();
    for(var i=0;i<n_keywords;i++){
	word=words[i];
	document.getElementById(word).remove();
    }
    for(var y=min_year;y<=max_year;y++) document.getElementById(y.toString()).remove();
    old_i_word=-1;
    old_word='';
    word='';
    year=1990;
    p=[];
    v=[];
    radius=[];
    indexes=[];
    pi=[];
    vi=[];
    wi=[];
    publications=[];
    transition=[];
    p_mean=0.0;
    p_var=0.0;
    v_mean=0.0;
    v_var=0.0;
    v_min=10000.0;
    v_max=-v_min;
    p_min=10000.0;
    p_max=-p_min;
    d3.select('#graph_x_pt').remove();
    d3.select('#graph_y_pt').remove();
    d3.select('#graph_x_vp').remove();
    d3.select('#graph_y_vp').remove();
    document.getElementById('keyword').innerHTML='';
    while(document.getElementById('rightCol').hasChildNodes()) document.getElementById('rightCol').removeChild(document.getElementById('rightCol').lastChild);
    while(document.getElementById('leftCol').hasChildNodes()) document.getElementById('leftCol').removeChild(document.getElementById('leftCol').lastChild);
    for(var d=0;d<2;d++){
	console.log(url,url_database[d]);
	console.log(document.getElementById(url_database[d]));
	if(url===url_database[d]){
	    document.getElementById(url_database[d]).style.fontSize='30px';
	    document.getElementById(url_database[d]).style.textDecoration='underline';
	}else{
	    document.getElementById(url_database[d]).style.fontSize='10px';
	    document.getElementById(url_database[d]).style.textDecoration='none';
	}
    }
    requestJSON(readJSON,url);
};

// graph of the pudmed
function requestJSON(callback,url){
    var xhr=new XMLHttpRequest();
    xhr.responseType='json';
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4 && (xhr.status===200 || xhr.status===0)) callback(xhr.response);
    };
    xhr.open('GET',url,true);
    // xhr.setRequestHeader('Access-Control-Allow-Methods','GET');
    // xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(null);
};

// reading json file
function readJSON(data){

    data_json=data;

    // reading the # of publications per year
    n_publications=data_json['publications'].length;
    for(var i=0;i<n_publications;i++) publications.push(0);
    for(var i=0;i<n_publications;i++) if(data_json['publications'][i]['year']>=min_year) publications[data_json['publications'][i]['year']-min_year]=data_json['publications'][i]['value'];
    document.getElementById('publications').innerHTML='# of publications : '.concat(publications[year-min_year].toString());

    n_keywords=Object.keys(data_json['keywords']).length;
    console.log(data_json['keywords']);

    // list of keywords
    myButtonFontSize=[];
    words=Object.keys(data_json['keywords']);
    words.sort();
    for(var i=0;i<n_keywords;i++){
	word=words[i];
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[data_json['keywords'][word]%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=word;
	myButton.innerHTML=word;
	if(word==='biodiversity' || word==='carbon_dioxide' || word==='carbon_permafrost' || word==='climate_change' || word==='coral' || word==='drought' || word==='greenhouse_effect' || word==='greenhouse_gas' || word==='malaria' || word==='methane' || word==='methane_permafrost' || word==='mortality' || word==='morbidity' || word==='permafrost' || word==='pollution'){
	    // myButtonFontSize[word]='20px';
	    // myButton.style.fontSize='20px';
	    myButtonFontSize[word]='12px';
	    myButton.style.fontSize='12px';
	}else{
	    myButtonFontSize[word]='12px';
	    myButton.style.fontSize='12px';
	}
	document.getElementById('leftCol').appendChild(myButton);
	document.getElementById('leftCol').appendChild(document.createElement('br'));
	document.getElementById(word).addEventListener('click',highlight,false);
    }
    // list of years
    for(var y=min_year;y<=max_year;y++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[(y-min_year)%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=y.toString();
	myButton.innerHTML=y.toString();
	myButton.style.fontSize='12px';
	document.getElementById('rightCol').appendChild(myButton);
	document.getElementById('rightCol').appendChild(document.createElement('br'));
	document.getElementById(y.toString()).addEventListener('click',change_year,false);
    }

    // temperatures anomalies
    document.getElementById('year').innerHTML=year.toString();
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    // calculing the forest coverage
    forest_coverage=[];
    n_forest_coverage=[];
    for(var i=0;i<(2019-min_year);i++){
	forest_coverage.push(0.0);
	n_forest_coverage.push(0);
    }
    n_forests=data_json['forest'].length;
    for(var i=0;i<n_forests;i++){
	forest_coverage[data_json['forest'][i]['year']-min_year]+=data_json['forest'][i]['coverage'];
	n_forest_coverage[data_json['forest'][i]['year']-min_year]+=1;
    }
    for(var i=0;i<n_forests;i++) forest_coverage[i]/=n_forest_coverage[i];
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json
    global_surface_ice=data_json['ice'];
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }

    n_title=data_json['title'].length;
    n_abstract=data_json['abstract'].length;
    // for(var i=0;i<n_title;i++) min_year=Math.min(min_year,data_json['title'][i]['year']);
    // for(var i=0;i<n_title;i++) max_year=Math.max(max_year,data_json['title'][i]['year']);
    n_year=max_year-min_year+1;
    p=[];
    v=[];
    radius=[];
    for(var i=0;i<n_title;i++){
	p.push(0.0);
	v.push(0.0);
	radius.push(0.0);
    }
    transition=[];
    pi=[];
    vi=[];
    wi=[];
    for(var i=0;i<n_year;i++){
	transition.push(0);
	pi.push(0.0);
	vi.push(0.0);
	wi.push(0.0);
    }
    console.log(n_title);
    console.log(min_year);
    console.log(max_year);
    // radius
    sort_radius=[];
    for(var i=0;i<n_abstract;i++){
	t=data_json['abstract'][i]['year']-min_year;
	k=data_json['keywords'][data_json['abstract'][i]['keyword']];
	// radius[t*n_keywords+k]=Math.sqrt((data_json['abstract'][i]['value']/publications[t])/Math.PI);
	radius[t*n_keywords+k]=data_json['abstract'][i]['value']/publications[t];
	sort_radius.push([radius[t*n_keywords+k],t*n_keywords+k]);
	if(radius[t*n_keywords+k]>0.0) min_radius=Math.min(min_radius,radius[t*n_keywords+k]);
	if(radius[t*n_keywords+k]>0.0) max_radius=Math.max(max_radius,radius[t*n_keywords+k]);
    }
    // sorting radius
    indexes=[];
    sort_radius.sort(function(a,b){return b[0]<a[0]?-1:1;});
    for(var i=0;i<n_abstract;i++){
	t=data_json['abstract'][i]['year']-min_year;
	k=data_json['keywords'][data_json['abstract'][i]['keyword']];
	indexes.push(sort_radius[i][1]);
    }
    // positions
    for(var i=0;i<n_title;i++){
	t=data_json['title'][i]['year']-min_year;
	k=data_json['keywords'][data_json['title'][i]['keyword']];
	p[t*n_keywords+k]=data_json['title'][i]['value']/publications[t];
    }
    // velocities
    for(var i=0;i<n_title;i++){
	t=data_json['title'][i]['year']-min_year;
	k=data_json['keywords'][data_json['title'][i]['keyword']];
	if(t>0) v[t*n_keywords+k]=p[t*n_keywords+k]-p[(t-1)*n_keywords+k];
    }
    for(var i=0;i<n_title;i++) v_mean+=Math.abs(v[i])/n_title;
    for(var i=0;i<n_title;i++) v_var+=(v[i]-v_mean)*(v[i]-v_mean)/n_title;
    for(var i=0;i<n_title;i++) v_min=Math.min(v_min,v[i]-radius[i]);
    for(var i=0;i<n_title;i++) v_max=Math.max(v_max,v[i]+radius[i]);
    for(var i=0;i<n_title;i++) p_mean+=p[i]/n_title;
    for(var i=0;i<n_title;i++) p_var+=(p[i]-p_mean)*(p[i]-p_mean)/n_title;
    for(var i=0;i<n_title;i++) p_min=Math.min(p_min,p[i]-radius[i]);
    for(var i=0;i<n_title;i++) p_max=Math.max(p_max,p[i]+radius[i]);
    // making the new axis
    xScale.domain([0,p_mean+3.0*Math.sqrt(p_var)]);
    yScale.domain([v_mean-3.0*Math.sqrt(v_var),v_mean+3.0*Math.sqrt(v_var)]);
    xAxis.scale(xScale).orient("bottom").ticks(12,d3.format(",d"));
    yAxis.scale(yScale).orient("left");
    svgContainer.select("g.x.axis").call(xAxis);
    svgContainer.select("g.y.axis").call(yAxis);
    console.log('p(min):'.concat(p_min.toString()));
    console.log('p(mean):'.concat(p_mean.toString()));
    console.log('p(sd):'.concat((Math.sqrt(p_var)).toString()));
    console.log('p(max):'.concat(p_max.toString()));
    console.log('v(min):'.concat(v_min.toString()));
    console.log('v(mean):'.concat(v_mean.toString()));
    console.log('v(sd):'.concat((Math.sqrt(v_var)).toString()));
    console.log('v(max):'.concat(v_max.toString()));
    console.log([n_abstract,n_title,n_keywords*n_year]);
    // drawing the circles
    for(var i=0;i<n_abstract;i++){
	index=indexes[i];
	// console.log(p[index],v[index]);
	svgContainer.append("circle")
	    .attr("cx",xScale(p[index]))
	    .attr("cy",yScale(v[index]))
	    .attr("r",xScale(radius[index])/fRadius)
	    .style("fill",colors[(index%n_keywords)%n_colors])
	    .style("opacity",0.5)
	    .attr("id","c"+index.toString());
    }
};// reading the json file

// // year+1
// document.getElementById('yearp1').addEventListener('click',function(){
//     year+=1;
//     if(year>2018) year=min_year;
//     document.getElementById('year').innerHTML=year.toString();
//     document.getElementById('publications').innerHTML='# of publications : '.concat(publications[year-min_year].toString());
//     document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
//     document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
//     document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
//     for(var i=0;i<global_surface_ice.length;i++){
// 	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
//     }
// },false);
// // year-1
// document.getElementById('yearm1').addEventListener('click',function(){
//     year-=1;
//     if(year<1990) year=2018;
//     document.getElementById('year').innerHTML=year.toString();
//     document.getElementById('publications').innerHTML='# of publications : '.concat(publications[year-min_year].toString());
//     document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
//     document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
//     document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
//     for(var i=0;i<global_surface_ice.length;i++){
// 	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
//     }
// },false);
// // all keywords
// document.getElementById('clear_keywords').addEventListener('click',function(){
//     cleaning(old_word);
// },false);

// writing text on mouse over
// svgContainer.on("mouseover",function(){
// writing text on mouse click
svgContainer.on("click",function(){
    cleaning(old_word);
    p1=d3.mouse(this);
    min_distance=10000000.0;
    k0=-1;
    t0=-1;
    i0=-1;
    for(var i=0;i<n_title;i++){
	t=data_json['title'][i]['year']-min_year;
	k=data_json['keywords'][data_json['title'][i]['keyword']];
	index=t*n_keywords+k;
	x0=xScale(p[index]);
	y0=yScale(v[index]);
	distance=Math.sqrt((p1[0]-x0)*(p1[0]-x0)+(p1[1]-y0)*(p1[1]-y0));
	if(distance<min_distance){
	    t0=t;
	    k0=k;
	    i0=i;
	    min_distance=distance;
	}// Fi distance
    }// Rof i
    if(k0!=-1 && t0!=-1){
	index=t0*n_keywords+k0;
	if(min_distance<=(xScale(radius[index])/fRadius)){
	    event.target.id=data_json['title'][i0]['keyword'];
	    highlight(event);
	}
    }// Fi k0 t0 min_distance
});

// // deleting text on mouse out	      
// svgContainer.on("mouseout",function(){
//     if(k0!=-1 && t0!=-1){
// 	cleaning(old_word);
// 	for(var i=0;i<n_title;i++){
// 	    k=data_json['keywords'][data_json['title'][i]['keyword']];
// 	    if(k===k0){
// 		t=data_json['title'][i]['year']-min_year;
// 		index=t*n_keywords+k;
// 		d3.select("#t"+t+"k"+k).remove();
// 		d3.select('#sc'+(index.toString())).remove();
// 		d3.select('#sct'+(index.toString())).remove();
// 	    }else{
// 		t=data_json['title'][i]['year']-min_year;
// 		index=t*n_keywords+k;
// 		d3.select('#c'+(index.toString())).style("fill",colors[(index%n_keywords)%n_colors]);
// 	    }
// 	}
//     }
// });

// change year on mouse click
function change_year(e){
    document.getElementById('year').innerHTML=e.target.id;
    year=parseInt(e.target.id);
    document.getElementById('publications').innerHTML='# of publications : '.concat(publications[year-min_year].toString());
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
}

// calculating the gyration tensor in (v,p) space
function Rg2_vp(p,v,w,W){
    var vmoy=0.0;
    var pmoy=0.0;
    var v_length=v.length;
    var norm=0.0;
    for(var i=0;i<v_length;i++){
	vmoy+=v[i]*(1.0*(1-W)+w[i]*W);
	pmoy+=p[i]*(1.0*(1-W)+w[i]*W);
	norm+=1.0*(1-W)+w[i]*W;
    }
    vmoy/=norm;
    pmoy/=norm;
    var Rg2=[];
    Rg2.push(0.0);
    for(var i=0;i<v_length;i++) Rg2[0]+=(p[i]-pmoy)*(p[i]-pmoy)*(1.0*(1-W)+w[i]*W);
    Rg2.push(0.0);
    for(var i=0;i<v_length;i++) Rg2[1]+=(p[i]-pmoy)*(v[i]-vmoy)*(1.0*(1-W)+w[i]*W);
    Rg2.push(0.0);
    for(var i=0;i<v_length;i++) Rg2[2]+=(v[i]-vmoy)*(v[i]-vmoy)*(1.0*(1-W)+w[i]*W);
    for(var i=0;i<3;i++) Rg2[i]/=norm;
    var a=Rg2[0];
    var b=Rg2[1];
    var c=Rg2[2];
    var D=a*a-2.0*a*c+c*c+4.0*b*b;
    var l1=(a+c-Math.sqrt(D))/2.0;
    var l2=(a+c+Math.sqrt(D))/2.0;
    var c1x=-(-a+c+Math.sqrt(D))/(2.0*b);
    var c1y=1.0;
    var c2x=-(-a+c-Math.sqrt(D))/(2.0*b);
    var c2y=1.0;
    var n1=Math.sqrt(c1x*c1x+c1y*c1y);
    var n2=Math.sqrt(c2x*c2x+c2y*c2y);
    return [pmoy,vmoy,l1,c1x/n1,c1y/n1,l2,c2x/n2,c2y/n2];
};

// highlighting a keyword on mouse click
function highlight(e){
    console.log(e.target.id);
    cleaning(old_word);
    document.getElementById(e.target.id).style.fontSize='30px';
    document.getElementById(e.target.id).style.textDecoration='underline';
    document.getElementById('keyword').innerHTML=e.target.id;
    document.getElementById('keyword').style.color=colors[data_json['keywords'][e.target.id]%n_colors];
    for(var i=0;i<n_title;i++){
	if(data_json['title'][i]['keyword']===e.target.id){
	    k=data_json['keywords'][e.target.id];
	    t=data_json['title'][i]['year']-min_year;
	    index=t*n_keywords+k;
	    transition[t]=index;
	    pi[t]=p[index];
	    vi[t]=v[index];
	    wi[t]=radius[index];
	    // stroking the selection
	    svgContainer.append("circle")
		.attr("cx",xScale(p[index]))
		.attr("cy",yScale(v[index]))
		.attr("r",xScale(radius[index])/fRadius)
		.style("fill",colors[k%n_colors])
		.style("opacity",0.5)
		.style("stroke","black")
		.style("stroke-width",stroke_width)
		.attr("id",'sc'+(index.toString()));
	    // drawing the # of publications
	    svgContainer.append("text")
		.attr({
		    id:'t'+(index.toString()),
		    x:xScale(p[index]),
		    y:yScale(v[index])
		});
		// .text((data_json['title'][i]['value'].toString()).concat(' in ',data_json['title'][i]['year'].toString()));
	}// Fi target
    }// Rof i
    // creating the v(p) and the p(t) graphs
    year_publications(transition,n_year);
    publications_velocities(transition,n_year);
    // drawing the gyration tensor in the (p,v) space
    Rg2=Rg2_vp(pi,vi,wi,0);
    angle=Math.acos(Rg2[3]/Math.sqrt(Rg2[3]*Rg2[3]+Rg2[4]*Rg2[4]));
    var n1=-Math.sqrt(Rg2[2])*resx/(p_scale_max-p_scale_min);
    var x1=n1*Math.cos(angle);
    var y1=n1*Math.sin(angle);
    var x2=-n1*Math.cos(angle);
    var y2=-n1*Math.sin(angle);
    svgContainer.append('line')
	.attr('x1',p_shift+pscale(Rg2[0])+x1)
        .attr('y1',v_shift+vscale(Rg2[1])+y1)
    	.attr('x2',p_shift+pscale(Rg2[0])+x2)
        .attr('y2',v_shift+vscale(Rg2[1])+y2)
	.style('stroke',colors[k%n_colors])
	.style('stroke-width',3)
	.attr('id','sl1');
    n1=Math.sqrt(Rg2[5])*resy/(v_scale_max-v_scale_min);
    x1=-n1*Math.sin(angle);
    y1=n1*Math.cos(angle);
    x2=n1*Math.sin(angle);
    y2=-n1*Math.cos(angle);
    svgContainer.append('line')
	.attr('x1',p_shift+pscale(Rg2[0])+x1)
        .attr('y1',v_shift+vscale(Rg2[1])+y1)
    	.attr('x2',p_shift+pscale(Rg2[0])+x2)
        .attr('y2',v_shift+vscale(Rg2[1])+y2)
	.style('stroke',colors[k%n_colors])
	.style('stroke-width',3)
	.attr('id','sl2');
    Rg2=Rg2_vp(pi,vi,wi,1);
    angle=Math.acos(Rg2[3]/Math.sqrt(Rg2[3]*Rg2[3]+Rg2[4]*Rg2[4]));
    var n1=-Math.sqrt(Rg2[2])*resx/(p_scale_max-p_scale_min);
    var x1=n1*Math.cos(angle);
    var y1=n1*Math.sin(angle);
    var x2=-n1*Math.cos(angle);
    var y2=-n1*Math.sin(angle);
    svgContainer.append('line')
	.attr('x1',p_shift+pscale(Rg2[0])+x1)
        .attr('y1',v_shift+vscale(Rg2[1])+y1)
    	.attr('x2',p_shift+pscale(Rg2[0])+x2)
        .attr('y2',v_shift+vscale(Rg2[1])+y2)
	.style('stroke','black')
	.style('stroke-width',3)
	.attr('id','sl3');
    n1=Math.sqrt(Rg2[5])*resy/(v_scale_max-v_scale_min);
    x1=-n1*Math.sin(angle);
    y1=n1*Math.cos(angle);
    x2=n1*Math.sin(angle);
    y2=-n1*Math.cos(angle);
    svgContainer.append('line')
	.attr('x1',p_shift+pscale(Rg2[0])+x1)
        .attr('y1',v_shift+vscale(Rg2[1])+y1)
    	.attr('x2',p_shift+pscale(Rg2[0])+x2)
        .attr('y2',v_shift+vscale(Rg2[1])+y2)
	.style('stroke','black')
	.style('stroke-width',3)
	.attr('id','sl4');
    old_word=e.target.id;
    for(var i=0;i<n_keywords;i++) if(Object.keys(data_json['keywords'])[i]===old_word) old_word_i=i;
};

// # of publications as a function of year
function year_publications(list,n_list){
    y_scale_min=1e10;
    y_scale_max=-y_scale_min;
    for(var i=0;i<n_list;i++){
	index=list[i];
	t=(index-index%n_keywords)/n_keywords;
	k=index%n_keywords;
	y_scale_min=Math.min(y_scale_min,p[index]);
	y_scale_max=Math.max(y_scale_max,p[index]);
    }
    yscale.domain([y_scale_min,y_scale_max]);
    graph_pt();
    for(var i=0;i<n_list;i++){
	index=list[i];
	t=(index-index%n_keywords)/n_keywords;
	k=index%n_keywords;
	svgContainer.append("circle")
	    .attr("cx",x_shift+xscale(t+min_year))
	    .attr("cy",y_shift+yscale(p[index]))
	    .attr("r",xScale(radius[index])/fRadius)
	    .style("fill",colors[k%n_colors])
	    .style("stroke","black")
	    .style("stroke-width",stroke_width)
	    .attr("id",'sct'+(index.toString()));
    }
}

// publication velocities as a function of the # of publications (phase portrait)
function publications_velocities(list,n_list){
    p_scale_min=1e10;
    p_scale_max=-p_scale_min;
    v_scale_min=1e10;
    v_scale_max=-v_scale_min;
    for(var i=0;i<n_list;i++){
	index=list[i];
	t=(index-index%n_keywords)/n_keywords;
	k=index%n_keywords;
	p_scale_min=Math.min(p_scale_min,p[index]);
	p_scale_max=Math.max(p_scale_max,p[index]);
	v_scale_min=Math.min(v_scale_min,v[index]);
	v_scale_max=Math.max(v_scale_max,v[index]);
    }
    pscale.domain([p_scale_min,p_scale_max]);
    vscale.domain([v_scale_min,v_scale_max]);
    graph_vp();
    for(var i=0;i<n_list;i++){
	index=list[i];
	t=(index-index%n_keywords)/n_keywords;
	k=index%n_keywords;
	svgContainer.append("circle")
	    .attr("cx",p_shift+pscale(p[index]))
	    .attr("cy",v_shift+vscale(v[index]))
	    .attr("r",xScale(radius[index])/fRadius)
	    .style("fill",colors[k%n_colors])
	    .style("stroke","black")
	    .style("stroke-width",stroke_width)
	    .attr("id",'scvp'+(index.toString()));
    }
}

// making the graph of the # of publications temporal evolution
function graph_pt(){
    // xaxis.scale(xscale).orient("top").ticks(6,d3.format(",d"));
    yaxis.scale(yscale).orient("left").ticks(4,d3.format(",d"));
    svgContainer.append("g")
	.attr("class","x axis")
	.attr("transform","translate("+[x_shift,y_shift]+")")
	.attr("id","graph_x_pt")
	.call(xaxis);
    svgContainer.append("g")
	.attr("class","y axis")
	.attr("transform","translate("+[x_shift,y_shift]+")")
	.attr("id","graph_y_pt")
	.call(yaxis);
    svgContainer.append('text')
	.attr('x',x_shift)
	.attr('y',resY-0.75*dY)
	.style('font-size','20px')
    	.style('font-weight','bold')
	.attr('id','text_pt')
	.text('timeline evolution of the # of publications');
};
// making the phase portrait of the # of publications and its velocities
function graph_vp(){
    paxis.scale(pscale).orient("top").ticks(6,d3.format(",d"));
    vaxis.scale(vscale).orient("left").ticks(4,d3.format(",d"));
    svgContainer.append("g")
	.attr("class","x axis")
	.attr("transform","translate("+[p_shift,v_shift]+")")
	.attr("id","graph_x_vp")
	.call(paxis);
    svgContainer.append("g")
	.attr("class","y axis")
	.attr("transform","translate("+[p_shift,v_shift]+")")
	.attr("id","graph_y_vp")
	.call(vaxis);
    svgContainer.append('text')
	.attr('x',p_shift)
	.attr('y',resY-0.75*dY)
	.style('font-size','20px')
	.style('font-weight','bold')
	.attr('id','text_vp')
	.text('phase portrait (# of publications,velocity)');
};

function cleaning(w){
    if(w!=''){
	k=data_json['keywords'][w];
	document.getElementById(w).style.fontSize=myButtonFontSize[w];
	document.getElementById(w).style.textDecoration='none';
	for(var i=min_year;i<=max_year;i++){
	    t=i-min_year;
	    index=t*n_keywords+k;
	    document.getElementById(old_word).style.fontSize=myButtonFontSize[old_word];
	    d3.select('#t'+(index.toString())).remove();
	    d3.select('#sc'+(index.toString())).remove();
	    d3.select('#sct'+(index.toString())).remove();
	    d3.select('#scvp'+(index.toString())).remove();
	}
	d3.select('#graph_x_pt').remove();
	d3.select('#graph_y_pt').remove();
	d3.select('#graph_x_vp').remove();
	d3.select('#graph_y_vp').remove();
	d3.select('#se1').remove();
	d3.select('#se2').remove();
	d3.select('#se3').remove();
	d3.selectAll('line').remove();
	// d3.select('#sl1').remove();
	// d3.select('#sl2').remove();
	// d3.select('#sl3').remove();
	// d3.select('#sl4').remove();
	d3.select('#text_pt').remove();
	d3.select('#text_vp').remove();
    }
};

requestJSON(readJSON,url_database[0]);
