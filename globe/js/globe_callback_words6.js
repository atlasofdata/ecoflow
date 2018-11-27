// https://github.com/theatlasofdata/ecoflow
// https://theatlasofdata.earth
// http://www.csgnetwork.com/llinfotable.html SOUTH:- NORTH:+ and WEST:- EAST:+
// https://theatlasofdata.github.io/ecoflow

console.clear();

// make variables
var count=[],delta_count=[],nt=new THREE.Vector3(),pt=new THREE.Vector3(),u=new THREE.Vector3(),radial=new THREE.Vector3(),radial_n,radial_b,l_radial=new THREE.Vector3(),l_radial_n,l_radial_b,n_points=100,f_points=10,pairwize=[],pileups=[];
var PreviousMouseX=0.0,PreviousMouseY=0.0,DraggingMouse=false;
const ZoomSensitivity=0.0001;
var thetaX=0.0,thetaY=0.0;
var vS=[],vT=[],vS_length,vT_length,mST=[],mST_length,cvS_length,cvT_length,cvS=[],cvT=[],geometry,material,weight0=20.0,source=0,target=0,inc,inc_ball,inc_cube;
var paths=new THREE.CurvePath();
const segments0=16,rings0=16;
var min_year=1990,max_year=2018,n_year=max_year-min_year+1,year=2014,country='',countries,n_countries,country_index,index_country,theta,bn=[],bn_length;
var loader_font=new THREE.FontLoader();
var continent_1='all',continent_2='all',country,country_color=[],publications=[],mean_publications=0,plower_bound=0,lower_value,values;
var rC=new THREE.Vector3(),LATi=0.0,LONi=0.0,index;
var i_word,word,n_words,words=[],text='';
var n_forests,forest_coverage,volumes=[],volume,volumes_length;
var myButton,myButtonFontSize='10px';
var data_json,data_json_w,data_json_trade,data_json_trade_i,data_json_trade_i_j,pairwize_year=[],n_pairwize_year=0,pileups_year=[],n_pileups_year=0,n_pileups=0,n_links=0,n_balls=0,n_cubes=0,ball_mesh=[],cube_mesh=[],max_pileups,max_trade=0.0,ii,n_curves,n_count;
var cylinder_height,cylinder_heights=[],cylinder_heights_length,nom,detail,ok;
// --- variables : FAO data
// annual production
var annual_population_arg=['total','urban_rural','female_male'],annual_population_title=['millions of persons','ratio urban/rural','ratio female/male'],n_annual_population=annual_population_arg.length
// burning crop residues
var burning_crop_residues_arg=['r_mCO2eq','r_rCO2eq','r_sCO2eq','r_wCO2eq','burning_savana_CO2eq_to_tonnes','burning_humid_tropical_forest_CO2eq_to_tonnes','burning_other_forest_CO2eq_to_tonnes','burning_organic_soils_CO2eq_to_tonnes'],burning_crop_residues_title=['CO2(eq) emissions to burning maize dry matter','CO2(eq) emissions to burning rice dry matter','CO2(eq) emissions to burning sugar cane dry matter','CO2(eq) emissions to burning wheat dry matter','CO2(eq) emissions to burning savana','CO2(eq) emissions to burning humid tropical forest','CO2(eq) emissions to burning other forest','CO2(eq) emissions to burning organic soils'],n_burning_crop_residues=burning_crop_residues_arg.length;
// crops average yield
var crops_average_yield_arg=['VP_t_ha','FP_t_ha','cereals_t_ha','sugar_t_ha'],n_crops_average_yield=crops_average_yield_arg.length,crops_average_yield_title=['vegetables primary average yield in tonnes per ha','fruits primary average yield in tonnes per ha','cereals average yield in tonnes per ha','sugar(beet and can) average yield in tonnes per ha'];
// crops livestock
var crops_livestock_arg=['ibUS','ebUS','p_ibUS','p_ebUS','f_ibUS','f_ebUS'],n_crops_livestock=crops_livestock_arg.length,crops_livestock_title=['billions(US dollar) import of crops and livestock','billions(US dollar) export of crops and livestock','billions(US dollar) import of pesticides','billions(US dollar) export of pesticides','billions(US dollar) import of fertilizers','billions(US dollar) export of fertilizers'];
// crops processed
var crops_processed_arg=['tonnes','tonnes_processed'],n_crops_processed=crops_processed_arg.length,crops_processed_title=['tonnes of crops production','tonnes of crops processed'];
// emissions intensities : eggs, meat, milk and rice
var environment_emissions_intensities_arg=['eggs','meat','milk','rice'],environment_emissions_intensities_title=['eggs, hen in shell production/CO2','meat production/CO2','milk production/CO2','rice production/CO2'],n_environment_emissions_intensities=environment_emissions_intensities_arg.length;
// emissions intensities : rice production and organic soils
var rice_and_organic_soils_emissions_intensities_arg=['rCO2','oCO2'],rice_and_organic_soils_emissions_intensities_title=['rice CO2(in tonnes) per ha','cultivated organic soils CO2(in tonnes) per ha'],n_rice_and_organic_soils_emissions_intensities=rice_and_organic_soils_emissions_intensities_arg.length;
// environment fertilizers
var environment_fertilizers_arg=['N','P2O5','K2O'],environment_fertilizers_title=['N tonnes per ha of cropland','P2O5 tonnes per ha of cropland','K2O tonnes per ha of cropland'],n_environment_fertilizers=environment_fertilizers_arg.length;
// enteric fermentation
var enteric_fermentation_arg=['CO2eq'],enteric_fermentation_title=['C02eq(kg per head) emission from enteric fermentation'],n_enteric_fermentation=enteric_fermentation_arg.length;
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
var land_use_arg=['land_country','agricultural_country','organic_country','organic_conversion_country'],land_use_title=['ratio land/country %','agricultural country %','organic(certified) country %','organic(conversion) country %'],n_land_use=land_use_arg.length;
// irrigation
var irrigation_arg=['equiped_for_irrigation','actually_irrigated'],irrigation_title=['agricultural area equiped for irrigation %','agricultural area actually irrigated %'],n_irrigation=irrigation_arg.length;
// livestock heads
var livestock_heads_arg=['heads','sheads'],n_livestock_heads=livestock_heads_arg.length,livestock_heads_title=[' livestock heads',' slaughtered animals'];
// livestock manure
var livestock_manure_arg=['N','pN','tN','sN'],n_livestock_manure=livestock_manure_arg.length,livestock_manure_title=['N content(kg per head) from manure','N content(kg per head) from manure left to pasture','treated N content(kg per head) from manure','N content(kg per head) from manure applied to soils'];
// livestock primary and processed production
var livestock_production_arg=['primary','primary_indigenous','processed'],n_livestock_production=livestock_production_arg.length,livestock_production_title=['tonnes of primary production','tonnes of primary indigenous production','tonnes of processed production'];
// manure
var manure_arg=['pN','pN2O','pCO2','sN','sN2O','sCO2'],n_manure=manure_arg.length,manure_title=['N(kg per head) from manure left on pasture','N2O(kg per head) from manure left on pasture','CO2eq(kg per head) from manure left on pasture','N(kg per head) from manure applied to soils','N2O(kg) per head from manure applied to soils','CO2eq(kg) per head from manure applied to soils'];
// pesticides
var pesticides_arg=['ibUS','ebUS','f_ibUS','f_ebUS','tonnes_ha'],pesticides_title=['billions(US dollar) import of pesticides','billions(US dollar) export of pesticides','billions(US dollar) import of fertilizers','billions(US dollar) export of fertilizers','tonnes per ha of pesticides use'],n_pesticides=pesticides_arg.length;
// temperature change
var temperature_change_arg=['change','sd'],temperature_change_title=['temperature change','standard deviation'],n_temperature_change=temperature_change_arg.length;
var data_FAO,b_FAO=[];
var title_FAO=['annual'+'\xa0'+'population','burning'+'\xa0'+'crop'+'\xa0'+'residues','crops'+'\xa0'+'average'+'\xa0'+'yield','crops'+'\xa0'+'livestock','crops'+'\xa0'+'processed','enteric'+'\xa0'+'fermentation','environment'+'\xa0'+'emissions'+'\xa0'+'intensities','environment'+'\xa0'+'fertilizers','fertilizers'+'\xa0'+'nutrient','fertilizers'+'\xa0'+'nutrient'+'\xa0'+'agricultural'+'\xa0'+'use','food'+'\xa0'+'supply','forestry'+'\xa0'+'production','GHG','irrigation','land'+'\xa0'+'use','livestock'+'\xa0'+'heads','livestock'+'\xa0'+'manure','livestock'+'\xa0'+'production','manure'+'\xa0'+'left'+'\xa0'+'on'+'\xa0'+'pasture'+'\xa0'+'and'+'\xa0'+'applied'+'\xa0'+'to'+'\xa0'+'soils','pesticides','rice'+'\xa0'+'and'+'\xa0'+'organic'+'\xa0'+'soils'+'\xa0'+'emissions'+'\xa0'+'intensities','temperature'+'\xa0'+'change'];
var id_FAO=['annual_population','burning_crop_residues','crops_average_yield','crops_livestock','crops_processed','enteric_fermentation','environment_emissions_intensities','environment_fertilizers','fertilizers_nutrient','fertilizers_nutrient_agricultural_use','food_supply','forestry_production','GHG','irrigation','land_use','livestock_heads','livestock_manure','livestock_production','manure_left_on_pasture_and_applied_to_soils','pesticides','rice_and_organic_soils_emissions_intensities','temperature_change'];
var n_FAO=title_FAO.length,n_FAO_i,FAO_title,max_FAO_i,I,a_FAO_i='',FAO_radius=5.0;
for(var i=0;i<n_FAO;i++) b_FAO[id_FAO[i]]=false;
var label,buffer_int;
// --- variables : trade from FAO database
var title_FAO_trade=['chicken'+'\xa0'+'meat'+'\xa0'+'trade','eggs'+'\xa0'+'trade','maize'+'\xa0'+'trade','pig'+'\xa0'+'meat'+'\xa0'+'trade','rice'+'\xa0'+'trade','sugar'+'\xa0'+'trade'];
var id_FAO_trade=['chicken_meat_trade','eggs_trade','maize_trade','pig_meat_trade','rice_trade','sugar_trade'];
var b_FAO_trade=[],i_FAO_trade='',arg_trade=['etonnes','itonnes'];
for(var i in id_FAO_trade) b_FAO_trade[i]=false;
var import_i,export_i,max_ie;
const radius=200,segments=128,rings=128;
var phong=true,lambert=false,standard=false;
var continents=['all','africa','america','asia','europa'];
var mouse2D=new THREE.Vector2(0.0,0.0);
var raycaster=new THREE.Raycaster(),intersects,ifIntersect,INTERSECTED;
var ifBoundingBox=false,BoundingBox;
var popup;

