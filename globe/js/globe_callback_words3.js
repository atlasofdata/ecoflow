console.clear();
  
var count=[],delta_count=[],pt=new THREE.Vector3(),group_length,n_points=100,f_points=10,pairwize=[],pileups=[],group_mesh=new THREE.Group(),group_links=new THREE.Group(),group_pileups=new THREE.Group();
var PreviousMouseX=0.0,PreviousMouseY=0.0,DraggingMouse=false;
const ZoomSensitivity=0.0001;
var vS=[],vT=[],vS_length,mST=[],mST_length,cvS_length,cvT_length,cvS=[],cvT=[],geometry,lines=[],n_lines,material,weight0=20.0,source=0,target=0;
var paths=new THREE.CurvePath();
const radius0=2.5,segments0=32,rings0=32;
var min_year=2010,max_year=2018,n_year=max_year-min_year+1,year=min_year,n_countries=0,theta,bn=new THREE.Vector3();
var group_text=new THREE.Group();
var loader_font=new THREE.FontLoader();
var mesh_country,country,material_country,publications=[],n_publications,mean_publications=0;
var rC=new THREE.Vector3(),LATi=0.0,LONi=0.0,index;
var mesh_text;
var i_word=0,word='',n_words,words=[];
var text='',text_buffer='',list_keywords='',intersects;
var n_forests,forest_coverage=[],n_forest_coverage=[],global_ice,volume=[],n_volume;
var myButton,myButtonFontSize='10px';
var data_json,data_json_w,pairwize_year=[],n_pairwize_year=0,pileups_year=[],n_pileups_year=0,ii,n_curves,n_count;

initializing_description();

var colors=["#6666ff","#d98c8c","#66ff66","#ff66a3","#66ccff","#ffc266","#996600","#ffb366","#8585e0","#ff66ff","#a3a3c2","#ff8c66","#b366ff","#006699","#cc99ff","#669900","#ccccff","#ff5050","#9933ff","#33cc33","#0099cc"];
var n_colors=colors.length;

// make scene
var scene=new THREE.Scene();
scene.background=new THREE.Color(0x000000);
// make camera
var Xcamera=0.0;
var Ycamera=0.0;
var Zcamera=1000.0;
var Rcamera=Math.sqrt(Xcamera*Xcamera+Ycamera*Ycamera+Zcamera*Zcamera);
var camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
camera.position.set(Xcamera,Ycamera,Zcamera);
camera.lookAt(new THREE.Vector3(0,0,0));
scene.add(camera);
// make light -->
var DirectionalLight=new THREE.DirectionalLight(0xffffff,1);
DirectionalLight.position.set(camera.position);
DirectionalLight.lookAt(new THREE.Vector3(0,0,0));
scene.add(DirectionalLight);
// make render -->
var renderer=new THREE.WebGLRenderer({antialias:true});
var container=document.getElementById('container');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);
// make globe -->
const radius=200,segments=128,rings=128;
var globe=new THREE.Group();
// Loading the world map texture -->
var loader=new THREE.TextureLoader();
loader.crossOrigin="";
// loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_world_map.svg/2000px-Simple_world_map.svg.png',
loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg',function(texture){
    var sphere=new THREE.SphereGeometry(radius,segments,rings);
    // var material=new THREE.MeshBasicMaterial({map:texture,overdraw:0.5});
    var material=new THREE.MeshBasicMaterial({map:texture,wireframe:false});
    var mesh=new THREE.Mesh(sphere,material);
    globe.add(mesh);
},function(error){console.log(error)});
globe.position.set(0,0,0);

