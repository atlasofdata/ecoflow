// https://github.com/theatlasofdata/ecoflow
// https://theatlasofdata.earth

console.clear();

// make variables
var count=[],delta_count=[],pt=new THREE.Vector3(),u=new THREE.Vector3(),group_length,n_points=100,f_points=10,pairwize=[],pileups=[],group_mesh=new THREE.Group(),group_links=new THREE.Group(),group_pileups=new THREE.Group();
var PreviousMouseX=0.0,PreviousMouseY=0.0,DraggingMouse=false;
const ZoomSensitivity=0.0001;
var vS=[],vT=[],vS_length,mST=[],mST_length,cvS_length,cvT_length,cvS=[],cvT=[],geometry,material,weight0=20.0,source=0,target=0;
var paths=new THREE.CurvePath();
const radius0=2.5,segments0=16,rings0=16;
var min_year=1990,max_year=2018,n_year=max_year-min_year+1,year=2010,n_countries=0,theta,bn=[],bn_length;
var group_text=new THREE.Group();
var loader_font=new THREE.FontLoader();
var mesh_country,country,material_country,country_color=[],publications=[],mean_publications=0;
var rC=new THREE.Vector3(),LATi=0.0,LONi=0.0,index;
var mesh_text;
var i_word=5,word='',n_words,words=[],buffer_words=[];
var text='',text_buffer='',list_keywords='',intersects;
var n_forests,forest_coverage=[],n_forest_coverage=[],global_ice,volumes=[],volume,volumes_length;
var myButton,myButtonFontSize='10px';
var data_json,data_json_w,pairwize_year=[],n_pairwize_year=0,pileups_year=[],n_pileups_year=0,max_pileups=0.0,ii,n_curves,n_count;
var cylinder_height,cylinder_heights=[],cylinder_heights_length,ff
// --- variables : FAO data
// annual production
var annual_population_arg=['total','urban_rural','female_male'],annual_population_title=['millions of persons','ratio urban/rural','ratio female/male'],n_annual_population=annual_population_arg.length
// crops livestock
var crops_livestock_arg=['total_i','total_e'],n_crops_livestock=crops_livestock_arg.length,crops_livestock_title=['millions(US dollar) export','millions(US dollar) import'];
// crops average yield
var crops_average_yield_arg=['VP_t_ha','FP_t_ha','cereals_t_ha','sugar_t_ha'],n_crops_average_yield=crops_average_yield_arg.length,crops_average_yield_title=['vegetables primary average yield in tonnes per ha','fruits primary average yield in tonnes per ha','cereals average yield in tonnes per ha','sugar(beet and can) average yield in tonnes per ha'];
// emissions intensities : eggs, meat, milk and rice
var environment_emissions_intensities_arg=['eggs','meat','milk','rice'],environment_emissions_intensities_title=['eggs, hen in shell production/CO2','meat production/CO2','milk production/CO2','rice production/CO2'],n_environment_emissions_intensities=environment_emissions_intensities_arg.length;
// emissions intensities : rice production and organic soils
var rice_and_organic_soils_emissions_intensities_arg=['rCO2','oCO2'],rice_and_organic_soils_emissions_intensities_title=['rice CO2(in tonnes) per ha','cultivated organic soils CO2(in tonnes) per ha'],n_rice_and_organic_soils_emissions_intensities=rice_and_organic_soils_emissions_intensities_arg.length;
// environment fertilizers
var environment_fertilizers_arg=['N','P2O5','K2O'],environment_fertilizers_title=['N tonnes per ha of cropland','P2O5 tonnes per ha of cropland','K2O tonnes per ha of cropland'],n_environment_fertilizers=environment_fertilizers_arg.length;
// fertilizers production, import/export
var fertilizers_nutrient_arg=['N_production_import','N_import_export','P2O5_production_import','P2O5_import_export','K2O_production_import','K2O_import_export'],fertilizers_nutrient_title=['N production/import','N import/export','P2O5 production/import','P2O5 import/export','K2O production/import','K2O import/export'],n_fertilizers_nutrient=fertilizers_nutrient_arg.length;
// fertilizers (production+import)/export
var fertilizers_nutrient_arg=['N_production_import','P2O5_production_import','K2O_production_import'],fertilizers_nutrient_title=['N (production+import)/export','P2O5 (production+import)/export','K2O (production+import)/export'],n_fertilizers_nutrient=fertilizers_nutrient_arg.length;
// fertilizers agricultural use
var fertilizers_nutrient_agricultural_use_arg=['N_agricultural_use','P2O5_agricultural_use','K2O_agricultural_use'],fertilizers_nutrient_agricultural_use_title=['N tonnes per ha of agricultural use','P2O5 tonnes per ha of agricultural use','K2O tonnes per ha of agricultural use'],n_fertilizers_nutrient_agricultural_use=fertilizers_nutrient_agricultural_use_arg.length;
// food supply
var food_supply_arg=['food','protein','fat'],food_supply_title=['food kcal/capita/day','proteins g/capita/day','fat g/capita/day'],n_food_supply=food_supply_arg.length;
// forestry production
var forestry_production_arg=['import_value','export_value'],forestry_production_title=['millions in US dollar import','millions in US dollar export'],n_forestry_production=forestry_production_arg.length;
// greenhouse gaz
var GHG_arg=['aN2O','aCH4','lN2O','lCH4'],GHG_title=['agricultural N2O (tonnes per ha)','agricultural CH4 (tonnes per ha)','land N2O (tonnes per ha)','land CH4 (tonnes per ha)'],n_GHG=GHG_arg.length;
// land use
var land_use_arg=['land_country','agricultural_country','organic_country'],land_use_title=['ratio land/country %','agricultural country %','organic country %'],n_land_use=land_use_arg.length;
// livestock heads
var livestock_heads_arg=['heads','sheads'],n_livestock_heads=livestock_heads_arg.length,livestock_heads_title=[' livestock heads',' slaughtered animals'];
// manure
var manure_arg=['pN','pN2O','pCO2','sN','sN2O','sCO2'],n_manure=manure_arg.length,manure_title=['N(kg) per head from manure left on pasture','N2O(kg) per head from manure left on pasture','CO2eq(kg) per head from manure left on pasture','N(kg) per head from manure applied to soils','N2O(kg) per head from manure applied to soils','CO2eq(kg) per head from manure applied to soils'];
// pesticides
var pesticides_arg=['emUS','imUS','tonnes_ha'],pesticides_title=['millions(US dollar) export','millions(US dollar) import','tonnes per ha of pesticides use'],n_pesticides=pesticides_arg.length;
// production livestock primary and processed
var livestock_production_arg=['primary','processed'],n_livestock_production=livestock_production_arg.length,livestock_production_title=['tonnes of primary production','tonnes of processed production'];
// temperature change
var temperature_change_arg=['change','sd'],temperature_change_title=['temperature change','standard deviation'],n_temperature_change=temperature_change_arg.length;
var data_FAO,b_FAO=[];
var title_FAO=['annual'+'\xa0'+'population','crops'+'\xa0'+'average'+'\xa0'+'yield','crops'+'\xa0'+'livestock','environment'+'\xa0'+'emissions'+'\xa0'+'intensities','environment'+'\xa0'+'fertilizers','fertilizers'+'\xa0'+'nutrient','fertilizers'+'\xa0'+'nutrient'+'\xa0'+'agricultural'+'\xa0'+'use','food'+'\xa0'+'supply','forestry'+'\xa0'+'production','GHG','land'+'\xa0'+'use','livestock'+'\xa0'+'heads','livestock'+'\xa0'+'production','manure'+'\xa0'+'left'+'\xa0'+'on'+'\xa0'+'pasture'+'\xa0'+'and'+'\xa0'+'applied'+'\xa0'+'to'+'\xa0'+'soils','pesticides','rice'+'\xa0'+'and'+'\xa0'+'organic'+'\xa0'+'soils'+'\xa0'+'emissions'+'\xa0'+'intensities','temperature'+'\xa0'+'change'];
var id_FAO=['annual_population','crops_average_yield','crops_livestock','environment_emissions_intensities','environment_fertilizers','fertilizers_nutrient','fertilizers_nutrient_agricultural_use','food_supply','forestry_production','GHG','land_use','livestock_heads','livestock_production','manure_left_on_pasture_and_applied_to_soils','pesticides','rice_and_organic_soils_emissions_intensities','temperature_change'];
var n_FAO=title_FAO.length,n_FAO_i,FAO_title,max_FAO_i,I,a_FAO_i,FAO_width=3.0;
for(var i=0;i<n_FAO;i++) b_FAO[id_FAO[i]]=false;
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
// loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg',function(texture){
loader.load('./data/land_ocean_ice_cloud_2048.jpg',function(texture){
    var sphere=new THREE.SphereGeometry(radius,segments,rings);
    var material=new THREE.MeshBasicMaterial({map:texture,wireframe:false,overdraw:0.5});
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
    for(var y=2000;y<=max_year;y++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[(y-min_year)%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=y.toString();
	myButton.innerHTML=y.toString();
	myButton.style.fontSize='20px';
	document.getElementById('leftYear').appendChild(myButton);
	document.getElementById('leftYear').appendChild(document.createElement('br'));
	document.getElementById(y.toString()).addEventListener('click',change_year,false);
    }
    // FAO buttons
    for(var i=0;i<title_FAO.length;i++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color='white';
	myButton.style.cursor='pointer';
	myButton.id=id_FAO[i];
	myButton.innerHTML=title_FAO[i];
	myButton.style.fontSize='20px';
	document.getElementById('leftFAO').appendChild(myButton);
	document.getElementById('leftFAO').appendChild(document.createElement('br'));
    }
    document.getElementById('annual_population').addEventListener('click',annual_population,false);
    document.getElementById('crops_livestock').addEventListener('click',crops_livestock,false);
    document.getElementById('crops_average_yield').addEventListener('click',crops_average_yield,false);
    document.getElementById('environment_emissions_intensities').addEventListener('click',environment_emissions_intensities,false);
    document.getElementById('environment_fertilizers').addEventListener('click',environment_fertilizers,false);
    document.getElementById('fertilizers_nutrient').addEventListener('click',fertilizers_nutrient,false);
    document.getElementById('fertilizers_nutrient_agricultural_use').addEventListener('click',fertilizers_nutrient_agricultural_use,false);
    document.getElementById('food_supply').addEventListener('click',food_supply,false);
    document.getElementById('forestry_production').addEventListener('click',forestry_production,false);
    document.getElementById('GHG').addEventListener('click',GHG,false);
    document.getElementById('land_use').addEventListener('click',land_use,false);
    document.getElementById('livestock_heads').addEventListener('click',livestock_heads,false);
    document.getElementById('livestock_production').addEventListener('click',livestock_production,false);
    document.getElementById('manure_left_on_pasture_and_applied_to_soils').addEventListener('click',manure_left_on_pasture_and_applied_to_soils,false);
    document.getElementById('pesticides').addEventListener('click',pesticides,false);
    document.getElementById('rice_and_organic_soils_emissions_intensities').addEventListener('click',rice_and_organic_soils_emissions_intensities,false);
    document.getElementById('temperature_change').addEventListener('click',temperature_change,false);

    // calculating the number of links and the pileups that are non zero
    for(var w=0;w<n_words;w++){
	if(typeof data_json[words[w]]!='undefined'){
	    buffer_words.push(words[w]);
	    pairwize.push(data_json[words[w]]['links'].length);
	    pileups.push(data_json[words[w]]['pileups'].length);
	}else{
	    pairwize.push(0);
	    pileups.push(0);
	}
    }

    // temperature anomalies
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
	forest_coverage[data_json['forest_coverage'][i]['y']-min_year]+=data_json['forest_coverage'][i]['coverage'];
	n_forest_coverage[data_json['forest_coverage'][i]['y']-min_year]+=1;
    }
    for(var i=0;i<n_year;i++) forest_coverage[i]/=n_forest_coverage[i];
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year-min_year].toPrecision(3)).toString());
    // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json
    global_surface_ice=data_json['ice'];
    for(var i=0;i<global_surface_ice.length;i++){
	if(global_surface_ice[i]['y']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
    
    // making the countries (http://www.csgnetwork.com/llinfotable.html) SOUTH:- NORTH:+ and WEST:- EAST:+
    n_countries=Object.keys(data_json['country_index']).length;
    console.log(n_countries);
    console.log(n_countries*(n_countries-1)/2);
    console.log(pairwize);
    console.log(pileups);
    for(var i=0;i<0*n_countries;i++){
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

// making the FAO data you click for
function change_FAO(){
    if(i_word<0 && b_FAO[a_FAO_i]){
	document.getElementById('YEAR').innerHTML=year.toString();
	document.getElementById('WORD').innerHTML='';
	data_FAO=data_json[a_FAO_i];
	max_FAO_i=[];
	for(var j=0;j<n_FAO_i;j++){
	    max_FAO_i.push(0.0);
	    for(var i=0;i<data_FAO.length;i++){
		if(data_FAO[i]['y']===year){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null) max_FAO_i[j]=Math.max(max_FAO_i[j],data_FAO[i][FAO_arg[j]]);
		}
	    }
	}
	I=0;
	for(var j=1;j<n_FAO_i;j++){
	    if(max_FAO_i[j]>max_FAO_i[I]) I=j;
	}
	for(var j=0;j<n_FAO_i;j++) max_FAO_i[j]=max_FAO_i[I];
	if(b_FAO['food_supply']){
	    data_FAO=data_json[a_FAO_i];
	    max_FAO_i=[];
	    for(var j=0;j<n_FAO_i;j++){
		max_FAO_i.push(0.0);
		for(var i=0;i<data_FAO.length;i++){
		    if(data_FAO[i]['y']===year){
			if(data_json['country_index'][data_FAO[i]['id']]!=null) max_FAO_i[j]=Math.max(max_FAO_i[j],data_FAO[i][FAO_arg[j]]);
		    }
		}
	    }
	    max_FAO_i[2]=max_FAO_i[1];
	}
	if(b_FAO['annual_population']){
	    data_FAO=data_json[a_FAO_i];
	    max_FAO_i=[];
	    for(var j=0;j<n_FAO_i;j++){
		max_FAO_i.push(0.0);
		for(var i=0;i<data_FAO.length;i++){
		    if(data_json['country_index'][data_FAO[i]['id']]!=null){
			max_FAO_i[j]=Math.max(max_FAO_i[j],data_FAO[i][FAO_arg[j]]);
		    }
		}
	    }
	}
	if(b_FAO['pesticides']){
	    data_FAO=data_json[a_FAO_i];
	    max_FAO_i=[];
	    for(var j=0;j<n_FAO_i;j++){
		max_FAO_i.push(0.0);
		for(var i=0;i<data_FAO.length;i++){
		    if(data_FAO[i]['y']===year){
			if(data_json['country_index'][data_FAO[i]['id']]!=null){
			    if(FAO_arg[j]=='import' || FAO_arg[j]=='export') max_FAO_i[0]=Math.max(max_FAO_i[0],data_FAO[i][FAO_arg[j]]);
			    else max_FAO_i[j]=Math.max(max_FAO_i[j],data_FAO[i][FAO_arg[j]]);
			}
		    }
		}
	    }
	    max_FAO_i[1]=max_FAO_i[0];
	}
	inc=0;
	group_length=group_pileups.children.length;
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['y']===year){
		if(data_json['country_index'][data_FAO[i]['id']]!=null){
		    source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		    LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		    LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		    for(var j=0;j<n_FAO_i;j++){
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
			pt.multiplyScalar(((n_FAO_i-1.0)/2.0-j)*2.0*FAO_width);
			u.copy(vS[inc]);
			vS[inc].multiplyScalar(radius);
			vS[inc].add(pt);
			cylinder_height=data_FAO[i][FAO_arg[j]]*radius/max_FAO_i[j];
			if(inc>=group_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length+=1;
			    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_width,FAO_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
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
			group_pileups.children[inc].name=source['id']+' : '+((data_FAO[i][FAO_arg[j]].toPrecision(3)).toString())+' '+FAO_title[j];
			group_pileups.children[inc].userData=source['id'];
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
	    group_pileups.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_width,FAO_width,cylinder_height,32),new THREE.MeshBasicMaterial({color:'white',opacity:0.5})));
	    group_length+=1;
	}else{
	    group_pileups.children[i].scale.set(1.0,cylinder_height/cylinder_heights[i],1.0);
	    // group_pileups.children[i].geometry=new THREE.CylinderGeometry(FAO_width,FAO_width,cylinder_height,32);
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
	text_buffer='';
	source=intersects[0].object.userData;
	// look for all the data associated with the country source
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['y']===year){
		if(data_json['LL'][data_json['country_index'][data_FAO[i]['id']]]['id']==source){
		    for(var j=0;j<n_FAO_i;j++){
			text_buffer=text_buffer.concat(source+' : '+((data_FAO[i][FAO_arg[j]].toPrecision(3)).toString())+' '+FAO_title[j]);
			text_buffer=text_buffer.concat('<br>');
		    }
		}
	    }
	}
	// text_buffer.fontcolor(Math.random()*0xffffff);
	text=text.concat(text_buffer,'<br>');
    }
    intersects=raycaster.intersectObjects(group_links.children);
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
    if(e.clientX>(.1*window.innerWidth) && e.clientX<(.9*window.innerWidth)){
	camera.position.set(camera.position.x,camera.position.y,camera.position.z-Math.sign(camera.position.z)*e.wheelDelta);
	camera.lookAt(new THREE.Vector3(0,0,0));
    }
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
	if(global_surface_ice[i]['y']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
    }
    list_pileups_year();
    list_pairwize_year();
    change();
};