initializing_description();

var colors=["#6666ff","#d98c8c","#66ff66","#ff66a3","#66ccff","#ffc266","#996600","#ffb366","#8585e0","#ff66ff","#a3a3c2","#ff8c66","#b366ff","#006699","#cc99ff","#669900","#ccccff","#ff5050","#9933ff","#33cc33","#0099cc"];
var n_colors=colors.length;
var colors2=['purple','orange','violet','cyan','green','yellow','red','maroon','pink','blue','gray','white']

// make scene
var scene=new THREE.Scene();
// scene.background=new THREE.Color(0x000000);
scene.background=new THREE.Color('gray');
// make camera
var Xcamera=0.0;
var Ycamera=0.0;
var Zcamera=800.0;
var Rcamera=Math.sqrt(Xcamera*Xcamera+Ycamera*Ycamera+Zcamera*Zcamera);
var camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
// var camera=new THREE.OrthographicCamera(-window.innerwidth/2,window.innerwidth/2,window.innerheight/2,-window.innerheight/2,1,1000);
camera.position.set(Xcamera,Ycamera,Zcamera);
camera.lookAt(new THREE.Vector3(0.0,0.0,0.0));
camera.updateProjectionMatrix();
camera.updateMatrixWorld();
radial.copy(camera.position).normalize();
radial_n=new THREE.Vector3(1.0,0.0,0.0);
radial_b=new THREE.Vector3(0.0,1.0,0.0);
scene.add(camera);
// make light
l_radial.copy(camera.position).normalize();
l_radial_n=new THREE.Vector3(1.0,0.0,0.0);
l_radial_b=new THREE.Vector3(0.0,1.0,0.0);
l_radial.applyAxisAngle(radial_b,0.1*Math.PI);
l_radial_n.applyAxisAngle(radial_b,0.1*Math.PI);
l_radial_b.applyAxisAngle(radial_b,0.1*Math.PI);
l_radial.applyAxisAngle(radial_n,-0.3*Math.PI);
l_radial_b.applyAxisAngle(radial_n,-0.3*Math.PI);
var LightR=2.0*Rcamera;
var Light;
if(true){
    Light=new THREE.DirectionalLight(0xffffff,1);
    Light.castShadow=true;
    Light.receiveShadow=false;
    Light.shadow.mapSize.width=window.innerWidth;
    Light.shadow.mapSize.height=window.innerHeight;
    Light.intensity=1.5;
    // var lightHelper=new THREE.DirectionalLightHelper(Light);
}else{
    Light=new THREE.SpotLight(0xffffff);
    Light.penumbra=0.05;
    Light.decay=2;
    Light.intensity=5.0;
    Light.shadow.mapSize.width=window.innerWidth;
    Light.shadow.mapSize.height=window.innerHeight;
    Light.castShadow=true;
    // var lightHelper=new THREE.SpotLightHelper(Light);
}
// scene.add(lightHelper);
Light.position.set(LightR*l_radial.x,LightR*l_radial.y,LightR*l_radial.z);
Light.distance=LightR;
Light.lookAt(0.0,0.0,0.0);
scene.add(Light);
// scene.add(new THREE.AmbientLight(0xffffff,0.1));
// make render
var container=document.getElementById('container');
var renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMapSoft=true;
renderer.shadowMapWidth=window.innerWidth;
renderer.shadowMapHeight=window.innerHeight;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.shadowCameraFar=camera.far;
renderer.shadowCameraFov=camera.fov;
container.appendChild(renderer.domElement);
// make globe (loading the world map texture)
var loader=new THREE.TextureLoader();
loader.crossOrigin="";
// loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_world_map.svg/2000px-Simple_world_map.svg.png',function(texture){
// loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg',function(texture){
loader.load('./data/land_ocean_ice_cloud_2048.jpg',function(texture){
    var material,mesh;
    if(lambert) material=new THREE.MeshLambertMaterial({map:texture,wireframe:false,overdraw:0.5});
    if(phong) material=new THREE.MeshPhongMaterial({map:texture,wireframe:false,overdraw:0.5});
    if(standard) material=new THREE.MeshStandardMaterial({map:texture,wireframe:false,overdraw:0.5});
    material=new THREE.MeshLambertMaterial({map:texture,wireframe:false,overdraw:0.5});
    mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,segments,rings),material);
    mesh.material.needUpdate=true;
    mesh.material.needsUpdate=true;
    mesh.castShadow=false;
    mesh.receiveShadow=true;
    mesh.dynamic=true;
    mesh.position.set(0,0,0);
    mesh.name='globe';
    mesh.position.set(0,0,0);
    scene.add(mesh);
},function(error){console.log(error);});

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
    document.getElementById('publications').innerHTML='# publications : '.concat(data_json['publications'][year.toString()].toString());
    
    // reading the keywords
    n_words=data_json['n_keywords'];
    for(var i=0;i<n_words;i++) words.push(data_json['i_keywords'][i.toString()]);
    for(var i=0;i<n_words;i++){
	word=words[i];
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color=colors[i%n_colors];
	myButton.style.cursor='pointer';
	myButton.id=word;
	myButton.innerHTML=word.replace(/_/g,'\xa0');
	myButton.style.fontSize='20px';
	document.getElementById('keywords').appendChild(myButton);
	document.getElementById('keywords').appendChild(document.createElement('br'));
	document.getElementById(word).addEventListener('click',highlight,false);
    }
    i_word=data_json['keywords_i']['climate'];
    word=words[i_word];
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
	myButton.innerHTML=title_FAO[i].replace(/_/g,'\xa0');
	myButton.style.fontSize='20px';
	document.getElementById('leftFAO').appendChild(myButton);
	document.getElementById('leftFAO').appendChild(document.createElement('br'));
	// document.getElementById(id_FAO[i]).addEventListener('click',window[id_FAO[i]](),false);
    }
    document.getElementById('annual_population').addEventListener('click',annual_population,false);
    document.getElementById('burning_crop_residues').addEventListener('click',burning_crop_residues,false);
    document.getElementById('crops_average_yield').addEventListener('click',crops_average_yield,false);
    document.getElementById('crops_livestock').addEventListener('click',crops_livestock,false);
    document.getElementById('crops_processed').addEventListener('click',crops_processed,false);
    document.getElementById('enteric_fermentation').addEventListener('click',enteric_fermentation,false);
    document.getElementById('environment_emissions_intensities').addEventListener('click',environment_emissions_intensities,false);
    document.getElementById('environment_fertilizers').addEventListener('click',environment_fertilizers,false);
    document.getElementById('fertilizers_nutrient').addEventListener('click',fertilizers_nutrient,false);
    document.getElementById('fertilizers_nutrient_agricultural_use').addEventListener('click',fertilizers_nutrient_agricultural_use,false);
    document.getElementById('food_supply').addEventListener('click',food_supply,false);
    document.getElementById('forestry_production').addEventListener('click',forestry_production,false);
    document.getElementById('GHG').addEventListener('click',GHG,false);
    document.getElementById('irrigation').addEventListener('click',irrigation,false);
    document.getElementById('land_use').addEventListener('click',land_use,false);
    document.getElementById('livestock_heads').addEventListener('click',livestock_heads,false);
    document.getElementById('livestock_manure').addEventListener('click',livestock_manure,false);
    document.getElementById('livestock_production').addEventListener('click',livestock_production,false);
    document.getElementById('manure_left_on_pasture_and_applied_to_soils').addEventListener('click',manure_left_on_pasture_and_applied_to_soils,false);
    document.getElementById('pesticides').addEventListener('click',pesticides,false);
    document.getElementById('rice_and_organic_soils_emissions_intensities').addEventListener('click',rice_and_organic_soils_emissions_intensities,false);
    document.getElementById('temperature_change').addEventListener('click',temperature_change,false);
    // Trade buttons
    for(var i=0;i<title_FAO_trade.length;i++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color='white';
	myButton.style.cursor='pointer';
	myButton.id=id_FAO_trade[i];
	myButton.innerHTML=title_FAO_trade[i];
	myButton.style.fontSize='20px';
	document.getElementById('leftFAO').appendChild(myButton);
	document.getElementById('leftFAO').appendChild(document.createElement('br'));
    }
    document.getElementById('chicken_meat_trade').addEventListener('click',chicken_meat_FAO_trade,false);
    document.getElementById('eggs_trade').addEventListener('click',eggs_FAO_trade,false);
    document.getElementById('maize_trade').addEventListener('click',maize_FAO_trade,false);
    document.getElementById('pig_meat_trade').addEventListener('click',pig_meat_FAO_trade,false);
    document.getElementById('rice_trade').addEventListener('click',rice_FAO_trade,false);
    document.getElementById('sugar_trade').addEventListener('click',sugar_FAO_trade,false);
    // Continent buttons
    for(var i=0;i<continents.length;i++){
	for(var j=i;j<continents.length;j++){
	    if((i===0 && j===0) || i>0){
		myButton=document.createElement('span');
		myButton.className='button';
		myButton.style.color='black';
		myButton.style.cursor='pointer';
		myButton.id=continents[i]+'_'+continents[j];
		myButton.innerHTML=continents[i]+'\xa0'+continents[j];
		myButton.style.fontSize='20px';
		document.getElementById('leftContinent').appendChild(myButton);
		document.getElementById('leftContinent').appendChild(document.createElement('br'));
		document.getElementById(myButton.id).addEventListener('click',change_continents,false);
	    }
	}
    }
    // list of the available countries
    n_countries=Object.keys(data_json['country_index']).length;
    countries=[];
    for(var i=0;i<n_countries;i++) countries.push(data_json['index_country'][i.toString()]);
    // console.log(countries);
    country_index=[];
    for(var i=0;i<n_countries;i++) country_index[countries[i]]=i;
    // console.log(country_index);
    index_country=[];
    for(var i=0;i<n_countries;i++) index_country[i]=countries[i];
    // console.log(index_country);
    // Countries buttons
    for(var i=-1;i<countries.length;i++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color='cyan';
	myButton.style.cursor='pointer';
	if(i===-1){
	    myButton.id='all';
	    myButton.innerHTML='all';
	}else{
	    myButton.id=countries[i];
	    myButton.innerHTML=countries[i];
	}
	myButton.style.fontSize='20px';
	document.getElementById('leftCountry').appendChild(myButton);
	document.getElementById('leftCountry').appendChild(document.createElement('br'));
	document.getElementById(myButton.id).addEventListener('click',change_country,false);
    }
    // Percentages buttons
    for(var i=0;i<20;i++){
	myButton=document.createElement('span');
	myButton.className='button';
	myButton.style.color='pink';
	myButton.style.cursor='pointer';
	myButton.id='p'+(i*5).toString();
	myButton.innerHTML=(i*5).toString();
	myButton.style.fontSize='20px';
	document.getElementById('leftPercentage').appendChild(myButton);
	document.getElementById('leftPercentage').appendChild(document.createElement('br'));
	document.getElementById(myButton.id).addEventListener('click',change_percentage,false);
    }

    // calculating the number of links and the pileups that are non zero
    for(var w=0;w<n_words;w++){
	if(typeof data_json[words[w]]!='undefined'){
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
    // forest coverage
    forest_coverage=data_json['forest_coverage'];
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year.toString()].toPrecision(3)).toString());
    // https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json
    global_surface_ice=data_json['ice_coverage'];
    document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[year.toString()].toPrecision(3)).toString(),' million of km2');

    max_pileups=0.0;
    for(var i=0;i<n_words;i++){
	for(var j=0;j<pairwize[i];j++) data_json[words[i]]['links'][j]['value']*=data_json['publications']['2017']/data_json['publications'][year.toString()];
	for(var j=0;j<pileups[i];j++){
	    data_json[words[i]]['pileups'][j]['value']*=data_json['publications']['2017']/data_json['publications'][year.toString()];
	    max_pileups=Math.max(max_pileups,data_json[words[i]]['pileups'][j]['value']);
	}
    }

    data_json_w=data_json[word];
    
    list_pileups_pairwize_year();
    change_FAO();
    change_FAO_trade();
    change_pubmed();
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    update();
};// Ending readJSON

