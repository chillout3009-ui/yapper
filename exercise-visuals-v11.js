/* ARC v12.3 — exercise-specific schematic illustrations (legacy filename kept for cache compatibility).
   Original SVG schematics informed by established exercise references (ACE, CrossFit, AAOS, Mayo Clinic, NHS).
   They are identification aids, not a substitute for coaching or clinical instruction. */
(function(){
  const C={ink:'#172033',muted:'#64748b',equip:'#52627a',accent:'#3157e8',accent2:'#c9f55d',skin:'#fff',line:'#d7deea',start:'#eef3ff',end:'#f3f8e9',warn:'#ff825f'};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const line=(x1,y1,x2,y2,cls='p',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" ${extra}/>`;
  const circle=(x,y,r=6,cls='p',extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}" ${extra}/>`;
  const path=(d,cls='e',extra='')=>`<path d="${d}" class="${cls}" ${extra}/>`;
  const rect=(x,y,w,h,rx=4,fill='none',stroke=C.equip)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2.4"/>`;
  const text=(x,y,s,anchor='middle',size=8,fill=C.muted,weight=800)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter,system-ui,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
  function person(q,ox=0,opacity=1){
    const g=(k)=>q[k]?[q[k][0]+ox,q[k][1]]:null; let s='';
    if(q.head){const a=g('head');s+=circle(a[0],a[1],q.hr||6,'p')}
    const segs=[['sh','hip'],['sh','el1'],['el1','wr1'],['sh','el2'],['el2','wr2'],['hip','kn1'],['kn1','an1'],['hip','kn2'],['kn2','an2']];
    for(const [a,b] of segs){if(q[a]&&q[b]){const A=g(a),B=g(b);s+=line(A[0],A[1],B[0],B[1],'p')}}
    if(q.foot1&&q.an1){const a=g('an1'),b=g('foot1');s+=line(a[0],a[1],b[0],b[1],'p')}
    if(q.foot2&&q.an2){const a=g('an2'),b=g('foot2');s+=line(a[0],a[1],b[0],b[1],'p')}
    return `<g opacity="${opacity}">${s}</g>`;
  }
  function dumbbell(x,y,rot=0){return `<g transform="translate(${x} ${y}) rotate(${rot})"><line x1="-8" y1="0" x2="8" y2="0" class="e"/><rect x="-11" y="-4" width="4" height="8" rx="1" fill="${C.equip}"/><rect x="7" y="-4" width="4" height="8" rx="1" fill="${C.equip}"/></g>`}
  function barbell(x1,y1,x2,y2){return `${line(x1,y1,x2,y2,'e')}<line x1="${x1+5}" y1="${y1-6}" x2="${x1+5}" y2="${y1+6}" class="e"/><line x1="${x2-5}" y1="${y2-6}" x2="${x2-5}" y2="${y2+6}" class="e"/>`}
  function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),h=7;return `<g stroke="${C.accent}" stroke-width="2.3" fill="none" stroke-linecap="round">${line(x1,y1,x2,y2,'a')}<path d="M${x2} ${y2}L${x2-h*Math.cos(a-.55)} ${y2-h*Math.sin(a-.55)}M${x2} ${y2}L${x2-h*Math.cos(a+.55)} ${y2-h*Math.sin(a+.55)}"/></g>`}
  function base(inner,badge='',note=''){
    return `<svg viewBox="0 0 320 180" role="img" aria-label="${esc(note||badge)}" xmlns="http://www.w3.org/2000/svg"><style>.p{stroke:${C.ink};fill:none;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.e{stroke:${C.equip};fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.a{stroke:${C.accent};fill:none}.ghost{stroke:${C.muted};opacity:.35;stroke-dasharray:4 4}</style><rect width="320" height="180" rx="18" fill="#f7f9fc"/><rect x="8" y="10" width="143" height="154" rx="14" fill="${C.start}"/><rect x="169" y="10" width="143" height="154" rx="14" fill="${C.end}"/>${text(79,26,lang()==='de'?'START':'START','middle',8,C.muted,900)}${text(240,26,lang()==='de'?'ENDE':'END','middle',8,C.muted,900)}${inner}<rect x="129" y="142" width="62" height="24" rx="12" fill="#fff" stroke="${C.line}"/>${text(160,158,badge,'middle',8,C.ink,900)}</svg>`;
  }
  const STAND={head:[76,46],sh:[76,59],hip:[76,92],el1:[61,72],wr1:[61,93],el2:[91,72],wr2:[91,93],kn1:[66,121],an1:[63,147],foot1:[55,150],kn2:[87,121],an2:[90,147],foot2:[98,150]};
  const SQUAT={head:[76,53],sh:[76,66],hip:[76,103],el1:[59,78],wr1:[50,69],el2:[93,78],wr2:[102,69],kn1:[55,121],an1:[48,147],foot1:[39,149],kn2:[97,121],an2:[104,147],foot2:[113,149]};
  const LUNGE={head:[75,47],sh:[75,60],hip:[75,94],el1:[60,73],wr1:[60,96],el2:[90,73],wr2:[90,96],kn1:[52,119],an1:[48,147],foot1:[38,149],kn2:[103,119],an2:[117,146],foot2:[126,149]};
  const OHP_END={...STAND,el1:[60,43],wr1:[59,27],el2:[92,43],wr2:[93,27]};
  const LATERAL_END={...STAND,el1:[48,61],wr1:[28,61],el2:[104,61],wr2:[124,61]};
  const CURL_END={...STAND,el1:[61,74],wr1:[67,57],el2:[91,74],wr2:[85,57]};
  const TRICEPS_START={...STAND,el1:[61,69],wr1:[61,55],el2:[91,69],wr2:[91,55]};
  const TRICEPS_END={...STAND,el1:[61,69],wr1:[61,94],el2:[91,69],wr2:[91,94]};
  const HINGE={head:[59,56],sh:[65,67],hip:[92,91],el1:[69,84],wr1:[61,108],el2:[81,79],wr2:[74,108],kn1:[78,119],an1:[72,147],foot1:[63,149],kn2:[98,121],an2:[103,147],foot2:[112,149]};
  const DL_START={head:[57,61],sh:[64,73],hip:[86,99],el1:[67,91],wr1:[64,122],el2:[78,89],wr2:[78,122],kn1:[69,121],an1:[65,148],foot1:[55,150],kn2:[94,121],an2:[100,148],foot2:[110,150]};
  const PLANK={head:[43,82],sh:[58,84],hip:[91,91],el1:[56,103],wr1:[56,120],el2:[64,104],wr2:[64,120],kn1:[115,95],an1:[136,105],foot1:[143,108]};
  const PUSH_BOTTOM={head:[43,98],sh:[58,100],hip:[91,107],el1:[53,116],wr1:[59,126],el2:[64,116],wr2:[70,126],kn1:[115,110],an1:[136,120],foot1:[143,123]};
  function equipBench(ox=0,incline=false){return `${line(24+ox,116,130+ox,incline?92:116,'e')}${line(36+ox,116,32+ox,149,'e')}${line(116+ox,incline?96:116,121+ox,149,'e')}`}
  function benchArt(kind){const inc=kind==='incline',db=kind!=='bar'; const start={head:[49,inc?82:101],sh:[63,inc?79:102],hip:[98,inc?99:106],el1:[67,inc?64:80],wr1:[69,inc?48:62],el2:[82,inc?65:80],wr2:[84,inc?48:62],kn1:[116,122],an1:[119,147],foot1:[128,149]};const end=JSON.parse(JSON.stringify(start));end.el1=[69,inc?66:87];end.wr1=[69,inc?68:91];end.el2=[83,inc?66:87];end.wr2=[83,inc?68:91];let a=person(start,0)+equipBench(0,inc),b=person(end,161)+equipBench(161,inc);if(db){a+=dumbbell(start.wr1[0],start.wr1[1])+dumbbell(start.wr2[0],start.wr2[1]);b+=dumbbell(end.wr1[0]+161,end.wr1[1])+dumbbell(end.wr2[0]+161,end.wr2[1])}else{a+=barbell(42,53,110,53);b+=barbell(42+161,91,110+161,91)}return base(a+b+arrow(145,78,168,78),kind==='bar'?'BAR':inc?'INCLINE DB':'DB',exName(kind==='bar'?'bench_bar':inc?'incline_db':'bench_db'))}
  function pressArt(id,equip='bar'){let a=person(STAND),b=person(OHP_END,161);if(equip==='bar'){a+=barbell(44,62,108,62);b+=barbell(44+161,27,108+161,27)}else if(equip==='db'){a+=dumbbell(61,58,90)+dumbbell(91,58,90);b+=dumbbell(59+161,27,90)+dumbbell(93+161,27,90)}else{a+=rect(20,45,22,78,6,'none')+line(42,56,61,60,'e')+line(42,56,91,60,'e');b+=rect(20+161,45,22,78,6,'none')+line(42+161,56,59+161,27,'e')+line(42+161,56,93+161,27,'e')}return base(a+b+arrow(145,62,168,42),equip==='machine'?'MACHINE':equip.toUpperCase(),exName(id))}
  function squatArt(id,style='back'){let a=person(STAND),b=person(SQUAT,161);if(style==='back'){a+=barbell(44,60,108,60);b+=barbell(44+161,67,108+161,67)}else if(style==='front'){a+=barbell(47,64,105,64);b+=barbell(47+161,70,105+161,70)}else if(style==='goblet'){a+=circle(76,67,8,'e');b+=circle(76+161,74,8,'e')}return base(a+b+arrow(145,76,168,96),style==='back'?'BACK BAR':style==='front'?'FRONT RACK':style==='goblet'?'GOBLET':'BODYWEIGHT',exName(id))}
  function machinePushArt(id,type){let a='',b='';if(type==='legpress'){const P1={head:[53,62],sh:[59,72],hip:[67,99],el1:[47,84],wr1:[45,101],kn1:[93,100],an1:[116,79],foot1:[122,72],kn2:[94,112],an2:[118,91],foot2:[124,84]};const P2={...P1,kn1:[79,104],an1:[93,91],foot1:[100,84],kn2:[81,115],an2:[96,104],foot2:[103,97]};a=person(P1)+path('M28 119L44 70h29l14 47M109 47l23 20-17 20','e')+line(112,64,123,77,'e');b=person(P2,161)+path('M189 119L205 70h29l14 47M270 47l23 20-17 20','e')+line(273,64,284,77,'e')}else{const P1=STAND,P2=SQUAT;a=person(P1)+path('M43 30h66l18 25v88M52 48h53','e');b=person(P2,161)+path('M204 30h66l18 25v88M213 48h53','e')}return base(a+b+arrow(145,80,168,97),type==='legpress'?'LEG PRESS':'HACK SQUAT',exName(id))}
  function lungeArt(id,bulg=false,rot=false){let a=person(STAND),b=person(LUNGE,161);if(bulg){a+=rect(104,111,33,8,3,'#fff');b+=rect(104+161,111,33,8,3,'#fff');b+=line(117+161,111,118+161,146,'p')}if(id==='lunge'||id==='bulgarian'){a+=dumbbell(61,94,90)+dumbbell(91,94,90);b+=dumbbell(60+161,97,90)+dumbbell(90+161,97,90)}if(rot){b+=path('M223 61Q252 42 277 62','a')+arrow(273,61,281,69)}return base(a+b+arrow(145,90,168,90),bulg?'REAR FOOT':rot?'ROTATE':'DB',exName(id))}
  function hingeArt(id,dead=false,single=false){const end=dead?STAND:HINGE;let a=person(dead?DL_START:STAND),b=person(end,161);if(single){const sl={head:[57,52],sh:[64,64],hip:[88,88],el1:[69,79],wr1:[69,104],el2:[78,76],wr2:[78,104],kn1:[77,117],an1:[73,147],foot1:[64,149],kn2:[108,91],an2:[133,80],foot2:[141,78]};b=person(sl,161);a+=dumbbell(61,95,90)+dumbbell(91,95,90);b+=dumbbell(69+161,104,90)+dumbbell(78+161,104,90)}else{a+=barbell(44,dead?123:97,108,dead?123:97);b+=barbell(44+161,dead?97:109,108+161,dead?97:109)}return base(a+b+arrow(145,95,168,82),single?'1-LEG RDL':dead?'DEADLIFT':'RDL',exName(id))}
  function pullupArt(id,chin=false,muscle=false,toes=false,scap=false){let start={head:[76,62],sh:[76,75],hip:[76,105],el1:[58,56],wr1:[50,36],el2:[94,56],wr2:[102,36],kn1:[68,127],an1:[66,149],kn2:[84,127],an2:[86,149]};let end=JSON.parse(JSON.stringify(start));if(muscle){end.head=[76,35];end.sh=[76,48];end.hip=[76,83];end.el1=[58,52];end.wr1=[51,59];end.el2=[94,52];end.wr2=[101,59]}else if(toes){end.kn1=[64,94];end.an1=[53,46];end.kn2=[88,94];end.an2=[99,46]}else if(scap){end.head=[76,57];end.sh=[76,70];end.hip=[76,101]}else{end.head=[76,43];end.sh=[76,56];end.hip=[76,91];end.el1=[59,58];end.wr1=[50,36];end.el2=[93,58];end.wr2=[102,36]}let a=person(start)+line(35,34,117,34,'e'),b=person(end,161)+line(35+161,34,117+161,34,'e');return base(a+b+arrow(145,78,168,62),muscle?'MUSCLE-UP':toes?'TOES→BAR':scap?'SCAP':chin?'CHIN-UP':'PULL-UP',exName(id))}
  function pushupArt(id,scap=false,mountain=false,crawl=false){let a=person(PLANK),b=person(PUSH_BOTTOM,161);if(scap){b=person({...PLANK,sh:[61,89],hip:[91,91]},161)}if(mountain){b=person({...PLANK,kn1:[80,101],an1:[70,111],foot1:[63,114]},161)}if(crawl){const c={head:[43,72],sh:[58,75],hip:[90,83],el1:[55,95],wr1:[43,112],el2:[67,94],wr2:[75,111],kn1:[109,95],an1:[119,113],foot1:[126,116],kn2:[88,102],an2:[73,119],foot2:[66,121]};a=person(c);b=person({...c,wr1:[72,113],wr2:[44,111],an1:[91,116],an2:[122,116]},161)}return base(a+b+arrow(145,102,168,102),scap?'SCAP':mountain?'KNEE DRIVE':crawl?'CRAWL':'PUSH-UP',exName(id))}
  function dipArt(){const top={head:[76,43],sh:[76,56],hip:[76,86],el1:[58,71],wr1:[51,83],el2:[94,71],wr2:[101,83],kn1:[72,116],an1:[72,145]};const bot={...top,head:[76,60],sh:[76,73],hip:[76,103],el1:[55,77],wr1:[51,83],el2:[97,77],wr2:[101,83],kn1:[72,130],an1:[72,153]};return base(person(top)+line(38,84,56,84,'e')+line(96,84,114,84,'e')+person(bot,161)+line(38+161,84,56+161,84,'e')+line(96+161,84,114+161,84,'e')+arrow(145,79,168,95),'DIP',exName('dip'))}
  function rowArt(id,type='cable'){
    let a='',b='';
    if(type==='bar'){
      const st={...HINGE,wr1:[61,109],wr2:[75,109]},fin={...HINGE,el1:[57,75],wr1:[70,85],el2:[78,74],wr2:[88,84]};
      a=person(st)+barbell(38,111,103,111);b=person(fin,161)+barbell(55+161,86,102+161,86);
    }else if(type==='db'){
      // One-arm bench-supported dumbbell row: support hand/knee remain on the bench while the free arm rows toward the hip.
      const st={head:[52,55],sh:[60,67],hip:[86,91],el1:[70,80],wr1:[68,108],el2:[76,75],wr2:[105,88],kn1:[77,111],an1:[69,144],foot1:[60,147],kn2:[105,100],an2:[121,112],foot2:[129,114]};
      const fin={...st,el1:[57,72],wr1:[78,84]};
      const bench=(ox=0)=>rect(92+ox,91,42,8,3,'#fff')+line(101+ox,99,98+ox,143,'e')+line(126+ox,99,131+ox,143,'e');
      a=person(st)+bench(0)+dumbbell(68,108,90);b=person(fin,161)+bench(161)+dumbbell(78+161,84,90);
    }else if(type==='inv'){
      const st={head:[43,82],sh:[57,82],hip:[88,90],el1:[52,65],wr1:[55,48],el2:[63,65],wr2:[66,48],kn1:[115,94],an1:[139,101]};
      const fin={...st,head:[50,61],sh:[63,63],hip:[94,80],el1:[55,63],wr1:[55,48],el2:[70,63],wr2:[66,48]};
      a=person(st)+line(31,46,105,46,'e');b=person(fin,161)+line(31+161,46,105+161,46,'e');
    }else if(type==='machine'){
      // Chest-supported selectorized row: pad, lever arms and handles are visually distinct from a low cable row.
      const st={head:[55,55],sh:[61,68],hip:[65,101],el1:[76,77],wr1:[101,78],el2:[75,88],wr2:[100,90],kn1:[91,108],an1:[109,130],foot1:[118,131]};
      const fin={...st,el1:[70,75],wr1:[76,82],el2:[70,87],wr2:[76,94]};
      const machine=(ox=0)=>rect(35+ox,105,65,8,3,'#fff')+rect(55+ox,69,12,31,4,'#fff')+line(120+ox,42,120+ox,140,'e')+line(100+ox,79,120+ox,70,'e')+line(100+ox,91,120+ox,99,'e')+circle(120+ox,70,5,'e')+circle(120+ox,99,5,'e');
      a=person(st)+machine(0);b=person(fin,161)+machine(161);
    }else{
      // Seated low cable row: visible cable stack, cable line and foot plate.
      const st={head:[55,57],sh:[61,70],hip:[68,100],el1:[77,80],wr1:[102,82],el2:[74,87],wr2:[101,89],kn1:[93,107],an1:[112,124],foot1:[121,125]};
      const fin={...st,el1:[72,78],wr1:[76,88],el2:[72,89],wr2:[77,95]};
      const cable=(ox=0,handleX=102)=>rect(33+ox,104,66,8,3,'#fff')+line(119+ox,43,119+ox,139,'e')+rect(113+ox,52,12,52,2,'#fff')+line(119+ox,82,handleX+ox,86,'e')+path(`M91 ${116}l12 12 12-12`,'e');
      a=person(st)+cable(0,102);b=person(fin,161)+cable(161,77);
    }
    const badge=type==='bar'?'BARBELL ROW':type==='db'?'1-ARM DB':type==='inv'?'INVERTED':type==='machine'?'ROW MACHINE':'CABLE ROW';
    return base(a+b+arrow(145,86,168,86),badge,exName(id));
  }
  function latpullArt(){const st={head:[76,52],sh:[76,65],hip:[76,98],el1:[59,52],wr1:[48,34],el2:[93,52],wr2:[104,34],kn1:[62,119],an1:[58,145],kn2:[90,119],an2:[94,145]};const fin={...st,el1:[58,66],wr1:[59,76],el2:[94,66],wr2:[93,76]};return base(person(st)+line(42,31,110,31,'e')+line(126,25,126,141,'e')+person(fin,161)+line(42+161,31,110+161,31,'e')+line(126+161,25,126+161,141,'e')+arrow(145,54,168,73),'LAT PULL',exName('latpull'))}
  function lateralArt(id,reverse=false,face=false,fly=false,cable=false){let st=STAND,fin=LATERAL_END;if(reverse){st={...HINGE,el1:[65,79],wr1:[63,99],el2:[79,77],wr2:[77,98]};fin={...st,el1:[48,72],wr1:[27,70],el2:[95,71],wr2:[116,69]}}if(face){st={...STAND,el1:[60,67],wr1:[44,64],el2:[92,67],wr2:[108,64]};fin={...STAND,el1:[58,58],wr1:[68,53],el2:[94,58],wr2:[84,53]}}if(fly){st={...STAND,el1:[55,63],wr1:[46,72],el2:[97,63],wr2:[106,72]};fin={...STAND,el1:[62,69],wr1:[70,69],el2:[90,69],wr2:[82,69]}}let a=person(st),b=person(fin,161);if(id==='lateral'){a+=dumbbell(61,94,90)+dumbbell(91,94,90);b+=dumbbell(28+161,61)+dumbbell(124+161,61)}if(reverse){a+=rect(16,45,17,83,4,'none')+rect(119,45,17,83,4,'none');b+=rect(16+161,45,17,83,4,'none')+rect(119+161,45,17,83,4,'none')}if(face||cable){a+=line(19,61,44,64,'e');b+=line(19+161,61,68+161,53,'e')}return base(a+b+arrow(145,69,168,62),face?'FACE PULL':reverse?'REVERSE FLY':fly?'FLY':'LATERAL',exName(id))}
  function armArt(id,type='curl',machine=false){const st=type==='triceps'?TRICEPS_START:STAND,fin=type==='triceps'?TRICEPS_END:CURL_END;let a=person(st),b=person(fin,161);if(type==='curl'){if(machine){a+=rect(38,84,76,10,5,'#fff')+line(50,94,45,138,'e');b+=rect(38+161,84,76,10,5,'#fff')+line(50+161,94,45+161,138,'e')}else{a+=dumbbell(61,94,90)+dumbbell(91,94,90);b+=dumbbell(67+161,57,90)+dumbbell(85+161,57,90)}}else{a+=line(76,20,76,52,'e')+line(61,55,76,52,'e')+line(91,55,76,52,'e');b+=line(76+161,20,76+161,52,'e')+line(61+161,94,76+161,52,'e')+line(91+161,94,76+161,52,'e')}return base(a+b+arrow(145,72,168,72),machine?'MACHINE':type==='triceps'?'CABLE':'DB',exName(id))}
  function hipThrustArt(id='hipthrust'){const st={head:[44,83],sh:[57,86],hip:[86,113],el1:[55,101],wr1:[76,111],kn1:[111,102],an1:[126,132],foot1:[138,133]};const fin={...st,hip:[88,86],kn1:[112,104],an1:[126,133],head:[44,82],sh:[57,85],wr1:[77,87]};let a=person(st)+rect(27,88,35,9,3,'#fff')+barbell(65,112,109,112),b=person(fin,161)+rect(27+161,88,35,9,3,'#fff')+barbell(65+161,88,109+161,88);return base(a+b+arrow(145,112,168,88),'HIP THRUST',exName(id))}
  function legMachineArt(id,type){let a='',b='';if(type==='curlLie'){const st={head:[39,93],sh:[53,94],hip:[84,101],el1:[50,110],wr1:[66,113],kn1:[108,103],an1:[132,106],foot1:[141,107]};const fin={...st,kn1:[106,103],an1:[108,78],foot1:[110,70]};a=person(st)+rect(28,108,90,8,3,'#fff')+circle(132,110,7,'e');b=person(fin,161)+rect(28+161,108,90,8,3,'#fff')+circle(108+161,74,7,'e')}else{const st={head:[49,56],sh:[56,69],hip:[64,99],el1:[49,81],wr1:[47,98],kn1:[91,104],an1:[114,120],foot1:[122,121]};const fin=JSON.parse(JSON.stringify(st));if(type==='curlSeat'){fin.an1=[82,131];fin.foot1=[78,137]}else if(type==='ext'){fin.kn1=[91,104];fin.an1=[126,104];fin.foot1=[135,104]}else if(type==='calfSeat'){fin.an1=[115,112];fin.foot1=[126,106]}a=person(st)+rect(35,104,62,8,3,'#fff')+circle(113,125,7,'e');b=person(fin,161)+rect(35+161,104,62,8,3,'#fff')+circle((type==='ext'?128:type==='curlSeat'?83:116)+161,(type==='ext'?108:type==='curlSeat'?134:116),7,'e')}return base(a+b+arrow(145,108,168,101),type==='curlLie'?'LYING CURL':type==='curlSeat'?'SEATED CURL':type==='ext'?'LEG EXT':'CALF PRESS',exName(id))}
  function kickbackArt(){const st={head:[48,58],sh:[55,70],hip:[76,91],el1:[45,82],wr1:[39,102],el2:[61,82],wr2:[56,102],kn1:[73,117],an1:[70,146],foot1:[61,149],kn2:[96,117],an2:[99,146],foot2:[108,149]};const fin={...st,kn2:[110,96],an2:[134,88],foot2:[142,88]};return base(person(st)+line(18,42,18,142,'e')+line(18,122,99,146,'e')+person(fin,161)+line(18+161,42,18+161,142,'e')+line(18+161,122,134+161,88,'e')+arrow(145,113,168,91),'KICKBACK',exName('kickback'))}
  function backExtArt(){const st={head:[49,57],sh:[58,69],hip:[85,94],el1:[57,84],wr1:[70,92],kn1:[104,113],an1:[128,123]};const fin={head:[55,84],sh:[66,91],hip:[88,96],el1:[66,106],wr1:[78,108],kn1:[105,113],an1:[128,123]};return base(person(st)+path('M76 98l21 8 25 23M93 105l-9 34','e')+person(fin,161)+path('M237 98l21 8 25 23M254 105l-9 34','e')+arrow(145,79,168,91),'BACK EXT',exName('backext'))}
  function calfArt(id,tib=false){let a=person(STAND),b=person({...STAND,an1:[63,141],foot1:[55,144],an2:[90,141],foot2:[98,144]},161);if(tib){const st={...STAND,sh:[76,59],hip:[76,92],an1:[63,147],foot1:[55,150],an2:[90,147],foot2:[98,150]};const fin={...st,foot1:[51,141],foot2:[102,141]};a=person(st)+line(115,34,115,151,'e');b=person(fin,161)+line(115+161,34,115+161,151,'e')}else{a+=line(36,152,116,152,'e');b+=line(36+161,152,116+161,152,'e')}return base(a+b+arrow(145,146,168,137),tib?'TOES UP':'HEEL UP',exName(id))}
  function coreArt(id,type){let a='',b='';if(type==='plank'){a=person(PLANK);b=person(PLANK,161)}else if(type==='side'){const p={head:[41,86],sh:[57,88],hip:[91,94],el1:[55,106],wr1:[55,122],el2:[58,69],wr2:[58,48],kn1:[118,98],an1:[141,102]};a=person(p);b=person(p,161)}else if(type==='deadbug'){const st={head:[44,101],sh:[58,101],hip:[86,106],el1:[55,80],wr1:[55,60],el2:[69,80],wr2:[69,60],kn1:[90,82],an1:[108,82],kn2:[94,92],an2:[112,92]};const fin={...st,wr1:[35,128],an2:[137,113]};a=person(st);b=person(fin,161)}else if(type==='birddog'){const st={head:[42,75],sh:[58,80],hip:[90,87],el1:[55,99],wr1:[49,120],el2:[68,99],wr2:[67,120],kn1:[104,107],an1:[100,128],kn2:[85,108],an2:[83,129]};const fin={...st,wr1:[25,70],el1:[43,75],kn2:[114,88],an2:[142,86]};a=person(st);b=person(fin,161)}else if(type==='hollow'){const st={head:[42,110],sh:[56,111],hip:[83,115],el1:[50,94],wr1:[40,79],el2:[62,94],wr2:[53,78],kn1:[108,105],an1:[135,98]};const fin={...st,wr1:[28,93],wr2:[35,83],an1:[137,86]};a=person(st);b=person(fin,161)}else if(type==='legraise'){const st={head:[39,110],sh:[53,112],hip:[82,114],el1:[50,127],wr1:[69,129],kn1:[108,115],an1:[139,115]};const fin={...st,kn1:[94,86],an1:[92,55]};a=person(st);b=person(fin,161)}else if(type==='bridge'){const st={head:[37,111],sh:[52,113],hip:[81,123],kn1:[104,105],an1:[122,132],foot1:[135,133]};const fin={...st,hip:[81,94],kn1:[104,105]};a=person(st);b=person(fin,161)}else if(type==='situp'){const st={head:[40,113],sh:[54,115],hip:[83,121],el1:[51,98],wr1:[64,88],kn1:[105,103],an1:[127,127]};const fin={head:[68,65],sh:[72,79],hip:[84,118],el1:[61,86],wr1:[72,93],kn1:[105,103],an1:[127,127]};a=person(st);b=person(fin,161)}return base(a+b+(type==='plank'||type==='side'?text(160,87,lang()==='de'?'HALTEN':'HOLD','middle',10,C.accent,900):arrow(145,101,168,91)),type.toUpperCase(),exName(id))}
  function handstandArt(id,negative=false,pike=false){if(pike){const st={head:[52,104],sh:[61,95],hip:[90,65],el1:[58,113],wr1:[55,130],el2:[66,113],wr2:[65,130],kn1:[112,90],an1:[134,111]};const fin={...st,head:[55,121],sh:[63,109],el1:[52,121],wr1:[55,130],el2:[70,121],wr2:[65,130]};return base(person(st)+person(fin,161)+arrow(145,104,168,118),'PIKE',exName(id))}const top={head:[110,119],sh:[110,104],hip:[110,72],el1:[99,119],wr1:[94,138],el2:[121,119],wr2:[126,138],kn1:[110,47],an1:[110,25]};const bot={...top,head:[110,137],sh:[110,119],el1:[96,125],wr1:[94,138],el2:[124,125],wr2:[126,138]};return base(line(132,19,132,154,'e')+person(top)+line(132+161,19,132+161,154,'e')+person(bot,161)+arrow(145,102,168,118),negative?'NEGATIVE':'HSPU',exName(id))}
  function handstandHoldArt(id){const p={head:[110,119],sh:[110,104],hip:[110,72],el1:[99,119],wr1:[94,138],el2:[121,119],wr2:[126,138],kn1:[110,47],an1:[110,25]};return base(line(132,19,132,154,'e')+person(p)+line(132+161,19,132+161,154,'e')+person(p,161)+text(160,87,lang()==='de'?'HALTEN':'HOLD','middle',10,C.accent,900),'HANDSTAND',exName(id))}
  function crossfitArt(id,type){if(type==='thruster')return base(person(SQUAT)+barbell(47,70,105,70)+person(OHP_END,161)+barbell(44+161,27,108+161,27)+arrow(145,96,168,55),'THRUSTER',exName(id));if(type==='pushpress'){const dip={...STAND,hip:[76,98],kn1:[65,126],kn2:[87,126]};return base(person(dip)+barbell(44,62,108,62)+person(OHP_END,161)+barbell(44+161,27,108+161,27)+arrow(145,76,168,46),'PUSH PRESS',exName(id))}if(type==='swing'){const st={...HINGE,wr1:[73,111],wr2:[78,111]},fin={...STAND,el1:[57,65],wr1:[44,52],el2:[95,65],wr2:[108,52]};return base(person(st)+circle(75,118,8,'e')+person(fin,161)+circle(76+161,51,8,'e')+arrow(145,111,168,55),'KB SWING',exName(id))}if(type==='clean'){return base(person(DL_START)+barbell(44,123,108,123)+person({...STAND,el1:[58,67],wr1:[69,63],el2:[94,67],wr2:[83,63]},161)+barbell(49+161,64,103+161,64)+arrow(145,101,168,65),'CLEAN',exName(id))}if(type==='snatch'){return base(person(DL_START)+barbell(44,123,108,123)+person({...OHP_END,wr1:[46,27],wr2:[106,27]},161)+barbell(36+161,27,116+161,27)+arrow(145,100,168,42),'SNATCH',exName(id))}if(type==='wallball'){return base(person(SQUAT)+circle(76,69,9,'e')+line(125,24,125,68,'e')+rect(116,25,18,18,2,'none',C.warn)+person(STAND,161)+circle(115+161,40,9,'e')+line(125+161,24,125+161,68,'e')+rect(116+161,25,18,18,2,'none',C.warn)+arrow(145,92,168,50),'WALL BALL',exName(id))}if(type==='box'){const st={...STAND,hip:[76,100],kn1:[65,127],kn2:[88,127]},fin={...SQUAT,hip:[76,85],kn1:[64,104],an1:[61,121],foot1:[52,123],kn2:[90,104],an2:[93,121],foot2:[102,123]};return base(person(st)+rect(107,105,35,44,3,'#fff')+person(fin,161)+rect(107+161,105,35,44,3,'#fff')+arrow(145,108,168,84),'BOX JUMP',exName(id))}if(type==='farmer'){return base(person(STAND)+dumbbell(61,96,90)+dumbbell(91,96,90)+person({...STAND,kn1:[62,122],an1:[56,145],kn2:[91,117],an2:[101,139]},161)+dumbbell(61+161,96,90)+dumbbell(91+161,96,90)+arrow(145,126,168,126),'FARMER',exName(id))}if(type==='sled'){const p={...STAND,sh:[70,67],hip:[86,94],el1:[77,77],wr1:[105,83],el2:[80,84],wr2:[105,90],kn1:[76,120],an1:[63,145],kn2:[100,119],an2:[111,143]};return base(person(p)+path('M105 82l25 15v38M112 135h24','e')+person(p,161)+path('M266 82l25 15v38M273 135h24','e')+arrow(145,110,168,110),'SLED PUSH',exName(id))}if(type==='burpee'){return base(person(PUSH_BOTTOM)+person({...STAND,an1:[63,139],an2:[90,139]},161)+arrow(145,112,168,72),'BURPEE',exName(id))}return null}
  function rehabArt(id,type){if(type==='shortfoot'){const foot=(ox,raised)=>`${path(`M${26+ox} 100C45 ${raised?82:91} 68 ${raised?84:95} 89 103C104 110 123 109 137 105`,'p')}<circle cx="${36+ox}" cy="106" r="4" fill="${C.ink}"/><circle cx="${126+ox}" cy="109" r="4" fill="${C.ink}"/>${raised?path(`M${43+ox} 99Q66 75 ${90+ox} 99`,'a'):''}`;return base(foot(0,false)+foot(161,true)+arrow(145,103,168,97),'ARCH',exName(id))}if(type==='toeyoga'){const toe=(ox,big)=>`${path(`M${48+ox} 126C38 105 39 74 59 55C79 38 105 52 111 79C117 103 104 130 83 138C68 143 54 138 48 126Z`,'e')}<circle cx="${54+ox}" cy="52" r="7" fill="${big?C.accent:C.line}"/><circle cx="${66+ox}" cy="45" r="5" fill="${big?C.line:C.accent}"/><circle cx="${77+ox}" cy="44" r="4.5" fill="${big?C.line:C.accent}"/><circle cx="${87+ox}" cy="47" r="4" fill="${big?C.line:C.accent}"/><circle cx="${96+ox}" cy="53" r="3.5" fill="${big?C.line:C.accent}"/>`;return base(toe(0,true)+toe(161,false)+arrow(145,83,168,83),'TOE YOGA',exName(id))}if(type==='balance'){const p={...STAND,kn2:[89,105],an2:[78,111],foot2:[71,111]};return base(person(p)+line(34,151,118,151,'e')+person(p,161)+line(34+161,151,118+161,151,'e')+text(160,87,lang()==='de'?'HÜFTE LEVEL':'HIPS LEVEL','middle',8,C.accent,900),'1 LEG',exName(id))}if(type==='kneewall'){const st={...LUNGE,head:[64,50],sh:[64,63],hip:[69,94],kn1:[48,119],an1:[43,147],foot1:[34,150],kn2:[96,120],an2:[111,147],foot2:[120,150]};const fin={...st,kn1:[33,108],an1:[43,147],foot1:[34,150]};return base(line(27,35,27,153,'e')+person(st)+line(27+161,35,27+161,153,'e')+person(fin,161)+arrow(145,119,168,109),'HEEL DOWN',exName(id))}if(type==='band'){const a=person({...SQUAT,hip:[76,95],kn1:[64,122],kn2:[88,122]});const b=person({...SQUAT,hip:[76,95],kn1:[52,120],an1:[39,146],foot1:[30,149],kn2:[92,122]},161);return base(a+path('M58 119Q76 128 94 119','e')+b+path('M213 117Q235 130 258 120','e')+arrow(145,123,168,123),'BAND WALK',exName(id))}if(type==='isoer'||type==='isoir'){const outward=type==='isoer';const p={...STAND,el1:[58,73],wr1:[58,92],el2:[94,73],wr2:[94,92]};let a=person(p),b=person(p,161);const wallX=outward?35:118;a+=line(wallX,52,wallX,112,'e')+arrow(outward?57:95,87,outward?39:113,87);b+=line(wallX+161,52,wallX+161,112,'e')+arrow(outward?218:256,87,outward?200:274,87);return base(a+b,type==='isoer'?'ISO ER':'ISO IR',exName(id))}if(type==='scappull'){return pullupArt(id,false,false,false,true)}if(type==='catcow'){const cow={head:[43,75],sh:[58,80],hip:[95,81],el1:[55,102],wr1:[50,124],el2:[68,102],wr2:[68,124],kn1:[103,103],an1:[99,125],kn2:[87,103],an2:[84,125]};const cat={...cow,sh:[58,87],hip:[95,88],head:[43,91]};return base(person(cow)+path('M58 80Q76 67 95 81','a')+person(cat,161)+path('M219 87Q237 103 256 88','a')+arrow(145,84,168,84),'CAT↔COW',exName(id))}if(type==='trot'){const q={head:[47,60],sh:[58,70],hip:[83,97],el1:[57,88],wr1:[48,112],el2:[69,87],wr2:[70,111],kn1:[96,113],an1:[94,139],kn2:[77,114],an2:[75,139]};const e={...q,el2:[83,63],wr2:[105,52]};return base(person(q)+person(e,161)+path('M215 57Q244 35 274 56','a')+arrow(271,55,281,64),'T-SPINE',exName(id))}if(type==='9090'){const s1=`${circle(70,62,6,'p')}<path class="p" d="M70 69v27M70 96L46 112l-19-5M70 96l23 16 18-5M63 82l-17 1M77 82l17 1"/>`;const s2=`${circle(70+161,62,6,'p')}<path class="p" d="M231 69v27M231 96l23 16 18-5M231 96l-24 16-19-5M224 82l-17 1M238 82l17 1"/>`;return base(s1+s2+arrow(145,108,168,108),'90/90',exName(id))}if(type==='cossack'){return lungeArt(id,false,false)}if(type==='deep'){return base(person(SQUAT)+person(SQUAT,161)+text(160,87,lang()==='de'?'HALTEN':'HOLD','middle',10,C.accent,900),'DEEP SQUAT',exName(id))}return null}
  function sportArt(id,fam){const badge=visualBadge(id);let icon='';if(fam==='run'){icon=`<circle cx="76" cy="61" r="7" class="p"/><path class="p" d="M76 68L64 91l20 8 21-17M64 91l-20 27M84 99l25 24M70 77l26-8"/>`;}
    else if(fam==='swim'){icon=`<circle cx="66" cy="79" r="7" class="p"/><path class="p" d="M73 83l37 10M61 85L31 103"/><path class="e" d="M22 127c14-8 28-8 42 0s28 8 42 0 28-8 42 0"/>`;}
    else if(fam==='bike'){icon=`<circle cx="51" cy="111" r="24" class="e"/><circle cx="112" cy="111" r="24" class="e"/><path class="e" d="M51 111l27-45 18 45H51l23-26h28M78 66h17"/><circle cx="80" cy="49" r="7" class="p"/><path class="p" d="M80 56l-8 25 26 5M72 81l-8 28M98 86l10 22"/>`;}
    else if(fam==='skate'){icon=`<circle cx="69" cy="55" r="7" class="p"/><path class="p" d="M69 62L58 88l23 10 23-18M58 88l-23 28M81 98l24 14"/><path class="e" d="M26 128h42M80 128h42"/><circle cx="36" cy="134" r="3"/><circle cx="55" cy="134" r="3"/><circle cx="92" cy="134" r="3"/><circle cx="111" cy="134" r="3"/>`;}
    else if(fam==='row'){icon=`<circle cx="59" cy="59" r="7" class="p"/><path class="p" d="M59 66l13 24-19 22M72 90l42 19M53 112h63"/><path class="e" d="M43 124h88M84 93l31-29"/>`;}
    else{icon=`<circle cx="67" cy="51" r="7" class="p"/><path class="p" d="M67 58l-8 31 18 14M60 89l-21 35M77 103l18 21M84 67l10 25M99 86v48"/><path class="e" d="M26 128l22-31 15 14 18-28 32 45"/>`;}
    const protocol=esc(exName(id));const first=`<g transform="translate(0 0)">${icon}</g>`,second=`<g transform="translate(161 0)">${icon}</g>`;return base(first+second+text(79,151,badge,'middle',11,C.accent,950)+text(240,151,badge,'middle',11,C.accent,950),badge,protocol)}
  const handlers={
    bench_bar:()=>benchArt('bar'),bench_db:()=>benchArt('db'),incline_db:()=>benchArt('incline'),
    ohp_bar:()=>pressArt('ohp_bar','bar'),ohp_db:()=>pressArt('ohp_db','db'),shoulder_machine:()=>pressArt('shoulder_machine','machine'),
    backsquat:()=>squatArt('backsquat','back'),frontsquat:()=>squatArt('frontsquat','front'),goblet:()=>squatArt('goblet','goblet'),air_squat:()=>squatArt('air_squat','none'),deep:()=>rehabArt('deep','deep'),
    legpress:()=>machinePushArt('legpress','legpress'),hacksquat:()=>machinePushArt('hacksquat','hack'),
    lunge:()=>lungeArt('lunge'),bulgarian:()=>lungeArt('bulgarian',true),rot_lunge:()=>lungeArt('rot_lunge',false,true),cossack:()=>cossackArt(),
    rdl:()=>hingeArt('rdl'),deadlift:()=>hingeArt('deadlift',true),slrdl:()=>hingeArt('slrdl',false,true),
    pullup:()=>pullupArt('pullup'),chinup:()=>pullupArt('chinup',true),muscleup:()=>pullupArt('muscleup',false,true),toesbar:()=>pullupArt('toesbar',false,false,true),scappull:()=>pullupArt('scappull',false,false,false,true),
    pushup:()=>pushupArt('pushup'),scappush:()=>pushupArt('scappush',true),mountain_climber:()=>pushupArt('mountain_climber',false,true),bear_crawl:()=>pushupArt('bear_crawl',false,false,true),side_crawl:()=>pushupArt('side_crawl',false,false,true),
    dip:()=>dipArt(),latpull:()=>latpullArtV11(),row_cable:()=>rowArt('row_cable','cable'),row_machine:()=>rowArt('row_machine','machine'),row_bar:()=>rowArt('row_bar','bar'),row_db:()=>rowArt('row_db','db'),invrow:()=>rowArt('invrow','inv'),
    lateral:()=>lateralArt('lateral'),reverse_fly:()=>reverseFlyMachineArt(),facepull:()=>lateralArt('facepull',false,true),cable_fly:()=>lateralArt('cable_fly',false,false,true,true),fly_machine:()=>pecDeckArt(),
    triceps:()=>armArt('triceps','triceps'),curl_db:()=>armArt('curl_db','curl',false),curl_machine:()=>armArt('curl_machine','curl',true),
    hipthrust:()=>hipThrustArt(),glute_bridge:()=>coreArt('glute_bridge','bridge'),legcurl:()=>legMachineArt('legcurl','curlLie'),legcurl_seat:()=>legMachineArt('legcurl_seat','curlSeat'),legext:()=>legMachineArt('legext','ext'),calf_press_seated:()=>legMachineArt('calf_press_seated','calfSeat'),kickback:()=>kickbackArt(),backext:()=>backExtArt(),calf:()=>calfMachineArt(),tibraise:()=>calfArt('tibraise',true),
    plank:()=>coreArt('plank','plank'),sideplank:()=>coreArt('sideplank','side'),reverse_plank:()=>reversePlankArt(),deadbug:()=>coreArt('deadbug','deadbug'),birddog:()=>coreArt('birddog','birddog'),hollow:()=>coreArt('hollow','hollow'),legraise:()=>coreArt('legraise','legraise'),situp:()=>coreArt('situp','situp'),crunch_machine:()=>crunchMachineArt(),
    hspu:()=>hspuArtV11('hspu'),hspu_negative:()=>hspuArtV11('hspu_negative',true),handstand:()=>handstandHoldArtV11('handstand',false),wall_handstand:()=>handstandHoldArtV11('wall_handstand',true),pike:()=>handstandArt('pike',false,true),
    thruster:()=>crossfitArt('thruster','thruster'),pushpress:()=>crossfitArt('pushpress','pushpress'),kbswing:()=>crossfitArt('kbswing','swing'),clean:()=>crossfitArt('clean','clean'),snatch:()=>crossfitArt('snatch','snatch'),wallball:()=>crossfitArt('wallball','wallball'),boxjump:()=>boxJumpArtV11(),farmer:()=>crossfitArt('farmer','farmer'),sled:()=>crossfitArt('sled','sled'),burpee:()=>burpeeArtV11(),
    shortfoot:()=>rehabArt('shortfoot','shortfoot'),toeyoga:()=>rehabArt('toeyoga','toeyoga'),balance:()=>rehabArt('balance','balance'),kneewall:()=>rehabArt('kneewall','kneewall'),bandwalk:()=>rehabArt('bandwalk','band'),isoer:()=>shoulderIsoArt('isoer',true),isoir:()=>shoulderIsoArt('isoir',false),catcow:()=>rehabArt('catcow','catcow'),trot:()=>rehabArt('trot','trot'),'9090':()=>rehabArt('9090','9090'),
  };


  function reverseFlyMachineArt(){
    const st={head:[55,54],sh:[61,67],hip:[65,100],el1:[49,69],wr1:[37,78],el2:[73,69],wr2:[85,78],kn1:[91,108],an1:[109,130],foot1:[118,131]};
    const fin={...st,el1:[44,66],wr1:[24,65],el2:[78,66],wr2:[98,65]};
    const machine=(ox=0)=>rect(38+ox,104,58,8,3,'#fff')+line(30+ox,43,30+ox,139,'e')+line(92+ox,43,92+ox,139,'e')+rect(57+ox,65,12,31,4,'#fff');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,68,168,68),'REAR DELT',exName('reverse_fly'));
  }
  function cossackArt(){
    const st=STAND;
    const end={head:[76,54],sh:[76,67],hip:[70,105],el1:[58,77],wr1:[47,85],el2:[89,77],wr2:[101,85],kn1:[48,118],an1:[41,146],foot1:[31,149],kn2:[108,109],an2:[134,111],foot2:[143,111]};
    return base(person(st)+person(end,161)+arrow(145,91,168,103),'COSSACK',exName('cossack'));
  }
  function shoulderIsoArt(id,external){
    const st={head:[76,48],sh:[76,61],hip:[76,94],el1:[59,77],wr1:[74,77],el2:[93,77],wr2:[78,77],kn1:[66,122],an1:[63,148],foot1:[54,150],kn2:[87,122],an2:[90,148],foot2:[99,150]};
    const wallX=external?42:111;
    const contactX=external?59:93;
    let one=person(st)+line(wallX,48,wallX,108,'e')+arrow(contactX,77,external?45:108,77);
    let two=person(st,161)+line(wallX+161,48,wallX+161,108,'e')+arrow(contactX+161,77,external?206:269,77);
    return base(one+two,external?'ISO ER':'ISO IR',exName(id));
  }
  function latpullArtV11(){
    const st={head:[76,50],sh:[76,63],hip:[76,96],el1:[59,51],wr1:[48,33],el2:[93,51],wr2:[104,33],kn1:[61,118],an1:[58,143],foot1:[49,146],kn2:[91,118],an2:[94,143],foot2:[103,146]};
    const fin={...st,el1:[58,65],wr1:[61,76],el2:[94,65],wr2:[91,76]};
    const machine=(ox=0)=>line(127+ox,24,127+ox,147,'e')+line(42+ox,30,110+ox,30,'e')+rect(47+ox,99,58,7,3,'#fff')+rect(54+ox,110,44,6,3,'#fff');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,53,168,73),'LAT PULL',exName('latpull'));
  }
  function calfMachineArt(){
    const st=STAND,fin={...STAND,an1:[63,140],foot1:[55,143],an2:[90,140],foot2:[98,143]};
    const machine=(ox=0)=>line(31+ox,30,31+ox,148,'e')+line(31+ox,57,60+ox,57,'e')+line(31+ox,57,92+ox,57,'e')+rect(53+ox,145,50,7,2,'#fff');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,145,168,137),'CALF RAISE',exName('calf'));
  }
  function hspuArtV11(id,negative=false){
    const top={head:[92,118],sh:[92,103],hip:[92,70],el1:[80,118],wr1:[74,139],el2:[104,118],wr2:[110,139],kn1:[92,45],an1:[92,22],foot1:[88,17]};
    const bottom={...top,head:[92,138],sh:[92,120],el1:[77,127],wr1:[74,139],el2:[107,127],wr2:[110,139]};
    return base(person(top)+person(bottom,161)+arrow(145,103,168,120),negative?'NEGATIVE':'HSPU',exName(id));
  }
  function boxJumpArtV11(){
    const prep={head:[61,52],sh:[67,65],hip:[73,99],el1:[50,80],wr1:[40,93],el2:[84,80],wr2:[95,93],kn1:[60,124],an1:[55,148],foot1:[46,150],kn2:[87,124],an2:[92,148],foot2:[101,150]};
    const land={head:[83,47],sh:[83,60],hip:[83,90],el1:[66,74],wr1:[57,85],el2:[100,74],wr2:[109,85],kn1:[72,108],an1:[68,126],foot1:[60,128],kn2:[96,108],an2:[100,126],foot2:[108,128]};
    return base(person(prep)+rect(102,116,40,34,2,'#fff')+person(land,161)+rect(215,128,70,22,2,'#fff')+arrow(145,120,168,94),'BOX JUMP',exName('boxjump'));
  }
  function burpeeArtV11(){
    const floor=PUSH_BOTTOM;
    const jump={head:[76,35],sh:[76,48],hip:[76,81],el1:[59,39],wr1:[51,25],el2:[93,39],wr2:[101,25],kn1:[66,108],an1:[62,134],foot1:[53,136],kn2:[87,108],an2:[91,134],foot2:[100,136]};
    return base(person(floor)+line(24,132,144,132,'e')+person(jump,161)+line(185,151,305,151,'e')+arrow(145,111,168,69),'BURPEE',exName('burpee'));
  }

  function chestPressMachineArt(){
    const st={head:[53,58],sh:[59,71],hip:[64,101],el1:[80,73],wr1:[103,74],el2:[78,84],wr2:[103,86],kn1:[91,108],an1:[109,130],foot1:[118,131]};
    const fin={...st,el1:[91,73],wr1:[122,74],el2:[89,84],wr2:[122,86]};
    const machine=(ox=0)=>rect(31+ox,104,66,8,3,'#fff')+line(35+ox,104,28+ox,143,'e')+line(119+ox,43,119+ox,135,'e')+line(103+ox,74,119+ox,74,'e')+line(103+ox,86,119+ox,86,'e');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,80,168,80),'CHEST PRESS',exName('chest_press'));
  }
  function pecDeckArt(){
    const st={head:[55,55],sh:[61,68],hip:[66,100],el1:[47,68],wr1:[38,83],el2:[75,68],wr2:[84,83],kn1:[91,108],an1:[109,130],foot1:[118,131]};
    const fin={...st,el1:[57,73],wr1:[68,79],el2:[65,73],wr2:[54,79]};
    const machine=(ox=0)=>rect(35+ox,104,61,8,3,'#fff')+line(31+ox,104,27+ox,143,'e')+line(112+ox,42,112+ox,137,'e')+line(39+ox,80,31+ox,67,'e')+line(83+ox,80,91+ox,67,'e');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,81,168,81),'PEC DECK',exName('fly_machine'));
  }
  function reversePlankArt(){
    const p={head:[41,95],sh:[55,96],hip:[88,91],el1:[52,112],wr1:[48,131],el2:[62,112],wr2:[66,131],kn1:[116,92],an1:[142,92],foot1:[149,92]};
    return base(person(p)+line(24,139,148,139,'e')+person(p,161)+line(185,139,309,139,'e')+text(160,87,lang()==='de'?'HÜFTE HOCH':'HIPS UP','middle',9,C.accent,900),'REVERSE PLANK',exName('reverse_plank'));
  }
  function crunchMachineArt(){
    const st={head:[55,53],sh:[61,66],hip:[68,99],el1:[77,72],wr1:[91,72],el2:[75,84],wr2:[89,84],kn1:[91,107],an1:[110,128],foot1:[119,129]};
    const fin={...st,head:[67,73],sh:[71,84],hip:[70,103],el1:[79,86],wr1:[89,88],el2:[76,96],wr2:[87,98]};
    const machine=(ox=0)=>rect(35+ox,105,62,8,3,'#fff')+line(29+ox,49,29+ox,139,'e')+line(89+ox,72,111+ox,58,'e')+circle(93+ox,72,6,'e');
    return base(person(st)+machine(0)+person(fin,161)+machine(161)+arrow(145,76,168,88),'AB CRUNCH',exName('crunch_machine'));
  }
  function handstandHoldArtV11(id,wall){
    const p={head:[110,119],sh:[110,104],hip:[110,72],el1:[99,119],wr1:[94,138],el2:[121,119],wr2:[126,138],kn1:[110,47],an1:[110,25],foot1:[105,20]};
    const wallSvg=wall?line(132,18,132,154,'e'):'';
    return base(wallSvg+person(p)+(wall?line(293,18,293,154,'e'):'')+person(p,161)+text(160,87,lang()==='de'?'HALTEN':'HOLD','middle',10,C.accent,900),wall?'WALL HS':'HANDSTAND',exName(id));
  }
  function emomArt(id){
    const ids=id==='emom_push_squat_mc'?['pushup','air_squat','mountain_climber']:id==='emom_pull_squat_hollow_push'?['pullup','air_squat','hollow','pushup']:['pushup','legraise','burpee'];
    const icons=ids.slice(0,4).map((x,i)=>`<g transform="translate(${20+i*31} 45) scale(.18)">${(handlers[x]?handlers[x]():base('',x,x)).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`).join('');
    return `<svg viewBox="0 0 320 180" role="img" aria-label="${esc(exName(id))}"><rect width="320" height="180" rx="18" fill="#f7f9fc"/><rect x="16" y="18" width="288" height="116" rx="16" fill="#fff0e7"/><circle cx="66" cy="76" r="31" fill="#fff" stroke="${C.warn}" stroke-width="3"/><path d="M66 54v24l15 10" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><text x="122" y="62" font-family="Inter,system-ui" font-size="13" font-weight="900" fill="${C.ink}">EMOM</text><text x="122" y="83" font-family="Inter,system-ui" font-size="10" font-weight="800" fill="${C.muted}">${ids.map(exName).join(' · ').slice(0,36)}</text><text x="122" y="103" font-family="Inter,system-ui" font-size="9" fill="${C.muted}">${lang()==='de'?'jede Minute neuer Block':'new block each minute'}</text><rect x="129" y="142" width="62" height="24" rx="12" fill="#fff" stroke="${C.line}"/>${text(160,158,'EMOM','middle',8,C.ink,900)}</svg>`;
  }

  function compoundSimple(id){
    if(id==='chest_press')return chestPressMachineArt();
    if(id==='landmine_rot'||id==='cable_woodchop'){const p={...STAND,el1:[55,69],wr1:[45,81],el2:[87,68],wr2:[77,79]},q={...STAND,el1:[61,52],wr1:[76,40],el2:[88,56],wr2:[101,49]};return base(person(p)+(id==='landmine_rot'?line(45,81,20,144,'e'):line(17,46,45,81,'e'))+person(q,161)+(id==='landmine_rot'?line(76+161,40,20+161,144,'e'):line(17+161,46,101+161,49,'e'))+arrow(145,82,168,57),id==='landmine_rot'?'LANDMINE':'WOODCHOP',exName(id))}
    if(id==='skater_hop'){const a={...LUNGE,hip:[74,92],kn1:[57,115],an1:[45,139],kn2:[96,103],an2:[112,111]},b={...LUNGE,hip:[76,92],kn1:[94,115],an1:[108,139],kn2:[56,103],an2:[40,111]};return base(person(a)+person(b,161)+arrow(145,110,168,110),'LATERAL HOP',exName(id))}
    if(id.startsWith('emom_'))return emomArt(id);
    return null;
  }
  const ARC_VISUAL_VERSION='12.3';window.ARC_VISUAL_VERSION=ARC_VISUAL_VERSION;
  exerciseArt=window.exerciseArt=function(id){
    try{
      if(handlers[id])return handlers[id]();
      const simple=compoundSimple(id);if(simple)return simple;
      const fam=typeof exerciseFamily==='function'?exerciseFamily(id):'general';
      if(['run','swim','bike','skate','row','hike'].includes(fam))return sportArt(id,fam);
      if(id==='shoulder_machine'||id==='chest_press')return pressArt(id,'machine');
      return base(person(STAND)+person(STAND,161)+text(160,87,lang()==='de'?'SCHEMA':'SCHEMATIC','middle',10,C.accent,900),visualBadge(id),exName(id));
    }catch(err){console.warn('ARC visual fallback',id,err);return `<svg viewBox="0 0 320 180"><rect width="320" height="180" rx="18" fill="#f7f9fc"/>${text(160,90,exName(id),'middle',13,C.ink,900)}</svg>`}
  };
  // Repaint anything already rendered by v10 without changing platform behavior.
  if(typeof renderAll==='function') setTimeout(()=>{try{renderAll()}catch(e){}},0);
})();