// change data
function change(){
    initializing_description();
    list_pileups_year();
    list_pairwize_year();
    change_links();
    change_FAO();
};

// draw the annual population
function annual_population(){
    a_FAO_i='annual_population';
    initializing_change();
    change();
};

// draw the food trade import/export on click
function crops_livestock(){
    a_FAO_i='crops_livestock';
    initializing_change();
    change();
};

// draw the average yield crops production
function crops_average_yield(){
    a_FAO_i='crops_average_yield';
    initializing_change();
    change();
};

// draw the environment emissions intensities
function environment_emissions_intensities(){
    a_FAO_i='environment_emissions_intensities';
    initializing_change();
    change();
};

// draw the rice_and_organic_soils_emissions_intensities
function rice_and_organic_soils_emissions_intensities(){
    a_FAO_i='rice_and_organic_soils_emissions_intensities';
    initializing_change();
    change();
};

// draw the environment fertilizers
function environment_fertilizers(){
    a_FAO_i='environment_fertilizers';
    initializing_change();
    change();
};

// draw the fertilizers nutrient
function fertilizers_nutrient(){
    a_FAO_i='fertilizers_nutrient';
    initializing_change();
    change();
};

// draw the fertilizers nutrient agricultural use
function fertilizers_nutrient_agricultural_use(){
    a_FAO_i='fertilizers_nutrient_agricultural_use';
    initializing_change();
    change();
};