// https://www.ncdc.noaa.gov/cag/global/time-series/globe/land/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017
var temp_anom_land={"description":{"title":"Global Land Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.62","2001":"0.81","2002":"0.92","2003":"0.88","2004":"0.79","2005":"1.03","2006":"0.90","2007":"1.08","2008":"0.85","2009":"0.87","2010":"1.07","2011":"0.89","2012":"0.90","2013":"0.98","2014":"1.00","2015":"1.34","2016":"1.44","2017":"1.31"}};
// https://www.ncdc.noaa.gov/cag/global/time-series/globe/ocean/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017 -->
var temp_anom_ocean={"description":{"title":"Global Ocean Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.35","2001":"0.44","2002":"0.48","2003":"0.51","2004":"0.49","2005":"0.51","2006":"0.50","2007":"0.43","2008":"0.42","2009":"0.55","2010":"0.56","2011":"0.46","2012":"0.51","2013":"0.55","2014":"0.64","2015":"0.74","2016":"0.76","2017":"0.67"}};

// graph of the pudmed -->
function requestJSON(callback){
    var xhr=new XMLHttpRequest();
    xhr.responseType='json';
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4 && (xhr.status===200 || xhr.status===0)){
	    callback(xhr.response);
	}
    };
    xhr.open('GET','./data/all.json',true);
    // xhr.setRequestHeader('Access-Control-Allow-Methods','GET'); -->
    // xhr.setRequestHeader('Content-Type','application/json'); -->
    xhr.send(null);
};

function readJSON(data){
    
    data_json=data;
    
    // reading the # of publications per year -->
    n_publications=data_json['publications'].length;
    for(var i=0;i<n_publications;i++) publications.push(0);
    for(var i=0;i<n_publications;i++) if(data_json['publications'][i]['year']>=min_year) publications[data_json['publications'][i]['year']-min_year]=data_json['publications'][i]['value'];
    for(var t=0;t<n_year;t++)	mean_publications+=publications[t]/n_year;
    document.getElementById('publications').innerHTML='# publications : '.concat(publications[year-min_year].toString());
    
    // reading the keywords -->
    n_words=data_json['keywords'].length;
    for(var i=0;i<n_words;i++) words.push(data_json['keywords'][i]['id']);
    for(var i=0;i<n_words;i++){
	word=words[i];
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color='#fff';
	myButton.style.cursor='pointer';
	myButton.id=word;
	myButton.innerHTML=word;
	myButton.style.fontSize=2*myButtonFontSize;
	document.getElementById('keywords').appendChild(myButton);
	if(word==='biodiversity' || word==='carbon_dioxide' || word==='carbon_permafrost' || word==='coral' || word==='malaria' || word==='climate' || word==='climate_change' || word==='methane_permafrost' || word==='mortality' || word==='morbidity' || word==='permafrost' || word==='pollution' || word==='soil_permafrost'){
	    myButton.style.fontSize=2*myButtonFontSize;
	    document.getElementById('footer').appendChild(myButton);
	}else{
	    myButton.style.fontSize=myButtonFontSize;
	    document.getElementById('keywords').appendChild(myButton);
	    document.getElementById('keywords').appendChild(document.createElement('br'));
	}
	document.getElementById(word).addEventListener('click',highlight,false);
	// if(i%1===0) document.getElementById('keywords').appendChild(document.createElement('br'));
	// myButton=document.createElement('span');
	// myButton.className='button';
	// myButton.style.color='#fff';
	// myButton.style.cursor='pointer';
	// myButton.id=word;
	// myButton.innerHTML=word;
	// myButton.style.fontSize=myButtonFontSize;
	// document.getElementById('keywords').appendChild(myButton);
	// document.getElementById(word).addEventListener('click',highlight,false);
    }
    word=words[i_word];
    document.getElementById('WORD').innerHTML=word;
    
    // initial year -->
    for(var w=0;w<n_words;w++){
	pairwize.push(data_json[words[w]]['links'].length);
	pileups.push(data_json[words[w]]['pileups'].length);
    }
    for(var w=0;w<n_words;w++){
	for(var i=0;i<pairwize[w];i++) min_year=Math.min(min_year,data_json[words[w]]['links'][i]['year']);
    }
    year=min_year;
    document.getElementById('YEAR').innerHTML=year.toString();
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    // calculing the forest coverage -->
    for(var i=0;i<n_year;i++){
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
    // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json -->
    global_surface_ice=data_json['ice'];
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
    
    // making the countries (http://www.csgnetwork.com/llinfotable.html) SOUTH:- NORTH:+ and WEST:- EAST:+ -->
    n_countries=data_json['nodes'].length;
    console.log(n_countries);
    console.log(n_countries*(n_countries-1)/2);
    console.log(pairwize);
    console.log(pileups);
    for(var i=0;i<n_countries;i++){
	LATi=0.5*Math.PI-data_json['LL'][i]['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+data_json['LL'][i]['lon']*Math.PI/180.0;// I do not understand the 0.5*Math.PI but at least it works -->
	rC=new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)).multiplyScalar(radius+radius0);
	if(i>=(n_countries-2)) country=new THREE.SphereGeometry(radius0,segments0,rings0);
	else country=new THREE.SphereGeometry(radius0,segments0,radius0);
	if(i===(n_countries-2)) material_country=new THREE.MeshBasicMaterial({color:0x0000ff});
	else{
	    if(i===(n_countries-1)) material_country=new THREE.MeshBasicMaterial({color:0x00ff00});
	    else material_country=new THREE.MeshBasicMaterial({color:0xff0000});
	}
	mesh_country=new THREE.Mesh(country,material_country);
	mesh_country.position.set(rC.x,rC.y,rC.z);
	globe.add(mesh_country);
    }

    for(var i=0;i<n_words;i++){
	for(var j=0;j<pairwize[i];j++) data_json[words[i]]['links'][j]['value']*=mean_publications/publications[data_json[words[i]]['links'][j]['year']-min_year];
	for(var j=0;j<pileups[i];j++) data_json[words[i]]['pileups'][j]['value']*=mean_publications/publications[data_json[words[i]]['pileups'][j]['year']-min_year];
    }

    data_json_w=data_json[word];
    console.log(data_json_w);
    
    globe.add(group_links);
    globe.add(group_pileups);
    globe.add(group_mesh);
    scene.add(globe);
    list_pileups_year();
    list_pairwize_year();
    change_links();
    update();
};// Ending readJSON -->

