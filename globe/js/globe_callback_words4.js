console.clear();

// make variables
var count=[],delta_count=[],pt=new THREE.Vector3(),u=new THREE.Vector3(),group_length,n_points=100,f_points=10,pairwize=[],pileups=[],group_mesh=new THREE.Group(),group_links=new THREE.Group(),group_pileups=new THREE.Group();
var PreviousMouseX=0.0,PreviousMouseY=0.0,DraggingMouse=false;
const ZoomSensitivity=0.0001;
var vS=[],vT=[],vS_length,mST=[],mST_length,cvS_length,cvT_length,cvS=[],cvT=[],geometry,material,weight0=20.0,source=0,target=0;
var paths=new THREE.CurvePath();
const radius0=2.5,segments0=16,rings0=16;
var min_year=1990,max_year=2018,n_year=max_year-min_year+1,year=min_year,n_countries=0,theta,bn=[],bn_length;
var group_text=new THREE.Group();
var loader_font=new THREE.FontLoader();
var mesh_country,country,material_country,country_color=[],publications=[],mean_publications=0;
var rC=new THREE.Vector3(),LATi=0.0,LONi=0.0,index;
var mesh_text;
var i_word,word='',n_words,words=[];
// i_word=11;
// year=2014;
i_word=5;
year=2010;
var text='',text_buffer='',list_keywords='',intersects;
var n_forests,forest_coverage=[],n_forest_coverage=[],global_ice,volumes=[],volume,volumes_length;
var myButton,myButtonFontSize='10px';
var data_json,data_json_w,pairwize_year=[],n_pairwize_year=0,pileups_year=[],n_pileups_year=0,max_pileups=0.0,ii,n_curves,n_count;
var GHG_arg=['aN2O','aCH4','lN2O','lCH4'],GHG_title=['agricultural N2O','agricultural CH4','land N2O','land CH4'],GHG_ha_arg=['a_ha','a_ha','l_ha','l_ha'],n_GHG=GHG_arg.length,GHG_width=3.0,cylinder_height,cylinder_heights=[],cylinder_heights_length,ff;
var pesticides_arg=['export','import','use'],pesticides_title=['export','import','use'],n_pesticides=pesticides_arg.length,max_pesticides;
var fertilizers_nutrient_arg=['N_production','N_import','N_export','N_agricultural_use','P2O5_production','P2O5_import','P2O5_export','P2O5_agricultural_use','K2O_production','K2O_import','K2O_export','K2O_agricultural_use'],fertilizers_nutrient_units=1.0,max_fertilizers_nutrient,fertilizers_nutrient_title=['N production','N import','N export','N agricultural use','P2O5 production','P2O5 import','P2O5 export','P2O5 agricultural use','K2O production','K2O import','K2O export','K2O agricultural use'],n_fertilizers_nutrient=fertilizers_nutrient_arg.length;
var crops_livestock_arg=['export_value','import_value','export_quantity','import_quantity'],n_crops_livestock=crops_livestock_arg.length,crops_livestock_title=['millions(US dollars) export','millions(US dollars) import','tonnes export','tonnes import'],crops_livestock_units=[1e6,1e6,1e3,1e3],max_crops_livestock;
var average_yield_arg=['average_yield'],n_average_yield=average_yield_arg.length,average_yield_units=1.0,average_yield_title=['tonnes/ha'],max_average_yield;
var livestock_heads_arg=['heads'],n_livestock_heads=livestock_heads_arg.length,livestock_heads_units=1e6,livestock_heads_title=['millions of livestock heads'],max_livestock_heads;
var land_use_arg=['land_country','agricultural_country','organic_country'],land_use_units=1,land_use_title=['ratio land/country %','agricultural country %','organic country %'],max_land_use,n_land_use=land_use_arg.length;
var data_FAO,i_FAO,b_FAO=[],title_FAO=['GHG','pesticides','crops_livestock','average_yield','livestock_heads','land_use','fertilizers_nutrient'];
var n_FAO=title_FAO.length,n_FAO_i,t_FAO_i;
for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
var label,buffer_int;