// draw the food supply
function food_supply(){
    a_FAO_i='food_supply';
    initializing_change();
    change();
};

// draw the forestry production
function forestry_production(){
    a_FAO_i='forestry_production';
    initializing_change();
    change();
};

// draw the nitrous oxide and methane emissions
function GHG(){
    a_FAO_i='GHG';
    initializing_change();
    change();
};

// draw the land use
function land_use(){
    a_FAO_i='land_use';
    initializing_change();
    change();
};

// draw the livestock heads
function livestock_heads(){
    a_FAO_i='livestock_heads';
    initializing_change();
    change();
};

// draw the livestock production
function livestock_production(){
    a_FAO_i='livestock_production';
    initializing_change();
    change();
};

// draw the manure left on pasture and applied to soils
function manure_left_on_pasture_and_applied_to_soils(){
    a_FAO_i='manure_left_on_pasture_and_applied_to_soils';
    initializing_change();
    change();
};

// draw the pesticides import/export/use
function pesticides(){
    a_FAO_i='pesticides';
    initializing_change();
    change();
};

// draw the temperature change
function temperature_change(){
    a_FAO_i='temperature_change';
    initializing_change();
    change();
};

// initializing change
function initializing_change(){
    i_word=-1;
    word='';
    for(var i=0;i<n_FAO;i++) b_FAO[id_FAO[i]]=(id_FAO[i]==a_FAO_i);
    console.log(a_FAO_i);
    console.log(b_FAO[a_FAO_i]);
    console.log(b_FAO);
};

