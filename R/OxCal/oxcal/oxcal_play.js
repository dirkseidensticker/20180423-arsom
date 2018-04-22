 var playerMin,playerMax,ocMapWindow;
 var playerDisable=false;

function player()
{
 var i,el,v,prob,opac,mx,k,kmin,kmax,cm,j;
 mx=plotOptions.probMax;
 if(!plotOptions.mapPlotNormalise){mx=1;};
 cm=plotOptions.currentMax;
 if(ocMapWindow.plotOptions.multiPlot)
 {
  kmin=1;
  kmax=1+Math.round((plotOptions.player_max-plotOptions.player_min)
  	/plotOptions.mapPlotMultiIncr);
  cm=Math.round(cm/kmax);
 }
 else
 {
  kmin=0;kmax=0;
 };
 if(plotOptions.current<0){plotOptions.current=0;};
 if(plotOptions.current>cm){plotOptions.current=cm;};
 ocMapWindow.calcData(false);
 ocMapWindow.frames[0].plotCalc=ocMapWindow.plotCalc;
 ocMapWindow.frames[0].draw();
 for(k=kmin;k<=kmax;k++)
 {
  v=plotOptions.player_min
  	+(plotOptions.player_max-plotOptions.player_min)
  	*plotOptions.current/plotOptions.currentMax;
  if(k>0){v+=(k-1)*plotOptions.mapPlotMultiIncr;};
  if(k)
  {
   el=ocMapWindow.frames[0].document.getElementById("title"+k);
  }
  else
  {
   el=ocMapWindow.frames[0].document.getElementById("title");
  };
  if(el)
  {
   if(el.firstChild){el.removeChild(el.firstChild);};
   el.appendChild(ocMapWindow.frames[0].document.createTextNode(
   	showDate(showDateT(v,"date"),"date")));
  };
  if(plotOptions.player_proxy)
  {
   if(ocMapWindow.plotColor.autoz)
   {
    findProxyLevels(ocMapWindow.plotColor,ocMapWindow.plotData);
    ocMapWindow.setValues(ocMapWindow.colorSpec,true);
   };
   for(i=0;i<ocMapWindow.plotData.length;i++)
   {
    if(k)
    {
     el=ocMapWindow.frames[0].document.getElementById(
    	ocMapWindow.plotData[i].id.replace("_proxy","")+"_loc_"+k);
    }
    else
    {
     el=ocMapWindow.frames[0].document.getElementById(
    	ocMapWindow.plotData[i].id.replace("_proxy","")+"_loc");
    };
    if(el)
    {
     setProxyColor(el,ocMapWindow.plotData[i].id,v,k);
    };
   };
   continue;
  };
  for(i=0;i<ocd.length;i++)
  {
   if(!ocd[i]){continue;};
   if(!ocd[i].data){continue;};
   if(ocMapWindow.frames[0].firstTime)
   {
    ocd[i].data.shown=true;
   };
   prob=ocdVal(i,v);
   if(k)
   {
    el=ocMapWindow.frames[0].document.getElementById("ocd"+i+"_"+k);
   }
   else
   {
    el=ocMapWindow.frames[0].document.getElementById("ocd"+i);
   };
   if(el)
   {
    if((prob/mx)*plotOptions.mapPlotCircleZoom > 0.001)
    {
     if(plotColor.dz_calc)
     {
      el.style.opacity=prob/ocdValMax(i);
     }
     else
     {
      if(!ocd[i].data.marker)
      {
       el.setAttributeNS(null,"r",Math.sqrt(prob/mx)*10   *ocMapWindow.frames[0].font_scale*plotOptions.mapPlotCircleZoom);
      }
      else
      {
       if((ocd[i].op=="Sum")&&(plotOptions.mapPlotNormalise))
       {
        el.style.fillOpacity=prob/(2*ocdValMax(i));
        el.style.strokeOpacity=prob/ocdValMax(i);
       }
       else
       {
        el.style.fillOpacity=(prob/(2*mx));
        el.style.strokeOpacity=prob/mx;
       };
      };
     };
     el.style.display="block";
     ocd[i].data.shown=true;
    }
    else
    {
     if(ocd[i].data.shown)
     {
      el.style.display="none";
     };
    };
   };
  };
 };
 ocMapWindow.frames[0].firstTime=false;
 ocMapWindow.playerShowPlace(100*plotOptions.current/plotOptions.currentMax,
 	showDate(showDateT(v,"date"),"date"));
 if(plotOptions.backwards){plotOptions.current--;}else{plotOptions.current++;};
 if((plotOptions.current<0)||(plotOptions.current>cm))
 {
  if(ocMapWindow.ticker)
  {ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 };
};
function playerWeight(id,multi)
{
 var v;
 v=plotOptions.player_min
  	+(plotOptions.player_max-plotOptions.player_min)
  	*plotOptions.current/plotOptions.currentMax;
 if(typeof(multi)!='undefined')
 {
  v+=multi*plotOptions.mapPlotMultiIncr;
 };
 i=Number(id.replace('ocd',''));
 if(i){return ocdVal(i,v,true);}else{return 1;};
};
function playerRewind()
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=true;
 ocMapWindow.ticker=ocMapWindow.setInterval(player,100);
};
function playerBack()
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=true;
 ocMapWindow.ticker=ocMapWindow.setInterval(player,500);
};
function playerNudgeBack()
{
 if(!plotOptions.backwards){plotOptions.current++;plotOptions.current++;};
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=true;
 player();
};
function playerNudgeForward()
{
 if(plotOptions.backwards){plotOptions.current--;plotOptions.current--;};
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=false;
 player();
};
function playerPlay()
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=false;
 ocMapWindow.ticker=ocMapWindow.setInterval(player,500);
};
function playerPause()
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
};
function playerFastForward()
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=false;
 ocMapWindow.ticker=ocMapWindow.setInterval(player,100);
};
function playerSetPlace(val)
{
 if(ocMapWindow.ticker){ocMapWindow.clearInterval(ocMapWindow.ticker);ocMapWindow.ticker=false;};
 plotOptions.backwards=false;
 plotOptions.current=Math.round(val*plotOptions.currentMax/100);
 player();
};