initializing_description();

var colors=["#6666ff","#d98c8c","#66ff66","#ff66a3","#66ccff","#ffc266","#996600","#ffb366","#8585e0","#ff66ff","#a3a3c2","#ff8c66","#b366ff","#006699","#cc99ff","#669900","#ccccff","#ff5050","#9933ff","#33cc33","#0099cc"];
var n_colors=colors.length;
var colors2=['purple','orange','violet','cyan','green','yellow','red','maroon','pink','blue','gray','white']

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
// make light
var DirectionalLight=new THREE.DirectionalLight(0xffffff,1);
DirectionalLight.position.set(camera.position);
DirectionalLight.lookAt(new THREE.Vector3(0,0,0));
scene.add(DirectionalLight);
// make render
var renderer=new THREE.WebGLRenderer({antialias:true});
var container=document.getElementById('container');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
container.appendChild(renderer.domElement);
// make globe
const radius=200,segments=128,rings=128;
var globe=new THREE.Group();
// Loading the world map texture
var loader=new THREE.TextureLoader();
loader.crossOrigin="";
// loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_world_map.svg/2000px-Simple_world_map.svg.png',function(texture){
loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg',function(texture){
    var sphere=new THREE.SphereGeometry(radius,segments,rings);
    // var material=new THREE.MeshBasicMaterial({map:texture,overdraw:0.5});
    var material=new THREE.MeshBasicMaterial({map:texture,wireframe:false});
    var mesh=new THREE.Mesh(sphere,material);
    globe.add(mesh);
},function(error){console.log(error);});
globe.position.set(0,0,0);

// https://www.ncdc.noaa.gov/cag/global/time-series/globe/land/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017
var temp_anom_land={"description":{"title":"Global Land Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.62","2001":"0.81","2002":"0.92","2003":"0.88","2004":"0.79","2005":"1.03","2006":"0.90","2007":"1.08","2008":"0.85","2009":"0.87","2010":"1.07","2011":"0.89","2012":"0.90","2013":"0.98","2014":"1.00","2015":"1.34","2016":"1.44","2017":"1.31"}};
// https://www.ncdc.noaa.gov/cag/global/time-series/globe/ocean/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017
var temp_anom_ocean={"description":{"title":"Global Ocean Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.35","2001":"0.44","2002":"0.48","2003":"0.51","2004":"0.49","2005":"0.51","2006":"0.50","2007":"0.43","2008":"0.42","2009":"0.55","2010":"0.56","2011":"0.46","2012":"0.51","2013":"0.55","2014":"0.64","2015":"0.74","2016":"0.76","2017":"0.67"}};

// graph of the pudmed
function requestJSON(callback){
    var xhr=new XMLHttpRequest();
    xhr.responseType='json';
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4 && (xhr.status===200 || xhr.status===0)){
	    callback(xhr.response);
	}
    };
    xhr.open('GET','./data/all.json',true);
    // xhr.setRequestHeader('Access-Control-Allow-Methods','GET');
    // xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(null);
};