document.addEventListener('mousemove',RotateOnMouseMove);
document.addEventListener('mousemove',OnMouseMove);
document.addEventListener('mousedown',OnMouseDown);
document.addEventListener('mouseup',OnMouseUp);
document.addEventListener('mousewheel',ZoomOnMouseWheel);

// making the FAO data you click for
function change_FAO(){
    if(i_word===-1 && b_FAO[a_FAO_i]){
	console.log('change_FAO');
	// clean the links
	for(var i=0;i<n_links;i++) scene.remove(scene.getObjectByName('link'+(i.toString())));
	// clean the moving meshes
	for(var i=0;i<n_balls;i++) scene.remove(scene.getObjectByName('ball'+(i.toString())));
	for(var i=0;i<n_cubes;i++) scene.remove(scene.getObjectByName('cube'+(i.toString())));
	// new FAO data (no trade ones)
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
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	for(var i=0;i<data_FAO.length;i++){
	    if(data_FAO[i]['y']===year){
		source=data_json['LL'][data_json['country_index'][data_FAO[i]['id']]];
		LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		sqrt_n_FAO_i=0;
		while((sqrt_n_FAO_i*sqrt_n_FAO_i)<n_FAO_i) sqrt_n_FAO_i++;
		ok=false;
		for(var j=0;j<n_FAO_i;j++){
		    cylinder_height=data_FAO[i][FAO_arg[j]]*radius/max_FAO_i[j];
		    if(cylinder_height>0.0){
			if(inc<vS_length){
			    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
			    vS[inc].setY(Math.cos(LATi));
			    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
			}else{
			    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
			    vS_length++;
			}
			u.copy(vS[inc]);
			u.multiplyScalar(0.5*cylinder_height);
			vS[inc].multiplyScalar(radius);
			if(!ok){
			    nt.setX(Math.cos(LATi)*Math.sin(LONi));
			    nt.setY(-Math.sin(LATi));
			    nt.setZ(Math.cos(LATi)*Math.cos(LONi));
			    pt.setX(Math.cos(LONi));
			    pt.setY(0.0);
			    pt.setZ(-Math.sin(LONi));
			    ok=true;
			}
			if(inc>=cylinder_heights_length){
			    cylinder_heights.push(cylinder_height);
			    cylinder_heights_length++;
			}//else cylinder_heights[inc]=cylinder_height;
			nom='pileup'+(inc.toString());
			if((typeof scene.getObjectByName(nom))=='undefined'){
			    if(lambert) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshLambertMaterial({color:'white',emissive:'black',emissiveIntensity:1.0,opacity:1.0})));
			    if(phong) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshPhongMaterial({color:'white',shininess:100.0})));
			    if(standard) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshStandardMaterial({color:'white',metalness:0.5})));
			    scene.children[scene.children.length-1].name=nom;
			    n_pileups++;
			}else{
			    // scene.getObjectByName(nom).scale.y=cylinder_height/cylinder_heights[inc];
			    scene.getObjectByName(nom).geometry=new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32);
			}
			scene.getObjectByName(nom).rotation.order='YXZ';
			scene.getObjectByName(nom).rotation.x=LATi;
			scene.getObjectByName(nom).rotation.y=LONi;
			scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
			scene.getObjectByName(nom).material.color.set(colors2[j]);
			scene.getObjectByName(nom).castShadow=true;
			scene.getObjectByName(nom).receiveShadow=false;
			scene.getObjectByName(nom).material.needsUpdate=true;
			scene.getObjectByName(nom).position.set(vS[inc].x+2.0*FAO_radius*((j%sqrt_n_FAO_i)*pt.x+((j-j%sqrt_n_FAO_i)/sqrt_n_FAO_i)*nt.x)+u.x,vS[inc].y+2.0*FAO_radius*((j%sqrt_n_FAO_i)*pt.y+((j-j%sqrt_n_FAO_i)/sqrt_n_FAO_i)*nt.y)+u.y,vS[inc].z+2.0*FAO_radius*((j%sqrt_n_FAO_i)*pt.z+((j-j%sqrt_n_FAO_i)/sqrt_n_FAO_i)*nt.z)+u.z);
			scene.getObjectByName(nom).userData=source['id']+' : '+((data_FAO[i][FAO_arg[j]].toPrecision(3)).toString())+' '+FAO_title[j];
			inc++;
		    }
		}
	    }
	}
	// clean the useless pileups
	for(var i=(n_pileups-1);i>=inc;i--) scene.remove(scene.getObjectByName('pileup'+(i.toString())));
	n_pileups=inc;
    }
};