function findProxyLevels(pc,pd)
{
 var i,j,r;
 pc.showKey=false;
 pc.zlabel=pc.z_calc;
 pc.showKey=true;
 pc.minz="auto";
 pc.maxz="auto";
 pc.min_col="rgb(0,0,255)";
 pc.max_col="rgb(255,0,0)";
 for(i=0;i<pd.length;i++)
 {
  for(j=0;j<pd[i].data.length;j++)
  {
   if((typeof(pd[i].data[j][pc.z_calc])=='undefined')||
   	isNaN(pd[i].data[j][pc.z_calc])){continue;};
   if((pc.minz=="auto")||(pd[i].data[j][pc.z_calc]<pc.minz))
   {
    pc.minz=pd[i].data[j][pc.z_calc];
   };
   if((pc.maxz=="auto")||(pd[i].data[j][pc.z_calc]>pc.maxz))
   {
    pc.maxz=pd[i].data[j][pc.z_calc];
   };
  };
 };
 if(pc.autoz==2)
 {
  r=pc.minz;
  pc.minz=pc.maxz;
  pc.maxz=r;
 };
 pc.autoz=0;
};

function setProxyColor(el,id,v,k)
{
 var i,min,max,mid,incr,val,tst,rev;
 for(i=0;i<ocMapWindow.plotData.length;i++)
 {
  if(ocMapWindow.plotData[i].id==id)
  {
   if(!ocMapWindow.plotData[i].data.length){continue;};
   if(typeof(ocMapWindow.plotData[i].data[0][ocMapWindow.plotColor.z_calc])=='undefined')
   {continue;};
   min=0;max=ocMapWindow.plotData[i].data.length;
   while(isNaN(ocMapWindow.plotData[i].data[min][plotOptions.player_timescale])&&(min<max-1))
   {min++;};
   while(isNaN(ocMapWindow.plotData[i].data[max-1][plotOptions.player_timescale])&&(min<max-1))
   {max--;};
   rev=ocMapWindow.plotData[i].data[min][plotOptions.player_timescale] >  
   		ocMapWindow.plotData[i].data[max-1][plotOptions.player_timescale];
   while(max>min+1)
   {
    mid=Math.floor((max+min)/2);
    tst=ocMapWindow.plotData[i].data[mid][plotOptions.player_timescale];
    if(rev)
    {
     if(tst<v){max=mid;}else{if(tst>v){min=mid;}else{break;};};
    }
    else
    {
     if(tst>v){max=mid;}else{if(tst<v){min=mid;}else{break;};};
    };
   };
   mid=Math.floor((max+min)/2);
   val=ocMapWindow.plotData[i].data[mid][ocMapWindow.plotColor.z_calc];
   if((mid+1)<ocMapWindow.plotData[i].data.length)
   {
    val+=(ocMapWindow.plotData[i].data[mid+1][ocMapWindow.plotColor.z_calc]-val)*
     (v-ocMapWindow.plotData[i].data[mid][plotOptions.player_timescale])/
     (ocMapWindow.plotData[i].data[mid+1][plotOptions.player_timescale]- ocMapWindow.plotData[i].data[mid][plotOptions.player_timescale]);
   }
   else
   {
    val="NaN";
   };
   if((mid==0)||isNaN(ocMapWindow.plotData[i].data[mid-1][ocMapWindow.plotColor.z_calc]))
   {
    val="NaN";
   };
   if(k)
   {
    el=ocMapWindow.frames[0].document.getElementById(id.replace("_proxy","")+"_loc_"+k);
    if(!el){return;};
   };
   val=ocMapWindow.frames[0].colorValue(val);
   el.setAttributeNS(null,"style","fill:"+val+";fill-opacity:1;stroke:"
       +val+";stroke-opacity:1;display:block");  
   el.setAttributeNS(null,"r",4*ocMapWindow.frames[0].font_scale*
   		plotOptions.mapPlotCircleZoom);
  };
 };
};