function readJSON(data){
    
    data_json=data;
    
    // reading the # of publications per year
    for(var y=1990;y<=2018;y++)	mean_publications+=data_json['publications'][y.toString()]/(2018-1990+1);
    document.getElementById('publications').innerHTML='# publications : '.concat(data_json['publications'][year.toString()].toString());
    
    // reading the keywords
    n_words=data_json['keywords'].length;
    for(var i=0;i<n_words;i++) words.push(data_json['keywords'][i]['id']);
    for(var i=0;i<n_words;i++){
	word=words[i];
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[i%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=word;
	myButton.innerHTML=word;
	myButton.style.fontSize=2*myButtonFontSize;
	document.getElementById('keywords').appendChild(myButton);
	myButton.style.fontSize=2*myButtonFontSize;
	document.getElementById('leftCol').appendChild(myButton);
	document.getElementById('leftCol').appendChild(document.createElement('br'));
	document.getElementById(word).addEventListener('click',highlight,false);
    }
    word=words[i_word];
    document.getElementById('WORD').innerHTML=word;
    // list of years
    for(var y=2005;y<=max_year;y++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[(y-min_year)%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=y.toString();
	myButton.innerHTML=y.toString();
	myButton.style.fontSize='20px';
	document.getElementById('rightCol').appendChild(myButton);
	document.getElementById('rightCol').appendChild(document.createElement('br'));
	document.getElementById(y.toString()).addEventListener('click',change_year,false);
    }
    // GHG button
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='nitrous_oxide_methane';
    myButton.innerHTML='GHG/km2';
    myButton.style.fontSize='20px';
    document.getElementById('rightColGHG').appendChild(myButton);
    document.getElementById('nitrous_oxide_methane').addEventListener('click',nitrous_oxide_methane,false);
    // pesticides button
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='pesticides';
    myButton.innerHTML='pesticides';
    myButton.style.fontSize='20px';
    document.getElementById('rightColP').appendChild(myButton);
    document.getElementById('pesticides').addEventListener('click',pesticides,false);
    // crops livestock trade button
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='crops_livestock';
    myButton.innerHTML='crops_livestock';
    myButton.style.fontSize='20px';
    document.getElementById('rightColF').appendChild(myButton);
    document.getElementById('crops_livestock').addEventListener('click',crops_livestock,false);
    // average yield button
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='average_yield';
    myButton.innerHTML='average_yield';
    myButton.style.fontSize='20px';
    document.getElementById('rightColY').appendChild(myButton);
    document.getElementById('average_yield').addEventListener('click',average_yield,false);
    // production livestock
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='livestock_heads';
    myButton.innerHTML='livestock_heads';
    myButton.style.fontSize='20px';
    document.getElementById('rightColPL').appendChild(myButton);
    document.getElementById('livestock_heads').addEventListener('click',livestock_heads,false);
    // land use
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='land_use';
    myButton.innerHTML='land_use';
    myButton.style.fontSize='20px';
    document.getElementById('rightColLU').appendChild(myButton);
    document.getElementById('land_use').addEventListener('click',land_use,false);
    // fertilizers nutrient
    myButton=document.createElement('span');
    myButton.className='button';
    myButton.style.color='white';
    myButton.style.cursor='pointer';
    myButton.id='fertilizers_nutrient';
    myButton.innerHTML='fertilizers_nutrient';
    myButton.style.fontSize='20px';
    document.getElementById('rightColFN').appendChild(myButton);
    document.getElementById('fertilizers_nutrient').addEventListener('click',fertilizers_nutrient,false);

    // initial year
    for(var w=0;w<n_words;w++){
	pairwize.push(data_json[words[w]]['links'].length);
	pileups.push(data_json[words[w]]['pileups'].length);
    }
    document.getElementById('YEAR').innerHTML=year.toString();
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    // calculing the forest coverage
    for(var i=0;i<n_year;i++){
	forest_coverage.push(0.0);
	n_forest_coverage.push(0);
    }
    n_forests=data_json['forest_coverage'].length;
    for(var i=0;i<n_forests;i++){
	forest_coverage[data_json['forest_coverage'][i]['year']-min_year]+=data_json['forest_coverage'][i]['coverage'];
	n_forest_coverage[data_json['forest_coverage'][i]['year']-min_year]+=1;
    }
    for(var i=0;i<n_year;i++) forest_coverage[i]/=n_forest_coverage[i];
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json
    global_surface_ice=data_json['ice'];
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
    
    // making the countries (http://www.csgnetwork.com/llinfotable.html) SOUTH:- NORTH:+ and WEST:- EAST:+
    n_countries=Object.keys(data_json['country_index']).length;
    console.log(n_countries);
    console.log(n_countries*(n_countries-1)/2);
    console.log(pairwize);
    console.log(pileups);
    for(var i=0;i<n_countries;i++){
	LATi=0.5*Math.PI-data_json['LL'][i.toString()]['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+data_json['LL'][i.toString()]['lon']*Math.PI/180.0;// I do not understand the 0.5*Math.PI but at least it works
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
	source=data_json['index_country'][i.toString()];
	if(source==='facebook') country_color[source]=0x0000ff;
	if(source==='google') country_color[source]=0x00ff00;
	if(source!='facebook' && source!='google') country_color[source]=0xffffff;
    }

    for(var i=0;i<n_words;i++){
	for(var j=0;j<pairwize[i];j++) data_json[words[i]]['links'][j]['value']*=mean_publications/data_json['publications'][year.toString()];
	for(var j=0;j<pileups[i];j++) data_json[words[i]]['pileups'][j]['value']*=mean_publications/data_json['publications'][year.toString()];
    }

    data_json_w=data_json[word];
    console.log(word);
    // console.log(data_json_w);
    
    globe.add(group_links);
    globe.add(group_pileups);
    globe.add(group_mesh);
    scene.add(globe);
    list_pileups_year();
    list_pairwize_year();
    change_links();
    update();
};// Ending readJSON

document.addEventListener('mousemove',RotateOnMouseMove);
document.addEventListener('mousedown',OnMouseDown);
document.addEventListener('mouseup',OnMouseUp);
document.addEventListener('mouseup',function(e){DraggingMouse=false;});
document.addEventListener('mousewheel',ZoomOnMouseWheel);

// making the nitrous oxide and methane emissions
function change_GHG(){
    if(i_word<0 && b_FAO['GHG']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['GHG'];
	max_GHG=[];
	for(var j=0;j<n_GHG;j++){
	    max_GHG.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_GHG[j]=Math.max(max_GHG[j],data_FAO[i][GHG_arg[j]]/data_FAO[i][GHG_ha_arg[j]]);
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<n_GHG;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar(((n_GHG-1.0)/2.0-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][GHG_arg[j]]/data_FAO[i][GHG_ha_arg[j]])*radius/max_GHG[j];// gigagrams per ha
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+((cylinder_height.toPrecision(3)).toString())+' '+GHG_arg[j]+' gigagrams per ha of emissions';
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the pesticides import/export/use
function change_pesticides(){
    if(i_word<0 && b_FAO['pesticides']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['pesticides'];
	max_pesticides=[];
	for(var j=0;j<3;j++){
	    max_pesticides.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			if(pesticides_arg[j]==='use') max_pesticides[j]=Math.max(max_pesticides[j],data_FAO[i][pesticides_arg[j]]/1e3);// in tonnes
			else max_pesticides[j]=Math.max(max_pesticides[j],data_FAO[i][pesticides_arg[j]]/1e6);// in million of US dollars
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<3;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    // vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    // vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar((1-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			if(pesticides_arg[j]==='use') cylinder_height=(data_FAO[i][pesticides_arg[j]]/1e3)*radius/max_pesticides[j];// in ton
			else cylinder_height=(data_FAO[i][pesticides_arg[j]]/1e6)*radius/max_pesticides[j];// in million of US dollars
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			if(pesticides_arg[j]==='use') group_pileups.children[inc].name=source['id']+' '+pesticides_arg[j]+' : '+(((data_FAO[i][pesticides_arg[j]]/1e6).toPrecision(3)).toString())+' tonnes of active ingredients';
			else group_pileups.children[inc].name=source['id']+' '+pesticides_arg[j]+' : '+(((data_FAO[i][pesticides_arg[j]]/1e3).toPrecision(3)).toString())+' millions(US dollars)';
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the food trade
function change_crops_livestock(){
    if(i_word<0 && b_FAO['crops_livestock']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['crops_livestock'];
	max_crops_livestock=[];
	for(var j=0;j<4;j++){
	    max_crops_livestock.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_crops_livestock[j]=Math.max(max_crops_livestock[j],data_FAO[i][crops_livestock_arg[j]]/crops_livestock_units[j]);// in million of US dollars or tonnes
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<4;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar((1.5-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][crops_livestock_arg[j]]/crops_livestock_units[j])*radius/max_crops_livestock[j];// in million of US dollars
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+(((data_FAO[i][crops_livestock_arg[j]]/crops_livestock_units[j]).toPrecision(3)).toString())+' '+crops_livestock_title[j];
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the crops production average yield
function change_average_yield(){
    if(i_word<0 && b_FAO['average_yield']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['crops_average_yield'];
	max_average_yield=[];
	for(var j=0;j<1;j++){
	    max_average_yield.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_average_yield[j]=Math.max(max_average_yield[j],data_FAO[i][average_yield_arg[j]]/average_yield_units);// tonnes per ha
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<1;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar((0-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][average_yield_arg[j]]/average_yield_units)*radius/max_average_yield[j];// in million of US dollars
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+(((data_FAO[i][average_yield_arg[j]]/average_yield_units).toPrecision(3)).toString())+' '+average_yield_title[j];
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the livestock production heads
function change_livestock_heads(){
    if(i_word<0 && b_FAO['livestock_heads']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['livestock_heads'];
	max_livestock_heads=[];
	for(var j=0;j<1;j++){
	    max_livestock_heads.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_livestock_heads[j]=Math.max(max_livestock_heads[j],data_FAO[i][livestock_heads_arg[j]]/livestock_heads_units);
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<1;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar((0-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][livestock_heads_arg[j]]/livestock_heads_units)*radius/max_livestock_heads[j];
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+(((data_FAO[i][livestock_heads_arg[j]]/livestock_heads_units).toPrecision(3)).toString())+' '+livestock_heads_title[j];
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the land use
function change_land_use(){
    if(i_word<0 && b_FAO['land_use']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['land_use'];
	max_land_use=[];
	for(var j=0;j<n_land_use;j++){
	    max_land_use.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_land_use[j]=Math.max(max_land_use[j],data_FAO[i][land_use_arg[j]]/land_use_units);
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<n_land_use;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar(((n_land_use-1.0)/2.0-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][land_use_arg[j]]/land_use_units)*radius/max_land_use[j];// in million of US dollars
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+(((data_FAO[i][land_use_arg[j]]/land_use_units).toPrecision(3)).toString())+' '+land_use_title[j];
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the fertilizers nutrient
function change_fertilizers_nutrient(){
    if(i_word<0 && b_FAO['fertilizers_nutrient']){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json['fertilizers_nutrient'];
	max_fertilizers_nutrient=[];
	for(var j=0;j<n_fertilizers_nutrient;j++){
	    max_fertilizers_nutrient.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['year']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_fertilizers_nutrient[j]=Math.max(max_fertilizers_nutrient[j],data_FAO[i][fertilizers_nutrient_arg[j]]/fertilizers_nutrient_units);
		    }
		}
	    }
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['year']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<n_fertilizers_nutrient;j++){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			    vT[inc].copy(vS[inc]);
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length+=1;
			}
			pt.setX(0.0*vS[inc].z-1.0*vS[inc].y);
			pt.setY(1.0*vS[inc].x-0.0*vS[inc].z);
			pt.setZ(0.0*vS[inc].y-0.0*vS[inc].x);
			pt.normalize();
			pt.multiplyScalar(((n_fertilizers_nutrient-1.0)/2.0-j)*2.0*GHG_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=(data_FAO[i][fertilizers_nutrient_arg[j]]/fertilizers_nutrient_units)*radius/max_fertilizers_nutrient[j];// in million of US dollars
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
			    group_length+=1;
			}else group_pileups.children[inc].scale.y=cylinder_height/cylinder_heights[inc];
			group_pileups.children[inc].rotation.order='YXZ';
			group_pileups.children[inc].rotation.x=LATi;
			group_pileups.children[inc].rotation.y=LONi;
			group_pileups.children[inc].geometry.verticesNeedUpdate=true;
			group_pileups.children[inc].material.color.set(colors2[j]);
			group_pileups.children[inc].material.opacity=0.5;
			group_pileups.children[inc].material.needsUpdate=true;
			u.multiplyScalar(0.5*cylinder_height);
			group_pileups.children[inc].position.set(vS[inc].x+u.x,vS[inc].y+u.y,vS[inc].z+u.z);
			group_pileups.children[inc].name=source['id']+' : '+(((data_FAO[i][fertilizers_nutrient_arg[j]]/fertilizers_nutrient_units).toPrecision(3)).toString())+' '+fertilizers_nutrient_title[j];
			inc+=1;
		    }
		}
	    }
	}
    }
};

// making the new links and the new pileups
function change_links(){
    // making the pileup for each country
    group_length=group_pileups.children.length;
    cylinder_heights_length=cylinder_heights.length;
    vS_length=vS.length;
    max_pileups=0.0;
    for(var i=0;i<n_pileups_year;i++) max_pileups=Math.max(max_pileups,data_json_w['pileups'][pileups_year[i]]['value']);
    for(var i=0;i<n_pileups_year;i++){
	ii=pileups_year[i];
	source=data_json['LL'][data_json_w['pileups'][ii]['country']];// Starting and target points
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
	cylinder_height=data_json_w['pileups'][ii]['value']*radius/max_pileups;
	vT[i].multiplyScalar(radius+0.5*cylinder_height);
	if(i>=group_length){
	    cylinder_heights.push(cylinder_height);
	    cylinder_heights_length+=1;
	    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
	    group_length+=1;
	}else{
	    group_pileups.children[i].scale.set(1.0,cylinder_height/cylinder_heights[i],1.0);
	    // group_pileups.children[i].geometry=new THREE.CylinderGeometry(GHG_width,GHG_width,cylinder_height,32);
	    // console.log(i,data_json['LL'][data_json_w['pileups'][ii]['country']]['id'],group_pileups.children[i].scale.y,cylinder_height/cylinder_heights[i]);
	    // cylinder_heights[i]=cylinder_height;
	}
	group_pileups.children[i].rotation.order='YXZ';
	group_pileups.children[i].rotation.x=LATi;
	group_pileups.children[i].rotation.y=LONi;
	group_pileups.children[i].position.set(vT[i].x,vT[i].y,vT[i].z);
	group_pileups.children[i].geometry.verticesNeedUpdate=true;
	group_pileups.children[i].material.color.set('white');
	group_pileups.children[i].material.opacity=0.5;
	group_pileups.children[i].material.needsUpdate=true;
	source=data_json['LL'][data_json_w['pileups'][ii]['country']]['id'];
	group_pileups.children[i].name=source.concat(' : ',data_json_w['pileups'][ii]['value'].toString());
    }// Rof pileups
    for(var i=(group_length-1);i>=n_pileups_year;i--){
	scene.remove(group_pileups.children[i]);
	group_pileups.remove(group_pileups.children[i]);
    }
    // making the links
    group_length=group_links.children.length;
    n_curves=paths.curves.length;
    n_count=count.length;
    volumes_length=volumes.length;
    vS_length=vS.length;
    mST_length=mST.length;
    bn_length=bn.length;
    // cvS_length=cvS.length;
    // cvT_length=cvT.length;
    for(var i=0;i<(vS_length-mST_length);i++) mST.push(new THREE.Vector3());
    for(var i=0;i<(vS_length-bn_length);i++) bn.push(new THREE.Vector3());
    // for(var i=0;i<(vS_length-cvS_length);i++) cvS.push(new THREE.Vector3());
    // for(var i=0;i<(vS_length-cvT_length);i++) cvT.push(new THREE.Vector3());
    for(var i=0;i<n_pairwize_year;i++){
	ii=pairwize_year[i];
        // Starting and target points
	source=data_json_w['links'][ii]['s'];
	target=data_json_w['links'][ii]['t'];
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
	    bn.push(new THREE.Vector3());
	}
	if(i>=vS_length) vS_length+=1;
	// mid-point
	theta=Math.acos(vS[i].x*vT[i].x+vS[i].y*vT[i].y+vS[i].z*vT[i].z);
	bn[i].setX(vS[i].y*vT[i].z-vS[i].z*vT[i].y);
	bn[i].setY(vS[i].z*vT[i].x-vS[i].x*vT[i].z);
	bn[i].setZ(vS[i].x*vT[i].y-vS[i].y*vT[i].x);
	bn[i].normalize();
	// cvS[i].applyAxisAngle(bn[i],0.33*theta);
	// cvS[i].multiplyScalar(radius*(1.0+theta));
	// cvT[i].applyAxisAngle(bn[i],0.66*theta);
	// cvT[i].multiplyScalar(radius*(1.0+theta));
	mST[i].applyAxisAngle(bn[i],0.5*theta);
	mST[i].multiplyScalar(radius*(1.0+theta));
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
	volume=weight0*Math.cbrt(3.0*data_json_w['links'][ii]['value']/(4.0*Math.PI));
	if(i<n_count){
	    count[i]=0;
	    delta_count[i]=parseInt(volume);
	}else{
	    count.push(0);
	    delta_count.push(parseInt(volume));
	    n_count+=1;
	}
	if(i<group_length){
      	    // group_links.children[i].geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
	    group_links.children[i].geometry.setFromPoints(paths.curves[i].getPoints(n_points));
	    group_links.children[i].geometry.verticesNeedUpdate=true;
	    group_mesh.children[i].scale.x=volume/volumes[i];
	    group_mesh.children[i].scale.y=volume/volumes[i];
	    group_mesh.children[i].scale.z=volume/volumes[i];
	    group_mesh.children[i].geometry.verticesNeedUpdate=true;
	    group_links.children[i].material.color.set(colors[index%n_colors]);
	    group_links.children[i].material.needsUpdate=true;
	    group_mesh.children[i].material=group_links.children[i].material;
	    group_mesh.children[i].material.needsUpdate=true;
	}else{
      	    geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
      	    group_links.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:colors[index%n_colors]})));
	    group_mesh.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),group_links.children[i].material));
	    group_length+=1;
	    volumes.push(volume);
	    volumes_length+=1;
        }
	source=data_json['index_country'][data_json_w['links'][ii]['s']];
	target=data_json['index_country'][data_json_w['links'][ii]['t']];
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
    if(i_word>-1){
	for(var i=0;i<pairwize[i_word];i++) if(data_json_w['links'][i]['y']===year) pairwize_year.push(i);
    }
    n_pairwize_year=pairwize_year.length;
};
// list the pileups for the year
function list_pileups_year(){
    pileups_year=[];
    if(i_word>-1){
	for(var i=0;i<pileups[i_word];i++) if(data_json_w['pileups'][i]['y']===year) pileups_year.push(i);
    }
    n_pileups_year=pileups_year.length;
};

function OnMouseUp(e){
    var mouse2D=new THREE.Vector2((e.clientX/window.innerWidth)*2-1,-(e.clientY/window.innerHeight)*2+1);
    var raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(mouse2D,camera);
    intersects=raycaster.intersectObjects(group_pileups.children);
    if(intersects.length>0){
	// intersects[0].object.material.color.setHex(Math.random()*0xffffff);
	text_buffer=intersects[0].object.name;
	text_buffer.fontcolor(Math.random()*0xffffff);
	text=text.concat(text_buffer,'<br>');
    }
    intersects=raycaster.intersectObjects(group_links.children);
    if(intersects.length>0){
	// intersects[0].object.material.color.setHex(Math.random()*0xffffff);
	// intersects[0].object.material.linewidth=5.0;
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

// change year on mouse click
function change_year(e){
    year=parseInt(e.target.id);
    initializing_description();
    document.getElementById('pileups').innerHTML=text;
    document.getElementById('YEAR').innerHTML=year.toString();
    document.getElementById('publications').innerHTML='# publications : '.concat(data_json['publications'][year.toString()].toString());
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
    list_pileups_year();
    list_pairwize_year();
    change();
};

function change(){
    initializing_description();
    list_pileups_year();
    list_pairwize_year();
    change_links();
    change_GHG();
    change_pesticides();
    change_crops_livestock();
    change_average_yield();
    change_livestock_heads();
    change_land_use();
    change_fertilizers_nutrient();
};

// draw the nitrous oxide and methane emissions on click
function nitrous_oxide_methane(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['GHG']=true;
    change();
}

// draw the pesticides import/export/use on click
function pesticides(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['pesticides']=true;
    change();
}

// draw the food trade import/export on click
function crops_livestock(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['crops_livestock']=true;
    change();
};

// draw the average yield crops production
function average_yield(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['average_yield']=true;
    change();
};

// draw the production livestock
function livestock_heads(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['livestock_heads']=true;
    initializing_description();
    list_pileups_year();
    list_pairwize_year();
    change();
};

// draw the land use
function land_use(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['land_use']=true;
    change();
};

// draw the fertilizers nutrient
function fertilizers_nutrient(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    b_FAO['fertilizers_nutrient']=true;
    change();
};

// initializing description
function initializing_description(){
    description='# publications*mean(2010-2018)/publications('+(year.toString())+') :';
    if(b_FAO['GHG']){
	description='GHG from agricultural land, FAO ('+(year.toString())+') :';
	n_FAO_i=n_GHG;
	t_FAO_i=GHG_title;
    }
    if(b_FAO['pesticides']){
	description='pesticides, FAO ('+(year.toString())+') :';
	n_FAO_i=n_pesticides;
	t_FAO_i=pesticides_title;
    }
    if(b_FAO['crops_livestock']){
	description='crops livestock, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_livestock;
	t_FAO_i=crops_livestock_title;
    }
    if(b_FAO['average_yield']){
	description='average yield, FAO ('+(year.toString())+') :';
	n_FAO_i=n_average_yield;
	t_FAO_i=average_yield_title;
    }
    if(b_FAO['livestock_heads']){
	description='livestock heads, FAO ('+(year.toString())+') :';
	n_FAO_i=n_livestock_heads;
	t_FAO_i=livestock_heads_title;
    }
    if(b_FAO['land_use']){
	description='land use, FAO ('+(year.toString())+') :';
	n_FAO_i=n_land_use;
	t_FAO_i=land_use_title;
    }
    if(b_FAO['fertilizers_nutrient']){
	description='fertilizers nutrient (in tonnes), FAO ('+(year.toString())+') :';
	n_FAO_i=n_fertilizers_nutrient;
	t_FAO_i=fertilizers_nutrient_title;
    }
    buffer_int=document.getElementById('legend').children.length;
    for(var i=(buffer_int-1);i>=0;i--) document.getElementById('legend').removeChild(document.getElementById('legend').children[i]);
    for(var i=0;i<n_FAO_i;i++){
	if(i<document.getElementById('legend').children.length){
	    document.getElementById('legend').children[i].style.color=colors2[i];
	    document.getElementById('legend').children[i].innerHTML=t_FAO_i[i]+'<br>';
	}else{
	    label=document.createElement('span');
	    label.style.color=colors2[i];
	    label.innerHTML=t_FAO_i[i]+'<br>';
	    // myButton.style.fontSize='20px';
	    document.getElementById('legend').appendChild(label);
	}
    }
    text=description.concat('<br>');
    document.getElementById('pileups').innerHTML=text;
};

// highlighting a keyword on mouse click
function highlight(e){
    for(var i=0;i<n_FAO;i++) b_FAO[title_FAO[i]]=false;
    // document.getElementById(word).style.fontSize='10px';
    word=e.target.id;
    console.log(word);
    for(var i=0;i<n_words;i++) if(word===words[i]) i_word=i;
    data_json_w=data_json[word];
    document.getElementById('WORD').innerHTML=word;
    initializing_description();
    // e.target.style.fontSize='30px';
    list_pileups_year();
    list_pairwize_year();
    change();
};

requestJSON(readJSON);
