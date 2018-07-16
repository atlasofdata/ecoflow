<!-- python3 -m http.server, localhost: -->
<!DOCTYPE html>
<html lang="en">
  <meta charset="utf-8">
  <header><title>globe first try</title></header>
  <style>
    canvas{width:100%;height:100%}
    body{
    font-family:Monospace;
    background-color:#000;
    color:#fff;
    margin:0px;
    overflow:hidden;
    }
    #info{
    position:absolute;
    top:10px;
    width:100%;
    text-align:center;
    z-index:100;
    display:block;
    }
    #pileups{
    position:absolute;
    top:200px;
    width:100%;
    text-align:left;
    z-index:100;
    display:block;
    }
    #keywords{
    position:absolute;
    top:100px;
    width:100%;
    text-align:right;
    z-index:100;
    display:block;
    }
    #footer{
    position:absolute;
    bottom:10px;
    width:100%;
    text-align:center;
    z-index:100;
    display:block;
    }
  </style>
  <body>
    <div id="info">
    made with <a href="http://threejs.org" target="_blank" rel="noopener" style='color:#f00;font-weight:bold;cursor:pointer;text-decoration:underline'>three.js</a> - # publications with keyword in the title - <t href="pascal.carrivain@ens-lyon.fr" target="_blank" rel="noopener" style='color:#fff;font-weight:bold'>Pascal Carrivain</t>, <t href="pascal.carrivain@ens-lyon.fr" target="_blank" rel="noopener" style='color:#fff;font-weight:bold'>Titouan Poisson</t>, <t href="pascal.carrivain@ens-lyon.fr" target="_blank" rel="noopener" style='color:#fff;font-weight:bold'>Clément Renaud</t> & <t href="stephane.grumbach@ens-lyon.fr" target="_blank" rel="noopener" style='color:#fff;font-weight:bold'>Stéphane Grumbach</t>
    <br><a target="_blank" rel="noopener" style='color:#fff;font-weight:bold'>data : </a>
    <a href="https://www.ncbi.nlm.nih.gov/pubmed" target="_blank" rel="noopener" style='color:#f0f;font-weight:bold;cursor:pointer;text-decoration:underline'>pubmed</a>
    <a href="https://www.ncdc.noaa.gov/snow-and-ice" target="_blank" rel="noopener" style='color:#00f;font-weight:bold;cursor:pointer;text-decoration:underline'>ice surface data</a>
    <a href="https://www.worldbank.org" target="_blank" rel="noopener" style='color:#0f0;font-weight:bold;cursor:pointer;text-decoration:underline'>forest coverage data</a>
    <a href="https://www.ncdc.noaa.gov" target="_blank" rel="noopener" style='color:#f00;font-weight:bold;cursor:pointer;text-decoration:underline'>temperatures anomalies data</a>
    <br>click to change year, click to change keyword, drag to spin the globe, wheel to zoom in/out
    <br><span class="button" style="font-size:15px;color:#f00;cursor:pointer" id="yearm1">year-1</span>,
    <span class="button" style="font-size:15px;color:#f00;cursor:pointer" id="yearp1">year+1</span>,
    <span class="button" style="font-size:15px;color:#f00;cursor:pointer" id="pkeyword">previous keyword</span>
    <span class="button" style="font-size:15px;color:#f00;cursor:pointer" id="nkeyword">next keyword</span>
    <div id="WORD" style="font-size:40px;color:#00f">?</div>
    <div id="YEAR" style="font-size:40px;color:#00f">?</div>
    </div>
    <div id="pileups">
      <!-- <span id="pileups" style="font-weight:bold;font-size:30px;color:#f00"></span> -->
      <span id="pileups" style="font-weight:bold;font-size:30px"></span>
    </div>
    <div id="keywords">
      <span id="keywords" style="font-weight:bold;font-size:10px;color:#fff"></span>
    </div>
    <footer id="footer">
      <span id="publications" style="font-size:20px;color:#fff">?</span>,
      <span id="ice surface (million of km2)" style="font-size:20px;color:#0099ff">?</span>,
      <span id="forest_coverage" style="font-size:20px;color:#0f0">?</span>,
      <span id="tanom_land" style="font-size:20px;color:#f00">?</span>,
      <span id="tanom_ocean" style="font-size:20px;color:#00f">?</span>
    </footer>
    <!-- <script src="https://webglfundamentals.org/webgl/resources/webgl-utils.js"></script> -->
    <!-- <script src="http://api.geodab.eu/download/giapi/lib/min/giapi.min.js"></script> -->
    <!-- <script src="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"></script> -->
    <!-- <script src="https://threejs.org/build/Detector.js"></script> -->
    <script src="https://threejs.org/build/three.js"></script>
    <script src="https://threejs.org/examples/js/renderers/Projector.js"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <div id="container"></div>
    <script type="text/javascript">
      
    <!-- <\!-- <\\!-- jQuery.crossOrigin=""; -\\-> -\-> -->
    <!-- <\!-- <\\!-- jQuery.getJSON("http://stats.oecd.org/sdmx-json/data/QNA/AUS+CAN.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2010-M1&endTime=2017-M12",function(data){ -\\-> -\-> -->
    <!-- <\!-- jQuery.getJSON("http://stats.oecd.org/sdmx-json/data/QNA/AUS+CAN.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2010-Q1&endTime=2017-Q1",function(data){ -\-> -->
    <!-- <\!-- <\\!-- jQuery.getJSON("http://stats.oecd.org/restsdmx/sdmx.ashx/GetData/QNA/AUS+CAN.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2010-M1&endTime=2017-M12&format=compact_v2",function(data){ -\\-> -\-> -->
    <!-- <\!-- console.log(data); -\-> -->
    <!-- <\!-- console.log(data.getElementById('links')); -\-> -->
    <!-- <\!-- } -\-> -->
    <!-- <\!-- ); -\-> -->
      
    console.clear();
    <!-- if(!Detector.webgl) Detector.addGetWebGLMessage(); -->
  
    var count=[],delta_count=[],pt=new THREE.Vector3(),group_length=0,n_points=1000,pairwize=[],pileups=[],group_mesh=new THREE.Group(),group_links=new THREE.Group(),group_pileups=new THREE.Group();
    var PreviousMouseX=0.0,PreviousMouseY=0.0,DraggingMouse=false;
    const ZoomSensitivity=0.0001;
    var vS=new THREE.Vector3(),vT=new THREE.Vector3(),mST=new THREE.Vector3(),cvS=new THREE.Vector3(),cvT=new THREE.Vector3(),geometry,lines=new THREE.Geometry(),material,weighti=0.0,weight0=20.0,pileup_weight=0.2,source=0,target=0;
    var paths=new THREE.CurvePath();
    const radius0=2.5,segments0=64,rings0=64;
    var min_year=2010,max_year=2018,n_year=max_year-min_year+1,year=min_year,n_countries=0,theta,bn=new THREE.Vector3();
    var group_text=new THREE.Group();
    var loader_font=new THREE.FontLoader();
    var mesh_country,country,material_country,data_pubmed_graph,publications=[],n_publications,mean_publications=0;
    var rC=new THREE.Vector3(),LATi=0.0,LONi=0.0,index;
    var mesh_text;
    var i_word=0,n_words,words=[];
    var text='',text_buffer='',list_keywords='',intersects;
    var n_forests,forest_coverage=[],n_forest_coverage=[],global_ice,volume;
    var myButton,myButtonFontSize='10px';
    var data_json,data_json_w,pairwize_year=[],n_pairwize_year=0,pileups_year=[],n_pileups_year=0,ii,n_curves,n_count;

    initializing_description();

    var colors=["#6666ff","#d98c8c","#66ff66","#ff66a3","#66ccff","#ffc266","#996600","#ffb366","#8585e0","#ff66ff","#a3a3c2","#ff8c66","#b366ff","#006699","#cc99ff","#669900","#ccccff","#ff5050","#9933ff","#33cc33","#0099cc"];
    var n_colors=colors.length;

      <!-- make scene -->
      var scene=new THREE.Scene();
      scene.background=new THREE.Color(0x000000);
      <!-- make camera -->
      var Xcamera=0.0;
      var Ycamera=0.0;
      var Zcamera=1000.0;
      var Rcamera=Math.sqrt(Xcamera*Xcamera+Ycamera*Ycamera+Zcamera*Zcamera);
      var camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
      camera.position.set(Xcamera,Ycamera,Zcamera);
      camera.lookAt(new THREE.Vector3(0,0,0));
      scene.add(camera);
      <!-- make light -->
      var DirectionalLight=new THREE.DirectionalLight(0xffffff,1);
      DirectionalLight.position.set(camera.position);
      DirectionalLight.lookAt(new THREE.Vector3(0,0,0));
      scene.add(DirectionalLight);
      <!-- make render -->
      var renderer=new THREE.WebGLRenderer({antialias:true});
      var container=document.getElementById('container');
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth,window.innerHeight);
      container.appendChild(renderer.domElement);
      <!-- make globe -->
      const radius=200,segments=128,rings=128;
      var globe=new THREE.Group();
      <!-- Loading the world map texture -->
      var loader=new THREE.TextureLoader();
      loader.crossOrigin="";
      loader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57735/land_ocean_ice_cloud_2048.jpg',
      <!-- loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Simple_world_map.svg/2000px-Simple_world_map.svg.png', -->
      function(texture){
      var sphere=new THREE.SphereGeometry(radius,segments,rings);
      <!-- var material=new THREE.MeshBasicMaterial({map:texture,overdraw:0.5}); -->
      var material=new THREE.MeshBasicMaterial({map:texture,wireframe:false});
      var mesh=new THREE.Mesh(sphere,material);
      globe.add(mesh);
      },
      function(error){console.log(error)}
      );
      globe.position.set(0,0,0);

      <!-- https://www.ncdc.noaa.gov/cag/global/time-series/globe/land/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017 -->
      var temp_anom_land={"description":{"title":"Global Land Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.62","2001":"0.81","2002":"0.92","2003":"0.88","2004":"0.79","2005":"1.03","2006":"0.90","2007":"1.08","2008":"0.85","2009":"0.87","2010":"1.07","2011":"0.89","2012":"0.90","2013":"0.98","2014":"1.00","2015":"1.34","2016":"1.44","2017":"1.31"}};
      <!-- https://www.ncdc.noaa.gov/cag/global/time-series/globe/ocean/ytd/12/2000-2018.json?trend=true&trend_base=10&firsttrendyear=1880&lasttrendyear=2017 -->
      var temp_anom_ocean={"description":{"title":"Global Ocean Temperature Anomalies, January-December","units":"Degrees Celsius","base_period":"1901-2000","missing":-999},"data":{"2000":"0.35","2001":"0.44","2002":"0.48","2003":"0.51","2004":"0.49","2005":"0.51","2006":"0.50","2007":"0.43","2008":"0.42","2009":"0.55","2010":"0.56","2011":"0.46","2012":"0.51","2013":"0.55","2014":"0.64","2015":"0.74","2016":"0.76","2017":"0.67"}};
      
      <!-- graph of the pudmed -->
      function requestJSON(callback){
      var xhr=new XMLHttpRequest();
      xhr.responseType='json';
      xhr.onreadystatechange=function(){
      if(xhr.readyState===4 && (xhr.status===200 || xhr.status===0)){
      callback(xhr.response);
      }
      };
      xhr.open('GET','http://localhost:8000/all.json',true);
      <!-- xhr.setRequestHeader('Access-Control-Allow-Methods','GET'); -->
      <!-- xhr.setRequestHeader('Content-Type','application/json'); -->
      xhr.send(null);
      };
      
      function readJSON(data){
      
      data_json=data;

      <!-- reading the # of publications per year -->
      n_publications=data_json['publications'].length;
      for(var i=0;i<n_publications;i++) publications.push(0);
      for(var i=0;i<n_publications;i++) if(data_json['publications'][i]['year']>=min_year) publications[data_json['publications'][i]['year']-min_year]=data_json['publications'][i]['value'];
      for(var t=0;t<n_year;t++)	mean_publications+=publications[t]/n_year;
      document.getElementById('publications').innerHTML='# publications : '.concat(publications[year-min_year].toString());
      
      <!-- reading the keywords -->
      n_words=data_json['keywords'].length;
      for(var i=0;i<n_words;i++) words.push(data_json['keywords'][i]['id']);
      <!-- words=words.sort(); -->
      <!-- list_keywords=''; -->
      <!-- for(var i=0;i<n_words;i++) list_keywords=list_keywords+words[i]+'<br>'; -->
      <!-- document.getElementById('keywords').innerHTML=list_keywords;xs -->
      for(var i=0;i<n_words;i++){
      word=words[i];
      if(i%1===0) document.getElementById('keywords').appendChild(document.createElement('br'));
      myButton=document.createElement('span');
      myButton.className='button';
      myButton.style.color='#fff';
      myButton.style.cursor='pointer';
      myButton.id=word;
      myButton.innerHTML=word;
      myButton.style.fontSize=myButtonFontSize;
      document.getElementById('keywords').appendChild(myButton);
      document.getElementById(word).addEventListener('click',highlight,false);
      }
      word=words[i_word];
      document.getElementById('WORD').innerHTML=word;

      <!-- initial year -->
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
      <!-- calculing the forest coverage -->
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
      <!-- https://www.ncdc.noaa.gov/snow-and-ice/extent/sea-ice/G/0.json -->
      global_surface_ice=data_json['ice'];
      for(var i=0;i<global_surface_ice.length;i++){
      if(global_surface_ice[i]['year']==year) document.getElementById('ice surface (million of km2)').innerHTML='ice surface : '.concat((global_surface_ice[i]['surface'].toPrecision(3)).toString(),' million of km2');
      }
      
      <!-- making the countries (http://www.csgnetwork.com/llinfotable.html) SOUTH:- NORTH:+ and WEST:- EAST:+ -->
      n_countries=data_json['nodes'].length;
      console.log(n_countries);
      console.log(n_countries*(n_countries-1)/2);
      console.log(pairwize);
      console.log(pileups);
      for(var i=0;i<n_countries;i++){
	LATi=0.5*Math.PI-data_json['LL'][i]['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+data_json['LL'][i]['lon']*Math.PI/180.0;<!-- I do not understand the 0.5*Math.PI but at least it works -->
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
      }

      data_json_w=data_json[word];
      console.log(data_json_w);

      <!-- making the paths between countries (initialisation) -->
      <!-- http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualanom/tas/1990/2000/USA.json -->
      <!-- https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api -->
      <!-- https://www.ncdc.noaa.gov/cag/global/ -->
      <!-- https://data.worldbank.org/indicator/AG.LND.FRST.ZS -->
      var j=0;
      for(var i=0;i<pairwize[i_word];i++){
      if(data_json_w['links'][i]['year']===year){
      <!-- Starting and target points -->
      source=data_json_w['links'][i]['source'];
      target=data_json_w['links'][i]['target'];
      index=n_countries*Math.min(source,target)+Math.max(source,target);
      source=data_json['LL'][source];
      target=data_json['LL'][target];
      LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
      LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
      vS.setX(Math.sin(LATi)*Math.sin(LONi));
      vS.setY(Math.cos(LATi));
      vS.setZ(Math.sin(LATi)*Math.cos(LONi));
      LATi=0.5*Math.PI-target['lat']*Math.PI/180.0;
      LONi=0.5*Math.PI+target['lon']*Math.PI/180.0;
      vT.setX(Math.sin(LATi)*Math.sin(LONi));
      vT.setY(Math.cos(LATi));
      vT.setZ(Math.sin(LATi)*Math.cos(LONi));
      console.log([-1,j,vS,vT]);
      <!-- mid-point -->
      theta=Math.acos(vS.x*vT.x+vS.y*vT.y+vS.z*vT.z);
      bn.setX(vS.y*vT.z-vS.z*vT.y);
      bn.setY(vS.z*vT.x-vS.x*vT.z);
      bn.setZ(vS.x*vT.y-vS.y*vT.x);
      bn.normalize();
      weighti=radius*theta/radius;
      cvS.copy(vS);
      cvS.applyAxisAngle(bn,0.33*theta);
      cvS.multiplyScalar(radius*(1.0+weighti));
      cvT.copy(vS);
      cvT.applyAxisAngle(bn,0.66*theta);
      cvT.multiplyScalar(radius*(1.0+weighti));
      mST.copy(vS);
      mST.applyAxisAngle(bn,0.5*theta);
      mST.multiplyScalar(radius*(1.0+weighti));
      vS.multiplyScalar(radius);
      vT.multiplyScalar(radius);
      console.log([-2,j,vS,vT]);
      <!-- Bezier curves -->
      <!-- paths.add(new THREE.CubicBezierCurve3(vS,cvS,cvT,vT)); -->
      paths.add(new THREE.QuadraticBezierCurve3(vS,mST,vT));
      <!-- paths.add(new THREE.SplineCurve([vS,cvS,cvT,vT])); -->
      geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[j].getPoints(n_points));
      source=data_json['nodes'][data_json_w['links'][i]['source']]['id'];
      target=data_json['nodes'][data_json_w['links'][i]['target']]['id'];
      group_links.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:colors[index%n_colors]})));
      group_links.children[j].name=source.concat(' with ',target.concat(' : ',data_json_w['links'][i]['value'].toString()));
      <!-- making the moving points (initialisation) -->
      volume=weight0*Math.cbrt(3.0*data_json_w['links'][i]['value']/(4.0*Math.PI));
      group_mesh.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),group_links.children[j].material));
      count.push(0);
      delta_count.push(parseInt(volume));
      j=j+1;
      }<!-- Fi year -->
      }<!-- Rof i -->
      <!-- making the pileup for each country (initialisation) -->
      var j=0;
      for(var i=0;i<pileups[i_word];i++){
      if(data_json_w['pileups'][i]['year']===year){
      <!-- Starting and target points -->
      source=data_json['LL'][data_json_w['pileups'][i]['country']];
      LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
      LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
      vS.setX(Math.sin(LATi)*Math.sin(LONi));
      vS.setY(Math.cos(LATi));
      vS.setZ(Math.sin(LATi)*Math.cos(LONi));
      vS.multiplyScalar(radius);
      weighti=Math.log(data_json_w['pileups'][i]['value'])/Math.log(2.0);
      vT.setX(Math.sin(LATi)*Math.sin(LONi));
      vT.setY(Math.cos(LATi));
      vT.setZ(Math.sin(LATi)*Math.cos(LONi));
      vT.multiplyScalar(radius*(1.0+pileup_weight*weighti));
      <!-- Lines -->
      lines.vertices=[];
      lines.vertices.push(vS);
      lines.vertices.push(vT);
      source=data_json['LL'][data_json_w['pileups'][i]['country']]['id'];
      if(source==='facebook') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0x0000ff})));
      if(source==='google') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0x00ff00})));
      if(source!='facebook' && source!='google') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0xffffff})));
      group_pileups.children[j].name=source.concat(' : ',j.toString());
      j=j+1;
      }
      }

      globe.add(group_links);
      globe.add(group_pileups);
      globe.add(group_mesh);
      scene.add(globe);

      document.addEventListener('mousemove',RotateOnMouseMove);
      document.addEventListener('mousedown',OnMouseDown);
      document.addEventListener('mouseup',OnMouseUp);
      document.addEventListener('mouseup',function(e){DraggingMouse=false;});
      document.addEventListener('mousewheel',ZoomOnMouseWheel);
      document.addEventListener('keyup',MoveOnKeyboardKeys);
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
      };
      function change_keyword(dw){
      i_word+=dw;
      if(i_word===n_words) i_word=0;
      if(i_word===-1) i_word=n_words-1;
      word=words[i_word];
      document.getElementById('WORD').innerHTML=word;
      data_json_w=data_json[word];
      initializing_description();
      }
      <!-- making the year text -->
      <!-- function change_year(){ -->
      <!-- <\!-- loader_font.load("https://threejs.org/examples/fonts/opyearr_bold.typeface.json", -\-> -->
      <!-- loader_font.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", -->
      <!-- function(font){ -->
      <!-- <\!-- mesh_text=new THREE.Mesh(new THREE.TextGeometry((year.toString()).concat(" : # publications about ",word),{ -\-> -->
      <!-- mesh_text=new THREE.Mesh(new THREE.TextGeometry(year.toString(),{ -->
      <!-- font:font, -->
      <!-- size:80, -->
      <!-- height:5, -->
      <!-- curveSegments:120, -->
      <!-- bevelEnabled:true, -->
      <!-- bevelThickness:1, -->
      <!-- bevelSize:8, -->
      <!-- bevelSegments:5 -->
      <!-- }),new THREE.MeshBasicMaterial({color:0xffffff})); -->
      <!-- mesh_text.position.set(-1000.0,500.0,0.0); -->
      <!-- group_text.add(mesh_text); -->
      <!-- }, -->
      <!-- function(error){ -->
      <!-- console.log(error); -->
      <!-- }); -->
      <!-- <\!-- scene.add(group_text); -\-> -->
      <!-- }; -->
      <!-- changing year -->
      function MoveOnKeyboardKeys(e){
      switch(e.keyCode){
      case 37:
      year-=1;
      break;
      case 39:
      year+=1;
      break;
      case 65:
      year+=1;
      break;
      case 90:
      year-=1;
      break;
      case 81:
      i_word+=1;
      break;
      case 83:
      i_word-=1;
      break;
      };
      i_word=Math.min(n_words-1,Math.max(0,i_word));
      word=words[i_word];
      document.getElementById('WORD').innerHTML=word;
      data_json_w=data_json[word];
      if(year>max_year) year=min_year;
      if(year<min_year) year=max_year;
      document.getElementById('YEAR').innerHTML=year.toString();
      document.getElementById('publications').innerHTML='# publications : '.concat(publications[year-min_year].toString());
      <!-- scene.remove(group_text.children[0]); -->
      <!-- group_text.remove(group_text.children[0]); -->
      <!-- change_year(); -->
      initializing_description();
      list_pileups_year();
      list_pairwize_year();
      change_links();
      };

      <!-- making the new links and the new pileups -->
      function change_links(){
      <!-- making the pileup for each country -->
      group_length=group_pileups.children.length;
      for(var i=0;i<n_pileups_year;i++){
      ii=pileups_year[i];
      source=data_json['LL'][data_json_w['pileups'][ii]['country']];<!-- Starting and target points -->
      LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
      LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
      vS.setX(Math.sin(LATi)*Math.sin(LONi));
      vS.setY(Math.cos(LATi));
      vS.setZ(Math.sin(LATi)*Math.cos(LONi));
      vS.multiplyScalar(radius);
      weighti=Math.log(data_json_w['pileups'][ii]['value'])/Math.log(2.0);
      vT.setX(Math.sin(LATi)*Math.sin(LONi));
      vT.setY(Math.cos(LATi));
      vT.setZ(Math.sin(LATi)*Math.cos(LONi));
      vT.multiplyScalar(radius*(1.0+pileup_weight*weighti));console.log([vS,vT]);
      <!-- Lines -->
      lines.vertices=[];
      lines.vertices.push(vS);
      lines.vertices.push(vT);
      source=data_json_w['pileups'][ii]['country'];
      if(i<group_length){
	group_pileups.children[i].geometry=lines;
        if(source==='facebook') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0x0000ff});
        if(source==='google') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0x00ff00});
        if(source!='facebook' && source!='google') group_pileups.children[i].material=new THREE.LineBasicMaterial({color:0xffffff});
      }else{
        if(source==='facebook') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0x0000ff})));
        if(source==='google') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0x00ff00})));
        if(source!='facebook' && source!='google') group_pileups.add(new THREE.Line(lines,new THREE.LineBasicMaterial({color:0xffffff})));
	group_length+=1;
      }
      group_pileups.children[i].name=data_json['LL'][data_json_w['pileups'][ii]['country']]['id'].concat(' : ',ii.toString());
      }
      for(var i=(group_length-1);i>=n_pileups_year;i--){
      scene.remove(group_pileups.children[i]);
      group_pileups.remove(group_pileups.children[i]);
      }
      <!-- making the links -->
      group_length=group_links.children.length;
      n_curves=paths.curves.length;
      n_count=count.length;
      for(var i=0;i<n_pairwize_year;i++){
	ii=pairwize_year[i];
        <!-- Starting and target points -->
	source=data_json_w['links'][ii]['source'];
	target=data_json_w['links'][ii]['target'];
	index=n_countries*Math.min(source,target)+Math.max(source,target);
	source=data_json['LL'][source];
	target=data_json['LL'][target];
	LATi=0.5*Math.PI-source['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+source['lon']*Math.PI/180.0;
	vS.setX(Math.sin(LATi)*Math.sin(LONi));
	vS.setY(Math.cos(LATi));
	vS.setZ(Math.sin(LATi)*Math.cos(LONi));
	<!-- vS[0]=Math.sin(LATi)*Math.sin(LONi); -->
	<!-- vS[1]=Math.cos(LATi); -->
	<!-- vS[2]=Math.sin(LATi)*Math.cos(LONi); -->
	<!-- vS=new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)); -->
	LATi=0.5*Math.PI-target['lat']*Math.PI/180.0;
	LONi=0.5*Math.PI+target['lon']*Math.PI/180.0;
	vT.setX(Math.sin(LATi)*Math.sin(LONi));
	vT.setY(Math.cos(LATi));
	vT.setZ(Math.sin(LATi)*Math.cos(LONi));
	<!-- vT[0]=Math.sin(LATi)*Math.sin(LONi); -->
	<!-- vT[1]=Math.cos(LATi); -->
	<!-- vT[2]=Math.sin(LATi)*Math.cos(LONi); -->
	<!-- vT=new THREE.Vector3(Math.sin(LATi)*Math.sin(LONi),Math.cos(LATi),Math.sin(LATi)*Math.cos(LONi)); -->
	<!-- mid-point -->
	theta=Math.acos(vS.x*vT.x+vS.y*vT.y+vS.z*vT.z);
	bn.setX(vS.y*vT.z-vS.z*vT.y);
	bn.setY(vS.z*vT.x-vS.x*vT.z);
	bn.setZ(vS.x*vT.y-vS.y*vT.x);
	bn.normalize();
	weighti=radius*theta/radius;
	<!-- cvS=vS.clone(); -->
	cvS.copy(vS);
	cvS.applyAxisAngle(bn,0.33*theta);
	cvS.multiplyScalar(radius*(1.0+weighti));
	<!-- cvT=vS.clone(); -->
	cvT.copy(vS);
	cvT.applyAxisAngle(bn,0.66*theta);
	cvT.multiplyScalar(radius*(1.0+weighti));
	<!-- mST=vS.clone(); -->
	mST.copy(vS);
	mST.applyAxisAngle(bn,0.5*theta);
	mST.multiplyScalar(radius*(1.0+weighti));
	vS.multiplyScalar(radius);
	vT.multiplyScalar(radius);
	<!-- console.log([vS.x,mST.x,vT.x]); -->
	<!-- Bezier curves -->
	volume=weight0*Math.cbrt(3.0*data_json_w['links'][ii]['value']/(4.0*Math.PI));
	<!-- if(i<paths.curves.length) paths.curves[i]=new THREE.CubicBezierCurve3(vS,cvS,cvT,vT); -->
	<!-- else paths.add(new THREE.CubicBezierCurve3(vS,cvS,cvT,vT)); -->
	if(i<n_curves) paths.curves[i]=new THREE.QuadraticBezierCurve3(vS,mST,vT);
        else{
	paths.add(new THREE.QuadraticBezierCurve3(vS,mST,vT));
	n_curves+=1;
	}
	if(i<n_count){
	count[i]=0;
	delta_count[i]=parseInt(volume);
	}else{
	count.push(0);
	delta_count.push(parseInt(volume));
	n_count+=1;
	}
	if(i<group_length){
      	       group_links.children[i].geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
	       source=data_json['nodes'][data_json_w['links'][ii]['source']]['id'];
	       target=data_json['nodes'][data_json_w['links'][ii]['target']]['id'];
      	       group_links.children[i].material=new THREE.LineBasicMaterial({color:colors[index%n_colors]});
	       group_mesh.children[i].material=group_links.children[i].material;
	       group_mesh.children[i].geometry.parameters.radius=volume;
	}else{
      	       geometry=new THREE.BufferGeometry().setFromPoints(paths.curves[i].getPoints(n_points));
	       source=data_json['nodes'][data_json_w['links'][ii]['source']]['id'];
	       target=data_json['nodes'][data_json_w['links'][ii]['target']]['id'];
      	       group_links.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:colors[index%n_colors]})));
	       group_mesh.add(new THREE.Mesh(new THREE.SphereGeometry(volume,segments0,rings0),group_links.children[i].material));       
	       group_length+=1;
        }
	group_links.children[i].name=source.concat(' with ',target.concat(' : ',data_json_w['links'][ii]['value'].toString()));
      }
      <!-- if(year===2013) console.log(paths.curves[0].getPoints(n_points)); -->
      <!-- if(year===2013) console.log(paths.curves[1].getPoints(n_points)); -->
      for(var i=(group_length-1);i>=n_pairwize_year;i--){
      scene.remove(group_links.children[i]);
      group_links.remove(group_links.children[i]);
      scene.remove(group_mesh.children[i]);
      group_mesh.remove(group_mesh.children[i]);
      }
      };

      <!-- list the pairwize for the year -->
      function list_pairwize_year(){
      pairwize_year=[];
      for(var i=0;i<pairwize[i_word];i++) if(data_json_w['links'][i]['year']===year) pairwize_year.push(i);
      n_pairwize_year=pairwize_year.length;
      };
      <!-- list the pileups for the year -->
      function list_pileups_year(){
      pileups_year=[];
      for(var i=0;i<pileups[i_word];i++) if(data_json_w['pileups'][i]['year']===year) pileups_year.push(i);
      n_pileups_year=pileups_year.length;
      };

      function OnMouseUp(e){
      <!-- console.log(e); -->
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

      <!-- Rotating mouse -->
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

      <!-- zooming mouse -->
      function ZoomOnMouseWheel(e){
      <!-- camera.fov+=e.wheelDelta*ZoomSensitivity; -->
      <!-- camera.projectionMatrix=new THREE.Matrix4().makePerspective(camera.fov,window.innerWidth/window.innerHeight,camera.near,camera.far); -->
      camera.position.set(camera.position.x,camera.position.y,camera.position.z-Math.sign(camera.position.z)*e.wheelDelta);
      camera.lookAt(new THREE.Vector3(0,0,0));
      };

      <!-- making the render -->
      function render(){
      for(var i=0;i<n_pairwize_year;i++){
      if(count[i]>=n_points || count[i]<0) delta_count[i]*=-1;
      count[i]+=delta_count[i];
      paths.curves[i].getPoint(count[i]/n_points,pt);
      group_mesh.children[i].position.set(pt.x,pt.y,pt.z);
      }
      renderer.render(scene,camera);
      };
		      
      function update(){
      requestAnimationFrame(update);
      render();
      };
      <!-- year - 1 -->
      document.getElementById('yearm1').addEventListener('click',function(){
      change_year(-1);
      list_pileups_year();
      list_pairwize_year();
      change_links();
      },false);
      <!-- year + 1 -->
      document.getElementById('yearp1').addEventListener('click',function(){
      change_year(1);
      list_pileups_year();
      list_pairwize_year();
      change_links();
      },false);
      function change_year(dt){
      year+=dt;
      if(year>max_year) year=min_year;
      if(year<min_year)year=max_year;
      description='# publications*mean('+(year.toString())+')/publications('+(year.toString())+') :';
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
      }

      <!-- initializing description -->
      function initializing_description(){
      description='# publications*mean('+(year.toString())+')/publications('+(year.toString())+') :';
      text=description.concat('<br>');
      document.getElementById('pileups').innerHTML=text;
      };

      <!-- highlighting a keyword on mouse click -->
      function highlight(e){
      console.log(e.target.id);
      document.getElementById(word).style.fontSize='10px';
      for(var i=0;i<n_words;i++) if(e.target.id===words[i]) i_word=i;
      word=words[i_word];
      data_json_w=data_json[word];
      document.getElementById('WORD').innerHTML=word;
      initializing_description();
      e.target.style.fontSize='30px';
      list_pileups_year();
      list_pairwize_year();
      change_links();
      };

      list_pileups_year();
      list_pairwize_year();
      update();
      requestJSON(readJSON);

    </script>
  </body>
</html>