// initializing description
function initializing_description(){
    description='# publications*mean(2010-2018)/publications('+(year.toString())+') :';
    if(b_FAO['annual_population']){
	description='annual population (female, male, rural and urban), FAO ('+(year.toString())+') :';
	n_FAO_i=n_annual_population;
	FAO_arg=annual_population_arg;
	FAO_title=annual_population_title;
    }
    if(b_FAO['crops_livestock']){
	description='crops livestock, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_livestock;
	FAO_arg=crops_livestock_arg;
	FAO_title=crops_livestock_title;
    }
    if(b_FAO['crops_average_yield']){
	description='crops_average yield, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_average_yield;
	FAO_arg=crops_average_yield_arg;
	FAO_title=crops_average_yield_title;
    }
    if(b_FAO['environment_emissions_intensities']){
	description='ratio production CO2 emissions, FAO ('+(year.toString())+') :';
	n_FAO_i=n_environment_emissions_intensities;
	FAO_arg=environment_emissions_intensities_arg;
	FAO_title=environment_emissions_intensities_title;
    }
    if(b_FAO['environment_fertilizers']){
	description='fertilizers tonnes per ha of cropland, FAO ('+(year.toString())+') :';
	n_FAO_i=n_environment_fertilizers;
	FAO_arg=environment_fertilizers_arg;
	FAO_title=environment_fertilizers_title;
    }
    if(b_FAO['fertilizers_nutrient']){
	description='fertilizers nutrient, FAO ('+(year.toString())+') :';
	n_FAO_i=n_fertilizers_nutrient;
	FAO_arg=fertilizers_nutrient_arg;
	FAO_title=fertilizers_nutrient_title;
    }
    if(b_FAO['fertilizers_nutrient_agricultural_use']){
	description='fertilizers nutrient agricultural use, FAO ('+(year.toString())+') :';
	n_FAO_i=n_fertilizers_nutrient_agricultural_use;
	FAO_arg=fertilizers_nutrient_agricultural_use_arg;
	FAO_title=fertilizers_nutrient_agricultural_use_title;
    }
    if(b_FAO['food_supply']){
	description='kcal(or g)/capita/day, FAO ('+(year.toString())+') :';
	n_FAO_i=n_food_supply;
	FAO_arg=food_supply_arg;
	FAO_title=food_supply_title;
    }
    if(b_FAO['forestry_production']){
	description='import/export in millions of US dollar, FAO ('+(year.toString())+') :';
	n_FAO_i=n_forestry_production;
	FAO_arg=forestry_production_arg;
	FAO_title=forestry_production_title;
    }
    if(b_FAO['GHG']){
	description='GHG from agricultural land, FAO ('+(year.toString())+') :';
	n_FAO_i=n_GHG;
	FAO_arg=GHG_arg;
	FAO_title=GHG_title;
    }
    if(b_FAO['land_use']){
	description='land use, FAO ('+(year.toString())+') :';
	n_FAO_i=n_land_use;
	FAO_arg=land_use_arg;
	FAO_title=land_use_title;
    }
    if(b_FAO['livestock_heads']){
	description='livestock heads, FAO ('+(year.toString())+') :';
	n_FAO_i=n_livestock_heads;
	FAO_arg=livestock_heads_arg;
	FAO_title=livestock_heads_title;
    }
    if(b_FAO['livestock_production']){
	description='livestock primary and processed production, FAO ('+(year.toString())+') :';
	n_FAO_i=n_livestock_production;
	FAO_arg=livestock_production_arg;
	FAO_title=livestock_production_title;
    }
    if(b_FAO['manure_left_on_pasture_and_applied_to_soils']){
	description='manure left on pasture and applied to soils, FAO ('+(year.toString())+') :';
	n_FAO_i=n_manure;
	FAO_arg=manure_arg;
	FAO_title=manure_title;
    }
    if(b_FAO['pesticides']){
	description='pesticides, FAO ('+(year.toString())+') :';
	n_FAO_i=n_pesticides;
	FAO_arg=pesticides_arg;
	FAO_title=pesticides_title;
    }
    if(b_FAO['rice_and_organic_soils_emissions_intensities']){
	description='rice and cultivated organic soils CO2(in tonnes) production per ha, FAO ('+(year.toString())+') :';
	n_FAO_i=n_rice_and_organic_soils_emissions_intensities;
	FAO_arg=rice_and_organic_soils_emissions_intensities_arg;
	FAO_title=rice_and_organic_soils_emissions_intensities_title;
    }
    if(b_FAO['temperature_change']){
	description='temperature change, standard deviation, FAO ('+(year.toString())+') :';
	n_FAO_i=n_temperature_change;
	FAO_arg=temperature_change_arg;
	FAO_title=temperature_change_title;
    }
    buffer_int=document.getElementById('legend').children.length;
    for(var i=(buffer_int-1);i>=0;i--) document.getElementById('legend').removeChild(document.getElementById('legend').children[i]);
    for(var i=0;i<n_FAO_i;i++){
	if(i<document.getElementById('legend').children.length){
	    document.getElementById('legend').children[i].style.color=colors2[i];
	    document.getElementById('legend').children[i].innerHTML=FAO_title[i]+'<br>';
	}else{
	    label=document.createElement('span');
	    label.style.color=colors2[i];
	    label.innerHTML=FAO_title[i]+'<br>';
	    // myButton.style.fontSize='20px';
	    document.getElementById('legend').appendChild(label);
	}
    }
    text=description.concat('<br>');
    document.getElementById('pileups').innerHTML=text;
};

// highlighting a keyword on mouse click
function highlight(e){
    for(var i=0;i<n_FAO;i++) b_FAO[id_FAO[i]]=false;
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