// making the new links and the new pileups
function change_pubmed(){
    if(i_word!==-1 && a_FAO_i==='' && i_FAO_trade===''){
	console.log('change_pubmed');
	// making the pileup for each country
	cylinder_heights_length=cylinder_heights.length;
	vS_length=vS.length;
	vT_length=vT.length;
	// calculating the threshold
	values=[];
	for(var i=0;i<n_pileups_year;i++) values.push(data_json_w['pileups'][pileups_year[i]]['value']);
	values.sort(function(a,b){return a-b});
	lower_value=values[parseInt((plower_bound/100.0)*values.length)];
	document.getElementById('YEAR').innerHTML='';
	document.getElementById('WORD').innerHTML=((word.toUpperCase()).replace(/_/g,'\xa0'))+'\xa0'+(100.0-plower_bound).toString()+'%\xa0of\xa0the\xa0highest\xa0values\xa0in\xa0'+(year.toString());
	// looping over the pileups
	lower_value=-1.0;
	inc=0;
	for(var i=0;i<n_pileups_year;i++){
	    ii=pileups_year[i];
	    if(data_json_w['pileups'][ii]['value']>=lower_value){
		source=data_json['LL'][data_json_w['pileups'][ii]['country']];// Starting and target points
		LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		if(inc<vS_length){
		    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
		    vS[inc].setY(Math.cos(LATi));
		    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
		}else{
		    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
		    vS_length++;
		}
		if(inc<vT_length) vT[inc].copy(vS[inc]);
		else{
		    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
		    vT_length++;
		}
		cylinder_height=data_json_w['pileups'][ii]['value']*radius/max_pileups;
		if(inc>=cylinder_heights_length){
		    cylinder_heights.push(cylinder_height);
		    cylinder_heights_length++;
		}//else cylinder_heights[inc]=cylinder_height;
		vT[inc].multiplyScalar(radius+0.5*cylinder_height);
		nom='pileup'+(inc.toString());
		source=data_json['LL'][data_json_w['pileups'][ii]['country']]['id'];
		detail=source.concat(' : ',(data_json_w['pileups'][ii]['value'].toPrecision(3)).toString());
		if((typeof scene.getObjectByName(nom))=='undefined'){
		    if(lambert) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshLambertMaterial({color:'white'})));
		    if(phong) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshPhongMaterial({color:'white',shininess:100.0})));
		    if(standard) scene.add(new THREE.Mesh(new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32),new THREE.MeshStandardMaterial({color:'white',metalness:0.5})));
		    scene.children[scene.children.length-1].name=nom;
		    n_pileups++;
		}else{
		    // scene.getObjectByName(nom).scale.set(1.0,cylinder_height/cylinder_heights[inc],1.0);
		    scene.getObjectByName(nom).geometry=new THREE.CylinderGeometry(FAO_radius,FAO_radius,cylinder_height,32);
		}
		scene.getObjectByName(nom).rotation.order='YXZ';
		scene.getObjectByName(nom).rotation.x=LATi;
		scene.getObjectByName(nom).rotation.y=LONi;
		scene.getObjectByName(nom).position.set(vT[inc].x,vT[inc].y,vT[inc].z);
		scene.getObjectByName(nom).matrixWorldNeedsUpdate=true;
		scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
		scene.getObjectByName(nom).material.color.set('white');
		scene.getObjectByName(nom).castShadow=true;
		scene.getObjectByName(nom).receiveShadow=false;
		scene.getObjectByName(nom).material.needsUpdate=true;
		scene.getObjectByName(nom).material.side=THREE.DoubleSide;
		if(ifBoundingBox){
		    scene.getObjectByName(nom).geometry.computeBoundingBox();
		    BoundingBox=new THREE.BoxHelper(scene.getObjectByName(nom),0xffff00);
		    scene.add(BoundingBox);
		}
		scene.getObjectByName(nom).userData=detail;
		inc++;
	    }
	}// Rof pileups
	console.log(n_pileups,inc);
	for(var i=(n_pileups-1);i>=inc;i--){
	    scene.remove(scene.getObjectByName('pileup'+(i.toString())));
	    cylinder_heights.splice(i,1);
	}
	n_pileups=inc;
	// making the links
	n_curves=paths.curves.length;
	n_count=count.length;
	volumes_length=volumes.length;
	mST_length=mST.length;
	for(var i=0;i<(vS_length-mST_length);i++) mST.push(new THREE.Vector3());
	bn_length=bn.length;
	for(var i=0;i<(vS_length-bn_length);i++) bn.push(new THREE.Vector3());
	// calculating the threshold
	values=[];
	for(var i=0;i<n_pairwize_year;i++) values.push(data_json_w['links'][pairwize_year[i]]['value']);
	values.sort(function(a,b){return a-b});
	lower_value=values[parseInt((plower_bound/100.0)*values.length)];
	// looping over the pairwize
	inc=0;
	for(var i=0;i<n_pairwize_year;i++){
	    ii=pairwize_year[i];
	    if(data_json_w['links'][ii]['value']>=lower_value){
		// Starting and target points
		source=data_json_w['links'][ii]['s'];
		target=data_json_w['links'][ii]['t'];
		index=n_countries*Math.min(source,target)+Math.max(source,target);
		source=data_json['LL'][source];
		target=data_json['LL'][target];
		LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
		LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
		if(inc<vS_length){
		    vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
		    vS[inc].setY(Math.cos(LATi));
		    vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
		    mST[inc].copy(vS[inc]);
		}else{
		    vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
		    mST.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
		    vS_length++;
		}
		LATi=0.5*Math.PI-target['lat']*Math.PI/180.0;
		LONi=0.5*Math.PI+target['lon']*Math.PI/180.0;
		if(inc<vT_length){
		    vT[inc].setX(Math.sin(LATi)*Math.sin(LONi));
		    vT[inc].setY(Math.cos(LATi));
		    vT[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
		}else{
		    vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
		    bn.push(new THREE.Vector3());
		    vT_length++;
		}
		// mid-point
		theta=Math.acos(vS[inc].x*vT[inc].x+vS[inc].y*vT[inc].y+vS[inc].z*vT[inc].z);
		bn[inc].setX(vS[inc].y*vT[inc].z-vS[inc].z*vT[inc].y);
		bn[inc].setY(vS[inc].z*vT[inc].x-vS[inc].x*vT[inc].z);
		bn[inc].setZ(vS[inc].x*vT[inc].y-vS[inc].y*vT[inc].x);
		bn[inc].normalize();
		mST[inc].applyAxisAngle(bn[inc],0.5*theta);
		mST[inc].multiplyScalar(radius*(1.0+theta));
		vS[inc].multiplyScalar(radius);
		vT[inc].multiplyScalar(radius);
		// Bezier curves
		if(inc<n_curves) paths.curves[inc]=new THREE.QuadraticBezierCurve3(vS[inc],mST[inc],vT[inc]);
		else{
		    paths.add(new THREE.QuadraticBezierCurve3(vS[inc],mST[inc],vT[inc]));
		    n_curves++;
		}
		volume=weight0*Math.cbrt(3.0*data_json_w['links'][ii]['value']/(4.0*Math.PI));
		if(inc<n_count){
		    count[inc]=0;
		    delta_count[inc]=parseInt(volume);
		}else{
		    count.push(0);
		    delta_count.push(parseInt(volume));
		    n_count++;
		}
		source=data_json['index_country'][data_json_w['links'][ii]['s']];
		target=data_json['index_country'][data_json_w['links'][ii]['t']];
		detail=source.concat(' with ',target.concat(' : ',(data_json_w['links'][ii]['value'].toPrecision(3)).toString()));
		// the link ...
		nom='link'+(inc.toString());
		if((typeof scene.getObjectByName(nom))=='undefined'){
		    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(paths.curves[inc].getPoints(n_points)),new THREE.LineBasicMaterial({color:colors[index%n_colors]})));
		    scene.children[scene.children.length-1].name=nom;
		    n_links++;
		}else scene.getObjectByName(nom).geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[inc].getPoints(n_points));// scene.getObjectByName(nom).geometry.setFromPoints(paths.curves[inc].getPoints(n_points));
		scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
		scene.getObjectByName(nom).material.needsUpdate=true;
		scene.getObjectByName(nom).material.color.set(colors[index%n_colors]);
		scene.getObjectByName(nom).material.side=THREE.DoubleSide;
		scene.getObjectByName(nom).userData=detail;
		// ...and the associated mesh
		nom='ball'+(inc.toString());
		if((typeof scene.getObjectByName(nom))=='undefined'){
		    if(lambert) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshLambertMaterial({color:colors[index%n_colors]})));
		    if(phong) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshPhongMaterial({color:colors[index%n_colors],shininess:100.0})));
		    if(standard) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshStandardMaterial({color:colors[index%n_colors],metalness:0.5})));
		    scene.children[scene.children.length-1].name=nom;
		    n_balls++;
		}else{
		    scene.getObjectByName(nom).geometry=new THREE.SphereGeometry(volume,segments0,rings0);
		    // scene.getObjectByName(nom).scale.set(volume/volumes[inc],volume/volumes[inc],volume/volumes[inc]);
		}
		scene.getObjectByName(nom).matrixWorldNeedsUpdate=true;
		scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
		scene.getObjectByName(nom).material.color.set(colors[index%n_colors]);
		scene.getObjectByName(nom).castShadow=true;
		scene.getObjectByName(nom).receiveShadow=false;
		scene.getObjectByName(nom).material.needsUpdate=true;
		scene.getObjectByName(nom).material.side=THREE.DoubleSide;
		scene.getObjectByName(nom).userData=detail;
		if(inc<volumes_length){
		    volumes[inc]=volume;
		}else{
		    volumes.push(volume);
		    volumes_length++;
		}
		inc++;
	    }// Fi lower value
	}// Rof pairwize
	for(var i=(n_links-1);i>=inc;i--) scene.remove(scene.getObjectByName('link'+(i.toString())));
	n_links=inc;
	for(var i=(n_balls-1);i>=inc;i--) scene.remove(scene.getObjectByName('ball'+(i.toString())));
	n_balls=inc;
    }// Fi
};