document.addEventListener('mousemove',RotateOnMouseMove);
document.addEventListener('mousedown',OnMouseDown);
document.addEventListener('mouseup',OnMouseUp);
document.addEventListener('mouseup',function(e){DraggingMouse=false;});
document.addEventListener('mousewheel',ZoomOnMouseWheel);
// document.addEventListener('keyup',MoveOnKeyboardKeys); -->
document.getElementById('pkeyword').addEventListener('click',function(){
    change_keyword(-1);
    list_pileups_year();
    list_pairwize_year();
    change_links();
},false);
document.getElementById('nkeyword').addEventListener('click',function(){
    change_keyword(1);
    list_pileups_year();
    list_pairwize_year();
    change_links();
},false);
function change_keyword(dw){
    i_word+=dw;
    if(i_word===n_words) i_word=0;
    if(i_word===-1) i_word=n_words-1;
    word=words[i_word];
    document.getElementById('WORD').innerHTML=word;
    data_json_w=data_json[word];
    initializing_description();
};
// changing year -->
// function MoveOnKeyboardKeys(e){ -->
// switch(e.keyCode){ -->
// case 37: -->
// year-=1; -->
// break; -->
// case 39: -->
// year+=1; -->
// break; -->
// case 65: -->
// year+=1; -->
// break; -->
// case 90: -->
// year-=1; -->
// break; -->
// case 81: -->
// i_word+=1; -->
// break; -->
// case 83: -->
// i_word-=1; -->
// break; -->
// }; -->
// i_word=Math.min(n_words-1,Math.max(0,i_word)); -->
// word=words[i_word]; -->
// document.getElementById('WORD').innerHTML=word; -->
// data_json_w=data_json[word]; -->
// if(year>max_year) year=min_year; -->
// if(year<min_year) year=max_year; -->
// document.getElementById('YEAR').innerHTML=year.toString(); -->
// document.getElementById('publications').innerHTML='# publications : '.concat(publications[year-min_year].toString()); -->
// initializing_description(); -->
// list_pileups_year(); -->
// list_pairwize_year(); -->
// change_links(); -->
// }; -->