// making the trade
function change_FAO_trade(){
    if(b_FAO_trade[i_FAO_trade]){
	console.log('change_FAO_trade');
	document.getElementById('YEAR').innerHTML='';
	document.getElementById('WORD').innerHTML=title_FAO_trade[id_FAO_trade.findIndex(function(e){return e===i_FAO_trade;})].toUpperCase()+'\xa0'+(100.0-plower_bound).toString()+'%\xa0of\xa0the\xa0highest\xa0values\xa0in\xa0'+(year.toString());
	max_trade=0.0;
	data_json_trade=data_json[i_FAO_trade];
	for(i in data_json_trade){
	    for(j in data_json_trade[i]){
		for(k in data_json_trade[i][j]){
		    if(data_json_trade[i][j][k]['itonnes']!=null) max_trade=Math.max(max_trade,data_json_trade[i][j][k]['itonnes']);
		    if(data_json_trade[i][j][k]['etonnes']!=null) max_trade=Math.max(max_trade,data_json_trade[i][j][k]['etonnes']);
		}
	    }
	}
	// calculating the threshold
	values=[];
	for(i in data_json_trade){
	    for(j in data_json_trade[i]){
		for(k in data_json_trade[i][j]){
		    if(data_json_trade[i][j][k]['etonnes']!=null) values.push(data_json_trade[i][j][k]['etonnes']);
		}
	    }
	}
	values.sort(function(a,b){return a-b});
	lower_value=values[parseInt((plower_bound/100.0)*values.length)];
	// making the links trade
	n_curves=paths.curves.length;
	n_count=count.length;
	volumes_length=volumes.length;
	vS_length=vS.length;
	mST_length=mST.length;
	for(var i=0;i<(vS_length-mST_length);i++) mST.push(new THREE.Vector3());
	vT_length=vT.length;
	for(var i=0;i<(vS_length-vT_length);i++) vT.push(new THREE.Vector3());
	inc=0;
	inc_ball=0;
	inc_cube=0;
	for(i in data_json_trade){
	    for(j in data_json_trade[i]){
		if(j===year.toString()){
		    data_json_trade_i=data_json_trade[i];
		    for(k in data_json_trade_i[j]){
			data_json_trade_i_j=data_json_trade_i[j];
			import_i=-1.0;
			export_i=-1.0;
			for(var a in arg_trade){
			    if(data_json_trade_i_j[k][arg_trade[a]]!=null){
				if(arg_trade[a]==='itonnes') import_i=data_json_trade_i_j[k]['itonnes'];
				if(arg_trade[a]==='etonnes') export_i=data_json_trade_i_j[k]['etonnes'];// i export vers k (equiv k import de i)
				if(a===0 && arg_trade[a]==='itonnes'){
				    max_ie=import_i;
				    if(data_json_trade_i_j[k]['etonnes']!=null) max_ie=Math.max(import_i,data_json_trade_i_j[k]['etonnes']);
				}
				if(a===0 && arg_trade[a]==='etonnes'){
				    max_ie=export_i;
				    if(data_json_trade_i_j[k]['itonnes']!=null) max_ie=Math.max(export_i,data_json_trade_i_j[k]['itonnes']);
				}
				source=data_json['LL'][country_index[i].toString()]['continent'];
				target=data_json['LL'][country_index[k].toString()]['continent'];
				if((import_i>=lower_value || export_i>=lower_value) && (((i===country || k===country || country==='all') && country!=='') || (country==='' && ((source===continent_1 && target===continent_2) || (source===continent_2 && target===continent_1) || continent_1==='all' || continent_2==='all')))){
				    // Starting and target points
				    index=(n_countries*Math.min(country_index[i],country_index[k])+Math.max(country_index[i],country_index[k]))%n_colors;
				    LATi=0.5*Math.PI-data_json['LL'][country_index[i].toString()]['lat']*Math.PI/180.0;
				    LONi=0.5*Math.PI+data_json['LL'][country_index[i].toString()]['lon']*Math.PI/180.0;
				    if(inc<vS_length){
					vS[inc].setX(Math.sin(LATi)*Math.sin(LONi));
					vS[inc].setY(Math.cos(LATi));
					vS[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
					mST[inc].copy(vS[inc]);
				    }else{
					vS.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
					mST.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
					vS_length++;
				    }
				    LATi=0.5*Math.PI-data_json['LL'][country_index[k].toString()]['lat']*Math.PI/180.0;
				    LONi=0.5*Math.PI+data_json['LL'][country_index[k].toString()]['lon']*Math.PI/180.0;
				    if(inc<vT_length){
					vT[inc].setX(Math.sin(LATi)*Math.sin(LONi));
					vT[inc].setY(Math.cos(LATi));
					vT[inc].setZ(Math.sin(LATi)*Math.cos(LONi));
				    }else{
					vT.push(new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)));
					bn.push(new THREE.Vector3());
					vT_length++;
				    }
				    // mid-point
				    theta=Math.acos(vS[inc].x*vT[inc].x+vS[inc].y*vT[inc].y+vS[inc].z*vT[inc].z);
				    bn[inc].setX(vS[inc].y*vT[inc].z-vS[inc].z*vT[inc].y);
				    bn[inc].setY(vS[inc].z*vT[inc].x-vS[inc].x*vT[inc].z);
				    bn[inc].setZ(vS[inc].x*vT[inc].y-vS[inc].y*vT[inc].x);
				    bn[inc].normalize();
				    mST[inc].applyAxisAngle(bn[inc],0.5*theta);
				    mST[inc].multiplyScalar(radius*(1.0+theta));
				    vS[inc].multiplyScalar(radius);
				    vT[inc].multiplyScalar(radius);
				    // Bezier curves
				    if(inc<n_curves) paths.curves[inc]=new THREE.QuadraticBezierCurve3(vS[inc],mST[inc],vT[inc]);
				    else{
					paths.add(new THREE.QuadraticBezierCurve3(vS[inc],mST[inc],vT[inc]));
					n_curves++;
				    }
				    if(inc<n_count){
					if(arg_trade[a]==='etonnes') count[inc]=1;
					if(arg_trade[a]==='itonnes') count[inc]=n_points-1;
				    }else{
					if(arg_trade[a]==='etonnes') count.push(1);
					if(arg_trade[a]==='itonnes') count.push(n_points-1);
					n_count++;
				    }
				    if(arg_trade[a]==='itonnes') detail=(i.concat(' with ',k.concat(' : ',(import_i.toPrecision(3)).toString()))).concat(' tonnes of import');
				    if(arg_trade[a]==='etonnes') detail=(i.concat(' with ',k.concat(' : ',(export_i.toPrecision(3)).toString()))).concat(' tonnes of export');
				    // the trade link ...
				    nom='link'+(inc.toString());
				    if((typeof scene.getObjectByName(nom))=='undefined'){
					scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(paths.curves[inc].getPoints(n_points)),new THREE.LineBasicMaterial({color:colors[index]})));
					scene.children[scene.children.length-1].name=nom;
					n_links++;
				    }else scene.getObjectByName(nom).geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[inc].getPoints(n_points));
				    scene.getObjectByName(nom).matrixWorldNeedsUpdate=true;
				    scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
				    scene.getObjectByName(nom).material.needsUpdate=true;
				    scene.getObjectByName(nom).material.color.set(colors[index]);
				    scene.getObjectByName(nom).material.side=THREE.DoubleSide;
				    scene.getObjectByName(nom).userData=detail;
				    // ... and the associated mesh
				    if(arg_trade[a]==='etonnes'){
					volume=weight0*Math.cbrt(3.0*export_i/(4.0*Math.PI*max_trade));
					nom='ball'+(inc_ball.toString());
					if((typeof scene.getObjectByName(nom))=='undefined'){
					    if(lambert) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshLambertMaterial({color:colors[index]})));
					    if(phong) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshPhongMaterial({color:colors[index],shininess:100.0})));
					    if(standard) scene.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),new THREE.MeshStandardMaterial({color:colors[index],metalness:0.5})));
					    scene.children[scene.children.length-1].name=nom;
					    n_balls++;
					}else{
					    // scene.getObjectByName(nom).scale.set(volume/volumes[inc],volume/volumes[inc],volume/volumes[inc]);
					    scene.getObjectByName(nom).geometry=new THREE.SphereGeometry(volume,segments0,rings0);
					}
					if(inc_ball<ball_mesh.length) ball_mesh[inc_ball]=inc;
					else ball_mesh.push(inc);
					inc_ball++;
				    }
				    if(arg_trade[a]==='itonnes'){
					volume=weight0*Math.cbrt(3.0*import_i/(4.0*Math.PI*max_trade));
					nom='cube'+(inc_cube.toString());
					if((typeof scene.getObjectByName(nom))=='undefined'){
					    if(lambert) scene.add(new THREE.Mesh(new THREE.BoxGeometry(volume,volume,volume),new THREE.MeshLambertMaterial({color:colors[index]})));
					    if(phong) scene.add(new THREE.Mesh(new THREE.BoxGeometry(volume,volume,volume),new THREE.MeshPhongMaterial({color:colors[index],shininess:100.0})));
					    if(standard) scene.add(new THREE.Mesh(new THREE.BoxGeometry(volume,volume,volume),new THREE.MeshStandardMaterial({color:colors[index],metalness:0.5})));
					    scene.children[scene.children.length-1].name=nom;
					    n_cubes++;
					}else{
					    // scene.getObjectByName(nom).scale.set(volume/volumes[inc],volume/volumes[inc],volume/volumes[inc]);
					    scene.getObjectByName(nom).geometry=new THREE.BoxGeometry(volume,volume,volume);
					}
					if(inc_cube<cube_mesh.length) cube_mesh[inc_cube]=inc;
					else cube_mesh.push(inc);
					inc_cube++;
				    }
				    scene.getObjectByName(nom).matrixWorldNeedsUpdate=true;
				    scene.getObjectByName(nom).geometry.verticesNeedUpdate=true;
				    scene.getObjectByName(nom).material.color.set(colors[index%n_colors]);
				    scene.getObjectByName(nom).castShadow=true;
				    scene.getObjectByName(nom).receiveShadow=false;
				    scene.getObjectByName(nom).material.needsUpdate=true;
				    scene.getObjectByName(nom).material.side=THREE.DoubleSide;
				    scene.getObjectByName(nom).userData=detail;
				    if(inc<volumes_length){
					volumes[inc]=volume;
				    }else{
					volumes.push(volume);
					volumes_length++;
				    }
				    inc++;
				}// Rof arg_trade
			    }// Fi > 0.0
			}// Fi
		    }// Rof k
		}// Fi year
	    }// Rof j
	}// Rof i
	console.log(inc_ball,n_balls);
	console.log(inc_cube,n_cubes);
	console.log(inc,n_curves,n_count);
	for(var i=(n_links-1);i>=inc;i--) scene.remove(scene.getObjectByName('link'+(i.toString())));
	n_links=inc;
	for(var i=(n_balls-1);i>=inc_ball;i--) scene.remove(scene.getObjectByName('ball'+(i.toString())));
	n_balls=inc_ball;
	for(var i=(n_cubes-1);i>=inc_cube;i--) scene.remove(scene.getObjectByName('cube'+(i.toString())));
	n_cubes=inc_cube;
	// no pileups at all for the trade links
	for(var i=(n_pileups-1);i>=0;i--) scene.remove(scene.getObjectByName('pileup'+(i.toString())));
	n_pileups=0;
    }// Fi
};

// list the pileups and the pairwize for the year
function list_pileups_pairwize_year(){
    // building the pileups
    pileups_year=[];
    if(i_word!==-1){
	for(var i=0;i<pileups[i_word];i++) if(data_json_w['pileups'][i]['y']===year) pileups_year.push(i);
    }
    n_pileups_year=pileups_year.length;
    // building the pairwize
    pairwize_year=[];
    if(i_word!==-1){
	for(var i=0;i<pairwize[i_word];i++){
	    if(data_json_w['links'][i]['y']===year){
		source=data_json_w['links'][i]['s'];
		target=data_json_w['links'][i]['t'];
		source=data_json['LL'][source]['continent'];
		target=data_json['LL'][target]['continent'];
		if(((source===country || target===country || country==='all') && country!=='') || (country==='' && ((source===continent_1 && target===continent_2) || (source===continent_2 && target===continent_1) || continent_1==='all' || continent_2==='all'))){
		    pairwize_year.push(i);
		}
	    }
	}
    }
    n_pairwize_year=pairwize_year.length;
    for(var i=0;i<n_cubes;i++) scene.remove(scene.getObjectByName('cube'+(i.toString())));
};

// On mouse ...
function OnMouseMove(event){
    event.preventDefault();
    mouse2D.setX((event.clientX/window.innerWidth)*2-1);
    mouse2D.setY(1-(event.clientY/window.innerHeight)*2);
};
function OnMouseDown(event){
    event.preventDefault();
    DraggingMouse=true;
    mouse2D.setX((event.clientX/window.innerWidth)*2-1);
    mouse2D.setY(1-(event.clientY/window.innerHeight)*2);
    // // ???
    // var geometrie=new THREE.Geometry();
    // var origine=new THREE.Vector3();
    // origine.copy(raycaster.ray.origin);
    // var direction=new THREE.Vector3();
    // direction.copy(raycaster.ray.direction);
    // geometrie.vertices.push(new THREE.Vector3());
    // geometrie.vertices.push(new THREE.Vector3());
    // direction.multiplyScalar(20.0*radius);
    // direction.add(origine);
    // geometrie.vertices[0].copy(origine);
    // geometrie.vertices[1].copy(direction);
    // var material=new THREE.LineBasicMaterial({color:'#000'});
    // var line=new THREE.Line(geometrie,material);
    // scene.add(line);
    // // ???
};
function OnMouseUp(e){
    e.preventDefault();
    DraggingMouse=false;
};
function RotateOnMouseMove(e){
    e.preventDefault();
    if(DraggingMouse){
	thetaX=-Math.sign(e.clientX-PreviousMouseX)*0.075;
	thetaY=-Math.sign(e.clientY-PreviousMouseY)*0.075;
	radial.applyAxisAngle(radial_b,thetaX);
	radial_n.applyAxisAngle(radial_b,thetaX);
	radial.applyAxisAngle(radial_n,thetaY);
	radial_b.applyAxisAngle(radial_n,thetaY);
	// camera
	camera.position.set(Rcamera*radial.x,Rcamera*radial.y,Rcamera*radial.z);
	camera.up.set(radial_b.x,radial_b.y,radial_b.z);
	camera.lookAt(new THREE.Vector3(0,0,0));
	camera.updateProjectionMatrix();
	camera.updateMatrixWorld();
	// light
	l_radial.applyAxisAngle(radial_b,thetaX);
	l_radial_n.applyAxisAngle(radial_b,thetaX);
	l_radial.applyAxisAngle(radial_n,thetaY);
	l_radial_b.applyAxisAngle(radial_n,thetaY);
	Light.position.set(LightR*l_radial.x,LightR*l_radial.y,LightR*l_radial.z);
	Light.lookAt(new THREE.Vector3(0,0,0));
	PreviousMouseX=e.clientX;
	PreviousMouseY=e.clientY;
    }
};
function ZoomOnMouseWheel(e){
    if(e.clientX>(.3*window.innerWidth) && e.clientX<(.7*window.innerWidth)){
	Rcamera=Math.min(10.0*radius,Math.max(2.0*radius,Rcamera-e.wheelDelta));
	camera.position.set(Rcamera*radial.x,Rcamera*radial.y,Rcamera*radial.z);
	camera.lookAt(new THREE.Vector3(0,0,0));
	camera.updateProjectionMatrix();
	camera.updateMatrixWorld();
    }
};