// making the new links and the new pileups -->
function change_links(){
    // making the pileup for each country -->
    group_length=group_pileups.children.length;
    vS_length=vS.length;
    n_lines=lines.length;
    for(var i=0;i<n_pileups_year;i++){
	ii=pileups_year[i];
	source=data_json['LL'][data_json_w['pileups'][ii]['country']];// Starting and target points -->
	LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
	if(i<vS_length){
	    vS[i].setX(Math.sin(LATi)*Math.sin(LONi));
	    vS[i].setY(Math.cos(LATi));
	    vS[i].setZ(Math.sin(LATi)*Math.cos(LONi));
	    vT[i].copy(vS[i]);
	}else{
	    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	    vS_length+=1;
	}
	vS[i].multiplyScalar(radius);
	vT[i].multiplyScalar(radius+5.0*data_json_w['pileups'][ii]['value']);
	// Lines
	if(i<n_lines){
	    lines[i].vertices[0]=vS[i];
	    lines[i].vertices[1]=vT[i];
	}else{
	    lines.push(new THREE.Geometry());
	    lines[i].vertices.push(vS[i]);
	    lines[i].vertices.push(vT[i]);
	    n_lines+=1;
	}
	source=data_json_w['pileups'][ii]['country'];
	if(i<group_length){
	    group_pileups.children[i].geometry=lines[i];
            if(source==='facebook') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0x0000ff});
            if(source==='google') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0x00ff00});
            if(source!='facebook' && source!='google') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0xffffff});
	}else{
            if(source==='facebook') group_pileups.add(new THREE.Line(lines[i],new THREE.LineBasicMaterial({color:0x0000ff})));
            if(source==='google') group_pileups.add(new THREE.Line(lines[i],new THREE.LineBasicMaterial({color:0x00ff00})));
            if(source!='facebook' && source!='google') group_pileups.add(new THREE.Line(lines[i],new THREE.LineBasicMaterial({color:0xffffff})));
	    group_length+=1;
	}
	group_pileups.children[i].name=data_json['LL'][data_json_w['pileups'][ii]['country']]['id'].concat(' : ',ii.toString());
    }// Rof pileups
    for(var i=(group_length-1);i>=n_pileups_year;i--){
	scene.remove(group_pileups.children[i]);
	group_pileups.remove(group_pileups.children[i]);
    }
    // making the links
    group_length=group_links.children.length;
    n_curves=paths.curves.length;
    n_count=count.length;
    n_volume=volume.length;
    vS_length=vS.length;
    mST_length=mST.length;
    // cvS_length=cvS.length;
    // cvT_length=cvT.length;
    for(var i=0;i<(vS_length-mST_length);i++) mST.push(new THREE.Vector3());
    // for(var i=0;i<(vS_length-cvS_length);i++) cvS.push(new THREE.Vector3());
    // for(var i=0;i<(vS_length-cvT_length);i++) cvT.push(new THREE.Vector3());
    for(var i=0;i<n_pairwize_year;i++){
	ii=pairwize_year[i];
        // Starting and target points
	source=data_json_w['links'][ii]['source'];
	target=data_json_w['links'][ii]['target'];
	index=n_countries*Math.min(source,target)+Math.max(source,target);
	source=data_json['LL'][source];
	target=data_json['LL'][target];
	LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
	if(i<vS_length){
            vS[i].setX(Math.sin(LATi)*Math.sin(LONi));
            vS[i].setY(Math.cos(LATi));
            vS[i].setZ(Math.sin(LATi)*Math.cos(LONi));
	    mST[i].copy(vS[i]);
	    // cvS[i].copy(vS[i]);
        }else{
	    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	    mST.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	    // cvS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	}
	LATi=0.5*Math.PI-target['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+target['lon']*Math.PI/180.0;
        if(i<vS_length){
            vT[i].setX(Math.sin(LATi)*Math.sin(LONi));
            vT[i].setY(Math.cos(LATi));
            vT[i].setZ(Math.sin(LATi)*Math.cos(LONi));
	    // cvT[i].copy(vT[i]);
        }else{
	    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	    // cvT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
	}
	if(i>=vS_length) vS_length+=1;
	if(i<n_volume) volume[i]=weight0*Math.cbrt(3.0*data_json_w['links'][ii]['value']/(4.0*Math.PI));
	else volume.push(weight0*Math.cbrt(3.0*data_json_w['links'][ii]['value']/(4.0*Math.PI)));
	// mid-point
	theta=Math.acos(vS[i].x*vT[i].x+vS[i].y*vT[i].y+vS[i].z*vT[i].z);
	bn.setX(vS[i].y*vT[i].z-vS[i].z*vT[i].y);
	bn.setY(vS[i].z*vT[i].x-vS[i].x*vT[i].z);
	bn.setZ(vS[i].x*vT[i].y-vS[i].y*vT[i].x);
	bn.normalize();
	weighti=radius*theta/radius;
	// cvS[i].applyAxisAngle(bn,0.33*theta);
	// cvS[i].multiplyScalar(radius*(1.0+weighti));
	// cvT[i].applyAxisAngle(bn,0.66*theta);
	// cvT[i].multiplyScalar(radius*(1.0+weighti));
	mST[i].applyAxisAngle(bn,0.5*theta);
	mST[i].multiplyScalar(radius*(1.0+weighti));
	vS[i].multiplyScalar(radius);
	vT[i].multiplyScalar(radius);
	// Bezier curves
	// if(i<paths.curves.length) paths.curves[i]=new THREE.CubicBezierCurve3(vS[i],cvS[i],cvT[i],vT[i]);
	// else paths.add(new THREE.CubicBezierCurve3(vS[i],cvS[i],cvT[i],vT[i]));
	if(i<n_curves) paths.curves[i]=new THREE.QuadraticBezierCurve3(vS[i],mST[i],vT[i]);
        else{
	    paths.add(new THREE.QuadraticBezierCurve3(vS[i],mST[i],vT[i]));
	    n_curves+=1;
	}
	if(i<n_count){
	    count[i]=0;
	    delta_count[i]=parseInt(volume[i]);
	}else{
	    count.push(0);
	    delta_count.push(parseInt(volume[i]));
	    n_count+=1;
	}
	if(i<group_length){
      	    group_links.children[i].geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
	    source=data_json['nodes'][data_json_w['links'][ii]['source']]['id'];
	    target=data_json['nodes'][data_json_w['links'][ii]['target']]['id'];
      	    group_links.children[i].material=new THREE.LineBasicMaterial({color:colors[index%n_colors]});
	    group_mesh.children[i].material=group_links.children[i].material;
	    group_mesh.children[i].geometry.parameters.radius=volume[i];
	}else{
      	    geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
	    source=data_json['nodes'][data_json_w['links'][ii]['source']]['id'];
	    target=data_json['nodes'][data_json_w['links'][ii]['target']]['id'];
      	    group_links.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:colors[index%n_colors]})));
	    group_mesh.add(new THREE.Mesh(new THREE.SphereGeometry(volume[i],segments0,rings0),group_links.children[i].material));       
	    group_length+=1;
        }
	group_links.children[i].name=source.concat(' with ',target.concat(' : ',data_json_w['links'][ii]['value'].toString()));
    }// Rof pairwize
    for(var i=(group_length-1);i>=n_pairwize_year;i--){
	scene.remove(group_links.children[i]);
	group_links.remove(group_links.children[i]);
	scene.remove(group_mesh.children[i]);
	group_mesh.remove(group_mesh.children[i]);
    }
};