// making the render
function render(){
    // FAO trade
    if(i_FAO_trade!==''){
	for(var i=0;i<n_balls;i++){
	    ii=ball_mesh[i];
	    if(count[ii]>=n_points) count[ii]=1;
	    count[ii]++;
	    paths.curves[ii].getPoint(count[ii]/n_points,pt);
	    scene.getObjectByName('ball'+(i.toString())).position.set(pt.x,pt.y,pt.z);
	}
	for(var i=0;i<n_cubes;i++){
	    ii=cube_mesh[i];
	    if(count[ii]<0) count[ii]=n_points-1;
	    count[ii]--;
	    paths.curves[ii].getPoint(count[ii]/n_points,pt);
	    scene.getObjectByName('cube'+(i.toString())).position.set(pt.x,pt.y,pt.z);
	}
    }
    // pubmed data
    if(i_word!==-1 && a_FAO_i==='' && i_FAO_trade===''){
	for(var i=0;i<n_links;i++){
	    if(count[i]>=(f_points*n_points) || count[i]<0) delta_count[i]*=-1;
	    count[i]+=delta_count[i];
	    paths.curves[i].getPoint(count[i]/(f_points*n_points),pt);
	    scene.getObjectByName('ball'+(i.toString())).position.set(pt.x,pt.y,pt.z);
	}
    }
    if(typeof lightHelper!=='undefined') lightHelper.update();
    // ???
    if(mouse2D.x>((2.0*radius/window.innerWidth)*2-1) && mouse2D.x<(((window.innerWidth-2.0*radius)/window.innerWidth)*2-1)){
	raycaster.setFromCamera(mouse2D,camera);
	intersects=raycaster.intersectObjects(scene.children,true);
	ifIntersect=false;
	if(intersects.length>0){
	    for(var i=0;i<intersects.length;i++){
		if(INTERSECTED!=intersects[i].object && !intersects[i].object.material.isLineBasicMaterial && intersects[i].object.name!=='globe' && !ifIntersect){
		    if(INTERSECTED && !INTERSECTED.material.isLineBasicMaterial){
			INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
		    }
		    INTERSECTED=intersects[i].object;
		    INTERSECTED.currentHex=INTERSECTED.material.emissive.getHex();
		    INTERSECTED.material.emissive.setHex(0xff0000);
    		    text=text.concat(intersects[i].object.userData,'<br>');
		    document.getElementById('pileups').children[document.getElementById('pileups').children.length-1].innerHTML=text;
    		    ifIntersect=true;
    		}
	    }
	}else{
	    if(INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
	    INTERSECTED=null;
	}
    }
    // ???
    renderer.render(scene,camera);
};

function update(){
    requestAnimationFrame(update);
    render();
};

// change the pairwize of continents
function change_continents(e){
    if(a_FAO_i===''){
	country='';// clear the country selection
	for(var i=0;i<continents.length;i++){
	    for(var j=i;j<continents.length;j++){
		if((continents[i]+'_'+continents[j])===e.target.id){
		    continent_1=continents[i];
		    continent_2=continents[j];
		}
	    }
	}
	list_pileups_pairwize_year();
	change_pubmed();
	change_FAO_trade();
    }
};

// change the country
function change_country(e){
    if(a_FAO_i===''){
	continent_1='';// clear the continent selection
	continent_2='';// clear the continent selection
	country=e.target.id;
	list_pileups_pairwize_year();
	change_pubmed();
	change_FAO_trade();
    }
};

// change the percentage
function change_percentage(e){
    plower_bound=parseInt(e.target.innerHTML);
    change_pubmed();
    change_FAO();
    change_FAO_trade();
};

// change year on mouse click
function change_year(e){
    year=parseInt(e.target.id);
    initializing_description();
    document.getElementById('YEAR').innerHTML=year.toString();
    document.getElementById('publications').innerHTML='# publications : '.concat(data_json['publications'][year.toString()].toString());
    document.getElementById('tanom_land').innerHTML='temperature anomaly land : '.concat(temp_anom_land['data'][year.toString()]);
    document.getElementById('tanom_ocean').innerHTML='temperature anomaly ocean : '.concat(temp_anom_ocean['data'][year.toString()]);
    document.getElementById('forest_coverage').innerHTML='forest coverage : '.concat((forest_coverage[year.toString()].toPrecision(3)).toString());
    document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[year.toString()].toPrecision(3)).toString(),' million of km2');
    list_pileups_pairwize_year();
    change();
};