// list the pairwize for the year
function list_pairwize_year(){
    pairwize_year=[];
    for(var i=0;i<pairwize[i_word];i++) if(data_json_w['links'][i]['year']===year) pairwize_year.push(i);
    n_pairwize_year=pairwize_year.length;
};
// list the pileups for the year
function list_pileups_year(){
    pileups_year=[];
    for(var i=0;i<pileups[i_word];i++) if(data_json_w['pileups'][i]['year']===year) pileups_year.push(i);
    n_pileups_year=pileups_year.length;
};

function OnMouseUp(e){
    var mouse2D=new THREE.Vector2((e.clientX/window.innerWidth)*2-1,-(e.clientY/window.innerHeight)*2+1);
    var raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D,camera);
    intersects=raycaster.intersectObjects(group_pileups.children);
    if(intersects.length>0){
	intersects[0].object.material.color.setHex(Math.random()*0xffffff);
	text_buffer=intersects[0].object.name;
	text_buffer.fontcolor(Math.random()*0xffffff);
	text=text.concat(text_buffer,'<br>');
    }
    intersects=raycaster.intersectObjects(group_links.children);
    if(intersects.length>0){
	intersects[0].object.material.color.setHex(Math.random()*0xffffff);
	text_buffer=intersects[0].object.name;
	text_buffer.fontcolor(Math.random()*0xffffff);
	text=text.concat(text_buffer,'<br>');
    }
    document.getElementById('pileups').innerHTML=text;
};