// change data
function change(){
    initializing_description();
    list_pileups_pairwize_year();
    change_pubmed();
    change_FAO();
    change_FAO_trade();
};

// draw the annual population
function annual_population(){
    a_FAO_i='annual_population';
    initializing_change();
    change();
};

// draw the burning crop residues
function burning_crop_residues(){
    a_FAO_i='burning_crop_residues';
    initializing_change();
    change();
};

// draw the average yield crops production
function crops_average_yield(){
    a_FAO_i='crops_average_yield';
    initializing_change();
    change();
};

// draw the food trade import/export on click
function crops_livestock(){
    a_FAO_i='crops_livestock';
    initializing_change();
    change();
};

// draw the crops production and crops processed on click
function crops_processed(){
    a_FAO_i='crops_processed';
    initializing_change();
    change();
};

// draw the enteric fermentation
function enteric_fermentation(){
    a_FAO_i='enteric_fermentation';
    initializing_change();
    change();
};

// draw the environment emissions intensities
function environment_emissions_intensities(){
    a_FAO_i='environment_emissions_intensities';
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

// draw the irrigation
function irrigation(){
    a_FAO_i='irrigation';
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

// draw the livestock manure
function livestock_manure(){
    a_FAO_i='livestock_manure';
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

// draw the rice_and_organic_soils_emissions_intensities
function rice_and_organic_soils_emissions_intensities(){
    a_FAO_i='rice_and_organic_soils_emissions_intensities';
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
    // clear FAO trade
    i_FAO_trade='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
};

// draw the detailed chicken meat trade matrix
function chicken_meat_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='chicken_meat_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// draw the detailed eggs trade matrix
function eggs_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='eggs_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// draw the detailed maize trade matrix
function maize_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='maize_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// draw the detailed pig meat trade matrix
function pig_meat_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='pig_meat_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// draw the detailed rice trade matrix
function rice_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='rice_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// draw the detailed sugar trade matrix
function sugar_FAO_trade(){
    b_FAO[a_FAO_i]=false;
    i_word=-1;
    word='';
    a_FAO_i='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    i_FAO_trade='sugar_trade';
    b_FAO_trade[i_FAO_trade]=true;
    plower_bound=95.0;
    change();
}

// initializing description
function initializing_description(){
    description='# publications*publications(2017)/publications('+(year.toString())+') :';
    if(b_FAO['annual_population']){
	description='annual population (female, male, rural and urban), FAO ('+(year.toString())+') :';
	n_FAO_i=n_annual_population;
	FAO_arg=annual_population_arg;
	FAO_title=annual_population_title;
    }
    if(b_FAO['burning_crop_residues']){
	description='ratio CO2(eq) to burning matter, FAO ('+(year.toString())+') :';
	n_FAO_i=n_burning_crop_residues;
	FAO_arg=burning_crop_residues_arg;
	FAO_title=burning_crop_residues_title;
    }
    if(b_FAO['crops_average_yield']){
	description='crops average yield, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_average_yield;
	FAO_arg=crops_average_yield_arg;
	FAO_title=crops_average_yield_title;
    }
    if(b_FAO['crops_livestock']){
	description='crops livestock, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_livestock;
	FAO_arg=crops_livestock_arg;
	FAO_title=crops_livestock_title;
    }
    if(b_FAO['crops_processed']){
	description='crops production and crops processed, FAO ('+(year.toString())+') :';
	n_FAO_i=n_crops_processed;
	FAO_arg=crops_processed_arg;
	FAO_title=crops_processed_title;
    }
    if(b_FAO['enteric_fermentation']){
	description='GHG from enteric fermentation, FAO ('+(year.toString())+') :';
	n_FAO_i=n_enteric_fermentation;
	FAO_arg=enteric_fermentation_arg;
	FAO_title=enteric_fermentation_title;
    }
    if(b_FAO['environment_emissions_intensities']){
	description='ratio production CO2(equivalent) emissions, FAO ('+(year.toString())+') :';
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
    if(b_FAO['irrigation']){
	description='irrigation, FAO ('+(year.toString())+') :';
	n_FAO_i=n_irrigation;
	FAO_arg=irrigation_arg;
	FAO_title=irrigation_title;
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
    if(b_FAO['livestock_manure']){
	description='livestock manure (N content), FAO ('+(year.toString())+') :';
	n_FAO_i=n_livestock_manure;
	FAO_arg=livestock_manure_arg;
	FAO_title=livestock_manure_title;
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
	description='rice and cultivated organic soils CO2(in tonnes) emissions per ha, FAO ('+(year.toString())+') :';
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
    if(i_FAO_trade==='chicken_meat_trade') description='chicken meat trade, FAO ('+(year.toString())+') :';
    if(i_FAO_trade==='eggs_trade') description='eggs trade, FAO ('+(year.toString())+') :';
    if(i_FAO_trade==='maize_trade') description='maize trade, FAO ('+(year.toString())+') :';
    if(i_FAO_trade==='pig_meat_trade') description='pig meat trade, FAO ('+(year.toString())+') :';
    if(i_FAO_trade==='rice_trade') description='rice (milled equivalent) trade, FAO ('+(year.toString())+') :';
    if(i_FAO_trade==='sugar_trade') description='sugar trade, FAO ('+(year.toString())+') :';
    buffer_int=document.getElementById('pileups').children.length;
    for(var i=(buffer_int-1);i>=0;i--) document.getElementById('pileups').removeChild(document.getElementById('pileups').children[i]);
    if(i_word===-1){
	// FAO data
	if(a_FAO_i!==''){
	    for(var i=0;i<n_FAO_i;i++){
		if(i<document.getElementById('pileups').children.length){
		    document.getElementById('pileups').children[i].style.color=colors2[i];
		    document.getElementById('pileups').children[i].innerHTML=FAO_title[i]+'<br>';
		}else{
		    label=document.createElement('span');
		    label.style.color=colors2[i];
		    label.innerHTML=FAO_title[i]+'<br>';
		    document.getElementById('pileups').appendChild(label);
		}
	    }
	    text=(description.concat('<br>')).concat('<br>');
	    if(i<document.getElementById('pileups').children.length){
		document.getElementById('pileups').children[i].style.color='white';
		document.getElementById('pileups').innerHTML=text;
	    }else{
		label=document.createElement('span');
		label.style.color='white';
		label.innerHTML=text+'<br>';
		document.getElementById('pileups').appendChild(label);
	    }
	}
	// trade FAO data ?
	if(i_FAO_trade!==''){
	    text=(description.concat('<br>')).concat('<br>');
	    label=document.createElement('span');
	    label.style.color='white';
	    label.innerHTML=text;
	    document.getElementById('pileups').appendChild(label);
	}
    }else{
	// pubmed data
	text=(description.concat('<br>')).concat('<br>');
	label=document.createElement('span');
	label.style.color='white';
	label.innerHTML=text;
	document.getElementById('pileups').appendChild(label);
    }
};

// highlighting a keyword on mouse click
function highlight(e){
    // clear FAO data
    a_FAO_i='';
    for(var i=0;i<n_FAO;i++) b_FAO[id_FAO[i]]=false;
    // clear FAO trade
    i_FAO_trade='';
    for(var i in id_FAO_trade) b_FAO_trade[i]=false;
    // document.getElementById(word).style.fontSize='10px';
    word=e.target.id;
    for(var i=0;i<n_words;i++) if(word===words[i]) i_word=i;
    data_json_w=data_json[word];
    initializing_description();
    // e.target.style.fontSize='30px';
    list_pileups_pairwize_year();
    change();
};

// When the user clicks on <div>, open the popup
function myFunction(){
    popup=document.getElementById("myPopupPileups");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupYear");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupFAO");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupContinent");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupCountry");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupKeywords");
    popup.classList.toggle("show");
    popup=document.getElementById("myPopupPercentage");
    popup.classList.toggle("show");
    if(b_FAO_trade[i_FAO_trade]){
	popup=document.getElementById("myPopupTrade");
	popup.classList.toggle("show");
    }
};

requestJSON(readJSON);