// Rotating mouse
function OnMouseDown(e){
    DraggingMouse=true;
    PreviousMouseX=e.clientX;
    PreviousMouseY=e.clientY;
};
function RotateOnMouseMove(e){
    if(DraggingMouse){
	thetaX=Math.sign(e.clientX-PreviousMouseX)*0.075;
	thetaY=Math.sign(e.clientY-PreviousMouseY)*0.075;
	globe.rotation.x+=thetaY;
	globe.rotation.y+=thetaX;
	PreviousMouseX=e.clientX;
	PreviousMouseY=e.clientY;
    }
};

// zooming mouse
function ZoomOnMouseWheel(e){
    // camera.fov+=e.wheelDelta*ZoomSensitivity;
    // camera.projectionMatrix=new THREE.Matrix4().makePerspective(camera.fov,window.innerWidth/window.innerHeight,camera.near,camera.far);
    camera.position.set(camera.position.x,camera.position.y,camera.position.z-Math.sign(camera.position.z)*e.wheelDelta);
    camera.lookAt(new THREE.Vector3(0,0,0));
};

// making the render
function render(){
    for(var i=0;i<n_pairwize_year;i++){
	if(count[i]>=(f_points*n_points) || count[i]<0) delta_count[i]*=-1;
	count[i]+=delta_count[i];
	paths.curves[i].getPoint(count[i]/(f_points*n_points),pt);
	group_mesh.children[i].position.set(pt.x,pt.y,pt.z);
    }
    renderer.render(scene,camera);
};

function update(){
    requestAnimationFrame(update);
    render();
};
// year - 1
document.getElementById('yearm1').addEventListener('click',function(){
    change_year(-1);
    list_pileups_year();
    list_pairwize_year();
    change_links();
},false);
// year + 1
document.getElementById('yearp1').addEventListener('click',function(){
    change_year(1);
    list_pileups_year();
    list_pairwize_year();
    change_links();
},false);
// change year
function change_year(dt){
    year+=dt;
    if(year>max_year) year=min_year;
    if(year<min_year)year=max_year;
    description='# publications*mean(2010-2018)/publications('+(year.toString())+') :';
    text=description.concat('<br>');
    document.getElementById('pileups').innerHTML=text;
    document.getElementById('YEAR').innerHTML=year.toString();
    document.getElementById('publications').innerHTML='# publications : '.concat(publications[year-min_year].toString());
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year]);
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
};

// initializing description
function initializing_description(){
    description='# publications*mean(2010-2018)/publications('+(year.toString())+') :';
    text=description.concat('<br>');
    document.getElementById('pileups').innerHTML=text;
};

// highlighting a keyword on mouse click
function highlight(e){
    // document.getElementById(word).style.fontSize='10px';
    word=e.target.id;
    console.log(word);
    for(var i=0;i<n_words;i++) if(word===words[i]) i_word=i;
    data_json_w=data_json[word];
    document.getElementById('WORD').innerHTML=word;
    initializing_description();
    e.target.style.fontSize='30px';
    list_pileups_year();
    list_pairwize_year();
    change_links();
};

// list_pileups_year();
// list_pairwize_year();
// change_links();
// update();
requestJSON(readJSON);
